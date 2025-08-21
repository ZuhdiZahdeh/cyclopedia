// /src/core/lang-handler.js
// نسخة موحّدة مع واجهة توافقية لصفحات الألعاب

// اللغة الحالية
export let currentLang = localStorage.getItem("lang") || "ar";
let currentTranslations = {};

// نجعل المسارات نسبية لتعمل على الويب وداخل Capacitor WebView
const BASE = "./";

// ضبط اتجاه الصفحة حسب اللغة
export function setDirection(lang) {
  const dir = (lang === "ar" || lang === "he") ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lang);
}

// getter رسمي
export function getCurrentLang() {
  return currentLang;
}

// alias توافقية (مطلوبة من بعض الملفات)
export function getActiveLang() {
  return getCurrentLang();
}

// deep get: يدعم مفاتيح مثل "fruits.title"
function deepGet(obj, path) {
  return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);
}

/** تحميل ملف الترجمة للغة المختارة ثم تطبيقه */
export async function loadLanguage(lang) {
  // مسار نسبي يضمن العمل مع base='./'
  const href = `${BASE}lang/${lang}.json`;
  try {
    const res = await fetch(href, { cache: "no-store" });
    if (!res.ok) throw new Error(`تعذّر تحميل ملف الترجمة: ${href}`);
    currentTranslations = await res.json();
  } catch (err) {
    console.error("❌ خطأ في تحميل الترجمة:", err);
    return null;
  }
  applyTranslations();
  return currentTranslations;
}

/** تطبيق الترجمات على العناصر التي تحمل data-i18n */
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

/** تغيير اللغة مع ضبط الاتجاه وبث حدث languageChanged */
export async function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  setDirection(lang);
  await loadLanguage(lang); // نحمّل ونطبّق قبل إشعار المستمعين
  document.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
  return currentLang;
}
// توافق مع صفحات قديمة:
export function setLang(lang) {
  return setLanguage(lang);
}
export function changeLang(lang) {
  return setLanguage(lang);
}

/* ============== واجهة توافقية ==============
   بعض الصفحات تستدعي onLangChange(callback)
   نضيف API تعلّق على حدث languageChanged
*/
export function onLangChange(callback) {
  if (typeof callback !== "function") return;
  document.addEventListener("languageChanged", (e) => callback(e.detail));
}
