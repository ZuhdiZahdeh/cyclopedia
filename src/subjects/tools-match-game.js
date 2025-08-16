// src/subjects/tools-match-game.js — Unified items (tools + professions)

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
  voice: 'teacher',
  mode: 'image-image',  // image-image | image-text | text-image | sound-image | sound-text | text-text
  currentTool: null,
  currentCorrectProfessionId: null,
  options: []
};

function imagesDirFor(t){ return IMAGES_DIR[t] || `${t}s`; }
function audioDirFor(t){ return AUDIO_DIR[t]  || `${t}s`; }
function isRtl(lang){ return lang === 'ar' || lang === 'he'; }

/* --------------------------- أدوات موحّدة --------------------------- */
function pickMainImageFromMedia(media) {
  if (!media || !Array.isArray(media.images)) return '';
  const main = media.images.find(it => (it.role === 'main' || it.id === 'main'));
  return (main && (main.path || main.url)) || (media.images[0]?.path || media.images[0]?.url || '');
}

function unifyTool(doc){
  const d = doc.data();
  const name  = d.name || {};
  const media = d.media || {};
  const image_path = d.image_path
                  || pickMainImageFromMedia(media)
                  || (d.image ? `images/${imagesDirFor('tool')}/${d.image}` : '');
  const voices = d.voices || d.sound || d.sounds || null;
  const sound_base = d.sound_base || d.soundBase || null;

  // مصفوفة المهن المرتبطة: قد تكون IDs أو أكواد
  const professions = Array.isArray(d.professions) ? d.professions : [];

  return {
    id: doc.id,
    type: 'tool',
    name: { ar: name.ar || d.name_ar || '', en: name.en || d.name_en || '', he: name.he || d.name_he || '' },
    image_path,
    image_file: d.image || d.image_file || '',
    voices,
    sound_base,
    professions // as-is (قد تكون ids)
  };
}

function unifyProfession(doc){
  const d = doc.data();
  const name  = d.name || {};
  const media = d.media || {};
  const image_path = d.image_path
                  || pickMainImageFromMedia(media)
                  || (d.image ? `images/${imagesDirFor('profession')}/${d.image}` : '');

  return {
    id: doc.id,
    type: 'profession',
    name: { ar: name.ar || d.name_ar || '', en: name.en || d.name_en || '', he: name.he || d.name_he || '' },
    image_path,
    image_file: d.image || d.image_file || ''
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

function tName(obj, lang){ return (obj?.name?.[lang] || obj?.name?.en || obj?.name?.ar || obj?.name?.he || '').trim(); }

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

/* --------------------------- عرض اللعبة --------------------------- */
function $(sel){ return document.querySelector(sel); }
function clearResult(){
  const msg = $('#result-message');
  if (msg){ msg.className = 'result-message'; msg.textContent = ''; }
  const next = $('#next-button'); if (next) next.style.display = 'none';
}
function disableOptions(disabled){
  document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = disabled);
}

function pickRandom(arr, n){
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function chooseTool(){
  if (!state.tools.length) return null;
  return state.tools[Math.floor(Math.random() * state.tools.length)];
}

function chooseCorrectProfessionId(tool){
  // نحاول من حقل tool.professions (IDs أو أسماء)
  const ids = (tool.professions || []).filter(Boolean);
  if (!ids.length) {
    // احتياطي: اختر واحدة عشوائيًا
    const any = state.professions.length ? state.professions[0].id : null;
    return any;
  }
  // لو كانت أسماء، حوّلها إلى ID بمطابقة الاسم الحالي (تقريبي)
  const lang = state.lang;
  const profSet = new Set(ids);
  // طابق بالـid مباشرة إن وُجد
  const byId = state.professions.find(p => profSet.has(p.id));
  if (byId) return byId.id;

  // طابق بالأسماء (ar/en/he)
  const byName = state.professions.find(p => ids.includes(tName(p, lang)) || ids.includes(tName(p,'en')) || ids.includes(tName(p,'ar')) || ids.includes(tName(p,'he')));
  return byName ? byName.id : (state.professions[0]?.id || null);
}

function buildOptions(correctId){
  const correct = state.professions.find(p => p.id === correctId);
  const distractors = state.professions.filter(p => p.id !== correctId);
  const pool = pickRandom(distractors, Math.max(0, 3));
  const all = [...pool, correct];
  return pickRandom(all, all.length); // اخلط
}

function renderToolDisplay(){
  const holder = document.querySelector('.tool-display');
  if (!holder) return;
  const lang = state.lang;

  // حدد طريقة عرض الأداة (صورة / نص / صوت)
  const showText = state.mode.startsWith('text-');    // النص للأداة
  const showSound= state.mode.startsWith('sound-');   // الصوت للأداة
  const imgSrc   = resolveImage(state.currentTool);
  const toolText = tName(state.currentTool, lang) || '—';

  if (showText){
    holder.innerHTML = `<div class="tool-name" style="direction:${isRtl(lang)?'rtl':'ltr'}">${toolText}</div>`;
  } else {
    holder.innerHTML = `<img id="tool-image" class="tool-image clickable-image" src="${imgSrc}" alt="${toolText}" />`;
  }

  // تشغيل الصوت تلقائيًا في أنماط الصوت
  if (showSound){
    const src = resolveAudioForTool(state.currentTool, state.lang, state.voice);
    if (src) playAudio(src);
  }

  // زر "استمع مرة أخرى"
  const replayBtn = $('#tools-match-replay-sound-btn');
  if (replayBtn){
    replayBtn.onclick = () => {
      const src = resolveAudioForTool(state.currentTool, state.lang, state.voice);
      if (src) playAudio(src);
    };
    // أخفِ/أظهر حسب النمط
    replayBtn.style.display = showSound ? '' : 'none';
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
  const correct = state.currentCorrectProfessionId;
  const msg = $('#result-message');

  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btnEl.classList.add('selected');

  if (chosenId === correct){
    if (msg){ msg.textContent = (state.lang==='ar'?'إجابة صحيحة!': state.lang==='he'?'תשובה נכונה!':'Correct!'); msg.className = 'result-message ok'; }
    disableOptions(true);
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) recordActivity(user, 'tools-match');
    const next = $('#next-button'); if (next) next.style.display = '';
  } else {
    if (msg){ msg.textContent = (state.lang==='ar'?'إجابة خاطئة، جرّب مرة أخرى.': state.lang==='he'?'טעות, נסה שוב.':'Not quite, try again.'); msg.className = 'result-message bad'; }
  }
}

function nextRound(){
  clearResult();
  state.currentTool = chooseTool();
  if (!state.currentTool) return;

  state.currentCorrectProfessionId = chooseCorrectProfessionId(state.currentTool);
  state.options = buildOptions(state.currentCorrectProfessionId);

  renderToolDisplay();
  renderOptions();
}

/* --------------------------- ربط الصفحة والسايدبار --------------------------- */
export async function loadToolsMatchGameContent(){
  // الصفحة HTML جاهزة في /html/tools-match.html
  // نضمن تحميل البيانات ثم نبدأ أول جولة
  await loadData();
  state.lang = getCurrentLang();
  setDirection(state.lang);

  // زر "التالي"
  const nextBtn = $('#next-button');
  if (nextBtn) nextBtn.onclick = () => nextRound();

  nextRound();
  try { await applyTranslations(); } catch {}
}

// يُستدعى بعد حقن /html/tools-match-controls.html في السايدبار
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
      // إن كنا في نمط صوت، حدّث المشغل
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
