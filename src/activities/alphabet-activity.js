// src/activities/alphabet-activity.js
// †״´״§״· ״§„״­״±ˆ — ״§„†״³״®״© ״§„†‡״§״¦״© ״§„…ˆ״­‘״¯״© (Clean + Fix)
// - „״§ auto-boot: ״³״×״¯״¹‰ ‚״· …† main.js ״¹״¨״± loadAlphabetActivityContent()
// - ״­״§״±״³ ״×‡״¦״© + …†״¹ ״§„״§״²״¯ˆ״§״¬״©
// - ״¬„״¨ ˆ״§״­״¯ ״«… refilter ״¨„״§ refetch ״¹†״¯ ״×״÷״± ״§„„״÷״©/״§„״­״±
// - ״§״×״±״§״¶״§‹ subjects=['animal'] „״×״³״±״¹ ״§„״¨״¯״§״© (‚״§״¨„ „„״×״¹״¯„ …† ״§„ˆ״§״¬‡״©)
// - ״×״´״÷„ ״§„״µˆ״× ״¹†״¯ ״§„״¶״÷״· ״¹„‰ ״§„״§״³…/״§„״µˆ״±״© …״¹ ״¨״¯״§״¦„ ״×„‚״§״¦״© „„…״³״§״±

import { db } from '@/core/db-handler.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { playAudio, stopCurrentAudio } from '@/core/audio-handler.js';

/* ===================== DEBUG ===================== */
const AA_DBG = false; // ג† …ƒ† ״¬״¹„‡ true …״₪‚״×‹״§ „„״×״´״®״µ
const dbg  = (...a)=>{ if (AA_DBG && import.meta.env.DEV) (import.meta.env?.DEV?console.log:()=>null)('[AA]', ...a); };
const dbgt = (title, rows)=>{ if (AA_DBG && import.meta.env.DEV && console.table){ (import.meta.env?.DEV?console.groupCollapsed:()=>null)('[AA] '+title); (import.meta.env?.DEV?console.table:()=>null)(rows); (import.meta.env?.DEV?console.groupEnd:()=>null)(); } };
/* ================================================= */

const LANGS = ['ar','en','he'];
const ALPHABET = {
  ar: ['أ','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','هـ','و','ي'],
  en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  he: ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','ך','כ','ל','ם','מ','ן','נ','ס','ע','ף','פ','ץ','צ','ק','ר','ש','ת'],
};

const SUBJECTS = ['animal','fruit','vegetable','tool','profession','human_body'];
const SUBJECT_ALIASES = { animals:'animal', fruits:'fruit', vegetables:'vegetable', tools:'tool', professions:'profession', body:'human_body', human_body:'human_body' };
const SUBJECT_PLURALS = { animal:'animals', fruit:'fruits', vegetable:'vegetables', tool:'tools', profession:'professions', human_body:'body' };

const DEFAULT_HINTS = {
  imageBases: ['/images','/img','/media/images'],
  audioBases: ['/audio','/media/audio','/sounds'],
  imageExts:  ['webp','jpg','jpeg','png'],
  audioExts:  ['mp3','ogg','wav'],
  placeholderSVG: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" fill="#9ca3af" font-size="22">لا توجد صورة</text></svg>'),
};
const HINTS = (typeof window!=='undefined' && window.ASSET_HINTS) ? { ...DEFAULT_HINTS, ...window.ASSET_HINTS } : DEFAULT_HINTS;

const assetCache = new Map();
const VOICES = ['boy','girl','teacher'];
const VOICE_KEY = 'aa.voice';

const state = {
  lang:'ar',
  letter:'״£',
  subjects:['animal'], // ג† ״¨״¯״£ ״¨…״¬…ˆ״¹״© ˆ״§״­״¯״© „״×״³״±״¹ ״§„״¨״¯״§״©
  items:[],
  filtered:[],
  index:0,
  showDescription:false,
  voice: (typeof localStorage!=='undefined' && localStorage.getItem(VOICE_KEY)) || 'teacher',
  fetchedOnce:false,
};

const ELS = {
  name:null,img:null,desc:null,letterBar:null,count:null,
  btnPrev:null,btnNext:null,btnToggleDesc:null,
  sidebar:null,lettersGrid:null,subjectsWrap:null,langSelect:null,voiceWrap:null,
};

/* ===================== Utilities ===================== */
function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }
function chunk(arr, size){ const out=[]; for(let i=0;i<arr.length;i+=size) out.push(arr.slice(i,i+size)); return out; }
function prefixSlash(p){ if (!p) return ''; return p.startsWith('/') ? p : `/${p}`; }

