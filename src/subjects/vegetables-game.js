// src/subjects/vegetables-game.js
// نسخة مستقرة: تربط الأزرار بصيغ (vegetable/vegetables) + تصحيح زر الوصف + تنسيق اللوج

import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

let vegetables = [];
let currentIndex = 0;
let currentVegData = null;

/* -------------------------- أدوات مساعدة -------------------------- */
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
const norm = (s) => String(s || '').trim().replace(/^\.?[\\/]+/, '').replace(/\\/g, '/');

const log = (...args) => console.log('[vegetables]', ...args);
const warn = (...args) => console.warn('[vegetables]', ...args);

/* ------------------------------ جلب البيانات ------------------------------ */
async function fetchVegetables() {
  const list = [];
  // 1) المسار المهيكل: categories/vegetables/items
  try {
    const col = collection(db, 'categories', 'vegetables', 'items');
    const snap = await getDocs(col);
    snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
    if (list.length) log('from categories/vegetables/items | count =', list.length);
  } catch (e) {
    warn('categories/vegetables/items failed:', e?.message || e);
  }
  // 2) المسار المسطح: /vegetables
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
function nameFor(d, lang) {
  return d?.name?.[lang] ?? d?.name?.ar ?? d?.name?.en ?? d?.name?.he ?? d?.title ?? d?.word ?? '';
}
function categoryFor(d, lang) {
  return d?.category?.[lang] ?? d?.category?.ar ?? d?.category?.en ?? d?.category?.he ?? '';
}
function descriptionFor(d, lang) {
  return d?.description?.[lang] ?? d?.description?.ar ?? d?.description?.en ?? d?.description?.he ?? '';
}
function imageFor(d) {
  const p = d?.image_path || d?.imageFile || d?.image_file || d?.image || d?.img || '';
  if (!p) return '';
  return isAbs(p) ? p : ('/' + norm(p));
}
function audioFor(d, lang, voice) {
  let p = null;
  if (d?.sound?.[lang]?.[voice]) p = d.sound[lang][voice];
  else if (d?.sound?.[lang]) p = d.sound[lang];
  else if (d?.sound?.[voice]) p = d.sound[voice];
  else if (d?.sound_file) p = d.sound_file;
  else if (d?.audio) p = d.audio;
  if (!p) return '';
  return isAbs(p) ? p : ('/' + norm(p));
}

/* ----------------------------- تحديث الواجهة ----------------------------- */
function updateVegetableContent() {
  const lang = getCurrentLang();
  const d = vegetables[currentIndex];
  currentVegData = d;

  const wordEl = pick('vegetable-word', 'item-word', 'item-name');
  if (wordEl) wordEl.textContent = nameFor(d, lang);

  const imgEl = pick('vegetable-image', 'item-image');
  if (imgEl) {
    const src = imageFor(d);
    if (src) imgEl.src = src;
    imgEl.alt = nameFor(d, lang);
  }

  const catEl = pick('vegetable-category', 'item-category');
  if (catEl) catEl.textContent = categoryFor(d, lang) || '—';

  const descEl = pick('vegetable-description', 'item-description');
  if (descEl) descEl.textContent = descriptionFor(d, lang) || '—';

  log('update', { index: currentIndex, id: d?.id, name: nameFor(d, lang) });
}

/* ------------------------------- تشغيل الصوت ------------------------------- */
function playCurrentVegetableAudio() {
  if (!currentVegData) return;
  const langSel = grab(['game-lang-select-vegetable', 'game-lang-select-vegetables', 'game-lang-select']);
  const vSel   = grab(['voice-select-vegetable', 'voice-select-vegetables', 'voice-select']);
  const lang   = langSel?.value || getCurrentLang();
  const voice  = vSel?.value || 'boy';
  const path   = audioFor(currentVegData, lang, voice);
  if (path) playAudio(path);
  else warn('no audio for', currentVegData?.id);
}

/* ------------------------------- ربط الأحداث ------------------------------- */
function bindControls() {
  const prevBtn  = grab(['prev-vegetable-btn',  'prev-vegetables-btn',  'prev-btn']);
  const nextBtn  = grab(['next-vegetable-btn',  'next-vegetables-btn',  'next-btn']);
  const playBtn  = grab(['play-sound-btn-vegetable','play-sound-btn-vegetables','listen-btn','listen']);
  const langSel  = grab(['game-lang-select-vegetable', 'game-lang-select-vegetables', 'game-lang-select']);
  const voiceSel = grab(['voice-select-vegetable', 'voice-select-vegetables', 'voice-select']);
  const toggleDescBtn = grab(['toggle-description-btn', 'toggle-description-btn-vegetables', 'toggle-description', 'desc-btn']);

  log('bind', {
    'prev-vegetable-btn': !!document.getElementById('prev-vegetable-btn'),
    'prev-vegetables-btn': !!document.getElementById('prev-vegetables-btn'),
    'next-vegetable-btn': !!document.getElementById('next-vegetable-btn'),
    'next-vegetables-btn': !!document.getElementById('next-vegetables-btn'),
    'play-sound-btn-vegetable': !!document.getElementById('play-sound-btn-vegetable'),
    'play-sound-btn-vegetables': !!document.getElementById('play-sound-btn-vegetables'),
    'game-lang-select-vegetable': !!document.getElementById('game-lang-select-vegetable'),
    'voice-select-vegetable': !!document.getElementById('voice-select-vegetable'),
    'toggle-description-btn': !!document.getElementById('toggle-description-btn'),
    'toggle-description-btn-vegetables': !!document.getElementById('toggle-description-btn-vegetables'),
  });

  if (prevBtn) prevBtn.onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateVegetableContent();
      recordActivity('vegetables', 'prev', { index: currentIndex });
    }
  };

  if (nextBtn) nextBtn.onclick = () => {
    if (currentIndex < vegetables.length - 1) {
      currentIndex++;
      updateVegetableContent();
      recordActivity('vegetables', 'next', { index: currentIndex });
    }
  };

  if (playBtn) playBtn.onclick = () => {
    playCurrentVegetableAudio();
    recordActivity('vegetables', 'listen', { index: currentIndex });
  };

  if (langSel) langSel.onchange = async () => {
    const lang = langSel.value;
    await loadLanguage(lang);
    setDirection(lang);
    applyTranslations();
    updateVegetableContent();
  };

  if (voiceSel) voiceSel.onchange = () => {
    stopCurrentAudio();
  };

  if (toggleDescBtn) {
    toggleDescBtn.onclick = () => {
      const box =
        document.getElementById('vegetable-description-box') ||
        document.querySelector('#vegetables-game .details-area') ||
        document.querySelector('#vegetables-game .info-box');
      if (box) box.style.display = (box.style.display === 'none' ? 'block' : 'none');
    };
  }
}

/* ---------------------------------- تحميل ---------------------------------- */
export async function loadVegetablesGameContent() {
  log('loadVegetablesGameContent()');

  if (!document.getElementById('vegetables-game')) {
    warn('container #vegetables-game not found');
    return;
  }

  // ربط عناصر التحكم (بعد حقن controls HTML)
  bindControls();

  // جلب البيانات
  await fetchVegetables();
  if (!vegetables.length) {
    warn('no data');
    const img = pick('vegetable-image', 'item-image'); if (img) img.alt = '';
    const word = pick('vegetable-word', 'item-word'); if (word) word.textContent = '';
    const desc = pick('vegetable-description', 'item-description'); if (desc) desc.textContent = '—';
    return;
  }

  const lang = getCurrentLang();
  vegetables.sort((a, b) => safeText(nameFor(a, lang)).localeCompare(safeText(nameFor(b, lang))));
  currentIndex = 0;
  updateVegetableContent();
}

if (typeof window !== 'undefined') {
  window.loadVegetablesGameContent = loadVegetablesGameContent;
  window._vegetables = () => ({ vegetables, currentIndex, currentVegData });
  window.playCurrentVegetableAudio = playCurrentVegetableAudio;
}
