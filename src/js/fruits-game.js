// public/js/fruits-game.js

// استيراد مرجع قاعدة البيانات من ملف التهيئة المركزي
import { db } from "./firebase-config.js";
// استيراد دوال جلب المستندات والكوليكشن من Firestore
import { getDocs, collection } from "firebase/firestore";
// استيراد دوال اللغة لضبط اللغة والترجمة
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
// استيراد دالة تشغيل الصوت
import { playAudio, stopCurrentAudio } from "./audio-handler.js"; // تأكد من استيراد stopCurrentAudio
// استيراد دالة تسجيل النشاط
import { recordActivity } from "./activity-handler.js";

// متغيرات اللعبة
let fruits = []; // لتخزين بيانات الفواكه
let currentIndex = 0; // الفهرس الحالي للفاكهة المعروضة
let selectedVoice = "boy"; // الصوت الافتراضي للفاكهة (يمكن أن يكون 'boy' أو 'girl')

const currentUser = JSON.parse(localStorage.getItem("user") || "{}"); // جلب المستخدم الحالي (إذا كنت تستخدم نظام تسجيل الدخول)

// تعريف المتغيرات التي ستحمل مراجع عناصر DOM على نطاق أوسع لتكون متاحة لدالة displayFruit
let fruitImage, fruitNameAr, fruitNameEn, fruitDescriptionAr;
let playSoundBtn, nextFruitBtn, prevFruitBtn, voiceSelect, gameLangSelect;

// دالة لتشغيل محتوى لعبة الفواكه وتحميلها في DOM
export async function loadFruitsGameContent() {
    const mainContentArea = document.querySelector("main.main-content");
    const fruitSidebarControls = document.getElementById("fruit-sidebar-controls");

    if (!mainContentArea || !fruitSidebarControls) {
        console.error("Main content area or fruit sidebar controls not found.");
        return;
    }

    // 1. حقن HTML الخاص بلعبة الفواكه في منطقة المحتوى الرئيسية
    mainContentArea.innerHTML = `
        <div class="game-box">
            <h2 id="fruit-name-ar" class="fruit-name">---</h2>
            <img id="fruit-image" src="" alt="Fruit" />
            <h3 id="fruit-name-en" class="fruit-name-en">---</h3>
            <div class="fruit-description-box">
                <h4>الوصف:</h4>
                <p id="fruit-description-ar" class="fruit-description">---</p>
            </div>
            <div class="navigation-buttons"> <button id="prev-fruit-btn">⬅️ السابق</button>
                <button id="next-fruit-btn">التالي ➡️</button>
            </div>
        </div>
    `;

    // 2. حقن HTML الخاص بعناصر التحكم في الشريط الجانبي
    fruitSidebarControls.innerHTML = `
        <h3 style="text-align: center;">🍎 تعرف على الفواكه</h3>
        <div class="sidebar-game-controls">
            <div class="language-selection" style="margin-bottom: 1rem;">
                <label for="game-lang-select-fruit">اللغة:</label>
                <select id="game-lang-select-fruit">
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                    <option value="he">עברית</option>
                </select>
            </div>
            <div class="voice-selection" style="margin-bottom: 1rem;">
                <label for="voice-select-fruit">الصوت:</label>
                <select id="voice-select-fruit">
                    <option value="boy">صوت ولد</option>
                    <option value="girl">صوت بنت</option>
                </select>
            </div>
            <button id="play-sound-btn-fruit">🔊 استمع</button>
        </div>
    `;

    // ====== الحصول على المراجع للعناصر بعد حقنها في DOM ======
    // العناصر في main-content
    fruitImage = document.getElementById("fruit-image");
    fruitNameAr = document.getElementById("fruit-name-ar");
    fruitNameEn = document.getElementById("fruit-name-en");
    fruitDescriptionAr = document.getElementById("fruit-description-ar");

    // العناصر في الشريط الجانبي
    playSoundBtn = document.getElementById("play-sound-btn-fruit");
    voiceSelect = document.getElementById("voice-select-fruit");
    gameLangSelect = document.getElementById("game-lang-select-fruit");
    
    // أزرار التنقل التي أصبحت داخل main-content
    nextFruitBtn = document.getElementById("next-fruit-btn");
    prevFruitBtn = document.getElementById("prev-fruit-btn");

    // التحقق من وجود جميع العناصر الحيوية
    if (!fruitImage || !fruitNameAr || !playSoundBtn || !nextFruitBtn || !prevFruitBtn || !voiceSelect || !gameLangSelect || !fruitDescriptionAr) {
        console.error("One or more fruit game/control elements not found after content injection. Check IDs. Re-running display functions before elements exist.");
        disableFruitButtons(true);
        return;
    }

    // تعيين اللغة الافتراضية
    gameLangSelect.value = currentLang;

    // جلب البيانات من Firestore
    await fetchFruits();

    // التحقق مما إذا تم جلب أي فواكه
    if (fruits.length === 0) {
        console.warn("No fruits found for this category. Please check Firestore data or rules.");
        fruitImage.src = "/images/default.png"; // صورة افتراضية
        fruitNameAr.textContent = "لا توجد بيانات";
        fruitNameEn.textContent = "";
        fruitDescriptionAr.textContent = "يرجى إضافة بيانات الفواكه إلى Firestore.";
        disableFruitButtons(true);
        return;
    }

    // عرض الفاكهة الأولى
    displayFruit(currentIndex);

    // ربط معالجات الأحداث بالأزرار والقائمة المنسدلة
    nextFruitBtn.addEventListener("click", async () => {
        if (currentIndex < fruits.length - 1) {
            currentIndex++;
            displayFruit(currentIndex);
            if (currentUser && currentUser.uid) {
                await recordActivity(currentUser, "fruits");
            }
        }
    });

    prevFruitBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            displayFruit(currentIndex);
        }
    });

    playSoundBtn.addEventListener("click", () => {
        const soundPath = getFruitAudioPath(fruits[currentIndex], selectedVoice);
        if (soundPath) {
            playAudio(soundPath);
        } else {
            console.warn(`No ${selectedVoice} sound available for current fruit.`);
        }
    });

    voiceSelect.addEventListener("change", (event) => {
        selectedVoice = event.target.value;
    });

    gameLangSelect.addEventListener("change", async (event) => {
        const newLang = event.target.value;
        await loadLanguage(newLang);
        applyTranslations();
        displayFruit(currentIndex); // أعد عرض الفاكهة الحالية لتطبيق اللغة الجديدة
        setDirection(newLang); // لضبط اتجاه النص في المتصفح بالكامل
    });
}

