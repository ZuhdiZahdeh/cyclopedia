// src/subjects/vegetables-game.js
// نسخة نهائية: تربط IDs المفردة، تنسّق الاسم (أول حرف أحمر)،
 // توحّد الصوت/اللغة، وتسمع عند النقر على الصورة أو الاسم، وتضبط مكان الصورة.

import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

let vegetables = [];
let currentIndex = 0;
let currentVegData = null;

/* -------------------------- أدوات مساعدة -------------------------- */
const log  = (...a)=>console.log('[vegetables]', ...a);
const warn = (...a)=>console.warn('[vegetables]', ...a);

const grab = (ids) => {
  const list = Array.isArray(ids) ? ids : [ids];
  for (const id of list) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
};
const pick = (...ids) => grab(ids);
const safeText = (v) => (v == null ? '' : String(v));
const isAbs = (p) => /^https?:\/\//i.test(p) || /^data:/i.test(p) || /^blob:/i.test(p);
const norm  = (s) => String(s || '').trim().replace(/^\.?[\\/]+/, '').replace(/\\/g, '/');

const normalizeLang = (v)=>{
  v = String(v||'').toLowerCase();
  if (v.startsWith('ar')) return 'ar';
  if (v.startsWith('en')) return 'en';
  if (v.startsWith('he')) return 'he';
  return getCurrentLang();
};
const normalizeVoice = (v)=>{
  v = String(v||'').toLowerCase();
  if (v.includes('boy')     || v.includes('ولد'))    return 'boy';
  if (v.includes('girl')    || v.includes('بنت'))    return 'girl';
  if (v.includes('teacher') || v.includes('معلم') || v.includes('معلمة')) return 'teacher';
  return 'boy';
};

/* ------------------------------ جلب البيانات ------------------------------ */
async function fetchVegetables() {
  const list = [];
  try {
    const col = collection(db, 'categories', 'vegetables', 'items');
    const snap = await getDocs(col);
    snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
    if (list.length) log('from categories/vegetables/items | count =', list.length);
  } catch (e) {
    warn('categories/vegetables/items failed:', e?.message || e);
  }
  if (!list.length) {
    try {
      const col = collection(db, 'vegetables');
      const snap = await getDocs(col);
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      if (list.length) log('from /vegetables | count =', list.length);
    } catch (e) {
      warn('/vegetables failed:', e?.message || e);
    }
  }
  vegetables = list;
}

/* ----------------------------- قراءات آمنة ----------------------------- */
const nameFor = (d, lang) =>
  d?.name?.[lang] ?? d?.name?.ar ?? d?.name?.en ?? d?.name?.he ?? d?.title ?? d?.word ?? '';

const categoryFor = (d, lang) =>
  d?.category?.[lang] ?? d?.category?.ar ?? d?.category?.en ?? d?.category?.he ?? '';

const descriptionFor = (d, lang) =>
  d?.description?.[lang] ?? d?.description?.ar ?? d?.description?.en ?? d?.description?.he ?? '';

