// src/subjects/fruits-game.js
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playItemSound, stopCurrentAudio, setVoiceShape, setLanguage } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';
import { fetchSubjectItems, normalizeItemForView } from '../core/items-repo.js';
import { pickLocalized, slugify } from '../core/media-utils.js';

// ---- Fixed image + LCP helpers (unified) ----
const __FIXED_IMG_W = 800, __FIXED_IMG_H = 600;
function __ensureGlobalFixedImgCSS(){
  if (document.getElementById('fixed-img-css')) return;
  const st = document.createElement('style');
  st.id = 'fixed-img-css';
  st.textContent = `[id$="-image"], #subject-image, .subject-image img, img.tool-image, img.option-image{width:100%;height:auto;display:block;aspect-ratio:4/3;}`;
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

const SUBJECT_KEY = 'fruits';
let _raw = []; let _i = 0; let _uiLang = 'ar';

const $q = (s) => document.querySelector(s);
const pickEl = (...sels) => sels.map(s => $q(s)).find(Boolean) || null;

function deriveKey(raw) {
  return raw?.id || slugify(pickLocalized(raw?.name, 'en') || pickLocalized(raw?.name, _uiLang) || '');
}

function render() {
  if (!_raw.length) return;
  const view = normalizeItemForView(_raw[_i], _uiLang);

  const nameEl = pickEl('#subject-title','#fruit-word','#fruit-name','#item-name','.subject-title','.subject-name');

  let imgEl  = pickEl('#subject-image','#fruit-image','#item-image','.subject-image img');
  if (!imgEl) {
    const container = pickEl('.subject-image');
    if (container) {
      imgEl = container.querySelector('img') || document.createElement('img');
      if (!imgEl.parentElement) container.appendChild(imgEl);
    }
  }

  const descEl = pickEl('#subject-description','#fruit-description','#item-description','.subject-description');

  if (nameEl) {
    const s = String(view.name || '');
    const first = s[0] || '';
    nameEl.innerHTML = `<span class="first-letter">${first}</span>${s.slice(1)}`;
    nameEl.style.cursor = 'pointer';
    nameEl.onclick = onPlay;
  }
  if (imgEl) {
    try { imgEl.alt = view.imageAlt || ''; } catch {}
    imgEl.onerror = () => console.warn('[fruits] missing image:', view.imagePath);
    __ensureFixedLcpAttrs(imgEl, true);
    try { imgEl.src = view.imagePath || ''; } catch {}
    imgEl.style.cursor = 'pointer';
    imgEl.onclick = onPlay;
  }
  if (descEl) descEl.textContent = view.description || '';
}

function onNext(){ if(!_raw.length) return; _i = (_i + 1) % _raw.length; render(); try { recordActivity('fruits','next',{ index:_i }); } catch {} }
function onPrev(){ if(!_raw.length) return; _i = (_i - 1 + _raw.length) % _raw.length; render(); try { recordActivity('fruits','prev',{ index:_i }); } catch {} }

function onPlay() {
  if (!_raw.length) return;
  stopCurrentAudio?.();
  const key = deriveKey(_raw[_i]);
  playItemSound({ type: SUBJECT_KEY, key });
}

function bindControls() {
  const prev = document.getElementById('prev-fruit-btn') || document.getElementById('prev-btn');
  const next = document.getElementById('next-fruit-btn') || document.getElementById('next-btn');
  const langSel  = document.getElementById('game-lang-select-fruit') || document.getElementById('game-lang-select');
  const voiceSel = document.getElementById('voice-select-fruit')     || document.getElementById('voice-select');
  const toggleDesc = document.getElementById('toggle-description-btn-fruit')
                   || document.getElementById('toggle-description-btn')
                   || document.getElementById('toggle-description');

  if (prev) prev.onclick = onPrev;
  if (next) next.onclick = onNext;

  if (toggleDesc) {
    toggleDesc.onclick = () => {
      const box = document.getElementById('fruit-description-box')
           || document.getElementById('subject-description-box')
           || document.getElementById('item-description-box');
      if (!box) return;
      const show = getComputedStyle(box).display === 'none';
      box.style.display = show ? 'block' : 'none';
    };
  }

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
  if (voiceSel) {
    if (!voiceSel.value) voiceSel.value = 'boy';
    voiceSel.onchange = () => setVoiceShape(voiceSel.value);
  }
}

export async function loadFruitsGameContent() {
  _uiLang = getCurrentLang();
  bindControls();
  try {
    _raw = await fetchSubjectItems(SUBJECT_KEY, { strict: true });
    _raw.sort((a,b) => String(pickLocalized(a?.name,_uiLang)).localeCompare(pickLocalized(b?.name,_uiLang)));
    _i = 0;
    render();
  } catch (e) { console.error('[fruits] load failed:', e); }
}
export function rerenderFruits(){ render(); }

if (typeof window !== 'undefined') {
  window.loadFruitsGameContent = loadFruitsGameContent;
  window.rerenderFruits = rerenderFruits;
  window.nextFruit = onNext;
  window.prevFruit = onPrev;
  window.playFruit = onPlay;
}
