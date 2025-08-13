// src/subjects/tools-game.js
// ==========================
// صفحة الأدوات — نسخة Robust مع دعم تغيير اللغة لحظيًا

import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

/* ============== حالة الصفحة ============== */
let tools = [];
let currentIndex = 0;
let currentToolData = null;

/* ============== عناصر الصفحة (كسول) ============== */
const els = {
  main:      () => document.querySelector('main.main-content'),
  name:      () => document.getElementById('tool-word'),
  img:       () => document.getElementById('tool-image'),
  descBox:   () => document.getElementById('tool-description-box'),
  descText:  () => document.getElementById('tool-description'),
  profList:  () => document.getElementById('tool-professions'),

  sidebar:   () => document.querySelector('#sidebar, #sidebar-section, .sidebar'),
  controls:  () => document.getElementById('tools-sidebar-controls'),
  // أزرار بالـ IDs القياسية
  btnPrevId: 'prev-tools-btn',
  btnNextId: 'next-tools-btn',
  btnListenId: 'play-sound-btn-tools',
  btnToggleId: 'toggle-description-btn-tools',
  voiceSelectId: 'voice-select-tools',
  langSelectId:  'game-lang-select-tools'
};

/* ============== Utilities ============== */
const TOOLS_COLLECTION_TRIES = [
  ['profession_tools'],
  ['profession-tools'],
  ['tools'],
  ['categories','tools','items'], // subcollection
];

function prefixPublic(p){ return (!p ? p : (p.startsWith('/') ? p : `/${p}`)); }
function setHighlightedName(el, name) {
  if (!el) return;
  const s = name || '';
  el.innerHTML = s ? `<span class="highlight-first-letter">${s.charAt(0)}</span>${s.slice(1)}` : '';
}

function toolName(tool, lang) {
  const map = tool?.name || {};
  const val = map[lang] || map.ar || map.en || map.he || '';
  if (!map[lang]) console.warn('[tools] missing name for lang:', lang, '| id=', tool?.id);
  return val;
}
function toolDescription(tool, lang) {
  const map = tool?.description || {};
  return map[lang] || map.ar || map.en || map.he || '';
}
function toolImagePath(tool, lang) {
  if (typeof tool?.image_path === 'string' && tool.image_path.trim()) return prefixPublic(tool.image_path);
  if (Array.isArray(tool?.images) && tool.images.length) {
    const first = tool.images.find(x => typeof x === 'string')
      || tool.images.find(x => x?.[lang])?.[lang]
      || tool.images.find(x => x?.ar)?.ar
      || tool.images[0];
    if (typeof first === 'string') return prefixPublic(first);
    if (first && typeof first === 'object') {
      const v = first[lang] || first.ar || first.en || first.src || first.main;
      if (v) return prefixPublic(v);
    }
  }
  return '';
}
function toolAudioPath(tool, lang, voice) {
  const snd = tool?.sound || {};
  const byLang = snd[lang];
  if (byLang) {
    if (typeof byLang === 'string') return prefixPublic(byLang);
    if (typeof byLang === 'object') {
      const v = byLang[voice] || byLang.teacher || byLang.boy || byLang.girl;
      if (typeof v === 'string') return prefixPublic(v);
    }
  }
  // Fallback — سنحذر إن لم تتوفر لغة مطابقة
  const anyLang = snd.en || snd.he || snd.ar; // نعطي أولوية للـen/he عند عدم توفر المطلوب
  if (!byLang && anyLang && !snd[lang]) console.warn('[tools] missing audio for lang:', lang, '| id=', tool?.id);
  if (typeof anyLang === 'string') return prefixPublic(anyLang);
  if (anyLang && typeof anyLang === 'object') {
    const v = anyLang[voice] || anyLang.teacher || anyLang.boy || anyLang.girl;
    if (typeof v === 'string') return prefixPublic(v);
  }
  return '';
}

