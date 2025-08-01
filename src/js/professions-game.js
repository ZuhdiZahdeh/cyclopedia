import { db } from "./firebase-config.js";
import { collection, getDocs } from "firebase/firestore";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { currentLang } from "./lang-handler.js";
import { recordActivity } from "./activity-handler.js";

let professions = [];
let currentProfessionIndex = 0;
let currentProfessionData = null;

// تحميل المهن من Firestore
async function loadProfessionsFromDB() {
  const snapshot = await getDocs(collection(db, "professions"));
  professions = snapshot.docs.map(doc => doc.data());
}

// عرض مهنة حسب الفهرس
function showProfession(index) {
  if (index < 0 || index >= professions.length) return;

  currentProfessionIndex = index;
  currentProfessionData = professions[index];

  const nameEl = document.getElementById("profession-name");
  const imgEl = document.getElementById("profession-image");
  const descEl = document.getElementById("profession-description");

  nameEl.textContent = currentProfessionData.name?.[currentLang] || "";
  imgEl.src = currentProfessionData.image_path || "";
  imgEl.alt = nameEl.textContent;

  descEl.textContent = currentProfessionData.description?.[currentLang] || "";
  descEl.classList.add("hidden");

  // مؤشر يد عند المرور على الصورة والاسم
  imgEl.style.cursor = "pointer";
  nameEl.style.cursor = "pointer";

  // تشغيل الصوت عند الضغط على الصورة أو الاسم
  imgEl.onclick = () => playCurrentProfessionAudio();
  nameEl.onclick = () => playCurrentProfessionAudio();

  // سجل النشاط
  recordActivity("profession_view", {
    name: currentProfessionData.name?.[currentLang] || "",
  });
}

// تشغيل الصوت الحالي
function playCurrentProfessionAudio() {
  if (!currentProfessionData) return;

  const voiceSelect = document.getElementById("voice-select-profession");
  const voiceType = voiceSelect?.value || "teacher";
  const soundPath = currentProfessionData.sound?.[currentLang]?.[voiceType];

  if (soundPath) {
    playAudio(soundPath);
  }
}

// عرض التالي
function showNextProfession() {
  const nextIndex = (currentProfessionIndex + 1) % professions.length;
  showProfession(nextIndex);
}

// عرض السابق
function showPreviousProfession() {
  const prevIndex = (currentProfessionIndex - 1 + professions.length) % professions.length;
  showProfession(prevIndex);
}

// تبديل وصف المهنة
function toggleDescription() {
  const descEl = document.getElementById("profession-description");
  if (descEl) {
    descEl.classList.toggle("hidden");
  }
}

// تحميل صفحة المهن كاملة
export async function loadProfessionsGameContent() {
  stopCurrentAudio();
  const mainContent = document.querySelector("main.main-content");
  const response = await fetch("/html/professions.html");
  mainContent.innerHTML = await response.text();

  // إظهار أدوات التحكم الجانبية
  document.getElementById("profession-sidebar-controls").style.display = "block";

  await loadProfessionsFromDB();
  showProfession(0);

  // ربط الأحداث
  document.getElementById("play-sound-btn-profession")?.addEventListener("click", playCurrentProfessionAudio);
  document.getElementById("prev-profession-btn")?.addEventListener("click", showPreviousProfession);
  document.getElementById("next-profession-btn")?.addEventListener("click", showNextProfession);
  document.getElementById("toggle-description-btn-profession")?.addEventListener("click", toggleDescription);
}
