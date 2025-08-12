// src/subjects/professions-game.js
import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

let professions = [];
let currentIndex = 0;
let currentItem = null;

// helpers
const $ = (ids) => (Array.isArray(ids) ? ids : [ids]).map(id => document.getElementById(id)).find(Boolean) || null;
const isAbs = (p) => /^https?:\/\//i.test(p) || /^data:/i.test(p) || /^blob:/i.test(p);
const norm  = (s) => String(s || '').trim().replace(/^\.?[\\/]+/, '').replace(/\\/g, '/');

function setHighlightedName(el, name) {
  if (!el) return;
  const s = String(name || '');
  const first = s[0] || '';
  el.innerHTML = `<span class="first-letter">${first}</span>${s.slice(1)}`;
}

function displayName(d, lang) {
  return d?.name?.[lang] ?? d?.name?.ar ?? d?.name?.en ?? d?.name?.he ?? d?.title ?? d?.word ?? '';
}

function resolveImagePath(d) {
  let p = d?.image_path || d?.image || d?.image_file || '';
  if (!p) return '';
  p = String(p).trim();
  if (isAbs(p) || p.startsWith('/')) return p;
  p = norm(p);
  // لا تكرر المسار إن كان يبدأ بـ images/...
  if (p.startsWith('images/')) return `/${p}`;
  return `/images/professions/${p}`;
}

function audioCandidates(d, lang, voice) {
  let f = null;
  if (d?.sound?.[lang]?.[voice]) f = d.sound[lang][voice];
  else if (d?.voices && d.voices[`${voice}_${lang}`]) f = d.voices[`${voice}_${lang}`];
  else if (d?.sound_base) f = `${d.sound_base}_${voice}_${lang}.mp3`;
  else if (typeof d?.audio === 'string') f = d.audio;

  if (!f) return [];
  const file = norm(f);
  if (isAbs(file) || file.startsWith('/')) return [file];

  const base = file.replace(/^.*\//, ''); // اسم الملف فقط
  return [
    `/audio/${lang}/professions/${base}`,
    `/audio/${lang}/profession/${base}`,
    `/audio/${lang}/jobs/${base}`,
    `/audio/${lang}/${file.replace(/^public\//, '')}`
  ];
}

function updateUI() {
  const lang = getCurrentLang();
  if (!professions.length) {
    const nameEl = document.getElementById('profession-word') || document.getElementById('item-word') || document.getElementById('item-name');
    const imgEl  = document.getElementById('profession-image') || document.getElementById('item-image');
    if (nameEl) nameEl.textContent = '—';
    if (imgEl) { imgEl.removeAttribute('src'); imgEl.alt = ''; }
    return;
  }

  currentItem = professions[currentIndex];
  const name   = displayName(currentItem, lang);

  const nameEl = document.getElementById('profession-word') || document.getElementById('item-word') || document.getElementById('item-name');
  const imgEl  = document.getElementById('profession-image') || document.getElementById('item-image');

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

  const prevBtn = $(['prev-profession-btn','prev-professions-btn','prev-btn']);
  const nextBtn = $(['next-profession-btn','next-professions-btn','next-btn']);
  if (prevBtn) prevBtn.disabled = (currentIndex === 0 || professions.length <= 1);
  if (nextBtn) nextBtn.disabled = (currentIndex >= professions.length - 1 || professions.length <= 1);

  stopCurrentAudio();
}

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
  const lang  = (['game-lang-select-profession','game-lang-select-professions','game-lang-select'].map(id => document.getElementById(id)?.value).find(Boolean)) || getCurrentLang();
  const voice = (['voice-select-profession','voice-select-professions','voice-select'].map(id => document.getElementById(id)?.value).find(Boolean)) || 'teacher';

  for (const src of audioCandidates(currentItem, lang, voice)) {
    try { stopCurrentAudio(); await Promise.resolve(playAudio(src)); return; } catch { /* جرّب التالي */ }
  }
  console.warn('[professions] لا يوجد ملف صوت مناسب');
}

async function fetchProfessions() {
  try {
    const snap = await getDocs(collection(db, 'professions'));
    professions = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('[professions] fetched count =', professions.length);
  } catch (e) {
    console.warn('[professions] fetch failed:', e);
    professions = [];
  }
}

function bindControls() {
  const prevBtn  = $(['prev-profession-btn','prev-professions-btn','prev-btn']);
  const nextBtn  = $(['next-profession-btn','next-professions-btn','next-btn']);
  const playBtn  = $(['play-sound-btn-profession','play-sound-btn-professions','listen-btn','listen']);
  const langSel  = $(['game-lang-select-profession','game-lang-select-professions','game-lang-select']);
  const voiceSel = $(['voice-select-profession','voice-select-professions','voice-select']);

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
      professions.sort((a,b) => (displayName(a, lng) || '').localeCompare(displayName(b, lng) || ''));
      updateUI();
    };
  }

  // أزرار العرض/الإخفاء
  const toggleDesc    = document.getElementById('toggle-description-btn');
  const toggleDetails = document.getElementById('toggle-details-btn');
  const toggleTools   = document.getElementById('toggle-tools-btn');

  if (toggleDesc) {
    toggleDesc.onclick = () => {
      const box = document.getElementById('profession-description-box');
      if (box) box.style.display = (box.style.display === 'none' ? 'block' : 'none');
    };
  }
  if (toggleDetails) {
    toggleDetails.onclick = () => {
      const box = document.getElementById('profession-details-section');
      if (box) box.style.display = (box.style.display === 'none' ? 'block' : 'none');
    };
  }
  if (toggleTools) {
    toggleTools.onclick = () => {
      const box = document.getElementById('profession-tools-section');
      if (box) box.style.display = (box.style.display === 'none' ? 'block' : 'none');
    };
  }
}

export async function loadProfessionsGameContent() {
  // تعطيل مبدئي
  ['prev-profession-btn','next-profession-btn','play-sound-btn-profession'].forEach(id => {
    const b = document.getElementById(id); if (b) b.disabled = true;
  });

  bindControls();
  await fetchProfessions();

  if (!professions.length) {
    const nameEl = document.getElementById('profession-word');
    const imgEl  = document.getElementById('profession-image');
    if (nameEl) nameEl.textContent = 'لا توجد بيانات';
    if (imgEl)  imgEl.src = '/images/default.png';
    return;
  }

  const lang = getCurrentLang();
  professions.sort((a,b) => (displayName(a, lang) || '').localeCompare(displayName(b, lang) || ''));
  currentIndex = 0;
  updateUI();

  ['prev-profession-btn','next-profession-btn','play-sound-btn-profession'].forEach(id => {
    const b = document.getElementById(id); if (b) b.disabled = false;
  });

  // للتشخيص / وللاستخدام من main.js عند الحاجة
  if (typeof window !== 'undefined') {
    window.loadProfessionsGameContent = loadProfessionsGameContent;
    window.showNextProfession = showNextProfession;
    window.showPreviousProfession = showPreviousProfession;
    window.playCurrentProfessionAudio = playCurrentProfessionAudio;
  }
}