/* ============== Sidebar Controls (robust) ============== */
async function ensureToolsSidebar() {
  let sidebar = els.sidebar();
  if (!sidebar) {
    console.warn('[tools] sidebar not found – creating a temporary one');
    const main = els.main() || document.querySelector('main') || document.body;
    sidebar = document.createElement('aside');
    sidebar.id = 'sidebar';
    sidebar.className = 'sidebar';
    main.parentNode ? main.parentNode.insertBefore(sidebar, main) : document.body.appendChild(sidebar);
  }

  let container = els.controls();
  if (!container) {
    container = document.createElement('div');
    container.id = 'tools-sidebar-controls';
    container.className = 'sidebar-section subject-controls';
    const account = sidebar.querySelector('.static-section');
    account ? sidebar.insertBefore(container, account) : sidebar.appendChild(container);
  }

  const existsButEmpty =
    !container.querySelector('button,select') &&
    ((container.textContent || '').trim() === '' || container.innerHTML.length < 100);

  if (existsButEmpty) {
    let html = '';
    try {
      const resp = await fetch('/html/tools-controls.html', { cache: 'no-store' });
      if (resp.ok) html = await resp.text();
    } catch (e) {
      console.warn('[tools] controls fetch error:', e);
    }

    const FALLBACK_HTML = `
      <div class="sidebar-section subject-controls" id="tools-sidebar-controls" style="display:block;">
        <h3 class="sidebar-title" data-i18n="tools.controls_title">🧰 أدوات — التحكم</h3>
        <div class="control-grid">
          <div class="row two-col">
            <button id="prev-tools-btn" class="btn secondary" data-i18n="common.prev">السابق</button>
            <button id="next-tools-btn" class="btn primary"   data-i18n="common.next">التالي</button>
          </div>
          <div class="row">
            <button id="play-sound-btn-tools" class="btn listen" data-i18n="common.listen">استمع</button>
          </div>
          <div class="row">
            <button id="toggle-description-btn-tools" class="btn ghost" data-i18n="common.toggle_description">الوصف</button>
          </div>
          <div class="row">
            <label for="voice-select-tools" class="ctrl-label" data-i18n="common.voice">الصوت</label>
            <select id="voice-select-tools" class="ctrl-select">
              <option value="teacher" data-i18n="voices.teacher">المعلم</option>
              <option value="boy"     data-i18n="voices.boy">ولد</option>
              <option value="girl"    data-i18n="voices.girl">بنت</option>
            </select>
          </div>
          <div class="row">
            <label for="game-lang-select-tools" class="ctrl-label" data-i18n="common.language">اللغة</label>
            <select id="game-lang-select-tools" class="ctrl-select">
              <option value="ar">العربية</option>
              <option value="en">English</option>
              <option value="he">עברית</option>
            </select>
          </div>
        </div>
      </div>`.trim();

    container.innerHTML = (html || FALLBACK_HTML);
  }

  // توحيد الشبكة
  const wrong = container.querySelector('.controls-grid');
  if (wrong) { wrong.classList.remove('controls-grid'); wrong.classList.add('control-grid'); }

  // إظهار قسري
  forceShowControls(container);

  // تزامن قيمة select مع اللغة الحالية
  const langSel = container.querySelector(`#${els.langSelectId}`);
  if (langSel) langSel.value = getCurrentLang();

  applyTranslations();
  return container;
}

function forceShowControls(container) {
  if (!container) return;
  container.hidden = false;
  container.style.removeProperty('display');
  container.style.setProperty('display','block','important');
  container.querySelectorAll('.control-grid, .row, h3, label, button, select').forEach(el => {
    el.style.setProperty('display', el.classList.contains('control-grid') ? 'grid' : 'block', 'important');
    el.style.removeProperty('max-height');
    el.style.removeProperty('visibility');
    el.style.setProperty('opacity','1','important');
  });
}

/* ============== تغيير اللغة — نقطة مركزية ============== */
async function onLanguageChanged(newLang) {
  try {
    stopCurrentAudio?.();
    await loadLanguage(newLang);
    try { localStorage.setItem('lang', newLang); } catch {}
    setDirection(newLang);
    applyTranslations();

    // تأكيد قيمة الـ select
    const sel = document.getElementById(els.langSelectId);
    if (sel && sel.value !== newLang) sel.value = newLang;

    renderCurrentTool(); // يعيد الاسم/الوصف/الصورة وفق اللغة
  } catch (err) {
    console.warn('[tools] change language failed', err);
  }
}

/* ============== ربط الأزرار (تفويض أحداث) ============== */
function bindControls() {
  const container = els.controls();
  if (!container) return;

  // Clicks
  container.addEventListener('click', (e) => {
    const t = e.target;
    if (!t || !t.id) return;
    switch (t.id) {
      case els.btnPrevId:   showPreviousTool(); break;
      case els.btnNextId:   showNextTool();     break;
      case els.btnListenId: playCurrentToolAudio(); break;
      case els.btnToggleId: toggleDescription(); break;
      default: break;
    }
  });

  // Changes
  container.addEventListener('change', (e) => {
    const t = e.target;
    if (!t || !t.id) return;
    if (t.id === els.langSelectId) {
      onLanguageChanged(t.value);
    } else if (t.id === els.voiceSelectId) {
      // لا شيء إضافي الآن؛ الصوت سيُستخدم عند الضغط على "استمع"
    }
  });
}

