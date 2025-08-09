// src/subjects/professions-game.js
import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

/* ================ حالة الصفحة ================ */
let professions = [];
let currentIndex = 0;
let currentProfessionData = null;

/* ================ عناصر الواجهة ================ */
const pick = (id) => document.getElementById(id) || null;

let wordEl, imgEl, catEl, descEl, toolsEl;
let prevBtn, nextBtn, playSoundBtn, voiceSelect, langSelect;

/* ================ أدوات الصور ================ */
const PRO_IMAGE_BASE = '/images/professions/';

function isAbs(p){ return /^https?:\/\//i.test(p) || /^data:/i.test(p) || /^blob:/i.test(p); }

function normalizeImagePath(p){
  if (!p) return null;
  p = String(p).trim();
  if (!p) return null;

  // URL مطلق أو يبدأ بـ /
  if (isAbs(p) || p.startsWith('/')) return p;

  // أزل ./ أو / أو \\ الزائدة
  p = p.replace(/^\.?[\\/]+/, '').replace(/\\/g, '/');

  // لو أعطيت مسارًا داخل images/
  if (p.startsWith('images/')) return '/' + p;

  // خلاف ذلك اعتبره اسم ملف داخل مجلد المهن
  return PRO_IMAGE_BASE + p;
}

function pickFromImages(images, lang){
  if (!images) return null;

  // Array: أول عنصر صالح (string أو {src|main|lang})
  if (Array.isArray(images)){
    const it = images.find(v => typeof v === 'string' || (v && typeof v.src === 'string'));
    if (!it) return null;
    return (typeof it === 'string') ? it : (it[lang] || it.src || it.main || null);
  }

  // Object: فضّل لغة الواجهة ثم main/default ثم أول قيمة نصية
  if (typeof images === 'object'){
    if (images[lang]) return images[lang];
    if (images.main) return images.main;
    if (images.default) return images.default;
    const first = Object.values(images).find(v => typeof v === 'string');
    return first || null;
  }

  return null;
}

function getProfessionImagePath(d, lang){
  // 1) image_path
  if (typeof d?.image_path === 'string' && d.image_path.trim()){
    const p = normalizeImagePath(d.image_path);
    console.log('[prof][img] image_path →', p);
    return p;
  }
  // 2) images
  const fromImages = pickFromImages(d?.images, lang);
  if (fromImages){
    const p = normalizeImagePath(fromImages);
    console.log('[prof][img] images →', p);
    return p;
  }
  // 3) image (اسم ملف)
  if (typeof d?.image === 'string' && d.image.trim()){
    const p = normalizeImagePath(d.image);
    console.log('[prof][img] image →', p);
    return p;
  }

  console.warn('[prof][img] لا يوجد حقل صورة صالح:', d?.id);
  return null;
}

/* ================ أدوات الصوت ================ */
function getProfessionAudioPath(d, lang, voiceType){
  const key = `${voiceType}_${lang}`;
  let file;

  if (d?.voices && d.voices[key]){
    file = d.voices[key];
    console.log(`[prof][audio] voices[${key}] → ${file}`);
  } else if (d?.sound_base){
    file = `${d.sound_base}_${voiceType}_${lang}.mp3`;
    console.warn(`[prof][audio] via sound_base → ${file}`);
  } else if (d?.sound && d.sound[lang] && d.sound[lang][voiceType]){
    file = d.sound[lang][voiceType];
    console.log(`[prof][audio] legacy map → ${file}`);
  } else if (typeof d?.audio === 'string'){
    file = d.audio;
    console.log('[prof][audio] audio (flat) →', file);
  } else {
    console.error('[prof][audio] لا يوجد صوت لهذا العنصر:', d?.name?.[lang] || d?.id);
    return null;
  }

  // لو مش مطلق ولا يبدأ بـ /، ابنِ المسار القياسي
  return (isAbs(file) || file.startsWith('/')) ? file : `/audio/${lang}/professions/${file}`;
}

/* ================ عرض قائمة الأدوات (اختياري) ================ */
function renderToolsList(d, lang){
  if (!toolsEl) return;
  toolsEl.innerHTML = '';

  const tools = d?.tools;
  if (!tools || (Array.isArray(tools) && tools.length === 0)){
    toolsEl.style.display = 'none';
    return;
  }
  toolsEl.style.display = '';

  const list = document.createElement('ul');
  list.className = 'tools-list';

  const listItems = Array.isArray(tools) ? tools : Object.values(tools);
  listItems.forEach((t) => {
    const li = document.createElement('li');
    li.className = 'tool-item';

    // الاسم
    const name =
      (t?.name && (t.name[lang] || t.name.ar || t.name.en || t.name.he)) ||
      (typeof t === 'string' ? t : t?.title) || '—';

    // صورة الأداة إن توفرت
    let toolImgSrc = null;
    if (t?.image_path) {
      toolImgSrc = normalizeImagePath(t.image_path);
    } else {
      const imgFrom = pickFromImages(t?.images, lang) || t?.image;
      if (imgFrom) toolImgSrc = normalizeImagePath(
        imgFrom.startsWith('profession_tools/') ? ('/images/' + imgFrom) : imgFrom
      );
    }

    if (toolImgSrc){
      const img = document.createElement('img');
      img.src = toolImgSrc;
      img.alt = name;
      img.loading = 'lazy';
      img.className = 'tool-thumb';
      li.appendChild(img);
    }

    const span = document.createElement('span');
    span.textContent = name;
    li.appendChild(span);

    list.appendChild(li);
  });

  toolsEl.appendChild(list);
}

/* ================ واجهة ================ */
function setDisabled(dis){
  [prevBtn, nextBtn, playSoundBtn, voiceSelect, langSelect].forEach(el => el && (el.disabled = !!dis));
}

function updateProfessionContent(){
  const lang = getCurrentLang();

  if (!professions.length){
    if (wordEl) wordEl.textContent = '—';
    if (imgEl) { imgEl.removeAttribute('src'); imgEl.alt = ''; }
    if (catEl) catEl.textContent = '—';
    if (descEl) descEl.textContent = '—';
    if (toolsEl) toolsEl.innerHTML = '';
    return;
  }

  currentProfessionData = professions[currentIndex];
  const d = currentProfessionData;

  // الاسم المعروض
  const displayName =
    (d.name && (d.name[lang] || d.name.ar || d.name.en || d.name.he)) ||
    d.title || d.word || '—';

  if (wordEl){
    wordEl.textContent = displayName;
    wordEl.onclick = playCurrentProfessionAudio;
  }

  // الصورة
  const imgPath = getProfessionImagePath(d, lang);
  if (imgEl){
    if (imgPath){ imgEl.src = imgPath; imgEl.alt = displayName; }
    else { imgEl.removeAttribute('src'); imgEl.alt = ''; }
    imgEl.onclick = playCurrentProfessionAudio;
  }

  // الفئة (إن وجدت)
  if (catEl){
    const c = (d.category && (d.category[lang] || d.category.ar || d.category.en)) || null;
    catEl.textContent = Array.isArray(c) ? (c[0] || '—') : (c || '—');
  }

  // الوصف
  if (descEl){
    descEl.textContent = (d.description && (d.description[lang] || d.description.ar || d.description.en)) || '—';
  }

  // أدوات المهنة (اختياري)
  renderToolsList(d, lang);

  if (nextBtn) nextBtn.disabled = (professions.length <= 1);
  if (prevBtn) prevBtn.disabled = (professions.length <= 1);

  stopCurrentAudio();
}

function showNextProfession(){
  if (!professions.length) return;
  stopCurrentAudio();
  currentIndex = (currentIndex + 1) % professions.length;
  updateProfessionContent();
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) recordActivity(user, 'professions');
  } catch {}
}