// دالة لجلب بيانات الفواكه من Firestore
async function fetchFruits() {
    try {
        const fruitsCollectionRef = collection(db, "categories", "fruits", "items");
        const snapshot = await getDocs(fruitsCollectionRef);
        fruits = snapshot.docs.map(doc => doc.data());
        console.log("Fetched fruits:", fruits);
    } catch (error) {
        console.error("Error fetching fruits from Firestore:", error);
        fruits = [];
    }
}

// دالة لعرض الفاكهة بناءً على الفهرس
function displayFruit(index) {
    if (index >= 0 && index < fruits.length) {
        const fruit = fruits[index];
        // تحديث مسار الصورة ليطابق هيكلية Firestore
        fruitImage.src = `/images/ar/fruits/${fruit.image}`;
        fruitImage.alt = fruit.name.en;
        
        // عرض الاسم والوصف باللغة الحالية
        fruitNameAr.textContent = fruit.name?.[currentLang] || fruit.name.ar || "---";
        fruitNameEn.textContent = fruit.name.en || "---";

        fruitDescriptionAr.textContent = fruit.description?.[currentLang] || fruit.description.ar || "لا يوجد وصف";

        // تحديث حالة أزرار التنقل
        prevFruitBtn.disabled = (index === 0);
        nextFruitBtn.disabled = (index === fruits.length - 1);

        stopCurrentAudio(); // إيقاف أي صوت يتم تشغيله حالياً
    }
}

// دالة للحصول على المسار الصحيح لملف الصوت
function getFruitAudioPath(data, voiceType) {
    // التأكد من أن حقل voices موجود وأن نوع الصوت المطلوب موجود
    const fileName = data.voices?.[voiceType];
    if (fileName) {
        return `/audio/ar/fruits/${fileName}`; // المسار الكامل لملفات الصوت
    }
    return null;
}

// وظائف المساعدة للأزرار (تعطيل)
function disableFruitButtons(isDisabled) {
    const btns = [
        document.getElementById("play-sound-btn-fruit"),
        document.getElementById("next-fruit-btn"),
        document.getElementById("prev-fruit-btn"),
        document.getElementById("voice-select-fruit"),
        document.getElementById("game-lang-select-fruit")
    ];
    btns.forEach(btn => {
        if (btn) btn.disabled = isDisabled;
    });
}