// src/subjects/fruits-game.js
import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, setLanguage } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

// الحالة
let fruits = [];
let currentIndex = 0;
let currentFruitData = null;

// عناصر الصفحة
let wordEl, imgEl, catEl, descEl;

// عناصر السايدبار
let prevBtn, nextBtn, playSoundBtn, voiceSelect, langSelect, toggleDescBtn;

// ===== مساعِدات الصور (مرنة للحالات image / image_path / images[0]) =====
const FRUIT_IMAGE_BASE = '/images/fruits/';

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
  return FRUIT_IMAGE_BASE + p;
}
function pickFromImages(images, lang) {
  if (!images) return null;
  if (Array.isArray(images)) {
    const item = images.find(v => typeof v === 'string' || (v && typeof v.src === 'string'));
    if (!item) return null;
    return (typeof item === 'string') ? item : (item[lang] || item.src || item.main || null);
  }
  if (typeof images === 'object') {
    return images[lang] || images.main || images.default ||
           Object.values(images).find(v => typeof v === 'string') || null;
  }
  return null;
}
function getFruitImagePath(d, lang) {
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

// ===== الصوت (مرن لعدة أشكال) =====
function getFruitAudioPath(d, lang, voiceType) {
  const key = `${voiceType}_${lang}`;
  let file;
  if (d?.voices?.[key]) file = d.voices[key];
  else if (d?.sound_base) file = `${d.sound_base}_${voiceType}_${lang}.mp3`;
  else if (d?.sound?.[lang]?.[voiceType]) file = d.sound[lang][voiceType];
  else if (typeof d?.audio === 'string') file = d.audio;
  else return null;

  return (isAbsoluteUrl(file) || file.startsWith('/'))
    ? file
    : `/audio/${lang}/fruits/${file}`;
}

function disableSidebar(dis) {
  [prevBtn, nextBtn, playSoundBtn, voiceSelect, langSelect, toggleDescBtn]
    .forEach(el => el && (el.disabled = !!dis));
}

// ===== تنسيق عنوان الكلمة في الوسط مع حرف أول أحمر =====
function renderTitle(el, text) {
  if (!el) return;
  const t = (text || '').trim();
  if (!t) { el.textContent = '—'; return; }
  const first = t[0];
  const rest  = t.slice(1);
  el.classList.add('item-main-name');           // لتنسيق CSS
  el.innerHTML = `<span class="first-letter">${first}</span>${rest}`;
  el.setAttribute('dir', document.documentElement.getAttribute('dir') || 'rtl');
}

// ===== العرض =====
function updateFruitContent() {
  const lang = getCurrentLang();

  if (!fruits.length) {
    if (wordEl) wordEl.textContent = '—';
    if (imgEl) { imgEl.removeAttribute('src'); imgEl.alt = ''; }
    if (catEl) catEl.textContent = '—';
    if (descEl) descEl.textContent = '—';
    return;
  }

  currentFruitData = fruits[currentIndex];
  const d = currentFruitData;

  const displayName =
    (d.name && (d.name[lang] || d.name.ar || d.name.en || d.name.he)) ||
    d.title || d.word || '—';

  if (wordEl) {
    renderTitle(wordEl, displayName);
    wordEl.onclick = playCurrentFruitAudio;
  }

  const imgPath = getFruitImagePath(d, lang);
  if (imgEl) {
    if (imgPath) { imgEl.src = imgPath; imgEl.alt = displayName; }
    else { imgEl.removeAttribute('src'); imgEl.alt = ''; }
    imgEl.onclick = playCurrentFruitAudio;
  }

  if (catEl) {
    const catList = (d.category && (d.category[lang] || d.category.ar || [])) || [];
    catEl.textContent = Array.isArray(catList) && catList.length ? catList[0] : '—';
  }
  if (descEl) {
    descEl.textContent = (d.description && (d.description[lang] || d.description.ar)) || '—';
  }

  if (nextBtn) nextBtn.disabled = (fruits.length <= 1);
  if (prevBtn) prevBtn.disabled = (fruits.length <= 1);
}

function showNextFruit() {
  if (!fruits.length) return;
  stopCurrentAudio();
  currentIndex = (currentIndex + 1) % fruits.length;
  updateFruitContent();
}
function showPreviousFruit() {
  if (!fruits.length) return;
  stopCurrentAudio();
  currentIndex = (currentIndex - 1 + fruits.length) % fruits.length;
  updateFruitContent();
}
function playCurrentFruitAudio() {
  if (!fruits.length || !currentFruitData) return;
  const lang  = (langSelect && langSelect.value) || getCurrentLang();
  const voice = (voiceSelect && voiceSelect.value) || 'teacher';
  const audio = getFruitAudioPath(currentFruitData, lang, voice);
  if (!audio) return;
  stopCurrentAudio();
  playAudio(audio);
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) recordActivity(user, 'fruits');
  } catch {}
}

// ===== المهيّئ =====
export async function loadFruitsGameContent() {
  stopCurrentAudio();

  // عناصر الصفحة
  wordEl = document.getElementById('fruit-word');
  imgEl  = document.getElementById('fruit-image');
  catEl  = document.getElementById('fruit-category');
  descEl = document.getElementById('fruit-description');

  // عناصر السايدبار
  prevBtn      = document.getElementById('prev-fruit-btn');
  nextBtn      = document.getElementById('next-fruit-btn');
  playSoundBtn = document.getElementById('play-sound-btn-fruit');
  voiceSelect  = document.getElementById('voice-select-fruit');
  langSelect   = document.getElementById('game-lang-select-fruit');
  toggleDescBtn= document.getElementById('toggle-description-btn-fruit');

  if (prevBtn) prevBtn.onclick = showPreviousFruit;
  if (nextBtn) nextBtn.onclick = showNextFruit;
  if (playSoundBtn) playSoundBtn.onclick = playCurrentFruitAudio;

  // تبديل اللغة — استخدم الدالة المركزية
  if (langSelect) {
    langSelect.value = getCurrentLang();
    langSelect.onchange = () => {
      setLanguage(langSelect.value);   // يحدّث dir + يحمّل الترجمة + يخزّنها
    };
    // أعِد الرسم عند اكتمال تغيير اللغة
    document.addEventListener('languageChanged', updateFruitContent, { once:false });
  }

  // زر الوصف (اختياري إن وجد في القالب)
  if (toggleDescBtn) {
    const detailsBox = document.querySelector('#fruits-game .details-area');
    toggleDescBtn.onclick = () => {
      if (!detailsBox) return;
      detailsBox.style.display = (detailsBox.style.display === 'none') ? '' : 'none';
    };
  }

  // جلب البيانات
  fruits = [];
  try {
    const snap = await getDocs(collection(db, 'categories', 'fruits', 'items'));
    fruits = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const lang = getCurrentLang();
    fruits.sort((a, b) => (a?.name?.[lang] || '').localeCompare(b?.name?.[lang] || ''));
  } catch (e) {
    console.error('[fruits] fetch error:', e);
  }

  if (!fruits.length) {
    disableSidebar(true);
    return;
  }

  currentIndex = 0;
  disableSidebar(false);
  updateFruitContent();
}

export { showNextFruit, showPreviousFruit, playCurrentFruitAudio };
