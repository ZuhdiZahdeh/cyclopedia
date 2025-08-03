// lang-handler.js

import ar from '/lang/ar.json';
import en from '/lang/en.json';
import he from '/lang/he.json';

export let currentLang = localStorage.getItem("lang") || "ar";

const languages = {
  ar,
  en,
  he
};

// ✅ إرجاع كائن الترجمة حسب اللغة
export function getTranslations(lang = currentLang) {
  return languages[lang] || ar;
}

// ✅ إرجاع اللغة الحالية
export function getCurrentLang() {
  return currentLang;
}

// ✅ ضبط اتجاه الصفحة
export function setDirection(lang) {
  const dir = lang === "ar" || lang === "he" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
}

// ✅ تحميل اللغة عند التشغيل
export function loadLanguage(lang = currentLang) {
  const translations = getTranslations(lang);
  applyTranslations(translations);
}

// ✅ تغيير اللغة وتخزينها
export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  setDirection(lang);
  loadLanguage(lang);
  document.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
}

// ✅ تطبيق الترجمة على جميع العناصر
export function applyTranslations(translations) {
  if (!translations || typeof translations !== 'object') {
    console.warn("⚠️ لم يتم تحميل الترجمة بشكل صحيح.");
    return;
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (translations[key]) {
      element.innerHTML = translations[key];
    } else {
      console.warn(`🔍 المفتاح '${key}' غير موجود في ملف الترجمة.`);
    }
  });
}
