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
  // تم تحسين تنسيق الـ HTML المحقون ليكون أكثر سهولة في القراءة
  mainContentArea.innerHTML = `
    <h1 style="text-align: center;">🐾 تعرف على الحيوانات</h1>
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

  // *** الأجزاء المفقودة التي تم استعادتها ***

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


  // التحقق من وجود جميع العناصر الحيوية
  if (!animalImage || !animalWord || !playSoundBtn || !nextAnimalBtn || !voiceSelect || !animalBaby || !animalFemale || !animalCategory || !animalDescription) {
    console.error("One or more game elements not found after content injection. Check IDs in the injected HTML.");
    // تعطيل الأزرار والقوائم المنسدلة إذا كانت العناصر غير موجودة
    if (playSoundBtn) playSoundBtn.disabled = true;
    if (nextAnimalBtn) nextAnimalBtn.disabled = true;
    if (voiceSelect) voiceSelect.disabled = true;
    return;
  }

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
    // تسجيل النشاط (تأكد أن currentUser لديه uid)
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
    // يمكن تشغيل الصوت الجديد فورًا إذا أردت عند تغيير الاختيار
    // playAudio(getAudioPath(animals[currentIndex], selectedVoice));
  });
}

// دالة جلب الحيوانات من Firestore
async function fetchAnimals() {
  try {
    // التأكد من مسار الكوليكشن الصحيح: categories/{category}/items
    const itemsCollectionRef = collection(db, "categories", "animals", "items");
    const snapshot = await getDocs(itemsCollectionRef);
    animals = snapshot.docs.map(doc => {
      const data = doc.data();
      // يمكن هنا إضافة بعض المعالجة للبيانات إذا كانت الحقول مفقودة
      return data;
    });
    console.log("Fetched animals:", animals); // لعرض البيانات في Console
  } catch (error) {
    console.error("Error fetching animals from Firestore:", error);
    animals = []; // تفريغ المصفوفة في حالة الفشل
  }
}

// دالة عرض بيانات الحيوان الحالي
function showAnimal(index) {
  const data = animals[index];
  
  // التأكد من أن حقول اللغة موجودة قبل محاولة الوصول إليها
  const name = data.name?.[currentLang] || data.englishName || "---"; 
  const imgSrc = `/images/animals/${data.image}`;
  
  document.getElementById("animal-image").src = imgSrc;
  document.getElementById("animal-image").alt = name;
  document.getElementById("animal-word").textContent = name;

  // تحديث تفاصيل إضافية للحيوان
  document.getElementById("animal-baby").textContent = data.baby?.[currentLang] || "غير معروف";
  document.getElementById("animal-female").textContent = data.female?.[currentLang] || "غير معروف";
  // التأكد من أن category هو مصفوفة أو كائن قبل الوصول إلى currentLang
  document.getElementById("animal-category").textContent = Array.isArray(data.category) 
    ? data.category.map(cat => (typeof cat === 'object' && cat !== null ? cat[currentLang] : cat) || "غير معروف").join(", ") 
    : (data.category?.[currentLang] || "غير معروف");
  
  document.getElementById("animal-description").textContent = data.description?.[currentLang] || "لا يوجد وصف";
}

// دالة الحصول على مسار الصوت
function getAudioPath(data, voiceType) {
  const fileName = data.voices?.[voiceType];
  if (fileName) {
    return `/audio/${currentLang}/animals/${fileName}`;
  }
  return null;
}