// public/js/vegetables-game.js

import { db } from "./firebase-config.js";
import { getDocs, collection, query } from "firebase/firestore";
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let vegetables = [];
let currentIndex = 0;
let currentVegetableData = null; // لتخزين بيانات الخضروات المعروضة حاليًا


export async function loadVegetablesGameContent() {
  stopCurrentAudio();
  const mainContentArea = document.querySelector("main.main-content");
  const vegetableSidebarControls = document.getElementById("vegetable-sidebar-controls");

  if (!mainContentArea || !vegetableSidebarControls) {
    console.error("Main content area or vegetable sidebar controls not found.");
    return;
  }

  mainContentArea.innerHTML = `
    <div class="game-box">
      <h2 id="vegetable-word" class="item-main-name">---</h2>
      <img id="vegetable-image" src="" alt="vegetable" />
      
      <div class="vegetable-details-section info-box">
        <h3>حقائق عن الخضروات:</h3>
        <ul id="vegetable-details-list">
          <li><strong>الصنف:</strong> <span id="vegetable-type">---</span></li>
          <li><strong>الفوائد:</strong> <span id="vegetable-benefits">---</span></li>
        </ul>
        <div class="vegetable-description-box info-box">
          <h4>الوصف:</h4>
          <p id="vegetable-description">---</p>
        </div>
      </div>
      </div>
  `;

  // الحصول على المراجع للعناصر بعد حقنها في DOM
  const vegetableImage = document.getElementById("vegetable-image");
  const vegetableWord = document.getElementById("vegetable-word");
  const vegetableType = document.getElementById("vegetable-type");
  const vegetableBenefits = document.getElementById("vegetable-benefits");
  const vegetableDescription = document.getElementById("vegetable-description");

  const gameLangSelect = document.getElementById('game-lang-select-vegetable');
  if (!gameLangSelect) {
      console.error("Language select for vegetable game not found.");
      return;
  }

  await fetchVegetables(gameLangSelect.value);

  if (vegetables.length === 0) {
    console.warn("No vegetables found. Please check Firestore data or rules.");
    if (vegetableImage) vegetableImage.src = "/images/default.png";
    if (vegetableWord) vegetableWord.textContent = "لا توجد بيانات";
    if (vegetableDescription) vegetableDescription.textContent = "لا يوجد وصف متوفر.";
    if (vegetableType) vegetableType.textContent = "غير متوفر";
    if (vegetableBenefits) vegetableBenefits.textContent = "غير متوفر";
    disableVegetableButtonsInSidebar(true);
    return;
  }

  currentIndex = 0;
  updateVegetableContent();
  disableVegetableButtonsInSidebar(false);
}

function updateVegetableContent() {
  if (vegetables.length === 0) return;

  currentVegetableData = vegetables[currentIndex];
    
  const vegetableImage = document.getElementById("vegetable-image");
  const vegetableWord = document.getElementById("vegetable-word");
  const vegetableType = document.getElementById("vegetable-type");
  const vegetableBenefits = document.getElementById("vegetable-benefits");
  const vegetableDescription = document.getElementById("vegetable-description");

  const prevVegetableBtn = document.getElementById('prev-vegetable-btn');
  const nextVegetableBtn = document.getElementById('next-vegetable-btn');

  const name = currentVegetableData.name?.[currentLang] || currentVegetableData.name?.en || "---"; 
  const imgSrc = `/images/vegetables/${currentVegetableData.image}`; // تأكد من أن data.image تحتوي على اسم الملف الصحيح

  if (vegetableImage) vegetableImage.src = imgSrc;
  if (vegetableImage) vegetableImage.alt = name;
  if (vegetableWord) vegetableWord.textContent = name;

  if (vegetableType) vegetableType.textContent = currentVegetableData.type?.[currentLang] || "غير متوفر";
  if (vegetableBenefits) vegetableBenefits.textContent = currentVegetableData.benefits?.[currentLang] || "غير متوفر";
  if (vegetableDescription) vegetableDescription.textContent = currentVegetableData.description?.[currentLang] || "لا يوجد وصف";

  if (prevVegetableBtn) prevVegetableBtn.disabled = (currentIndex === 0);
  if (nextVegetableBtn) nextVegetableBtn.disabled = (currentIndex === vegetables.length - 1);

  stopCurrentAudio();
}

async function fetchVegetables(lang) {
  try {
    const itemsCollectionRef = collection(db, "categories", "vegetables", "items");
    const q = query(itemsCollectionRef);
    const snapshot = await getDocs(itemsCollectionRef);
    vegetables = snapshot.docs.map(doc => doc.data());
    console.log("Fetched vegetables:", vegetables);
  } catch (error) {
    console.error("Error fetching vegetables from Firestore:", error);
    vegetables = [];
  }
}

// ***** دوال مصدّرة ليتم استدعاؤها من index.html *****
export function showNextVegetable() {
    stopCurrentAudio();
    if (currentIndex < vegetables.length - 1) {
        currentIndex++;
        updateVegetableContent();
        recordActivity(JSON.parse(localStorage.getItem("user")), "vegetables");
    }
}

export function showPreviousVegetable() {
    stopCurrentAudio();
    if (currentIndex > 0) {
        currentIndex--;
        updateVegetableContent();
        recordActivity(JSON.parse(localStorage.getItem("user")), "vegetables");
    }
}

export function playCurrentVegetableAudio() {
    if (currentVegetableData) {
        const voiceSelect = document.getElementById('voice-select-vegetable');
        const selectedVoiceType = voiceSelect ? voiceSelect.value : 'teacher';
        const audioPath = getVegetableAudioPath(currentVegetableData, selectedVoiceType);
        if (audioPath) {
            playAudio(audioPath);
            recordActivity(JSON.parse(localStorage.getItem("user")), "vegetables");
        }
    } else {
        console.warn('لا توجد خضروات معروضة لتشغيل الصوت.');
    }
}

function getVegetableAudioPath(data, voiceType) {
  const langFolder = document.getElementById('game-lang-select-vegetable').value;
  const subjectFolder = 'vegetables';

  let fileName;
  if (data.voices && data.voices[voiceType]) {
    fileName = data.voices[voiceType];
  } else if (data.sound_base) {
    fileName = data.sound_base.replace('.mp3', `_${voiceType}_${langFolder}.mp3`);
  } else {
    console.warn(`لا يوجد مسار صوت لـ ${data.name?.[currentLang]} بنوع الصوت ${voiceType}.`);
    return null;
  }
  return `/audio/${langFolder}/${subjectFolder}/${fileName}`;
}

function disableVegetableButtonsInSidebar(isDisabled) {
    const playSoundBtn = document.getElementById("play-sound-btn-vegetable");
    const nextBtn = document.getElementById("next-vegetable-btn");
    const prevBtn = document.getElementById("prev-vegetable-btn");
    const voiceSelect = document.getElementById("voice-select-vegetable");
    const langSelect = document.getElementById("game-lang-select-vegetable");

    if (playSoundBtn) playSoundBtn.disabled = isDisabled;
    if (nextBtn) nextBtn.disabled = isDisabled;
    if (prevBtn) prevBtn.disabled = isDisabled;
    if (voiceSelect) voiceSelect.disabled = isDisabled;
    if (langSelect) langSelect.disabled = isDisabled;
}