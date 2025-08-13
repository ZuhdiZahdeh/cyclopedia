// src/subjects/tools-game.js
// ==========================
// صفحة الأدوات — نسخة منقّحة Robust
// - Sidebar controls injection (حتى لو كان العنصر موجودًا لكنه فارغ)
// - !important لإجبار الإظهار عند وجود إخفاء عام
// - توحيد control-grid
// - ربط كامل للأزرار + ترجمة/اتجاه + صوت
// - جلب Firestore مع مسارات Collections بديلة

import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

/* ============== حالة الصفحة ============== */
let tools = [];                 // مصفوفة الأدوات
let currentIndex = 0;           // الفهرس الحالي
let currentToolData = null;     // بيانات الأداة الحالية

/* ============== عناصر الصفحة (كسول) ============== */
const els = {
  main:      () => document.querySelector('main.main-content'),
  name:      () => document.getElementById('tool-word'),
  img:       () => document.getElementById('tool-image'),
  descBox:   () => document.getElementById('tool-description-box'),
  descText:  () => document.getElementById('tool-description'),
  profList:  () => document.getElementById('tool-professions'),

  // عناصر التحكّم
  sidebar:   () => document.querySelector('#sidebar, #sidebar-section, .sidebar'),
  controls:  () => document.getElementById('tools-sidebar-controls'),
  btnPrev:   () => document.getElementById('prev-tools-btn'),
  btnNext:   () => document.getElementById('next-tools-btn'),
  btnListen: () => document.getElementById('play-sound-btn-tools'),
  btnToggle: () => document.getElementById('toggle-description-btn-tools'),
  selVoice:  () => document.getElementById('voice-select-tools'),
  selLang:   () => document.getElementById('game-lang-select-tools'),
};

/* ============== Utilities ============== */
const TOOLS_COLLECTION_TRIES = [
  ['profession_tools'],
  ['profession-tools'],
  ['tools'],
  ['categories','tools','items'], // subcollection
];

// إبراز الحرف الأول
function setHighlightedName(el, name) {
  if (!el) return;
  const safe = name || '';
  const first = safe.charAt(0);
  el.innerHTML = `<span class="highlight-first-letter">${first}</span>${safe.slice(1)}`;
}

// اسم الأداة حسب اللغة
function toolName(tool, lang) {
  const map = tool?.name || {};
  return map[lang] || map.ar || map.en || map.he || '';
}

// وصف الأداة (إن وُجد)
function toolDescription(tool, lang) {
  const map = tool?.description || {};
  return map[lang] || map.ar || map.en || map.he || '';
}

// صورة الأداة
function toolImagePath(tool, lang) {
  // أفضلية: image_path مباشرة
  if (typeof tool?.image_path === 'string' && tool.image_path.trim()) {
    return prefixPublic(tool.image_path);
  }
  // محاولات إضافية (لو عندك مصفوفة صور في البيانات)
  if (Array.isArray(tool?.images) && tool.images.length) {
    const first = tool.images.find(x => typeof x === 'string') ||
                  tool.images.find(x => x?.[lang])?.[lang] ||
                  tool.images.find(x => x?.ar)?.ar ||
                  tool.images[0];
    if (typeof first === 'string') return prefixPublic(first);
    if (first && typeof first === 'object') {
      const val = first[lang] || first.ar || first.en || first.src || first.main;
      if (val) return prefixPublic(val);
    }
  }
  return ''; // يترك المتصفح بدون صورة لو غير متوفر
}

function prefixPublic(p) {
  // نتأكد إن المسار يبدأ بـ "/"
  if (!p) return p;
  return p.startsWith('/') ? p : `/${p}`;
}

// مسار الصوت
function toolAudioPath(tool, lang, voice) {
  // بنية مرنة: sound[lang][voice] أو sound[lang] (string) أو sound[voice]...
  const snd = tool?.sound || {};
  const byLang = snd[lang];
  if (byLang) {
    if (typeof byLang === 'string') return prefixPublic(byLang);
    if (typeof byLang === 'object') {
      const v = byLang[voice] || byLang.teacher || byLang.boy || byLang.girl;
      if (typeof v === 'string') return prefixPublic(v);
    }
  }
  // fallback لغات أخرى
  const anyLang = snd.ar || snd.en || snd.he;
  if (typeof anyLang === 'string') return prefixPublic(anyLang);
  if (anyLang && typeof anyLang === 'object') {
    const v = anyLang[voice] || anyLang.teacher || anyLang.boy || anyLang.girl;
    if (typeof v === 'string') return prefixPublic(v);
  }
  return '';
}

