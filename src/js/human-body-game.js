// public/src/js/human-body-game.js
// هذا هو المسار الفعلي للملف ضمن مجلد public

import { db } from "./firebase-config.js";
import { getDocs, collection } from "firebase/firestore";
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let humanBodyParts = []; 
let currentIndex = 0;
let selectedVoice = "boy"; 

const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

export async function loadHumanBodyGameContent() {
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
      <div class="navigation-buttons">
        <button id="prev-human-body-btn">⬅️ السابق</button>
        <button id="next-human-body-btn">التالي ➡️</button>
      </div>
    </div>
  `;

  // 2. حقن HTML الخاص بعناصر التحكم في الشريط الجانبي
  humanBodySidebarControls.innerHTML = `
    <h3 style="text-align: center;">🧠 تعرف على جسم الإنسان</h3>
    <div class="sidebar-game-controls">
      <div class="language-selection" style="margin-bottom: 1rem;">
        <label for="game-lang-select-human-body">اللغة:</label>
        <select id="game-lang-select-human-body">
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="he">عبري</option>
        </select>
      </div>
      <div class="voice-selection" style="margin-bottom: 1rem;">
        <label for="voice-select-human-body">الصوت:</label>
        <select id="voice-select-human-body">
          <option value="boy">صوت ولد</option>
          <option value="teacher">المعلم</option>
          <option value="girl">صوت بنت</option>
          <option value="child">صوت طفل</option>
        </select>
      </div>
      <button id="play-sound-btn-human-body">🔊 استمع</button>
    </div>
  `;

  // الحصول على المراجع للعناصر بعد حقنها في DOM
  const humanBodyImage = document.getElementById("human-body-image");
  const humanBodyWord = document.getElementById("human-body-word");
  const humanBodyFunction = document.getElementById("human-body-function");
  const humanBodySystem = document.getElementById("human-body-system");
  const humanBodyFunFact = document.getElementById("human-body-fun-fact");
  const humanBodyDescription = document.getElementById("human-body-description");

  const playSoundBtn = document.getElementById("play-sound-btn-human-body");
  const voiceSelect = document.getElementById("voice-select-human-body");
  const gameLangSelect = document.getElementById("game-lang-select-human-body");
  
  const nextHumanBodyBtn = document.getElementById("next-human-body-btn");
  const prevHumanBodyBtn = document.getElementById("prev-human-body-btn");

  if (!humanBodyImage || !humanBodyWord || !playSoundBtn || !nextHumanBodyBtn || !prevHumanBodyBtn || !voiceSelect || !gameLangSelect || !humanBodyFunction || !humanBodySystem || !humanBodyFunFact || !humanBodyDescription) {
    console.error("One or more human body game/control elements not found after content injection. Check IDs.");
    disableHumanBodyButtons(true);
    return;
  }

  gameLangSelect.value = currentLang;
  voiceSelect.value = selectedVoice;

  await fetchHumanBodyParts();

  if (humanBodyParts.length === 0) {
    console.warn("No human body parts found. Please check Firestore data or rules.");
    humanBodyImage.src = "/images/default.png";
    humanBodyWord.textContent = "لا توجد بيانات";
    humanBodyDescription.textContent = "لا يوجد وصف متوفر.";
    humanBodyFunction.textContent = "غير متوفر";
    humanBodySystem.textContent = "غير متوفر";
    humanBodyFunFact.textContent = "غير متوفر";
    disableHumanBodyButtons(true);
    return;
  }

  showHumanBodyPart(currentIndex);

  nextHumanBodyBtn.addEventListener("click", async () => {
    if (currentIndex < humanBodyParts.length - 1) {
        currentIndex++;
        showHumanBodyPart(currentIndex);
        if (currentUser && currentUser.uid) {
            await recordActivity(currentUser, "human-body");
        }
    }
  });

  prevHumanBodyBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        showHumanBodyPart(currentIndex);
    }
  });

  playSoundBtn.addEventListener("click", () => {
    const soundPath = getAudioPath(humanBodyParts[currentIndex], selectedVoice);
    if (soundPath) {
      playAudio(soundPath);
    } else {
      console.warn(`No ${selectedVoice} sound available for current human body part.`);
    }
  });

  voiceSelect.addEventListener("change", (event) => {
    selectedVoice = event.target.value;
  });

  gameLangSelect.addEventListener("change", async (event) => {
    const newLang = event.target.value;
    await loadLanguage(newLang);
    applyTranslations();
    await fetchHumanBodyParts();
    currentIndex = 0;
    showHumanBodyPart(currentIndex);
    setDirection(newLang);
  });
}

async function fetchHumanBodyParts() {
  try {
    const itemsCollectionRef = collection(db, "categories", "human-body", "items");
    const snapshot = await getDocs(itemsCollectionRef);
    humanBodyParts = snapshot.docs.map(doc => doc.data());
    console.log("Fetched human body parts:", humanBodyParts);
  }
  catch (error) {
    console.error("Error fetching human body parts from Firestore:", error);
    humanBodyParts = [];
  }
}

function showHumanBodyPart(index) {
  if (index >= 0 && index < humanBodyParts.length) {
    const data = humanBodyParts[index];
    
    const name = data.name?.[currentLang] || data.name?.en || "---"; 
    const imgSrc = `/images/human-body/${data.image}`; 
    
    document.getElementById("human-body-image").src = imgSrc;
    document.getElementById("human-body-image").alt = name;
    document.getElementById("human-body-word").textContent = name;

    document.getElementById("human-body-function").textContent = data.function?.[currentLang] || "غير متوفر";
    document.getElementById("human-body-system").textContent = data.system?.[currentLang] || "غير متوفر";
    document.getElementById("human-body-fun-fact").textContent = data.fun_fact?.[currentLang] || "لا توجد حقائق ممتعة";
    document.getElementById("human-body-description").textContent = data.description?.[currentLang] || "لا يوجد وصف";

    document.getElementById("prev-human-body-btn").disabled = (index === 0);
    document.getElementById("next-human-body-btn").disabled = (index === humanBodyParts.length - 1);

    stopCurrentAudio();
  }
}

function getAudioPath(data, voiceType) {
  const fileName = data.voices?.[voiceType]; 
  if (fileName) {
    return `/audio/${currentLang}/human-body/${fileName}`;
  }
  return null;
}

function disableHumanBodyButtons(isDisabled) {
    const btns = [
        document.getElementById("play-sound-btn-human-body"),
        document.getElementById("next-human-body-btn"),
        document.getElementById("prev-human-body-btn"),
        document.getElementById("voice-select-human-body"),
        document.getElementById("game-lang-select-human-body")
    ];
    btns.forEach(btn => {
        if (btn) btn.disabled = isDisabled;
    });
}