function showPreviousProfession(){
  if (!professions.length) return;
  stopCurrentAudio();
  currentIndex = (currentIndex - 1 + professions.length) % professions.length;
  updateProfessionContent();
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) recordActivity(user, 'professions');
  } catch {}
}

function playCurrentProfessionAudio(){
  if (!professions.length || !currentProfessionData) return;
  const lang  = (langSelect && langSelect.value) || getCurrentLang();
  const voice = (voiceSelect && voiceSelect.value) || 'teacher';
  const audio = getProfessionAudioPath(currentProfessionData, lang, voice);
  if (!audio) return;
  stopCurrentAudio();
  playAudio(audio);
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) recordActivity(user, 'professions_audio');
  } catch {}
}

/* ================ جلب البيانات ================ */
async function fetchProfessionsFromFirstAvailable(){
  // 1) الكولكشن العلوي المعياري
  try {
    const snap = await getDocs(collection(db, 'professions'));
    if (!snap.empty) return { snap, path: 'professions' };
  } catch (_) {}

  // 2) fallback القديم
  try {
    const snap = await getDocs(collection(db, 'categories', 'professions', 'items'));
    if (!snap.empty) return { snap, path: 'categories/professions/items' };
  } catch (_) {}

  return null;
}

/* ================ المُحمّل الرئيسي ================ */
export async function loadProfessionsGameContent(){
  console.log('[prof] loadProfessionsGameContent()');
  stopCurrentAudio();

  // عناصر المحتوى داخل صفحة professions.html
  wordEl  = pick('profession-word');
  imgEl   = pick('profession-image');
  catEl   = pick('profession-category');
  descEl  = pick('profession-description');
  toolsEl = pick('profession-tools') || pick('profession-tools-list');

  // عناصر السايدبار
  prevBtn      = pick('prev-profession-btn');
  nextBtn      = pick('next-profession-btn');
  playSoundBtn = pick('play-sound-btn-profession');
  voiceSelect  = pick('voice-select-profession');
  langSelect   = pick('game-lang-select-profession');

  if (prevBtn) prevBtn.onclick = showPreviousProfession;
  if (nextBtn) nextBtn.onclick = showNextProfession;
  if (playSoundBtn) playSoundBtn.onclick = playCurrentProfessionAudio;

  if (langSelect){
    langSelect.onchange = async () => {
      const lng = langSelect.value;
      await loadLanguage(lng);
      setDirection(lng);
      applyTranslations();
      updateProfessionContent();
    };
  }

  professions = [];
  setDisabled(true);

  try {
    const found = await fetchProfessionsFromFirstAvailable();
    if (!found) {
      console.error('[prof] لا توجد بيانات مهن في Firestore (جرّبت: professions و categories/professions/items)');
      return;
    }

    const { snap, path } = found;
    console.log(`[prof] fetched count = ${snap.size} from ${path}`);

    snap.forEach(doc => {
      const data = doc.data();
      console.log(`  • ${doc.id}`, {
        name: data?.name,
        image_path: data?.image_path,
        images: data?.images,
        image: data?.image,
        category: data?.category,
        description: data?.description,
        tools: data?.tools ? (Array.isArray(data.tools) ? `array(${data.tools.length})` : 'object') : undefined,
        sound_base: data?.sound_base,
        voices: data?.voices ? Object.keys(data.voices) : undefined,
        sound: data?.sound
      });
    });

    professions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const lang = getCurrentLang();
    professions.sort((a,b) => (a?.name?.[lang] || '').localeCompare(b?.name?.[lang] || ''));
  } catch (e) {
    console.error('[prof] fetch error:', e);
  }

  if (!professions.length) return;

  currentIndex = 0;
  setDisabled(false);
  updateProfessionContent();
  console.log('[prof] initial render done');
}

/* ================ Exports إضافية ================ */
export { showNextProfession, showPreviousProfession, playCurrentProfessionAudio };
