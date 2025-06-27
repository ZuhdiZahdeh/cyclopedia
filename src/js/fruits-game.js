// public/js/fruits-game.js

// استيراد مرجع قاعدة البيانات من ملف التهيئة المركزي
import { db } from "./firebase-config.js";
// استيراد دوال جلب المستندات والكوليكشن من Firestore
import { getDocs, collection } from "firebase/firestore";
// استيراد دوال اللغة لضبط اللغة والترجمة
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
// استيراد دالة تشغيل الصوت
import { playAudio } from "./audio-handler.js";
// استيراد دالة تسجيل النشاط
import { recordActivity } from "./activity-handler.js";

// متغيرات اللعبة
let fruits = []; // لتخزين بيانات الفواكه
let currentIndex = 0; // الفهرس الحالي للفاكهة المعروضة
let selectedVoice = "boy"; // الصوت الافتراضي للفاكهة (يمكن أن يكون 'boy' أو 'girl')

const currentUser = JSON.parse(localStorage.getItem("user") || "{}"); // جلب المستخدم الحالي (إذا كنت تستخدم نظام تسجيل الدخول)

// دالة لتشغيل محتوى لعبة الفواكه وتحميلها في DOM
export async function loadFruitsGameContent() {
    const mainContentArea = document.querySelector("main.main-content");
    const fruitSidebarControls = document.getElementById("fruit-sidebar-controls"); // المرجع الجديد لعناصر تحكم الفواكه

    if (!mainContentArea || !fruitSidebarControls) {
        console.error("Main content area or fruit sidebar controls not found.");
        return;
    }

    // 1. حقن HTML الخاص بلعبة الفواكه في منطقة المحتوى الرئيسية
    mainContentArea.innerHTML = `
        <div class="game-box">
            <img id="fruit-image" src="" alt="Fruit" />
            <h2 id="fruit-name-ar" class="fruit-name">---</h2>
            <h3 id="fruit-name-en" class="fruit-name-en">---</h3>
            <div class="fruit-description-box">
                <h4>الوصف:</h4>
                <p id="fruit-description-ar" class="fruit-description">---</p>
            </div>
        </div>
    `;

    // 2. حقن HTML الخاص بعناصر التحكم (عنوان البطاقة، الأزرار، اختيار الصوت واللغة) في الشريط الجانبي
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
            <button id="next-fruit-btn">التالي ➡️</button>
            <button id="prev-fruit-btn">⬅️ السابق</button>
        </div>
    `;

    // الحصول على المراجع للعناصر بعد حقنها في DOM
    // العناصر في main-content
    const fruitImage = document.getElementById("fruit-image");
    const fruitNameAr = document.getElementById("fruit-name-ar");
    const fruitNameEn = document.getElementById("fruit-name-en");
    const fruitDescriptionAr = document.getElementById("fruit-description-ar");

    // العناصر في الشريط الجانبي
    const playSoundBtn = document.getElementById("play-sound-btn-fruit");
    const nextFruitBtn = document.getElementById("next-fruit-btn");
    const prevFruitBtn = document.getElementById("prev-fruit-btn"); // زر السابق الجديد
    const voiceSelect = document.getElementById("voice-select-fruit");
    const gameLangSelect = document.getElementById("game-lang-select-fruit");

    // التحقق من وجود جميع العناصر الحيوية
    if (!fruitImage || !fruitNameAr || !playSoundBtn || !nextFruitBtn || !prevFruitBtn || !voiceSelect || !gameLangSelect || !fruitDescriptionAr) {
        console.error("One or more fruit game/control elements not found after content injection. Check IDs.");
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
            // تسجيل النشاط (اختياري، يمكنك تحديد متى تسجل النقاط)
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
        // يمكنك تشغيل الصوت الجديد فورًا إذا أردت عند تغيير الاختيار
        // playAudio(getFruitAudioPath(fruits[currentIndex], selectedVoice));
    });

    gameLangSelect.addEventListener("change", async (event) => {
        const newLang = event.target.value;
        await loadLanguage(newLang); // تحديث اللغة في lang-handler
        applyTranslations(); // إعادة تطبيق الترجمات على عناصر data-i18n
        // لا نحتاج لإعادة جلب الفواكه إذا كانت الترجمات في نفس الكائن
        // فقط أعد عرض الفاكهة الحالية لتطبيق اللغة الجديدة على النصوص
        displayFruit(currentIndex);
        setDirection(newLang); // لضبط اتجاه النص في المتصفح بالكامل
    });
}

// دالة لجلب بيانات الفواكه من Firestore
async function fetchFruits() {
    try {
        // المسار الذي اتفقنا عليه: categories/fruits/items
        const fruitsCollectionRef = collection(db, "categories", "fruits", "items");
        const snapshot = await getDocs(fruitsCollectionRef);
        fruits = snapshot.docs.map(doc => {
            const data = doc.data();
            return data;
        });
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
        fruitNameAr.textContent = fruit.name?.[currentLang] || fruit.name.ar || "---"; // استخدم اللغة الحالية أولاً
        fruitNameEn.textContent = fruit.name.en || "---"; // الاسم الإنجليزي دائمًا

        fruitDescriptionAr.textContent = fruit.description?.[currentLang] || fruit.description.ar || "لا يوجد وصف";

        // تحديث حالة أزرار التنقل
        prevFruitBtn.disabled = (index === 0);
        nextFruitBtn.disabled = (index === fruits.length - 1);

        // إيقاف أي صوت يتم تشغيله حالياً
        stopCurrentAudio(); // استخدم دالة stopCurrentAudio من audio-handler
    }
}

// دالة للحصول على المسار الصحيح لملف الصوت
function getFruitAudioPath(data, voiceType) {
    const fileName = data.voices?.[voiceType]; // على سبيل المثال: 'apple_boy_ar.mp3'
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