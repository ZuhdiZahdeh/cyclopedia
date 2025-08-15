// src/subjects/vegetables-game.js
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';
import { fetchSubjectItems, normalizeItemForView } from '../core/items-repo.js';
import { pickLocalized, slugify } from '../core/media-utils.js';

const SUBJECT_KEY = 'vegetables';

let _raw = [];
let _i = 0;
let _uiLang = 'ar';

const $q = (s) => document.querySelector(s);
const pickEl = (...sels) => sels.map(s => $q(s)).find(Boolean) || null;

function audioPath(raw, lang, voice) {
  const s = raw?.sound;
  if (s && typeof s === 'object') {
    const node = s[lang];
    if (typeof node === 'string' && node) return node.startsWith('/') ? node : `/${node}`;
    const v = node?.[voice] || node?.teacher || node?.boy || node?.girl;
    if (typeof v === 'string' && v) return v.startsWith('/') ? v : `/${v}`;
  }
  if (typeof raw?.sound_file === 'string') return raw.sound_file.startsWith('/') ? raw.sound_file : `/${raw.sound_file}`;
  if (typeof raw?.audio === 'string')      return raw.audio.startsWith('/') ? raw.audio : `/${raw.audio}`;
  const base = raw?.sound_base || raw?.audio_base || raw?.base || raw?.id || slugify(pickLocalized(raw?.name, lang));
  return base ? `/audio/${lang}/vegetables/${slugify(base)}_${voice}_${lang}.mp3` : '';
}

function render() {
  if (!_raw.length) return;
  const lang = _uiLang;
  const view = normalizeItemForView(_raw[_i], lang);

  const nameEl = pickEl('#subject-title','#vegetable-word','#vegetable-name','#item-name','.subject-title','.subject-name');
  const imgEl  = pickEl('#subject-image','#vegetable-image','#item-image','.subject-image img','.subject-image');
  const descEl = pickEl('#subject-description','#vegetable-description','#item-description','.subject-description');
  const catEl  = pickEl('#vegetable-category','#item-category');

  if (nameEl) {
    const s = String(view.name || '');
    nameEl.innerHTML = `<span class="first-letter">${s[0] || ''}</span>${s.slice(1)}`;
    nameEl.style.cursor = 'pointer';
    nameEl.onclick = onPlay;
  }
  if (imgEl) {
    imgEl.alt = view.imageAlt || '';
    imgEl.onerror = () => console.warn('[vegetables] missing image:', view.imagePath);
    imgEl.src = view.imagePath || '';
    imgEl.style.cursor = 'pointer';
    imgEl.onclick = onPlay;
  }
  if (descEl) descEl.textContent = view.description || '';
  if (catEl)  catEl.textContent  = pickLocalized(_raw[_i]?.category, lang) || '—';
}

function onNext(){ if(!_raw.length) return; _i = (_i+1)%_raw.length; render(); try{recordActivity('vegetables','next',{index:_i});}catch{} }
function onPrev(){ if(!_raw.length) return; _i = (_i-1+_raw.length)%_raw.length; render(); try{recordActivity('vegetables','prev',{index:_i});}catch{} }
function onPlay(){
  const langSel  = document.getElementById('game-lang-select-vegetable') || document.getElementById('game-lang-select');
  const voiceSel = document.getElementById('voice-select-vegetable')     || document.getElementById('voice-select');
  const lang  = (langSel?.value || _uiLang || getCurrentLang());
  const voice = (voiceSel?.value || 'teacher');
  const src   = audioPath(_raw[_i], lang, voice);
  stopCurrentAudio?.();
  if (src) playAudio(src);
}

function bind() {
  const prev = document.getElementById('prev-vegetable-btn') || document.getElementById('prev-btn');
  const next = document.getElementById('next-vegetable-btn') || document.getElementById('next-btn');
  const play = document.getElementById('play-sound-btn-vegetable') || document.getElementById('listen') || document.getElementById('listen-btn');
  const langSel = document.getElementById('game-lang-select-vegetable') || document.getElementById('game-lang-select');
  let   toggleDesc = document.getElementById('toggle-description-btn-vegetable') || document.getElementById('toggle-description-btn') || document.getElementById('toggle-description');

  if (!toggleDesc) {
    // إنشاء زر الوصف إذا لم يكن موجودًا
    const grid = document.querySelector('#vegetable-sidebar-controls .control-grid') || document.getElementById('vegetable-sidebar-controls');
    if (grid) {
      const row = document.createElement('div'); row.className = 'row';
      toggleDesc = document.createElement('button');
      toggleDesc.id = 'toggle-description-btn-vegetable';
      toggleDesc.className = 'btn ghost'; toggleDesc.textContent = 'الوصف';
      row.appendChild(toggleDesc); grid.appendChild(row);
    }
  }

  if (prev) prev.onclick = onPrev;
  if (next) next.onclick = onNext;
  if (play) play.onclick = onPlay;
  if (toggleDesc) toggleDesc.onclick = () => {
    const box = document.getElementById('vegetable-description-box') || document.getElementById('subject-description-box') || document.getElementById('item-description-box');
    if (!box) return;
    const show = getComputedStyle(box).display === 'none';
    box.style.display = show ? 'block' : 'none';
  };

  if (langSel) {
    langSel.onchange = async () => {
      _uiLang = langSel.value;
      await loadLanguage(_uiLang);
      setDirection(_uiLang);
      applyTranslations();
      _raw.sort((a,b) => String(pickLocalized(a?.name,_uiLang)).localeCompare(pickLocalized(b?.name,_uiLang)));
      render();
    };
  }
}

export async function loadVegetablesGameContent() {
  _uiLang = getCurrentLang();
  bind();
  try {
    _raw = await fetchSubjectItems(SUBJECT_KEY, { strict: true });
    console.log('[vegetables] fetched', _raw.length);
    _raw.sort((a,b) => String(pickLocalized(a?.name,_uiLang)).localeCompare(pickLocalized(b?.name,_uiLang)));
    _i = 0;
    render();
  } catch (e) {
    console.error('[vegetables] load failed:', e);
  }
}

export function rerenderVegetables(){ render(); }

if (typeof window !== 'undefined') {
  window.loadVegetablesGameContent = loadVegetablesGameContent;
  window.rerenderVegetables = rerenderVegetables;
  window.nextVegetable = onNext;
  window.prevVegetable = onPrev;
  window.playVegetable = onPlay;
}
