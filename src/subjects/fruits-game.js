// src/subjects/fruits-game.js

// ===== Imports (وفق تصحيحك) =====
import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

// ===== State =====
let fruits = [];
let currentIndex = 0;
let currentFruitData = null;

// عناصر المحتوى داخل الصفحة
let wordEl, imgEl, catEl, descEl;

// عناصر السايدبار (موجودة مسبقًا في aside)
let prevBtn, nextBtn, playSoundBtn, voiceSelect, langSelect;

// ===== Utils =====
function getFruitImagePath(d, lang) {
  let path =
    d.image_path ||
    (d.images && (d.images.main || d.images[lang])) ||
    (d.image ? `/images/fruits/${d.image}` : '');
  if (path && !path.startsWith('/')) path = `/${path}`;
  console.log('[fruits][img] →', path || '(no image)');
  return path || null;
}

function getFruitAudioPath(d, lang, voiceType) {
  const key = `${voiceType}_${lang}`;
  let file;

  if (d.voices && d.voices[key]) {
    file = d.voices[key];
    console.log(`[fruits][audio] voices[${key}] → ${file}`);
  } else if (d.sound_base) {
    file = `${d.sound_base}_${voiceType}_${lang}.mp3`;
    console.warn(`[fruits][audio] via sound_base → ${file}`);
  } else if (d.sound && d.sound[lang] && d.sound[lang][voiceType]) {
    file = d.sound[lang][voiceType];
    console.log(`[fruits][audio] legacy map → ${file}`);
  } else {
    console.error('[fruits][audio] no audio fields for:', d?.name?.[lang] || d?.id);
    return null;
  }

  const full = file.startsWith('/') ? file : `/audio/${lang}/fruits/${file}`;
  console.log('[fruits][audio] path →', full);
  return full;
}

function disableSidebar(dis) {
  [prevBtn, nextBtn, playSoundBtn, voiceSelect, langSelect]
    .forEach(el => el && (el.disabled = !!dis));
}

// ===== Render =====
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
    wordEl.textContent = displayName;
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

// ===== Main loader =====
export async function loadFruitsGameContent() {
  console.log('[fruits] loadFruitsGameContent()');

  stopCurrentAudio();

  // عناصر المحتوى داخل الصفحة (من fruits.html)
  wordEl = document.getElementById('fruit-word');
  imgEl  = document.getElementById('fruit-image');
  catEl  = document.getElementById('fruit-category');
  descEl = document.getElementById('fruit-description');

  // عناصر السايدبار (أُضيفت مسبقًا)
  prevBtn      = document.getElementById('prev-fruit-btn');
  nextBtn      = document.getElementById('next-fruit-btn');
  playSoundBtn = document.getElementById('play-sound-btn-fruit');
  voiceSelect  = document.getElementById('voice-select-fruit');
  langSelect   = document.getElementById('game-lang-select-fruit');

  if (prevBtn) prevBtn.onclick = showPreviousFruit;
  if (nextBtn) nextBtn.onclick = showNextFruit;
  if (playSoundBtn) playSoundBtn.onclick = playCurrentFruitAudio;

  if (langSelect) {
    langSelect.onchange = async () => {
      const lng = langSelect.value;
      await loadLanguage(lng);
      setDirection(lng);
      applyTranslations();
      updateFruitContent();
    };
  }

  // =========== فحص جذري مع لوج ===========
  fruits = [];
  try {
    const colRef = collection(db, 'categories', 'fruits', 'items');
    const snap = await getDocs(colRef);

    console.log(`[fruits] fetched count = ${snap.size}`);
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
  console.log('[fruits] initial render done');
}

// (Export handlers لو احتجتها)
export { showNextFruit, showPreviousFruit, playCurrentFruitAudio };
