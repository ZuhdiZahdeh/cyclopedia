// public/js/animals-game.js

import { db } from "./firebase-config.js";
import { getDocs, collection, query } from "firebase/firestore";
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let animals = [];
let currentIndex = 0;
let currentAnimalData = null; // لتخزين بيانات الحيوان المعروض حاليًا


export async function loadAnimalsGameContent() {
  stopCurrentAudio(); // إيقاف أي صوت سابق
  const mainContentArea = document.querySelector("main.main-content");
  const animalSidebarControls = document.getElementById("animal-sidebar-controls");

  if (!mainContentArea || !animalSidebarControls) {
    console.error("Main content area or animal sidebar controls not found.");
    return;
  }

  // 1. حقن HTML الخاص بلعبة الحيوانات في منطقة المحتوى الرئيسية (بدون أزرار التنقل)
  mainContentArea.innerHTML = `
    <div class="game-box">
      <h2 id="animal-word" class="item-main-name"></h2>
      <img id="animal-image" src="" alt="animal" />
      
      <div class="animal-details-section info-box">
        <h3>تفاصيل إضافية:</h3>
        <ul id="animal-details-list">
          <li><strong>اسم الابناء:</strong> <span id="animal-baby">---</span></li>
          <li><strong>اسم الزوجة:</strong> <span id="animal-female">---</span></li>
          <li><strong>الصنف:</strong> <span id="animal-category">---</span></li>
        </ul>
        <div class="animal-description-box info-box">
          <h4>الوصف:</h4>
          <p id="animal-description">---</p>
        </div>
      </div>
    </div>
  `;

  // الحصول على المراجع للعناصر بعد حقنها في DOM
  // العناصر في main-content
  const animalImage = document.getElementById("animal-image");
  const animalWord = document.getElementById("animal-word");
  const animalBaby = document.getElementById("animal-baby");
  const animalFemale = document.getElementById("animal-female");
  const animalCategory = document.getElementById("animal-category");
  const animalDescription = document.getElementById("animal-description");

  // الحصول على مرجع select اللغة من الشريط الجانبي
  const gameLangSelect = document.getElementById('game-lang-select-animal');
  if (!gameLangSelect) {
      console.error("Language select for animal game not found.");
      return;
  }

  await fetchAnimals(gameLangSelect.value); // جلب الحيوانات بناءً على اللغة المختارة

  if (animals.length === 0) {
    console.warn("No animals found for this category and language. Please check Firestore data or rules.");
    if (animalImage) animalImage.src = "/images/default.png";
    if (animalWord) animalWord.textContent = "لا توجد بيانات";
    if (animalDescription) animalDescription.textContent = "لا يوجد وصف متوفر.";
    if (animalBaby) animalBaby.textContent = "غير متوفر";
    if (animalFemale) animalFemale.textContent = "غير متوفر";
    if (animalCategory) animalCategory.textContent = "غير متوفر";
    disableAnimalButtonsInSidebar(true);
    return;
  }

  currentIndex = 0; // إعادة ضبط الفهرس عند تحميل المحتوى
  updateAnimalContent(); // عرض أول حيوان
  disableAnimalButtonsInSidebar(false); // تمكين الأزرار بعد تحميل المحتوى
}

// دالة تحديث محتوى الحيوان المعروض
function updateAnimalContent() {
    if (animals.length === 0) return;

    currentAnimalData = animals[currentIndex];

    const animalImage = document.getElementById('animal-image');
    const animalWord = document.getElementById('animal-word');
    const animalDescription = document.getElementById('animal-description');
    const animalBaby = document.getElementById("animal-baby");
    const animalFemale = document.getElementById("animal-female");
    const animalCategory = document.getElementById("animal-category");

    const prevAnimalBtn = document.getElementById('prev-animal-btn');
    const nextAnimalBtn = document.getElementById('next-animal-btn');

    if (animalImage) animalImage.src = `/images/animals/${currentAnimalData.image}`;
    if (animalImage) animalImage.alt = currentAnimalData.name[currentLang];
    if (animalWord) {
        const animalName = currentAnimalData.name[currentLang];
        if (animalName) {
            const firstLetter = animalName.charAt(0);
            const restOfName = animalName.substring(1);
            animalWord.innerHTML = `<span class="item-main-name">${firstLetter}</span>${restOfName}`;
        } else {
            animalWord.textContent = '';
        }
    }
    if (animalDescription) animalDescription.textContent = currentAnimalData.description?.[currentLang] || "لا يوجد وصف";

    if (animalBaby) animalBaby.textContent = currentAnimalData.baby?.[currentLang] || "غير معروف";
    if (animalFemale) animalFemale.textContent = currentAnimalData.female?.[currentLang] || "غير معروف";
    if (animalCategory) animalCategory.textContent = Array.isArray(currentAnimalData.classification) // استخدام classification بدلاً من category
      ? currentAnimalData.classification.map(cat => (typeof cat === 'object' && cat !== null && cat[currentLang]) ? cat[currentLang] : cat).join(", ")
      : (currentAnimalData.classification?.[currentLang] || "غير معروف");


    // تحديث حالة أزرار التنقل في الشريط الجانبي
    if (prevAnimalBtn) prevAnimalBtn.disabled = currentIndex === 0;
    if (nextAnimalBtn) nextAnimalBtn.disabled = currentIndex === animals.length - 1;

    stopCurrentAudio();
}

async function fetchAnimals(lang) { // تقبل اللغة كمعامل
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

// ***** دوال مصدّرة ليتم استدعاؤها من index.html *****
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

function getAnimalAudioPath(data, voiceType) {
  const langFolder = document.getElementById('game-lang-select-animal').value;   // جلب اللغة من الشريط الجانبي
  const subjectFolder = 'animals';  // ثابتة للحيوانات

  let fileName;

  if (data.voices && data.voices[`${voiceType}_${langFolder}`]) {
    fileName = data.voices[`${voiceType}_${langFolder}`];
    console.log(`✅ Found in voices: ${voiceType}_${langFolder} → ${fileName}`);
  } else if (data.sound_base) {
    fileName = `${data.sound_base}_${voiceType}_${langFolder}.mp3`;
    console.warn(`⚠️ Used fallback from sound_base: ${fileName}`);
  } else {
    console.error(`❌ Neither voices nor sound_base available for ${data.name?.[currentLang] || "unknown"}`);
    return null;
  }

  const audioPath = `/audio/${langFolder}/${subjectFolder}/${fileName}`;
  console.log(`🎧 Full audio path: ${audioPath}`);
  return audioPath;
}

function disableAnimalButtonsInSidebar(isDisabled) {
    const playSoundBtn = document.getElementById("play-sound-btn-animal");
    const nextBtn = document.getElementById("next-animal-btn");
    const prevBtn = document.getElementById("prev-animal-btn");
    const voiceSelect = document.getElementById("voice-select-animal");
    const langSelect = document.getElementById("game-lang-select-animal");

    if (playSoundBtn) playSoundBtn.disabled = isDisabled;
    if (nextBtn) nextBtn.disabled = isDisabled;
    if (prevBtn) prevBtn.disabled = isDisabled;
    if (voiceSelect) voiceSelect.disabled = isDisabled;
    if (langSelect) langSelect.disabled = isDisabled;
}