function normalizeSubjects(list){ return (list||[]).map(s => SUBJECT_ALIASES[s] || s); }
function expandSubjectVariants(wanted){
  const set=new Set();
  for(const s of wanted){ set.add(s); const p=SUBJECT_PLURALS[s]; if(p) set.add(p); }
  if(set.has('human_body')) set.add('body');
  if(set.has('body')) set.add('human_body');
  return [...set];
}
function ensureLang(lang){
  const prev = state.lang;
  const l = LANGS.includes(lang) ? lang : 'ar';
  state.lang = l;
  document.documentElement.lang = l;
  document.documentElement.dir = (l === 'ar' || l === 'he') ? 'rtl' : 'ltr';
  const oldLetter = state.letter;
  state.letter = (ALPHABET[l] && ALPHABET[l][0]) || state.letter;
  dbg('lang:ensure', { prev, next: l, dir: document.documentElement.dir, letterFrom: oldLetter, letterTo: state.letter });
}
function computeFirstLetter(word, lang){
  if (!word) return '';
  let w = String(word).trim();
  if (!w) return '';

  if (lang === 'ar'){
    // تجاهل "ال" في بداية الكلمة
    if (w.startsWith('ال')) w = w.slice(2);
    // توحيد بعض أشكال الألف وتحويل التاء المربوطة
    const ch0 = (w[0] || '')
      .replace(/[إأآا]/, 'أ')
      .replace('ة', 'ت');
    return ch0;
  }

  if (lang === 'he'){
    // تحويل الأشكال النهائية إلى أشكالها القياسية
    const ch = w[0] || '';
    const map = { 'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ' };
    return map[ch] || ch;
  }

  // en أو غيرها
  return (w[0] || '').toUpperCase();
}function subjectToDir(subject){ const s = SUBJECT_ALIASES[subject] || subject; return { animal:'animals', fruit:'fruits', vegetable:'vegetables', tool:'tools', profession:'professions', human_body:'body' }[s]; }
function sanitizeId(s){
  const t = String(s||'').toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9_\-]+/g,'_')
    .replace(/_{2,}/g,'_')
    .replace(/^_+|_+$/g,'');
  return t || 'item';
}

/* ===================== ״×†״³‚״§״× + ״¥״®״§״¡ ״£״²״±״§״± ‚״¯…״© ===================== */
function injectStyles(){
  if (document.getElementById('aa-style')) return;
  const style = document.createElement('style');
  style.id = 'aa-style';
  style.textContent = `
    .aa-title{ font-weight:800; text-align:center; line-height:1.25; margin:.25rem 0 .75rem; font-size:clamp(22px,3.5vw,40px); }
    .aa-title .first-letter{ color: var(--aa-accent, #e11d48); }
    #listen-btn, .listen-btn, #aa-play{ display:none !important; }
    #aa-image, #aa-name{ cursor:pointer; }
    .controls, #aa-toggle-desc, #toggle-desc-btn, #prev-btn, #next-btn, #aa-prev, #aa-next{ display:none !important; }

    :root{
      --aa-btn:       #0ea5e9;
      --aa-btn-2:     #0284c7;
      --aa-btn-ring:  rgba(14,165,233,.35);
    }
    .letters-grid .letter-btn{
      border:none; color:#fff; font-weight:700; border-radius:12px; padding:10px 0;
      background:linear-gradient(135deg,var(--aa-btn),var(--aa-btn-2));
      box-shadow:0 2px 8px rgba(0,0,0,.06);
      transition:transform .08s ease, box-shadow .15s ease, filter .15s ease;
    }
    .letters-grid .letter-btn:hover{ filter:brightness(1.06); box-shadow:0 4px 14px var(--aa-btn-ring); }
    .letters-grid .letter-btn.active{ outline:2px solid #fff; box-shadow:0 0 0 3px var(--aa-btn-ring); }
  `;
  document.head.appendChild(style);
}

