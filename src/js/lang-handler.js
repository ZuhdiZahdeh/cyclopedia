// public/js/lang-handler.js

let currentLang = localStorage.getItem("lang") || "ar"; // اللغة الافتراضية "ar"
let translations = {}; // كائن لتخزين الترجمات المحملة

// تصدير جميع الدوال والمتغيرات التي قد تحتاجها الملفات الأخرى
export { currentLang, translate, loadLanguage, applyTranslations, setDirection }; // *** تم إضافة applyTranslations و setDirection هنا ***

// تشغيل عند تحميل DOM بالكامل
document.addEventListener("DOMContentLoaded", async () => {
  // تحميل اللغة الافتراضية
  await loadLanguage(currentLang);
  // تطبيق الترجمات على جميع العناصر التي تحتوي على data-i18n
  applyTranslations();
  // ضبط اتجاه النص (RTL/LTR)
  setDirection(currentLang);
});

/**
 * يحمل ملف JSON للغة المحددة ويخزنه في translations.
 * @param {string} lang - رمز اللغة (مثال: "ar", "en", "he").
 */
async function loadLanguage(lang) {
  try {
    const res = await fetch(`/lang/${lang}.json`); // جلب ملف الترجمة من مجلد /public/lang/
    translations = await res.json(); // تحويل الاستجابة إلى JSON
    currentLang = lang; // تحديث اللغة الحالية
    localStorage.setItem("lang", lang); // حفظ اللغة في التخزين المحلي
    setDirection(lang); // ضبط اتجاه النص بناءً على اللغة الجديدة

    // يمكن هنا إرسال حدث مخصص لإعلام المكونات الأخرى بتغيير اللغة
    // document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));

  } catch (e) {
    console.error(`Failed to load language '${lang}':`, e);
    // في حالة الفشل، يمكن العودة إلى لغة احتياطية أو إظهار رسالة
    if (lang !== "ar") { // تجنب حلقة لا نهائية إذا كانت العربية هي الفاشلة
        console.warn("Attempting to load default language 'ar' due to failure.");
        await loadLanguage("ar"); // محاولة تحميل لغة افتراضية
    }
  }
}

/**
 * يترجم المفتاح النصي إلى النص المقابل باللغة الحالية.
 * @param {string} key - مفتاح الترجمة.
 * @returns {string} النص المترجم أو المفتاح نفسه إذا لم يتم العثور على ترجمة.
 */
function translate(key) {
  return translations[key] || key;
}

/**
 * يطبق الترجمات على جميع عناصر HTML التي تحتوي على سمة data-i18n.
 */
function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.innerText = translate(key); // تحديث النص
  });
}

/**
 * يضبط اتجاه المستند (rtl أو ltr) وسمة lang في عنصر <html>.
 * @param {string} lang - رمز اللغة.
 */
function setDirection(lang) {
  const dir = (lang === "ar" || lang === "he") ? "rtl" : "ltr";
  document.documentElement.setAttribute("lang", lang); // ضبط سمة lang في <html>
  document.documentElement.setAttribute("dir", dir); // ضبط سمة dir في <html>
}