// src/subjects/human-body-game.js
// صفحة أجزاء الجسم — Carousel + مسارات human-body/human_body + سايدبار جاهز

import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

/* ===================== حالة الصفحة ===================== */
let parts = [];
let currentIndex = 0;
let currentPartData = null;

// للكاروسيل
let currentPartImages = [];
let currentImageIndex = 0;

/* ===================== أدوات عامة ومسارات ===================== */
const pick = (...ids) => {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
};
const isAbs = (p) => /^https?:\/\//i.test(p) || /^data:/i.test(p) || /^blob:/i.test(p);
const norm = (s) => String(s || '').trim().replace(/^\.?[\\/]+/, '').replace(/\\/g, '/');

// يدعم كلا الشكلين human-body و human_body ومجلدات بديلة
const BODY_IMAGE_DIRS = [
  '/images/human-body/',
  '/images/human_body/',
  '/images/humanbody/',
  '/images/body/',
];

const AUDIO_BODY_DIRS = [
  'human-body',
  'body',
  'human_body',
  'humanbody',
  'body_parts',
];

/* ===================== تجهيز الصور (مع بدائل) ===================== */
function buildImageCandidates(d, lang){
  const names = [];

  if (d?.image_path) names.push(d.image_path);

  if (Array.isArray(d?.images)) {
    for (const it of d.images) {
      if (typeof it === 'string') names.push(it);
      else if (it && typeof it === 'object') names.push(it[lang] || it.main || it.src || it.default);
    }
  } else if (d?.images && typeof d.images === 'object') {
    names.push(d.images[lang] || d.images.main || d.images.default);
  }

  if (d?.image) names.push(d.image);

  const candidates = [];
  for (let s of Array.from(new Set(names.filter(Boolean)))) {
    s = norm(s);
    if (isAbs(s) || s.startsWith('/')) { candidates.push(s); continue; }
    if (s.startsWith('images/'))       { candidates.push('/' + s); continue; }
    for (const base of BODY_IMAGE_DIRS) candidates.push(base + s);
  }
  return Array.from(new Set(candidates));
}

function setImageWithFallback(imgEl, candidates){
  let i = 0;
  const tryNext = () => {
    if (!imgEl) return;
    if (i >= candidates.length) { imgEl.src = '/images/default.png'; return; }
    imgEl.onerror = () => { i++; tryNext(); };
    imgEl.src = candidates[i];
  };
  tryNext();
}

/* ===================== تجهيز الصوت (مع بدائل) ===================== */
function buildAudioCandidates(d, lang, voice){
  const key = `${voice}_${lang}`;
  let file = null;

  if (d?.voices && d.voices[key]) file = d.voices[key];
  else if (d?.sound_base)         file = `${d.sound_base}_${voice}_${lang}.mp3`;
  else if (d?.sound?.[lang]?.[voice]) file = d.sound[lang][voice];
  else if (typeof d?.audio === 'string') file = d.audio;

  if (!file) return [];
  const f = norm(file);
  if (isAbs(f) || f.startsWith('/')) return [f];
  return Array.from(new Set(AUDIO_BODY_DIRS.map(dir => `/audio/${lang}/${dir}/${f}`)));
}

/* ===================== التسمية (i18n + تساقط لطيف) ===================== */
function setHighlightedName(el, name){
  if (!el) return;
  if (!name) { el.textContent = ''; return; }
  const chars = [...name];
  const first = chars[0] || '';
  el.innerHTML = `<span class="highlight-first-letter">${first}</span>${chars.slice(1).join('')}`;
}

function getDisplayName(d, lang){
  if (d?.name?.[lang]) return d.name[lang];

  const key = (d?.slug) || (d?.id) || (d?.name?.en) || (d?.name?.ar) || (d?.word) || '';
  const k = String(key).toLowerCase().replace(/\s+/g, '_');
  const dict = window.translations || {};
  const t = (dict.body_words?.[k]) || (dict.body?.[k]);
  if (t && t[lang]) return t[lang];

  return d?.name?.ar || d?.name?.en || d?.name?.he || d?.title || d?.word || '';
}

/* ===================== Carousel ===================== */
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

/* ===================== العرض ===================== */
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

  const displayName = getDisplayName(d, lang);

  const wordEl = pick('body-word');
  const imgEl  = pick('body-image');
  const descEl = pick('body-description');

  if (wordEl){
    setHighlightedName(wordEl, displayName);
    wordEl.classList.add('clickable-text');
    wordEl.onclick = playCurrentBodyAudio;
  }

  currentPartImages = buildImageCandidates(d, lang);
  currentImageIndex = 0;

  if (imgEl){
    setImageWithFallback(imgEl, currentPartImages.length ? currentPartImages : ['/images/default.png']);
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
export async function playCurrentBodyAudio(){
  if (!parts.length || !currentPartData) return;
  const lang  = (pick('game-lang-select-body')?.value) || getCurrentLang();
  const voice = (pick('voice-select-body')?.value) || 'teacher';
  const candidates = buildAudioCandidates(currentPartData, lang, voice);

  for (const src of candidates){
    try {
      stopCurrentAudio();
      const maybe = playAudio(src);
      if (maybe && typeof maybe.then === 'function') await maybe;
      return;
    } catch { /* جرّب التالي */ }
  }
  console.warn('[body][audio] لا يوجد مصدر صوت صالح لهذا العنصر:', currentPartData?.id);
}

/* ===================== جلب البيانات (يطبع المسار الناجح) ===================== */
async function fetchBodyParts(){
  const paths = [
    ['human-body'],
    ['human_body'],
    ['body'],
    ['categories','human-body','items'],
    ['categories','human_body','items'],
    ['categories','body','items'],
  ];
  parts = [];
  for (const segs of paths){
    try {
      const snap = await getDocs(collection(db, ...segs));
      if (!snap.empty) {
        parts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('[body] ✅ fetched from:', segs.join('/'), 'count =', parts.length);
        return;
      } else {
        console.log('[body] empty:', segs.join('/'));
      }
    } catch (e) {
      console.warn('[body] fetch failed:', segs.join('/'), e?.code || e?.message || e);
    }
  }
  console.error('[body] ❌ no collection returned data. Check your path & rules.');
}

/* ===================== تحميل السايدبار ===================== */
async function ensureBodySidebar(){
  const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
  if (!sidebar) return;

  let container = document.getElementById('human-body-sidebar-controls');
  if (container) { container.style.display = 'block'; return; }

  try {
    const resp = await fetch('/html/human-body-controls.html', { cache: 'no-store' });
    const html = await resp.text();
    const tmp = document.createElement('div');
    tmp.innerHTML = html.trim();
    container = tmp.firstElementChild;

    container.id = 'human-body-sidebar-controls';
    container.classList.add('subject-controls');
    container.style.display = 'block';

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

  // أظهر قسم الجسم وأخفِ بقية الأقسام الخاصة بالمواضيع
  try {
    if (window.hideAllControls && window.showSubjectControls) {
      window.hideAllControls();
      window.showSubjectControls('human-body');
    } else {
      document.querySelectorAll('.sidebar-section[id$="-sidebar-controls"]').forEach(sec => {
        sec.style.display = (sec.id === 'human-body-sidebar-controls') ? 'block' : 'none';
      });
    }
  } catch {}

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
      updateBodyContent(); // تحديث الاسم/الصورة حسب اللغة
    };
  }
  if (voiceSelect && !voiceSelect.value) voiceSelect.value = 'teacher';

  // جلب البيانات + ترتيب + عرض
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