function imageFor(d) {
  let p = d?.image_path || d?.imageFile || d?.image_file || d?.image || d?.img || '';
  if (!p) return '';

  p = norm(p);               // تنظيف المسار
  if (isAbs(p)) return p;    // رابط مطلق أو data:/blob:

  // لو كان مجرد اسم ملف بدون مجلد -> نفترض مجلد الخضروات
  if (!/[\/\\]/.test(p)) {
    p = `images/vegetables/${p}`;
  }

  // لو مخزّن عندك بـ public/... نحذف public/
  p = p.replace(/^public\//, '');

  return `/${p}`;
}

function audioFor(d, lang, voice) {
  let p = null;
  if (d?.sound?.[lang]?.[voice]) p = d.sound[lang][voice];
  else if (d?.sound?.[lang])     p = d.sound[lang];
  else if (d?.sound?.ar?.[voice]) p = d.sound.ar[voice];
  else if (d?.sound?.en?.[voice]) p = d.sound.en[voice];
  else if (d?.sound?.he?.[voice]) p = d.sound.he[voice];
  else if (d?.sound_file)         p = d.sound_file;
  else if (d?.audio)              p = d.audio;
  if (!p) return '';
  return isAbs(p) ? p : ('/' + norm(p));
}

/* ---------------------- تنسيق الاسم (أول حرف باللون الأحمر) ---------------------- */
function splitFirstLetter(str) {
  const s = safeText(str).trim();
  if (!s) return { first: '', rest: '' };
  // أول محرف حرفي/عددي (يدعم العربية/الإنجليزية/العبرية)
  const m = s.match(/([\p{L}\p{N}])/u);
  if (!m) return { first: s[0] || '', rest: s.slice(1) };
  const i = m.index ?? 0;
  return { first: s[i], rest: s.slice(i + 1) };
}
function renderName(name, lang) {
  const el = pick('vegetable-word', 'item-word', 'item-name');
  if (!el) return;
  const { first, rest } = splitFirstLetter(name);
  el.innerHTML = `<span class="first-letter">${first || ''}</span>${rest || ''}`;
  el.dir = (lang === 'ar' || lang === 'he') ? 'rtl' : 'ltr';
}

/* ----------------------------- تحديث الواجهة ----------------------------- */
function setImage(imgEl, src, alt) {
  if (!imgEl) return;
  imgEl.classList.remove('img-error');   // امسح علامة الخطأ قبل المحاولة
  imgEl.alt = safeText(alt);
  if (!src) { imgEl.removeAttribute('src'); return; }
  imgEl.onload  = () => imgEl.classList.remove('img-error');
  imgEl.onerror = () => { imgEl.classList.add('img-error'); warn('missing image', src); };
  imgEl.src = src;
  log('img src =', src);                 // ← لوج مفيد في الـConsole
}


function updateVegetableContent() {
  const lang = getCurrentLang();
  const d = vegetables[currentIndex];
  currentVegData = d;

  renderName(nameFor(d, lang), lang);

  const imgEl = pick('vegetable-image', 'item-image');
  setImage(imgEl, imageFor(d), nameFor(d, lang));

  const catEl = pick('vegetable-category', 'item-category');
  if (catEl) catEl.textContent = categoryFor(d, lang) || '—';

  const descEl = pick('vegetable-description', 'item-description');
  if (descEl) descEl.textContent = descriptionFor(d, lang) || '—';

  log('update', { index: currentIndex, id: d?.id, name: nameFor(d, lang) });
}

/* ------------------------------- الصوت ------------------------------- */
function playCurrentVegetableAudio() {
  if (!currentVegData) return;
  const langSel = grab(['game-lang-select-vegetable', 'game-lang-select-vegetables', 'game-lang-select']);
  const vSel    = grab(['voice-select-vegetable',     'voice-select-vegetables',     'voice-select']);
  const lang    = normalizeLang(langSel?.value || getCurrentLang());
  const voice   = normalizeVoice(vSel?.value || 'boy');
  const path    = audioFor(currentVegData, lang, voice);
  if (path) {
    playAudio(path);
    recordActivity('vegetables', 'listen', { index: currentIndex, lang, voice });
  } else {
    warn('no audio for', currentVegData?.id);
  }
}

/* ------------------------------- ربط الأحداث ------------------------------- */
function bindControls() {
  const prevBtn  = grab(['prev-vegetable-btn','prev-btn']);
  const nextBtn  = grab(['next-vegetable-btn','next-btn']);
  const playBtn  = grab(['play-sound-btn-vegetable','listen','listen-btn']);
  const langSel  = grab(['game-lang-select-vegetable','game-lang-select']);
  const voiceSel = grab(['voice-select-vegetable','voice-select']);
  const toggleDescBtn = grab(['toggle-description-btn','toggle-description']);

  log('bind', {
    'prev-vegetable-btn': !!prevBtn,
    'next-vegetable-btn': !!nextBtn,
    'play-sound-btn-vegetable': !!playBtn,
    'game-lang-select-vegetable': !!langSel,
    'voice-select-vegetable': !!voiceSel,
    'toggle-description-btn': !!toggleDescBtn
  });

  if (prevBtn) prevBtn.onclick = () => {
    if (currentIndex > 0) { currentIndex--; updateVegetableContent(); recordActivity('vegetables', 'prev', { index: currentIndex }); }
  };
  if (nextBtn) nextBtn.onclick = () => {
    if (currentIndex < vegetables.length - 1) { currentIndex++; updateVegetableContent(); recordActivity('vegetables', 'next', { index: currentIndex }); }
  };
  if (playBtn) playBtn.onclick = () => playCurrentVegetableAudio();

  if (langSel) langSel.onchange = async () => {
    const lang = normalizeLang(langSel.value);
    await loadLanguage(lang);
    setDirection(lang);
    applyTranslations();
    updateVegetableContent();
  };
  if (voiceSel) voiceSel.onchange = () => stopCurrentAudio();

  if (toggleDescBtn) {
    toggleDescBtn.onclick = () => {
      const box =
        document.getElementById('vegetable-description-box') ||
        document.querySelector('#vegetables-game .details-area') ||
        document.querySelector('#vegetables-game .info-box');
      if (box) box.style.display = (box.style.display === 'none' ? 'block' : 'none');
    };
  }

  // سماع الصوت بالنقر على الاسم أو الصورة
  const wordEl = pick('vegetable-word','item-word','item-name');
  const imgEl  = pick('vegetable-image','item-image');
  [wordEl, imgEl].forEach(el => { if (el) el.style.cursor = 'pointer'; if (el) el.onclick = () => playCurrentVegetableAudio(); });
}

/* ---------------------------------- تحميل ---------------------------------- */
export async function loadVegetablesGameContent() {
  log('loadVegetablesGameContent()');
  if (!document.getElementById('vegetables-game')) {
    warn('container #vegetables-game not found'); return;
  }
  bindControls();

  await fetchVegetables();
  if (!vegetables.length) { warn('no data'); return; }

  // ترتيب حسب اللغة الحالية
  const lang = getCurrentLang();
  vegetables.sort((a, b) => safeText(nameFor(a, lang)).localeCompare(safeText(nameFor(b, lang))));
  currentIndex = 0;
  updateVegetableContent();
}

// إتاحة دوال للتشخيص
if (typeof window !== 'undefined') {
  window.loadVegetablesGameContent = loadVegetablesGameContent;
  window._vegetables = () => ({ vegetables, currentIndex, currentVegData });
  window.playCurrentVegetableAudio = playCurrentVegetableAudio;
}
