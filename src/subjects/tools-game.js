// src/subjects/tools-game.js
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';
import { fetchSubjectItems } from '../core/items-repo.js';
import { pickLocalized, getImagePath } from '../core/media-utils.js';

/* -------------------- الحالة -------------------- */
let tools = [];
let currentIndex = 0;
let currentToolData = null;
let currentUILang = 'ar';

/* -------------------- عناصر الصفحة -------------------- */
const els = {
  main:     () => document.querySelector('main.main-content'),
  nameEl:   () => document.getElementById('tool-word'),
  imgEl:    () => document.getElementById('tool-image'),
  descBox:  () => document.getElementById('tool-description-box'),
  descText: () => document.getElementById('tool-description'),
  profList: () => document.getElementById('tool-professions'),
  sidebar:  () => document.querySelector('#sidebar, #sidebar-section, .sidebar'),
  controls: () => document.getElementById('tools-sidebar-controls'),
  btnPrevId:   'prev-tools-btn',
  btnNextId:   'next-tools-btn',
  btnListenId: 'play-sound-btn-tools',
  btnToggleId: 'toggle-description-btn-tools',
  voiceSelId:  'voice-select-tools',
  langSelId:   'game-lang-select-tools'
};

/* -------------------- Utilities -------------------- */
function setHighlightedName(el, txt) {
  if (!el) return;
  const s = (txt || '').toString();
  el.innerHTML = s ? `<span class="highlight-first-letter">${s.charAt(0)}</span>${s.slice(1)}` : '—';
}
function toolName(t, lang){ return pickLocalized(t?.name, lang); }
function toolDescription(t, lang){ return pickLocalized(t?.description, lang); }

/** الصورة من media.images أو image_path (داخل items) */
function toolImagePath(t) {
  const p = getImagePath(t);
  return p || '';
}

/** صوت “باللغة المختارة” فقط */
function toolAudioPathExact(tool, lang, voice) {
  const s = tool?.sound;
  if (!s || typeof s !== 'object') return '';
  const node = s[lang];
  if (!node) return '';
  if (typeof node === 'string') return node.startsWith('/') ? node : `/${node}`;
  const v = node?.[voice] || node?.teacher || node?.boy || node?.girl || '';
  if (typeof v === 'string' && v) return v.startsWith('/') ? v : `/${v}`;
  return '';
}

/* -------------------- حقن وربط الأزرار -------------------- */
async function ensureToolsSidebar() {
  let sidebar = els.sidebar();
  if (!sidebar) {
    const main = els.main() || document.querySelector('main') || document.body;
    sidebar = document.createElement('aside'); sidebar.id = 'sidebar'; sidebar.className = 'sidebar';
    (main?.parentNode ? main.parentNode : document.body).insertBefore(sidebar, main || null);
  }
  let container = els.controls();
  if (!container) {
    container = document.createElement('div');
    container.id = 'tools-sidebar-controls';
    container.className = 'sidebar-section subject-controls';
    const account = sidebar.querySelector('.static-section');
    account ? sidebar.insertBefore(container, account) : sidebar.appendChild(container);
  }
  const needsLoad = !container.querySelector(`#${els.btnPrevId}, #${els.btnNextId}, #${els.btnListenId}, #${els.btnToggleId}, #${els.voiceSelId}, #${els.langSelId}`);
  if (needsLoad) {
    let html = '';
    try {
      const resp = await fetch('/html/tools-controls.html', { cache: 'no-store' });
      if (resp.ok) html = await resp.text();
    } catch {}
    container.innerHTML = html || `
      <div class="control-grid">
        <div class="row two-col">
          <button id="${els.btnPrevId}" class="btn secondary">السابق</button>
          <button id="${els.btnNextId}" class="btn primary">التالي</button>
        </div>
        <div class="row"><button id="${els.btnListenId}" class="btn listen">استمع</button></div>
        <div class="row"><button id="${els.btnToggleId}" class="btn ghost">الوصف</button></div>
        <div class="row">
          <label for="${els.voiceSelId}" class="ctrl-label">الصوت</label>
          <select id="${els.voiceSelId}" class="ctrl-select">
            <option value="teacher">المعلم</option>
            <option value="boy">ولد</option>
            <option value="girl">بنت</option>
          </select>
        </div>
        <div class="row">
          <label for="${els.langSelId}" class="ctrl-label">اللغة</label>
          <select id="${els.langSelId}" class="ctrl-select">
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="he">עברית</option>
          </select>
        </div>
      </div>`;
  }
  container.hidden = false;
  container.style.setProperty('display','block','important');
  applyTranslations();
  return container;
}

function bindControls() {
  const c = els.controls();
  if (!c) return;
  const cc = c.cloneNode(true);
  c.replaceWith(cc);

  cc.addEventListener('click', (e) => {
    const id = e.target?.id;
    if (!id) return;
    if (id === els.btnPrevId)   return showPreviousTool();
    if (id === els.btnNextId)   return showNextTool();
    if (id === els.btnListenId) return playCurrentToolAudio();
    if (id === els.btnToggleId) return toggleDescription();
  });

  cc.addEventListener('change', (e) => {
    const t = e.target;
    if (!t?.id) return;
    if (t.id === els.langSelId) onLanguageChanged(t.value);
  });
}

