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

/* ------------------------------------------------------------------
   تأكيد تحميل ملفات CSS الأساسية (خصوصًا /css/style.css)
   هذه الدالة تُستدعى عند بدء الموديول، وأيضًا داخل loadPage.
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
    '/css/style.css', // ← الأهم لتفعيل Grid
	
  ];

  const head = document.head || document.getElementsByTagName('head')[0];

  // حوّل كل href إلى Pathname موحّد ثم تأكد من وجوده
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

  // إن ضُيف style.css الآن، أعطه لحظة ليُحمَّل قبل حساب التخطيط
  if (appended) {
    // ممكن ننتظر "idle" لكن هذا كافٍ لمعظم الحالات
    requestAnimationFrame(() => {});
  }
}
// استدعاء فوري عند تحميل هذا الملف
ensureBaseCss();

/* ------------------------- أدوات واجهة بسيطة للسايدبار ------------------------- */
// لا تُفرّغ القسم الثابت (حسابك)
function hideAllControls() {
  // أخفِ وافرغ الأقسام الديناميكية فقط
  document
    .querySelectorAll("#sidebar-section .sidebar-section:not(.static-section)")
    .forEach((sec) => {
      sec.style.display = "none";
      sec.innerHTML = "";
    });

  // تأكد أن السايدبار نفسه ظاهر
  const aside = document.getElementById("sidebar-section");
  if (aside) aside.style.display = "";
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

async function loadPage(htmlPath, moduleLoader, subjectType) {
  const mainContent = document.getElementById('app-main') || document.querySelector('main.main-content');
  try {
    // تأكيد روابط CSS في كل تنقل
    ensureBaseCss();
    hideAllControls();

    const res = await fetch(htmlPath, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`فشل تحميل الصفحة: ${htmlPath} (status ${res.status})`);
    const html = await res.text();

    // تحصين ضد رجوع index.html بالخطأ
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
window.showHomePage        = () => {
  const main = document.getElementById('app-main') || document.querySelector('main.main-content');
  main.innerHTML = `
    <section id="welcome-message">
      <h1>مرحباً بك في الموسوعة التفاعلية للأطفال</h1>
      <p>اختر موضوعاً من القائمة لبدء التعلم واللعب.</p>
    </section>
  `;
  hideAllControls();
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
