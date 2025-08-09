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

function imgPathOf(d, lang) {
  let path =
    d.image_path ||
    (d.images && (d.images.main || d.images[lang])) ||
    (d.image ? `/images/vegetables/${d.image}` : '');
  if (path && !path.startsWith('/')) path = `/${path}`;
  console.log('[vegetables][img] →', path || '(no image)');
  return path || null;
}

function audioPathOf(d, lang, voiceType) {
  const key = `${voiceType}_${lang}`;
  let file;

  if (d.voices && d.voices[key]) {
    file = d.voices[key];
    console.log(`[vegetables][audio] voices[${key}] → ${file}`);
  } else if (d.sound_base) {
    file = `${d.sound_base}_${voiceType}_${lang}.mp3`;
    console.warn(`[vegetables][audio] via sound_base → ${file}`);
  } else if (d.sound && d.sound[lang] && d.sound[lang][voiceType]) {
    file = d.sound[lang][voiceType];
    console.log(`[vegetables][audio] legacy map → ${file}`);
  } else {
    console.error('[vegetables][audio] no audio fields for:', d?.name?.[lang] || d?.id);
    return null;
  }

  const full = file.startsWith('/') ? file : `/audio/${lang}/vegetables/${file}`;
  console.log('[vegetables][audio] path →', full);
  return full;
}

function disableAll(dis) {
  [prevBtn, nextBtn, playSoundBtn, voiceSelect, langSelect].forEach(el => el && (el.disabled = !!dis));
}

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

  const imgPath = imgPathOf(d, lang);
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

function showNext() {
  if (!vegetables.length) return;
  stopCurrentAudio();
  currentIndex = (currentIndex + 1) % vegetables.length;
  updateVegetableContent();
}

function showPrev() {
  if (!vegetables.length) return;
  stopCurrentAudio();
  currentIndex = (currentIndex - 1 + vegetables.length) % vegetables.length;
  updateVegetableContent();
}

function playCurrentVegetableAudio() {
  if (!vegetables.length || !currentVegetableData) return;
  const lang  = (langSelect && langSelect.value) || getCurrentLang();
  const voice = (voiceSelect && voiceSelect.value) || 'teacher';
  const audio = audioPathOf(currentVegetableData, lang, voice);
  if (!audio) return;
  stopCurrentAudio();
  playAudio(audio);
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) recordActivity(user, 'vegetables');
  } catch {}
}

export async function loadVegetablesGameContent() {
  console.log('[vegetables] loadVegetablesGameContent()');
  stopCurrentAudio();

  wordEl = document.getElementById('vegetable-word');
  imgEl  = document.getElementById('vegetable-image');
  catEl  = document.getElementById('vegetable-category');
  descEl = document.getElementById('vegetable-description');

  prevBtn      = document.getElementById('prev-vegetable-btn');
  nextBtn      = document.getElementById('next-vegetable-btn');
  playSoundBtn = document.getElementById('play-sound-btn-vegetable');
  voiceSelect  = document.getElementById('voice-select-vegetable');
  langSelect   = document.getElementById('game-lang-select-vegetable');

  if (prevBtn) prevBtn.onclick = showPrev;
  if (nextBtn) nextBtn.onclick = showNext;
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

  // =========== فحص جذري مع لوج ===========
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

export { showNext as showNextVegetable, showPrev as showPreviousVegetable, playCurrentVegetableAudio };
