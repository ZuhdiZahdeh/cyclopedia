// public/js/animals-game.js

import { db } from "./firebase-config.js";
import { getDocs, collection, query } from "firebase/firestore";
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let animals = [];
let currentIndex = 0;
let currentAnimalData = null;

export async function loadAnimalsGameContent() {
  stopCurrentAudio();

  const mainContentArea = document.querySelector("main.main-content");
  const animalSidebarControls = document.getElementById("animal-sidebar-controls");

  if (!mainContentArea || !animalSidebarControls) {
    console.error("Main content area or animal sidebar controls not found.");
    return;
  }

  mainContentArea.innerHTML = `
    <div class="game-box">
      <h2 id="animal-word" class="item-main-name"></h2>
      <img id="animal-image" src="" alt="animal" />
      
      <div class="animal-details-section info-box" id="animal-details-section" style="display:none;">
        <h3>تفاصيل إضافية:</h3>
        <ul id="animal-details-list">
          <li><strong>اسم الابناء:</strong> <span id="animal-baby">---</span></li>
          <li><strong>اسم الزوجة:</strong> <span id="animal-female">---</span></li>
          <li><strong>الصنف:</strong> <span id="animal-category">---</span></li>
        </ul>
        <div class="baby-animal-section" style="display:none;">
            <h4>صورة الابن:</h4>
            <img id="baby-animal-image" src="" alt="baby animal" style="max-width: 150px; margin-top: 10px;"/>
        </div>
      </div>
      <div class="animal-description-box info-box" id="animal-description-box" style="display:none;">
        <h4>الوصف:</h4>
        <p id="animal-description">---</p>
      </div>
    </div>
  `;

  const animalImage = document.getElementById("animal-image");
  const animalWord = document.getElementById("animal-word");
  const animalBaby = document.getElementById("animal-baby");
  const animalFemale = document.getElementById("animal-female");
  const animalCategory = document.getElementById("animal-category");
  const animalDescription = document.getElementById("animal-description");
  const babyAnimalImage = document.getElementById("baby-animal-image"); // New

  const gameLangSelect = document.getElementById('game-lang-select-animal');
  if (!gameLangSelect) {
    console.error("Language select for animal game not found.");
    return;
  }

  await fetchAnimals(gameLangSelect.value);

  if (animals.length === 0) {
    console.warn("No animals found for this category and language.");
    if (animalImage) animalImage.src = "/images/default.png";
    if (animalWord) animalWord.textContent = "لا توجد بيانات";
    if (animalDescription) animalDescription.textContent = "لا يوجد وصف متوفر.";
    if (animalBaby) animalBaby.textContent = "غير متوفر";
    if (animalFemale) animalFemale.textContent = "غير متوفر";
    if (animalCategory) animalCategory.textContent = "غير متوفر";
    if (babyAnimalImage) babyAnimalImage.src = "/images/default.png"; // New
    disableAnimalButtonsInSidebar(true);
    return;
  }

  currentIndex = 0;
  updateAnimalContent();
  disableAnimalButtonsInSidebar(false);

  // زر إظهار/إخفاء الوصف والتفاصيل
  const descriptionBox = document.getElementById("animal-description-box");
  const detailsBox = document.getElementById("animal-details-section");
  const babyAnimalSection = detailsBox.querySelector(".baby-animal-section"); // New

  const toggleDescBtn = document.getElementById("toggle-description-btn");
  const toggleDetailsBtn = document.getElementById("toggle-details-btn");
  const toggleBabyImageBtn = document.getElementById("toggle-baby-image-btn"); // New

  if (toggleDescBtn && descriptionBox) {
    toggleDescBtn.onclick = () => {
      descriptionBox.style.display = (descriptionBox.style.display === "none") ? "block" : "none";
    };
  }

  if (toggleDetailsBtn && detailsBox) {
    toggleDetailsBtn.onclick = () => {
      detailsBox.style.display = (detailsBox.style.display === "none") ? "block" : "none";
    };
  }

  // New: Toggle baby animal image
  if (toggleBabyImageBtn && babyAnimalSection) {
    toggleBabyImageBtn.onclick = () => {
        babyAnimalSection.style.display = (babyAnimalSection.style.display === "none") ? "block" : "none";
    };
  }
}

