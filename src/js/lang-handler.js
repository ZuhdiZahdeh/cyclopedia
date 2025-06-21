let currentLang = localStorage.getItem("lang") || "ar";
let translations = {};

export { currentLang, translate, loadLanguage };

document.addEventListener("DOMContentLoaded", async () => {
  await loadLanguage(currentLang);
  applyTranslations();
  setDirection(currentLang);
});

async function loadLanguage(lang) {
  try {
    const res = await fetch(`/lang/${lang}.json`);
    translations = await res.json();
    currentLang = lang;
    localStorage.setItem("lang", lang);
    setDirection(lang);
  } catch (e) {
    console.error("Failed to load language:", e);
  }
}

function translate(key) {
  return translations[key] || key;
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.innerText = translate(key);
  });
}

function setDirection(lang) {
  const dir = (lang === "ar" || lang === "he") ? "rtl" : "ltr";
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", dir);
}


