// animals-game.js

import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";

import {
  playAudio,
  stopCurrentAudio
} from "./audio-handler.js";

import {
  loadLanguage,
  applyTranslations,
  getCurrentLang
} from "./lang-handler.js";

import { recordActivity } from "./activity-handler.js";

let animals = [];
let currentIndex = 0;
let currentAnimalData = null;

export async function loadAnimalsGameContent() {
  stopCurrentAudio();

  const mainContentArea = document.querySelector("main.main-content");
  const response = await fetch("/html/animals.html");
  const html = await response.text();
  mainContentArea.innerHTML = html;

  await loadLanguage(getCurrentLang());
  applyTranslations();

  await fetchAnimalsData();
  showAnimalAt(currentIndex);

  document.getElementById("next-animal-btn").onclick = showNextAnimal;
  document.getElementById("prev-animal-btn").onclick = showPreviousAnimal;
  document.getElementById("play-sound-btn-animal").onclick = playCurrentAnimalAudio;
}

async function fetchAnimalsData() {
  const q = query(collection(db, "animals"), orderBy("name.ar"));
  const querySnapshot = await getDocs(q);
  animals = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

function showAnimalAt(index) {
  if (index >= 0 && index < animals.length) {
    currentAnimalData = animals[index];
    updateAnimalContent();
  }
}

function showNextAnimal() {
  if (currentIndex < animals.length - 1) {
    currentIndex++;
    showAnimalAt(currentIndex);
  }
}

function showPreviousAnimal() {
  if (currentIndex > 0) {
    currentIndex--;
    showAnimalAt(currentIndex);
  }
}

function updateAnimalContent() {
  const lang = getCurrentLang();

  const animalImage = document.getElementById("animal-image");
  const animalWord = document.getElementById("animal-word");

  if (animalImage) {
    animalImage.src = `/images/animals/${currentAnimalData.image}`;
    animalImage.alt = currentAnimalData.name[lang];
    animalImage.onclick = playCurrentAnimalAudio;
    animalImage.classList.add("clickable-image");
  }

  if (animalWord) {
    const name = currentAnimalData.name[lang];
    if (name) {
      const firstLetter = name.charAt(0);
      const restOfName = name.substring(1);
      animalWord.innerHTML = `<span class="highlight-first-letter">${firstLetter}</span>${restOfName}`;
    } else {
      animalWord.textContent = "";
    }
    animalWord.onclick = playCurrentAnimalAudio;
    animalWord.classList.add("clickable-text");
  }

  playCurrentAnimalAudio();

  const user = JSON.parse(localStorage.getItem("user"));
  if (user) recordActivity(user, "animals");
}

function playCurrentAnimalAudio() {
  const lang = getCurrentLang();
  const voiceType = document.getElementById("voice-select-animal")?.value || "boy";
  const soundPath = currentAnimalData?.voices?.[`${voiceType}_${lang}`];

  if (soundPath) {
    console.log("🎧 Full audio path:", soundPath);
    playAudio(soundPath);
  } else {
    console.warn("🔇 No audio path found for:", voiceType, lang);
  }
}

export {
  showNextAnimal,
  showPreviousAnimal,
  playCurrentAnimalAudio,
};
