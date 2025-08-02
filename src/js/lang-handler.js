console.log("✅ lang-handler.js loaded - النسخة الآمنة");

let currentLang = 'ar';
let translations = {};

export async function loadLanguage(lang) {
  currentLang = lang;

  try {
    const response = await fetch(`/lang/${lang}.json`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    translations = await response.json();
    updateTranslations();
  } catch (error) {
    console.error(`❌ Failed to load language file: /lang/${lang}.json`, error);
  }
}

function updateTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = getTranslation(key);
    if (text) el.innerText = text;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = getTranslation(key);
    if (text) el.setAttribute('placeholder', text);
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const text = getTranslation(key);
    if (text) el.setAttribute('title', text);
  });
}

export function getTranslation(key) {
  return translations[key] || key;
}

export function getCurrentLanguage() {
  return currentLang;
}
