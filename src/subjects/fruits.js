// src/subjects/fruits.js

import { db } from "../core/db-handler.js";
import { collection, getDocs } from "firebase/firestore";
import { getCurrentLang } from "../core/lang-handler.js";
import { playAudio } from "../core/audio-handler.js";

let fruits = [];
let currentIndex = 0;
let currentFruitData = null;

export async function loadFruitsPage() {
  const response = await fetch("/html/fruits.html");
  const html = await response.text();
  document.querySelector("main.main-content").innerHTML = html;

  await fetchFruitsData();
  displayFruit();
  setupListeners();
}

async function fetchFruitsData() {
  const querySnapshot = await getDocs(collection(db, "fruits"));
  fruits = querySnapshot.docs.map(doc => doc.data());
}

function displayFruit() {
  const lang = getCurrentLang();
  currentFruitData = fruits[currentIndex];
  if (!currentFruitData) return;

  const nameEl = document.getElementById("fruit-name");
  const imageEl = document.getElementById("fruit-image");
  const descEl = document.getElementById("fruit-description");

  nameEl.textContent = currentFruitData.name[lang] || "";
  imageEl.src = `images/fruits/${currentFruitData.image}`;
  imageEl.alt = currentFruitData.name[lang] || "";
  descEl.textContent = currentFruitData.description[lang] || "";

  // تشغيل الصوت تلقائيًا إن وُجد
  const soundBase = currentFruitData.sound_base;
  const voiceType = document.getElementById("voice-select-fruit").value;
  const audioPath = `audio/${lang}/fruits/${soundBase}_${voiceType}_${lang}.mp3`;
  playAudio(audioPath);

  // دعم الضغط لتشغيل الصوت
  nameEl.onclick = () => playAudio(audioPath);
  imageEl.onclick = () => playAudio(audioPath);
}

function setupListeners() {
  document.getElementById("prev-fruit-btn").onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      displayFruit();
    }
  };

  document.getElementById("next-fruit-btn").onclick = () => {
    if (currentIndex < fruits.length - 1) {
      currentIndex++;
      displayFruit();
    }
  };

  document.getElementById("play-sound-btn-fruit").onclick = () => {
    const lang = getCurrentLang();
    const voiceType = document.getElementById("voice-select-fruit").value;
    const audioPath = `audio/${lang}/fruits/${currentFruitData.sound_base}_${voiceType}_${lang}.mp3`;
    playAudio(audioPath);
  };

  document.getElementById("voice-select-fruit").onchange = () => {
    displayFruit();
  };

  const langSelect = document.getElementById("game-lang-select-fruit");
  if (langSelect) {
    langSelect.value = getCurrentLang();
    langSelect.onchange = () => {
      localStorage.setItem("lang", langSelect.value);
      location.reload();
    };
  }
}
