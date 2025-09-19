// =========================
// main.js — النسخة المنقحة (خيار B: حقن ديناميكي)
// =========================

// لغة الواجهة
import { getCurrentLang, loadLanguage, applyTranslations, onLangChange } from '../core/lang-handler.js';

// تهيئة السايدبار الخاص بكل موضوع (تتولّى حقن ملف التحكم المناسب)
import { initializeSubjectControls } from '../core/initializeSubjectControls.js';

// ألعاب/صفحات أخرى (تبقى كما هي باستيراد ثابت)
import { loadAnimalsGameContent }        from "../subjects/animals-game.js";
import { loadFruitsGameContent }         from "../subjects/fruits-game.js";
import { loadVegetablesGameContent }     from "../subjects/vegetables-game.js";
import { loadProfessionsGameContent }    from "../subjects/professions-game.js";
import { loadToolsGameContent }          from "../subjects/tools-game.js";
import { loadAlphabetActivityContent }   from "../activities/alphabet-activity.js";
import { loadMemoryGameContent }         from "../subjects/memory-game.js";
import { loadToolsMatchGameContent }     from "../subjects/tools-match-game.js";
import { loadHumanBodyGameContent }      from "../subjects/human-body-game.js";

// 🔐 Firebase Auth
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

/* ------------------------------------------------------------------
   تحميل CSS الأساسي + CSS الخاص بكل موضوع تلقائيًا
-------------------------------------------------------------------*/
const BASE_CSS = [
  '/css/colors.css',
  '/css/fonts.css',
  '/css/shared-utilities.css',
  '/css/forms.css',
  '/css/common-components-subjects.css',
  '/css/style.css'
];

const SUBJECT_CSS = {
  animal:         '/css/animals.css',
  fruit:          '/css/fruits.css',
  vegetable:      '/css/vegetables.css',
  profession:     '/css/professions.css',
  tools:          '/css/tools.css',
  'human-body':   '/css/human-body.css',
  'memory-game':  '/css/memory-game.css',
  'tools-match':  '/css/tools-match.css',
  'family-groups':'/css/family-groups-game.css', // تأكيد تحميل CSS الخاص باللعبة
};

function ensureCss(paths = []) {
  const head = document.head;
  const existing = new Set(
    [...document.querySelectorAll('link[rel="stylesheet"]')]
      .map(l => {
        try { return new URL(l.getAttribute('href'), location.href).pathname; }
        catch { return l.getAttribute('href') || ''; }
      })
  );
  let appended = false;
  for (const href of paths) {
    if (!existing.has(href)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      head.appendChild(link);
      appended = true;
    }
  }
  if (appended) requestAnimationFrame(() => {});
}
// حمّل الأساسي مرة واحدة
ensureCss(BASE_CSS);

/* ------------------------- i18n لعناصر التحكم ------------------------- */
function rebuildVoiceOptions(sel) {
  if (!sel) return;
  const keep = sel.value || 'boy';
  const options = [
    ['teacher', 'teacher_voice'],
    ['boy',     'boy_voice'],
    ['girl',    'girl_voice'],
    ['child',   'child_voice']
  ];
  sel.innerHTML = options
    .map(([val, key]) => `<option value="${val}" data-i18n="${key}"></option>`)
    .join('');
  sel.value = keep;
}

function i18nNormalizeControls() {
  // أزرار السابق/التالي الشائعة لكل الصفحات
  const prevIds = ['prev-animal-btn','prev-fruit-btn','prev-vegetable-btn','prev-human-body-btn','prev-profession-btn','prev-tools-btn','prev-btn'];
  const nextIds = ['next-animal-btn','next-fruit-btn','next-vegetable-btn','next-human-body-btn','next-profession-btn','next-tools-btn','next-btn'];

  prevIds.forEach(id => { const el = document.getElementById(id); if (el) el.setAttribute('data-i18n','previous'); });
  nextIds.forEach(id => { const el = document.getElementById(id); if (el) el.setAttribute('data-i18n','next'); });

  // زر عرض الوصف إن وُجد
  document
    .querySelectorAll('[id^="toggle-description-btn"]')
    .forEach(el => el.setAttribute('data-i18n','Description'));

  // ملصقات اللغة/الصوت + خيارات الصوت
  document.querySelectorAll('select[id^="voice-select"]').forEach(sel => {
    const lab = document.querySelector(`label[for="${sel.id}"]`);
    if (lab) lab.setAttribute('data-i18n','Voice');
    rebuildVoiceOptions(sel);
  });
  document.querySelectorAll('select[id^="game-lang-select"]').forEach(sel => {
    const lab = document.querySelector(`label[for="${sel.id}"]`);
    if (lab) lab.setAttribute('data-i18n','Language');
  });

  // عنوان «حسابك»
  const accTitleInner = document.querySelector('.static-section .sidebar-title [data-i18n]');
  if (accTitleInner) {
    accTitleInner.setAttribute('data-i18n','your_account');
  } else {
    const accTitle = document.querySelector('.static-section .sidebar-title');
    if (accTitle) accTitle.setAttribute('data-i18n','your_account');
  }

  try { applyTranslations(); } catch {}
}

