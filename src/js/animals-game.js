import { db } from "./firebase-config.js";
import { getDocs, collection } from "firebase/firestore";
import { currentLang } from "./lang-handler.js";
import { playAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let animals = [];
let currentIndex = 0;
let selectedVoice = "teacher"; // الصوت الافتراضي

const currentUser = JSON.parse(localStorage.getItem("user") || "{}"); // جلب المستخدم الحالي

export async function loadAnimalsGameContent() {
  const mainContentArea = document.querySelector("main.main-content");
  if (!mainContentArea) {
    console.error("Main content area not found.");
    return;
  }

  // حقن الهيكل HTML الخاص بلعبة الحيوانات في منطقة المحتوى الرئيسية
  mainContentArea.innerHTML = `
    <h1 style="text-align: center;">🐾 تعرف على الحيوانات</h1>
    <div class="game-box">
      <img id="animal-image" src="" alt="animal" />
      <h2 id="animal-word">---</h2>
      
      <!-- قسم تفاصيل الحيوان الجديد -->
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
      <!-- نهاية قسم تفاصيل الحيوان الجديد -->

      <div class="voice-selection">
        <label for="voice-select">اختر الصوت:</label>
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
  const animalImage = document.getElementById("animal-image");
  const animalWord = document.getElementById("animal-word");
  const playSoundBtn = document.getElementById("play-sound-btn");
  const nextAnimalBtn = document.getElementById("next-animal-btn");
  const voiceSelect = document.getElementById("voice-select");

  // مراجع العناصر الجديدة لتفاصيل الحيوان
  const animalBaby = document.getElementById("animal-baby");
  const animalFemale = document.getElementById("animal-female");
  const animalCategory = document.getElementById("animal-category");
  const animalDescription = document.getElementById("animal-description");


  if (!animalImage || !animalWord || !playSoundBtn || !nextAnimalBtn || !voiceSelect || !animalBaby || !animalFemale || !animalCategory || !animalDescription) {
    console.error("One or more game elements not found after content injection. Check IDs.");
    return;
  }

  await fetchAnimals();

  if (animals.length === 0) {
    console.warn("No animals found for this category and language.");
    animalImage.src = "/images/default.png";
    animalWord.textContent = "لا توجد بيانات";
    // تعطيل الأزرار والقوائم المنسدلة
    playSoundBtn.disabled = true;
    nextAnimalBtn.disabled = true;
    voiceSelect.disabled = true;
    // مسح تفاصيل الحيوان
    animalBaby.textContent = "غير متوفر";
    animalFemale.textContent = "غير متوفر";
    animalCategory.textContent = "غير متوفر";
    animalDescription.textContent = "لا يوجد وصف متوفر.";
    return;
  }

  showAnimal(currentIndex);

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
    // يمكنك هنا إضافة تشغيل الصوت الجديد فورًا إذا أردت
    // playAudio(getAudioPath(animals[currentIndex], selectedVoice));
  });
}

async function fetchAnimals() {
  try {
    const snapshot = await getDocs(collection(db, "categories", "animals", "items"));
    animals = snapshot.docs.map(doc => doc.data());
    console.log("Fetched animals:", animals);
  } catch (error) {
    console.error("Error fetching animals from Firestore:", error);
    animals = [];
  }
}

function showAnimal(index) {
  const data = animals[index];
  const name = data.name?.[currentLang] || "---";
  // المسار يبدأ من `public/images/animals/`
  const imgSrc = `/images/animals/${data.image}`;

  document.getElementById("animal-image").src = imgSrc;
  document.getElementById("animal-image").alt = name;
  document.getElementById("animal-word").textContent = name;

  // تحديث تفاصيل إضافية للحيوان
  document.getElementById("animal-baby").textContent = data.baby?.[currentLang] || "غير معروف";
  document.getElementById("animal-female").textContent = data.female?.[currentLang] || "غير معروف";
  // تأكد من أن category هو مصفوفة أو حوله إلى سلسلة نصية
  document.getElementById("animal-category").textContent = Array.isArray(data.category) ? data.category.map(cat => cat[currentLang] || cat).join(", ") : data.category?.[currentLang] || "غير معروف";
  document.getElementById("animal-description").textContent = data.description?.[currentLang] || "لا يوجد وصف";
}

function getAudioPath(data, voiceType) {
  const fileName = data.voices?.[voiceType];
  if (fileName) {
    // المسار يبدأ من `public/audio/{lang}/animals/`
    return `/audio/${currentLang}/animals/${fileName}`;
  }
  return null;
}
