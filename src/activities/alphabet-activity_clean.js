// src/activities/alphabet-activity.js
// نشاط الحروف — CLEAN v5 (بدون سجلات)

import { db } from '@/core/db-handler.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { playAudio, stopCurrentAudio } from '@/core/audio-handler.js';

/* ===================== DEBUG ===================== */
const AA_DBG = false; // ← لا سجلات
const dbg  = (...a)=>{ if(AA_DBG) console.log('[AA]', ...a); };
const dbgt = (title, rows)=>{ if(AA_DBG && console.table){ console.groupCollapsed('[AA] ' + title); console.table(rows); console.groupEnd(); } };
/* ================================================= */

const LANGS = ['ar','en','he'];
const ALPHABET = {
  ar: ["أ","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه","و","ي"],
  en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  he: ["א","ב","ג","ד","ה","ו","ז","ח","ט","י","כ","ך","ל","מ","ם","נ","ן","ס","ע","פ","ף","צ","ץ","ק","ר","ש","ת"]
};

const SUBJECTS = ["animal","fruit","vegetable","tool","profession","human_body"];
const SUBJECT_ALIASES = { animals:'animal', fruits:'fruit', vegetables:'vegetable', tools:'tool', professions:'profession', body:'human_body', human_body:'human_body' };
const SUBJECT_PLURALS = { animal:'animals', fruit:'fruits', vegetable:'vegetables', tool:'tools', profession:'professions', human_body:'body' };

const DEFAULT_HINTS = {
  imageBases: ['/images','/img','/media/images'],
  audioBases: ['/audio','/media/audio','/sounds'],
  imageExts:  ['webp','jpg','jpeg','png'],
  audioExts:  ['mp3','ogg','wav'],
  placeholderSVG: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" fill="#9ca3af" font-size="22">لا توجد صورة</text></svg>')
};
const HINTS = (typeof window!=='undefined' && window.ASSET_HINTS) ? { ...DEFAULT_HINTS, ...window.ASSET_HINTS } : DEFAULT_HINTS;

const assetCache = new Map();

const VOICES = ['boy','girl','teacher'];
const VOICE_KEY = 'aa.voice';

const state = {
  lang:'ar',
  letter:'أ',
  subjects:[...SUBJECTS],
  items:[],
  filtered:[],
  index:0,
  showDescription:false,
  voice: (typeof localStorage!=='undefined' && localStorage.getItem(VOICE_KEY)) || 'teacher',
};

const ELS = {
  name:null,img:null,desc:null,letterBar:null,count:null,
  btnPrev:null,btnNext:null,btnPlay:null,btnToggleDesc:null,
  sidebar:null,lettersGrid:null,subjectsWrap:null,langSelect:null,voiceWrap:null,
};

function normalizeSubjects(list){ return (list||[]).map(s => SUBJECT_ALIASES[s] || s); }
function expandSubjectVariants(wanted){ const set=new Set(); for(const s of wanted){ set.add(s); const p=SUBJECT_PLURALS[s]; if(p) set.add(p); } if(set.has('human_body')) set.add('body'); if(set.has('body')) set.add('human_body'); return [...set]; }
function ensureLang(lang){
  const l = LANGS.includes(lang) ? lang : 'ar';
  state.lang = l;
  document.documentElement.lang = l;
  document.documentElement.dir = (l === 'ar' || l === 'he') ? 'rtl' : 'ltr';
  state.letter = (ALPHABET[l] && ALPHABET[l][0]) || state.letter;
}
function computeFirstLetter(word, lang){
  if (!word) return '';
  let w = String(word).trim();
  if (!w) return '';
  if (lang === 'ar'){ w = w.replace(/^ال/, ''); const ch = w[0]; const map = {'إ':'أ','آ':'أ','ا':'أ','ة':'ت'}; return map[ch] || ch; }
  if (lang === 'en') return (w[0] || '').toUpperCase();
  if (lang === 'he'){ const ch = w[0] || ''; const map = {'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'}; return map[ch] || ch; }
  return w[0] || '';
}
function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }
function chunk(arr, size){ const out=[]; for(let i=0;i<arr.length;i+=size) out.push(arr.slice(i,i+size)); return out; }
function prefixSlash(p){ if (!p) return ''; return p.startsWith('/') ? p : `/${p}`; }
function subjectToDir(subject){ const s = SUBJECT_ALIASES[subject] || subject; return { animal:'animals', fruit:'fruits', vegetable:'vegetables', tool:'tools', profession:'professions', human_body:'body' }[s]; }
function sanitizeId(x){ return String(x||'').trim().toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_\-]/g,''); }