/* ------------------------- أدوات واجهة بسيطة للسايدبار ------------------------- */
// لا تُفرّغ القسم الثابت (مثل «حسابك»)
function hideAllControls() {
  document
    .querySelectorAll("#sidebar-section .sidebar-section:not(.static-section)")
    .forEach((sec) => {
      sec.style.display = "none";
      sec.innerHTML = "";
    });
  const aside = document.getElementById("sidebar-section");
  if (aside) aside.style.display = "";
}

/* ------------------------- حساب المستخدم: واجهة الأزرار ------------------------- */
function updateAccountActionsUI(user) {
  const loggedIn = !!user;
  const setHidden = (id, hidden) => {
    const el = document.getElementById(id);
    if (el) el.hidden = hidden;
  };
  setHidden('loginBtn',       loggedIn);
  setHidden('registerBtn',    loggedIn);
  setHidden('my-profile-btn', !loggedIn);
  setHidden('my-report-btn',  !loggedIn);
  setHidden('logoutBtn',      !loggedIn);
}

async function handleLogout() {
  try {
    const auth = getAuth();
    await signOut(auth);
  } catch (e) {
    console.error('Signout error:', e);
  }
}
window.handleLogout = handleLogout;

/* ------------------------- ترتيب «حسابك» تحت التحكّم الظاهر ------------------------- */
function getActiveControlsSection() {
  const aside = document.getElementById('sidebar-section');
  if (!aside) return null;
  const candidates = Array
    .from(aside.querySelectorAll('.sidebar-section:not(.static-section)'))
    .filter(sec => getComputedStyle(sec).display !== 'none' && sec.innerHTML.trim() !== '');
  return candidates.length ? candidates[candidates.length - 1] : null;
}

function placeAccountSectionBelowActiveControls() {
  const aside   = document.getElementById('sidebar-section');
  const account = aside ? aside.querySelector('.sidebar-section.static-section') : null;
  if (!aside || !account) return;
  const active = getActiveControlsSection();
  if (active) {
    active.insertAdjacentElement('afterend', account);
  } else {
    aside.appendChild(account);
  }
}
window.placeAccountSectionBelowActiveControls = placeAccountSectionBelowActiveControls;

let _sidebarObserver;
function initSidebarObserver() {
  const aside = document.getElementById('sidebar-section');
  if (!aside || _sidebarObserver) return;

  let scheduled = false;
  _sidebarObserver = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      placeAccountSectionBelowActiveControls();
      scheduled = false;
    });
  });

  _sidebarObserver.observe(aside, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'hidden', 'class']
  });
}

/* ------------------------- محمل صفحات عام (مُحصَّن) ------------------------- */
const FRAGMENT_SELECTORS = [
  "#page-content",
  ".subject-page",
  "#fruits-game",
  "main .main-content",
  "main",
  "body"
];

// إزالة جميع وسوم <script> من HTML الجزئي (حماية من أخطاء MIME)
function stripScripts(html) {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('script').forEach(s => s.remove());
    return doc.body.innerHTML || html;
  } catch {
    return html.replace(/<script[\s\S]*?<\/script>/gi, '');
  }
}

