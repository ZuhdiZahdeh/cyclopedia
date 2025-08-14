// src/subjects/tools-game.js
// ==========================
// صفحة الأدوات — نسخة ثابتة مع:
// - تبديل صوت دقيق حسب اللغة المختارة (دون fallback للعربية)
// - ربط زر الوصف دائمًا
// - تشغيل الصوت عند النقر على الاسم/الصورة

import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

/* -------------------- الحالة العامة -------------------- */
let tools = [];
let currentIndex = 0;
let currentToolData = null;
let currentUILang = 'ar';   // لغة الواجهة المعروضة فعليًا في صفحة الأدوات

/* -------------------- عناصر الصفحة -------------------- */
const els = {
  main:     () => document.querySelector('main.main-content'),
  nameEl:   () => document.getElementById('tool-word'),
  imgEl:    () => document.getElementById('tool-image'),
  descBox:  () => document.getElementById('tool-description-box'),
  descText: () => document.getElementById('tool-description'),
  profList: () => document.getElementById('tool-professions'),

  // الحاوية الجانبية
  controls: () => document.getElementById('tools-sidebar-controls'),

  // معرفات الأزرار / القوائم
  btnPrevId:   'prev-tools-btn',
  btnNextId:   'next-tools-btn',
  btnListenId: 'play-sound-btn-tools',
  btnToggleId: 'toggle-description-btn-tools',
  voiceSelId:  'voice-select-tools',
  langSelId:   'game-lang-select-tools'
};

/* -------------------- أدوات مساعدة -------------------- */
function setHighlightedName(el, txt) {
  if (!el) return;
  const s = (txt || '').toString();
  el.innerHTML = s
    ? `<span class="highlight-first-letter">${s.charAt(0)}</span>${s.slice(1)}`
    : '—';
}

function preferred(map, lang) {
  if (!map || typeof map !== 'object') return '';
  return map[lang] || map.ar || map.en || map.he || '';
}

function toolName(tool, lang) {
  return preferred(tool?.name, lang);
}

function toolDescription(tool, lang) {
  return preferred(tool?.description, lang);
}

function toolImagePath(tool, lang) {
  // image_path (نص مباشر)
  if (typeof tool?.image_path === 'string' && tool.image_path.trim()) {
    return tool.image_path.startsWith('/') ? tool.image_path : `/${tool.image_path}`;
  }
  // مصفوفة صور بديلة (اختياري)
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

/**
 * اختيار مسار الصوت “باللغة المختارة فقط”.
 * ملاحظة: هنا **لا** نعمل Fallback للعربية؛ إذا لم يوجد ملف للغة المختارة نعيد فارغًا.
 */
function toolAudioPathExact(tool, lang, voice) {
  const s = tool?.sound;
  if (!s || typeof s !== 'object') return '';

  const node = s[lang];                       // مثال: s['en'] = { boy: '...', girl: '...' }
  if (!node) return '';                       // لا يوجد صوت لهذه اللغة

  if (typeof node === 'string') return node.startsWith('/') ? node : `/${node}`;

  // كائن أصوات: boy/girl/teacher...
  const v =
    node?.[voice] ||
    node?.teacher ||
    node?.boy ||
    node?.girl ||
    '';

  if (typeof v === 'string' && v) return v.startsWith('/') ? v : `/${v}`;
  return '';
}

/* -------------------- ربط الأزرار -------------------- */
function bindControls() {
  const c = els.controls();
  if (!c) return;

  // نُزيل المستمع القديم إن وُجد ثم نعيد ربط واحد جديد
  c.replaceWith(c.cloneNode(true));
  const cc = els.controls();

  cc.addEventListener('click', (e) => {
    const id = e.target && e.target.id;
    if (!id) return;

    if (id === els.btnPrevId) return showPreviousTool();
    if (id === els.btnNextId) return showNextTool();
    if (id === els.btnListenId) return playCurrentToolAudio();
    if (id === els.btnToggleId) return toggleDescription();
  });

  cc.addEventListener('change', (e) => {
    const t = e.target;
    if (!t || !t.id) return;

    if (t.id === els.langSelId) {
      onLanguageChanged(t.value);
    }
    // voice-select-tools لا يحتاج إجراء فوري — يُستخدم عند الضغط على استمع/الصورة/الاسم
  });
}

/* تشغيل بالنقر على الاسم/الصورة */
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

/* -------------------- وصف -------------------- */
function toggleDescription() {
  const box = els.descBox();
  if (!box) return;
  // Toggle بسيط ومباشر
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

/* -------------------- جلب البيانات -------------------- */
async function fetchToolsData() {
  const tries = [
    ['profession_tools'],    // اسم المجموعة الأكثر استخدامًا عندك
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
    currentUILang = newLang;                           // ← أهم سطر: أثبِّت لغة الواجهة الحالية
    await loadLanguage(newLang);
    setDirection(newLang);
    applyTranslations();
    const sel = document.getElementById(els.langSelId);
    if (sel && sel.value !== newLang) sel.value = newLang;
    renderCurrentTool(newLang);                        // إعادة الرسم بنفس اللغة
  } catch (err) {
    console.warn('[tools] change language failed', err);
  }
}

/* -------------------- التهيئة -------------------- */
export async function loadToolsGameContent() {
  console.log('[tools] loadToolsGameContent()');

  // 1) حقن HTML
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

  // 2) ربط الأزرار (مطلوب قبل أي تفاعل)
  bindControls();

  // 3) تزامن لغة الواجهة الحالية
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

  // 6) مستمعان للتبديل الخارجي للغة (إعدادات عامة للتطبيق)
  document.removeEventListener('app:language-changed', _appLang, true);
  document.addEventListener('app:language-changed', _appLang, true);
  window.removeEventListener('storage', _storageLang, true);
  window.addEventListener('storage', _storageLang, true);

  // أدوات مساعدة للتجربة من الكونسول
  if (typeof window !== 'undefined') {
    window.playCurrentToolAudio = playCurrentToolAudio;
    window.toggleToolDesc = toggleDescription;
    window.showNextTool = showNextTool;
    window.showPreviousTool = showPreviousTool;
  }

  console.log('[tools] initial render done');
}

function _appLang(e)     { const L = e?.detail?.lang; if (L) onLanguageChanged(L); }
function _storageLang(e) { if (e.key === 'lang' && e.newValue) onLanguageChanged(e.newValue); }

// تسجيل الدالة عالمياً (عند الحاجة)
if (typeof window !== 'undefined') {
  window.loadToolsGameContent = loadToolsGameContent;
}
