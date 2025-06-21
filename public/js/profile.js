import { db } from './firebase-config.js';
import { doc, updateDoc } from 'firebase/firestore';
import { loadLanguage } from './lang-handler.js';

// إعداد اللغة واتجاه الصفحة
const lang = localStorage.getItem("language") || "en";
document.documentElement.lang = lang;
document.body.setAttribute("dir", lang === "ar" || lang === "he" ? "rtl" : "ltr");
loadLanguage(lang);

// تحميل بيانات المستخدم
const user = JSON.parse(localStorage.getItem("user") || "{}");
document.getElementById("username").value = user.username || "";
document.getElementById("language").value = user.language || "en";

// تحديث البيانات عند الإرسال
document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const newUsername = document.getElementById("username").value.trim();
  const newLang = document.getElementById("language").value;

  try {
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, {
      username: newUsername,
      language: newLang
    });

    // تحديث localStorage
    user.username = newUsername;
    user.language = newLang;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("language", newLang);

    document.getElementById("statusMsg").textContent = "✅ Profile updated!";
  } catch (err) {
    console.error("Update error:", err);
    document.getElementById("statusMsg").textContent = "❌ Failed to update profile.";
  }
});
