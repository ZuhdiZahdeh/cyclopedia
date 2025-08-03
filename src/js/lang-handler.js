// lang-handler.js

export let currentLang = localStorage.getItem("lang") || "ar";

// ✅ إرجاع اللغة الحالية
export function getCurrentLang() {
  return currentLang;
}

// ✅ ضبط اتجاه الصفحة حسب اللغة
export function setDirection(lang) {
  const dir = (lang === 'ar' || lang === 'he') ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
}

// ✅ تحميل ملف اللغة عبر fetch (من مجلد public/lang)
export async function loadLanguage(lang) {
  try {
    const response = await fetch(`/lang/${lang}.json`);
    if (!response.ok) {
      throw new Error(`تعذر تحميل ملف الترجمة: ${lang}.json`);
    }
    const translations = await response.json();
    applyTranslations(translations);
  } catch (error) {
    console.error("❌ خطأ في تحميل الترجمة:", error);
  }
}

// ✅ تطبيق الترجمة على العناصر التي تحتوي على data-i18n
export function applyTranslations(translations) {
  if (!translations || typeof translations !== 'object') {
    console.warn("⚠️ ملف الترجمة غير صالح أو غير محمّل.");
    return;
  }

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[key]) {
      element.innerHTML = translations[key];
    } else {
      console.warn(`🔍 المفتاح '${key}' غير موجود في ملف الترجمة.`);
    }
  });
}

// ✅ تغيير اللغة وتحديث التخزين والاتجاه وإطلاق حدث مخصص
export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  setDirection(lang);
  loadLanguage(lang);
  document.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
}