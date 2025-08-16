// src/subjects/tools-match-game.js — Unified items (tools + professions) — RELATIONS-ONLY

import { db } from '../js/firebase-config.js';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, setDirection, applyTranslations } from '../core/lang-handler.js';
import { playAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

/* --------------------------- إعدادات عامّة --------------------------- */
const TYPE_SYNONYMS = {
  tool:        ['tool','tools','profession_tool','profession_tools','Tool','Tools'],
  profession:  ['profession','professions','Profession','Professions']
};
const IMAGES_DIR = { tool: 'profession_tools', profession: 'professions' };
const AUDIO_DIR  = { tool: 'tools' };

const state = {
  tools: [],
  professions: [],
  lang: getCurrentLang(),
  voice: 'boy',
  mode: 'image-image',  // image-image | image-text | text-image | sound-image | sound-text | text-text
  currentTool: null,
  currentCorrectProfessionIds: [],  // ← ندعم عدة إجابات صحيحة
  options: []
};

function imagesDirFor(t){ return IMAGES_DIR[t] || `${t}s`; }
function audioDirFor(t){ return AUDIO_DIR[t]  || `${t}s`; }
function isRtl(lang){ return lang === 'ar' || lang === 'he'; }

/* --------------------------- أدوات مساعدة --------------------------- */
function pickMainImageFromMedia(media) {
  if (!media || !Array.isArray(media.images)) return '';
  const main = media.images.find(it => (it.role === 'main' || it.id === 'main'));
  return (main && (main.path || main.url)) || (media.images[0]?.path || media.images[0]?.url || '');
}
function tName(obj, lang){ return (obj?.name?.[lang] || obj?.name?.en || obj?.name?.ar || obj?.name?.he || '').trim(); }
function pickRandom(arr, n){
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

/* --------------------------- توحيد الوثائق --------------------------- */
// الأداة: نقرأ relations.professions كسلسلة IDs للمهن
function unifyTool(doc){
  const d = doc.data();
  const name  = d.name || {};
  const media = d.media || {};
  const image_path = d.image_path
                  || pickMainImageFromMedia(media)
                  || (d.image ? `images/${imagesDirFor('tool')}/${d.image}` : '');
  const voices = d.voices || d.sound || d.sounds || null;
  const sound_base = d.sound_base || d.soundBase || null;

  const rel = d.relations || {};
  const profession_ids_from_rel = Array.isArray(rel.professions) ? rel.professions : []; // ← المهم عندك
  const professions_by_name     = Array.isArray(d.professions)   ? d.professions   : []; // fallback بالأسماء

  return {
    id: doc.id,
    type: 'tool',
    name: { ar: name.ar || d.name_ar || '', en: name.en || d.name_en || '', he: name.he || d.name_he || '' },
    image_path,
    image_file: d.image || d.image_file || '',
    voices,
    sound_base,
    // روابط
    profession_ids_from_rel,
    professions_by_name
  };
}

// المهنة: نقرأ relations.tools كسلسلة IDs للأدوات (للربط العكسي عند الحاجة)
function unifyProfession(doc){
  const d = doc.data();
  const name  = d.name || {};
  const media = d.media || {};
  const image_path = d.image_path
                  || pickMainImageFromMedia(media)
                  || (d.image ? `images/${imagesDirFor('profession')}/${d.image}` : '');

  const rel = d.relations || {};
  const tool_ids_from_rel = Array.isArray(rel.tools) ? rel.tools : [];

  return {
    id: doc.id,
    type: 'profession',
    name: { ar: name.ar || d.name_ar || '', en: name.en || d.name_en || '', he: name.he || d.name_he || '' },
    image_path,
    image_file: d.image || d.image_file || '',
    tool_ids_from_rel
  };
}

function resolveImage(item){
  if (item.image_path) return item.image_path;
  if (item.image_file) return `images/${imagesDirFor(item.type)}/${item.image_file}`;
  return '/images/default.png';
}

function resolveAudioForTool(tool, lang, voice){
  const v = tool.voices;
  if (v){
    const vLang = v[lang];
    if (typeof vLang === 'string') return vLang;
    if (vLang && typeof vLang === 'object' && vLang[voice]) return vLang[voice];
    const flat1 = `${voice}_${lang}`; if (v[flat1]) return v[flat1];
    const flat2 = `${lang}_${voice}`; if (v[flat2]) return v[flat2];
  }
  if (tool.sound_base) return `audio/${lang}/${audioDirFor('tool')}/${tool.sound_base}_${voice}_${lang}.mp3`;
  if (tool.sound && tool.sound[lang]){
    const s = tool.sound[lang];
    if (typeof s === 'string') return s;
    if (s && typeof s === 'object' && s[voice]) return s[voice];
  }
  return '';
}
function resolveAudioForToolWithFallback(tool, lang, voice){
  // جرّب الصوت المطلوب أولاً
  let src = resolveAudioForTool(tool, lang, voice);
  if (src) return src;

  // Fallback منظم (لا يغيّر اختيار المستخدم؛ فقط يحاول تشغيل المتاح)
  const order = voice === 'boy'
    ? ['boy', 'girl','teacher']
    : [voice, 'boy', 'girl','teacher'];

  for (const v of order){
    src = resolveAudioForTool(tool, lang, v);
    if (src) return src;
  }
  return '';
}

/* --------------------------- جلب البيانات --------------------------- */
async function fetchByTypes(syns){
  const ref = collection(db, 'items');
  const slice = syns.slice(0, 10); // حد Firestore للاستعلام IN
  const snap = await getDocs(query(ref, where('type','in', slice), limit(2000)));
  return snap.docs;
}

async function loadData(){
  // أدوات
  const tDocs = await fetchByTypes(TYPE_SYNONYMS.tool);
  state.tools = tDocs.map(unifyTool);

  // مهن
  const pDocs = await fetchByTypes(TYPE_SYNONYMS.profession);
  state.professions = pDocs.map(unifyProfession);
}

/* --------------------------- اختيار الإجابة الصحيحة --------------------------- */
// نعيد قائمة IDs صحيحة، باستعمال الربط من الأداة أولًا، ثم الربط العكسي من المهنة، ثم fallback بالأسماء
function chooseCorrectProfessionIds(tool){
  const profs = state.professions;

  // 1) ids من relations.professions داخل الأداة
  const fromRel = (tool.profession_ids_from_rel || []).filter(Boolean);
  const matchByRelIds = profs
    .filter(p => fromRel.includes(p.id))
    .map(p => p.id);

  if (matchByRelIds.length) return matchByRelIds;

  // 2) الربط العكسي: أي مهنة تشير للأداة عبر relations.tools
  const reverseMatches = profs
    .filter(p => Array.isArray(p.tool_ids_from_rel) && p.tool_ids_from_rel.includes(tool.id))
    .map(p => p.id);

  if (reverseMatches.length) return reverseMatches;

  // 3) fallback بالأسماء لو عندك tools.professions أسماء (ar/en/he) قديمة
  const names = Array.isArray(tool.professions_by_name) ? tool.professions_by_name : [];
  if (names.length){
    const matchByNames = profs.filter(p =>
      names.includes(p?.name?.ar) || names.includes(p?.name?.en) || names.includes(p?.name?.he)
    ).map(p => p.id);
    if (matchByNames.length) return matchByNames;
  }

  // 4) احتياطي
  console.warn('[tools-match] لا يوجد ربط صالح لهذه الأداة:', tool.id, tool.name?.en || tool.name?.ar);
  return [];
}

/* --------------------------- بناء الخيارات --------------------------- */
function buildOptions(correctIds){
  const correctSet = new Set(correctIds);
  const correctList = state.professions.filter(p => correctSet.has(p.id));

  // اختر حتى 2 إجابات صحيحة لإظهارها (إن توفرت)
  const chosenCorrect = pickRandom(correctList, Math.min(2, correctList.length));

  // كمل بـ 2–3 مُشتّتات حتى يصل المجموع إلى 4
  const distractors = state.professions.filter(p => !correctSet.has(p.id));
  const need = Math.max(0, 4 - chosenCorrect.length);
  const chosenDistractors = pickRandom(distractors, need);

  const all = [...chosenCorrect, ...chosenDistractors].slice(0, 4);
  return pickRandom(all, all.length); // اخلط
}

/* --------------------------- العرض --------------------------- */
function $(sel){ return document.querySelector(sel); }
function clearResult(){
  const msg = $('#result-message');
  if (msg){ msg.className = 'result-message'; msg.textContent = ''; }
  const next = $('#next-button'); if (next) next.style.display = 'none';
}
function disableOptions(disabled){
  document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = disabled);
}

function renderToolDisplay(){
  const holder = document.querySelector('.tool-display');
  if (!holder) return;
  const lang = state.lang;

  const showText = state.mode.startsWith('text-');    // النص للأداة
  const showSound= state.mode.startsWith('sound-');   // الصوت للأداة
  const imgSrc   = resolveImage(state.currentTool);
  const toolText = tName(state.currentTool, lang) || '—';

  // حقن واجهة الأداة
  if (showText){
    holder.innerHTML = `<div class="tool-name" style="direction:${isRtl(lang)?'rtl':'ltr'}">${toolText}</div>`;
  } else {
    holder.innerHTML = `<img id="tool-image" class="tool-image clickable-image" src="${imgSrc}" alt="${toolText}" />`;
  }

  // 🔊 تشغيل تلقائي فقط في أنماط الصوت
  if (showSound){
    const autoSrc = resolveAudioForToolWithFallback(state.currentTool, state.lang, state.voice);
    if (autoSrc) playAudio(autoSrc);
  }

  // ⏯ زر "استمع مرة أخرى"
  const replayBtn = document.getElementById('tools-match-replay-sound-btn');
  if (replayBtn){
    replayBtn.onclick = () => {
      const src = resolveAudioForToolWithFallback(state.currentTool, state.lang, state.voice);
      if (src) playAudio(src);
    };
    // نُظهر الزر فقط في أنماط الصوت (كما كان)
    replayBtn.style.display = showSound ? '' : 'none';
  }

  // 🖱️ تشغيل الصوت عند الضغط على الأداة (صورة أو نص) — دائمًا
  const clickTarget = showText
    ? holder.querySelector('.tool-name')
    : holder.querySelector('#tool-image');

  if (clickTarget){
    clickTarget.style.cursor = 'pointer';
    clickTarget.tabIndex = 0;                    // وصولية
    clickTarget.title = 'اضغط للاستماع';        // تلميح بسيط

    const play = () => {
      const src = resolveAudioForToolWithFallback(state.currentTool, state.lang, state.voice);
      if (src) playAudio(src);
    };

    clickTarget.addEventListener('click', play);
    clickTarget.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        play();
      }
    });
  }
}


