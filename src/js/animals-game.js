// public/src/js/animals-game.js

import { db } from "./firebase-config.js";
import { getDocs, collection, query } from "firebase/firestore";
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let animalsData = []; 
let currentIndex = 0;
let currentAnimalData = null;

export async function loadAnimalsGameContent() {
  stopCurrentAudio();
  const mainContentArea = document.querySelector("main.main-content");
  // 🐛 تم تحديث الـ ID ليتوافق مع index.html
  const animalsSidebarControls = document.getElementById("animal-sidebar-controls"); 

  if (!mainContentArea) {
    console.error("Main content area not found.");
    return;
  }

  // 1. حقن HTML الخاص بلعبة الحيوانات في منطقة المحتوى الرئيسية
  mainContentArea.innerHTML = `
    <div class="game-box">
      <h2 id="animal-word" class="item-main-name">---</h2>
      <img id="animal-image" src="" alt="animal" />
      
      <div class="animal-details-section info-box">
        <h3>حقائق عن الحيوان:</h3>
        <ul id="animal-details-list">
          <li><strong>الموئل:</strong> <span id="animal-habitat">---</span></li>
          <li><strong>الصوت:</strong> <span id="animal-sound-description">---</span></li>
          <li><strong>حقيقة ممتعة:</strong> <span id="animal-fun-fact">---</span></li>
        </ul>
        <div class="animal-description-box info-box">
          <h4>الوصف:</h4>
          <p id="animal-description">---</p>
        </div>
      </div>
    </div>
  `;

  // الحصول على المراجع للعناصر بعد حقنها في DOM
  const animalImage = document.getElementById("animal-image");
  const animalWord = document.getElementById("animal-word");
  const animalHabitat = document.getElementById("animal-habitat");
  const animalSoundDescription = document.getElementById("animal-sound-description");
  const animalFunFact = document.getElementById("animal-fun-fact");
  const animalDescription = document.getElementById("animal-description");

  // 🐛 تم تحديث الـ ID ليتوافق مع index.html
  const gameLangSelect = document.getElementById('game-lang-select-animal'); 
  
  // 🔴 إضافة مستمع حدث التغيير للقائمة المنسدلة للغة
  if (gameLangSelect) {
    gameLangSelect.addEventListener('change', async () => {
        stopCurrentAudio(); // إيقاف أي صوت حالي
        // قم بإعادة جلب البيانات باللغة الجديدة التي تم اختيارها
        await fetchAnimalsData(gameLangSelect.value); 
        currentIndex = 0; // أعد تعيين الفهرس لبدء من العنصر الأول باللغة الجديدة
        updateAnimalContent(); // حدث الواجهة بالبيانات الجديدة
        applyTranslations(); // تأكد من تطبيق الترجمات على جميع عناصر الواجهة
        setDirection(gameLangSelect.value); // تحديث اتجاه النص (RTL/LTR)
    });
  } else {
      console.warn("Language select for animals game not found (ID: game-lang-select-animal).");
  }

  // جلب البيانات بناءً على اللغة المختارة أو الإنجليزية كافتراضي
  await fetchAnimalsData(gameLangSelect ? gameLangSelect.value : 'en'); 

  if (animalsData.length === 0) {
    console.warn("No animal data found. Please check Firestore data or rules.");
    if (animalImage) animalImage.src = "/images/default.png";
    if (animalWord) animalWord.textContent = "لا توجد بيانات";
    if (animalDescription) animalDescription.textContent = "لا يوجد وصف متوفر.";
    if (animalHabitat) animalHabitat.textContent = "غير متوفر";
    if (animalSoundDescription) animalSoundDescription.textContent = "غير متوفر";
    if (animalFunFact) animalFunFact.textContent = "غير متوفر";
    disableAnimalsButtonsInSidebar(true);
    return;
  }

  currentIndex = 0;
  updateAnimalContent();
  disableAnimalsButtonsInSidebar(false);
}

