// professions-game.js - نسخة نهائية مع تشغيل الصوت عند الضغط على الصورة أو الاسم

import { db } from "./firebase-config.js";
import {
  getDocs,
  collection,
  query
} from "firebase/firestore";

import {
  currentLang,
  currentVoice,
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
  const response = await fetch("/html/professions.html");
  const html = await response.text();
  mainContentArea.innerHTML = html;

  await loadLanguage();
  applyTranslations();
  setDirection();

  await loadProfessions();
  setupEventListeners();
  showProfession(currentIndex);
}

async function loadProfessions() {
  const querySnapshot = await getDocs(query(collection(db, "professions")));
  professions = querySnapshot.docs.map(doc => doc.data());
}

function setupEventListeners() {
  document.getElementById("next-btn")?.addEventListener("click", () => {
    stopCurrentAudio();
    currentIndex = (currentIndex + 1) % professions.length;
    showProfession(currentIndex);
  });

  document.getElementById("prev-btn")?.addEventListener("click", () => {
    stopCurrentAudio();
    currentIndex = (currentIndex - 1 + professions.length) % professions.length;
    showProfession(currentIndex);
  });

  document.getElementById("play-sound-btn")?.addEventListener("click", () => {
    playCurrentProfessionAudio();
  });

  document.getElementById("show-description-btn")?.addEventListener("click", () => {
    const descDiv = document.getElementById("profession-description");
    descDiv.classList.toggle("hidden");
  });
}

function showProfession(index) {
  const profession = professions[index];
  if (!profession) return;
  displayProfession(profession);
  recordActivity("view_profession", profession.name?.[currentLang] || "");
}

function displayProfession(professionData) {
  currentProfessionData = professionData;

  const nameEl = document.getElementById("profession-name");
  const imageEl = document.getElementById("profession-image");

  nameEl.textContent = professionData.name?.[currentLang] || "---";
  imageEl.src = `/${professionData.image_path}`;
  imageEl.alt = professionData.name?.en || "profession";

  nameEl.style.cursor = "pointer";
  imageEl.style.cursor = "pointer";
  nameEl.onclick = playCurrentProfessionAudio;
  imageEl.onclick = playCurrentProfessionAudio;

  const descEl = document.getElementById("profession-description");
  descEl.innerHTML = `
    <strong class="section-title">الوصف:</strong>
    <p>${professionData.description?.[currentLang] || ""}</p>
    <p><strong>المهن المرتبطة:</strong> ${(professionData.related_professions || [])
      .map(name => name)
      .join(", ")}</p>`;
}

function playCurrentProfessionAudio() {
  if (!currentProfessionData?.sound?.[currentLang]?.[currentVoice]) return;
  playAudio(currentProfessionData.sound[currentLang][currentVoice]);
}
export {
  loadProfessionsGameContent,
  showNextProfession,
  showPreviousProfession,
  playCurrentProfessionAudio
};