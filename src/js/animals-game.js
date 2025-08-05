// === Imports ===
import { db } from "./firebase-config.js";
import { collection, getDocs } from "firebase/firestore";
import { getCurrentLang, applyTranslations } from "./lang-handler.js";
import { stopCurrentAudio, playAudio } from "./audio-handler.js"; // <-- مواءمة الأسماء
import { logActivity } from "./activity-handler.js";

// === حالة اللعبة ===
let animals = [];
let currentIndex = 0;
let currentAnimalData = null;

// مراجع عناصر الشريط الجانبي (يتم التقاطها بعد حقن الـ HTML)
let prevBtn, nextBtn, playSoundBtn, playBabySoundBtn, voiceSelect, langSelect;

// ==============================
// تحميل واجهة لعبة الحيوانات
// ==============================
export async function loadAnimalsGameContent() {
  // أوقف أي صوت يعمل
  stopCurrentAudio();

  // احقن واجهة اللعبة داخل القسم الرئيسي
  const main = document.querySelector("main.main-content");
  if (!main) {
    console.warn("[animals] لم يتم العثور على <main class='main-content'>");
    return;
  }

  // المعرفات موحدة مع القالب
  main.innerHTML = `
    <section id="animals-game" class="topic-container">
      <div class="topic-header">
        <h2 id="animal-word" data-i18n="animals.title">—</h2>
      </div>

      <div class="topic-body">
        <div class="image-area">
          <img id="animal-image" alt="" src="" loading="lazy"/>
        </div>

        <div id="animal-details-section" class="details-area">
          <div class="line"><span data-i18n="animals.classification">—</span>: <span id="animal-classification">—</span></div>
          <div class="line"><span data-i18n="animals.description">—</span>: <span id="animal-description">—</span></div>

          <div class="baby-animal-section">
            <div class="line"><span data-i18n="animals.baby">—</span>: <span id="animal-baby">—</span></div>
            <button id="play-baby-sound-btn-animal" class="btn small" type="button" data-i18n="animals.play_baby_sound">تشغيل صوت الصغير</button>
          </div>

          <div class="female-animal-section">
            <div class="line"><span data-i18n="animals.female">—</span>: <span id="animal-female">—</span></div>
          </div>
        </div>
      </div>
    </section>
  `;

  // بعد الحقن: عناصر الشريط الجانبي
  prevBtn = document.getElementById("prev-animal-btn");
  nextBtn = document.getElementById("next-animal-btn");
  playSoundBtn = document.getElementById("play-sound-btn-animal");
  playBabySoundBtn = document.getElementById("play-baby-sound-btn-animal");
  voiceSelect = document.getElementById("voice-select-animal");        // boy/girl/teacher...
  langSelect = document.getElementById("game-lang-select-animal");     // ar/en/he

  // المستمعات
  if (prevBtn) prevBtn.onclick = showPreviousAnimal;
  if (nextBtn) nextBtn.onclick = showNextAnimal;
  if (playSoundBtn) playSoundBtn.onclick = playCurrentAnimalAudio;
  if (playBabySoundBtn) playBabySoundBtn.onclick = playCurrentBabyAnimalAudio;

  if (voiceSelect) voiceSelect.onchange = () => updateAnimalContent();
  if (langSelect) {
    langSelect.onchange = async () => {
      await reloadAnimalsForLang(langSelect.value);
    };
  }

  // جلب البيانات وبدء العرض
  const lang = getCurrentLang();
  await fetchAnimals(lang);

  currentIndex = 0;
  currentAnimalData = animals.length ? animals[0] : null;

  disableAnimalButtonsInSidebar(animals.length === 0);

  updateAnimalContent();
  applyTranslations();
}

// ==============================
// جلب الحيوانات من Firestore
// ==============================
async function fetchAnimals(lang) {
  animals = [];
  try {
    const colRef = collection(db, "categories", "animals", "items");
    const snap = await getDocs(colRef);
    snap.forEach((doc) => {
      const data = doc.data();
      animals.push({
        id: doc.id,
        ...data,
      });
    });
  } catch (err) {
    console.error("[animals] fetchAnimals error:", err);
  }
}

// إعادة الجلب عند تغيير اللغة
async function reloadAnimalsForLang(lang) {
  stopCurrentAudio();
  await fetchAnimals(lang);
  currentIndex = 0;
  currentAnimalData = animals.length ? animals[0] : null;
  disableAnimalButtonsInSidebar(animals.length === 0);
  updateAnimalContent();
  applyTranslations();
}

