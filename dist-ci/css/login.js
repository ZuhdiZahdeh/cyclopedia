import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export async function showLoginForm() {
  const res = await fetch('/users/login-form.html');
  const html = await res.text();
  document.querySelector('main.main-content').innerHTML = html;
  attachLoginHandler();
}

function attachLoginHandler() {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", async (e) => {
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
        document.getElementById("loginStatus").textContent = "✅ تم تسجيل الدخول بنجاح!";
        setTimeout(() => location.reload(), 1000);
      } else {
        document.getElementById("loginStatus").textContent = "⚠️ لا توجد بيانات للمستخدم.";
      }
    } catch (error) {
      document.getElementById("loginStatus").textContent = `❌ ${error.message}`;
    }
  });
}