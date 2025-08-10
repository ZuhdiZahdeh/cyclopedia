// src/subjects/tools-game.js

import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

let tools = [];
let currentIndex = 0;
let currentToolData = null;

// لحالة الكاروسيل
let currentToolImages = [];
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
const TOOL_IMAGE_BASE = '/images/profession_tools/';

function normalizeImagePath(p) {
  if (!p) return null;
  p = String(p).trim();
  if (!p) return null;
  if (isAbs(p) || p.startsWith('/')) return p;
  p = p.replace(/^\.?[\\/]+/, '').replace(/\\/g, '/');
  if (p.startsWith('images/')) return '/' + p;
  if (p.startsWith('profession_tools/')) return '/images/' + p;
  return TOOL_IMAGE_BASE + p;
}
function pickFromImages(images, lang){
  if (!images) return null;
  if (Array.isArray(images)) {
    // ابحث عن أول قيمة صالحة
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
function getToolImagePath(d, lang){
  if (typeof d?.image_path === 'string' && d.image_path.trim()){
    return normalizeImagePath(d.image_path);
  }
  const alt = pickFromImages(d?.images, lang) || d?.image;
  return alt ? normalizeImagePath(alt) : '/images/default.png';
}
function getToolImageList(d, lang){
  const list = [];

  // أولوية 1: مصفوفة images
  if (Array.isArray(d?.images)) {
    for (const it of d.images) {
      let src = null;
      if (typeof it === 'string') src = it;
      else if (it && typeof it === 'object') src = it[lang] || it.main || it.src || it.default || null;
      if (src) list.push(normalizeImagePath(src));
    }
  }

  // أولوية 2: كائن images متعدد اللغات
  if (!list.length && d?.images && typeof d.images === 'object') {
    const src = pickFromImages(d.images, lang);
    if (src) list.push(normalizeImagePath(src));
  }

  // أولوية 3: image_path / image منفردة
  if (!list.length) {
    const one = getToolImagePath(d, lang);
    if (one) list.push(one);
  }

  // إزالة التكرار والقيم الفارغة
  return Array.from(new Set(list.filter(Boolean)));
}

/* ===================== أدوات الصوت ===================== */
function getToolAudioPath(d, lang, voiceType){
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
  return (isAbs(file) || file.startsWith('/')) ? file : `/audio/${lang}/tools/${file}`;
}
function translateProfessionKey(key){
  return (window.translations?.professions?.[key]) || key;
}
function setHighlightedName(el, name){
  if (!el) return;
  if (!name) { el.textContent = ''; return; }
  const chars = [...name];
  const first = chars[0] || '';
  el.innerHTML = `<span class="highlight-first-letter">${first}</span>${chars.slice(1).join('')}`;
}

/* ===================== كاروسيل الصور ===================== */
function clearCarousel(){
  const area = document.querySelector('#tools-game .image-area');
  if (!area) return;
  const oldThumbs = area.querySelector('#tool-carousel-thumbs');
  const oldPrev   = area.querySelector('#tool-carousel-prev');
  const oldNext   = area.querySelector('#tool-carousel-next');
  if (oldThumbs) oldThumbs.remove();
  if (oldPrev) oldPrev.remove();
  if (oldNext) oldNext.remove();
}

function buildCarousel(displayName){
  const area = document.querySelector('#tools-game .image-area');
  const mainImg = pick('tool-image');
  if (!area || !mainImg) return;

  clearCarousel();

  if (!currentToolImages || currentToolImages.length <= 1) return;

  // أزرار تنقل
  const prevBtn = document.createElement('button');
  prevBtn.id = 'tool-carousel-prev';
  prevBtn.className = 'carousel-nav prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.textContent = '‹';

  const nextBtn = document.createElement('button');
  nextBtn.id = 'tool-carousel-next';
  nextBtn.className = 'carousel-nav next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.textContent = '›';

  prevBtn.onclick = () => {
    currentImageIndex = (currentImageIndex - 1 + currentToolImages.length) % currentToolImages.length;
    mainImg.src = currentToolImages[currentImageIndex];
    syncThumbsActive();
  };
  nextBtn.onclick = () => {
    currentImageIndex = (currentImageIndex + 1) % currentToolImages.length;
    mainImg.src = currentToolImages[currentImageIndex];
    syncThumbsActive();
  };

  // مصغّرات
  const thumbs = document.createElement('div');
  thumbs.id = 'tool-carousel-thumbs';
  thumbs.className = 'carousel-thumbs';

  currentToolImages.forEach((src, idx) => {
    const t = document.createElement('img');
    t.src = src;
    t.alt = displayName || '';
    t.className = 'carousel-thumb';
    t.onclick = () => {
      currentImageIndex = idx;
      mainImg.src = currentToolImages[currentImageIndex];
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
  const thumbs = document.querySelectorAll('#tool-carousel-thumbs .carousel-thumb');
  thumbs.forEach((img, i) => {
    img.classList.toggle('active', i === currentImageIndex);
  });
}

/* ===================== عرض الأداة الحالية ===================== */
function updateToolContent(){
  const lang = getCurrentLang();

  if (!tools.length){
    const wordEl = pick('tool-word','tool-name');
    const imgEl  = pick('tool-image');
    const descEl = pick('tool-description');
    const profEl = pick('tool-professions');
    if (wordEl) wordEl.textContent = '—';
    if (imgEl)  { imgEl.removeAttribute('src'); imgEl.alt = ''; }
    if (descEl) descEl.textContent = '—';
    if (profEl) profEl.textContent = '—';
    clearCarousel();
    return;
  }

  currentToolData = tools[currentIndex];
  const d = currentToolData;

  const displayName =
    (d.name && (d.name[lang] || d.name.ar || d.name.en || d.name.he)) ||
    d.title || d.word || '';

  const wordEl = pick('tool-word','tool-name');
  const imgEl  = pick('tool-image');
  const descEl = pick('tool-description');
  const profEl = pick('tool-professions');

  if (wordEl){
    setHighlightedName(wordEl, displayName);
    wordEl.classList.add('clickable-text');
    wordEl.onclick = playCurrentToolAudio;
  }

  // صور: المفضّل قائمة كاملة + كاروسيل
  currentToolImages = getToolImageList(d, lang);
  currentImageIndex = 0;

  if (imgEl){
    imgEl.src = currentToolImages[0] || '/images/default.png';
    imgEl.alt = displayName || '';
    imgEl.classList.add('clickable-image');
    imgEl.onclick = playCurrentToolAudio;
  }

  // بناء الكاروسيل (لو أكثر من صورة)
  buildCarousel(displayName);

  if (descEl){
    descEl.textContent = (d.description && (d.description[lang] || d.description.ar || d.description.en)) || '—';
  }
  if (profEl){
    const list = Array.isArray(d.professions) ? d.professions : (d.professions ? Object.values(d.professions) : []);
    profEl.textContent = list.length ? list.map(translateProfessionKey).join('، ') : '—';
  }

  const nextBtn = pick('next-tools-btn');
  const prevBtn = pick('prev-tools-btn');
  if (nextBtn) nextBtn.disabled = (tools.length <= 1 || currentIndex === tools.length - 1);
  if (prevBtn) prevBtn.disabled = (tools.length <= 1 || currentIndex === 0);

  stopCurrentAudio();
}

/* ===================== تنقّل وتشغيل صوت ===================== */
export function showNextTool(){
  if (!tools.length) return;
  if (currentIndex < tools.length - 1) currentIndex++;
  updateToolContent();
  try { const user = JSON.parse(localStorage.getItem('user')); if (user) recordActivity(user, 'tools'); } catch {}
}
export function showPreviousTool(){
  if (!tools.length) return;
  if (currentIndex > 0) currentIndex--;
  updateToolContent();
  try { const user = JSON.parse(localStorage.getItem('user')); if (user) recordActivity(user, 'tools'); } catch {}
}
export function playCurrentToolAudio(){
  if (!tools.length || !currentToolData) return;
  const lang  = (pick('game-lang-select-tools')?.value) || getCurrentLang();
  const voice = (pick('voice-select-tools')?.value) || 'teacher';
  const audio = getToolAudioPath(currentToolData, lang, voice);
  if (!audio) return;
  stopCurrentAudio();
  playAudio(audio);
  try { const user = JSON.parse(localStorage.getItem('user')); if (user) recordActivity(user, 'tools_audio'); } catch {}
}

/* ===================== جلب البيانات ===================== */
async function fetchTools(){
  try {
    const snap = await getDocs(collection(db, 'profession_tools'));
    if (!snap.empty) {
      tools = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return;
    }
  } catch (e) {
    console.warn('[tools] فشل جلب profession_tools:', e);
  }
  // مسار قديم كاحتياط
  try {
    const snap = await getDocs(collection(db, 'categories', 'tools', 'items'));
    if (!snap.empty) {
      tools = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return;
    }
  } catch (e) {
    console.warn('[tools] فشل جلب categories/tools/items:', e);
  }
  tools = [];
}

/* ===================== تحميل السايدبار (controls) ===================== */
async function ensureToolsSidebar(){
  const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
  if (!sidebar) return;

  let container = document.getElementById('tools-sidebar-controls');
  if (container) return; // موجود مسبقاً

  try {
    const resp = await fetch('/html/tools-controls.html', { cache: 'no-store' });
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

    // عرّب النصوص فور الإدراج
    applyTranslations();

  } catch (e) {
    console.warn('[tools] تعذّر تحميل tools-controls.html:', e);
  }
}

/* ===================== تحميل الصفحة ===================== */
export async function loadToolsGameContent(){
  console.log('[tools] loadToolsGameContent()');
  stopCurrentAudio();

  // حقن هيكل HTML إن لم يكن موجودًا
  const main = document.querySelector('main.main-content');
  if (!main){
    console.error('لم يتم العثور على main.main-content');
    return;
  }
  try {
    const resp = await fetch('/html/tools.html', { cache: 'no-store' });
    const html = await resp.text();
    main.innerHTML = html;
  } catch {
    //Fallback بسيط لو فشل الجلب
    main.innerHTML = `
      <section id="tools-game" class="topic-container subject-page">
        <div class="game-box">
          <h2 id="tool-word" class="item-main-name" data-i18n="tools.title">🧰 الأدوات</h2>
          <div class="image-area">
            <img id="tool-image" alt="" src="" loading="lazy" />
          </div>
          <div class="tool-description-box info-box" id="tool-description-box" style="display:none;">
            <h4 data-i18n="common.description">الوصف</h4>
            <p id="tool-description">—</p>
            <p><strong data-i18n="tools.related_professions">المهن المرتبطة</strong>:
               <span id="tool-professions">—</span></p>
          </div>
        </div>
      </section>
    `;
  }

  // حمّل السايدبار ورتّبه قبل قسم الحساب
  await ensureToolsSidebar();

  // عناصر السايدبار
  const prevBtn       = pick('prev-tools-btn');
  const nextBtn       = pick('next-tools-btn');
  const playSoundBtn  = pick('play-sound-btn-tools');
  const voiceSelect   = pick('voice-select-tools');
  const langSelect    = pick('game-lang-select-tools');
  const toggleDescBtn = pick('toggle-description-btn-tools');

  if (prevBtn)      prevBtn.onclick = showPreviousTool;
  if (nextBtn)      nextBtn.onclick = showNextTool;
  if (playSoundBtn) playSoundBtn.onclick = playCurrentToolAudio;
  if (toggleDescBtn){
    toggleDescBtn.onclick = () => {
      const box = document.getElementById('tool-description-box') || document.querySelector('#tools-game .details-area');
      if (box) box.style.display = (box.style.display === 'none' ? 'block' : 'none');
    };
  }
  if (langSelect){
    // ضبط قيمة البداية حسب لغة الواجهة
    try { langSelect.value = getCurrentLang(); } catch {}
    langSelect.onchange = async () => {
      const lng = langSelect.value;
      await loadLanguage(lng);
      setDirection(lng);
      applyTranslations();
      updateToolContent();
    };
  }
  if (voiceSelect && !voiceSelect.value) voiceSelect.value = 'teacher';

  // جلب البيانات + ترتيب + عرض
  tools = [];
  if (prevBtn) prevBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = true;
  if (playSoundBtn) playSoundBtn.disabled = true;

  await fetchTools();

  if (!tools.length){
    const wordEl = pick('tool-word','tool-name');
    const imgEl  = pick('tool-image');
    const descEl = pick('tool-description');
    const profEl = pick('tool-professions');
    if (wordEl) wordEl.textContent = 'لا توجد بيانات';
    if (imgEl)  imgEl.src = '/images/default.png';
    if (descEl) descEl.textContent = '—';
    if (profEl) profEl.textContent = '—';
    clearCarousel();
    return;
  }

  const lang = getCurrentLang();
  tools.sort((a,b) => (a?.name?.[lang] || '').localeCompare(b?.name?.[lang] || ''));

  currentIndex = 0;
  updateToolContent();

  if (prevBtn) prevBtn.disabled = (currentIndex === 0);
  if (nextBtn) nextBtn.disabled = (tools.length <= 1);
  if (playSoundBtn) playSoundBtn.disabled = false;

  applyTranslations();
  setDirection(lang);

  // إتاحة الدوال على window (للاستدعاء من HTML إن لزم)
  if (typeof window !== 'undefined') {
    window.loadToolsGameContent = loadToolsGameContent;
    window.showNextTool = showNextTool;
    window.showPreviousTool = showPreviousTool;
    window.playCurrentToolAudio = playCurrentToolAudio;
  }

  console.log('[tools] initial render done');
}