/* ============== Sidebar Controls (robust) ============== */
async function ensureToolsSidebar() {
  // 1) تأكد من وجود الـ sidebar، وإن لم يوجد أنشئ واحداً بسيطاً بعد <main>
  let sidebar = els.sidebar();
  if (!sidebar) {
    console.warn('[tools] sidebar not found – creating a temporary one');
    const main = els.main() || document.querySelector('main') || document.body;
    sidebar = document.createElement('aside');
    sidebar.id = 'sidebar';
    sidebar.className = 'sidebar';
    main.parentNode ? main.parentNode.insertBefore(sidebar, main) : document.body.appendChild(sidebar);
  }

  // 2) أحضر/أنشئ كونتينر الأزرار
  let container = els.controls();
  const exists = !!container;

  if (!container) {
    container = document.createElement('div');
    container.id = 'tools-sidebar-controls';
    container.className = 'sidebar-section subject-controls';
    // ضع قبل قسم الحساب إن وُجد، وإلا ألحِقه بنهاية الشريط
    const account = sidebar.querySelector('.static-section');
    account ? sidebar.insertBefore(container, account) : sidebar.appendChild(container);
  }

  // 3) هل موجود لكنه فارغ؟ (placeholder) → يجب ملؤه
  const existsButEmpty =
    !container.querySelector('button,select') &&
    ((container.textContent || '').trim() === '' || container.innerHTML.length < 100);

  if (!exists || existsButEmpty) {
    let html = '';
    try {
      const resp = await fetch('/html/tools-controls.html', { cache: 'no-store' });
      if (resp.ok) html = await resp.text();
    } catch (e) {
      console.warn('[tools] controls fetch error:', e);
    }

    // Fallback HTML لو فشل التحميل
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

  // 4) توحيد كلاس الشبكة (لو كان controls-grid)
  const wrong = container.querySelector('.controls-grid');
  if (wrong) { wrong.classList.remove('controls-grid'); wrong.classList.add('control-grid'); }

  // 5) إجبار الإظهار على الكونتينر والأولاد (يتغلب على أي !important للإخفاء)
  forceShowControls(container);

  // 6) ضبط قيمة اللغة الحالية في القائمة
  const langSel = els.selLang();
  if (langSel) langSel.value = getCurrentLang();

  // 7) ترجمات
  applyTranslations();

  return container;
}

function forceShowControls(container) {
  if (!container) return;
  container.hidden = false;
  container.style.removeProperty('display');
  container.style.setProperty('display', 'block', 'important');

  const targets = container.querySelectorAll('.control-grid, .row, h3, label, button, select');
  targets.forEach(el => {
    const wantGrid = el.classList.contains('control-grid');
    el.style.setProperty('display', wantGrid ? 'grid' : 'block', 'important');
    el.style.removeProperty('max-height');
    el.style.removeProperty('visibility');
    el.style.setProperty('opacity', '1', 'important');
  });
}

/* ============== ربط الأزرار ============== */
function bindControls() {
  const btnPrev = els.btnPrev();
  const btnNext = els.btnNext();
  const btnListen = els.btnListen();
  const btnToggle = els.btnToggle();
  const selVoice = els.selVoice();
  const selLang  = els.selLang();

  if (btnPrev)  btnPrev.onclick  = () => showPreviousTool();
  if (btnNext)  btnNext.onclick  = () => showNextTool();
  if (btnListen)btnListen.onclick= () => playCurrentToolAudio();
  if (btnToggle)btnToggle.onclick= () => toggleDescription();

  if (selVoice) selVoice.onchange = () => { /* لا شيء إضافي الآن */ };

  if (selLang)  selLang.onchange  = async (e) => {
    const newLang = e.target.value;
    try {
      await loadLanguage(newLang);
      setDirection(newLang);
      renderCurrentTool(); // تحديث النصوص والصورة (لو لها علاقة باللغة)
      applyTranslations();
    } catch (err) {
      console.warn('[tools] change language failed', err);
    }
  };
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

  // الاسم
  const nm = toolName(data, lang);
  setHighlightedName(nameEl, nm);

  // الوصف (إن وُجد)
  const ds = toolDescription(data, lang);
  if (descEl) descEl.textContent = ds || '';

  // المهن المرتبطة (إن وُجدت)
  const profs = Array.isArray(data.professions) ? data.professions : [];
  if (profEl) profEl.textContent = profs.join('، ');

  // الصورة
  const src = toolImagePath(data, lang);
  if (imgEl) {
    if (src) imgEl.src = src;
    else imgEl.removeAttribute('src');
  }

  // تحديث حالة الأزرار
  const btnPrev = els.btnPrev();
  const btnNext = els.btnNext();
  if (btnPrev) btnPrev.disabled = (tools.length <= 1);
  if (btnNext) btnNext.disabled = (tools.length <= 1);
}

/* ============== صوت الأداة الحالية ============== */
function playCurrentToolAudio() {
  stopCurrentAudio?.();
  const lang  = getCurrentLang();
  const voice = els.selVoice()?.value || 'boy';
  const path  = toolAudioPath(currentToolData, lang, voice);
  if (!path) {
    console.warn('[tools] audio path not found for', currentToolData?.id);
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
  const want = (cur === 'none') ? 'block' : 'none';
  box.style.setProperty('display', want, 'important');
}

/* ============== تحميل البيانات ============== */
async function fetchToolsData() {
  // نجرب أكثر من مسار Collection حتى نضمن التوافق مع هيكليات مختلفة
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

/* ============== تحميل صفحة الأدوات + تهيئة ============== */
export async function loadToolsGameContent() {
  console.log('[tools] loadToolsGameContent()');
  stopCurrentAudio?.();

  // 1) تحميل HTML للعبة الأدوات داخل <main>
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

  // 2) شريط الأزرار (robust)
  await ensureToolsSidebar();
  bindControls();

  // 3) لغة/اتجاه
  const lang = getCurrentLang();
  setDirection(lang);
  applyTranslations();

  // 4) جلب البيانات
  tools = await fetchToolsData();
  currentIndex = 0;

  // 5) عرض أول عنصر
  renderCurrentTool();

  // 6) ربط توابع في window (للاختبار السريع)
  if (typeof window !== 'undefined') {
    window.showNextTool         = showNextTool;
    window.showPreviousTool     = showPreviousTool;
    window.playCurrentToolAudio = playCurrentToolAudio;
    window.toggleToolDesc       = toggleDescription;
  }

  console.log('[tools] initial render done');
}

// (اختياري) تسجيل الدالة في window لو تم استدعاؤها من روابط مباشرة:
if (typeof window !== 'undefined') {
  window.loadToolsGameContent = loadToolsGameContent;
}
