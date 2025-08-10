// src/subjects/human-body-game.js

import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

let parts = [];
let currentIndex = 0;
let currentPartData = null;

// للكاروسيل
let currentPartImages = [];
let currentImageIndex = 0;

/* ===================== أدوات مساعدة عامة ===================== */
const pick = (...ids) => {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
};
const isAbs = (p) => /^https?:\/\//i.test(p) || /^data:/i.test(p) || /^blob:/i.test(p);
const BODY_IMAGE_BASE = '/images/human_body/';

function normalizeImagePath(p) {
  if (!p) return null;
  p = String(p).trim();
  if (!p) return null;
  if (isAbs(p) || p.startsWith('/')) return p;
  p = p.replace(/^\.?[\\/]+/, '').replace(/\\/g, '/');
  if (p.startsWith('images/')) return '/' + p;
  if (p.startsWith('human_body/')) return '/images/' + p;
  return BODY_IMAGE_BASE + p;
}
function pickFromImages(images, lang){
  if (!images) return null;
  if (Array.isArray(images)) {
    for (const it of images) {
      if (typeof it === 'string') return it;
      if (it && typeof it === 'object') {
        if (it[lang]) return it[lang];
        if (it.main) return it.main;
        if (it.src)  return it.src;
        const first = Object.values(it).find(v => typeof v === 'string');
        if (first) return first;
      }
    }
    return null;
  }
  if (typeof images === 'object') {
    if (images[lang]) return images[lang];
    if (images.main) return images.main;
    if (images.default) return images.default;
    const first = Object.values(images).find(v => typeof v === 'string');
    return first || null;
  }
  return null;
}
function getPartImagePath(d, lang){
  if (typeof d?.image_path === 'string' && d.image_path.trim()){
    return normalizeImagePath(d.image_path);
  }
  const alt = pickFromImages(d?.images, lang) || d?.image;
  return alt ? normalizeImagePath(alt) : '/images/default.png';
}
function getPartImageList(d, lang){
  const list = [];

  if (Array.isArray(d?.images)) {
    for (const it of d.images) {
      let src = null;
      if (typeof it === 'string') src = it;
      else if (it && typeof it === 'object') src = it[lang] || it.main || it.src || it.default || null;
      if (src) list.push(normalizeImagePath(src));
    }
  }
  if (!list.length && d?.images && typeof d.images === 'object') {
    const src = pickFromImages(d.images, lang);
    if (src) list.push(normalizeImagePath(src));
  }
  if (!list.length) {
    const one = getPartImagePath(d, lang);
    if (one) list.push(one);
  }
  return Array.from(new Set(list.filter(Boolean)));
}

/* ===================== الصوت ===================== */
function getPartAudioPath(d, lang, voiceType){
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

  // إن لم يكن مسارًا مطلقًا/جذريًا، ابنِه داخل مجلد body (وسيعمل مع human_body أيضًا لو كان الاسم كاملاً)
  return (isAbs(file) || file.startsWith('/')) ? file : `/audio/${lang}/body/${file}`;
}

function setHighlightedName(el, name){
  if (!el) return;
  if (!name) { el.textContent = ''; return; }
  const chars = [...name];
  const first = chars[0] || '';
  el.innerHTML = `<span class="highlight-first-letter">${first}</span>${chars.slice(1).join('')}`;
}

/* ===================== كاروسيل ===================== */
function clearCarousel(){
  const area = document.querySelector('#human-body-game .image-area');
  if (!area) return;
  const oldThumbs = area.querySelector('#body-carousel-thumbs');
  const oldPrev   = area.querySelector('#body-carousel-prev');
  const oldNext   = area.querySelector('#body-carousel-next');
  if (oldThumbs) oldThumbs.remove();
  if (oldPrev) oldPrev.remove();
  if (oldNext) oldNext.remove();
}