/* -------------------- العرض والصوت -------------------- */
function ensureClickToPlay() {
  const nameEl = els.nameEl();
  const imgEl  = els.imgEl();
  if (imgEl && !imgEl.dataset.clickBound) {
    imgEl.classList.add('clickable-image');
    imgEl.addEventListener('click', () => playCurrentToolAudio(), { passive: true });
    imgEl.dataset.clickBound = '1';
  }
  if (nameEl && !nameEl.dataset.clickBound) {
    nameEl.classList.add('clickable-text');
    nameEl.addEventListener('click', () => playCurrentToolAudio(), { passive: true });
    nameEl.dataset.clickBound = '1';
  }
}

function renderCurrentTool(lang = currentUILang) {
  currentUILang = lang;
  const data = tools[currentIndex] || null;
  currentToolData = data;

  const nameEl = els.nameEl();
  const imgEl  = els.imgEl();
  const descEl = els.descText();
  const profEl = els.profList();

  if (!data) {
    if (nameEl) nameEl.textContent = '—';
    if (imgEl)  { imgEl.alt = ''; imgEl.removeAttribute('src'); }
    if (descEl) descEl.textContent = '';
    if (profEl) profEl.textContent = '';
    return;
  }

  setHighlightedName(nameEl, toolName(data, lang));
  if (descEl) descEl.textContent = toolDescription(data, lang) || '';
  if (profEl) profEl.textContent = Array.isArray(data.professions) ? data.professions.join('، ') : '';

  const img = toolImagePath(data);
  if (imgEl) {
    if (img) { imgEl.src = img; imgEl.alt = toolName(data, lang) || ''; }
    else { imgEl.alt = ''; imgEl.removeAttribute('src'); }
  }

  ensureClickToPlay();
}

function playCurrentToolAudio() {
  stopCurrentAudio?.();
  const voice = document.getElementById(els.voiceSelId)?.value || 'teacher';
  const path  = toolAudioPathExact(currentToolData, currentUILang, voice);
  if (path) playAudio(path);
}

function toggleDescription() {
  const box = els.descBox(); if (!box) return;
  const hidden = getComputedStyle(box).display === 'none';
  box.style.setProperty('display', hidden ? 'block' : 'none', 'important');
}

function showNextTool() {
  if (!tools.length) return;
  currentIndex = (currentIndex + 1) % tools.length;
  renderCurrentTool();
  recordActivity?.('tools_next', { id: currentToolData?.id, index: currentIndex });
}
function showPreviousTool() {
  if (!tools.length) return;
  currentIndex = (currentIndex - 1 + tools.length) % tools.length;
  renderCurrentTool();
  recordActivity?.('tools_prev', { id: currentToolData?.id, index: currentIndex });
}

/* -------------------- البيانات: من items فقط -------------------- */
async function fetchToolsData() {
  const arr = await fetchSubjectItems('tools'); // ← حصريًا من items
  console.log('[tools] ✅ source: items | count =', arr?.length || 0);
  return arr || [];
}

/* -------------------- تغيير اللغة -------------------- */
async function onLanguageChanged(newLang) {
  try {
    stopCurrentAudio?.();
    currentUILang = newLang;
    await loadLanguage(newLang);
    setDirection(newLang);
    applyTranslations();
    const sel = document.getElementById(els.langSelId);
    if (sel && sel.value !== newLang) sel.value = newLang;
    tools.sort((a,b)=> String(pickLocalized(a?.name,newLang)).localeCompare(pickLocalized(b?.name,newLang)));
    renderCurrentTool(newLang);
  } catch (err) {
    console.warn('[tools] change language failed', err);
  }
}

/* -------------------- التهيئة -------------------- */
export async function loadToolsGameContent() {
  console.log('[tools] loadToolsGameContent()');
  try {
    const resp = await fetch('/html/tools.html', { cache: 'no-store' });
    if (resp.ok) {
      const html = await resp.text();
      const main = els.main();
      if (main) main.innerHTML = html;
      console.log('[tools] ✔ تم تحميل الصفحة: /html/tools.html');
    }
  } catch (e) {
    console.warn('[tools] failed to fetch tools.html', e);
  }

  await ensureToolsSidebar();
  bindControls();

  currentUILang = getCurrentLang();
  setDirection(currentUILang);
  applyTranslations();
  const selLang = document.getElementById(els.langSelId);
  if (selLang) selLang.value = currentUILang;

  tools = await fetchToolsData();     // ← من items حصريًا
  tools.sort((a,b)=> String(pickLocalized(a?.name,currentUILang)).localeCompare(pickLocalized(b?.name,currentUILang)));
  currentIndex = 0;
  renderCurrentTool(currentUILang);

  document.removeEventListener('app:language-changed', _appLang, true);
  document.addEventListener('app:language-changed', _appLang, true);
  window.removeEventListener('storage', _storageLang, true);
  window.addEventListener('storage', _storageLang, true);

  if (typeof window !== 'undefined') {
    window.loadToolsGameContent = loadToolsGameContent;
    window.playCurrentToolAudio = playCurrentToolAudio;
    window.toggleToolDesc = toggleDescription;
    window.showNextTool = showNextTool;
    window.showPreviousTool = showPreviousTool;
  }
}

function _appLang(e){ const L = e?.detail?.lang; if (L) onLanguageChanged(L); }
function _storageLang(e){ if (e.key === 'lang' && e.newValue) onLanguageChanged(e.newValue); }
