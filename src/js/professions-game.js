// src/js/professions-game.js
import { db } from "./firebase-config.js";
import { getDocs, collection, query } from "firebase/firestore";
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let professions = [];
let currentIndex = 0;
let currentProfessionData = null;

export async function loadProfessionsGameContent() {
  stopCurrentAudio();

  const mainContentArea = document.querySelector("main.main-content");
  if (!mainContentArea) {
    console.error("❌ لم يتم العثور على العنصر الرئيسي main-content.");
    return;
  }

  mainContentArea.innerHTML = `
    <div class="game-box">
      <h2 id="profession-word" class="item-main-name"></h2>
      <img id="profession-image" src="" alt="profession" style="max-width:400px; height:400px; object-fit:contain;" />
      <div class="profession-description-box info-box" id="profession-description-box" style="display:none;">
        <h4>الوصف:</h4>
        <p id="profession-description">---</p>
      </div>
    </div>
  `;

  const lang = document.getElementById("game-lang-select-profession")?.value || currentLang;
  await fetchProfessions(lang);

  if (professions.length === 0) {
    document.getElementById("profession-word").textContent = "لا توجد بيانات";
    document.getElementById("profession-image").src = "/images/default.png";
    disableProfessionButtons(true);
    return;
  }

  currentIndex = 0;
  updateProfessionContent();
  disableProfessionButtons(false);

  const toggleDescBtn = document.getElementById("toggle-description-btn-profession");
  const descriptionBox = document.getElementById("profession-description-box");
  if (toggleDescBtn && descriptionBox) {
    toggleDescBtn.onclick = () => {
      descriptionBox.style.display = descriptionBox.style.display === "none" ? "block" : "none";
    };
  }
}

function updateProfessionContent() {
  currentProfessionData = professions[currentIndex];
  if (!currentProfessionData) return;

  const lang = document.getElementById("game-lang-select-profession")?.value || currentLang;
  const title = currentProfessionData.name?.[lang] || "---";
  const img = document.getElementById("profession-image");
  const word = document.getElementById("profession-word");
  const desc = document.getElementById("profession-description");

  word.innerHTML = `<span class="highlight-first-letter">${title.charAt(0)}</span>${title.slice(1)}`;
  img.src = `/${currentProfessionData.image_path}`;
  img.alt = title;
  desc.textContent = currentProfessionData.description?.[lang] || "لا يوجد وصف";

  document.getElementById("prev-profession-btn").disabled = currentIndex === 0;
  document.getElementById("next-profession-btn").disabled = currentIndex === professions.length - 1;

  stopCurrentAudio();
}

async function fetchProfessions(lang) {
  try {
    const itemsCollectionRef = collection(db, "categories", "professions", "items");
    const q = query(itemsCollectionRef);
    const snapshot = await getDocs(q);
    professions = snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching professions:", error);
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
  const lang = document.getElementById("game-lang-select-profession")?.value || currentLang;
  const voice = document.getElementById("voice-select-profession")?.value || "teacher";

  if (currentProfessionData && currentProfessionData.sound?.[lang]?.[voice]) {
    const audioPath = `/${currentProfessionData.sound[lang][voice]}`;
    playAudio(audioPath);
    recordActivity(JSON.parse(localStorage.getItem("user")), "professions");
  } else {
    console.warn("❌ لم يتم العثور على مسار الصوت للمهنة الحالية.");
  }
}

function disableProfessionButtons(disabled) {
  ["play-sound-btn-profession", "prev-profession-btn", "next-profession-btn", "voice-select-profession", "game-lang-select-profession"]
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.disabled = disabled;
    });
}

