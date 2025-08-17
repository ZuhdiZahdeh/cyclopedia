// =========================
// main.js — النسخة النظيفة
// =========================

// لغة الواجهة
import { getCurrentLang, loadLanguage, applyTranslations } from '../core/lang-handler.js';

// تهيئة السايدبار الخاص بكل موضوع (تتولّى حقن ملف التحكم المناسب)
import { initializeSubjectControls } 		from '../core/initializeSubjectControls.js';

// ألعاب/صفحات المواضيع
import { loadAnimalsGameContent }        	from "../subjects/animals-game.js";
import { loadFruitsGameContent }         	from "../subjects/fruits-game.js";
import { loadVegetablesGameContent }     	from "../subjects/vegetables-game.js";
import { loadProfessionsGameContent }    	from "../subjects/professions-game.js";
import { loadToolsGameContent }          	from "../subjects/tools-game.js";
import { loadAlphabetActivityContent } 		from "../activities/alphabet-activity.js";
import { loadMemoryGameContent }         	from "../subjects/memory-game.js";
import { loadToolsMatchGameContent }     	from "../subjects/tools-match-game.js";
import { loadHumanBodyGameContent }      	from "../subjects/human-body-game.js";

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
  'tools-match':  '/css/tools-match.css'
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
  } catch(e) {}
});
}
// حمل الأساسي مرة واحدة
ensureCss(BASE_CSS);

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
  // عند تسجيل الدخول: أخفِ «تسجيل/إنشاء»، وأظهر «ملفي/تقاريري/خروج»
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

  // استبعد static-section، وخذ آخر قسم تحكّم ظاهر وبداخله محتوى
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
    // احتياطي: إن لم يوجد تحكّم ظاهر، ضع «حسابك» في آخر الشريط
    aside.appendChild(account);
  }
}
window.placeAccountSectionBelowActiveControls = placeAccountSectionBelowActiveControls;

// راقب تغيّرات الشريط الجانبي لإعادة ترتيب «حسابك» تلقائيًا
let _sidebarObserver;
function initSidebarObserver() {
  const aside = document.getElementById('sidebar-section');
  if (!aside || _sidebarObserver) return;

  let scheduled = false;
  _sidebarObserver = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { placeAccountSectionBelowActiveControls(); initSidebarObserver(); });};

// صفحات المواضيع
window.loadAnimalsPage       = () => loadPage("/html/animals.html",        loadAnimalsGameContent,       "animal");
window.loadFruitsPage        = () => loadPage("/html/fruits.html",         loadFruitsGameContent,        "fruit");
window.loadVegetablesPage    = () => loadPage("/html/vegetables.html",     loadVegetablesGameContent,    "vegetable");
window.loadHumanBodyPage     = () => loadPage("/html/human-body.html",     loadHumanBodyGameContent,     "human-body");
window.loadProfessionsPage   = () => loadPage("/html/professions.html",    loadProfessionsGameContent,   "profession");
window.loadToolsPage         = () => loadPage("/html/tools.html",          loadToolsGameContent,         "tools");

// نشاط الحروف (جديد بالكامل — بلا subjectType)
window.loadAlphabetActivity = () =>  loadPage(
  "/html/alphabet-activity.html",
  async () => {
    ensureCss(['/css/common-components-subjects.css', '/css/alphabet-activity.css']);
    await loadAlphabetActivityContent();
  }
);

window.loadMemoryGamePage    = () => loadPage("/html/memory-game.html",    loadMemoryGameContent,        "memory-game");
window.loadToolsMatchPage    = () => loadPage("/html/tools-match.html",    loadToolsMatchGameContent,    "tools-match");

// حساب المستخدم: تنقلات الصفحات
window.loadLogin    = () => loadPage("/users/login.html");
window.loadRegister = () => loadPage("/users/register.html");
window.loadProfile  = () => loadPage("/users/profile.html");
window.loadMyReport = () => loadPage("/users/my-report.html");

/* ------------------------- تهيئة اللغة ------------------------- */
initPerfMonitor();
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

// تشغيل الصفحة الرئيسية عند الجاهزية
window.addEventListener('DOMContentLoaded', () => {
  showHomePage();
});
