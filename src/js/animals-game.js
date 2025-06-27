// public/js/animals-game.js

import { db } from "./firebase-config.js";
import { getDocs, collection } from "firebase/firestore";
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js"; // تأكد من استيراد stopCurrentAudio
import { recordActivity } from "./activity-handler.js";

let animals = [];
let currentIndex = 0;
let selectedVoice = "teacher"; // الصوت الافتراضي

const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

export async function loadAnimalsGameContent() {
  const mainContentArea = document.querySelector("main.main-content");
  const animalSidebarControls = document.getElementById("animal-sidebar-controls");

  if (!mainContentArea || !animalSidebarControls) {
    console.error("Main content area or animal sidebar controls not found.");
    return;
  }

  // 1. حقن HTML الخاص بلعبة الحيوانات في منطقة المحتوى الرئيسية
  mainContentArea.innerHTML = `
    <div class="game-box">
      <h2 id="animal-word" class="animal-name">---</h2> <img id="animal-image" src="" alt="animal" />
      
      <div class="animal-description-box">
        <h4>الوصف:</h4>
        <p id="animal-description">---</p>
      </div>
    </div>
  `;

  // 2. حقن HTML الخاص بعناصر التحكم (عنوان البطاقة، الأزرار، اختيار الصوت واللغة) في الشريط الجانبي
  animalSidebarControls.innerHTML = `
    <h3 style="text-align: center;">🐾 تعرف على الحيوانات</h3>
    <div class="sidebar-game-controls">
      <div class="language-selection" style="margin-bottom: 1rem;">
        <label for="game-lang-select">اللغة:</label>
        <select id="game-lang-select">
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="he">עברית</option>
        </select>
      </div>
      <div class="voice-selection" style="margin-bottom: 1rem;">
        <label for="voice-select">الصوت:</label>
        <select id="voice-select">
          <option value="teacher">المعلم</option>
          <option value="boy">صوت ولد</option>
          <option value="girl">صوت بنت</option>
          <option value="child">صوت طفل</option>
        </select>
      </div>
      <button id="play-sound-btn">🔊 استمع</button>
      <button id="next-animal-btn">التالي ➡️</button>
      <button id="prev-animal-btn">⬅️ السابق</button> </div>
  `;

  // الحصول على المراجع للعناصر بعد حقنها في DOM
  const animalImage = document.getElementById("animal-image");
  const animalWord = document.getElementById("animal-word");
  const animalDescription = document.getElementById("animal-description");
  
  const playSoundBtn = document.getElementById("play-sound-btn");
  const nextAnimalBtn = document.getElementById("next-animal-btn");
  const prevAnimalBtn = document.getElementById("prev-animal-btn"); // الحصول على مرجع زر السابق
  const voiceSelect = document.getElementById("voice-select");
  const gameLangSelect = document.getElementById("game-lang-select");

  if (!animalImage || !animalWord || !playSoundBtn || !nextAnimalBtn || !prevAnimalBtn || !voiceSelect || !gameLangSelect || !animalDescription) {
    console.error("One or more animal game/control elements not found after content injection. Check IDs.");
    disableAnimalButtons(true);
    return;
  }

  gameLangSelect.value = currentLang;

  await fetchAnimals();

  if (animals.length === 0) {
    console.warn("No animals found for this category and language. Please check Firestore data or rules.");
    animalImage.src = "/images/default.png";
    animalWord.textContent = "لا توجد بيانات";
    animalDescription.textContent = "لا يوجد وصف متوفر.";
    disableAnimalButtons(true);
    return;
  }

  showAnimal(currentIndex);

  nextAnimalBtn.addEventListener("click", async () => {
    if (currentIndex < animals.length - 1) { // تغيير بسيط لتجنب الزيادة بعد الأخير
        currentIndex++;
        showAnimal(currentIndex);
        if (currentUser && currentUser.uid) {
            await recordActivity(currentUser, "animals");
        }
    }
  });

  prevAnimalBtn.addEventListener("click", () => { // معالج حدث لزر السابق
    if (currentIndex > 0) {
        currentIndex--;
        showAnimal(currentIndex);
    }
  });

  playSoundBtn.addEventListener("click", () => {
    const soundPath = getAudioPath(animals[currentIndex], selectedVoice);
    if (soundPath) {
      playAudio(soundPath);
    } else {
      console.warn(`No ${selectedVoice} sound available for current animal.`);
    }
  });

  voiceSelect.addEventListener("change", (event) => {
    selectedVoice = event.target.value;
  });

  gameLangSelect.addEventListener("change", async (event) => {
    const newLang = event.target.value;
    await loadLanguage(newLang);
    applyTranslations();
    await fetchAnimals();
    currentIndex = 0;
    showAnimal(currentIndex);
    setDirection(newLang);
  });
}

async function fetchAnimals() {
  try {
    const itemsCollectionRef = collection(db, "categories", "animals", "items");
    const snapshot = await getDocs(itemsCollectionRef);
    animals = snapshot.docs.map(doc => doc.data());
    console.log("Fetched animals:", animals);
  } catch (error) {
    console.error("Error fetching animals from Firestore:", error);
    animals = [];
  }
}

function showAnimal(index) {
  if (index >= 0 && index < animals.length) { // إضافة هذا التحقق
    const data = animals[index];
    
    // عرض الاسم باللغة الحالية، مع fallback للإنجليزية
    const name = data.name?.[currentLang] || data.name?.en || "---"; 
    const imgSrc = `/images/animals/${data.image}`;
    
    document.getElementById("animal-image").src = imgSrc;
    document.getElementById("animal-image").alt = name;
    document.getElementById("animal-word").textContent = name; // هذا هو العنصر الذي سيظهر فوق الصورة
    
    // إزالة تفاصيل الابناء والزوجة والصنف إذا لم تعد مطلوبة في الواجهة
    // أو التأكد من إزالتها من HTML المحقون
    // animalBaby.textContent = data.baby?.[currentLang] || "غير معروف";
    // animalFemale.textContent = data.female?.[currentLang] || "غير معروف";
    // animalCategory.textContent = Array.isArray(data.category) 
    //   ? data.category.map(cat => (typeof cat === 'object' && cat !== null ? cat[currentLang] : cat) || "غير معروف").join(", ") 
    //   : (data.category?.[currentLang] || "غير معروف");
    
    document.getElementById("animal-description").textContent = data.description?.[currentLang] || "لا يوجد وصف";

    // تحديث حالة أزرار التنقل
    document.getElementById("prev-animal-btn").disabled = (index === 0);
    document.getElementById("next-animal-btn").disabled = (index === animals.length - 1);

    stopCurrentAudio(); // إيقاف أي صوت يتم تشغيله حالياً
  }
}

function getAudioPath(data, voiceType) {
  const fileName = data.voices?.[voiceType];
  if (fileName) {
    // استخدم currentLang للمجلد الفرعي للغة للصوت
    return `/audio/${currentLang}/animals/${fileName}`;
  }
  return null;
}

function disableAnimalButtons(isDisabled) {
    const btns = [
        document.getElementById("play-sound-btn"),
        document.getElementById("next-animal-btn"),
        document.getElementById("prev-animal-btn"),
        document.getElementById("voice-select"),
        document.getElementById("game-lang-select")
    ];
    btns.forEach(btn => {
        if (btn) btn.disabled = isDisabled;
    });
}