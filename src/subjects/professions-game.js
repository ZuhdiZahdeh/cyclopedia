// src/subjects/professions-game.js
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playItemSound, stopCurrentAudio, setVoiceShape, setLanguage } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';
import { fetchSubjectItems } from '../core/items-repo.js';
import { pickLocalized, getImagePath, slugify } from '../core/media-utils.js';

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

let professions = [];
let currentIndex = 0;
let currentItem  = null;
let toolsCache = null;

function $(id){ return document.getElementById(id); }
function getEffectiveLang() { return $('game-lang-select-profession')?.value || getCurrentLang(); }
function displayName(item, lang) { return pickLocalized(item?.name, lang); }
function resolveImagePath(item) { return getImagePath(item) || '/images/default.png'; }

async function getRelatedTools(prof) {
  if (!toolsCache) toolsCache = await fetchSubjectItems('tools', { strict:false });
  const keys = [
    prof?.id,
    pickLocalized(prof?.name,'en'),
    pickLocalized(prof?.name,'ar'),
    pickLocalized(prof?.name,'he')
  ].filter(Boolean).map(s => String(s).toLowerCase());
  return (toolsCache || []).filter(t => {
    const arr = Array.isArray(t?.professions) ? t.professions : [];
    return arr.some(x => keys.includes(String(x).toLowerCase()));
  });
}

async function updateUI() {
  const lang = getEffectiveLang();

  if (!professions.length) {
    const nameEl = $('profession-word');
    const imgEl  = $('profession-image');
    if (nameEl) nameEl.textContent = '—';
    if (imgEl) { imgEl.removeAttribute('src'); imgEl.alt = ''; }
    const descEl = $('profession-description'); if (descEl) descEl.textContent = '';
    const detSec = $('profession-details-section'); if (detSec) detSec.innerHTML = '';
    const toolsSec = $('profession-tools-section'); if (toolsSec) toolsSec.innerHTML = '';
    return;
  }

  currentItem = professions[currentIndex];
  const name = displayName(currentItem, lang);

  const nameEl = $('profession-word')  || $('item-word')  || $('item-name');
  const imgEl  = $('profession-image') || $('item-image');

  if (nameEl) {
    const s = String(name || '');
    nameEl.innerHTML = `<span class="first-letter">${s[0] || ''}</span>${s.slice(1)}`;
    nameEl.style.cursor = 'pointer';
    nameEl.onclick = playCurrentProfessionAudio;
  }
  if (imgEl) {
    const src = resolveImagePath(currentItem);
    __ensureFixedLcpAttrs(imgEl, true);
    imgEl.alt = name || '';
    imgEl.onclick = playCurrentProfessionAudio;
    imgEl.onerror = () => console.warn('[professions] missing image:', src);
    imgEl.src = src;
  }

  const descEl = $('profession-description');
  if (descEl) descEl.textContent = pickLocalized(currentItem?.description, lang) || '—';

  const detSec = $('profession-details-section');
  if (detSec) {
    const category = pickLocalized(currentItem?.category, lang) || '---';
    const letter   = pickLocalized(currentItem?.letter, lang)   || '---';
    detSec.innerHTML = `
      <ul class="details-list">
        <li><strong>Category:</strong> ${category}</li>
        <li><strong>״§„״­״± ״§„״£ˆ„:</strong> ${letter}</li>
      </ul>
    `;
  }

  const toolsSec = $('profession-tools-section');
  if (toolsSec) {
    const related = await getRelatedTools(currentItem);
    if (!related.length) {
      toolsSec.innerHTML = `<div class="empty">—</div>`;
    } else {
      const langNow = getEffectiveLang();
      toolsSec.innerHTML = `
        <ul class="tools-list">
          ${related.map(t => `<li>${pickLocalized(t?.name, langNow) || t?.id || ''}</li>`).join('')}
        </ul>
      `;
    }
  }

  const prevBtn = $('prev-profession-btn');
  const nextBtn = $('next-profession-btn');
  if (prevBtn) prevBtn.disabled = (currentIndex === 0 || professions.length <= 1);
  if (nextBtn) nextBtn.disabled = (currentIndex >= professions.length - 1 || professions.length <= 1);

  stopCurrentAudio();
}

