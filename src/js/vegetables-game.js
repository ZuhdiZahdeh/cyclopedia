// public/js/vegetables-game.js

import { db } from "./firebase-config.js";
import { getDocs, collection } from "firebase/firestore";
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js"; // لتسجيل النشاط

let vegetables = [];
let currentIndex = 0;
let selectedVoice = "teacher"; // افتراضيًا صوت المعلم

const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

export async function loadVegetablesGameContent() {
  const mainContentArea = document.querySelector("main.main-content");
  const vegetableSidebarControls = document.getElementById("vegetable-sidebar-controls");

  if (!mainContentArea || !vegetableSidebarControls) {
    console.error("Main content area or vegetable sidebar controls not found.");
    return;
  }

  // 1. حقن HTML الخاص بلعبة الخضروات في منطقة المحتوى الرئيسية
  // سنستخدم نفس بنية .game-box و .item-main-name من common-components-subjects.css
  mainContentArea.innerHTML = `
    <div class="game-box">
      <h2 id="vegetable-word" class="item-main-name">---</h2>
      <img id="vegetable-image" src="" alt="vegetable" />
      
      <div class="vegetable-details-section info-box"> <h3>حقائق عن الخضروات:</h3>
        <ul id="vegetable-details-list">
          <li><strong>الصنف:</strong> <span id="vegetable-type">---</span></li>
          <li><strong>الفوائد:</strong> <span id="vegetable-benefits">---</span></li>
        </ul>
        <div class="vegetable-description-box info-box"> <h4>الوصف:</h4>
          <p id="vegetable-description">---</p>
        </div>
      </div>
      <div class="navigation-buttons">
        <button id="prev-vegetable-btn">⬅️ السابق</button>
        <button id="next-vegetable-btn">التالي ➡️</button>
      </div>
    </div>
  `;

  // 2. حقن HTML الخاص بعناصر التحكم في الشريط الجانبي
  vegetableSidebarControls.innerHTML = `
    <h3 style="text-align: center;">🥦 تعرف على الخضروات</h3>
    <div class="sidebar-game-controls">
      <div class="language-selection" style="margin-bottom: 1rem;">
        <label for="game-lang-select-vegetable">اللغة:</label>
        <select id="game-lang-select-vegetable">
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="he">עברית</option>
        </select>
      </div>
      <div class="voice-selection" style="margin-bottom: 1rem;">
        <label for="voice-select-vegetable">الصوت:</label>
        <select id="voice-select-vegetable">
          <option value="teacher">المعلم</option>
          <option value="boy">صوت ولد</option>
          <option value="girl">صوت بنت</option>
          <option value="child">صوت طفل</option>
        </select>
      </div>
      <button id="play-sound-btn-vegetable">🔊 استمع</button>
    </div>
  `;

  // 3. الحصول على المراجع للعناصر بعد حقنها في DOM
  // العناصر في main-content
  const vegetableImage = document.getElementById("vegetable-image");
  const vegetableWord = document.getElementById("vegetable-word");
  const vegetableType = document.getElementById("vegetable-type"); // حقل جديد: نوع الخضروات (جذرية، ورقية، فاكهة)
  const vegetableBenefits = document.getElementById("vegetable-benefits"); // حقل جديد: الفوائد
  const vegetableDescription = document.getElementById("vegetable-description");

  // العناصر في الشريط الجانبي
  const playSoundBtn = document.getElementById("play-sound-btn-vegetable");
  const voiceSelect = document.getElementById("voice-select-vegetable");
  const gameLangSelect = document.getElementById("game-lang-select-vegetable");
  
  // أزرار التنقل التي أصبحت داخل main-content
  const nextVegetableBtn = document.getElementById("next-vegetable-btn");
  const prevVegetableBtn = document.getElementById("prev-vegetable-btn");

  // التحقق من وجود جميع العناصر بعد الحقن
  if (!vegetableImage || !vegetableWord || !playSoundBtn || !nextVegetableBtn || !prevVegetableBtn || !voiceSelect || !gameLangSelect || !vegetableType || !vegetableBenefits || !vegetableDescription) {
    console.error("One or more vegetable game/control elements not found after content injection. Check IDs.");
    disableVegetableButtons(true);
    return;
  }

  gameLangSelect.value = currentLang;

  await fetchVegetables();

  if (vegetables.length === 0) {
    console.warn("No vegetables found. Please check Firestore data or rules.");
    vegetableImage.src = "/images/default.png";
    vegetableWord.textContent = "لا توجد بيانات";
    vegetableDescription.textContent = "لا يوجد وصف متوفر.";
    vegetableType.textContent = "غير متوفر";
    vegetableBenefits.textContent = "غير متوفر";
    disableVegetableButtons(true);
    return;
  }

  showVegetable(currentIndex); // عرض أول خضروات

  // 4. معالجات الأحداث (Event Listeners)
  nextVegetableBtn.addEventListener("click", async () => {
    if (currentIndex < vegetables.length - 1) {
        currentIndex++;
        showVegetable(currentIndex);
        if (currentUser && currentUser.uid) {
            await recordActivity(currentUser, "vegetables"); // تسجيل النشاط
        }
    }
  });

  prevVegetableBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        showVegetable(currentIndex);
    }
  });

  playSoundBtn.addEventListener("click", () => {
    const soundPath = getAudioPath(vegetables[currentIndex], selectedVoice);
    if (soundPath) {
      playAudio(soundPath);
    } else {
      console.warn(`No ${selectedVoice} sound available for current vegetable.`);
    }
  });

  voiceSelect.addEventListener("change", (event) => {
    selectedVoice = event.target.value;
  });

  gameLangSelect.addEventListener("change", async (event) => {
    const newLang = event.target.value;
    await loadLanguage(newLang);
    applyTranslations(); // تطبيق الترجمات على جميع العناصر
    await fetchVegetables(); // إعادة جلب الخضروات باللغة الجديدة
    currentIndex = 0; // العودة للعنصر الأول بعد تغيير اللغة
    showVegetable(currentIndex);
    setDirection(newLang); // ضبط اتجاه النص
  });
}

