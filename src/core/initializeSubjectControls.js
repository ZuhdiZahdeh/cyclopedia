// src/js/initializeSubjectControls.js
import { getCurrentLang, setLanguage } from "./lang-handler.js";

const SIDEBAR_ID = "sidebar-section";

// خريطة تطابق subjectType الحالي مع معرفات عناصر اللغة في السايدبار
const LANG_SELECT_BY_SUBJECT = {
  "animal":        "#game-lang-select-animal",
  "fruit":         "#game-lang-select-fruit",
  "vegetable":     "#game-lang-select-vegetable",
  "human-body":    "#game-lang-select-human-body",
  "profession":    "#game-lang-select-profession",
  "tool":          "#game-lang-select-tool",
  "alphabet-press":"#alphabet-press-language-select",
  "memory-game":   "#memory-game-language-select",
  "tools-match":   "#tools-match-language-select"
};

export function initializeSubjectControls(subjectType) {
  const sidebar = document.getElementById(SIDEBAR_ID);
  if (!sidebar) {
    console.warn("[init] لم يتم العثور على #sidebar-section");
    return;
  }

  // 1) إخفاء أي مجموعة تحكم قديمة
  [...sidebar.querySelectorAll(".sidebar-controls")].forEach(n => (n.style.display = "none"));

  // 2) إظهار مجموعة تحكم الموضوع الحالي (نمط المعرّف: <subject>-sidebar-controls)
  const controlsId = `${subjectType}-sidebar-controls`;
  const active = document.getElementById(controlsId);
  if (active) {
    active.style.display = "block";
  } else {
    // ليس كل الصفحات لها قالب سايدبار خاص؛ لا بأس
    console.log(`[init] لا توجد عناصر سايدبار خاصة بالموضوع: ${controlsId}`);
  }

  // 3) ضبط Select اللغة في هذه الصفحة إن وُجد
  const langSelectSelector = LANG_SELECT_BY_SUBJECT[subjectType];
  if (langSelectSelector) {
    const langSelect = document.querySelector(langSelectSelector);
    if (langSelect) {
      langSelect.value = getCurrentLang();
      langSelect.onchange = () => setLanguage(langSelect.value); // سيطلق حدث languageChanged ويعيد تطبيق الترجمات
    }
  }

  console.log(`[init] subject=${subjectType} | lang=${getCurrentLang()}`);
}