function injectStyles(){
  if (document.getElementById('aa-style')) return;
  const style = document.createElement('style');
  style.id = 'aa-style';
  style.textContent = `
    .aa-title{ font-weight:800; text-align:center; line-height:1.25; margin:.25rem 0 .75rem; font-size:clamp(22px,3.5vw,40px); }
    .aa-title .first-letter{ color: var(--aa-accent, #e11d48); }
    #listen-btn, .listen-btn, #aa-play{ display:none !important; }
    #aa-image{ cursor:pointer; }
    #aa-name{ cursor:pointer; }
  `;
  document.head.appendChild(style);
}

function pickFromMediaNode(node){
  if (!node) return '';
  return prefixSlash(node.image_path || node.path || node.src || node.url || '');
}
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
function labelOf(subject){ return { animal:'الحيوانات', fruit:'الفواكه', vegetable:'الخضروات', tool:'الأدوات', profession:'المهن', human_body:'جسم الإنسان' }[subject] || subject; }

function pickImageDirect(data){
  const m = extractImagePath(data?.media?.images);
  if (m) return m;
  if (data?.image_path) return prefixSlash(data.image_path);
  if (data?.image) return prefixSlash(data.image);
  if (data?.image_file){
    const dir = subjectToDir(data?.subject || data?.type || data?.subjectType || data?.category);
    if (dir) return `/images/${dir}/${data.image_file}`;
  }
  return '';
}

function voiceLabel(v, lang){
  const map = {
    ar: {boy:'ولد', girl:'بنت', teacher:'معلّم'},
    en: {boy:'Boy', girl:'Girl', teacher:'Teacher'},
    he: {boy:'ילד', girl:'ילדה', teacher:'מורה'},
  };
  return (map[lang]||map.ar)[v] || v;
}
function pickAudioDirect(data, lang, voice){
  const m1 = extractSoundPath(data?.media?.sounds?.[lang]);
  if (m1) return m1;

  const p = data?.sound?.paths?.[lang];
  if (p){
    const chosen = p?.[voice] || p?.teacher || p?.boy || p?.girl;
    if (chosen) return prefixSlash(chosen);
  }

  const base = data?.sound?.base || data?.sound_base;
  const subjDir = subjectToDir(data?.subject || data?.type || data?.subjectType || data?.category);
  if (base && subjDir){
    const candidate = `/audio/${lang}/${subjDir}/${base}_${voice}_${lang}.mp3`;
    return candidate;
  }

  const s = data?.sound?.[lang];
  if (typeof s === 'string') return prefixSlash(s);
  if (s?.boy) return prefixSlash(s.boy);
  if (s?.default) return prefixSlash(s.default);

  return '';
}
function buildAudioCandidates(it, lang, voice){
  const dir = subjectToDir(it.subject);
  const baseName = it?.sound?.base || it?.sound_base || sanitizeId(it.id || it.name?.[lang] || it.name?.en || it.name?.ar);
  const bases = HINTS.audioBases, exts = HINTS.audioExts, out=[];
  if (dir && baseName){
    for (const b of bases){
      for (const e of exts){
        out.push(`${b}/${lang}/${dir}/${baseName}_${voice}_${lang}.${e}`);
        out.push(`${b}/${lang}/${dir}/${baseName}.${e}`);
      }
    }
  }
  return out.map(prefixSlash);
}
async function probeAudio(url){
  const key = 'aud:'+url;
  if (assetCache.has(key)) return assetCache.get(key) || '';
  try{ const res = await fetch(url, { method:'HEAD' }); if (res.ok){ assetCache.set(key, url); return url; } }catch(e){}
  assetCache.set(key, ''); return '';
}
async function resolveAudioUrl(it, lang, voice){
  const direct = pickAudioDirect(it.raw || it, lang, voice);
  if (direct) return direct;
  for (const u of buildAudioCandidates(it, lang, voice)){ const ok = await probeAudio(u); if (ok) return ok; }
  return '';
}