/* ===================== ״§״³״×״®״±״§״¬ …״³״§״±״§״× …״±†״© ===================== */
function pickFromMediaNode(node){ if (!node) return ''; return prefixSlash(node.image_path || node.path || node.src || node.url || ''); }
function extractImagePath(mediaImages){
  if (!mediaImages) return '';
  if (typeof mediaImages === 'string') return prefixSlash(mediaImages);
  if (Array.isArray(mediaImages)){
    const main = mediaImages.find(x => x && (x.id==='main' || x.id==='default')) || mediaImages[0];
    return pickFromMediaNode(main);
  }
  if (typeof mediaImages === 'object'){
    if (mediaImages.main || mediaImages.default) return pickFromMediaNode(mediaImages.main || mediaImages.default);
    const firstKey = Object.keys(mediaImages)[0];
    return pickFromMediaNode(mediaImages[firstKey]);
  }
  return '';
}
function extractSoundPath(soundsLang){
  if (!soundsLang) return '';
  if (typeof soundsLang === 'string') return prefixSlash(soundsLang);
  if (Array.isArray(soundsLang)){
    const main = soundsLang.find(x => x && (x.id==='main' || x.id==='default' || x.id==='boy' || x.id==='male' || x.id==='girl' || x.id==='teacher')) || soundsLang[0];
    return pickFromMediaNode(main);
  }
  if (typeof soundsLang === 'object'){
    if (soundsLang.main || soundsLang.default || soundsLang.boy || soundsLang.male || soundsLang.girl || soundsLang.teacher){
      return pickFromMediaNode(soundsLang.main || soundsLang.default || soundsLang.boy || soundsLang.male || soundsLang.girl || soundsLang.teacher);
    }
    const firstKey = Object.keys(soundsLang)[0];
    return pickFromMediaNode(soundsLang[firstKey]);
  }
  return '';
}
function pickName(data, lang){ return data?.name?.[lang] || data?.name?.ar || data?.title?.[lang] || data?.title?.ar || ''; }
function pickDescription(data, lang){ return data?.description?.[lang] || data?.description?.ar || ''; }
function labelOf(subject){
  return {
    animal:'الحيوانات',
    fruit:'الفواكه',
    vegetable:'الخضروات',
    tool:'الأدوات',
    profession:'المهن',
    human_body:'جسم الإنسان'
  }[subject] || subject;
}

function pickImageDirect(data){
  const m = extractImagePath(data?.media?.images);
  if (m) return m;
  if (data?.image_path) return prefixSlash(data.image_path);
  if (data?.image) return prefixSlash(data.image);
  if (data?.image_file){
    const s = (data?.subject || data?.type || data?.subjectType || data?.category);
    const dir = { animal:'animals', fruit:'fruits', vegetable:'vegetables', tool:'tools', profession:'professions', human_body:'body' }[SUBJECT_ALIASES[s]||s];
    if (dir) return `/images/${dir}/${data.image_file}`;
  }
  return '';
}

function voiceLabel(v, lang){
  const map = {
    ar: {boy:'ولد', girl:'بنت', teacher:'المعلم'},
    en: {boy:'Boy', girl:'Girl', teacher:'Teacher'},
    he: {boy:'ילד', girl:'ילדה', teacher:'מורה'},
  };
  return (map[lang]||map.ar)[v] || v;
}
function bindClickToPlay(){
  const handler = ()=> playCurrent();
  if (ELS.img && !ELS.img._aa_play){ ELS.img._aa_play = true; ELS.img.addEventListener('click', handler); }
  if (ELS.name && !ELS.name._aa_play){ ELS.name._aa_play = true; ELS.name.addEventListener('click', handler); }
}

/* ===================== ״§„״¹״±״¶ ===================== */
function renderCurrent(){
  if (ELS.letterBar) ELS.letterBar.textContent = state.letter || '';

  if (!state.filtered.length){
    if (ELS.name) ELS.name.innerHTML = `<span style="opacity:.8">(„״§ ״¹†״§״µ״±)</span>`;
    if (ELS.img){ ELS.img.src = HINTS.placeholderSVG; ELS.img.removeAttribute('data-aa-id'); }
    if (ELS.desc) ELS.desc.style.display = 'none';
    if (ELS.count) ELS.count.textContent = '0';
    dbg('render:none', { reason: 'no-items-after-filter', letter: state.letter, lang: state.lang });
    toggleNavButtons(false); return;
  }

  const idx = Math.max(0, Math.min(state.index, state.filtered.length-1));
  state.index = idx;
  const it = state.filtered[idx];

  const nm = it.name[state.lang] || '';
  const first = nm ? nm[0] : '';
  const rest  = nm ? nm.slice(1) : '';
  if (ELS.name){ ELS.name.classList.add('aa-title'); ELS.name.innerHTML = `<span class="first-letter">${first}</span>${rest}`; }

  if (ELS.img){
    if (!ELS.img._aa_bound){
      ELS.img.addEventListener('error', ()=> dbg('image:error', { src: ELS.img.src }));
      ELS.img.addEventListener('load',  ()=> dbg('image:ok',    { src: ELS.img.src }));
      ELS.img._aa_bound = true;
    }
    ELS.img.setAttribute('data-aa-id', it.id);
    const directImg = it.image || pickImageDirect(it.raw || it);
    ELS.img.src = directImg || HINTS.placeholderSVG;
  }

  if (ELS.desc){
    const txt = it.description[state.lang] || '';
    ELS.desc.textContent = txt;
    ELS.desc.style.display = state.showDescription && txt ? 'block' : 'none';
  }

  if (ELS.count) ELS.count.textContent = String(state.filtered.length);
  bindClickToPlay();
  dbg('render:item', { index: state.index, total: state.filtered.length, id: it.id, subject: it.subject, name: it.name?.[state.lang] || '', voice: state.voice });
  toggleNavButtons(true);
}
function toggleNavButtons(enabled){ [ELS.btnPrev, ELS.btnNext, ELS.btnToggleDesc].forEach(b => { if (b) b.disabled = !enabled; }); }

