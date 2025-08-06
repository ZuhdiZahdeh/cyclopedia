// src/core/lang-handler.js

const langOptions = {
  ar: { dir: "rtl", label: "العربية" },
  en: { dir: "ltr", label: "English" },
  he: { dir: "rtl", label: "עברית" },
};

let currentLang = localStorage.getItem("lang") || "ar";

export function getCurrentLang() {
  return currentLang;
}

export function setCurrentLang(newLang) {
  if (langOptions[newLang]) {
    currentLang = newLang;
    localStorage.setItem("lang", newLang);
    applyTranslations();
    updateDocumentDirection();
  }
}

export function loadLanguage() {
  const savedLang = localStorage.getItem("lang");
  if (savedLang && langOptions[savedLang]) {
    currentLang = savedLang;
  }
  applyTranslations();
  updateDocumentDirection();
}

export function applyTranslations() {
  fetch(`/lang/${currentLang}.json`)
    .then((res) => res.json())
    .then((translations) => {
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (translations[key]) {
          el.innerHTML = translations[key];
        }
      });

      document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[key]) {
          el.setAttribute("placeholder", translations[key]);
        }
      });
    })
    .catch((err) => {
      console.warn("ملف الترجمة غير صالح أو غير محمل.", err);
    });
}

export function updateDocumentDirection() {
  const html = document.documentElement;
  html.setAttribute("lang", currentLang);
  html.setAttribute("dir", langOptions[currentLang].dir);
}

export function initializeLanguageSelector(selectElement) {
  if (!selectElement) return;

  selectElement.innerHTML = "";

  Object.entries(langOptions).forEach(([langCode, { label }]) => {
    const option = document.createElement("option");
    option.value = langCode;
    option.textContent = label;
    if (langCode === currentLang) option.selected = true;
    selectElement.appendChild(option);
  });

  selectElement.addEventListener("change", (e) => {
    setCurrentLang(e.target.value);
  });
}
