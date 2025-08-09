// src/subjects/tools-game.js
import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

let tools = [];
let currentIndex = 0;
let currentToolData = null;

// التقاط عناصر DOM بمرونة
const pick = (...ids) => {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
};

let wordEl, imgEl, descEl, profEl;
let prevBtn, nextBtn, playSoundBtn, voiceSelect, langSelect, toggleDescBtn;

/* ===================== أدوات الصور ===================== */
const TOOL_IMAGE_BASE = '/images/profession_tools/';

function isAbs(p){ return /^https?:\/\//i.test(p) || /^data:/i.test(p) || /^blob:/i.test(p); }
function normalizeImagePath(p){
  if (!p) return null;
  p = String(p).trim();
  if (!p) return null;

  if (isAbs(p) || p.startsWith('/')) return p;
  p = p.replace(/^\.?[\\/]+/, '').replace(/\\/g, '/');

  if (p.startsWith('images/')) return '/' + p;
  // دعم مسارات مختصرة من قاعدة البيانات مثل "profession_tools/hammer.png"
  if (p.startsWith('profession_tools/')) return '/images/' + p;

  // خلاف ذلك: افترض أنه اسم ملف داخل مجلد الأدوات
  return TOOL_IMAGE_BASE + p;
}

function pickFromImages(images, lang){
  if (!images) return null;

  if (Array.isArray(images)) {
    const it = images.find(v => typeof v === 'string' || (v && typeof v.src === 'string'));
    return it ? (typeof it === 'string' ? it : (it[lang] || it.src || it.main || null)) : null;
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
    const p = normalizeImagePath(d.image_path);
    console.log('[tools][img] image_path →', p);
    return p;
  }
  const fromImages = pickFromImages(d?.images, lang);
  if (fromImages){
    const p = normalizeImagePath(fromImages);
    console.log('[tools][img] images →', p);
    return p;
  }
  if (typeof d?.image === 'string' && d.image.trim()){
    const p = normalizeImagePath(d.image);
    console.log('[tools][img] image →', p);
    return p;
  }
  console.warn('[tools][img] لا يوجد حقل صورة صالح:', d?.id);
  return '/images/default.png';
}

/* ===================== أدوات الصوت ===================== */
function getToolAudioPath(d, lang, voiceType){
  const key = `${voiceType}_${lang}`;
  let file;

  if (d?.voices && d.voices[key]) {
    file = d.voices[key];
    console.log(`[tools][audio] voices[${key}] → ${file}`);
  } else if (d?.sound_base) {
    file = `${d.sound_base}_${voiceType}_${lang}.mp3`;
    console.warn(`[tools][audio] via sound_base → ${file}`);
  } else if (d?.sound && d.sound[lang] && d.sound[lang][voiceType]) {
    file = d.sound[lang][voiceType];
    console.log(`[tools][audio] sound map → ${file}`);
  } else if (typeof d?.audio === 'string') {
    file = d.audio;
    console.log('[tools][audio] audio (flat) →', file);
  } else {
    console.error('[tools][audio] لا يوجد ملف صوت لهذا العنصر:', d?.name?.[lang] || d?.id);
    return null;
  }

  return (isAbs(file) || file.startsWith('/')) ? file : `/audio/${lang}/tools/${file}`;
}

/* ===================== واجهة ===================== */
function setDisabled(dis){
  [prevBtn, nextBtn, playSoundBtn, voiceSelect, langSelect, toggleDescBtn]
    .forEach(el => el && (el.disabled = !!dis));
}

function translateProfessionKey(key){
  // لو ملف الترجمة يحتوي على قاموس professions
  return (window.translations?.professions?.[key]) || key;
}

function updateToolContent(){
  const lang = getCurrentLang();

  if (!tools.length){
    if (wordEl) wordEl.textContent = '—';
    if (imgEl) { imgEl.removeAttribute('src'); imgEl.alt = ''; }
    if (descEl) descEl.textContent = '—';
    if (profEl) profEl.textContent = '—';
    return;
  }

  currentToolData = tools[currentIndex];
  const d = currentToolData;

  const displayName =
    (d.name && (d.name[lang] || d.name.ar || d.name.en || d.name.he)) ||
    d.title || d.word || '—';

  if (wordEl){
    wordEl.textContent = displayName;
    wordEl.onclick = playCurrentToolAudio;
  }

  const imgPath = getToolImagePath(d, lang);
  if (imgEl){
    imgEl.src = imgPath;
    imgEl.alt = displayName;
    imgEl.onclick = playCurrentToolAudio;
  }

  if (descEl) {
    descEl.textContent = (d.description && (d.description[lang] || d.description.ar || d.description.en)) || '—';
  }

  if (profEl) {
    const list = Array.isArray(d.professions) ? d.professions : (d.professions ? Object.values(d.professions) : []);
    profEl.textContent = list.length ? list.map(translateProfessionKey).join('، ') : '—';
  }

  if (nextBtn) nextBtn.disabled = (tools.length <= 1 || currentIndex === tools.length - 1);
  if (prevBtn) prevBtn.disabled = (tools.length <= 1 || currentIndex === 0);

  stopCurrentAudio();
}

export function showNextTool(){
  if (!tools.length) return;
  if (currentIndex < tools.length - 1) currentIndex++;
  updateToolContent();
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) recordActivity(user, 'tools');
  } catch {}
}