// 5. جلب البيانات من Firestore
async function fetchVegetables() {
  try {
    const itemsCollectionRef = collection(db, "categories", "vegetables", "items");
    const snapshot = await getDocs(itemsCollectionRef);
    vegetables = snapshot.docs.map(doc => doc.data());
    console.log("Fetched vegetables:", vegetables);
  } catch (error) {
    console.error("Error fetching vegetables from Firestore:", error);
    vegetables = []; // مسح البيانات في حالة الخطأ
  }
}

// 6. عرض بيانات الخضروات في البطاقة
function showVegetable(index) {
  if (index >= 0 && index < vegetables.length) {
    const data = vegetables[index];
    
    // الحصول على الاسم باللغة الحالية، مع fallback للإنجليزية ثم لـ "---"
    const name = data.name?.[currentLang] || data.name?.en || "---"; 
    const imgSrc = `/images/vegetables/${data.image}`; // مسار الصورة

    document.getElementById("vegetable-image").src = imgSrc;
    document.getElementById("vegetable-image").alt = name;
    document.getElementById("vegetable-word").textContent = name;

    // عرض التفاصيل الإضافية (تأكد من مطابقتها لهيكل بيانات Firestore)
    document.getElementById("vegetable-type").textContent = data.type?.[currentLang] || "غير متوفر"; // حقل "نوع" جديد
    document.getElementById("vegetable-benefits").textContent = data.benefits?.[currentLang] || "غير متوفر"; // حقل "فوائد" جديد
    
    document.getElementById("vegetable-description").textContent = data.description?.[currentLang] || "لا يوجد وصف";

    // تحديث حالة أزرار التنقل (enable/disable)
    document.getElementById("prev-vegetable-btn").disabled = (index === 0);
    document.getElementById("next-vegetable-btn").disabled = (index === vegetables.length - 1);

    stopCurrentAudio(); // إيقاف أي صوت يتم تشغيله حاليًا
  }
}

// 7. الحصول على مسار ملف الصوت
function getAudioPath(data, voiceType) {
  const fileName = data.voices?.[voiceType]; // الحصول على اسم الملف بناءً على نوع الصوت
  if (fileName) {
    return `/audio/${currentLang}/vegetables/${fileName}`; // بناء المسار الكامل
  }
  return null;
}

// 8. لتعطيل/تفعيل الأزرار (لتحسين تجربة المستخدم)
function disableVegetableButtons(isDisabled) {
    const btns = [
        document.getElementById("play-sound-btn-vegetable"),
        document.getElementById("next-vegetable-btn"),
        document.getElementById("prev-vegetable-btn"),
        document.getElementById("voice-select-vegetable"),
        document.getElementById("game-lang-select-vegetable")
    ];
    btns.forEach(btn => {
        if (btn) btn.disabled = isDisabled;
    });
}