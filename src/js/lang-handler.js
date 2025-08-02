// ✅ جلب ملفات الترجمة من مجلد public/lang حسب اللغة
export async function loadLanguage(lang) {
  try {
    const response = await fetch(`/lang/${lang}.json`);
    if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
    return await response.json();
  } catch (error) {
    console.error('Translation load error:', error);
    return {};
  }
}

// ✅ تحديد اللغة الحالية من localStorage أو المتصفح
export function getCurrentLang() {
  const storedLang = localStorage.getItem('lang');
  if (storedLang) return storedLang;
  const browserLang = navigator.language?.split('-')[0];
  return ['ar', 'en', 'he'].includes(browserLang) ? browserLang : 'ar';
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
