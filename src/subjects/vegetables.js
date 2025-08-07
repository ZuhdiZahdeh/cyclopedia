import { db } from "../core/firebase-config.js";
import { collection, getDocs } from "firebase/firestore";
import { getCurrentLang } from "../core/lang-handler.js";
import { playAudio } from "../core/audio-handler.js";
import { setupDescriptionToggleButton } from "../controls/vegetables-controls.js";

let vegetables = [];
let currentIndex = 0;
let currentVegetableData = null;

export async function loadVegetablesGameContent() {
  const main = document.querySelector("main.main-content");
  if (!main) return;

  const res = await fetch("/html/vegetables.html");
  const html = await res.text();
  main.innerHTML = html;

  await fetchVegetablesData();
  setupListeners();
  displayCurrentVegetable();
  setupDescriptionToggleButton();

  document.addEventListener("languageChanged", () => {
    displayCurrentVegetable();
  });
}

async function fetchVegetablesData() {
  const querySnapshot = await getDocs(collection(db, "vegetables"));
  vegetables = querySnapshot.docs.map(doc => doc.data());
}

function displayCurrentVegetable() {
  const lang = getCurrentLang();
  const voiceType = document.getElementById("voice-select-vegetable")?.value || "boy";
  currentVegetableData = vegetables[currentIndex];

  if (!currentVegetableData) return;

  const nameEl = document.getElementById("vegetable-name");
  const imageEl = document.getElementById("vegetable-image");
  const descEl = document.getElementById("vegetable-description");

  nameEl.textContent = currentVegetableData.name?.[lang] || "---";
  imageEl.src = `images/vegetables/${currentVegetableData.image}`;
  imageEl.alt = currentVegetableData.name?.[lang] || "";
  descEl.textContent = currentVegetableData.description?.[lang] || "---";

  enableSoundOnClick(currentVegetableData, lang, voiceType);
}

function setupListeners() {
  document.getElementById("prev-vegetable-btn").onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      displayCurrentVegetable();
    }
  };

  document.getElementById("next-vegetable-btn").onclick = () => {
    if (currentIndex < vegetables.length - 1) {
      currentIndex++;
      displayCurrentVegetable();
    }
  };

  document.getElementById("play-sound-btn-vegetable").onclick = () => {
    playCurrentVegetableSound();
  };

  document.getElementById("voice-select-vegetable").onchange = () => {
    displayCurrentVegetable();
  };

  const langSelect = document.getElementById("game-lang-select-vegetable");
  if (langSelect) {
    langSelect.value = getCurrentLang();
    langSelect.onchange = () => {
      localStorage.setItem("lang", langSelect.value);
      location.reload();
    };
  }
}

function playCurrentVegetableSound() {
  const lang = getCurrentLang();
  const voiceType = document.getElementById("voice-select-vegetable").value;
  const soundBase = currentVegetableData.sound_base;
  const audioPath = `audio/${lang}/vegetables/${soundBase}_${voiceType}_${lang}.mp3`;
  playAudio(audioPath);
}

function enableSoundOnClick(vegetableData, currentLang, selectedVoiceType) {
  const nameEl = document.getElementById("vegetable-name");
  const imageEl = document.getElementById("vegetable-image");

  const soundPath = vegetableData.voices?.[`${selectedVoiceType}_${currentLang}`]
    || vegetableData.voices?.[`boy_${currentLang}`];

  if (!soundPath) return;

  const play = () => playAudio(soundPath);

  if (nameEl) {
    nameEl.onclick = play;
    nameEl.style.cursor = "pointer";
  }

  if (imageEl) {
    imageEl.onclick = play;
    imageEl.style.cursor = "pointer";
  }
}