function updateAnimalContent() {
  const lang = getCurrentLang();

  if (animals.length === 0) return;

  currentAnimalData = animals[currentIndex];

  
  const animalWord = document.getElementById("animal-word");
  const animalDescription = document.getElementById("animal-description");
  const animalBaby = document.getElementById("animal-baby");
  const animalFemale = document.getElementById("animal-female");
  const animalCategory = document.getElementById("animal-category");
  const babyAnimalImage = document.getElementById("baby-animal-image");
  const prevAnimalBtn = document.getElementById("prev-animal-btn");
  const nextAnimalBtn = document.getElementById("next-animal-btn");

  const animalName = currentAnimalData.name[lang] || "";

  // ✅ تحديث الصورة
  if (animalImage) {
    animalImage.src = `/images/animals/${currentAnimalData.image}`;
    animalImage.alt = animalName;
    animalImage.onclick = playCurrentAnimalAudio;
    animalImage.classList.add("clickable-image");
  }

  // ✅ تحديث الاسم
  if (animalWord) {
    if (animalName) {
      animalWord.innerHTML = `<span class="highlight-first-letter">${animalName[0]}</span>${animalName.slice(1)}`;
    } else {
      animalWord.textContent = '';
    }
    animalWord.onclick = playCurrentAnimalAudio;
    animalWord.classList.add("clickable-text");
  }

  // ✅ تحديث المعلومات الأخرى
  if (animalDescription) animalDescription.textContent = currentAnimalData.description?.[lang] || "لا يوجد وصف";
  if (animalBaby) animalBaby.textContent = currentAnimalData.baby?.[lang] || "غير معروف";
  if (animalFemale) animalFemale.textContent = currentAnimalData.female?.[lang] || "غير معروف";

  if (animalCategory) {
    animalCategory.textContent = Array.isArray(currentAnimalData.classification)
      ? currentAnimalData.classification.map(cat => (typeof cat === 'object' && cat !== null && cat[lang]) ? cat[lang] : cat).join(", ")
      : (currentAnimalData.classification?.[lang] || "غير معروف");
  }

  if (babyAnimalImage) {
    const babyImagePath = currentAnimalData.baby?.image_path;
    if (babyImagePath) {
      babyAnimalImage.src = `/${babyImagePath}`;
      babyAnimalImage.alt = currentAnimalData.baby?.name?.[lang] || "صورة الابن";
    } else {
      babyAnimalImage.src = "/images/default.png";
      babyAnimalImage.alt = "لا توجد صورة للابن";
    }
  }

  if (prevAnimalBtn) prevAnimalBtn.disabled = currentIndex === 0;
  if (nextAnimalBtn) nextAnimalBtn.disabled = currentIndex === animals.length - 1;

  stopCurrentAudio();
}

async function fetchAnimals(lang) {
  try {
    const itemsCollectionRef = collection(db, "categories", "animals", "items");
    const q = query(itemsCollectionRef);
    const snapshot = await getDocs(q);
    animals = snapshot.docs.map(doc => doc.data());
    console.log("Fetched animals:", animals);
  } catch (error) {
    console.error("Error fetching animals from Firestore:", error);
    animals = [];
  }
}

export function showNextAnimal() {
  stopCurrentAudio();
  if (currentIndex < animals.length - 1) {
    currentIndex++;
    updateAnimalContent();
    recordActivity(JSON.parse(localStorage.getItem("user")), "animals");
  }
}

export function showPreviousAnimal() {
  stopCurrentAudio();
  if (currentIndex > 0) {
    currentIndex--;
    updateAnimalContent();
    recordActivity(JSON.parse(localStorage.getItem("user")), "animals");
  }
}

export function playCurrentAnimalAudio() {
const lang = getCurrentLang();	
  if (currentAnimalData) {
    const voiceSelect = document.getElementById('voice-select-animal');
    const selectedVoiceType = voiceSelect ? voiceSelect.value : 'boy';
    const audioPath = getAnimalAudioPath(currentAnimalData, selectedVoiceType);
    if (audioPath) {
      playAudio(audioPath);
      recordActivity(JSON.parse(localStorage.getItem("user")), "animals");
    }
  } else {
    console.warn('لا يوجد حيوان معروض لتشغيل الصوت.');
  }
}

