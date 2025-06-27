// public/js/animals-game.js

import { db } from "./firebase-config.js";
import { getDocs, collection } from "firebase/firestore";
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let animals = [];
let currentIndex = 0;
let selectedVoice = "teacher";

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
      
      <div class="animal-details-section"> <h3>تفاصيل إضافية:</h3>
        <ul id="animal-details-list">
          <li><strong>اسم الابناء:</strong> <span id="animal-baby">---</span></li>
          <li><strong>اسم الزوجة:</strong> <span id="animal-female">---</span></li>
          <li><strong>الصنف:</strong> <span id="animal-category">---</span></li>
        </ul>
        <div class="animal-description-box">
          <h4>الوصف:</h4>
          <p id="animal-description">---</p>
        </div>
      </div>
      <div class="navigation-buttons"> <button id="prev-animal-btn">⬅️ السابق</button>
                <button id="next-animal-btn">التالي ➡️</button>
            </div>
    </div>
  `;

  // 2. حقن HTML الخاص بعناصر التحكم في الشريط الجانبي
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
          <option value="teacher">المعلم</moption>
          <option value="boy">صوت ولد</option>
          <option value="girl">صوت بنت</option>
          <option value="child">صوت طفل</option>
        </select>
      </div>
      <button id="play-sound-btn">🔊 استمع</button>
    </div>
  `;

  // الحصول على المراجع للعناصر بعد حقنها في DOM
  // العناصر في main-content
  const animalImage = document.getElementById("animal-image");
  const animalWord = document.getElementById("animal-word");
  const animalBaby = document.getElementById("animal-baby"); // تم إعادة تعريفها
  const animalFemale = document.getElementById("animal-female"); // تم إعادة تعريفها
  const animalCategory = document.getElementById("animal-category"); // تم إعادة تعريفها
  const animalDescription = document.getElementById("animal-description");

  // العناصر في الشريط الجانبي
  const playSoundBtn = document.getElementById("play-sound-btn");
  const voiceSelect = document.getElementById("voice-select");
  const gameLangSelect = document.getElementById("game-lang-select");
  
  // أزرار التنقل التي أصبحت داخل main-content
  const nextAnimalBtn = document.getElementById("next-animal-btn");
  const prevAnimalBtn = document.getElementById("prev-animal-btn");

  if (!animalImage || !animalWord || !playSoundBtn || !nextAnimalBtn || !prevAnimalBtn || !voiceSelect || !gameLangSelect || !animalBaby || !animalFemale || !animalCategory || !animalDescription) {
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
    animalBaby.textContent = "غير متوفر"; // مسح التفاصيل
    animalFemale.textContent = "غير متوفر";
    animalCategory.textContent = "غير متوفر";
    disableAnimalButtons(true);
    return;
  }

  showAnimal(currentIndex);

  nextAnimalBtn.addEventListener("click", async () => {
    if (currentIndex < animals.length - 1) {
        currentIndex++;
        showAnimal(currentIndex);
        if (currentUser && currentUser.uid) {
            await recordActivity(currentUser, "animals");
        }
    }
  });

  prevAnimalBtn.addEventListener("click", () => {
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
    await fetchAnimals(); // إعادة جلب الحيوانات باللغة الجديدة
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
  if (index >= 0 && index < animals.length) {
    const data = animals[index];
    
    const name = data.name?.[currentLang] || data.name?.en || "---"; 
    const imgSrc = `/images/animals/${data.image}`;
    
    document.getElementById("animal-image").src = imgSrc;
    document.getElementById("animal-image").alt = name;
    document.getElementById("animal-word").textContent = name; // هذا هو العنصر الذي سيظهر فوق الصورة

    // عرض التفاصيل الإضافية
    document.getElementById("animal-baby").textContent = data.baby?.[currentLang] || "غير معروف";
    document.getElementById("animal-female").textContent = data.female?.[currentLang] || "غير معروف";
    document.getElementById("animal-category").textContent = Array.isArray(data.category) 
      ? data.category.map(cat => (typeof cat === 'object' && cat !== null ? cat[currentLang] : cat) || "غير معروف").join(", ") 
      : (data.category?.[currentLang] || "غير معروف");
    
    document.getElementById("animal-description").textContent = data.description?.[currentLang] || "لا يوجد وصف";

    // تحديث حالة أزرار التنقل
    document.getElementById("prev-animal-btn").disabled = (index === 0);
    document.getElementById("next-animal-btn").disabled = (index === animals.length - 1);

    stopCurrentAudio();
  }
}

function getAudioPath(data, voiceType) {
  const fileName = data.voices?.[voiceType];
  if (fileName) {
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