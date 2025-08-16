// src/js/subject-game.js — unified DB (items)

import { db } from "./firebase-config.js";
import { getDocs, collection, query, where, limit } from "firebase/firestore";
import { getCurrentLang, loadLanguage, setDirection, applyTranslations } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

const TYPE_SYNONYMS = {
  'animal':      ['animal','animals','Animal','Animals'],
  'fruit':       ['fruit','fruits','Fruit','Fruits'],
  'vegetable':   ['vegetable','vegetables','Vegetable','Vegetables'],
  'profession':  ['profession','professions','Profession','Professions'],
  'tool':        ['tool','tools','profession_tool','profession_tools','Tool','Tools'],
  'human-body':  ['human-body','human_body','humanbody','HumanBody','Human_Body']
};

const IMAGES_DIR = { 'animal':'animals','fruit':'fruits','vegetable':'vegetables','profession':'professions','tool':'profession_tools','human-body':'human_body' };
const AUDIO_DIR  = { 'tool':'tools' };
function imagesDirFor(t){ return IMAGES_DIR[t] || `${t}s`; }
function audioDirFor(t){ return AUDIO_DIR[t]  || `${t}s`; }
function isRtl(lang){ return lang==='ar' || lang==='he'; }

let items = [];
let currentIndex = 0;
let currentItemData = null;

export async function loadSubjectGameContent(subjectType){
  stopCurrentAudio();

  const main = document.querySelector("main.main-content");
  if (!main) return;

  main.innerHTML = generateSubjectHTML(subjectType);

  // ربط أزرار السايدبار الموحّدة
  wireSidebarControls(subjectType);

  // جلب البيانات
  const langSel = document.getElementById(`game-lang-select-${subjectType}`);
  const lang = langSel ? langSel.value : getCurrentLang();
  await fetchItemsUnified(subjectType, lang);

  if (!items.length){
    showEmptyState(subjectType);
    disableSidebarButtons(subjectType, true);
    return;
  }

  currentIndex = 0;
  updateContent(subjectType);
  disableSidebarButtons(subjectType, false);

  // تشغيل الصوت عند الضغط على الاسم أو الصورة
  const nameEl = document.getElementById(`${subjectType}-word`);
  const imgEl  = document.getElementById(`${subjectType}-image`);
  [nameEl, imgEl].forEach(el => el && el.addEventListener('click', () => playCurrentItemAudio(subjectType)));
}

function generateSubjectHTML(subjectType){
  return `
    <div class="game-box">
      <h2 id="${subjectType}-word" class="item-main-name"></h2>
      <img id="${subjectType}-image" src="" alt="${subjectType}" style="cursor:pointer;" />

      <div class="${subjectType}-description-box info-box" id="${subjectType}-description-box" style="display:none;">
        <h4>الوصف:</h4>
        <p id="${subjectType}-description">---</p>
      </div>

      <div class="${subjectType}-details-section info-box" id="${subjectType}-details-section" style="display:none;">
        <h3>تفاصيل إضافية:</h3>
        <ul>
          <li><strong>اسم الابن:</strong> <span id="${subjectType}-baby">---</span></li>
          <li><strong>اسم الأنثى:</strong> <span id="${subjectType}-female">---</span></li>
          <li><strong>التصنيف:</strong> <span id="${subjectType}-category">---</span></li>
        </ul>
      </div>
    </div>
  `;
}

// -------------------- جلب موحّد من items --------------------
async function fetchItemsUnified(subjectType){
  items = [];
  const syns = TYPE_SYNONYMS[subjectType] || [subjectType];
  const ref  = collection(db, "items");

  // where('type','in', syns) (≤10) — كافية لنا
  const snap = await getDocs(query(ref, where('type','in', syns), limit(1000)));
  items = snap.docs.map(doc => unifyItem(doc, subjectType));
}

function unifyItem(doc, canonType){
  const d = doc.data();
  const name = d.name || {};
  const letter = d.letter || {};
  const media = d.media || {};

  // صورة
  const image_path = d.image_path
                  || (Array.isArray(media.images) ? (media.images.find(m=>m.role==='main' || m.id==='main')?.path || media.images[0]?.path) : '')
                  || (d.image ? `images/${imagesDirFor(canonType)}/${d.image}` : '');

  return {
    id: doc.id,
    type: canonType,

    name:   { ar: name.ar || d.name_ar || '', en: name.en || d.name_en || '', he: name.he || d.name_he || '' },
    letter: { ar: letter.ar || d.letter_ar || '', en: letter.en || d.letter_en || '', he: letter.he || d.letter_he || '' },

    description: {
      ar: d?.description?.ar || d.description_ar || '',
      en: d?.description?.en || d.description_en || '',
      he: d?.description?.he || d.description_he || ''
    },

    // علاقات اختيارية
    baby:   d?.baby || { ar:'', en:'', he:'' },
    female: d?.female || { ar:'', en:'', he:'' },
    classification: d?.classification || [],

    image_path,
    image_file: d.image || d.image_file || '',

    // أصوات
    voices: d.voices || d.sound || d.sounds || null,
    sound_base: d.sound_base || d.soundBase || null
  };
}

// -------------------- تحديث الواجهة --------------------
function currentLang(){ return getCurrentLang(); }

function resolveImage(item){
  if (item.image_path) return item.image_path;
  if (item.image_file) return `images/${imagesDirFor(item.type)}/${item.image_file}`;
  return '/images/default.png';
}

