// src/js/main.js

// لغة الواجهة
import {
  getCurrentLang,
  loadLanguage,
  applyTranslations,
} from '../core/lang-handler.js';

// تهيئة السايدبار الخاص بكل موضوع
import { initializeSubjectControls } from '../core/initializeSubjectControls.js';

// ألعاب/صفحات المواضيع
import { loadAnimalsGameContent } from "../subjects/animals-game.js";
import { loadFruitsGameContent } from "../subjects/fruits-game.js";
import { loadVegetablesGameContent } from "../subjects/vegetables-game.js";
import { loadHumanBodyGameContent } from "../subjects/human-body-game.js";
import { loadProfessionsGameContent } from "../subjects/professions-game.js";
import { loadToolsGameContent } from "../subjects/tools-game.js";
import { loadAlphabetPressGameContent } from "../subjects/alphabet-press-game.js";
import { loadMemoryGameContent } from "../subjects/memory-game.js";
import { loadToolsMatchGameContent } from "../subjects/tools-match-game.js";

/* ------------------------- أدوات واجهة بسيطة للسايدبار ------------------------- */
function hideAllControls() {
  document.querySelectorAll("#sidebar-section .sidebar-section").forEach((sec) => {
    sec.style.display = "none";
    sec.innerHTML = ""; // نفرغ القديم حتى لا تتراكم الأزرار
  });
}

/* ------------------------- محمل صفحات عام (مصحّح) ------------------------- */
async function loadPage(htmlPath, moduleLoader, subjectType) {
  try {
    hideAllControls();

    // 1) تحميل HTML داخل <main>
    const mainContent = document.querySelector('main.main-content');
    const res = await fetch(htmlPath);
    if (!res.ok) throw new Error(`فشل تحميل الصفحة: ${htmlPath}`);
    mainContent.innerHTML = await res.text();

    // 2) تهيئة مجموعة التحكم (إن لزم)
    if (subjectType) {
      // تُنشئ وتُظهر مجموعة التحكم الصحيحة داخل #sidebar-section
      initializeSubjectControls(subjectType);
    }

    // 3) تشغيل منطق الصفحة/اللعبة بعد توفر السايدبار
    if (typeof moduleLoader === 'function') {
      await moduleLoader();
    }

    console.log(`✅ تم تحميل الصفحة: ${htmlPath}`);
  } catch (err) {
    console.error(`❌ خطأ في تحميل الصفحة: ${htmlPath}`, err);
  }
}

/* ------------------------- ربط الدوال بنافذة المتصفح ------------------------- */
window.showHomePage = () => {
  const main = document.querySelector("main.main-content");
  main.innerHTML = `
    <section id="welcome-message">
      <h1>مرحباً بك في الموسوعة التفاعلية للأطفال</h1>
      <p>اختر موضوعاً من القائمة لبدء التعلم واللعب.</p>
    </section>
  `;
  hideAllControls();
};

// صفحات المواضيع (نفس التوقيع)
window.loadAnimalsPage      = () => loadPage("/html/animals.html",       loadAnimalsGameContent,      "animal");
window.loadFruitsPage       = () => loadPage("/html/fruits.html",        loadFruitsGameContent,       "fruit");
window.loadVegetablesPage   = () => loadPage("/html/vegetables.html",    loadVegetablesGameContent,   "vegetable");
window.loadHumanBodyPage    = () => loadPage("/html/human-body.html",    loadHumanBodyGameContent,    "human-body");
window.loadProfessionsPage  = () => loadPage("/html/professions.html",   loadProfessionsGameContent,  "profession");
window.loadToolsPage        = () => loadPage("/html/tools.html",         loadToolsGameContent,        "tools");
window.loadAlphabetPressPage= () => loadPage("/html/alphabet-press.html",loadAlphabetPressGameContent,"alphabet-press");
window.loadMemoryGamePage   = () => loadPage("/html/memory-game.html",   loadMemoryGameContent,       "memory-game");
window.loadToolsMatchPage   = () => loadPage("/html/tools-match.html",   loadToolsMatchGameContent,   "tools-match");

// حساب المستخدم (لو عندك صفحات مستخدم)
window.loadLogin    = () => loadPage("/users/login.html");
window.loadRegister = () => loadPage("/users/register.html");
window.loadProfile  = () => loadPage("/users/profile.html");
window.loadMyReport = () => loadPage("/users/my-report.html");

/* ------------------------- تهيئة اللغة ------------------------- */
(function initLang() {
  const lang = getCurrentLang();
  loadLanguage(lang).then(() => applyTranslations());
})();
