// src/subjects/human-body-game.js
import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

/* --------------------- حالة الصفحة --------------------- */
let items = [];
let currentIndex = 0;
let currentData = null;

// عناصر المحتوى (نلتقطها بمرونة مع أكثر من id محتمل)
let wordEl, imgEl, catEl, descEl;
// عناصر السايدبار الخاصة بالموضوع (اختيارية إن وُجدت)
let prevBtn, nextBtn, playSoundBtn, voiceSelect, langSelect;

/* --------------------- أدوات مساعدة عامة --------------------- */
function pickEl(...ids) {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
}

function isAbsoluteUrl(p) {
  return /^https?:\/\//i.test(p) || /^data:/i.test(p) || /^blob:/i.test(p);
}

function normalizeAssetPath(p, baseCandidates) {
  if (!p) return null;
  p = String(p).trim();
  if (!p) return null;

  // لو مطلق (URL) أو يبدأ بـ /
  if (isAbsoluteUrl(p) || p.startsWith('/')) return p;

  // أزل ./ أو / في البداية
  p = p.replace(/^\.?\/*/, '');

  // لو أُعطي مسارًا يبدأ بـ images/ أو audio/ فثبّته ببساطة
  if (p.startsWith('images/') || p.startsWith('audio/')) return '/' + p;

  // لو أُعطي مسارًا نسبيًا يتضمن المجلد الصحيح فعلًا
  for (const base of baseCandidates) {
    const baseNoSlash = base.replace(/^\//, '');
    if (p.startsWith(baseNoSlash)) return '/' + p;
  }

  // خلاف ذلك: عامله كاسم ملف داخل أول قاعدة
  return baseCandidates[0] + p;
}

function pickFromImages(images, lang) {
  if (!images) return null;

  // Array
  if (Array.isArray(images)) {
    const item = images.find(v => typeof v === 'string' || (v && typeof v.src === 'string'));
    if (!item) return null;
    return typeof item === 'string' ? item : (item[lang] || item.src || item.main || null);
  }

  // Object
  if (typeof images === 'object') {
    if (images[lang]) return images[lang];
    if (images.main) return images.main;
    if (images.default) return images.default;
    const firstVal = Object.values(images).find(v => typeof v === 'string');
    if (firstVal) return firstVal;
  }
  return null;
}

/* --------------------- الصور والصوت (مرن) --------------------- */
const IMAGE_BASES = ['/images/human_body/', '/images/human-body/', '/images/body/'];

function getBodyImagePath(d, lang) {
  // 1) image_path
  if (typeof d?.image_path === 'string' && d.image_path.trim()) {
    const path = normalizeAssetPath(d.image_path, IMAGE_BASES);
    console.log('[body][img] image_path →', path);
    return path;
  }
  // 2) images
  const fromImages = pickFromImages(d?.images, lang);
  if (fromImages) {
    const path = normalizeAssetPath(fromImages, IMAGE_BASES);
    console.log('[body][img] images →', path);
    return path;
  }
  // 3) image (اسم ملف)
  if (typeof d?.image === 'string' && d.image.trim()) {
    const path = normalizeAssetPath(d.image, IMAGE_BASES);
    console.log('[body][img] image →', path);
    return path;
  }
  console.warn('[body][img] لا يوجد حقل صورة صالح:', d?.id);
  return null;
}

function audioBases(lang) {
  return [`/audio/${lang}/human_body/`, `/audio/${lang}/human-body/`, `/audio/${lang}/body/`];
}

function getBodyAudioPath(d, lang, voiceType) {
  const key = `${voiceType}_${lang}`;
  let file;

  if (d?.voices && d.voices[key]) {
    file = d.voices[key];
    console.log(`[body][audio] voices[${key}] → ${file}`);
  } else if (d?.sound_base) {
    file = `${d.sound_base}_${voiceType}_${lang}.mp3`;
    console.warn(`[body][audio] via sound_base → ${file}`);
  } else if (d?.sound && d.sound[lang] && d.sound[lang][voiceType]) {
    file = d.sound[lang][voiceType];
    console.log(`[body][audio] legacy map → ${file}`);
  } else if (typeof d?.audio === 'string') {
    file = d.audio;
    console.log('[body][audio] audio (flat) →', file);
  } else {
    console.error('[body][audio] لا يوجد صوت لهذا العنصر:', d?.name?.[lang] || d?.id);
    return null;
  }

  return normalizeAssetPath(file, audioBases(lang));
}

/* --------------------- واجهة --------------------- */
function setDisabled(dis) {
  [prevBtn, nextBtn, playSoundBtn, voiceSelect, langSelect].forEach(el => el && (el.disabled = !!dis));
}

function updateBodyContent() {
  const lang = getCurrentLang();

  if (!items.length) {
    if (wordEl) wordEl.textContent = '—';
    if (imgEl) { imgEl.removeAttribute('src'); imgEl.alt = ''; }
    if (catEl) catEl.textContent = '—';
    if (descEl) descEl.textContent = '—';
    return;
  }

  currentData = items[currentIndex];
  const d = currentData;

  const displayName =
    (d.name && (d.name[lang] || d.name.ar || d.name.en || d.name.he)) ||
    d.title || d.word || '—';

  if (wordEl) {
    wordEl.textContent = displayName;
    wordEl.onclick = playCurrentBodyAudio;
  }

  const imgPath = getBodyImagePath(d, lang);
  if (imgEl) {
    if (imgPath) { imgEl.src = imgPath; imgEl.alt = displayName; }
    else { imgEl.removeAttribute('src'); imgEl.alt = ''; }
    imgEl.onclick = playCurrentBodyAudio;
  }

  if (catEl) {
    const cat = (d.category && (d.category[lang] || d.category.ar || d.category.en)) || null;
    catEl.textContent = Array.isArray(cat) ? (cat[0] || '—') : (cat || '—');
  }

  if (descEl) {
    descEl.textContent = (d.description && (d.description[lang] || d.description.ar || d.description.en)) || '—';
  }

  if (nextBtn) nextBtn.disabled = (items.length <= 1);
  if (prevBtn) prevBtn.disabled = (items.length <= 1);
}

function showNextBody() {
  if (!items.length) return;
  stopCurrentAudio();
  currentIndex = (currentIndex + 1) % items.length;
  updateBodyContent();
}

function showPreviousBody() {
  if (!items.length) return;
  stopCurrentAudio();
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateBodyContent();
}

function playCurrentBodyAudio() {
  if (!items.length || !currentData) return;
  const lang  = (langSelect && langSelect.value) || getCurrentLang();
  const voice = (voiceSelect && voiceSelect.value) || 'teacher';
  const audio = getBodyAudioPath(currentData, lang, voice);
  if (!audio) return;
  stopCurrentAudio();
  playAudio(audio);
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) recordActivity(user, 'human-body');
  } catch {}
}

