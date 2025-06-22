import { db } from './firebase-config.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function showProfileForm() {
  const res = await fetch('/users/profile.html');
  const html = await res.text();
  document.querySelector('main.main-content').innerHTML = html;
  attachProfileHandler();
}

async function attachProfileHandler() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  document.getElementById("username").value = user.username || "";
  document.getElementById("language").value = user.language || "en";

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    document.getElementById("points-value").textContent = data.points || 0;
    const logList = document.getElementById("activity-log");
    const log = data.activityLog || {};
    logList.innerHTML = '';
    Object.entries(log).forEach(([key, val]) => {
      const li = document.createElement("li");
      li.textContent = `${val.action} – ${new Date(val.timestamp?.toDate?.() || val.timestamp).toLocaleString()}`;
      logList.appendChild(li);
    });
  }

  document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newUsername = document.getElementById("username").value.trim();
    const newLang = document.getElementById("language").value;

    try {
      await updateDoc(ref, {
        username: newUsername,
        language: newLang
      });
      user.username = newUsername;
      user.language = newLang;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("language", newLang);
      document.getElementById("statusMsg").textContent = "✅ تم تحديث البيانات!";
    } catch (err) {
      document.getElementById("statusMsg").textContent = "❌ فشل التحديث.";
    }
  });
}