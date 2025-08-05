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
  if (!mainContentArea) {
    console.error("Main content area not found.");
    return;
  }

  // واجهة العرض داخل المنطقة الرئيسية
  mainContentArea.innerHTML = `
    <div class="game-box">
      <h2 id="animal-word" class="item-main-name"></h2>
      <img id="animal-image" src="" alt="animal" />
      
      <div class="animal-details-section info-box" id="animal-details-section" style="display:none;">
        <h3 data-i18n="additional_details">تفاصيل إضافية:</h3>
        <ul id="animal-details-list">
          <li><strong data-i18n="baby_name">اسم الابناء:</strong> <span id="animal-baby">---</span></li>
          <li><strong data-i18n="female_name">اسم الزوجة:</strong> <span id="animal-female">---</span></li>
          <li><strong data-i18n="category">الصنف:</strong> <span id="animal-category">---</span></li>
        </ul>
        <div class="baby-animal-section" style="display:none;">
          <h4 data-i18n="baby_image">صورة الابن:</h4>
          <img id="baby-animal-image" src="" alt="baby animal" style="max-width: 150px; margin-top: 10px;"/>
        </div>
      </div>

      <div class="animal-description-box info-box" id="animal-description-box" style="display:none;">
        <h4 data-i18n="description_title">الوصف:</h4>
        <p id="animal-description">---</p>
      </div>
    </div>
  `;

  // عناصر الشريط الجانبي (موجودة خارج main، لذلك لا تتأثر بـ innerHTML)
  const playSoundBtn        = document.getElementById("play-sound-btn-animal");
  const playBabySoundBtn    = document.getElementById("play-baby-sound-btn-animal");
  const prevBtn             = document.getElementById("prev-animal-btn");
  const nextBtn             = document.getElementById("next-animal-btn");
  const voiceSelect         = document.getElementById("voice-select-animal");
  const langSelect          = document.getElementById("game-lang-select-animal");
  const toggleDescBtn       = document.getElementById("toggle-description-btn");
  const toggleDetailsBtn    = document.getElementById("toggle-details-btn");
  const toggleBabyImageBtn  = document.getElementById("toggle-baby-image-btn");

  // تحميل البيانات (حسب اللغة الحالية في الشريط الجانبي)
  if (!langSelect) {
    console.error("Language select for animal game not found.");
    return;
  }
  await fetchAnimals(langSelect.value);

  if (animals.length === 0) {
    console.warn("No animals found.");
    document.getElementById("animal-image").src = "/images/default.png";
    document.getElementById("animal-word").textContent = "لا توجد بيانات";
    document.getElementById("animal-description").textContent = "لا يوجد وصف متوفر.";
    document.getElementById("animal-baby").textContent = "غير متوفر";
    document.getElementById("animal-female").textContent = "غير متوفر";
    document.getElementById("animal-category").textContent = "غير متوفر";
    const babyImg = document.getElementById("baby-animal-image");
    if (babyImg) babyImg.src = "/images/default.png";
    disableAnimalButtonsInSidebar(true);
    return;
  }

  currentIndex = 0;
  updateAnimalContent();
  disableAnimalButtonsInSidebar(false);

  // --- ربط الأزرار والأحداث ---
  if (playSoundBtn)       playSoundBtn.onclick = () => playCurrentAnimalAudio();
  if (playBabySoundBtn)   playBabySoundBtn.onclick = () => playCurrentBabyAnimalAudio();
  if (prevBtn)            prevBtn.onclick = () => showPreviousAnimal();
  if (nextBtn)            nextBtn.onclick = () => showNextAnimal();

  if (toggleDescBtn) {
    const descBox = document.getElementById("animal-description-box");
    toggleDescBtn.onclick = () => {
      if (descBox) descBox.style.display = (descBox.style.display === "none") ? "block" : "none";
    };
  }

  if (toggleDetailsBtn) {
    const detailsBox = document.getElementById("animal-details-section");
    toggleDetailsBtn.onclick = () => {
      if (detailsBox) detailsBox.style.display = (detailsBox.style.display === "none") ? "block" : "none";
    };
  }

  if (toggleBabyImageBtn) {
    const detailsBox = document.getElementById("animal-details-section");
    const babySection = detailsBox ? detailsBox.querySelector(".baby-animal-section") : null;
    toggleBabyImageBtn.onclick = () => {
      if (babySection) babySection.style.display = (babySection.style.display === "none") ? "block" : "none";
    };
  }

  // تغيير اللغة: نعيد تحميل الترجمات والاتجاه والبيانات
  langSelect.onchange = async () => {
    const newLang = langSelect.value;
    await loadLanguage(newLang);
    applyTranslations();
    setDirection(newLang);
    await loadAnimalsGameContent(); // إعادة بناء المحتوى وربط الأزرار
  };

  // تغيير نوع الصوت لا يحتاج إعادة تحميل — فقط يؤثر على الصوت عند التشغيل
  if (voiceSelect) {
    voiceSelect.onchange = () => {
      // لا شيء هنا عمداً؛ التشغيل سيستخدم القيمة الجديدة تلقائياً
    };
  }

  applyTranslations();
}

