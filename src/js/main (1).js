// main.js — متوافق مع Vite + Firebase SDK v9

window.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("language") || "en";
  document.documentElement.lang = lang;
  document.body.setAttribute("dir", lang === "ar" || lang === "he" ? "rtl" : "ltr");

  handleAuthUI(); // لإظهار أزرار الدخول والخروج
});

// ✅ إدارة واجهة الدخول والخروج
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

// ✅ تحميل لعبة "من صاحب الأداة؟" ديناميكيًا وتشغيلها فورًا
window.loadToolsMatchPage = async () => {
  const mainContentArea = document.querySelector("main.main-content");
  const response = await fetch('/html/tools-match.html');
  const html = await response.text();
  mainContentArea.innerHTML = html;

  const module = await import("/src/js/tools-match-game.js");
  module.loadToolsMatchGameContent(); // ✅ يبدأ اللعبة مباشرة دون زر
};