export function showPreviousTool(){
  if (!tools.length) return;
  if (currentIndex > 0) currentIndex--;
  updateToolContent();
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) recordActivity(user, 'tools');
  } catch {}
}

export function playCurrentToolAudio(){
  if (!tools.length || !currentToolData) return;
  const lang  = (langSelect && langSelect.value) || getCurrentLang();
  const voice = (voiceSelect && voiceSelect.value) || 'teacher';
  const audio = getToolAudioPath(currentToolData, lang, voice);
  if (!audio) return;
  stopCurrentAudio();
  playAudio(audio);
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) recordActivity(user, 'tools_audio');
  } catch {}
}

/* ===================== جلب البيانات ===================== */
async function fetchTools() {
  // المسار المعياري: /profession_tools
  try {
    const snap = await getDocs(collection(db, 'profession_tools'));
    if (!snap.empty) {
      tools = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`[tools] fetched count = ${tools.length} from profession_tools`);
      return;
    }
  } catch (e) {
    console.warn('[tools] فشل جلب profession_tools:', e);
  }

  // fallback قديم (لو موجود): categories/tools/items
  try {
    const snap = await getDocs(collection(db, 'categories', 'tools', 'items'));
    if (!snap.empty) {
      tools = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`[tools] fetched count = ${tools.length} from categories/tools/items`);
      return;
    }
  } catch (e) {
    console.warn('[tools] فشل جلب categories/tools/items:', e);
  }

  tools = [];
}

/* ===================== المُحمّل الرئيسي ===================== */
export async function loadToolsGameContent(){
  console.log('[tools] loadToolsGameContent()');

  stopCurrentAudio();

  // عناصر المحتوى داخل tools.html
  wordEl = pick('tool-word', 'tool-name');   // يدعم الاسمين
  imgEl  = pick('tool-image');
  descEl = pick('tool-description');
  profEl = pick('tool-professions');

  // عناصر السايدبار
  prevBtn      = pick('prev-tools-btn');
  nextBtn      = pick('next-tools-btn');
  playSoundBtn = pick('play-sound-btn-tools');
  voiceSelect  = pick('voice-select-tools');
  langSelect   = pick('game-lang-select-tools');
  toggleDescBtn = pick('toggle-description-btn-tools');

  if (prevBtn) prevBtn.onclick = showPreviousTool;
  if (nextBtn) nextBtn.onclick = showNextTool;
  if (playSoundBtn) playSoundBtn.onclick = playCurrentToolAudio;
  if (toggleDescBtn) {
    toggleDescBtn.onclick = () => {
      const box = descEl?.closest('.details-area') || document.getElementById('tool-description-box');
      if (box) box.style.display = (box.style.display === 'none' ? 'block' : 'none');
    };
  }

  if (langSelect) {
    langSelect.onchange = async () => {
      const lng = langSelect.value;
      await loadLanguage(lng);
      setDirection(lng);
      applyTranslations();
      updateToolContent(); // فقط إعادة العرض، بدون إعادة fetch
    };
  }

  // جلب البيانات ثم العرض
  tools = [];
  setDisabled(true);
  await fetchTools();

  if (!tools.length){
    if (wordEl) wordEl.textContent = 'لا توجد بيانات';
    if (imgEl)  imgEl.src = '/images/default.png';
    if (descEl) descEl.textContent = '—';
    if (profEl) profEl.textContent = '—';
    return;
  }

  // ترتيب أبجدي حسب لغة الواجهة
  const lang = getCurrentLang();
  tools.sort((a,b) => (a?.name?.[lang] || '').localeCompare(b?.name?.[lang] || ''));

  currentIndex = 0;
  setDisabled(false);
  updateToolContent();
  console.log('[tools] initial render done');
}
