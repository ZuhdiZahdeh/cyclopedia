import { loadLanguage } from './lang-handler.js'; // ✅ استيراد من الملف الصحيح

window.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("language") || "en";
  document.documentElement.lang = lang;
  document.body.setAttribute("dir", lang === "ar" || lang === "he" ? "rtl" : "ltr");

  loadLanguage(lang); // ✅ يعمل الآن بشكل سليم

  handleAuthUI();
});

// 🔐 إدارة واجهة الدخول والخروج
function handleAuthUI() {
  const isLoggedIn = localStorage.getItem("user");

  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!loginBtn || !registerBtn || !logoutBtn) return;

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
