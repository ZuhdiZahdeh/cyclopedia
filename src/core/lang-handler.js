// /core/lang-handler.js

export let currentLang = localStorage.getItem("lang") || "ar";
let currentTranslations = {}; // ← نخزّن آخر ترجمة محمّلة

export function getCurrentLang() {
  return currentLang;
}

export function setDirection(lang) {
  const dir = (lang === 'ar' || lang === 'he') ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
}


export async function loadLanguage(lang) {
  try {
    const response = await fetch(`/lang/${lang}.json`);
    if (!response.ok) throw new Error(`تعذر تحميل ملف الترجمة: ${lang}.json`);
    currentTranslations = await response.json();
    applyTranslations(); // ← بدون باراميتر: يستخدم الكاش
  } catch (error) {
    console.error("❌ خطأ في تحميل الترجمة:", error);
  }
}

export function applyTranslations(translations) {
  // لو وصلنا ترجمات، حدّث الكاش؛ وإلا استخدم آخر كاش معروف
  const dict = (translations && typeof translations === 'object')
    ? (currentTranslations = translations)
    : currentTranslations;

  if (!dict || typeof dict !== 'object') return;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key in dict && typeof dict[key] === 'string') {
      el.innerHTML = dict[key];
    }
    // لا نرمي تحذيرات مزعجة عند غياب المفتاح
  });
}

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  setDirection(lang);
  loadLanguage(lang); // async
  document.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
}
