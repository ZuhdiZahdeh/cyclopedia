// لغة الواجهة
import { getCurrentLang, loadLanguage, applyTranslations } from '../core/lang-handler.js';

// تهيئة السايدبار الخاص بكل موضوع
import { initializeSubjectControls } from '../core/initializeSubjectControls.js';

// ألعاب/صفحات المواضيع
import { loadAnimalsGameContent }    from "../subjects/animals-game.js";
import { loadFruitsGameContent }     from "../subjects/fruits-game.js";
import { loadVegetablesGameContent } from "../subjects/vegetables-game.js";
import { loadHumanBodyGameContent }  from "../subjects/human-body-game.js";
import { loadProfessionsGameContent }from "../subjects/professions-game.js";
import { loadToolsGameContent }      from "../subjects/tools-game.js";
import { loadAlphabetPressGameContent } from "../subjects/alphabet-press-game.js";
import { loadMemoryGameContent }     from "../subjects/memory-game.js";
import { loadToolsMatchGameContent } from "../subjects/tools-match-game.js";

// 🔐 Firebase Auth (مع تحصين لو لم تكن مهيّأة)
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

/* ------------------------------------------------------------------
   تأكيد تحميل ملفات CSS الأساسية (خصوصًا /css/style.css)
-------------------------------------------------------------------*/
function ensureBaseCss() {
  const MUST = [
    '/css/colors.css',
    '/css/fonts.css',
    '/css/shared-utilities.css',
    '/css/forms.css',
    '/css/professions.css',
    '/css/alphabet-press.css',
    '/css/human-body.css',
    '/css/memory-game.css',
    '/css/tools-match.css',
    '/css/animals.css',
    '/css/common-components-subjects.css',
    '/css/style.css'
  ];

  const head = document.head || document.getElementsByTagName('head')[0];
  const existing = new Set(
    Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map(l => {
        try { return new URL(l.getAttribute('href'), location.href).pathname; }
        catch { return l.getAttribute('href') || ''; }
      })
  );

  let appended = false;
  for (const href of MUST) {
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
ensureBaseCss();

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
function attachAccountActionsToSidebar() {
  // الهدف: التأكد أن كتلة "حسابك" تأتي أسفل أقسام التحكم الديناميكية
  const aside = document.getElementById('sidebar-section');
  if (!aside) return;

  const actions = document.getElementById('account-actions');
  if (!actions) return;

  // إن وُجد غلاف .sidebar-section لكتلة الحساب، انقله ليكون آخر عنصر في الـ aside
  const wrapper = actions.closest('.sidebar-section') || actions;
  if (aside.lastElementChild !== wrapper) {
    aside.appendChild(wrapper);
  }
}

function updateAccountActionsUI(user) {
  const loggedIn = !!user;
  const setHidden = (id, hidden) => {
    const el = document.getElementById(id);
    if (el) el.hidden = hidden;
  };

  // عند تسجيل الدخول: أخفِ «تسجيل/إنشاء»، وأظهر «ملفي/تقاريري/خروج»
  setHidden('loginBtn',      loggedIn);
  setHidden('registerBtn',   loggedIn);
  setHidden('my-profile-btn',!loggedIn);
  setHidden('my-report-btn', !loggedIn);
  setHidden('logoutBtn',     !loggedIn);
}

async function handleLogout() {
  try {
    const auth = getAuth();
    await signOut(auth);
  } catch (e) {
    console.error('Signout error:', e);
  }
}
window.handleLogout = handleLogout; // لاستخدامها من الـ HTML

/* ------------------------- محمل صفحات عام (مُحصَّن) ------------------------- */
const FRAGMENT_SELECTORS = [
  "#page-content",
  ".subject-page",
  "#fruits-game",
  "main .main-content",
  "main",
  "body"
];

async function loadPage(htmlPath, moduleLoader, subjectType) {
  const mainContent = document.getElementById('app-main') || document.querySelector('main.main-content');
  try {
    ensureBaseCss();
    hideAllControls();

    const res = await fetch(htmlPath, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`فشل تحميل الصفحة: ${htmlPath} (status ${res.status})`);
    const html = await res.text();

    if (/<\!doctype html>|<html|<header[^>]+top-navbar/i.test(html)) {
      console.warn(`[loader] "${htmlPath}" أعاد وثيقة كاملة (غالبًا index.html). سأحاول استخراج جزء المحتوى فقط.`);
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const candidate = FRAGMENT_SELECTORS.map(sel => doc.querySelector(sel)).find(Boolean);
      mainContent.innerHTML = candidate ? candidate.innerHTML : '<p>تعذّر تحميل الصفحة.</p>';
    } else {
      mainContent.innerHTML = html;
    }

    // تهيئة مجموعة التحكم للموضوع (إن وُجد)
    if (subjectType) {
      initializeSubjectControls(subjectType);
    }

    // ضَمَن أن «حسابك» في أسفل السايدبار بعد حقن أي تحكّم
    attachAccountActionsToSidebar();

    // تشغيل منطق الصفحة/اللعبة
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
  attachAccountActionsToSidebar();
};

// صفحات المواضيع
window.loadAnimalsPage       = () => loadPage("/html/animals.html",        loadAnimalsGameContent,       "animal");
window.loadFruitsPage        = () => loadPage("/html/fruits.html",         loadFruitsGameContent,        "fruit");
window.loadVegetablesPage    = () => loadPage("/html/vegetables.html",     loadVegetablesGameContent,    "vegetable");
window.loadHumanBodyPage     = () => loadPage("/html/human-body.html",     loadHumanBodyGameContent,     "human-body");
window.loadProfessionsPage   = () => loadPage("/html/professions.html",    loadProfessionsGameContent,   "profession");
window.loadToolsPage         = () => loadPage("/html/tools.html",          loadToolsGameContent,         "tools");
window.loadAlphabetPressPage = () => loadPage("/html/alphabet-press.html", loadAlphabetPressGameContent, "alphabet-press");
window.loadMemoryGamePage    = () => loadPage("/html/memory-game.html",    loadMemoryGameContent,        "memory-game");
window.loadToolsMatchPage    = () => loadPage("/html/tools-match.html",    loadToolsMatchGameContent,    "tools-match");

// حساب المستخدم: تنقلات الصفحات
window.loadLogin    = () => loadPage("/users/login.html");
window.loadRegister = () => loadPage("/users/register.html");
window.loadProfile  = () => loadPage("/users/profile.html");
window.loadMyReport = () => loadPage("/users/my-report.html");

/* ------------------------- تهيئة اللغة ------------------------- */
(function initLang() {
  const lang = getCurrentLang();
  loadLanguage(lang).then(() => applyTranslations());
})();

/* ------------------------- تفعيل مراقبة حالة الدخول ------------------------- */
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

// إتاحة الدوال للاستخدام العام (لو احتجتَها في أماكن أخرى)
window.updateAccountActionsUI = updateAccountActionsUI;
window.attachAccountActionsToSidebar = attachAccountActionsToSidebar;
