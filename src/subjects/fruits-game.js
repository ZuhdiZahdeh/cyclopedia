// ===== Imports (كما لديك) =====
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

// ===== Image helpers =====
const FRUIT_IMAGE_BASE = '/images/fruits/';

function isAbsoluteUrl(p) {
  return /^https?:\/\//i.test(p) || /^data:/i.test(p) || /^blob:/i.test(p);
}

function normalizeImagePath(p) {
  if (!p) return null;
  p = String(p).trim();
  if (!p) return null;

  // لو مسار مطلق (URL أو يبدأ بـ /) أرجعه كما هو
  if (isAbsoluteUrl(p) || p.startsWith('/')) return p;

  // أزل ./ أو / زائدة في البداية
  p = p.replace(/^\.?\/*/, '');

  // لو أعطيته مسارًا كاملاً داخل images/ فأضف /
  if (p.startsWith('images/')) return '/' + p;

  // خلاف ذلك اعتبره اسم ملف داخل /images/fruits/
  return FRUIT_IMAGE_BASE + p;
}

function pickFromImages(images, lang) {
  if (!images) return null;

  // Array: نأخذ أول قيمة صالحة (string) أو كائن فيه src
  if (Array.isArray(images)) {
    const item = images.find(v => typeof v === 'string' || (v && typeof v.src === 'string'));
    if (!item) return null;
    return typeof item === 'string' ? item : (item[lang] || item.src || item.main || null);
  }

  // Object: نفضّل لغة الواجهة ثم main/default ثم أول قيمة
  if (typeof images === 'object') {
    if (images[lang]) return images[lang];
    if (images.main) return images.main;
    if (images.default) return images.default;
    const firstVal = Object.values(images).find(v => typeof v === 'string');
    if (firstVal) return firstVal;
  }

  return null;
}

function getFruitImagePath(d, lang) {
  // 1) image_path مسار جاهز
  if (typeof d?.image_path === 'string' && d.image_path.trim()) {
    const path = normalizeImagePath(d.image_path);
    console.log('[fruits][img] image_path →', path);
    return path;
  }

  // 2) images كـ Array أو Object
  const fromImages = pickFromImages(d?.images, lang);
  if (fromImages) {
    const path = normalizeImagePath(fromImages);
    console.log('[fruits][img] images →', path);
    return path;
  }

  // 3) image اسم ملف داخل /images/fruits/
  if (typeof d?.image === 'string' && d.image.trim()) {
    const path = normalizeImagePath(d.image);
    console.log('[fruits][img] image →', path);
    return path;
  }

  console.warn('[fruits][img] لا يوجد أي حقل صورة صالح لهذا العنصر:', d?.id);
  return null;
}

// ===== Audio helpers (مرن لعدة أشكال كما لديك) =====
function getFruitAudioPath(d, lang, voiceType) {
  const key = `${voiceType}_${lang}`;
  let file;

  if (d?.voices && d.voices[key]) {
    file = d.voices[key];
    console.log(`[fruits][audio] voices[${key}] → ${file}`);
  } else if (d?.sound_base) {
    file = `${d.sound_base}_${voiceType}_${lang}.mp3`;
    console.warn(`[fruits][audio] via sound_base → ${file}`);
  } else if (d?.sound && d.sound[lang] && d.sound[lang][voiceType]) {
    file = d.sound[lang][voiceType];
    console.log(`[fruits][audio] legacy map → ${file}`);
  } else if (typeof d?.audio === 'string') {
    file = d.audio;
    console.log('[fruits][audio] audio (flat) →', file);
  } else {
    console.error('[fruits][audio] لا يوجد صوت لهذا العنصر:', d?.name?.[lang] || d?.id);
    return null;
  }

  const full = (isAbsoluteUrl(file) || file.startsWith('/'))
    ? file
    : `/audio/${lang}/fruits/${file}`;
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

  // =========== جلب البيانات ===========
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