function prefixItem(data, id){
  const rec = {
    id,
    subject: normalizeDocSubject(data),
    name: { ar: pickName(data,'ar'), en: pickName(data,'en'), he: pickName(data,'he') },
    description: { ar: pickDescription(data,'ar'), en: pickDescription(data,'en'), he: pickDescription(data,'he') },
    image: pickImageDirect(data) || '',
    sound: data?.sound || null,
    media: data?.media || null,
    raw: data,
    tags: data?.tags || [],
    difficulty: data?.difficulty || 'normal',
  };
  return rec;
}
async function fetchByFieldValues(colRef, field, values){
  const results = [];
  for (const part of chunk(values, 10)){
    const qy = query(colRef, where(field, 'in', part));
    const snap = await getDocs(qy);
    snap.forEach(doc => results.push({ id: doc.id, data: doc.data() }));
  }
  return results;
}
function normalizeDocSubject(d){ const raw = d.subject ?? d.type ?? d.subjectType ?? d.category ?? ''; return SUBJECT_ALIASES[raw] || raw; }
async function fetchItemsBySubjects(subjects){
  const wanted = normalizeSubjects(subjects && subjects.length ? subjects : SUBJECTS);
  const variants = expandSubjectVariants(wanted);

  const colRef = collection(db, 'items');
  const bag = new Map();

  for (const rec of await fetchByFieldValues(colRef, 'subject', variants)) bag.set(rec.id, rec.data);
  if (bag.size < 5){
    for (const altField of ['type','subjectType','category']){
      const arr = await fetchByFieldValues(colRef, altField, variants);
      for (const rec of arr) bag.set(rec.id, rec.data);
    }
  }
  if (bag.size === 0){
    const snapAll = await getDocs(colRef);
    snapAll.forEach(doc => {
      const data = doc.data();
      const subj = normalizeDocSubject(data);
      if (wanted.includes(subj)) bag.set(doc.id, data);
    });
  }

  const all = [];
  bag.forEach((data, id)=> all.push(prefixItem(data, id)) );
  return all;
}

function filterByLetter(items, letter, lang){
  const L = String(letter || '').trim();
  return items.filter(it => computeFirstLetter(it.name[lang], lang) === L);
}

function bindDom(){
  ELS.name  = qs('#aa-name')  || qs('#item-name');
  ELS.img   = qs('#aa-image') || qs('#item-image');
  ELS.desc  = qs('#aa-desc')  || qs('#item-description');
  ELS.letterBar = qs('#aa-letter-bar') || qs('#letter-badge');
  ELS.count = qs('#aa-count') || qs('#item-count');
  ELS.btnPrev      = qs('#aa-prev')        || qs('#prev-btn');
  ELS.btnNext      = qs('#aa-next')        || qs('#next-btn');
  ELS.btnPlay      = qs('#aa-play')        || qs('#listen-btn');
  ELS.btnToggleDesc= qs('#aa-toggle-desc') || qs('#toggle-desc-btn');
  ELS.sidebar   = qs('#alphabet-activity-controls') || null;
  ELS.lettersGrid = qs('#aa-letters') || null;
  ELS.subjectsWrap= qs('#aa-subjects') || null;
  ELS.langSelect  = qs('#aa-lang') || null;
  ELS.voiceWrap   = qs('#aa-voice') || null;
}

function ensureSidebar(){
  if (!ELS.sidebar){
    const aside = document.createElement('div');
    aside.id = 'alphabet-activity-controls';
    aside.className = 'sidebar-section';
    const host = qs('#sidebar-section') || qs('.sidebar') || qs('aside') || document.body;
    host.appendChild(aside);
    ELS.sidebar = aside;
  }
  ELS.sidebar.innerHTML = `
    <div class="sidebar-section">
      <h3 class="sidebar-title">اللغة</h3>
      <select id="aa-lang" class="select">
        <option value="ar">العربية</option>
        <option value="en">English</option>
        <option value="he">עברית</option>
      </select>
    </div>
    <div class="sidebar-section">
      <h3 class="sidebar-title">نوع الصوت</h3>
      <div id="aa-voice" class="voice-filter" style="display:flex;gap:8px;flex-wrap:wrap"></div>
    </div>
    <div class="sidebar-section">
      <h3 class="sidebar-title">الحروف</h3>
      <div id="aa-letters" class="letters-grid" style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px"></div>
    </div>
    <div class="sidebar-section">
      <h3 class="sidebar-title">المواضيع</h3>
      <div id="aa-subjects" class="subjects-filter" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px"></div>
    </div>
  `;
  bindDom();

  if (ELS.langSelect){
    ELS.langSelect.value = state.lang;
    ELS.langSelect.addEventListener('change', ()=>{
      ensureLang(ELS.langSelect.value);
      buildLetters(); buildVoiceFilter(); refilterAndRender();
    });
  }
  buildVoiceFilter();
  buildLetters();
  buildSubjectsFilter();
}

