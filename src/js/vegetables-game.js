// src/js/vegetables-game.js

import { db } from "./firebase-config.js";
import { getDocs, collection, query } from "firebase/firestore";
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let vegetables = [];
let currentIndex = 0;
let currentVegetableData = null;


export async function loadVegetablesGameContent() {
  stopCurrentAudio();
  const mainContentArea = document.querySelector("main.main-content");
  const vegetableSidebarControls = document.getElementById("vegetable-sidebar-controls");

  if (!mainContentArea || !vegetableSidebarControls) {
    console.error("Main content area or vegetable sidebar controls not found.");
    return;
  }

  mainContentArea.innerHTML = `
    <div class="game-box">
      <h2 id="vegetable-word" class="item-main-name">---</h2>
      <img id="vegetable-image" src="" alt="vegetable" />
      
      <div class="vegetable-details-section info-box">
        <h3>حقائق عن الخضروات:</h3>
        <ul id="vegetable-details-list">
          <li><strong>الصنف:</strong> <span id="vegetable-type">---</span></li>
          <li><strong>الفوائد:</strong> <span id="vegetable-benefits">---</span></li>
        </ul>
      </div>

      <div class="navigation-buttons">
        <button id="prev-vegetable-btn" class="nav-button">السابق</button>
        <button id="next-vegetable-btn" class="nav-button">التالي</button>
      </div>
    </div>
  `;

  vegetableSidebarControls.innerHTML = `
    <div class="sidebar-game-controls">
        <div class="control-group">
            <label for="game-lang-select-vegetable">لغة اللعبة:</label>
            <select id="game-lang-select-vegetable"></select>
        </div>
        <div class="control-group">
            <label for="voice-select-vegetable">نوع الصوت:</label>
            <select id="voice-select-vegetable"></select>
        </div>
        <button id="play-sound-btn-vegetable" class="action-button">تشغيل الصوت</button>
        <button id="view-all-vegetables-btn" class="action-button">عرض كل الخضروات</button>
    </div>
  `;


  setupGameControls(
    document.getElementById('game-lang-select-vegetable'),
    document.getElementById('voice-select-vegetable'),
    document.getElementById('play-sound-btn-vegetable'),
    document.getElementById('next-vegetable-btn'),
    document.getElementById('prev-vegetable-btn'),
    loadVegetablesGameContent, // دالة تحميل المحتوى للاستدعاء عند تغيير اللغة
    playCurrentVegetableAudio, // دالة تشغيل الصوت
    showPreviousVegetable, // دالة السابق
    showNextVegetable // دالة التالي
  );

  try {
    const q = query(collection(db, "vegetables"));
    const querySnapshot = await getDocs(q);
    vegetables = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (vegetables.length > 0) {
      currentIndex = 0;
      displayVegetable(vegetables[currentIndex]);
      disableVegetableButtonsInSidebar(false);
    } else {
      mainContentArea.innerHTML = `<p class="info-message">لا توجد خضروات متاحة حالياً.</p>`;
      disableVegetableButtonsInSidebar(true);
    }
  } catch (error) {
    console.error("Error loading vegetables data:", error);
    mainContentArea.innerHTML = `<p class="error-message">حدث خطأ أثناء تحميل بيانات الخضروات. يرجى المحاولة مرة أخرى لاحقاً.</p>`;
    disableVegetableButtonsInSidebar(true);
  }
}

function displayVegetable(vegetableData) {
    currentVegetableData = vegetableData;
    const vegetableWord = document.getElementById("vegetable-word");
    const vegetableImage = document.getElementById("vegetable-image");
    const vegetableType = document.getElementById("vegetable-type");
    const vegetableBenefits = document.getElementById("vegetable-benefits");

    if (vegetableWord) vegetableWord.innerText = vegetableData.name?.[currentLang] || "---";
    if (vegetableImage) vegetableImage.src = vegetableData.image || "";
    if (vegetableImage) vegetableImage.alt = vegetableData.name?.en || "Vegetable image";
    if (vegetableType) vegetableType.innerText = vegetableData.type?.[currentLang] || "---";
    if (vegetableBenefits) vegetableBenefits.innerText = vegetableData.benefits?.[currentLang] || "---";

    const nextBtn = document.getElementById("next-vegetable-btn");
    const prevBtn = document.getElementById("prev-vegetable-btn");
    if (nextBtn) nextBtn.disabled = (currentIndex >= vegetables.length - 1);
    if (prevBtn) prevBtn.disabled = (currentIndex <= 0);

    applyTranslations();
}

