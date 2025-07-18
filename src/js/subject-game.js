// subject-game.js - النموذج العام لجميع المواضيع التعليمية

import { db } from "./firebase-config.js";
import { getDocs, collection, query } from "firebase/firestore";
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let items = [];
let currentIndex = 0;
let currentItemData = null;

export async function loadSubjectGameContent(subjectType) {
  stopCurrentAudio();

  const mainContentArea = document.querySelector("main.main-content");
  const sidebarControls = document.getElementById(`${subjectType}-sidebar-controls`);
  if (!mainContentArea || !sidebarControls) return;

  mainContentArea.innerHTML = generateSubjectHTML(subjectType);

  const gameLangSelect = document.getElementById(`game-lang-select-${subjectType}`);
  if (!gameLangSelect) return;

  await fetchItems(subjectType, gameLangSelect.value);

  if (items.length === 0) {
    showEmptyState(subjectType);
    disableSidebarButtons(subjectType, true);
    return;
  }

  currentIndex = 0;
  updateContent(subjectType);
  disableSidebarButtons(subjectType, false);
  setupToggleButtons(subjectType);
}

function generateSubjectHTML(subjectType) {
  return `
    <div class="game-box">
      <h2 id="${subjectType}-word" class="item-main-name"></h2>
      <img id="${subjectType}-image" src="" alt="${subjectType}" />

      <div class="${subjectType}-details-section info-box" id="${subjectType}-details-section" style="display:none;">
        <h3>تفاصيل إضافية:</h3>
        <ul>
          <li><strong>اسم الابناء:</strong> <span id="${subjectType}-baby">---</span></li>
          <li><strong>اسم الزوجة:</strong> <span id="${subjectType}-female">---</span></li>
          <li><strong>الصنف:</strong> <span id="${subjectType}-category">---</span></li>
        </ul>
      </div>

      <div class="${subjectType}-description-box info-box" id="${subjectType}-description-box" style="display:none;">
        <h4>الوصف:</h4>
        <p id="${subjectType}-description">---</p>
      </div>
    </div>
  `;
}

async function fetchItems(subjectType, lang) {
  try {
    const itemsRef = collection(db, "categories", subjectType, "items");
    const snapshot = await getDocs(query(itemsRef));
    items = snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error(`❌ Error fetching ${subjectType} data:`, error);
    items = [];
  }
}

function showEmptyState(subjectType) {
  document.getElementById(`${subjectType}-image`).src = "/images/default.png";
  document.getElementById(`${subjectType}-word`).textContent = "لا توجد بيانات";
  document.getElementById(`${subjectType}-description`).textContent = "لا يوجد وصف متوفر.";
  document.getElementById(`${subjectType}-baby`).textContent = "غير متوفر";
  document.getElementById(`${subjectType}-female`).textContent = "غير متوفر";
  document.getElementById(`${subjectType}-category`).textContent = "غير متوفر";
}

function updateContent(subjectType) {
  if (items.length === 0) return;
  currentItemData = items[currentIndex];

  const name = currentItemData.name?.[currentLang] || "";
  document.getElementById(`${subjectType}-word`).textContent = name;
  document.getElementById(`${subjectType}-image`).src = `/images/${subjectType}/${currentItemData.image}`;
  document.getElementById(`${subjectType}-image`).alt = name;
  document.getElementById(`${subjectType}-description`).textContent = currentItemData.description?.[currentLang] || "لا يوجد وصف";
  document.getElementById(`${subjectType}-baby`).textContent = currentItemData.baby?.[currentLang] || "غير معروف";
  document.getElementById(`${subjectType}-female`).textContent = currentItemData.female?.[currentLang] || "غير معروف";
  document.getElementById(`${subjectType}-category`).textContent =
    Array.isArray(currentItemData.classification)
      ? currentItemData.classification.map(cat => cat[currentLang] || cat).join(", ")
      : (currentItemData.classification?.[currentLang] || "غير معروف");

  document.getElementById(`prev-${subjectType}-btn`).disabled = currentIndex === 0;
  document.getElementById(`next-${subjectType}-btn`).disabled = currentIndex === items.length - 1;

  stopCurrentAudio();
}

function setupToggleButtons(subjectType) {
  const descBtn = document.getElementById(`toggle-description-btn`);
  const descBox = document.getElementById(`${subjectType}-description-box`);
  const detailsBtn = document.getElementById(`toggle-details-btn`);
  const detailsBox = document.getElementById(`${subjectType}-details-section`);

  if (descBtn && descBox) {
    descBtn.onclick = () => {
      descBox.style.display = (descBox.style.display === "none") ? "block" : "none";
    };
  }
  if (detailsBtn && detailsBox) {
    detailsBtn.onclick = () => {
      detailsBox.style.display = (detailsBox.style.display === "none") ? "block" : "none";
    };
  }
}

export function showNextItem(subjectType) {
  if (currentIndex < items.length - 1) {
    currentIndex++;
    updateContent(subjectType);
    recordActivity(JSON.parse(localStorage.getItem("user")), subjectType);
  }
}

export function showPreviousItem(subjectType) {
  if (currentIndex > 0) {
    currentIndex--;
    updateContent(subjectType);
    recordActivity(JSON.parse(localStorage.getItem("user")), subjectType);
  }
}

export function playCurrentItemAudio(subjectType) {
  if (!currentItemData) return;

  const voiceSelect = document.getElementById(`voice-select-${subjectType}`);
  const voiceType = voiceSelect ? voiceSelect.value : "boy";
  const lang = document.getElementById(`game-lang-select-${subjectType}`).value;

  const voiceKey = `${voiceType}_${lang}`;
  let fileName;

  if (currentItemData.voices?.[voiceKey]) {
    fileName = currentItemData.voices[voiceKey];
  } else if (currentItemData.sound_base) {
    fileName = `${currentItemData.sound_base}_${voiceType}_${lang}.mp3`;
  } else {
    console.error("🔇 No audio available");
    return;
  }

  const audioPath = `/audio/${lang}/${subjectType}/${fileName}`;
  playAudio(audioPath);
  recordActivity(JSON.parse(localStorage.getItem("user")), subjectType);
}

function disableSidebarButtons(subjectType, isDisabled) {
  const controls = [
    `play-sound-btn-${subjectType}`,
    `next-${subjectType}-btn`,
    `prev-${subjectType}-btn`,
    `voice-select-${subjectType}`,
    `game-lang-select-${subjectType}`
  ];
  controls.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = isDisabled;
  });
}
