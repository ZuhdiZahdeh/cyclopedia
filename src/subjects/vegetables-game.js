// src/subjects/vegetables-game.js
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { recordActivity } from '../core/activity-handler.js';
import { fetchSubjectItems, normalizeItemForView } from '../core/items-repo.js';
import { pickLocalized, slugify } from '../core/media-utils.js';
import { playItemSound, stopCurrentAudio, setVoiceShape, setLanguage } from '../core/audio-handler.js';

function deriveKey(raw) {
  return raw?.id || slugify(pickLocalized(raw?.name, 'en') || pickLocalized(raw?.name, _uiLang) || '');
}

// ---- Fixed image + LCP helpers (unified) ----
const __FIXED_IMG_W = 800, __FIXED_IMG_H = 600;
function __ensureGlobalFixedImgCSS(){
  if (document.getElementById('fixed-img-css')) return;
  const st = document.createElement('style');
  st.id = 'fixed-img-css';
  st.textContent = `[id$="-image"], #subject-image, .subject-image img, img.tool-image, img.option-image { width:100%; height:auto; display:block; aspect-ratio: 4 / 3; }`;
  document.head.appendChild(st);
}
function __ensureFixedLcpAttrs(img, isLcp=true){
  if (!img) return;
  try {
    img.setAttribute('width',  img.getAttribute('width')  || String(__FIXED_IMG_W));
    img.setAttribute('height', img.getAttribute('height') || String(__FIXED_IMG_H));
    img.setAttribute('decoding', 'async');
    img.setAttribute('loading', isLcp ? 'eager' : 'lazy');
    img.setAttribute('fetchpriority', isLcp ? 'high' : 'low');
    img.style.width='100%'; img.style.height='auto'; img.style.display='block'; img.style.aspectRatio='4 / 3';
  } catch {}
}
__ensureGlobalFixedImgCSS();

const SUBJECT_KEY = 'vegetables';
let _raw = []; let _i = 0; let _uiLang = 'ar';

const $q = (s) => document.querySelector(s);
const pickEl = (...sels) => sels.map(s => $q(s)).find(Boolean) || null;

function render() {
  if (!_raw.length) return;
  const view = normalizeItemForView(_raw[_i], _uiLang);

  const nameEl = pickEl('#subject-title','#vegetable-word','#vegetable-name','#item-name','.subject-title','.subject-name');

  let imgEl  = pickEl('#subject-image','#vegetable-image','#item-image','.subject-image img');
  if (!imgEl) {
    const container = pickEl('.subject-image','#subject-image');
    if (container) {
      imgEl = container.querySelector('img') || document.createElement('img');
      if (!imgEl.parentElement) container.appendChild(imgEl);
    }
  }

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
    __ensureFixedLcpAttrs(imgEl, true);
    imgEl.src = view.imagePath || '';
    imgEl.style.cursor = 'pointer';
    imgEl.onclick = onPlay;
  }
  if (descEl) descEl.textContent = view.description || '';
  if (catEl)  catEl.textContent  = pickLocalized(_raw[_i]?.category, _uiLang) || '—';
}

function onNext(){ if(!_raw.length) return; _i = (_i+1)%_raw.length; render(); try{recordActivity('vegetables','next',{index:_i});}catch{} }
function onPrev(){ if(!_raw.length) return; _i = (_i-1+_raw.length)%_raw.length; render(); try{recordActivity('vegetables','prev',{index:_i});}catch{} }

function onPlay(){
  if(!_raw.length) return;
  stopCurrentAudio?.();
  const key = deriveKey(_raw[_i]);
  playItemSound({ type: SUBJECT_KEY, key });
}

function bind() {
  const prev = document.getElementById('prev-vegetable-btn') || document.getElementById('prev-btn');
  const next = document.getElementById('next-vegetable-btn') || document.getElementById('next-btn');
  const langSel = document.getElementById('game-lang-select-vegetable') || document.getElementById('game-lang-select');
  const voiceSel = document.getElementById('voice-select-vegetable')     || document.getElementById('voice-select');
  let toggleDesc = document.getElementById('toggle-description-btn-vegetable') || document.getElementById('toggle-description-btn') || document.getElementById('toggle-description');

  if (!toggleDesc) {
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
  if (toggleDesc) toggleDesc.onclick = () => {
    const box = document.getElementById('vegetable-description-box') || document.getElementById('subject-description-box') || document.getElementById('item-description-box');
    if (!box) return;
    const show = getComputedStyle(box).display === 'none';
    box.style.display = show ? 'block' : 'none';
  };

  if (langSel) {
    langSel.onchange = async () => {
      _uiLang = langSel.value;
      setLanguage(_uiLang);
      await loadLanguage(_uiLang);
      setDirection(_uiLang);
      applyTranslations();
      _raw.sort((a,b) => String(pickLocalized(a?.name,_uiLang)).localeCompare(pickLocalized(b?.name,_uiLang)));
      render();
    };
  }
  if (voiceSel) voiceSel.onchange = () => setVoiceShape(voiceSel.value);
}

export async function loadVegetablesGameContent() {
  _uiLang = getCurrentLang();
  bind();
  try {
    _raw = await fetchSubjectItems(SUBJECT_KEY, { strict: true });
    _raw.sort((a,b) => String(pickLocalized(a?.name,_uiLang)).localeCompare(pickLocalized(b?.name,_uiLang)));
    _i = 0;
    render();
  } catch (e) { console.error('[vegetables] load failed:', e); }
}
export function rerenderVegetables(){ render(); }

if (typeof window !== 'undefined') {
  window.loadVegetablesGameContent = loadVegetablesGameContent;
  window.rerenderVegetables = rerenderVegetables;
  window.nextVegetable = onNext;
  window.prevVegetable = onPrev;
  window.playVegetable = onPlay;
}