function resolveAudio(item, lang, voice='teacher'){
  const v = item.voices;
  if (v){
    const vLang = v[lang];
    if (typeof vLang === 'string') return vLang;
    if (vLang && typeof vLang === 'object' && vLang[voice]) return vLang[voice];

    const flat1 = `${voice}_${lang}`; if (v[flat1]) return v[flat1];
    const flat2 = `${lang}_${voice}`; if (v[flat2]) return v[flat2];
  }
  if (item.sound_base) return `audio/${lang}/${audioDirFor(item.type)}/${item.sound_base}_${voice}_${lang}.mp3`;
  if (item.sound && item.sound[lang]){
    const s = item.sound[lang];
    if (typeof s === 'string') return s;
    if (s && typeof s === 'object' && s[voice]) return s[voice];
  }
  return '';
}

function showEmptyState(subjectType){
  document.getElementById(`${subjectType}-image`).src = "/images/default.png";
  document.getElementById(`${subjectType}-word`).textContent = "لا توجد بيانات";
  document.getElementById(`${subjectType}-description`).textContent = "لا يوجد وصف متوفر.";
  document.getElementById(`${subjectType}-baby`).textContent = "غير متوفر";
  document.getElementById(`${subjectType}-female`).textContent = "غير متوفر";
  document.getElementById(`${subjectType}-category`).textContent = "غير متوفر";
}

function updateContent(subjectType){
  if (!items.length) return;
  currentItemData = items[currentIndex];
  const lang = currentLang();

  const name = currentItemData.name?.[lang] || '';
  const letter = currentItemData.letter?.[lang] || '';
  const desc = currentItemData.description?.[lang] || '';

  const wordEl = document.getElementById(`${subjectType}-word`);
  const imgEl  = document.getElementById(`${subjectType}-image`);

  wordEl.textContent = name;
  wordEl.style.direction = isRtl(lang) ? 'rtl' : 'ltr';
  imgEl.src = resolveImage(currentItemData);
  imgEl.alt = name || subjectType;

  document.getElementById(`${subjectType}-description`).textContent = desc || "لا يوجد وصف";

  // تفاصيل إضافية (إن وُجدت)
  document.getElementById(`${subjectType}-baby`).textContent   = currentItemData.baby?.[lang]   || "غير معروف";
  document.getElementById(`${subjectType}-female`).textContent = currentItemData.female?.[lang] || "غير معروف";
  document.getElementById(`${subjectType}-category`).textContent =
    Array.isArray(currentItemData.classification)
      ? currentItemData.classification.map(c => (c?.[lang] || c)).join("، ")
      : (currentItemData.classification?.[lang] || "غير معروف");

  // تمكين/تعطيل أزرار التالي/السابق
  setNavDisabled(subjectType);

  stopCurrentAudio();
}

function setNavDisabled(subjectType){
  const prev = document.getElementById(`prev-${subjectType}-btn`);
  const next = document.getElementById(`next-${subjectType}-btn`);
  if (prev) prev.disabled = (currentIndex === 0);
  if (next) next.disabled = (currentIndex === items.length - 1);
}

// -------------------- ربط أزرار السايدبار --------------------
function wireSidebarControls(subjectType){
  const prev = document.getElementById(`prev-${subjectType}-btn`);
  const next = document.getElementById(`next-${subjectType}-btn`);
  const langSel = document.getElementById(`game-lang-select-${subjectType}`);
  const voiceSel= document.getElementById(`voice-select-${subjectType}`);
  const descBtn = document.getElementById(`toggle-description-btn-${subjectType}`);

  if (prev) prev.onclick = () => { if (currentIndex>0){ currentIndex--; updateContent(subjectType); recordActivity(JSON.parse(localStorage.getItem("user")), subjectType); } };
  if (next) next.onclick = () => { if (currentIndex<items.length-1){ currentIndex++; updateContent(subjectType); recordActivity(JSON.parse(localStorage.getItem("user")), subjectType); } };

  if (langSel){
    langSel.value = currentLang();
    langSel.onchange = async (e) => {
      const lang = e.target.value;
      await loadLanguage(lang);
      setDirection(lang);
      updateContent(subjectType);
      try { await applyTranslations(); } catch {}
    };
  }
  if (voiceSel){
    voiceSel.onchange = () => { /* لا شيء فوري؛ يؤثر فقط على الصوت عند الضغط */ };
  }

  if (descBtn){
    const box = document.getElementById(`${subjectType}-description-box`);
    descBtn.onclick = () => {
      if (!box) return;
      box.style.display = (box.style.display === 'none' || !box.style.display) ? 'block' : 'none';
    };
  }
}

// -------------------- واجهة الصوت/التعطيل --------------------
export function playCurrentItemAudio(subjectType){
  if (!currentItemData) return;
  const langSel = document.getElementById(`game-lang-select-${subjectType}`);
  const voiceSel= document.getElementById(`voice-select-${subjectType}`);
  const lang  = (langSel && langSel.value) || currentLang();
  const voice = (voiceSel && voiceSel.value) || 'teacher';

  const src = resolveAudio(currentItemData, lang, voice);
  if (!src) return console.error('🔇 No audio available');
  playAudio(src);
  recordActivity(JSON.parse(localStorage.getItem("user")), subjectType);
}

function disableSidebarButtons(subjectType, isDisabled){
  const ids = [
    `prev-${subjectType}-btn`,
    `next-${subjectType}-btn`,
    `voice-select-${subjectType}`,
    `game-lang-select-${subjectType}`,
    `toggle-description-btn-${subjectType}`
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = isDisabled;
  });
}
