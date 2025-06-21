import { loadLanguage } from './lang-handler.js';
import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const lang = localStorage.getItem("language") || "en";
document.documentElement.lang = lang;
document.body.setAttribute("dir", lang === "ar" || lang === "he" ? "rtl" : "ltr");
loadLanguage(lang);

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("language", userData.language || "en");
      document.getElementById("loginStatus").textContent = "✅ Logged in successfully!";
      setTimeout(() => window.location.href = "../html/welcome-personalized.html", 1500);
    } else {
      document.getElementById("loginStatus").textContent = "⚠️ User data not found.";
    }
  } catch (error) {
    console.error("Login error:", error);
    document.getElementById("loginStatus").textContent = `❌ ${error.message}`;
  }
});
