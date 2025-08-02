// lang-handler.js

let currentLang = localStorage.getItem('lang') || 'ar';

// إرجاع اللغة الحالية
export function getCurrentLang() {
  return currentLang;
}

// ضبط اتجاه الصفحة حسب اللغة
export function setDirection(lang) {
  const dir = (lang === 'ar' || lang === 'he') ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
}

// تحميل ملف اللغة من مجلد public/lang/
export async function loadLanguage(lang) {
  try {
    const response = await fetch(`/lang/${lang}.json`);
    if (!response.ok) {
      throw new Error(`لم يتم العثور على ملف الترجمة: ${lang}.json`);
    }
    return await response.json();
  } catch (error) {
    console.error('خطأ في تحميل الترجمة:', error);
    return {};
  }
}

// تطبيق الترجمة على كل العناصر التي تحتوي على data-i18n
export function applyTranslations(translations) {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[key]) {
      element.innerHTML = translations[key];
    }
  });
}

// تغيير اللغة وتحديث الاتجاه وتطبيق الترجمة وإطلاق حدث
export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  setDirection(lang);

  loadLanguage(lang).then(translations => {
    applyTranslations(translations);
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
  });
}