/* ============== عرض الأداة الحالية ============== */
function renderCurrentTool() {
  const lang = getCurrentLang();
  const data = tools[currentIndex];
  currentToolData = data || null;

  const nameEl  = els.name();
  const imgEl   = els.img();
  const descEl  = els.descText();
  const profEl  = els.profList();

  if (!data) {
    if (nameEl) nameEl.textContent = '—';
    if (imgEl)  imgEl.removeAttribute('src');
    if (descEl) descEl.textContent = '';
    if (profEl) profEl.textContent = '';
    return;
  }

  const nm = toolName(data, lang);
  setHighlightedName(nameEl, nm);

  const ds = toolDescription(data, lang);
  if (descEl) descEl.textContent = ds || '';

  const profs = Array.isArray(data.professions) ? data.professions : [];
  if (profEl) profEl.textContent = profs.join('، ');

  const src = toolImagePath(data, lang);
  if (imgEl) { src ? (imgEl.src = src) : imgEl.removeAttribute('src'); }
}

/* ============== صوت الأداة الحالية ============== */
function playCurrentToolAudio() {
  stopCurrentAudio?.();
  const lang  = getCurrentLang();
  const voice = (document.getElementById(els.voiceSelectId)?.value) || 'boy';
  const path  = toolAudioPath(currentToolData, lang, voice);
  if (!path) {
    console.warn('[tools] audio path not found for', currentToolData?.id, 'lang=', lang, 'voice=', voice);
    return;
  }
  playAudio(path);
}

/* ============== تنقّل ============== */
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

/* ============== وصف ============== */
function toggleDescription() {
  const box = els.descBox();
  if (!box) return;
  const cur = getComputedStyle(box).display;
  box.style.setProperty('display', cur === 'none' ? 'block' : 'none', 'important');
}

/* ============== تحميل البيانات ============== */
async function fetchToolsData() {
  for (const pathParts of TOOLS_COLLECTION_TRIES) {
    try {
      const colRef = collection(db, ...pathParts);
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const arr = [];
        snap.forEach(doc => arr.push({ id: doc.id, ...doc.data() }));
        console.log('[tools] ✅ from', pathParts.join('/'), '| count =', arr.length);
        return arr;
      }
    } catch (e) {
      console.warn('[tools] fetch', pathParts.join('/'), 'failed:', e);
    }
  }
  console.warn('[tools] no data found in any candidate collection');
  return [];
}

/* ============== تحميل الصفحة + التهيئة ============== */
export async function loadToolsGameContent() {
  console.log('[tools] loadToolsGameContent()');
  stopCurrentAudio?.();

  // 1) HTML
  try {
    const resp = await fetch('/html/tools.html', { cache: 'no-store' });
    if (resp.ok) {
      const html = await resp.text();
      const main = els.main();
      if (main) main.innerHTML = html;
      console.log('[tools] ✔ تم تحميل الصفحة: /html/tools.html');
    } else {
      console.warn('[tools] failed to load /html/tools.html', resp.status);
    }
  } catch (err) {
    console.warn('[tools] fetch /html/tools.html error', err);
  }

  // 2) Sidebar + Bind
  await ensureToolsSidebar();
  bindControls();

  // 3) لغة/اتجاه
  const lang = getCurrentLang();
  setDirection(lang);
  applyTranslations();

  // 4) بيانات
  tools = await fetchToolsData();
  currentIndex = 0;

  // 5) عرض
  renderCurrentTool();

  // 6) مستمعات تغيّر اللغة من خارج الصفحة (اختياري/وقائي)
  if (typeof window !== 'undefined') {
    document.removeEventListener('app:language-changed', _appLangChanged, true);
    document.addEventListener('app:language-changed', _appLangChanged, true);
    window.removeEventListener('storage', _storageLangChanged, true);
    window.addEventListener('storage', _storageLangChanged, true);

    // أدوات تشخيصية
    window.showNextTool         = showNextTool;
    window.showPreviousTool     = showPreviousTool;
    window.playCurrentToolAudio = playCurrentToolAudio;
    window.toggleToolDesc       = toggleDescription;
  }

  console.log('[tools] initial render done');
}

function _appLangChanged(e){ const L = e?.detail?.lang; if (L) onLanguageChanged(L); }
function _storageLangChanged(e){ if (e.key === 'lang' && e.newValue) onLanguageChanged(e.newValue); }

// تسجيل عام
if (typeof window !== 'undefined') {
  window.loadToolsGameContent = loadToolsGameContent;
}