/* --------------------- تحميل البيانات --------------------- */
async function fetchFirstNonEmptyCollection() {
  const candidates = [
    ['categories', 'human_body', 'items'],
    ['categories', 'human-body', 'items'],
    ['categories', 'body', 'items']
  ];
  for (const segs of candidates) {
    try {
      const col = collection(db, ...segs);
      const snap = await getDocs(col);
      if (!snap.empty) return { snap, path: segs.join('/') };
    } catch (e) {
      // تجاهل وحاول التالي
    }
  }
  return null;
}

export async function loadHumanBodyGameContent() {
  console.log('[body] loadHumanBodyGameContent()');

  stopCurrentAudio();

  // عناصر المحتوى داخل human-body.html (ندعم أكثر من id لضمان التوافق)
  wordEl = pickEl('human-body-word', 'body-word');
  imgEl  = pickEl('human-body-image', 'body-image');
  catEl  = pickEl('human-body-category', 'body-category');
  descEl = pickEl('human-body-description', 'body-description');

  // عناصر السايدبار (إن وُجدت)
  prevBtn      = pickEl('prev-human-body-btn', 'prev-body-btn');
  nextBtn      = pickEl('next-human-body-btn', 'next-body-btn');
  playSoundBtn = pickEl('play-sound-btn-human-body', 'play-sound-btn-body');
  voiceSelect  = pickEl('voice-select-human-body', 'voice-select-body');
  langSelect   = pickEl('game-lang-select-human-body', 'game-lang-select-body');

  if (prevBtn) prevBtn.onclick = showPreviousBody;
  if (nextBtn) nextBtn.onclick = showNextBody;
  if (playSoundBtn) playSoundBtn.onclick = playCurrentBodyAudio;

  if (langSelect) {
    langSelect.onchange = async () => {
      const lng = langSelect.value;
      await loadLanguage(lng);
      setDirection(lng);
      applyTranslations();
      updateBodyContent();
    };
  }

  // -------- جلب البيانات من أول مسار موجود --------
  items = [];
  try {
    const found = await fetchFirstNonEmptyCollection();
    if (!found) {
      console.error('[body] لا يوجد مسار بيانات مناسب في Firestore (جرب: categories/human_body/items)');
      setDisabled(true);
      return;
    }

    const { snap, path } = found;
    console.log(`[body] fetched count = ${snap.size} from ${path}`);

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

    items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    const lang = getCurrentLang();
    items.sort((a, b) => (a?.name?.[lang] || '').localeCompare(b?.name?.[lang] || ''));
  } catch (e) {
    console.error('[body] fetch error:', e);
  }

  if (!items.length) {
    setDisabled(true);
    return;
  }

  currentIndex = 0;
  setDisabled(false);
  updateBodyContent();
  console.log('[body] initial render done');
}

// (Exports إضافية إذا رغبت بربطها)
export { showNextBody, showPreviousBody, playCurrentBodyAudio };