async function loadPage(htmlPath, moduleLoader, subjectType) {
  const mainContent = document.getElementById('app-main') || document.querySelector('main.main-content');
  try {
    // CSS الموضوع (إن وُجد)
    if (subjectType && SUBJECT_CSS[subjectType]) {
      ensureCss(['/css/common-components-subjects.css', SUBJECT_CSS[subjectType]]);
    }

    hideAllControls();

    const res = await fetch(htmlPath, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`فشل تحميل الصفحة: ${htmlPath} (status ${res.status})`);
    let html = await res.text();

    // لو رجعت وثيقة كاملة بالخطأ
    if (/<\!doctype html>|<html|<header[^>]+top-navbar/i.test(html)) {
      console.warn(`[loader] "${htmlPath}" أعاد وثيقة كاملة (غالبًا index.html). سأحاول استخراج جزء المحتوى فقط.`);
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const candidate = FRAGMENT_SELECTORS.map(sel => doc.querySelector(sel)).find(Boolean);
      html = candidate ? candidate.innerHTML : '<p>تعذّر تحميل الصفحة.</p>';
    }

    // 🔒 تنظيف أي <script> داخل الجزئي
    mainContent.innerHTML = stripScripts(html);

    // ترجمات فورية لمحتوى الصفحة المحقون
    try { await applyTranslations(); } catch {}

    // تهيئة مجموعة التحكم للموضوع (إن وُجد)، ثم ضع «حسابك» تحتها + طبّق i18n لتلك العناصر
    if (subjectType) initializeSubjectControls(subjectType);
    i18nNormalizeControls();

    // ننتظر فريم لضمان اكتمال حقن عناصر التحكم ثم نرتّب «حسابك»
    requestAnimationFrame(() => {
      placeAccountSectionBelowActiveControls();
      initSidebarObserver(); // مرّة واحدة
    });

    // تشغيل منطق الصفحة/اللعبة إن وُجد
    if (typeof moduleLoader === 'function') {
      await moduleLoader();
    }

    console.log(`✅ تم تحميل الصفحة: ${htmlPath}`);
  } catch (err) {
    console.error(`❌ خطأ في تحميل الصفحة: ${htmlPath}`, err);
    if (mainContent) {
      mainContent.innerHTML = `<div class="error-box">حدث خطأ أثناء تحميل الصفحة المطلوبة.</div>`;
    }
  }
}

onLangChange(() => {
  i18nNormalizeControls();
});

/* ------------------------- ربط الدوال بنافذة المتصفح ------------------------- */
window.showHomePage = () => {
  const main = document.getElementById('app-main') || document.querySelector('main.main-content');
  main.innerHTML = `
    <section id="welcome-message">
      <h1>مرحباً بك في الموسوعة التفاعلية للأطفال</h1>
      <p>اختر موضوعاً من القائمة لبدء التعلم واللعب.</p>
    </section>
  `;
  hideAllControls();
  requestAnimationFrame(() => {
    placeAccountSectionBelowActiveControls();
    initSidebarObserver();
  });
};

// صفحات المواضيع (تبقى كما هي)
window.loadAnimalsPage        = () => loadPage("/html/animals.html",        loadAnimalsGameContent,       "animal");
window.loadFruitsPage         = () => loadPage("/html/fruits.html",         loadFruitsGameContent,        "fruit");
window.loadVegetablesPage     = () => loadPage("/html/vegetables.html",     loadVegetablesGameContent,    "vegetable");
window.loadHumanBodyPage      = () => loadPage("/html/human-body.html",     loadHumanBodyGameContent,     "human-body");
window.loadProfessionsPage    = () => loadPage("/html/professions.html",    loadProfessionsGameContent,   "profession");
window.loadToolsPage          = () => loadPage("/html/tools.html",          loadToolsGameContent,         "tools");

// ✅ «أين عائلتي؟» — حقن HTML ثم استيراد ديناميكي للموديول
window.loadFamilyGroupsGamePage = () =>
  loadPage(
    "/html/family-groups-game.html",
    async () => {
      ensureCss(['/css/common-components-subjects.css', SUBJECT_CSS['family-groups']]);
      const mod = await import('/src/subjects/family-groups-game.js');
      await mod.loadFamilyGroupsGameContent(); // دالة التهيئة داخل الموديول
    },
    "family-groups"
  );

// نشاط الحروف
window.loadAlphabetActivity = () =>
  loadPage(
    "/html/alphabet-activity.html",
    async () => {
      ensureCss(['/css/common-components-subjects.css', '/css/alphabet-activity.css']);
      await loadAlphabetActivityContent();
    }
  );

window.loadMemoryGamePage    = () => loadPage("/html/memory-game.html",    loadMemoryGameContent,        "memory-game");
window.loadToolsMatchPage    = () => loadPage("/html/tools-match.html",    loadToolsMatchGameContent,    "tools-match");

// حساب المستخدم
window.loadLogin    = () => loadPage("/users/login.html");
window.loadRegister = () => loadPage("/users/register.html");
window.loadProfile  = () => loadPage("/users/profile.html");
window.loadMyReport = () => loadPage("/users/my-report.html");

/* ------------------------- تهيئة اللغة ------------------------- */
(function initLang() {
  const lang = getCurrentLang();
  loadLanguage(lang).then(() => applyTranslations());
})();

/* ------------------------- مراقبة حالة الدخول ------------------------- */
(function initAuthWatch() {
  try {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      updateAccountActionsUI(user);
    });
  } catch (e) {
    console.warn('[auth] Firebase Auth غير مهيّأة بعد. سيتم استخدام الحالة الافتراضية.', e);
    updateAccountActionsUI(null);
  }
})();

// تشغيل الصفحة الرئيسية عند الجاهزية
window.addEventListener('DOMContentLoaded', () => {
  showHomePage();
});
