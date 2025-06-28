// public/js/vegetables-game.js

import { db } from "./firebase-config.js";
import { getDocs, collection } from "firebase/firestore";
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let vegetables = [];
let currentIndex = 0;
let selectedVoice = "teacher";

const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

export async function loadVegetablesGameContent() {
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
      <div class="navigation-buttons">
        <button id="prev-vegetable-btn">⬅️ السابق</button>
        <button id="next-vegetable-btn">التالي ➡️</button>
      </div>
    </div>
  `;

  vegetableSidebarControls.innerHTML = `
    <h3 style="text-align: center;">🥦 تعرف على الخضروات</h3>
    <div class="sidebar-game-controls">
      <div class="language-selection" style="margin-bottom: 1rem;">
        <label for="game-lang-select-vegetable">اللغة:</label>
        <select id="game-lang-select-vegetable">
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="he">עבריة</option>
        </select>
      </div>
      <div class="voice-selection" style="margin-bottom: 1rem;">
        <label for="voice-select-vegetable">الصوت:</label>
        <select id="voice-select-vegetable">
          <option value="teacher">المعلم</option>
          <option value="boy">صوت ولد</option>
          <option value="girl">صوت بنت</option>
          <option value="child">صوت طفل</option>
        </select>
      </div>
      <button id="play-sound-btn-vegetable">🔊 استمع</button>
    </div>
  `;

  const vegetableImage = document.getElementById("vegetable-image");
  const vegetableWord = document.getElementById("vegetable-word");
  const vegetableType = document.getElementById("vegetable-type");
  const vegetableBenefits = document.getElementById("vegetable-benefits");
  const vegetableDescription = document.getElementById("vegetable-description");

  const playSoundBtn = document.getElementById("play-sound-btn-vegetable");
  const voiceSelect = document.getElementById("voice-select-vegetable");
  const gameLangSelect = document.getElementById("game-lang-select-vegetable");
  
  const nextVegetableBtn = document.getElementById("next-vegetable-btn");
  const prevVegetableBtn = document.getElementById("prev-vegetable-btn");

  if (!vegetableImage || !vegetableWord || !playSoundBtn || !nextVegetableBtn || !prevVegetableBtn || !voiceSelect || !gameLangSelect || !vegetableType || !vegetableBenefits || !vegetableDescription) {
    console.error("One or more vegetable game/control elements not found after content injection. Check IDs.");
    disableVegetableButtons(true);
    return;
  }

  gameLangSelect.value = currentLang;

  await fetchVegetables();

  if (vegetables.length === 0) {
    console.warn("No vegetables found. Please check Firestore data or rules.");
    vegetableImage.src = "/images/default.png";
    vegetableWord.textContent = "لا توجد بيانات";
    vegetableDescription.textContent = "لا يوجد وصف متوفر.";
    vegetableType.textContent = "غير متوفر";
    vegetableBenefits.textContent = "غير متوفر";
    disableVegetableButtons(true);
    return;
  }

  showVegetable(currentIndex);

  nextVegetableBtn.addEventListener("click", async () => {
    if (currentIndex < vegetables.length - 1) {
        currentIndex++;
        showVegetable(currentIndex);
        if (currentUser && currentUser.uid) {
            await recordActivity(currentUser, "vegetables");
        }
    }
  });

  prevVegetableBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        showVegetable(currentIndex);
    }
  });

  playSoundBtn.addEventListener("click", () => {
    const soundPath = getAudioPath(vegetables[currentIndex], selectedVoice);
    if (soundPath) {
      playAudio(soundPath);
    } else {
      console.warn(`No ${selectedVoice} sound available for current vegetable.`);
    }
  });

  voiceSelect.addEventListener("change", (event) => {
    selectedVoice = event.target.value;
  });

  gameLangSelect.addEventListener("change", async (event) => {
    const newLang = event.target.value;
    await loadLanguage(newLang);
    applyTranslations();
    await fetchVegetables();
    currentIndex = 0;
    showVegetable(currentIndex);
    setDirection(newLang);
  });
}

async function fetchVegetables() {
  try {
    const itemsCollectionRef = collection(db, "categories", "vegetables", "items");
    const snapshot = await getDocs(itemsCollectionRef);
    vegetables = snapshot.docs.map(doc => doc.data());
    console.log("Fetched vegetables:", vegetables);
  } catch (error) {
    console.error("Error fetching vegetables from Firestore:", error);
    vegetables = [];
  }
}

function showVegetable(index) {
  if (index >= 0 && index < vegetables.length) {
    const data = vegetables[index];
    
    const name = data.name?.[currentLang] || data.name?.en || "---"; 
    // التعديل هنا: استخدام اسم الملف بدون لاحقة _image إذا كانت موجودة في Firestore
    // أو ببساطة استخدام data.image مباشرة إذا كان Firestore يحتوي على "tomato.png"
    // بما أن Firestore يحتوي على "tomato_image.png" وملفك هو "tomato.png"
    // سنقوم بإزالة "_image" من الاسم إذا كانت موجودة قبل بناء المسار.
    const imageNameWithoutSuffix = data.image.replace('_image.png', '.png'); 
    const imgSrc = `/images/vegetables/${imageNameWithoutSuffix}`;
    
    document.getElementById("vegetable-image").src = imgSrc;
    document.getElementById("vegetable-image").alt = name;
    document.getElementById("vegetable-word").textContent = name;

    document.getElementById("vegetable-type").textContent = data.type?.[currentLang] || "غير متوفر";
    document.getElementById("vegetable-benefits").textContent = data.benefits?.[currentLang] || "غير متوفر";
    document.getElementById("vegetable-description").textContent = data.description?.[currentLang] || "لا يوجد وصف";

    document.getElementById("prev-vegetable-btn").disabled = (index === 0);
    document.getElementById("next-vegetable-btn").disabled = (index === vegetables.length - 1);

    stopCurrentAudio();
  }
}

function getAudioPath(data, voiceType) {
  const fileName = data.voices?.[voiceType];
  if (fileName) {
    return `/audio/${currentLang}/vegetables/${fileName}`;
  }
  return null;
}

function disableVegetableButtons(isDisabled) {
    const btns = [
        document.getElementById("play-sound-btn-vegetable"),
        document.getElementById("next-vegetable-btn"),
        document.getElementById("prev-vegetable-btn"),
        document.getElementById("voice-select-vegetable"),
        document.getElementById("game-lang-select-vegetable")
    ];
    btns.forEach(btn => {
        if (btn) btn.disabled = isDisabled;
    });
}