// ==============================
// عرض بيانات الحيوان الحالي
// ==============================
function updateAnimalContent() {
  const lang = getCurrentLang();

  const wordEl = document.getElementById("animal-word");
  const imgEl = document.getElementById("animal-image");
  const detailsBox = document.getElementById("animal-details-section");

  const classificationEl = document.getElementById("animal-classification");
  const descEl = document.getElementById("animal-description");
  const babyNameEl = document.getElementById("animal-baby");
  const femaleNameEl = document.getElementById("animal-female");

  if (!wordEl || !imgEl || !detailsBox) return;

  if (!currentAnimalData) {
    wordEl.textContent = "—";
    imgEl.src = "";
    if (classificationEl) classificationEl.textContent = "—";
    if (descEl) descEl.textContent = "—";
    if (babyNameEl) babyNameEl.textContent = "—";
    if (femaleNameEl) femaleNameEl.textContent = "—";
    return;
  }

  const data = currentAnimalData;

  // الاسم
  const displayName =
    (data.name && (data.name[lang] || data.name.ar || data.name.en || data.name.he)) ||
    data.title ||
    data.word ||
    "—";
  wordEl.textContent = displayName;

  // الصورة
  const imagePath =
    data.image_path || (data.images && (data.images.main || data.images[lang])) || "";
  if (imagePath) {
    imgEl.src = imagePath;
    imgEl.alt = displayName;
  } else {
    imgEl.removeAttribute("src");
    imgEl.alt = "";
  }

  // التصنيف والوصف
  if (classificationEl) {
    classificationEl.textContent =
      (data.classification && (data.classification[lang] || data.classification.ar)) || "—";
  }
  if (descEl) {
    descEl.textContent =
      (data.description && (data.description[lang] || data.description.ar)) || "—";
  }

  // بيانات الابن والأنثى
  const babyData = data.baby || {};
  const femaleData = data.female || {};

  if (babyNameEl) {
    const babyName =
      (babyData.name && (babyData.name[lang] || babyData.name.ar || babyData.name.en)) || "—";
    babyNameEl.textContent = babyName;
  }
  if (femaleNameEl) {
    const femaleName =
      (femaleData.name && (femaleData.name[lang] || femaleData.name.ar || femaleData.name.en)) ||
      "—";
    femaleNameEl.textContent = femaleName;
  }
}

// ==============================
// الصوت: الحيوان الحالي
// ==============================
function playCurrentAnimalAudio() {
  if (!currentAnimalData) return;

  const lang = getCurrentLang();
  const voiceType = (voiceSelect && voiceSelect.value) || "boy"; // boy/girl/teacher...

  const audioPath = getAnimalAudioPath(currentAnimalData, lang, voiceType);
  if (!audioPath) return;

  stopCurrentAudio();
  playAudio(audioPath);
  logActivity("animals", "play_sound", {
    id: currentAnimalData.id,
    voiceType,
    lang,
  });
}

// ==============================
// الصوت: ابن الحيوان
// ==============================
function playCurrentBabyAnimalAudio() {
  if (!currentAnimalData || !currentAnimalData.baby) return;

  const lang = getCurrentLang();
  const voiceType = (voiceSelect && voiceSelect.value) || "boy";

  const babyAudioPath = getBabyAnimalAudioPath(currentAnimalData.baby, lang, voiceType);
  if (!babyAudioPath) return;

  stopCurrentAudio();
  playAudio(babyAudioPath);
  logActivity("animals", "play_baby_sound", {
    id: currentAnimalData.id,
    voiceType,
    lang,
  });
}

// ==============================
// تنقّل: التالي/السابق
// ==============================
function showNextAnimal() {
  if (!animals.length) return;
  stopCurrentAudio();

  currentIndex = (currentIndex + 1) % animals.length;
  currentAnimalData = animals[currentIndex];

  updateAnimalContent();
  logActivity("animals", "next", { index: currentIndex });
}

function showPreviousAnimal() {
  if (!animals.length) return;
  stopCurrentAudio();

  currentIndex = (currentIndex - 1 + animals.length) % animals.length;
  currentAnimalData = animals[currentIndex];

  updateAnimalContent();
  logActivity("animals", "prev", { index: currentIndex });
}

// ==============================
// مسارات الصوت
// ==============================
function getAnimalAudioPath(data, lang, voiceType) {
  const key = `${voiceType}_${lang}`;
  if (data.voices && data.voices[key]) {
    return data.voices[key];
  }

  const base = data.sound_base || (data.sound && data.sound.base);
  if (base) {
    return `audio/${lang}/animals/${base}_${voiceType}_${lang}.mp3`;
  }

  if (data.sound && data.sound[lang] && data.sound[lang][voiceType]) {
    return data.sound[lang][voiceType];
  }

  return null;
}

function getBabyAnimalAudioPath(babyData, lang, voiceType) {
  const key = `${voiceType}_${lang}`;
  if (babyData.voices && babyData.voices[key]) {
    return babyData.voices[key];
  }

  const base = babyData.sound_base || (babyData.sound && babyData.sound.base);
  if (base) {
    return `audio/${lang}/animals/${base}_${voiceType}_${lang}.mp3`;
  }

  if (babyData.sound && babyData.sound[lang] && babyData.sound[lang][voiceType]) {
    return babyData.sound[lang][voiceType];
  }

  return null;
}

// ==============================
// تفعيل/تعطيل عناصر الشريط الجانبي
// ==============================
function disableAnimalButtonsInSidebar(disabled) {
  [
    prevBtn,
    nextBtn,
    playSoundBtn,
    playBabySoundBtn,
    voiceSelect,
    langSelect,
  ].forEach((el) => {
    if (el) el.disabled = !!disabled;
  });
}