function updateAnimalContent() {
  if (animalsData.length === 0) return;

  currentAnimalData = animalsData[currentIndex];
    
  const animalImage = document.getElementById("animal-image");
  const animalWord = document.getElementById("animal-word");
  const animalHabitat = document.getElementById("animal-habitat");
  const animalSoundDescription = document.getElementById("animal-sound-description");
  const animalFunFact = document.getElementById("animal-fun-fact");
  const animalDescription = document.getElementById("animal-description");

  // تأكد من أن هذه الـ IDs موجودة في HTML الخاص بك لأزرار التنقل
  const prevAnimalBtn = document.getElementById('prev-animal-btn'); 
  const nextAnimalBtn = document.getElementById('next-animal-btn'); 

  const name = currentAnimalData.name?.[currentLang] || currentAnimalData.name?.en || "---"; 
  const imgSrc = `/images/animals/${currentAnimalData.image}`; // مسار الصور
  
  if (animalImage) animalImage.src = imgSrc;
  if (animalImage) animalImage.alt = name;
  if (animalWord) animalWord.textContent = name;

  if (animalHabitat) animalHabitat.textContent = currentAnimalData.habitat?.[currentLang] || "غير متوفر";
  if (animalSoundDescription) animalSoundDescription.textContent = currentAnimalData.sound_description?.[currentLang] || "غير متوفر"; 
  if (animalFunFact) animalFunFact.textContent = currentAnimalData.fun_fact?.[currentLang] || "لا توجد حقائق ممتعة";
  if (animalDescription) animalDescription.textContent = currentAnimalData.description?.[currentLang] || "لا يوجد وصف";

  if (prevAnimalBtn) prevAnimalBtn.disabled = (currentIndex === 0);
  if (nextAnimalBtn) nextAnimalBtn.disabled = (currentIndex === animalsData.length - 1);

  stopCurrentAudio();
}

async function fetchAnimalsData(lang) {
  try {
    const itemsCollectionRef = collection(db, "categories", "animals", "items");
    const q = query(itemsCollectionRef);
    const snapshot = await getDocs(itemsCollectionRef);
    animalsData = snapshot.docs.map(doc => doc.data());
    console.log("Fetched animal data:", animalsData);
  }
  catch (error) {
    console.error("Error fetching animal data from Firestore:", error);
    animalsData = [];
  }
}

// ***** دوال مصدّرة ليتم استدعاؤها من index.html أو main.js *****
export function showNextAnimal() {
    stopCurrentAudio();
    if (currentIndex < animalsData.length - 1) {
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
        // 🐛 تم تحديث الـ ID ليتوافق مع index.html
        const voiceSelect = document.getElementById('voice-select-animal'); 
        const selectedVoiceType = voiceSelect ? voiceSelect.value : 'boy'; // الافتراضي 'boy'
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
  // 🐛 تم تحديث الـ ID ليتوافق مع index.html
  const langSelect = document.getElementById('game-lang-select-animal');
  const langFolder = langSelect ? langSelect.value : 'en'; // استخدام 'en' كافتراضي
  const subjectFolder = 'animals';

  let fileName;
  // الأولوية لحقل voices المحدد بالكامل (مثال: ant_boy_en.mp3)
  // يتم بناء المفتاح ديناميكيًا (مثال: "boy_ar", "girl_en")
  if (data.voices && data.voices[`${voiceType}_${langFolder}`]) { 
    fileName = data.voices[`${voiceType}_${langFolder}`];
  } 
  // إذا لم يكن هناك مسار محدد في voices، نستخدم sound_base ونبني المسار
  else if (data.sound_base) {
    fileName = `${data.sound_base}_${voiceType}_${langFolder}.mp3`;
  } else {
    console.warn(`لا يوجد مسار صوت لـ ${data.name?.[currentLang]} بنوع الصوت ${voiceType} واللغة ${langFolder}.`);
    return null;
  }
  return `/audio/${langFolder}/${subjectFolder}/${fileName}`;
}

function disableAnimalsButtonsInSidebar(isDisabled) {
    // 🐛 تم تحديث الـ ID ليتوافق مع index.html
    const playSoundBtn = document.getElementById("play-sound-btn-animal"); 
    const nextBtn = document.getElementById("next-animal-btn");
    const prevBtn = document.getElementById("prev-animal-btn");
    // 🐛 تم تحديث الـ ID ليتوافق مع index.html
    const voiceSelect = document.getElementById("voice-select-animal");
    // 🐛 تم تحديث الـ ID ليتوافق مع index.html
    const langSelect = document.getElementById("game-lang-select-animal");

    if (playSoundBtn) playSoundBtn.disabled = isDisabled;
    if (nextBtn) nextBtn.disabled = isDisabled;
    if (prevBtn) prevBtn.disabled = isDisabled;
    if (voiceSelect) voiceSelect.disabled = isDisabled;
    if (langSelect) langSelect.disabled = isDisabled;
}