// New: Function to play baby animal audio
export function playCurrentBabyAnimalAudio() {
    if (currentAnimalData && currentAnimalData.baby) {
        const voiceSelect = document.getElementById('voice-select-animal');
        const selectedVoiceType = voiceSelect ? voiceSelect.value : 'boy';
        const audioPath = getBabyAnimalAudioPath(currentAnimalData.baby, selectedVoiceType);
        if (audioPath) {
            playAudio(audioPath);
            recordActivity(JSON.parse(localStorage.getItem("user")), "animals_baby_audio");
        }
    } else {
        console.warn('لا توجد بيانات لاسم ابن الحيوان لتشغيل الصوت.');
    }
}

function getAnimalAudioPath(data, voiceType) {
	
	const lang = getCurrentLang();
  const langFolder = document.getElementById('game-lang-select-animal').value;
  const subjectFolder = 'animals';

  let fileName;
  const voiceKey = `${voiceType}_${langFolder}`;

  if (data.voices && data.voices[voiceKey]) {
    fileName = data.voices[voiceKey];
    console.log(`✅ Found in voices: ${voiceKey} → ${fileName}`);
  } else if (data.sound_base) {
    fileName = `${data.sound_base}_${voiceType}_${langFolder}.mp3`;
    console.warn(`⚠️ Used fallback from sound_base: ${fileName}`);
  } else {
    console.error(`❌ Neither voices nor sound_base available for ${data.name?.[lang] || "unknown"}`);
    return null;
  }

  const audioPath = `/audio/${langFolder}/${subjectFolder}/${fileName}`;
  console.log(`🎧 Full audio path: ${audioPath}`);
  return audioPath;
}

// New: Function to get baby animal audio path
function getBabyAnimalAudioPath(babyData, voiceType) {
	
	const lang = getCurrentLang();
    const langFolder = document.getElementById('game-lang-select-animal').value;
    // Assuming baby animal sounds are in 'baby_animals' subfolder
    const subjectFolder = 'animals/baby_animals'; 

    let fileName;
    const voiceKey = voiceType; // The voice key directly corresponds to boy/girl/teacher

    if (babyData.sound && babyData.sound[langFolder] && babyData.sound[langFolder][voiceKey]) {
        fileName = babyData.sound[langFolder][voiceKey].split('/').pop(); // Extract file name from full path
        console.log(`✅ Found in baby voices: ${langFolder} → ${voiceKey} → ${fileName}`);
    } else {
        console.error(`❌ Baby animal sound not available for ${babyData.name?.[lang] || "unknown"} in ${langFolder} for voice type ${voiceKey}`);
        return null;
    }

    const audioPath = `/audio/${langFolder}/${subjectFolder}/${fileName}`;
    console.log(`🎧 Full baby animal audio path: ${audioPath}`);
    return audioPath;
}

function disableAnimalButtonsInSidebar(isDisabled) {
  const playSoundBtn = document.getElementById("play-sound-btn-animal");
  const nextBtn = document.getElementById("next-animal-btn");
  const prevBtn = document.getElementById("prev-animal-btn");
  const voiceSelect = document.getElementById("voice-select-animal");
  const langSelect = document.getElementById("game-lang-select-animal");
  const playBabySoundBtn = document.getElementById("play-baby-sound-btn-animal"); // New
  const toggleBabyImageBtn = document.getElementById("toggle-baby-image-btn"); // New

  if (playSoundBtn) playSoundBtn.disabled = isDisabled;
  if (nextBtn) nextBtn.disabled = isDisabled;
  if (prevBtn) prevBtn.disabled = isDisabled;
  if (voiceSelect) voiceSelect.disabled = isDisabled;
  if (langSelect) langSelect.disabled = isDisabled;
  if (playBabySoundBtn) playBabySoundBtn.disabled = isDisabled; // New
  if (toggleBabyImageBtn) toggleBabyImageBtn.disabled = isDisabled; // New
}