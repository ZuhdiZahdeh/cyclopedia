// src/activities/alphabet-activity.js
// نشاط الحروف — نسخة DEBUG مع تشخيص شامل + تجنّب تكرار الواجهة + جلب Firestore مرن

import { db } from '@/core/db-handler.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { playAudio, stopCurrentAudio } from '@/core/audio-handler.js';

/* ===================== DEBUG ===================== */
const AA_DBG = true; // ← ضع false لإخفاء كل السجلات
const dbg  = (...a)=>{ if(AA_DBG) console.log('[AA]', ...a); };
const dbgt = (title, rows)=>{
  if(AA_DBG && console.table){ console.groupCollapsed('[AA] ' + title); console.table(rows); console.groupEnd(); }
};
/* ================================================= */

const LANGS = ['ar','en','he'];
const ALPHABET = {
  ar: ["أ","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه","و","ي"],
  en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  he: ["א","ב","ג","ד","ה","ו","ז","ח","ט","י","כ","ך","ל","מ","ם","נ","ן","ס","ע","פ","ף","צ","ץ","ק","ר","ש","ת"]
};

// أسماء المواضيع بالمفرد
const SUBJECTS = ["animal","fruit","vegetable","tool","profession","human_body"];

// تطبيع/مرادفات
const SUBJECT_ALIASES = {
  animals:'animal', fruits:'fruit', vegetables:'vegetable',
  tools:'tool', professions:'profession',
  body:'human_body', human_body:'human_body'
};
const SUBJECT_PLURALS = { // للمساعدة في الاستعلام
  animal:'animals', fruit:'fruits', vegetable:'vegetables',
  tool:'tools', profession:'professions', human_body:'body'
};

const state = {
  lang: 'ar',
  letter: 'أ',
  subjects: [...SUBJECTS],
  items: [],
  filtered: [],
  index: 0,
  showDescription: false,
};

// خرائط DOM (تدعم IDs القديمة في HTML وIDs الجديدة "aa-*")
const ELS = {
  name: null, img: null, desc: null, letterBar: null, count: null,
  btnPrev: null, btnNext: null, btnPlay: null, btnToggleDesc: null,
  sidebar: null, lettersGrid: null, subjectsWrap: null, langSelect: null,
};

function normalizeSubjects(list){
  return (list||[]).map(s => SUBJECT_ALIASES[s] || s);
}
function expandSubjectVariants(wanted){ // مفرد + جمع/مرادفات
  const set = new Set();
  for (const s of wanted){
    set.add(s);
    const p = SUBJECT_PLURALS[s];
    if (p) set.add(p);
  }
  // إضافة body كـ human_body والعكس
  if (set.has('human_body')) set.add('body');
  if (set.has('body')) set.add('human_body');
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
    w = w.replace(/^ال/, '');
    const ch = w[0];
    const map = {'إ':'أ','آ':'أ','ا':'أ','ة':'ت'};
    return map[ch] || ch;
  }
  if (lang === 'en') return (w[0] || '').toUpperCase();
  if (lang === 'he'){
    const ch = w[0] || '';
    const map = {'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'};
    return map[ch] || ch;
  }
  return w[0] || '';
}

