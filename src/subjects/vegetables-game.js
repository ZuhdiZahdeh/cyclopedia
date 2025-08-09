// src/subjects/vegetables-game.js

import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

let vegetables = [];
let currentIndex = 0;
let currentVegetableData = null;

let wordEl, imgEl, catEl, descEl;
let prevBtn, nextBtn, playSoundBtn, voiceSelect, langSelect;

// ===================== Image helpers =====================
const VEGETABLE_IMAGE_BASE = '/images/vegetables/';

function isAbsoluteUrl(p) {
  return /^https?:\/\//i.test(p) || /^data:/i.test(p) || /^blob:/i.test(p);
}

function normalizeImagePath(p) {
  if (!p) return null;
  p = String(p).trim();
  if (!p) return null;

  // URL مطلق أو يبدأ بـ /
  if (isAbsoluteUrl(p) || p.startsWith('/')) return p;

  // أزل ./ أو / زائدة
  p = p.replace(/^\.?\/*/, '');

  // أعطيته مسارًا داخل images/
  if (p.startsWith('images/')) return '/' + p;

  // خلاف ذلك اعتبره اسم ملف داخل مجلد الخضروات
  return VEGETABLE_IMAGE_BASE + p;
}

function pickFromImages(images, lang) {
  if (!images) return null;

  // Array: أول عنصر صالح (string أو كائن يحوي src/لغة)
  if (Array.isArray(images)) {
    const item = images.find(v => typeof v === 'string' || (v && typeof v.src === 'string'));
    if (!item) return null;
    return typeof item === 'string' ? item : (item[lang] || item.src || item.main || null);
  }

  // Object: نفضّل لغة الواجهة ثم main/default ثم أي قيمة نصية
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
  // 1) image_path مسار جاهز
  if (typeof d?.image_path === 'string' && d.image_path.trim()) {
    const path = normalizeImagePath(d.image_path);
    console.log('[vegetables][img] image_path →', path);
    return path;
  }

  // 2) images (Array/Object)
  const fromImages = pickFromImages(d?.images, lang);
  if (fromImages) {
    const path = normalizeImagePath(fromImages);
    console.log('[vegetables][img] images →', path);
    return path;
  }

  // 3) image اسم ملف داخل مجلد الخضروات
  if (typeof d?.image === 'string' && d.image.trim()) {
    const path = normalizeImagePath(d.image);
    console.log('[vegetables][img] image →', path);
    return path;
  }

  console.warn('[vegetables][img] لا يوجد حقل صورة صالح:', d?.id);
  return null;
}

// ===================== Audio helpers =====================
function getVegetableAudioPath(d, lang, voiceType) {
  const key = `${voiceType}_${lang}`;
  let file;

  if (d?.voices && d.voices[key]) {
    file = d.voices[key];
    console.log(`[vegetables][audio] voices[${key}] → ${file}`);
  } else if (d?.sound_base) {
    file = `${d.sound_base}_${voiceType}_${lang}.mp3`;
    console.warn(`[vegetables][audio] via sound_base → ${file}`);
  } else if (d?.sound && d.sound[lang] && d.sound[lang][voiceType]) {
    file = d.sound[lang][voiceType];
    console.log(`[vegetables][audio] legacy map → ${file}`);
  } else if (typeof d?.audio === 'string') {
    file = d.audio;
    console.log('[vegetables][audio] audio (flat) →', file);
  } else {
    console.error('[vegetables][audio] لا يوجد صوت لهذا العنصر:', d?.name?.[lang] || d?.id);
    return null;
  }

  const full = (isAbsoluteUrl(file) || file.startsWith('/'))
    ? file
    : `/audio/${lang}/vegetables/${file}`;
  console.log('[vegetables][audio] path →', full);
  return full;
}

// ===================== UI helpers =====================
function disableAll(dis) {
  [prevBtn, nextBtn, playSoundBtn, voiceSelect, langSelect].forEach(el => el && (el.disabled = !!dis));
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
    wordEl.textContent = displayName;
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
  console.log('[vegetables] loadVegetablesGameContent()');
  stopCurrentAudio();

  // عناصر المحتوى داخل الصفحة (من vegetables.html)
  wordEl = document.getElementById('vegetable-word');
  imgEl  = document.getElementById('vegetable-image');
  catEl  = document.getElementById('vegetable-category');
  descEl = document.getElementById('vegetable-description');

  // عناصر السايدبار
  prevBtn      = document.getElementById('prev-vegetable-btn');
  nextBtn      = document.getElementById('next-vegetable-btn');
  playSoundBtn = document.getElementById('play-sound-btn-vegetable');
  voiceSelect  = document.getElementById('voice-select-vegetable');
  langSelect   = document.getElementById('game-lang-select-vegetable');

  if (prevBtn) prevBtn.onclick = showPreviousVegetable;
  if (nextBtn) nextBtn.onclick = showNextVegetable;
  if (playSoundBtn) playSoundBtn.onclick = playCurrentVegetableAudio;

  if (langSelect) {
    langSelect.onchange = async () => {
      const lng = langSelect.value;
      await loadLanguage(lng);
      setDirection(lng);
      applyTranslations();
      updateVegetableContent();
    };
  }

  // =========== جلب البيانات ===========
  vegetables = [];
  try {
    const colRef = collection(db, 'categories', 'vegetables', 'items');
    const snap = await getDocs(colRef);

    console.log(`[vegetables] fetched count = ${snap.size}`);
    snap.forEach(doc => {
      const data = doc.data();
      console.log(`  • ${doc.id}`, {
        name: data?.name,
        image_path: data?.image_path,
        images: data?.images,
        image: data?.image,
        category: data?.category,
        description: data?.description,
        sound_base: data?.sound_base,
        voices: data?.voices ? Object.keys(data.voices) : undefined,
        sound: data?.sound
      });
    });

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
  console.log('[vegetables] initial render done');
}

export {
  showNextVegetable,
  showPreviousVegetable,
  playCurrentVegetableAudio
};
