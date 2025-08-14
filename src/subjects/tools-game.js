// src/subjects/tools-game.js
// =====================================================

import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

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

  // الحاوية الجانبية وعناصرها
  sidebar:  () => document.querySelector('#sidebar, #sidebar-section, .sidebar'),
  controls: () => document.getElementById('tools-sidebar-controls'),

  // IDs الأزرار والقوائم
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
function preferred(map, lang) {
  if (!map || typeof map !== 'object') return '';
  return map[lang] || map.ar || map.en || map.he || '';
}
function toolName(tool, lang){ return preferred(tool?.name,        lang); }
function toolDescription(tool, lang){ return preferred(tool?.description, lang); }

function toolImagePath(tool, lang) {
  if (typeof tool?.image_path === 'string' && tool.image_path.trim()) {
    return tool.image_path.startsWith('/') ? tool.image_path : `/${tool.image_path}`;
  }
  if (Array.isArray(tool?.images) && tool.images.length) {
    const pick =
      tool.images.find(x => typeof x === 'string') ||
      tool.images.find(x => x?.[lang])?.[lang] ||
      tool.images.find(x => x?.ar)?.ar ||
      tool.images[0];

    if (typeof pick === 'string') return pick.startsWith('/') ? pick : `/${pick}`;
    if (pick && typeof pick === 'object') {
      const v = pick[lang] || pick.ar || pick.en || pick.src || pick.main;
      if (v) return v.startsWith('/') ? v : `/${v}`;
    }
  }
  return '';
}

/* صوت “باللغة المختارة فقط” — بلا fallback */
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

/* -------------------- حقن الأزرار الجانبية -------------------- */
async function ensureToolsSidebar() {
  let sidebar = els.sidebar();
  if (!sidebar) {
    // إنشاء شريط جانبي مؤقت إذا لم يوجد (لا يُفترض غالبًا)
    const main = els.main() || document.querySelector('main') || document.body;
    sidebar = document.createElement('aside');
    sidebar.id = 'sidebar';
    sidebar.className = 'sidebar';
    if (main?.parentNode) main.parentNode.insertBefore(sidebar, main); else document.body.appendChild(sidebar);
  }

  let container = els.controls();
  if (!container) {
    container = document.createElement('div');
    container.id = 'tools-sidebar-controls';
    container.className = 'sidebar-section subject-controls';
    const account = sidebar.querySelector('.static-section');
    account ? sidebar.insertBefore(container, account) : sidebar.appendChild(container);
  }

  // إذا كانت الحاوية فارغة أو لا تحتوي العناصر المطلوبة، حمّل HTML
  const needsLoad = !container.querySelector(`#${els.btnPrevId}, #${els.btnNextId}, #${els.btnListenId}, #${els.btnToggleId}, #${els.voiceSelId}, #${els.langSelId}`);

  if (needsLoad) {
    let html = '';
    try {
      const resp = await fetch('/html/tools-controls.html', { cache: 'no-store' });
      if (resp.ok) html = await resp.text();
    } catch (e) {
      console.warn('[tools] controls fetch error:', e);
    }

    const FALLBACK = `
      <div class="control-grid">
        <div class="row two-col">
          <button id="${els.btnPrevId}" class="btn secondary" data-i18n="common.prev">السابق</button>
          <button id="${els.btnNextId}" class="btn primary"   data-i18n="common.next">التالي</button>
        </div>
        <div class="row">
          <button id="${els.btnListenId}" class="btn listen" data-i18n="common.listen">استمع</button>
        </div>
        <div class="row">
          <button id="${els.btnToggleId}" class="btn ghost" data-i18n="common.toggle_description">الوصف</button>
        </div>
        <div class="row">
          <label for="${els.voiceSelId}" class="ctrl-label" data-i18n="common.voice">الصوت</label>
          <select id="${els.voiceSelId}" class="ctrl-select">
            <option value="teacher" data-i18n="voices.teacher">المعلم</option>
            <option value="boy"     data-i18n="voices.boy">ولد</option>
            <option value="girl"    data-i18n="voices.girl">بنت</option>
          </select>
        </div>
        <div class="row">
          <label for="${els.langSelId}" class="ctrl-label" data-i18n="common.language">اللغة</label>
          <select id="${els.langSelId}" class="ctrl-select">
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="he">עברית</option>
          </select>
        </div>
      </div>`.trim();

    container.innerHTML = html || FALLBACK;
  }

  // إظهار قسري (يعالج أي display:none من CSS)
  container.hidden = false;
  container.style.removeProperty('display');
  container.style.setProperty('display','block','important');

  // توحيد class الشبكة
  const wrong = container.querySelector('.controls-grid');
  if (wrong) { wrong.classList.remove('controls-grid'); wrong.classList.add('control-grid'); }

  // تزامن قيمة select اللغة
  const langSel = container.querySelector(`#${els.langSelId}`);
  if (langSel) langSel.value = currentUILang;

  applyTranslations();
  return container;
}