// انتقاء الحقول (مرن)
function pickName(data, lang){
  return data?.name?.[lang] || data?.name?.ar || data?.title?.[lang] || data?.title?.ar || '';
}
function pickDescription(data, lang){
  return data?.description?.[lang] || data?.description?.ar || '';
}
function subjectToDir(subject){
  const s = SUBJECT_ALIASES[subject] || subject;
  return { animal:'animals', fruit:'fruits', vegetable:'vegetables', tool:'tools', profession:'professions', human_body:'body' }[s];
}
function prefixSlash(p){ if (!p) return ''; return p.startsWith('/') ? p : `/${p}`; }
function pickImage(data){
  const img1 = data?.media?.images?.main?.image_path || data?.media?.images?.main?.path || data?.media?.images?.main?.src;
  if (img1) return prefixSlash(img1);
  if (data?.image_path) return prefixSlash(data.image_path);
  if (data?.image) return prefixSlash(data.image);
  if (data?.image_file){
    const dir = subjectToDir(data?.subject || data?.type || data?.subjectType || data?.category);
    if (dir) return `/images/${dir}/${data.image_file}`;
  }
  return '';
}
function pickAudio(data, lang){
  const a1 = data?.media?.sounds?.[lang]?.main?.audio_path || data?.media?.sounds?.[lang]?.main?.path;
  if (a1) return prefixSlash(a1);
  const s = data?.sound?.[lang];
  if (typeof s === 'string') return prefixSlash(s);
  if (s?.boy) return prefixSlash(s.boy);
  if (s?.default) return prefixSlash(s.default);
  if (data?.sound_base){
    const dir = subjectToDir(data?.subject || data?.type || data?.subjectType || data?.category);
    if (dir) return `/audio/${lang}/${dir}/${data.sound_base}.mp3`;
  }
  return '';
}
function chunk(arr, size){ const out=[]; for(let i=0;i<arr.length;i+=size) out.push(arr.slice(i,i+size)); return out; }
function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

/* ------------ Firestore: جلب مرن مع بدائل ------------ */
async function fetchByFieldValues(colRef, field, values){
  const results = [];
  for (const part of chunk(values, 10)){
    const qy = query(colRef, where(field, 'in', part));
    dbg('fetch:query', { field, part });
    const snap = await getDocs(qy);
    snap.forEach(doc => results.push({ id: doc.id, data: doc.data() }));
  }
  return results;
}

function normalizeDocSubject(d){
  const raw = d.subject ?? d.type ?? d.subjectType ?? d.category ?? '';
  return SUBJECT_ALIASES[raw] || raw;
}

async function fetchItemsBySubjects(subjects){
  const wanted = normalizeSubjects(subjects && subjects.length ? subjects : SUBJECTS);
  const variants = expandSubjectVariants(wanted);
  dbg('fetch:subjects', { wanted, variants });

  const colRef = collection(db, 'items');
  const bag = new Map(); // id → data

  // 1) المحاولة الأساسية: الحقل subject
  for (const rec of await fetchByFieldValues(colRef, 'subject', variants)) bag.set(rec.id, rec.data);

  // 2) إن كان الناتج قليلًا بشكل مريب، جرّب حقولًا بديلة
  if (bag.size < 5){ // العتبة تقديرية
    for (const altField of ['type','subjectType','category']){
      const arr = await fetchByFieldValues(colRef, altField, variants);
      for (const rec of arr) bag.set(rec.id, rec.data);
    }
  }

  // 3) خطة أخيرة: سحب كامل المجموعة ثم فلترة محليًا (للإنقاذ فقط)
  if (bag.size === 0){
    dbg('fetch:fallback-full-scan');
    const snapAll = await getDocs(colRef);
    snapAll.forEach(doc => {
      const data = doc.data();
      const subj = normalizeDocSubject(data);
      if (wanted.includes(subj)) bag.set(doc.id, data);
    });
  }

  // بناء السجلات الموحّدة
  const all = [];
  bag.forEach((data, id)=>{
    const subject = normalizeDocSubject(data);
    const rec = {
      id,
      subject,
      name: { ar: pickName(data,'ar'), en: pickName(data,'en'), he: pickName(data,'he') },
      description: { ar: pickDescription(data,'ar'), en: pickDescription(data,'en'), he: pickDescription(data,'he') },
      image: pickImage(data),
      audio: { ar: pickAudio(data,'ar'), en: pickAudio(data,'en'), he: pickAudio(data,'he') },
      tags: data?.tags || [],
      difficulty: data?.difficulty || 'normal',
    };
    all.push(rec);
  });

  // تقارير
  const bySubject = all.reduce((acc,it)=>{ acc[it.subject]=(acc[it.subject]||0)+1; return acc; },{});
  const missingName = all.filter(it => !it.name[state.lang]).length;
  const sample = all.slice(0,12).map(it=>({ id: it.id, subject: it.subject, name: it.name[state.lang]||'', image: it.image, audio: it.audio[state.lang]||'' }));
  dbg('fetched:summary', { total: all.length, bySubject, missingNameForLang: { lang: state.lang, count: missingName } });
  dbgt('fetched:sample(<=12)', sample);

  return all;
}

