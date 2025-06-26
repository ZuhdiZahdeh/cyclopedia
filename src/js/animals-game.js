import { db } from "./firebase-config.js";
import { getDocs, collection } from "firebase/firestore";
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js"; // استيراد دوال اللغة
import { playAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let animals = [];
let currentIndex = 0;
let selectedVoice = "teacher"; // الصوت الافتراضي

const currentUser = JSON.parse(localStorage.getItem("user") || "{}"); // جلب المستخدم الحالي

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
      <img id="animal-image" src="" alt="animal" />
      <h2 id="animal-word">---</h2>
      
      <div class="animal-details-section">
        <h3>تفاصيل إضافية:</h3>
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

  // العناصر في الشريط الجانبي
  const playSoundBtn = document.getElementById("play-sound-btn");
  const nextAnimalBtn = document.getElementById("next-animal-btn");
  const voiceSelect = document.getElementById("voice-select");
  const gameLangSelect = document.getElementById("game-lang-select"); // عنصر اختيار اللغة

  // التحقق من وجود جميع العناصر الحيوية
  if (!animalImage || !animalWord || !playSoundBtn || !nextAnimalBtn || !voiceSelect || !gameLangSelect || !animalBaby || !animalFemale || !animalCategory || !animalDescription) {
    console.error("One or more game/control elements not found after content injection. Check IDs.");
    // تعطيل الأزرار والقوائم المنسدلة إذا كانت العناصر غير موجودة
    if (playSoundBtn) playSoundBtn.disabled = true;
    if (nextAnimalBtn) nextAnimalBtn.disabled = true;
    if (voiceSelect) voiceSelect.disabled = true;
    if (gameLangSelect) gameLangSelect.disabled = true;
    return;
  }

  // تعيين اللغة الافتراضية
  gameLangSelect.value = currentLang;

  // جلب البيانات من Firestore
  await fetchAnimals();

  // التحقق مما إذا تم جلب أي حيوانات
  if (animals.length === 0) {
    console.warn("No animals found for this category and language. Please check Firestore data or rules.");
    animalImage.src = "/images/default.png"; // صورة افتراضية
    animalWord.textContent = "لا توجد بيانات";
    // تعطيل الأزرار والقوائم المنسدلة
    playSoundBtn.disabled = true;
    nextAnimalBtn.disabled = true;
    voiceSelect.disabled = true;
    gameLangSelect.disabled = true;
    // مسح تفاصيل الحيوان
    animalBaby.textContent = "غير متوفر";
    animalFemale.textContent = "غير متوفر";
    animalCategory.textContent = "غير متوفر";
    animalDescription.textContent = "لا يوجد وصف متوفر.";
    return;
  }

  // عرض الحيوان الأول
  showAnimal(currentIndex);

  // ربط معالجات الأحداث بالأزرار والقائمة المنسدلة
  nextAnimalBtn.addEventListener("click", async () => {
    if (currentUser && currentUser.uid) {
      await recordActivity(currentUser, "animals");
    }
    currentIndex = (currentIndex + 1) % animals.length;
    showAnimal(currentIndex);
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
    // يمكنك تشغيل الصوت الجديد فورًا إذا أردت عند تغيير الاختيار
    // playAudio(getAudioPath(animals[currentIndex], selectedVoice));
  });

  gameLangSelect.addEventListener("change", async (event) => {
    const newLang = event.target.value;
    await loadLanguage(newLang); // تحديث اللغة في lang-handler
    applyTranslations(); // إعادة تطبيق الترجمات على عناصر data-i18n
    // إعادة جلب الحيوانات باللغة الجديدة وإعادة عرضها
    await fetchAnimals();
    currentIndex = 0; // إعادة تعيين الفهرس
    showAnimal(currentIndex); // عرض أول حيوان باللغة الجديدة
  });
}

async function fetchAnimals() { /* ... (هذه الدالة تبقى كما هي) ... */
  try {
    const itemsCollectionRef = collection(db, "categories", "animals", "items");
    const snapshot = await getDocs(itemsCollectionRef);
    animals = snapshot.docs.map(doc => {
      const data = doc.data();
      return data;
    });
    console.log("Fetched animals:", animals);
  } catch (error) {
    console.error("Error fetching animals from Firestore:", error);
    animals = [];
  }
}

function showAnimal(index) { /* ... (هذه الدالة تبقى كما هي) ... */
  const data = animals[index];
  
  const name = data.name?.[currentLang] || data.englishName || "---"; 
  const imgSrc = `/images/animals/${data.image}`;
  
  document.getElementById("animal-image").src = imgSrc;
  document.getElementById("animal-image").alt = name;
  document.getElementById("animal-word").textContent = name;

  document.getElementById("animal-baby").textContent = data.baby?.[currentLang] || "غير معروف";
  document.getElementById("animal-female").textContent = data.female?.[currentLang] || "غير معروف";
  document.getElementById("animal-category").textContent = Array.isArray(data.category) 
    ? data.category.map(cat => (typeof cat === 'object' && cat !== null ? cat[currentLang] : cat) || "غير معروف").join(", ") 
    : (data.category?.[currentLang] || "غير معروف");
  
  document.getElementById("animal-description").textContent = data.description?.[currentLang] || "لا يوجد وصف";
}

function getAudioPath(data, voiceType) { /* ... (هذه الدالة تبقى كما هي) ... */
  const fileName = data.voices?.[voiceType];
  if (fileName) {
    return `/audio/${currentLang}/animals/${fileName}`;
  }
  return null;
}