/* -------------------- ربط الأزرار -------------------- */
function bindControls() {
  const c = els.controls();
  if (!c) return;

  // إزالة مستمعين قدامى وإعادة ربط (نستنسخ مع الأطفال)
  const cc = c.cloneNode(true);
  c.replaceWith(cc);

  cc.addEventListener('click', (e) => {
    const id = e.target && e.target.id;
    if (!id) return;
    if (id === els.btnPrevId)   return showPreviousTool();
    if (id === els.btnNextId)   return showNextTool();
    if (id === els.btnListenId) return playCurrentToolAudio();
    if (id === els.btnToggleId) return toggleDescription();
  });

  cc.addEventListener('change', (e) => {
    const t = e.target;
    if (!t || !t.id) return;
    if (t.id === els.langSelId) {
      onLanguageChanged(t.value);
    }
    // voice-select-tools يُستخدم عند الاستماع فقط
  });
}

/* -------------------- النقر للتشغيل -------------------- */
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

/* -------------------- العرض -------------------- */
function renderCurrentTool(lang = currentUILang) {
  currentUILang = lang;

  const data = tools[currentIndex] || null;
  currentToolData = data;

  const nameEl  = els.nameEl();
  const imgEl   = els.imgEl();
  const descEl  = els.descText();
  const profEl  = els.profList();

  if (!data) {
    if (nameEl) nameEl.textContent = '—';
    if (imgEl)  { imgEl.alt = ''; imgEl.removeAttribute('src'); }
    if (descEl) descEl.textContent = '';
    if (profEl) profEl.textContent = '';
    return;
  }

  setHighlightedName(nameEl, toolName(data, lang));

  const desc = toolDescription(data, lang);
  if (descEl) descEl.textContent = desc || '';

  const profs = Array.isArray(data.professions) ? data.professions : [];
  if (profEl) profEl.textContent = profs.join('، ');

  const img = toolImagePath(data, lang);
  if (imgEl) {
    if (img) { imgEl.src = img; imgEl.alt = toolName(data, lang) || ''; }
    else { imgEl.alt = ''; imgEl.removeAttribute('src'); }
  }

  ensureClickToPlay();
}

/* -------------------- الصوت -------------------- */
function playCurrentToolAudio() {
  stopCurrentAudio?.();
  const voice = document.getElementById(els.voiceSelId)?.value || 'teacher';
  const path  = toolAudioPathExact(currentToolData, currentUILang, voice);

  if (!path) {
    console.warn('[tools] لا يوجد ملف صوت للغة المختارة:', currentUILang, 'voice=', voice, 'id=', currentToolData?.id);
    return;
  }
  playAudio(path);
}

/* -------------------- الوصف -------------------- */
function toggleDescription() {
  const box = els.descBox();
  if (!box) return;
  const hidden = getComputedStyle(box).display === 'none';
  box.style.setProperty('display', hidden ? 'block' : 'none', 'important');
}

/* -------------------- تنقّل -------------------- */
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

/* -------------------- البيانات -------------------- */
async function fetchToolsData() {
  const tries = [
    ['profession_tools'],
    ['profession-tools'],
    ['tools']
  ];
  for (const path of tries) {
    try {
      const snap = await getDocs(collection(db, ...path));
      if (!snap.empty) {
        const arr = [];
        snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
        console.log('[tools] ✅ from', path.join('/'), '| count =', arr.length);
        return arr;
      }
    } catch (e) {
      console.warn('[tools] fetch failed for', path.join('/'), e);
    }
  }
  console.warn('[tools] لا توجد بيانات أدوات');
  return [];
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
    renderCurrentTool(newLang);
  } catch (err) {
    console.warn('[tools] change language failed', err);
  }
}

/* -------------------- التهيئة -------------------- */
export async function loadToolsGameContent() {
  console.log('[tools] loadToolsGameContent()');

  // 1) تحميل HTML الصفحة
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

  // 2) حقن الأزرار الجانبية ثم ربطها
  await ensureToolsSidebar();
  bindControls();

  // 3) تزامن لغة الواجهة
  currentUILang = getCurrentLang();
  setDirection(currentUILang);
  applyTranslations();
  const selLang = document.getElementById(els.langSelId);
  if (selLang) selLang.value = currentUILang;

  // 4) جلب البيانات
  tools = await fetchToolsData();
  currentIndex = 0;

  // 5) العرض الأولي
  renderCurrentTool(currentUILang);

  // 6) مستمعان للتبديل الخارجي للغة
  document.removeEventListener('app:language-changed', _appLang, true);
  document.addEventListener('app:language-changed', _appLang, true);
  window.removeEventListener('storage', _storageLang, true);
  window.addEventListener('storage', _storageLang, true);

  // للمساعدة من الكونسول
  if (typeof window !== 'undefined') {
    window.playCurrentToolAudio = playCurrentToolAudio;
    window.toggleToolDesc = toggleDescription;
    window.showNextTool = showNextTool;
    window.showPreviousTool = showPreviousTool;
  }

  console.log('[tools] initial render done');
}

function _appLang(e){ const L = e?.detail?.lang; if (L) onLanguageChanged(L); }
function _storageLang(e){ if (e.key === 'lang' && e.newValue) onLanguageChanged(e.newValue); }

if (typeof window !== 'undefined') {
  window.loadToolsGameContent = loadToolsGameContent;
}