// ״×†‚‘„/״µˆ״×
export function showNextProfession() {
  if (!professions.length) return;
  if (currentIndex < professions.length - 1) currentIndex++;
  updateUI();
  try { recordActivity('professions', 'next', { index: currentIndex }); } catch {}
}
export function showPreviousProfession() {
  if (!professions.length) return;
  if (currentIndex > 0) currentIndex--;
  updateUI();
  try { recordActivity('professions', 'prev', { index: currentIndex }); } catch {}
}
export async function playCurrentProfessionAudio() {
  if (!professions.length || !currentItem) return;
  stopCurrentAudio?.();
  const key = currentItem?.id || slugify(pickLocalized(currentItem?.name,'en') || pickLocalized(currentItem?.name, getEffectiveLang()) || '');
  await Promise.resolve(playItemSound({ type: 'professions', key }));
}

// ״¬„״¨ ״§„״¨״§†״§״×
async function fetchProfessionsData() {
  const arr = await fetchSubjectItems('professions', { strict:true });
  if (import.meta.env.DEV) if (import.meta.env.DEV) console.log('[professions] ג… source: items | count =', arr?.length || 0);
  return arr || [];
}

// ״±״¨״· ״¹†״§״µ״± ״§„״×״­ƒ…
function bindControls() {
  const prevBtn  = $('prev-profession-btn');
  const nextBtn  = $('next-profession-btn');
  const langSel  = $('game-lang-select-profession');
  const voiceSel = $('voice-select-profession');

  if (prevBtn) prevBtn.onclick = showPreviousProfession;
  if (nextBtn) nextBtn.onclick = showNextProfession;
  if (voiceSel && !voiceSel.value) voiceSel.value = 'boy';
  if (voiceSel) voiceSel.onchange = () => setVoiceShape(voiceSel.value);

  if (langSel) {
    try { langSel.value = getCurrentLang(); } catch {}
    langSel.onchange = async () => {
      const lng = langSel.value;
      setLanguage(lng);
      await loadLanguage(lng);
      setDirection(lng);
      applyTranslations();
      professions.sort((a, b) => (displayName(a, lng) || '').localeCompare(displayName(b, lng) || ''));
      updateUI();
    };
  }

  const toggleDesc    = $('toggle-description-btn-profession');
  const toggleDetails = $('toggle-details-btn-profession');
  const toggleTools   = $('toggle-tools-btn-profession');
  const toggleDisplay = (id) => { const box = $(id); if (!box) return; const hidden = getComputedStyle(box).display === 'none'; box.style.display = hidden ? 'block' : 'none'; };
  if (toggleDesc)    toggleDesc.onclick    = () => toggleDisplay('profession-description-box');
  if (toggleDetails) toggleDetails.onclick = () => toggleDisplay('profession-details-section');
  if (toggleTools)   toggleTools.onclick   = () => toggleDisplay('profession-tools-section');
}

// †‚״·״© ״§„״¯״®ˆ„
export async function loadProfessionsGameContent() {
  ['prev-profession-btn','next-profession-btn'].forEach(id => { const b = $(id); if (b) b.disabled = true; });

  bindControls();
  professions = await fetchProfessionsData();

  if (!professions.length) {
    const nameEl = $('profession-word');
    const imgEl  = $('profession-image');
    if (nameEl) nameEl.textContent = '—';
    if (imgEl)  imgEl.src = '/images/default.png';
    return;
  }

  const lang = getEffectiveLang();
  professions.sort((a, b) => (displayName(a, lang) || '').localeCompare(displayName(b, lang) || ''));
  currentIndex = 0;
  await updateUI();

  ['prev-profession-btn','next-profession-btn'].forEach(id => { const b = $(id); if (b) b.disabled = false; });

  if (typeof window !== 'undefined') {
    window.loadProfessionsGameContent = loadProfessionsGameContent;
    window.showNextProfession = showNextProfession;
    window.showPreviousProfession = showPreviousProfession;
    window.playCurrentProfessionAudio = playCurrentProfessionAudio;
  }
}