/* ------------ فلترة/عرض ------------ */
function filterByLetter(items, letter, lang){
  const L = String(letter || '').trim();
  const filtered = items.filter(it => computeFirstLetter(it.name[lang], lang) === L);
  dbg('filter:by-letter', { letter: L, lang, count: filtered.length });
  return filtered;
}

// ربط عناصر DOM (أولوية لِـ IDs ملف HTML القائم)
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

  // الشريط الجانبي / الحروف / المواضيع / اللغة
  ELS.sidebar   = qs('#alphabet-activity-controls') || null;
  ELS.lettersGrid = qs('#aa-letters') || null;
  ELS.subjectsWrap= qs('#aa-subjects') || null;
  ELS.langSelect  = qs('#aa-lang') || null;
}

// إنشاء سايدبار افتراضي إن لم يوجد
function ensureSidebar(){
  if (!ELS.sidebar){
    const aside = document.createElement('div');
    aside.id = 'alphabet-activity-controls';
    aside.className = 'sidebar-section';
    const host = qs('#sidebar-section') || qs('.sidebar') || qs('aside') || document.body;
    host.appendChild(aside);
    ELS.sidebar = aside;
    dbg('sidebar:fallback-mounted');
  }
  // بناء محتوى السايدبار القياسي
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
      <h3 class="sidebar-title">الحروف</h3>
      <div id="aa-letters" class="letters-grid" style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px"></div>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-title">المواضيع</h3>
      <div id="aa-subjects" class="subjects-filter" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px"></div>
    </div>
  `;
  // أعِد الربط بعد الحقن
  bindDom();

  // لغة
  if (ELS.langSelect){
    ELS.langSelect.value = state.lang;
    ELS.langSelect.addEventListener('change', ()=>{
      ensureLang(ELS.langSelect.value);
      dbg('lang:changed', { lang: state.lang });
      buildLetters();
      refilterAndRender();
    });
  }

  // الحروف + المواضيع
  buildLetters();
  buildSubjectsFilter();
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
      dbg('letter:selected', { letter: ch, lang: state.lang });
      qsa('#aa-letters .letter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (ELS.letterBar) ELS.letterBar.textContent = state.letter;
      refilterAndRender();
    });
    if (ch === state.letter) btn.classList.add('active');
    ELS.lettersGrid.appendChild(btn);
  });
  dbg('letters:built', { lang: state.lang, count: letters.length });
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
      dbg('subjects:changed', { subjects: state.subjects.slice() });
      refetchAndRender();
    });
  });
}

function labelOf(subject){
  return {
    animal:'الحيوانات', fruit:'الفواكه', vegetable:'الخضروات',
    tool:'الأدوات', profession:'المهن', human_body:'جسم الإنسان'
  }[subject] || subject;
}

function renderCurrent(){
  if (ELS.letterBar) ELS.letterBar.textContent = state.letter || '';

  if (!state.filtered.length){
    if (ELS.name) ELS.name.innerHTML = `<span style="opacity:.8">(لا عناصر)</span>`;
    if (ELS.img)  ELS.img.src = '';
    if (ELS.desc) ELS.desc.style.display = 'none';
    if (ELS.count) ELS.count.textContent = '0';
    toggleNavButtons(false);
    dbg('render:none', { reason: 'no-items-after-filter', letter: state.letter, lang: state.lang });
    return;
  }

  const idx = Math.max(0, Math.min(state.index, state.filtered.length-1));
  state.index = idx;
  const it = state.filtered[idx];

  // الاسم مع إبراز الحرف الأول
  const nm = it.name[state.lang] || '';
  const first = nm ? nm[0] : '';
  const rest  = nm ? nm.slice(1) : '';
  if (ELS.name) ELS.name.innerHTML = `<span style="font-weight:700">${first}</span>${rest}`;

  // الصورة
  if (ELS.img){
    if (!ELS.img._aa_bound){
      ELS.img.addEventListener('error', ()=> dbg('image:error', { src: ELS.img.src }));
      ELS.img.addEventListener('load',  ()=> dbg('image:ok',    { src: ELS.img.src }));
      ELS.img._aa_bound = true;
    }
    ELS.img.src = it.image || '';
  }

  // الوصف
  if (ELS.desc){
    const txt = it.description[state.lang] || '';
    ELS.desc.textContent = txt;
    ELS.desc.style.display = state.showDescription && txt ? 'block' : 'none';
  }

  if (ELS.count) ELS.count.textContent = String(state.filtered.length);

  dbg('render:item', {
    index: state.index, total: state.filtered.length,
    id: it.id, subject: it.subject,
    name: it.name?.[state.lang] || '',
    image: it.image, audio: it.audio?.[state.lang] || '',
    showDescription: state.showDescription
  });

  toggleNavButtons(true);
}

function toggleNavButtons(enabled){
  [ELS.btnPrev, ELS.btnNext, ELS.btnPlay, ELS.btnToggleDesc].forEach(b => { if (b) b.disabled = !enabled; });
}

async function refetchAndRender(){
  stopCurrentAudio?.();
  dbg('refetch:start', { lang: state.lang, letter: state.letter, subjects: state.subjects });
  state.items = await fetchItemsBySubjects(state.subjects);
  state.filtered = filterByLetter(state.items, state.letter, state.lang);
  state.index = 0;
  renderCurrent();
}

function refilterAndRender(){
  stopCurrentAudio?.();
  state.filtered = filterByLetter(state.items, state.letter, state.lang);
  state.index = 0;
  renderCurrent();
}

/* ------------ ربط الأزرار (يدعم IDs القديمة والجديدة) ------------ */
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
  if (ELS.btnPlay && !ELS.btnPlay._aa_bound){
    ELS.btnPlay._aa_bound = true;
    ELS.btnPlay.addEventListener('click', ()=>{
      if (!state.filtered.length) return;
      const it = state.filtered[state.index];
      const src = it?.audio?.[state.lang] || '';
      if (src){ dbg('audio:play', { id: it?.id, name: it?.name?.[state.lang], src }); playAudio(src); }
      else { dbg('audio:missing', { id: it?.id, name: it?.name?.[state.lang] }); }
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

function observeGlobalLang(){
  const m = new MutationObserver(() => {
    const newLang = document.documentElement.lang || 'ar';
    if (newLang !== state.lang){
      ensureLang(newLang);
      dbg('lang:global-mut observed', { lang: state.lang });
      buildLetters();
      refilterAndRender();
    }
  });
  m.observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
  dbg('lang:observer-ready');
}

/* ------------ نقطة الدخول ------------ */
export async function loadAlphabetActivity(){
  try{
    ensureLang(document.documentElement.lang || state.lang);

    // اربط على DOM القائم (لا تُنشئ واجهة جديدة إن وُجدت)
    bindDom();
    // أنشئ سايدبار قياسي/أزرار الحروف إن لم تكن موجودة
    ensureSidebar();
    // أربط الأزرار (مرة واحدة)
    bindMainActions();
    // راقب تغييرات لغة الموقع
    observeGlobalLang();

    // جلب أولي ثم عرض
    await refetchAndRender();

    console.log('✅ [alphabet-activity] ready:', {lang: state.lang, letter: state.letter, subjects: state.subjects});
  }catch(err){
    console.error('[alphabet-activity] failed to init', err);
    if (ELS.name) ELS.name.textContent = 'حدث خطأ أثناء التحميل';
  }
}

// توافق اسم قديم محتمل
export const loadAlphabetActivityContent = loadAlphabetActivity;