function buildCarousel(displayName){
  const area = document.querySelector('#human-body-game .image-area');
  const mainImg = pick('body-image');
  if (!area || !mainImg) return;

  clearCarousel();

  if (!currentPartImages || currentPartImages.length <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.id = 'body-carousel-prev';
  prevBtn.className = 'carousel-nav prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.textContent = '‹';

  const nextBtn = document.createElement('button');
  nextBtn.id = 'body-carousel-next';
  nextBtn.className = 'carousel-nav next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.textContent = '›';

  prevBtn.onclick = () => {
    currentImageIndex = (currentImageIndex - 1 + currentPartImages.length) % currentPartImages.length;
    mainImg.src = currentPartImages[currentImageIndex];
    syncThumbsActive();
  };
  nextBtn.onclick = () => {
    currentImageIndex = (currentImageIndex + 1) % currentPartImages.length;
    mainImg.src = currentPartImages[currentImageIndex];
    syncThumbsActive();
  };

  const thumbs = document.createElement('div');
  thumbs.id = 'body-carousel-thumbs';
  thumbs.className = 'carousel-thumbs';

  currentPartImages.forEach((src, idx) => {
    const t = document.createElement('img');
    t.src = src;
    t.alt = displayName || '';
    t.className = 'carousel-thumb';
    t.onclick = () => {
      currentImageIndex = idx;
      mainImg.src = currentPartImages[currentImageIndex];
      syncThumbsActive();
    };
    thumbs.appendChild(t);
  });

  area.appendChild(prevBtn);
  area.appendChild(nextBtn);
  area.appendChild(thumbs);

  syncThumbsActive();
}

function syncThumbsActive(){
  const thumbs = document.querySelectorAll('#body-carousel-thumbs .carousel-thumb');
  thumbs.forEach((img, i) => {
    img.classList.toggle('active', i === currentImageIndex);
  });
}

/* ===================== عرض الجزء الحالي ===================== */
function updateBodyContent(){
  const lang = getCurrentLang();

  if (!parts.length){
    const wordEl = pick('body-word');
    const imgEl  = pick('body-image');
    const descEl = pick('body-description');
    if (wordEl) wordEl.textContent = '—';
    if (imgEl)  { imgEl.removeAttribute('src'); imgEl.alt = ''; }
    if (descEl) descEl.textContent = '—';
    clearCarousel();
    return;
  }

  currentPartData = parts[currentIndex];
  const d = currentPartData;

  const displayName =
    (d.name && (d.name[lang] || d.name.ar || d.name.en || d.name.he)) ||
    d.title || d.word || '';

  const wordEl = pick('body-word');
  const imgEl  = pick('body-image');
  const descEl = pick('body-description');

  if (wordEl){
    setHighlightedName(wordEl, displayName);
    wordEl.classList.add('clickable-text');
    wordEl.onclick = playCurrentBodyAudio;
  }

  currentPartImages = getPartImageList(d, lang);
  currentImageIndex = 0;

  if (imgEl){
    imgEl.src = currentPartImages[0] || '/images/default.png';
    imgEl.alt = displayName || '';
    imgEl.classList.add('clickable-image');
    imgEl.onclick = playCurrentBodyAudio;
  }

  buildCarousel(displayName);

  if (descEl){
    descEl.textContent = (d.description && (d.description[lang] || d.description.ar || d.description.en)) || '—';
  }

  const nextBtn = pick('next-body-btn');
  const prevBtn = pick('prev-body-btn');
  if (nextBtn) nextBtn.disabled = (parts.length <= 1 || currentIndex === parts.length - 1);
  if (prevBtn) prevBtn.disabled = (parts.length <= 1 || currentIndex === 0);

  stopCurrentAudio();
}

/* ===================== تنقّل وتشغيل صوت ===================== */
export function showNextBodyPart(){
  if (!parts.length) return;
  if (currentIndex < parts.length - 1) currentIndex++;
  updateBodyContent();
  try { const user = JSON.parse(localStorage.getItem('user')); if (user) recordActivity(user, 'body'); } catch {}
}
export function showPreviousBodyPart(){
  if (!parts.length) return;
  if (currentIndex > 0) currentIndex--;
  updateBodyContent();
  try { const user = JSON.parse(localStorage.getItem('user')); if (user) recordActivity(user, 'body'); } catch {}
}
export function playCurrentBodyAudio(){
  if (!parts.length || !currentPartData) return;
  const lang  = (pick('game-lang-select-body')?.value) || getCurrentLang();
  const voice = (pick('voice-select-body')?.value) || 'teacher';
  const audio = getPartAudioPath(currentPartData, lang, voice);
  if (!audio) return;
  stopCurrentAudio();
  playAudio(audio);
  try { const user = JSON.parse(localStorage.getItem('user')); if (user) recordActivity(user, 'body_audio'); } catch {}
}

/* ===================== جلب البيانات ===================== */
async function fetchBodyParts(){
  const candidates = [
    ['human_body'],
    ['body_parts'],
    ['human-body'],
    ['body'],
    ['categories','human_body','items'],
    ['categories','body','items'],
  ];
  for (const segs of candidates){
    try {
      const snap = await getDocs(collection(db, ...segs));
      if (!snap.empty) {
        parts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return;
      }
    } catch (e) {
      console.warn('[body] فشل جلب', segs.join('/'), e);
    }
  }
  parts = [];
}

/* ===================== تحميل السايدبار ===================== */
async function ensureBodySidebar(){
  const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
  if (!sidebar) return;

  let container = document.getElementById('human-body-sidebar-controls');
  if (container) return;

  try {
    const resp = await fetch('/html/human-body-controls.html', { cache: 'no-store' });
    const html = await resp.text();
    const tmp = document.createElement('div');
    tmp.innerHTML = html.trim();
    container = tmp.firstElementChild;

    const accountSection = sidebar.querySelector('.static-section'); // 👤 حسابك
    if (accountSection) {
      sidebar.insertBefore(container, accountSection);
    } else {
      sidebar.appendChild(container);
    }

    applyTranslations();

  } catch (e) {
    console.warn('[body] تعذّر تحميل human-body-controls.html:', e);
  }
}

/* ===================== تحميل الصفحة ===================== */
export async function loadHumanBodyGameContent(){
  console.log('[body] loadHumanBodyGameContent()');
  stopCurrentAudio();

  const main = document.querySelector('main.main-content');
  if (!main){
    console.error('لم يتم العثور على main.main-content');
    return;
  }
  try {
    const resp = await fetch('/html/human-body.html', { cache: 'no-store' });
    const html = await resp.text();
    main.innerHTML = html;
  } catch {
    main.innerHTML = `
      <section id="human-body-game" class="topic-container subject-page">
        <div class="game-box">
          <h2 id="body-word" class="item-main-name" data-i18n="body.title">🧍‍♂️ أجزاء الجسم</h2>
          <div class="image-area">
            <img id="body-image" alt="" src="" loading="lazy" />
          </div>
          <div class="body-description-box info-box" id="body-description-box" style="display:none;">
            <h4 data-i18n="common.description">الوصف</h4>
            <p id="body-description">—</p>
          </div>
        </div>
      </section>
    `;
  }

  await ensureBodySidebar();

  const prevBtn       = pick('prev-body-btn');
  const nextBtn       = pick('next-body-btn');
  const playSoundBtn  = pick('play-sound-btn-body');
  const voiceSelect   = pick('voice-select-body');
  const langSelect    = pick('game-lang-select-body');
  const toggleDescBtn = pick('toggle-description-btn-body');

  if (prevBtn)      prevBtn.onclick = showPreviousBodyPart;
  if (nextBtn)      nextBtn.onclick = showNextBodyPart;
  if (playSoundBtn) playSoundBtn.onclick = playCurrentBodyAudio;
  if (toggleDescBtn){
    toggleDescBtn.onclick = () => {
      const box = document.getElementById('body-description-box') || document.querySelector('#human-body-game .details-area');
      if (box) box.style.display = (box.style.display === 'none' ? 'block' : 'none');
    };
  }
  if (langSelect){
    try { langSelect.value = getCurrentLang(); } catch {}
    langSelect.onchange = async () => {
      const lng = langSelect.value;
      await loadLanguage(lng);
      setDirection(lng);
      applyTranslations();
      updateBodyContent();
    };
  }
  if (voiceSelect && !voiceSelect.value) voiceSelect.value = 'teacher';

  parts = [];
  if (prevBtn) prevBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = true;
  if (playSoundBtn) playSoundBtn.disabled = true;

  await fetchBodyParts();

  if (!parts.length){
    const wordEl = pick('body-word');
    const imgEl  = pick('body-image');
    const descEl = pick('body-description');
    if (wordEl) wordEl.textContent = 'لا توجد بيانات';
    if (imgEl)  imgEl.src = '/images/default.png';
    if (descEl) descEl.textContent = '—';
    clearCarousel();
    return;
  }

  const lang = getCurrentLang();
  parts.sort((a,b) => (a?.name?.[lang] || '').localeCompare(b?.name?.[lang] || ''));

  currentIndex = 0;
  updateBodyContent();

  if (prevBtn) prevBtn.disabled = (currentIndex === 0);
  if (nextBtn) nextBtn.disabled = (parts.length <= 1);
  if (playSoundBtn) playSoundBtn.disabled = false;

  applyTranslations();
  setDirection(lang);

  if (typeof window !== 'undefined') {
    window.loadHumanBodyGameContent = loadHumanBodyGameContent;
    window.showNextBodyPart = showNextBodyPart;
    window.showPreviousBodyPart = showPreviousBodyPart;
    window.playCurrentBodyAudio = playCurrentBodyAudio;
  }

  console.log('[body] initial render done');
}
