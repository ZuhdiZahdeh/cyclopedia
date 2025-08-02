import ar from '/lang/ar.json';
import en from '/lang/en.json';
import he from '/lang/he.json';

// ✅ تحديد اللغة الحالية من localStorage أو المتصفح
export function getCurrentLang() {
  const storedLang = localStorage.getItem('lang');
  if (storedLang) return storedLang;
  const browserLang = navigator.language?.split('-')[0];
  return ['ar', 'en', 'he'].includes(browserLang) ? browserLang : 'ar';
}

// ✅ تحميل الترجمة حسب اللغة
export function loadLanguage(lang) {
  switch (lang) {
    case 'ar': return ar;
    case 'en': return en;
    case 'he': return he;
    default: return ar;
  }
}

// ✅ ضبط اتجاه الصفحة بناءً على اللغة
export function setDirection(lang) {
  const html = document.documentElement;
  const isRTL = lang === 'ar' || lang === 'he';
  html.setAttribute('lang', lang);
  html.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
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