function renderOptions(){
  const grid = $('#profession-options');
  if (!grid) return;
  const lang = state.lang;

  const useImages = state.mode.endsWith('-image'); // صور للمهن
  grid.innerHTML = '';

  state.options.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.dataset.pid = p.id;

    if (useImages){
      const img = document.createElement('img');
      img.className = 'option-image';
      img.src = resolveImage(p);
      img.alt = tName(p, lang);
      const cap = document.createElement('div');
      cap.className = 'option-caption';
      cap.textContent = tName(p, lang);
      cap.style.direction = isRtl(lang) ? 'rtl' : 'ltr';

      btn.appendChild(img);
      btn.appendChild(cap);
    } else {
      const cap = document.createElement('div');
      cap.className = 'option-caption';
      cap.textContent = tName(p, lang);
      cap.style.direction = isRtl(lang) ? 'rtl' : 'ltr';
      btn.appendChild(cap);
    }

    btn.addEventListener('click', () => onOptionClick(p.id, btn));
    grid.appendChild(btn);
  });
}

function onOptionClick(chosenId, btnEl){
  const msg = $('#result-message');

  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btnEl.classList.add('selected');

  if (state.currentCorrectProfessionIds.includes(chosenId)){
    if (msg){ msg.textContent = (state.lang==='ar'?'إجابة صحيحة!': state.lang==='he'?'תשובה נכונה!':'Correct!'); msg.className = 'result-message ok'; }
    disableOptions(true);
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) recordActivity(user, 'tools-match');
    const next = $('#next-button'); if (next) next.style.display = '';
  } else {
    if (msg){ msg.textContent = (state.lang==='ar'?'إجابة خاطئة، جرّب مرة أخرى.': state.lang==='he'?'טעות, נסה שוב.':'Not quite, try again.'); msg.className = 'result-message bad'; }
  }
}