function showNextVegetable() {
    stopCurrentAudio();
    if (currentIndex < vegetables.length - 1) {
        currentIndex++;
        displayVegetable(vegetables[currentIndex]);
    }
}

function showPreviousVegetable() {
    stopCurrentAudio();
    if (currentIndex > 0) {
        currentIndex--;
        displayVegetable(vegetables[currentIndex]);
    }
}

function playCurrentVegetableAudio() {
    if (currentVegetableData) {
        const voiceType = document.getElementById('voice-select-vegetable').value;
        const audioPath = getVegetableAudioPath(currentVegetableData, voiceType);
        if (audioPath) {
            playAudio(audioPath);
            recordActivity(JSON.parse(localStorage.getItem("user")), "vegetables");
        }
    } else {
        console.warn('لا توجد خضروات معروضة لتشغيل الصوت.');
    }
}

function getVegetableAudioPath(data, voiceType) {
  const langFolder = document.getElementById('game-lang-select-vegetable').value;
  const subjectFolder = 'vegetables';

  let fileName;
  // الأولوية لحقل voices المحدد بالكامل (مثال: carrot_boy_en.mp3)
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

function disableVegetableButtonsInSidebar(isDisabled) {
    const playSoundBtn = document.getElementById("play-sound-btn-vegetable");
    const nextBtn = document.getElementById("next-vegetable-btn");
    const prevBtn = document.getElementById("prev-vegetable-btn");
    const voiceSelect = document.getElementById("voice-select-vegetable");
    const langSelect = document.getElementById("game-lang-select-vegetable");

    if (playSoundBtn) playSoundBtn.disabled = isDisabled;
    if (nextBtn) nextBtn.disabled = isDisabled;
    if (prevBtn) prevBtn.disabled = isDisabled;
    if (voiceSelect) voiceSelect.disabled = isDisabled;
    if (langSelect) langSelect.disabled = isDisabled;
}

// دالة مساعدة لتهيئة عناصر التحكم (تم استيرادها أو نسخها من مكان مركزي إذا كانت مشتركة)
function setupGameControls(langSelect, voiceSelect, playSoundBtn, nextBtn, prevBtn, loadContentFunc, playAudioFunc, showPrevFunc, showNextFunc) {
    if (langSelect && langSelect.options.length === 0) {
        ['ar', 'en', 'he'].forEach(langCode => {
            const option = document.createElement('option');
            option.value = langCode;
            option.textContent = { 'ar': 'العربية', 'en': 'English', 'he': 'עברית' }[langCode];
            langSelect.appendChild(option);
        });
        langSelect.value = currentLang;
    } else if (langSelect) {
        langSelect.value = currentLang;
    }

    if (voiceSelect && voiceSelect.options.length === 0) {
        ['teacher', 'boy', 'girl', 'child'].forEach(voiceType => {
            const option = document.createElement('option');
            option.value = voiceType;
            option.textContent = { 'teacher': 'المعلم', 'boy': 'صوت ولد', 'girl': 'صوت بنت', 'child': 'صوت طفل' }[voiceType];
            voiceSelect.appendChild(option);
        });
        voiceSelect.value = 'teacher';
    }

    langSelect.onchange = async () => {
        const newLang = langSelect.value;
        await loadLanguage(newLang);
        applyTranslations();
        setDirection(newLang);
        await loadContentFunc();
    };

    if (playSoundBtn) playSoundBtn.onclick = () => {
        playAudioFunc();
    };

    if (prevBtn) prevBtn.onclick = () => {
        showPrevFunc();
    };

    if (nextBtn) nextBtn.onclick = () => {
        showNextFunc();
    };
}