/* ===================== ״¥״¹״§״¯״© ״§„״¬„״¨/״§„„״×״±״© ===================== */
async function refetchAndRender(){
  stopCurrentAudio?.();
  const nowSubjects = state.subjects && state.subjects.length ? state.subjects : ['animal'];
  dbg('refetch:start', { lang: state.lang, letter: state.letter, subjects: nowSubjects, voice: state.voice });
  state.items = await fetchItemsBySubjects(nowSubjects);
  state.filtered = filterByLetter(state.items, state.letter, state.lang);
  state.index = 0; renderCurrent();
  state.fetchedOnce = true;
}
function refilterAndRender(){
  stopCurrentAudio?.();
  state.filtered = filterByLetter(state.items, state.letter, state.lang);
  state.index = 0; renderCurrent();
}

/* ===================== ״§„״£״²״±״§״± ===================== */
function bindMainActions(){
  if (ELS.btnPrev && !ELS.btnPrev._aa_bound){
    ELS.btnPrev._aa_bound = true;
    ELS.btnPrev.addEventListener('click', ()=>{
      if (!state.filtered.length) return;
      state.index = (state.index - 1 + state.filtered.length) % state.filtered.length;
      dbg('nav:prev', { index: state.index, total: state.filtered.length });
      renderCurrent();
    });
  }
  if (ELS.btnNext && !ELS.btnNext._aa_bound){
    ELS.btnNext._aa_bound = true;
    ELS.btnNext.addEventListener('click', ()=>{
      if (!state.filtered.length) return;
      state.index = (state.index + 1) % state.filtered.length;
      dbg('nav:next', { index: state.index, total: state.filtered.length });
      renderCurrent();
    });
  }
  if (ELS.btnToggleDesc && !ELS.btnToggleDesc._aa_bound){
    ELS.btnToggleDesc._aa_bound = true;
    ELS.btnToggleDesc.addEventListener('click', ()=>{
      state.showDescription = !state.showDescription;
      dbg('ui:toggle-desc', { showDescription: state.showDescription });
      renderCurrent();
    });
  }
}

/* ===================== …״±״§‚״¨״© ״×״÷‘״± ״§„„״÷״© ״§„״¹״§„…״© ===================== */
let langObserver = null;
function observeGlobalLang(){
  if (langObserver) return;
  langObserver = new MutationObserver(() => {
    const newLang = document.documentElement.lang || 'ar';
    if (newLang !== state.lang){
      ensureLang(newLang);
      dbg('lang:global-mut observed', { lang: state.lang });
      buildLetters(); buildVoiceFilter(); refilterAndRender();
    }
  });
  langObserver.observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
}

/* ===================== Init Guard + API ===================== */
async function loadAlphabetActivity(){
  // ״­״§״±״³ „…†״¹ ״§„״×‡״¦״© ״§„…״²״¯ˆ״¬״©
  if (window.__AA_INIT__){ dbg('init:skipped (already initialized)'); return; }
  window.__AA_INIT__ = true;

  try{
    injectStyles();
    ensureLang(document.documentElement.lang || state.lang);
    bindDom(); ensureSidebar(); bindMainActions(); observeGlobalLang();

    await refetchAndRender();
    dbg('ג… ready', { lang: state.lang, letter: state.letter, subjects: state.subjects, voice: state.voice });
  }catch(err){
    console.error('[alphabet-activity] failed to init', err);
    if (ELS.name) ELS.name.textContent = 'حدث خطأ أثناء تحميل الصفحة';
  }
}
const loadAlphabetActivityContent = loadAlphabetActivity;
// („״§ ˆ״¬״¯ Auto-Boot ‡†״§)


// ---- Global exposure for non-module usage ----
try {
  if (typeof window !== 'undefined') {
    window.loadAlphabetActivity = loadAlphabetActivity;
    window.loadAlphabetActivityContent = loadAlphabetActivityContent || loadAlphabetActivity;
    window.AlphabetActivity = Object.assign(window.AlphabetActivity || {}, {
      loadAlphabetActivity,
      loadAlphabetActivityContent: loadAlphabetActivityContent || loadAlphabetActivity
    });
  }
} catch (_) {}