/* --------------------------- جولات اللعبة --------------------------- */
function chooseTool(){
  if (!state.tools.length) return null;
  return state.tools[Math.floor(Math.random() * state.tools.length)];
}

function nextRound(){
  clearResult();
  state.currentTool = chooseTool();
  if (!state.currentTool) return;

  state.currentCorrectProfessionIds = chooseCorrectProfessionIds(state.currentTool);
  // ضمان وجود خيار صحيح واحد على الأقل: إن لم نجد، خذ أول مهنة كحلّ احتياطي حتى لا تتعطل الواجهة
  if (!state.currentCorrectProfessionIds.length && state.professions.length) {
    state.currentCorrectProfessionIds = [state.professions[0].id];
  }
  state.options = buildOptions(state.currentCorrectProfessionIds);

  renderToolDisplay();
  renderOptions();
}

/* --------------------------- ربط الصفحة والسايدبار --------------------------- */
export async function loadToolsMatchGameContent(){
  await loadData();
  state.lang = getCurrentLang();
  setDirection(state.lang);

  const nextBtn = document.querySelector('#next-button');
  if (nextBtn) nextBtn.onclick = () => nextRound();

  nextRound();
  try { await applyTranslations(); } catch {}
}

export function initializeToolsMatchSidebarControls(){
  const langSel  = document.getElementById('tools-match-lang-select');
  const voiceSel = document.getElementById('tools-match-voice-select');
  const modeSel  = document.getElementById('tools-match-display-mode');

  if (langSel){
    langSel.value = state.lang;
    langSel.onchange = async (e) => {
      state.lang = e.target.value;
      await loadLanguage(state.lang);
      setDirection(state.lang);
      renderToolDisplay();
      renderOptions();
      try { await applyTranslations(); } catch {}
    };
  }
  if (voiceSel){
    voiceSel.value = state.voice;
    voiceSel.onchange = (e) => {
      state.voice = e.target.value;
      if (state.mode.startsWith('sound-')) {
        const src = resolveAudioForTool(state.currentTool, state.lang, state.voice);
        if (src) playAudio(src);
      }
    };
  }
  if (modeSel){
    modeSel.value = state.mode;
    modeSel.onchange = (e) => {
      state.mode = e.target.value;
      renderToolDisplay();
      renderOptions();
    };
  }
}
window.initializeToolsMatchSidebarControls = initializeToolsMatchSidebarControls;
