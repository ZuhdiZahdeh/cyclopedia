// 📁 src/subjects/fruits.js
import { getItemsByCategory } from "/src/core/db-handler.js";
import { getCurrentLang, applyTranslations } from "/src/core/lang-handler.js";
import { stopCurrentAudio } from "/src/core/audio-handler.js";
import { setupFruitControls } from "/src/controls/fruits-controls.js";


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
      <h2 id="fruit-name-ar" class="item-main-name">---</h2>
      <p id="fruit-name-en" class="fruit-name-en"></p>
      <img id="fruit-image" src="" alt="Fruit Image" />
      <div class="info-box">
        <h4 data-i18n="description_title">الوصف:</h4>
        <p id="fruit-description-ar"></p>
        <p id="fruit-description-en" class="fruit-name-en"></p>
      </div>
    </div>
  `;

  setupFruitControls();
  displayCurrentFruit();
}

function displayCurrentFruit() {
  const fruit = fruits[currentIndex];
  const lang = getCurrentLang();

  document.getElementById("fruit-name-ar").textContent = fruit?.name?.ar || "---";
  document.getElementById("fruit-name-en").textContent = fruit?.name?.en || "";
  document.getElementById("fruit-description-ar").textContent = fruit?.description?.ar || "---";
  document.getElementById("fruit-description-en").textContent = fruit?.description?.en || "";

  const image = document.getElementById("fruit-image");
  if (image && fruit.image) {
    image.src = `/images/fruits/${fruit.image}`;
    image.alt = fruit?.name?.en || "Fruit";
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
