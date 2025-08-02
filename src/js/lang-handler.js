
import ar from '/lang/ar.json';
import en from '/lang/en.json';
import he from '/lang/he.json';

const translations = {
  ar,
  en,
  he
};

export function getCurrentLang() {
  return localStorage.getItem("lang") || "ar";
}

export function setCurrentLang(lang) {
  if (['ar', 'en', 'he'].includes(lang)) {
    localStorage.setItem("lang", lang);
  } else {
    console.warn("Unsupported language:", lang);
  }
}

export function applyTranslations(lang = getCurrentLang()) {
  const langData = translations[lang];

  if (!langData) {
    console.warn(`❌ لا توجد بيانات ترجمة للغة: ${lang}`);
    return;
  }

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const translation = langData[key];

    if (translation) {
      el.innerText = translation;
    } else {
      console.warn(`⚠️ مفتاح الترجمة غير موجود: '${key}' في اللغة: '${lang}'`);
    }
  });
}
