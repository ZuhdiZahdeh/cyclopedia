// src/subjects/professions-game.js
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';
import { fetchSubjectItems } from '../core/items-repo.js';
import { pickLocalized, getImagePath } from '../core/media-utils.js';

// حالة الصفحة
let professions = [];
let currentIndex = 0;
let currentItem  = null;

function $(id){ return document.getElementById(id); }
const isAbs = (p) => /^https?:\/\//i.test(p) || /^data:/i.test(p) || /^blob:/i.test(p);

function getEffectiveLang() {
  return $('game-lang-select-profession')?.value || getCurrentLang();
}

function displayName(item, lang) {
  return pickLocalized(item?.name, lang);
}

function setHighlightedName(el, name) {
  if (!el) return;
  const s = String(name || '');
  el.innerHTML = `<span class="first-letter">${s[0] || ''}</span>${s.slice(1)}`;
}

function resolveImagePath(item) {
  const p = getImagePath(item); // من media.images أو image_path (داخل items)
  return p || '/images/default.png';
}

function audioCandidates(item, lang, voice) {
  let f = null;
  if (item?.sound?.[lang]?.[voice])        f = item.sound[lang][voice];
  else if (item?.voices && item.voices[`${voice}_${lang}`]) f = item.voices[`${voice}_${lang}`];
  else if (item?.voices && item.voices[`${lang}_${voice}`]) f = item.voices[`${lang}_${voice}`];
  else if (item?.sound_base)               f = `${item.sound_base}_${voice}_${lang}.mp3`;
  else if (typeof item?.audio === 'string') f = item.audio;

  if (!f) return [];
  if (isAbs(f) || f.startsWith('/')) return [f];
  const base = f.replace(/^.*\//, '');
  return [
    `/audio/${lang}/professions/${base}`,
    `/audio/${lang}/profession/${base}`,
    `/audio/${lang}/${f.replace(/^public\//, '')}`,
  ];
}

// ———————————————— تحديث الواجهة ————————————————
function updateUI() {
  const lang = getEffectiveLang();

  if (!professions.length) {
    const nameEl = $('profession-word');
    const imgEl  = $('profession-image');
    if (nameEl) nameEl.textContent = '—';
    if (imgEl) { imgEl.removeAttribute('src'); imgEl.alt = ''; }
    return;
  }

  currentItem = professions[currentIndex];
  const name = displayName(currentItem, lang);

  const nameEl = $('profession-word')  || $('item-word')  || $('item-name');
  const imgEl  = $('profession-image') || $('item-image');

  if (nameEl) {
    setHighlightedName(nameEl, name);
    nameEl.style.cursor = 'pointer';
    nameEl.onclick = playCurrentProfessionAudio;
  }

  if (imgEl) {
    const src = resolveImagePath(currentItem);
    imgEl.alt = name || '';
    imgEl.onclick = playCurrentProfessionAudio;
    imgEl.onerror = () => console.warn('[professions] missing image:', src);
    imgEl.src = src;
  }

  const prevBtn = $('prev-profession-btn');
  const nextBtn = $('next-profession-btn');
  if (prevBtn) prevBtn.disabled = (currentIndex === 0 || professions.length <= 1);
  if (nextBtn) nextBtn.disabled = (currentIndex >= professions.length - 1 || professions.length <= 1);

  stopCurrentAudio();
}

// ———————————————— تنقّل/صوت ————————————————
export function showNextProfession() {
  if (!professions.length) return;
  if (currentIndex < professions.length - 1) currentIndex++;
  updateUI();
  try { recordActivity('professions', 'next', { index: currentIndex }); } catch {}
}

export function showPreviousProfession() {
  if (!professions.length) return;
  if (currentIndex > 0) currentIndex--;
  updateUI();
  try { recordActivity('professions', 'prev', { index: currentIndex }); } catch {}
}

export async function playCurrentProfessionAudio() {
  if (!professions.length || !currentItem) return;
  const lang  = getEffectiveLang();
  const voice = $('voice-select-profession')?.value || 'teacher';

  for (const src of audioCandidates(currentItem, lang, voice)) {
    try { stopCurrentAudio(); await Promise.resolve(playAudio(src)); return; }
    catch { /* جرّب التالي */ }
  }
  console.warn('[professions] لا يوجد ملف صوت مناسب');
}

// ———————————————— البيانات: من items فقط ————————————————
async function fetchProfessionsData() {
  const arr = await fetchSubjectItems('professions'); // ← حصريًا من items
  console.log('[professions] ✅ source: items | count =', arr?.length || 0);
  return arr || [];
}

// ———————————————— ربط عناصر التحكم ————————————————
function bindControls() {
  const prevBtn  = $('prev-profession-btn');
  const nextBtn  = $('next-profession-btn');
  const playBtn  = $('play-sound-btn-profession');
  const langSel  = $('game-lang-select-profession');
  const voiceSel = $('voice-select-profession');

  if (prevBtn) prevBtn.onclick = showPreviousProfession;
  if (nextBtn) nextBtn.onclick = showNextProfession;
  if (playBtn) playBtn.onclick = playCurrentProfessionAudio;
  if (voiceSel && !voiceSel.value) voiceSel.value = 'teacher';

  if (langSel) {
    try { langSel.value = getCurrentLang(); } catch {}
    langSel.onchange = async () => {
      const lng = langSel.value;
      await loadLanguage(lng);
      setDirection(lng);
      applyTranslations();
      professions.sort((a, b) => (displayName(a, lng) || '').localeCompare(displayName(b, lng) || ''));
      updateUI();
    };
  }

  const toggleDesc    = $('toggle-description-btn-profession');
  const toggleDetails = $('toggle-details-btn-profession');
  const toggleTools   = $('toggle-tools-btn-profession');

  const toggleDisplay = (id) => {
    const box = $(id);
    if (!box) return;
    const hidden = getComputedStyle(box).display === 'none';
    box.style.display = hidden ? 'block' : 'none';
  };

  if (toggleDesc)    toggleDesc.onclick    = () => toggleDisplay('profession-description-box');
  if (toggleDetails) toggleDetails.onclick = () => toggleDisplay('profession-details-section');
  if (toggleTools)   toggleTools.onclick   = () => toggleDisplay('profession-tools-section');
}

// ———————————————— نقطة الدخول ————————————————
export async function loadProfessionsGameContent() {
  ['prev-profession-btn','next-profession-btn','play-sound-btn-profession'].forEach(id => {
    const b = $(id); if (b) b.disabled = true;
  });

  bindControls();
  professions = await fetchProfessionsData();  // ← من items حصريًا

  if (!professions.length) {
    const nameEl = $('profession-word');
    const imgEl  = $('profession-image');
    if (nameEl) nameEl.textContent = 'لا توجد بيانات';
    if (imgEl)  imgEl.src = '/images/default.png';
    return;
  }

  const lang = getEffectiveLang();
  professions.sort((a, b) => (displayName(a, lang) || '').localeCompare(displayName(b, lang) || ''));
  currentIndex = 0;
  updateUI();

  ['prev-profession-btn','next-profession-btn','play-sound-btn-profession'].forEach(id => {
    const b = $(id); if (b) b.disabled = false;
  });

  if (typeof window !== 'undefined') {
    window.loadProfessionsGameContent = loadProfessionsGameContent;
    window.showNextProfession = showNextProfession;
    window.showPreviousProfession = showPreviousProfession;
    window.playCurrentProfessionAudio = playCurrentProfessionAudio;
  }
}
