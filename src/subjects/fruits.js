// 📁 src/subjects/fruits.js

import { getItemsByCategory } from "../core/db-handler.js";
import { getCurrentLang, applyTranslations } from "../core/lang-handler.js";
import { stopCurrentAudio } from "../core/audio-handler.js";
import { setupFruitControls } from "../controls/fruits-controls.js";

let fruits = [];
let currentIndex = 0;

export async function loadFruitsGameContent() {
  stopCurrentAudio();

  fruits = await getItemsByCategory("fruits");
  currentIndex = 0;

  const main = document.querySelector("main.main-content");
  if (!main) return;

  main.innerHTML = `
    <div class="game-box">
      <h2 id="fruit-name" class="item-main-name">---</h2>
      <img id="fruit-image" src="" alt="Fruit Image" />
      <div class="info-box">
        <h4 data-i18n="description_title">الوصف:</h4>
        <p id="fruit-description"></p>
      </div>
    </div>
  `;

  setupFruitControls();
  displayCurrentFruit();

  // عند تغيير اللغة من الخارج
  document.addEventListener("languageChanged", () => {
    displayCurrentFruit(); // إعادة عرض العنصر الحالي بنفس اللغة
  });
}

function displayCurrentFruit() {
  const fruit = fruits[currentIndex];
  const lang = getCurrentLang();

  const nameElement = document.getElementById("fruit-name");
  const descElement = document.getElementById("fruit-description");
  const image = document.getElementById("fruit-image");

  nameElement.textContent = fruit?.name?.[lang] || "---";
  descElement.textContent = fruit?.description?.[lang] || "---";

  if (image && fruit.image) {
    image.src = `/images/fruits/${fruit.image}`;
    image.alt = fruit?.name?.[lang] || "Fruit";
  }

  applyTranslations();
}

export function showNextFruit() {
  if (currentIndex < fruits.length - 1) {
    currentIndex++;
    displayCurrentFruit();
  }
}

export function showPreviousFruit() {
  if (currentIndex > 0) {
    currentIndex--;
    displayCurrentFruit();
  }
}

export function getCurrentFruit() {
  return fruits[currentIndex];
}
