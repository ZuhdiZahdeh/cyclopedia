// نسخة محدثة من professions-game.js لتشغيل الصوت عند الضغط على اسم المهنة أو صورتها

import { db } from "./firebase-config.js";
import { getDocs, collection, query } from "firebase/firestore";
import {
  currentLang,
  loadLanguage,
  applyTranslations,
  setDirection
} from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let professions = [];
let currentIndex = 0;
let currentProfessionData = null;

export async function loadProfessionsGameContent() {
  stopCurrentAudio();

  const mainContentArea = document.querySelector("main.main-content");
  const professionSidebar = document.getElementById("profession-sidebar-controls");

  if (!mainContentArea || !professionSidebar) {
    console.error("Main content area or profession sidebar not found.");
    return;
  }

  // Inject HTML structure
  mainContentArea.innerHTML = `
    <div class="game-box">
      <h2 id="profession-name" class="item-main-name"></h2>
      <img id="profession-image" src="" alt="profession" />

      <div class="profession-description-box info-box" id="profession-description-box" style="display:none;">
        <h4>الوصف:</h4>
        <p id="profession-description">---</p>
      </div>
    </div>
  `;

  // Controls
  const langSelect = document.getElementById("game-lang-select-profession");
  const voiceSelect = document.getElementById("voice-select-profession");
  const playSoundBtn = document.getElementById("play-sound-btn-profession");
  const prevBtn = document.getElementById("prev-profession-btn");
  const nextBtn = document.getElementById("next-profession-btn");
  const toggleDescBtn = document.getElementById("toggle-description-btn-profession");

  // Fetch data
  await fetchProfessions(langSelect.value);

  if (professions.length === 0) {
    console.warn("No professions found for this language.");
    document.getElementById("profession-name").textContent = "لا توجد بيانات";
    document.getElementById("profession-description").textContent = "غير متوفر.";
    document.getElementById("profession-image").src = "/images/default.png";
    disableProfessionButtons(true);
    return;
  }

  currentIndex = 0;
  updateProfessionContent();
  disableProfessionButtons(false);

  langSelect.onchange = async () => {
    const newLang = langSelect.value;
    await loadLanguage(newLang);
    applyTranslations();
    setDirection(newLang);
    await loadProfessionsGameContent();
  };

  if (playSoundBtn) playSoundBtn.onclick = () => playCurrentProfessionAudio();
  if (prevBtn) prevBtn.onclick = () => showPreviousProfession();
  if (nextBtn) nextBtn.onclick = () => showNextProfession();
  if (toggleDescBtn) toggleDescBtn.onclick = () => {
    const descBox = document.getElementById("profession-description-box");
    descBox.style.display = descBox.style.display === "none" ? "block" : "none";
  };

  applyTranslations();
  setDirection(langSelect.value);
}

function updateProfessionContent() {
  if (professions.length === 0) return;

  currentProfessionData = professions[currentIndex];

  const img = document.getElementById("profession-image");
  const nameEl = document.getElementById("profession-name");
  const descEl = document.getElementById("profession-description");

  img.src = `/${currentProfessionData.image_path}`;
  img.alt = currentProfessionData.name[currentLang];
  img.onclick = playCurrentProfessionAudio; // ✅ تشغيل الصوت عند الضغط على الصورة

  nameEl.textContent = currentProfessionData.name[currentLang] || "";
  nameEl.onclick = playCurrentProfessionAudio; // ✅ تشغيل الصوت عند الضغط على الاسم

  descEl.textContent = currentProfessionData.description?.[currentLang] || "لا يوجد وصف.";

  document.getElementById("prev-profession-btn").disabled = currentIndex === 0;
  document.getElementById("next-profession-btn").disabled = currentIndex === professions.length - 1;

  stopCurrentAudio();
}

async function fetchProfessions() {
  try {
    const colRef = collection(db, "professions");
    const q = query(colRef);
    const snap = await getDocs(q);
    professions = snap.docs.map(doc => doc.data());
  } catch (err) {
    console.error("Error fetching professions from Firestore:", err);
    professions = [];
  }
}

export function showNextProfession() {
  stopCurrentAudio();
  if (currentIndex < professions.length - 1) {
    currentIndex++;
    updateProfessionContent();
    recordActivity(JSON.parse(localStorage.getItem("user")), "professions");
  }
}

export function showPreviousProfession() {
  stopCurrentAudio();
  if (currentIndex > 0) {
    currentIndex--;
    updateProfessionContent();
    recordActivity(JSON.parse(localStorage.getItem("user")), "professions");
  }
}

export function playCurrentProfessionAudio() {
  if (currentProfessionData) {
    const selectedVoice = document.getElementById("voice-select-profession").value;
    const lang = document.getElementById("game-lang-select-profession").value;
    const fileName = currentProfessionData.sound?.[lang]?.[selectedVoice];

    console.log("🎧 Trying to play:", fileName, "lang:", lang, "voice:", selectedVoice);

    if (!fileName) {
      console.error("❌ Audio not available for this profession/voice/lang");
      return;
    }

    const path = `/${fileName}`;
    console.log("✅ Playing audio:", path);
    playAudio(path);
    recordActivity(JSON.parse(localStorage.getItem("user")), "professions_audio");
  } else {
    console.warn("⚠️ No profession selected for audio playback.");
  }
}


function disableProfessionButtons(isDisabled) {
  [
    "play-sound-btn-profession",
    "prev-profession-btn",
    "next-profession-btn",
    "toggle-description-btn-profession",
    "game-lang-select-profession",
    "voice-select-profession"
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = isDisabled;
  });
}
