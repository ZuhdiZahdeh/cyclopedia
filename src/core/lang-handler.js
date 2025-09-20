// /src/core/lang-handler.js

export let currentLang = localStorage.getItem('lang') || 'ar';
let currentTranslations = {};

// ---- Safe import.meta access (works even when import.meta is unsupported) ----
function getBaseUrl() {
  try {
    return import.meta.env.BASE_URL;
  } catch (_) {
    return '/';
  }
}

const BASE = getBaseUrl();

const CANDIDATE_PATHS = (lang) => ([
  `${BASE}i18n/${lang}.json`,
  `${BASE}lang/${lang}.json`,
  `./i18n/${lang}.json`,
  `./lang/${lang}.json`,
]);

function deepGet(obj, path) {
  return String(path).split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);
}

function renderVars(str, vars) {
  if (!vars || typeof str !== 'string') return str;
  let s = str;
  for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

export function setDirection(lang) {
  const dir = (lang === 'ar' || lang === 'he') ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
}

export function getCurrentLang() { return currentLang; }
export function getActiveLang()  { return getCurrentLang(); }

async function fetchJsonWithFallback(urls) {
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const ct = (res.headers.get('content-type') || '').toLowerCase();

      if (!ct.includes('application/json') && !ct.includes('json')) {
        const peek = (await res.text()).slice(0, 30);
        if (peek.trim().toLowerCase().startsWith('<!doctype')) continue;
        try { return JSON.parse(peek); } catch { continue; }
      }
      return await res.json();
    } catch (_) { /* Error fetching */ }
  }
  throw new Error('i18n JSON not found in provided paths');
}

/** Loads the translation for the selected language */
export async function loadLanguage(lang) {
  const key = (lang || 'ar').toLowerCase();
  const urls = CANDIDATE_PATHS(key);
  try {
    currentTranslations = await fetchJsonWithFallback(urls);
  } catch (err) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) console.error('i18n load failed:', urls, err);
    currentTranslations = {};
    return null;
  }
  applyTranslations();
  return currentTranslations;
}

/** t: Returns the raw or translated value for a given key */
export function t(key, vars) {
  const raw = deepGet(currentTranslations, key);
  if (raw == null) return key;
  return renderVars(raw, vars);
}

/** Applies translations to elements with data-i18n attribute */
export function applyTranslations(translations) {
  const dict = (translations && typeof translations === 'object')
    ? (currentTranslations = translations)
    : currentTranslations;

  if (!dict || typeof dict !== 'object') return;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key  = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr');
    const useHtml = el.getAttribute('data-i18n-html') === '1';
    const val = t(key);

    if (attr) {
      el.setAttribute(attr, val);
    } else if (useHtml) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });
}

export async function setLanguage(lang) {
  currentLang = (lang || 'ar').toLowerCase();
  localStorage.setItem('lang', currentLang);
  setDirection(currentLang);
  await loadLanguage(currentLang);
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: currentLang }));
  return currentLang;
}

export function setLang(lang)     { return setLanguage(lang); }
export function changeLang(lang)  { return setLanguage(lang); }

/** onLangChange: Binds a callback to a language change event */
export function onLangChange(callback) {
  if (typeof callback !== 'function') return;
  document.addEventListener('languageChanged', (e) => callback(e.detail));
}

/** Ensures i18n is ready by loading the default language */
export async function ensureI18nReady(defaultLang) {
  const lang = (defaultLang || localStorage.getItem('lang') || 'ar').toLowerCase();
  currentLang = lang;
  setDirection(lang);
  await loadLanguage(lang);
}