function buildVoiceFilter(){
  if (!ELS.voiceWrap) ELS.voiceWrap = qs('#aa-voice');
  if (!ELS.voiceWrap) return;
  ELS.voiceWrap.innerHTML = VOICES.map(v => `
    <label style="display:flex;align-items:center;gap:4px">
      <input type="radio" name="aa-voice" value="${v}" ${state.voice===v?'checked':''}>
      <span>${voiceLabel(v, state.lang)}</span>
    </label>
  `).join('');
  ELS.voiceWrap.querySelectorAll('input[name="aa-voice"]').forEach(r => {
    r.addEventListener('change', ()=>{
      state.voice = r.value;
      try{ localStorage.setItem(VOICE_KEY, state.voice); }catch(e){}
      stopCurrentAudio?.();
    });
  });
}

function buildLetters(){
  if (!ELS.lettersGrid) ELS.lettersGrid = qs('#aa-letters');
  if (!ELS.lettersGrid) return;
  ELS.lettersGrid.innerHTML = '';
  const letters = ALPHABET[state.lang] || [];
  letters.forEach(ch => {
    const btn = document.createElement('button');
    btn.className = 'btn letter-btn';
    btn.textContent = ch;
    btn.style.padding = '8px 0';
    btn.addEventListener('click', ()=>{
      state.letter = ch;
      qsa('#aa-letters .letter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (ELS.letterBar) ELS.letterBar.textContent = state.letter;
      refilterAndRender();
    });
    if (ch === state.letter) btn.classList.add('active');
    ELS.lettersGrid.appendChild(btn);
  });
}

function buildSubjectsFilter(){
  if (!ELS.subjectsWrap) ELS.subjectsWrap = qs('#aa-subjects');
  if (!ELS.subjectsWrap) return;
  ELS.subjectsWrap.innerHTML = SUBJECTS.map(s => `
    <label style="display:flex;align-items:center;gap:6px">
      <input type="checkbox" value="${s}" ${state.subjects.includes(s)?'checked':''}>
      <span>${labelOf(s)}</span>
    </label>
  `).join('');
  ELS.subjectsWrap.querySelectorAll('input[type="checkbox"]').forEach(chk => {
    chk.addEventListener('change', ()=>{
      const val = chk.value;
      if (chk.checked && !state.subjects.includes(val)) state.subjects.push(val);
      if (!chk.checked) state.subjects = state.subjects.filter(v => v!==val);
      refetchAndRender();
    });
  });
}

async function playCurrent(){
  if (!state.filtered.length) return;
  const it = state.filtered[state.index];
  let src = pickAudioDirect(it.raw || it, state.lang, state.voice);
  if (!src) src = await resolveAudioUrl(it, state.lang, state.voice);
  if (src) playAudio(src);
}
function bindClickToPlay(){
  const handler = ()=> playCurrent();
  if (ELS.img && !ELS.img._aa_play){
    ELS.img._aa_play = true;
    ELS.img.addEventListener('click', handler);
    ELS.img.style.cursor = 'pointer';
  }
  if (ELS.name && !ELS.name._aa_play){
    ELS.name._aa_play = true;
    ELS.name.addEventListener('click', handler);
    ELS.name.style.cursor = 'pointer';
  }
}

let langObserver = null;
let lastRenderedKey = '';
async function renderCurrent(){
  if (ELS.letterBar) ELS.letterBar.textContent = state.letter || '';

  if (!state.filtered.length){
    if (ELS.name) ELS.name.innerHTML = `<span style="opacity:.8">(لا عناصر)</span>`;
    if (ELS.img){ ELS.img.src = HINTS.placeholderSVG; ELS.img.removeAttribute('data-aa-id'); }
    if (ELS.desc) ELS.desc.style.display = 'none';
    if (ELS.count) ELS.count.textContent = '0';
    toggleNavButtons(false); return;
  }

  const idx = Math.max(0, Math.min(state.index, state.filtered.length-1));
  state.index = idx;
  const it = state.filtered[idx];
  const key = `${it.id}|${state.lang}`;
  lastRenderedKey = key;

  const nm = it.name[state.lang] || '';
  const first = nm ? nm[0] : '';
  const rest  = nm ? nm.slice(1) : '';
  if (ELS.name){
    ELS.name.classList.add('aa-title');
    ELS.name.innerHTML = `<span class="first-letter">${first}</span>${rest}`;
  }

  if (ELS.img){
    if (!ELS.img._aa_bound){
      ELS.img.addEventListener('error', ()=>{});
      ELS.img.addEventListener('load',  ()=>{});
      ELS.img._aa_bound = true;
    }
    ELS.img.setAttribute('data-aa-id', key);
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
  toggleNavButtons(true);
}
function toggleNavButtons(enabled){
  [ELS.btnPrev, ELS.btnNext, ELS.btnToggleDesc].forEach(b => { if (b) b.disabled = !enabled; });
  if (ELS.btnPlay){ ELS.btnPlay.style.display = 'none'; }
}

async function refetchAndRender(){
  stopCurrentAudio?.();
  state.items = await fetchItemsBySubjects(state.subjects);
  state.filtered = filterByLetter(state.items, state.letter, state.lang);
  state.index = 0; renderCurrent();
}
function refilterAndRender(){
  stopCurrentAudio?.();
  state.filtered = filterByLetter(state.items, state.letter, state.lang);
  state.index = 0; renderCurrent();
}

function bindMainActions(){
  if (ELS.btnPrev && !ELS.btnPrev._aa_bound){
    ELS.btnPrev._aa_bound = true;
    ELS.btnPrev.addEventListener('click', ()=>{
      if (!state.filtered.length) return;
      state.index = (state.index - 1 + state.filtered.length) % state.filtered.length;
      renderCurrent();
    });
  }
  if (ELS.btnNext && !ELS.btnNext._aa_bound){
    ELS.btnNext._aa_bound = true;
    ELS.btnNext.addEventListener('click', ()=>{
      if (!state.filtered.length) return;
      state.index = (state.index + 1) % state.filtered.length;
      renderCurrent();
    });
  }
  if (ELS.btnToggleDesc && !ELS.btnToggleDesc._aa_bound){
    ELS.btnToggleDesc._aa_bound = true;
    ELS.btnToggleDesc.addEventListener('click', ()=>{
      state.showDescription = !state.showDescription;
      renderCurrent();
    });
  }
}

function observeGlobalLang(){
  if (langObserver) return;
  langObserver = new MutationObserver(() => {
    const newLang = document.documentElement.lang || 'ar';
    if (newLang !== state.lang){
      ensureLang(newLang);
      buildLetters(); buildVoiceFilter(); refilterAndRender();
    }
  });
  langObserver.observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
}

function maybeBoot(){
  const onAA = /alphabet-activity\.html($|\?)/.test(location.pathname)
            || document.querySelector('#aa-letter-bar, #item-name, #aa-name');
  if (!onAA) return;

  injectStyles();
  ensureLang(document.documentElement.lang || state.lang);
  bindDom(); ensureSidebar(); bindMainActions(); observeGlobalLang();
  refetchAndRender();
  console.log('✅ [alphabet-activity] ready:', {lang: state.lang, letter: state.letter, subjects: state.subjects, voice: state.voice});
}

function installAutoBootOnce(){
  if (window.__AA_AUTOboot_INSTALLED__) return;
  window.__AA_AUTOboot_INSTALLED__ = true;

  const trigger = ()=> setTimeout(maybeBoot, 30);
  if (document.readyState !== 'loading') trigger();
  document.addEventListener('DOMContentLoaded', trigger);
  window.addEventListener('pageshow', trigger);
  window.addEventListener('popstate', trigger);
  document.addEventListener('click', (e)=>{
    const a = e.target && e.target.closest && e.target.closest('a');
    if (a) setTimeout(maybeBoot, 60);
  });
  const mo = new MutationObserver(()=>{
    if (document.querySelector('#aa-letter-bar, #item-name, #aa-name')) trigger();
  });
  mo.observe(document.body, { childList:true, subtree:true });
}

export async function loadAlphabetActivity(){
  try{
    injectStyles();
    ensureLang(document.documentElement.lang || state.lang);
    bindDom(); ensureSidebar(); bindMainActions(); observeGlobalLang();
    await refetchAndRender();
    console.log('✅ [alphabet-activity] ready:', {lang: state.lang, letter: state.letter, subjects: state.subjects, voice: state.voice});
  }catch(err){
    console.error('[alphabet-activity] failed to init', err);
    if (ELS.name) ELS.name.textContent = 'حدث خطأ أثناء التحميل';
  }
}
export const loadAlphabetActivityContent = loadAlphabetActivity;

installAutoBootOnce();
