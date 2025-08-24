// /src/subjects/human-body-game.js
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

const SUBJECT_KEY = 'human_body';

// بديل SVG inline
const FALLBACK_IMG_DATA =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
       <rect width="100%" height="100%" fill="#f7f7f7"/>
       <rect x="20" y="20" width="760" height="460" rx="16" ry="16" fill="#ffffff" stroke="#e6e6e6"/>
       <text x="50%" y="50%" font-size="28" font-family="sans-serif" fill="#9aa0a6"
             dominant-baseline="middle" text-anchor="middle">Image not found</text>
     </svg>`
  );

let _raw = []; let _i = 0; let _uiLang = 'ar';
const $ = (s) => document.querySelector(s);
const pickEl = (...sels) => sels.map(s => $(s)).find(Boolean) || null;

function toPublicUrl(p) {
  if (!p) return '';
  let path = String(p).trim();
  path = path.replace(/^public\//i, '');
  if (!path.startsWith('/')) path = '/' + path;
  return path;
}
function getImagePath(raw, view) {
  const src = view?.imagePath || raw?.image_path || raw?.imagePath || raw?.image || '';
  return toPublicUrl(src);
}
function deriveKey(raw){
  return raw?.id || slugify(pickLocalized(raw?.name,'en') || pickLocalized(raw?.name,_uiLang) || '');
}
function setImgOnce(el, src) {
  if (!el) return;
  el.onerror = null;
  const onerr = () => {
    el.removeEventListener('error', onerr);
    el.classList.add('img-error');
    const current = el.getAttribute('src') || '';
    if (!current.endsWith('/images/404.png') && !current.startsWith('data:image')) {
      el.src = '/images/404.png';
      el.addEventListener('error', () => { el.src = FALLBACK_IMG_DATA; }, { once: true });
      return;
    }
    el.src = FALLBACK_IMG_DATA;
  };
  el.addEventListener('error', onerr, { once: true });
  const finalSrc = src && src.trim() ? src : '/images/404.png';
  if (el.getAttribute('src') !== finalSrc) el.setAttribute('src', finalSrc);
}

function render() {
  if (!_raw.length) return;
  const lang = _uiLang;
  const raw  = _raw[_i];
  const view = normalizeItemForView(raw, lang);

  const nameEl = pickEl('#human-body-word', '#item-name', '.item-main-name', '.subject-title');
  const imgEl  = pickEl('#human-body-image', '#item-image', '.subject-image img');
  const descEl = pickEl('#human-body-description', '#item-description', '.subject-description');
  const catEl  = pickEl('#human-body-category', '#item-category');

  if (nameEl) {
    const s = String(view.name || '');
    nameEl.innerHTML = `<span class="first-letter">${s[0] || ''}</span>${s.slice(1)}`;
    nameEl.style.cursor = 'pointer';
    nameEl.onclick = onPlay;
  }
  if (imgEl) {
    imgEl.alt = view.imageAlt || view.name || '';
    imgEl.classList.remove('img-error');
    imgEl.style.cursor = 'pointer';
    imgEl.onclick = onPlay;
    __ensureFixedLcpAttrs(imgEl, true);
    setImgOnce(imgEl, getImagePath(raw, view));
  }
  if (descEl) descEl.textContent = view.description || '';
  if (catEl)  catEl.textContent  = pickLocalized(raw?.category, lang) || '—';
}

function onNext(){ if(!_raw.length) return; _i = (_i+1)%_raw.length; render(); try{recordActivity('human_body','next',{index:_i});}catch{} }
function onPrev(){ if(!_raw.length) return; _i = (_i-1+_raw.length)%_raw.length; render(); try{recordActivity('human_body','prev',{index:_i});}catch{} }

function onPlay(){
  if(!_raw.length) return;
  stopCurrentAudio?.();
  playItemSound({ type: SUBJECT_KEY, key: deriveKey(_raw[_i]) });
}

function bind() {
  const prev = document.getElementById('prev-human-body-btn') || document.getElementById('prev-btn');
  const next = document.getElementById('next-human-body-btn') || document.getElementById('next-btn');
  const langSel = document.getElementById('game-lang-select-human-body') || document.getElementById('game-lang-select');
  let toggleDesc = document.getElementById('toggle-description-btn-human-body') || document.getElementById('toggle-description-btn');

  if (prev) prev.onclick = onPrev;
  if (next) next.onclick = onNext;

  if (!toggleDesc) {
    const grid = document.getElementById('human-body-sidebar-controls');
    if (grid) {
      const row = document.createElement('div'); row.className = 'row';
      toggleDesc = document.createElement('button');
      toggleDesc.id = 'toggle-description-btn-human-body';
      toggleDesc.className = 'btn ghost'; toggleDesc.textContent = 'الوصف';
      row.appendChild(toggleDesc); grid.appendChild(row);
    }
  }
  if (toggleDesc) {
    toggleDesc.onclick = () => {
      const box = document.getElementById('human-body-description-box');
      if (!box) return;
      box.style.display = (getComputedStyle(box).display === 'none') ? 'block' : 'none';
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
  const voiceSel = document.getElementById('voice-select-human-body') || document.getElementById('voice-select');
  if (voiceSel) voiceSel.onchange = () => setVoiceShape(voiceSel.value);
}

export async function loadHumanBodyGameContent() {
  _uiLang = getCurrentLang();
  bind();
  try {
    _raw = await fetchSubjectItems(SUBJECT_KEY, { strict: true });
    _raw.sort((a,b) => String(pickLocalized(a?.name,_uiLang)).localeCompare(pickLocalized(b?.name,_uiLang)));
    _i = 0;
    render();
  } catch (e) { console.error('[human_body] load failed:', e); }
}
export function rerenderHumanBody(){ render(); }

if (typeof window !== 'undefined') {
  window.loadHumanBodyGameContent = loadHumanBodyGameContent;
  window.rerenderHumanBody = rerenderHumanBody;
  window.nextBodyPart = onNext;
  window.prevBodyPart = onPrev;
  window.playBodyPart = onPlay;
}
