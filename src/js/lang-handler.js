let currentLang = localStorage.getItem("lang") || "ar";

// ✅ دالة استرجاع اللغة الحالية
export function getCurrentLang() {
  return currentLang;
}

// ✅ دالة ضبط اللغة
export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  setDirection(lang);
  loadLanguage(lang);
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
}

// ✅ تحميل ملف الترجمة وتطبيقه
export async function loadLanguage(lang) {
  try {
    const response = await fetch(`/lang/${lang}.json`);
    const translations = await response.json();
    applyTranslations(translations);
  } catch (error) {
    console.error("خطأ في تحميل ملف الترجمة:", error);
  }
}

// ✅ ضبط اتجاه الصفحة حسب اللغة
export function setDirection(lang) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lang);
}

// ✅ تطبيق الترجمة على العناصر التي تملك data-i18n
export function applyTranslations(translations) {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[key]) {
      element.innerHTML = translations[key];
    }
  });
}

// ✅ دالة ترجمة يدوية لمفتاح معين (اختيارية)
export async function translate(key) {
  try {
    const response = await fetch(`/lang/${currentLang}.json`);
    const translations = await response.json();
    return translations[key] || key;
  } catch (error) {
    console.error("فشل في الترجمة:", error);
    return key;
  }
}