function updateAnimalContent() {
  const lang = getCurrentLang();
  if (animals.length === 0) return;

  currentAnimalData = animals[currentIndex];

  const animalImage       = document.getElementById("animal-image");
  const animalWord        = document.getElementById("animal-word");
  const animalDescription = document.getElementById("animal-description");
  const animalBaby        = document.getElementById("animal-baby");
  const animalFemale      = document.getElementById("animal-female");
  const animalCategory    = document.getElementById("animal-category");
  const babyAnimalImage   = document.getElementById("baby-animal-image");
  const prevAnimalBtn     = document.getElementById("prev-animal-btn");
  const nextAnimalBtn     = document.getElementById("next-animal-btn");

  const animalName = currentAnimalData.name?.[lang] || "";

  // الصورة
  if (animalImage) {
    animalImage.src = `/images/animals/${currentAnimalData.image}`;
    animalImage.alt = animalName;
    animalImage.onclick = playCurrentAnimalAudio;
    animalImage.classList.add("clickable-image");
  }

  // الاسم (مع تظليل أول حرف)
  if (animalWord) {
    if (animalName) {
      animalWord.innerHTML = `<span class="highlight-first-letter">${animalName[0]}</span>${animalName.slice(1)}`;
    } else {
      animalWord.textContent = "";
    }
    animalWord.onclick = playCurrentAnimalAudio;
    animalWord.classList.add("clickable-text");
  }

  // بقية المعلومات
  if (animalDescription) animalDescription.textContent = currentAnimalData.description?.[lang] || "لا يوجد وصف";
  if (animalBaby)        animalBaby.textContent        = currentAnimalData.baby?.[lang] || "غير معروف";
  if (animalFemale)      animalFemale.textContent      = currentAnimalData.female?.[lang] || "غير معروف";

  if (animalCategory) {
    animalCategory.textContent = Array.isArray(currentAnimalData.classification)
      ? currentAnimalData.classification.map(cat => (typeof cat === "object" && cat !== null && cat[lang]) ? cat[lang] : cat).join(", ")
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

async function fetchAnimals() {
  try {
    const itemsCollectionRef = collection(db, "categories", "animals", "items");
    const q = query(itemsCollectionRef);
    const snapshot = await getDocs(q);
    animals = snapshot.docs.map(doc => doc.data());
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
    recordActivity(JSON.parse(localStorage.getItem("user")), "animals_next");
  }
}

export function showPreviousAnimal() {
  stopCurrentAudio();
  if (currentIndex > 0) {
    currentIndex--;
    updateAnimalContent();
    recordActivity(JSON.parse(localStorage.getItem("user")), "animals_prev");
  }
}

export function playCurrentAnimalAudio() {
  if (!currentAnimalData) {
    console.warn("لا يوجد حيوان معروض لتشغيل الصوت.");
    return;
  }
  const voiceSelect = document.getElementById("voice-select-animal");
  const selectedVoiceType = voiceSelect ? voiceSelect.value : "boy";
  const audioPath = getAnimalAudioPath(currentAnimalData, selectedVoiceType);
  if (audioPath) {
    playAudio(audioPath);
    recordActivity(JSON.parse(localStorage.getItem("user")), "animals_audio");
  }
}

export function playCurrentBabyAnimalAudio() {
  if (!currentAnimalData || !currentAnimalData.baby) {
    console.warn("لا توجد بيانات لاسم ابن الحيوان لتشغيل الصوت.");
    return;
  }
  const voiceSelect = document.getElementById("voice-select-animal");
  const selectedVoiceType = voiceSelect ? voiceSelect.value : "boy";
  const audioPath = getBabyAnimalAudioPath(currentAnimalData.baby, selectedVoiceType);
  if (audioPath) {
    playAudio(audioPath);
    recordActivity(JSON.parse(localStorage.getItem("user")), "animals_baby_audio");
  }
}

function getAnimalAudioPath(data, voiceType) {
  const langFolder = document.getElementById("game-lang-select-animal").value;
  const subjectFolder = "animals";
  const voiceKey = `${voiceType}_${langFolder}`;

  let fileName;
  if (data.voices && data.voices[voiceKey]) {
    fileName = data.voices[voiceKey];
  } else if (data.sound_base) {
    fileName = `${data.sound_base}_${voiceType}_${langFolder}.mp3`;
  } else {
    console.error("❌ لا يوجد مفتاح صوت أو sound_base للحيوان:", data);
    return null;
  }
  return `/audio/${langFolder}/${subjectFolder}/${fileName}`;
}

function getBabyAnimalAudioPath(babyData, voiceType) {
  const langFolder = document.getElementById("game-lang-select-animal").value;
  const subjectFolder = "animals/baby_animals";

  if (babyData.sound && babyData.sound[langFolder] && babyData.sound[langFolder][voiceType]) {
    const fileName = babyData.sound[langFolder][voiceType].split("/").pop();
    return `/audio/${langFolder}/${subjectFolder}/${fileName}`;
  }
  console.error("❌ لا يوجد ملف صوت لابن الحيوان:", babyData);
  return null;
}

function disableAnimalButtonsInSidebar(isDisabled) {
  const ids = [
    "play-sound-btn-animal",
    "play-baby-sound-btn-animal",
    "prev-animal-btn",
    "next-animal-btn",
    "voice-select-animal",
    "game-lang-select-animal",
    "toggle-baby-image-btn",
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = isDisabled;
  });
}
