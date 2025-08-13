// /core/lang-handler.js
export let currentLang = localStorage.getItem("lang") || "ar";
let currentTranslations = {}; // آخر ترجمة محمّلة

export function getCurrentLang() {
  return currentLang;
}

export function setDirection(lang) {
  const dir = (lang === "ar" || lang === "he") ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lang);
}

// deep get: يدعم مفاتيح على شكل fruits.title
function deepGet(obj, path) {
  return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);
}

export async function loadLanguage(lang) {
  try {
    const res = await fetch(`/lang/${lang}.json`, { cache: "no-store" });
    if (!res.ok) throw new Error(`تعذر تحميل ملف الترجمة: ${lang}.json`);
    currentTranslations = await res.json();
    applyTranslations(); // يستخدم الكاش
    return currentTranslations;
  } catch (err) {
    console.error("❌ خطأ في تحميل الترجمة:", err);
    return null;
  }
}

export function applyTranslations(translations) {
  const dict = (translations && typeof translations === "object")
    ? (currentTranslations = translations)
    : currentTranslations;

  if (!dict || typeof dict !== "object") return;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = deepGet(dict, key);
    if (typeof val === "string") {
      el.innerHTML = val;
    }
  });
}

export async function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  setDirection(lang);
  await loadLanguage(lang); // ← انتظار التحميل قبل إطلاق الحدث
  document.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
  return currentLang;
}
