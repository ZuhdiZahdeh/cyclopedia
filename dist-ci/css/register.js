import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function showRegisterForm() {
  const res = await fetch('/users/register-form.html');
  const html = await res.text();
  document.querySelector('main.main-content').innerHTML = html;
  attachRegisterHandler();
}

function attachRegisterHandler() {
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const language = document.getElementById("language").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username,
        email,
        language,
        level: "Beginner",
        points: 0,
        avatar: "default.png",
        createdAt: serverTimestamp(),
        activityLog: {}
      });

      localStorage.setItem("user", JSON.stringify({ uid: user.uid, username, language }));
      localStorage.setItem("language", language);

      document.getElementById("registerStatus").textContent = "✅ تم التسجيل بنجاح!";
      setTimeout(() => location.reload(), 2000);

    } catch (error) {
      document.getElementById("registerStatus").textContent = `❌ ${error.message}`;
    }
  });
}