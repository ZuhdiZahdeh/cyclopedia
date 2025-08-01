// public/js/lang-handler.js


let currentLang = localStorage.getItem("lang") || "ar";
let currentVoice = localStorage.getItem("voice") || "boy";
let translations = {};

export { currentLang, currentVoice, translate, loadLanguage, applyTranslations, setDirection };


// عند تحميل الصفحة: تأكد أن اللغة محفوظة أو استخدم العربية كافتراضية
if (!localStorage.getItem("lang")) {
  localStorage.setItem("lang", "ar");
  currentLang = "ar";
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadLanguage(currentLang);
  applyTranslations();
  setDirection(currentLang);
});

/**
 * تحميل ملف لغة وتحديث الترجمات
 * @param {string} lang 
 * @returns {Promise<Object>} كائن الترجمة
 */
async function loadLanguage(lang) {
  try {
    const res = await fetch(`/lang/${lang}.json`);
    translations = await res.json();
    currentLang = lang;
    localStorage.setItem("lang", lang);
    setDirection(lang);

    // 🔁 إرسال حدث عند تغيير اللغة ليستفيد منه الآخرون
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));

    return translations;
  } catch (e) {
    console.error(`❌ فشل تحميل ملف اللغة '${lang}':`, e);
    if (lang !== "ar") {
      console.warn("⏪ محاولة تحميل اللغة الافتراضية 'ar'");
      return await loadLanguage("ar");
    }
  }
}

/**
 * ترجم مفتاح معين من ملف اللغة
 * @param {string} key 
 * @returns {string}
 */
function translate(key) {
  return translations[key] || key;
}

/**
 * تطبيق الترجمة على جميع العناصر بـ data-i18n
 */
function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.innerText = translate(key);
  });
}

/**
 * ضبط اتجاه النص واللغة على عنصر <html>
 * @param {string} lang 
 */
function setDirection(lang) {
  const dir = (lang === "ar" || lang === "he") ? "rtl" : "ltr";
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", dir);
}