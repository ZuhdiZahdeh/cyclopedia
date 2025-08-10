// src/subjects/vegetables-game.js
import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, setLanguage } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

let vegetables = [];
let currentIndex = 0;
let currentVegetableData = null;

let wordEl, imgEl, catEl, descEl;
let prevBtn, nextBtn, playSoundBtn, voiceSelect, langSelect, toggleDescBtn;

// ===================== Image helpers =====================
const VEGETABLE_IMAGE_BASE = '/images/vegetables/';

function isAbsoluteUrl(p) {
  return /^https?:\/\//i.test(p) || /^data:/i.test(p) || /^blob:/i.test(p);
}
function normalizeImagePath(p) {
  if (!p) return null;
  p = String(p).trim();
  if (!p) return null;
  if (isAbsoluteUrl(p) || p.startsWith('/')) return p;
  p = p.replace(/^\.?\/*/, '');
  if (p.startsWith('images/')) return '/' + p;
  return VEGETABLE_IMAGE_BASE + p;
}
function pickFromImages(images, lang) {
  if (!images) return null;
  if (Array.isArray(images)) {
    const item = images.find(v => typeof v === 'string' || (v && typeof v.src === 'string'));
    if (!item) return null;
    return typeof item === 'string' ? item : (item[lang] || item.src || item.main || null);
  }
  if (typeof images === 'object') {
    if (images[lang]) return images[lang];
    if (images.main) return images.main;
    if (images.default) return images.default;
    const firstVal = Object.values(images).find(v => typeof v === 'string');
    if (firstVal) return firstVal;
  }
  return null;
}
function getVegetableImagePath(d, lang) {
  if (typeof d?.image_path === 'string' && d.image_path.trim()) {
    return normalizeImagePath(d.image_path);
  }
  const fromImages = pickFromImages(d?.images, lang);
  if (fromImages) return normalizeImagePath(fromImages);
  if (typeof d?.image === 'string' && d.image.trim()) {
    return normalizeImagePath(d.image);
  }
  return null;
}

// ===================== Audio helpers =====================
function getVegetableAudioPath(d, lang, voiceType) {
  const key = `${voiceType}_${lang}`;
  let file;

  if (d?.voices && d.voices[key]) {
    file = d.voices[key];
  } else if (d?.sound_base) {
    file = `${d.sound_base}_${voiceType}_${lang}.mp3`;
  } else if (d?.sound && d.sound[lang] && d.sound[lang][voiceType]) {
    file = d.sound[lang][voiceType];
  } else if (typeof d?.audio === 'string') {
    file = d.audio;
  } else {
    return null;
  }

  return (isAbsoluteUrl(file) || file.startsWith('/'))
    ? file
    : `/audio/${lang}/vegetables/${file}`;
}

// ===================== UI helpers =====================
function disableAll(dis) {
  [prevBtn, nextBtn, playSoundBtn, voiceSelect, langSelect, toggleDescBtn]
    .forEach(el => el && (el.disabled = !!dis));
}

// ===== عنوان مع حرف أول ملوّن =====
function renderTitle(el, text) {
  if (!el) return;
  const t = (text || '').trim();
  if (!t) { el.textContent = '—'; return; }
  const first = t[0];
  const rest  = t.slice(1);
  el.classList.add('item-main-name');
  el.innerHTML = `<span class="first-letter">${first}</span>${rest}`;
  el.setAttribute('dir', document.documentElement.getAttribute('dir') || 'rtl');
}

// ===================== Render =====================
function updateVegetableContent() {
  const lang = getCurrentLang();

  if (!vegetables.length) {
    if (wordEl) wordEl.textContent = '—';
    if (imgEl) { imgEl.removeAttribute('src'); imgEl.alt = ''; }
    if (catEl) catEl.textContent = '—';
    if (descEl) descEl.textContent = '—';
    return;
  }

  currentVegetableData = vegetables[currentIndex];
  const d = currentVegetableData;

  const displayName =
    (d.name && (d.name[lang] || d.name.ar || d.name.en || d.name.he)) ||
    d.title || d.word || '—';

  if (wordEl) {
    renderTitle(wordEl, displayName);
    wordEl.onclick = playCurrentVegetableAudio;
  }

  const imgPath = getVegetableImagePath(d, lang);
  if (imgEl) {
    if (imgPath) { imgEl.src = imgPath; imgEl.alt = displayName; }
    else { imgEl.removeAttribute('src'); imgEl.alt = ''; }
    imgEl.onclick = playCurrentVegetableAudio;
  }

  if (catEl) {
    const list = (d.category && (d.category[lang] || d.category.ar || [])) || [];
    catEl.textContent = Array.isArray(list) && list.length ? list[0] : '—';
  }
  if (descEl) {
    descEl.textContent = (d.description && (d.description[lang] || d.description.ar)) || '—';
  }

  if (nextBtn) nextBtn.disabled = (vegetables.length <= 1);
  if (prevBtn) prevBtn.disabled = (vegetables.length <= 1);
}

function showNextVegetable() {
  if (!vegetables.length) return;
  stopCurrentAudio();
  currentIndex = (currentIndex + 1) % vegetables.length;
  updateVegetableContent();
}

function showPreviousVegetable() {
  if (!vegetables.length) return;
  stopCurrentAudio();
  currentIndex = (currentIndex - 1 + vegetables.length) % vegetables.length;
  updateVegetableContent();
}

function playCurrentVegetableAudio() {
  if (!vegetables.length || !currentVegetableData) return;
  const lang  = (langSelect && langSelect.value) || getCurrentLang();
  const voice = (voiceSelect && voiceSelect.value) || 'teacher';
  const audio = getVegetableAudioPath(currentVegetableData, lang, voice);
  if (!audio) return;
  stopCurrentAudio();
  playAudio(audio);
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) recordActivity(user, 'vegetables');
  } catch {}
}

// ===================== Loader =====================
export async function loadVegetablesGameContent() {
  stopCurrentAudio();

  // عناصر المحتوى داخل الصفحة (من vegetables.html)
  wordEl = document.getElementById('vegetable-word');
  imgEl  = document.getElementById('vegetable-image');
  catEl  = document.getElementById('vegetable-category');
  descEl = document.getElementById('vegetable-description');

  // عناصر السايدبار
  prevBtn       = document.getElementById('prev-vegetable-btn');
  nextBtn       = document.getElementById('next-vegetable-btn');
  playSoundBtn  = document.getElementById('play-sound-btn-vegetable');
  voiceSelect   = document.getElementById('voice-select-vegetable');
  langSelect    = document.getElementById('game-lang-select-vegetable');
  toggleDescBtn = document.getElementById('toggle-description-btn-vegetable');

  if (prevBtn) prevBtn.onclick = showPreviousVegetable;
  if (nextBtn) nextBtn.onclick = showNextVegetable;
  if (playSoundBtn) playSoundBtn.onclick = playCurrentVegetableAudio;

  // اللغة: توحيد عبر setLanguage
  if (langSelect) {
    langSelect.value = getCurrentLang();
    langSelect.onchange = () => setLanguage(langSelect.value);
    document.addEventListener('languageChanged', updateVegetableContent, { once: false });
  }

  // زر الوصف
  if (toggleDescBtn) {
    const detailsBox =
      document.getElementById('vegetable-description-box') ||
      document.querySelector('#vegetables-game .details-area') ||
      (descEl ? descEl.closest('.info-box') : null);
    toggleDescBtn.onclick = () => {
      if (!detailsBox) return;
      detailsBox.style.display = (detailsBox.style.display === 'none') ? '' : 'none';
      toggleDescBtn.setAttribute('aria-pressed', detailsBox.style.display !== 'none');
    };
  }

  // =========== جلب البيانات ===========
  vegetables = [];
  try {
    const colRef = collection(db, 'categories', 'vegetables', 'items');
    const snap = await getDocs(colRef);
    vegetables = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const lang = getCurrentLang();
    vegetables.sort((a, b) => (a?.name?.[lang] || '').localeCompare(b?.name?.[lang] || ''));
  } catch (e) {
    console.error('[vegetables] fetch error:', e);
  }

  if (!vegetables.length) {
    disableAll(true);
    return;
  }

  currentIndex = 0;
  disableAll(false);
  updateVegetableContent();
}

export {
  showNextVegetable,
  showPreviousVegetable,
  playCurrentVegetableAudio
};
