import { db } from './firebase-config.js';
import { getDocs, collection } from 'firebase/firestore';
import { currentLang, applyTranslations } from './lang-handler.js';
import { playAudio, stopCurrentAudio } from './audio-handler.js';
import { recordActivity } from './activity-handler.js';

let professions = [];
let currentProfessionIndex = 0;
let currentProfession = null;
let currentVoiceType = 'teacher';

// تحميل بيانات المهن
export async function loadProfessionsGameContent() {
  stopCurrentAudio();
  const mainContentArea = document.querySelector("main.main-content");

  const response = await fetch("/html/professions.html");
  const html = await response.text();
  mainContentArea.innerHTML = html;

  document.getElementById("profession-sidebar-controls").style.display = "block";

  await loadProfessions();
  showProfession(currentProfessionIndex);
  setupControls();
}

// جلب البيانات من قاعدة البيانات
async function loadProfessions() {
  const querySnapshot = await getDocs(collection(db, "professions"));
  professions = querySnapshot.docs.map(doc => doc.data());
}

// عرض المهنة الحالية
function showProfession(index) {
  if (!professions.length) return;

  currentProfessionIndex = (index + professions.length) % professions.length;
  currentProfession = professions[currentProfessionIndex];

  const nameEl = document.getElementById("profession-name");
  const imgEl = document.getElementById("profession-image");

  if (nameEl && imgEl && currentProfession) {
    nameEl.textContent = currentProfession.name?.[currentLang] || "بدون اسم";
    imgEl.src = currentProfession.image_path || "";
    imgEl.alt = currentProfession.name?.[currentLang] || "";

    applyTranslations();
    attachClickHandlers();  // ✅ إضافة معالجات الضغط
  }
}

// تشغيل الصوت للمهنة الحالية
function playCurrentProfessionAudio() {
  if (!currentProfession || !currentProfession.sound) return;
  const soundPath = currentProfession.sound?.[currentLang]?.[currentVoiceType];
  if (soundPath) playAudio(soundPath);
}

// إعداد أدوات التحكم الجانبية
function setupControls() {
  const langSelect = document.getElementById("game-lang-select-profession");
  const voiceSelect = document.getElementById("voice-select-profession");
  const playBtn = document.getElementById("play-sound-btn-profession");
  const prevBtn = document.getElementById("prev-profession-btn");
  const nextBtn = document.getElementById("next-profession-btn");

  langSelect?.addEventListener("change", (e) => {
    location.reload(); // أو إعادة تهيئة التطبيق باللغة الجديدة
  });

  voiceSelect?.addEventListener("change", (e) => {
    currentVoiceType = e.target.value;
  });

  playBtn?.addEventListener("click", () => {
    playCurrentProfessionAudio();
    recordActivity("play_profession_audio", currentProfession?.name?.[currentLang] || "");
  });

  prevBtn?.addEventListener("click", () => {
    showProfession(currentProfessionIndex - 1);
  });

  nextBtn?.addEventListener("click", () => {
    showProfession(currentProfessionIndex + 1);
  });
}

// ✅ إضافة تفعيل الصوت عند الضغط على الصورة أو الكلمة
function attachClickHandlers() {
  const nameEl = document.getElementById("profession-name");
  const imgEl = document.getElementById("profession-image");

  if (nameEl) {
    nameEl.classList.add("clickable-text");
    nameEl.onclick = () => {
      playCurrentProfessionAudio();
      recordActivity("click_profession_name", currentProfession?.name?.[currentLang] || "");
    };
  }

  if (imgEl) {
    imgEl.classList.add("clickable-image");
    imgEl.onclick = () => {
      playCurrentProfessionAudio();
      recordActivity("click_profession_image", currentProfession?.name?.[currentLang] || "");
    };
  }
}
