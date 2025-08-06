// 📁 src/core/lang-handler.js

let translations = {};
let currentLang = localStorage.getItem("lang") || "ar";

const langDirections = { ar: "rtl", en: "ltr", he: "rtl" };

export function getCurrentLang() {
  return currentLang;
}

export function getLangDirection() {
  return langDirections[currentLang] || "rtl";
}

export async function loadLanguage(langCode) {
  try {
    const res = await fetch(`/lang/${langCode}.json`);
    if (!res.ok) throw new Error("Translation file not found");
    translations = await res.json();
    currentLang = langCode;
    localStorage.setItem("lang", langCode);
    applyTranslations();
    setDirection();
    updateLangSelectors();
  } catch (err) {
    console.error("❌ مشكلة في تحميل الترجمة:", err);
  }
}

export function applyTranslations(container = document) {
  container.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[key]) el.innerHTML = translations[key];
  });
}

export function setDirection() {
  const dir = getLangDirection();
  document.documentElement.setAttribute("dir", dir);
  document.body.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", currentLang);
}

export async function setLanguage(langCode) {
  await loadLanguage(langCode);
  document.dispatchEvent(new CustomEvent("languageChanged", { detail: langCode }));
}

export async function initializeLanguage() {
  await loadLanguage(currentLang);
}

function updateLangSelectors() {
  document.querySelectorAll(".lang-select").forEach(select => {
    select.value = currentLang;
  });
}
