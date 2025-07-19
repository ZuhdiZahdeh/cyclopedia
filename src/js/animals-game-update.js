// ✅ animals-game-update.js - النسخة المعدلة لدعم صوت ابن الحيوان

import { getCollectionItems, shuffleArray, playAudio, recordActivity } from "../src/js/firebase-utils";

let animalItems = [];
let currentAnimalIndex = 0;
let currentAnimalData = null;

const cardImage = document.getElementById("card-image-animal");
const cardTitle = document.getElementById("card-title-animal");
const nextBtn = document.getElementById("next-card-btn-animal");
const playSoundBtn = document.getElementById("play-sound-btn-animal");
const playBabySoundBtn = document.getElementById("play-baby-sound-btn-animal");

export async function initAnimalsGame() {
  try {
    const data = await getCollectionItems("categories", "animals");
    animalItems = shuffleArray(data);
    currentAnimalIndex = 0;
    showAnimalCard();
  } catch (error) {
    console.error("🐞 Error loading animal data:", error);
  }
}

function showAnimalCard() {
  const animal = animalItems[currentAnimalIndex];
  currentAnimalData = animal;

  cardImage.src = `images/animals/${animal.image}`;
  cardImage.alt = animal.name.ar;
  cardTitle.textContent = animal.name.ar;
}

nextBtn.onclick = () => {
  currentAnimalIndex = (currentAnimalIndex + 1) % animalItems.length;
  showAnimalCard();
};

playSoundBtn.onclick = () => playCurrentAnimalAudio();
if (playBabySoundBtn) playBabySoundBtn.onclick = () => playCurrentBabyAudio();

function playCurrentAnimalAudio() {
  const lang = document.getElementById("game-lang-select-animal").value;
  const voiceType = document.getElementById("voice-select-animal")?.value || "boy";

  const soundPath = currentAnimalData?.sound?.[lang]?.[voiceType];
  if (soundPath) {
    playAudio(`/${soundPath}`);
    recordActivity(JSON.parse(localStorage.getItem("user")), "animals");
  } else {
    console.warn("🔇 لم يتم العثور على الصوت.");
  }
}

function playCurrentBabyAudio() {
  const lang = document.getElementById("game-lang-select-animal").value;
  const voiceType = document.getElementById("voice-select-animal")?.value || "boy";

  const soundPath = currentAnimalData?.baby?.sound?.[lang]?.[voiceType];
  if (soundPath) {
    playAudio(`/${soundPath}`);
    recordActivity(JSON.parse(localStorage.getItem("user")), "animals_baby");
  } else {
    console.warn("🔇 لا يوجد صوت لابن الحيوان.");
  }
}
