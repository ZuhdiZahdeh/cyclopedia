// src/js/main.js — متوافق مع Vite
// ----------------------------------------------------
// ملاحظات:
// - يفترض وجود <main class="main-content"> في index.html
// - دوال مثل showSubjectControls / initializeSubjectControls / hideAllControls
//   قد تكون معرفة في ملفات أخرى. هنا نتحقق من وجودها قبل الاستدعاء.
// - يحتوي الملف على نقاط فحص/تشخيص في الكونسول لتسهيل تتبع المشاكل.
// ----------------------------------------------------

console.log("[APP BOOT] main.js loaded");

// ====== تهيئة اللغة والاتجاه ======
function getCurrentLang() {
  return localStorage.getItem("language") || "ar";
}

function applyLangAttributes(lang) {
  document.documentElement.lang = lang;
  const rtl = (lang === "ar" || lang === "he");
  document.documentElement.dir = rtl ? "rtl" : "ltr";
  document.body.setAttribute("dir", rtl ? "rtl" : "ltr");
  console.log("[LANG] set", { lang, dir: document.documentElement.dir });
}

function setLanguage(lang) {
  localStorage.setItem("language", lang);
  applyLangAttributes(lang);
  // لو عندك معالجات ترجمة عامة، استدعها هنا
  if (typeof window?.refreshTranslations === "function") {
    try {
      window.refreshTranslations(lang);
    } catch (e) {
      console.warn("[LANG] refreshTranslations failed:", e?.message);
    }
  }
}

// عند تحميل الـ DOM
window.addEventListener("DOMContentLoaded", () => {
  const lang = getCurrentLang();
  applyLangAttributes(lang);
  handleAuthUI();
  // نقاط فحص أولية لعناصر نتوقع وجودها
  assertEl("sidebar-section");
  assertMainContent();
});

// ====== أدوات تشخيص عامة ======
function assertEl(id) {
  const el = document.getElementById(id);
  if (!el) console.warn(`[ASSERT] #${id} not found`);
  else console.log(`[ASSERT] #${id} ok`);
  return el;
}
function getMainContent() {
  const el = document.querySelector("main.main-content");
  if (!el) console.error('[ASSERT] <main class="main-content"> not found!');
  return el;
}
function assertMainContent() { return getMainContent(); }

async function probe(url) {
  try {
    const r = await fetch(url, { method: "HEAD" });
    console.log("[PROBE]", url, "->", r.status);
  } catch (e) {
    console.warn("[PROBE FAIL]", url, e?.message);
  }
}

// أمثلة فحص مسارات مهمة (اختياري):
probe("/src/js/main.js");
probe("/html/tools-match.html");

// ====== إدارة واجهة الدخول/الخروج (بسيطة عبر localStorage) ======
function handleAuthUI() {
  const isLoggedIn = !!localStorage.getItem("user");
  const loginBtn    = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn   = document.getElementById("logoutBtn");

  if (!loginBtn || !registerBtn || !logoutBtn) {
    console.log("[AUTH] buttons not all found — skipping UI toggle");
    return;
  }

  if (isLoggedIn) {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "inline";
  } else {
    loginBtn.style.display = "inline";
    registerBtn.style.display = "inline";
    logoutBtn.style.display = "none";
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    location.reload();
  });
}

// ====== واجهة عامة لتحميل صفحة وتهيئتها ======
export function loadPage(subject, htmlPath, loadFunction) {
  console.log("[ROUTER] loadPage", { subject, htmlPath });
  // إخفاء عناصر التحكم لو متوفرة
  if (typeof window?.hideAllControls === "function") {
    try { window.hideAllControls(); } catch (_) {}
  }

  const mainContentArea = getMainContent();
  if (!mainContentArea) return;

  fetch(htmlPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${htmlPath}: ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      mainContentArea.innerHTML = html;

      // استدعِ دالة تحميل المحتوى الخاصة بالموضوع إن وُجدت
      if (typeof loadFunction === "function") {
        try {
          loadFunction();
        } catch (e) {
          console.error("[ROUTER] loadFunction error:", e?.message);
        }
      }

      // إظهار عناصر التحكم الخاصة بالموضوع إن وُجدت
      if (typeof window?.showSubjectControls === "function") {
        try { window.showSubjectControls(subject); } catch (_) {}
      }
      if (typeof window?.initializeSubjectControls === "function") {
        try { window.initializeSubjectControls(subject); } catch (_) {}
      }

      console.log("[ROUTER] page loaded:", htmlPath);
    })
    .catch((err) => {
      console.error("[ROUTER] loadPage error:", err?.message);
    });
}

// ====== لعبة "من صاحب الأداة؟" — تحميل وتشغيل فوري ======
window.loadToolsMatchPage = async () => {
  console.log("[ROUTER] loadToolsMatchPage -> /html/tools-match.html");
  const mainContentArea = getMainContent();
  if (!mainContentArea) return;

  try {
    const response = await fetch("/html/tools-match.html");
    if (!response.ok) throw new Error(`Failed to fetch tools-match.html: ${response.status}`);
    const html = await response.text();
    mainContentArea.innerHTML = html;

    // استيراد سكربت اللعبة وتشغيلها مباشرة
    const module = await import("/src/js/tools-match-game.js");
    if (typeof module?.loadToolsMatchGameContent === "function") {
      await module.loadToolsMatchGameContent();
      console.log("[TOOLS-MATCH] Game bootstrapped");
    } else {
      console.warn("[TOOLS-MATCH] loadToolsMatchGameContent not found in module");
    }

    // عناصر التحكم الخاصة إن كانت لديك دوال عامة
    if (typeof window?.showSubjectControls === "function") {
      try { window.showSubjectControls("tools"); } catch (_) {}
    }
    if (typeof window?.initializeSubjectControls === "function") {
      try { window.initializeSubjectControls("tools"); } catch (_) {}
    }
  } catch (e) {
    console.error("[TOOLS-MATCH] load error:", e?.message);
  }
};

// ====== API صغيرة لتبديل اللغة (اختياري استدعاؤها من القائمة) ======
window.setLanguage = setLanguage;
window.getCurrentLang = getCurrentLang;
