// public/src/js/human-body-game.js

import { db } from "./firebase-config.js";
import { getDocs, collection, query } from "firebase/firestore";
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let humanBodyParts = []; 
let currentIndex = 0;
let currentHumanBodyData = null; // لتخزين بيانات الجزء المعروض حاليًا


export async function loadHumanBodyGameContent() {
  stopCurrentAudio();
  const mainContentArea = document.querySelector("main.main-content");
  const humanBodySidebarControls = document.getElementById("human-body-sidebar-controls");

  if (!mainContentArea || !humanBodySidebarControls) {
    console.error("Main content area or human body sidebar controls not found.");
    return;
  }

  // 1. حقن HTML الخاص بلعبة جسم الإنسان في منطقة المحتوى الرئيسية
  mainContentArea.innerHTML = `
    <div class="game-box">
      <h2 id="human-body-word" class="item-main-name">---</h2>
      <img id="human-body-image" src="" alt="human body part" />
      
      <div class="human-body-details-section info-box">
        <h3>حقائق عن جسم الإنسان:</h3>
        <ul id="human-body-details-list">
          <li><strong>الوظيفة:</strong> <span id="human-body-function">---</span></li>
          <li><strong>الجهاز:</strong> <span id="human-body-system">---</span></li>
          <li><strong>حقيقة ممتعة:</strong> <span id="human-body-fun-fact">---</span></li>
        </ul>
        <div class="human-body-description-box info-box">
          <h4>الوصف:</h4>
          <p id="human-body-description">---</p>
        </div>
      </div>
      </div>
  `;

  // الحصول على المراجع للعناصر بعد حقنها في DOM
  const humanBodyImage = document.getElementById("human-body-image");
  const humanBodyWord = document.getElementById("human-body-word");
  const humanBodyFunction = document.getElementById("human-body-function");
  const humanBodySystem = document.getElementById("human-body-system");
  const humanBodyFunFact = document.getElementById("human-body-fun-fact");
  const humanBodyDescription = document.getElementById("human-body-description");

  const gameLangSelect = document.getElementById('game-lang-select-human-body');
  if (!gameLangSelect) {
      console.error("Language select for human body game not found.");
      return;
  }
  
  await fetchHumanBodyParts(gameLangSelect.value);

  if (humanBodyParts.length === 0) {
    console.warn("No human body parts found. Please check Firestore data or rules.");
    if (humanBodyImage) humanBodyImage.src = "/images/default.png";
    if (humanBodyWord) humanBodyWord.textContent = "لا توجد بيانات";
    if (humanBodyDescription) humanBodyDescription.textContent = "لا يوجد وصف متوفر.";
    if (humanBodyFunction) humanBodyFunction.textContent = "غير متوفر";
    if (humanBodySystem) humanBodySystem.textContent = "غير متوفر";
    if (humanBodyFunFact) humanBodyFunFact.textContent = "غير متوفر";
    disableHumanBodyButtonsInSidebar(true);
    return;
  }

  currentIndex = 0;
  updateHumanBodyContent();
  disableHumanBodyButtonsInSidebar(false);
}

function updateHumanBodyContent() {
  if (humanBodyParts.length === 0) return;

  currentHumanBodyData = humanBodyParts[currentIndex];
    
  const humanBodyImage = document.getElementById("human-body-image");
  const humanBodyWord = document.getElementById("human-body-word");
  const humanBodyFunction = document.getElementById("human-body-function");
  const humanBodySystem = document.getElementById("human-body-system");
  const humanBodyFunFact = document.getElementById("human-body-fun-fact");
  const humanBodyDescription = document.getElementById("human-body-description");

  const prevHumanBodyBtn = document.getElementById('prev-human-body-btn');
  const nextHumanBodyBtn = document.getElementById('next-human-body-btn');

  const name = currentHumanBodyData.name?.[currentLang] || currentHumanBodyData.name?.en || "---"; 
  const imgSrc = `/images/human-body/${currentHumanBodyData.image}`; 
  
  if (humanBodyImage) humanBodyImage.src = imgSrc;
  if (humanBodyImage) humanBodyImage.alt = name;
  if (humanBodyWord) humanBodyWord.textContent = name;

  if (humanBodyFunction) humanBodyFunction.textContent = currentHumanBodyData.function?.[currentLang] || "غير متوفر";
  if (humanBodySystem) humanBodySystem.textContent = currentHumanBodyData.system?.[currentLang] || "غير متوفر";
  if (humanBodyFunFact) humanBodyFunFact.textContent = currentHumanBodyData.fun_fact?.[currentLang] || "لا توجد حقائق ممتعة";
  if (humanBodyDescription) humanBodyDescription.textContent = currentHumanBodyData.description?.[currentLang] || "لا يوجد وصف";

  if (prevHumanBodyBtn) prevHumanBodyBtn.disabled = (currentIndex === 0);
  if (nextHumanBodyBtn) nextHumanBodyBtn.disabled = (currentIndex === humanBodyParts.length - 1);

  stopCurrentAudio();
}

async function fetchHumanBodyParts(lang) {
  try {
    const itemsCollectionRef = collection(db, "categories", "human-body", "items");
    const q = query(itemsCollectionRef);
    const snapshot = await getDocs(itemsCollectionRef);
    humanBodyParts = snapshot.docs.map(doc => doc.data());
    console.log("Fetched human body parts:", humanBodyParts);
  }
  catch (error) {
    console.error("Error fetching human body parts from Firestore:", error);
    humanBodyParts = [];
  }
}

// ***** دوال مصدّرة ليتم استدعاؤها من index.html *****
export function showNextHumanBodyPart() {
    stopCurrentAudio();
    if (currentIndex < humanBodyParts.length - 1) {
        currentIndex++;
        updateHumanBodyContent();
        recordActivity(JSON.parse(localStorage.getItem("user")), "human-body");
    }
}

export function showPreviousHumanBodyPart() {
    stopCurrentAudio();
    if (currentIndex > 0) {
        currentIndex--;
        updateHumanBodyContent();
        recordActivity(JSON.parse(localStorage.getItem("user")), "human-body");
    }
}

export function playCurrentHumanBodyPartAudio() {
    if (currentHumanBodyData) {
        const voiceSelect = document.getElementById('voice-select-human-body');
        const selectedVoiceType = voiceSelect ? voiceSelect.value : 'boy';
        const audioPath = getHumanBodyAudioPath(currentHumanBodyData, selectedVoiceType);
        if (audioPath) {
            playAudio(audioPath);
            recordActivity(JSON.parse(localStorage.getItem("user")), "human-body");
        }
    } else {
        console.warn('لا يوجد جزء جسم بشري معروض لتشغيل الصوت.');
    }
}

function getHumanBodyAudioPath(data, voiceType) {
  const langFolder = document.getElementById('game-lang-select-human-body').value;
  const subjectFolder = 'human-body';

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

function disableHumanBodyButtonsInSidebar(isDisabled) {
    const playSoundBtn = document.getElementById("play-sound-btn-human-body");
    const nextBtn = document.getElementById("next-human-body-btn");
    const prevBtn = document.getElementById("prev-human-body-btn");
    const voiceSelect = document.getElementById("voice-select-human-body");
    const langSelect = document.getElementById("game-lang-select-human-body");

    if (playSoundBtn) playSoundBtn.disabled = isDisabled;
    if (nextBtn) nextBtn.disabled = isDisabled;
    if (prevBtn) prevBtn.disabled = isDisabled;
    if (voiceSelect) voiceSelect.disabled = isDisabled;
    if (langSelect) langSelect.disabled = isDisabled;
}