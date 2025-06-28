// src/js/fruits-game.js (النسخة النهائية)

import { db } from "./firebase-config.js";
import { getDocs, collection } from "firebase/firestore";
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let fruits = [];
let currentIndex = 0;
let selectedVoice = "boy";

const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

let fruitImage, fruitNameAr, fruitNameEn, fruitDescriptionAr;
let playSoundBtn, nextFruitBtn, prevFruitBtn, voiceSelect, gameLangSelect;

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
            <h2 id="fruit-name-ar" class="item-main-name">---</h2> <img id="fruit-image" src="" alt="Fruit" />
            <h3 id="fruit-name-en" class="fruit-name-en">---</h3>
            <div class="info-box"> <h4>الوصف:</h4>
                <p id="fruit-description-ar" class="fruit-description">---</p>
            </div>
            <div class="navigation-buttons">
                <button id="prev-fruit-btn">⬅️ السابق</button>
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

    // الحصول على المراجع للعناصر بعد حقنها في DOM
    fruitImage = document.getElementById("fruit-image");
    fruitNameAr = document.getElementById("fruit-name-ar");
    fruitNameEn = document.getElementById("fruit-name-en");
    fruitDescriptionAr = document.getElementById("fruit-description-ar");

    playSoundBtn = document.getElementById("play-sound-btn-fruit");
    voiceSelect = document.getElementById("voice-select-fruit");
    gameLangSelect = document.getElementById("game-lang-select-fruit");
    
    nextFruitBtn = document.getElementById("next-fruit-btn");
    prevFruitBtn = document.getElementById("prev-fruit-btn");

    if (!fruitImage || !fruitNameAr || !playSoundBtn || !nextFruitBtn || !prevFruitBtn || !voiceSelect || !gameLangSelect || !fruitDescriptionAr) {
        console.error("One or more fruit game/control elements not found after content injection. Check IDs. Re-running display functions before elements exist.");
        disableFruitButtons(true);
        return;
    }

    gameLangSelect.value = currentLang;

    await fetchFruits();

    if (fruits.length === 0) {
        console.warn("No fruits found for this category. Please check Firestore data or rules.");
        fruitImage.src = "/images/default.png";
        fruitNameAr.textContent = "لا توجد بيانات";
        fruitNameEn.textContent = "";
        fruitDescriptionAr.textContent = "يرجى إضافة بيانات الفواكه إلى Firestore.";
        disableFruitButtons(true);
        return;
    }

    displayFruit(currentIndex);

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
        displayFruit(currentIndex);
        setDirection(newLang);
    });
}

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

function displayFruit(index) {
    if (index >= 0 && index < fruits.length) {
        const fruit = fruits[index];
        fruitImage.src = `/images/fruits/${fruit.image}`; // تأكد من أن fruit.image تحتوي على اسم الملف فقط (مثال: 'apple_image.png')
        fruitImage.alt = fruit.name.en;
        
        fruitNameAr.textContent = fruit.name?.[currentLang] || fruit.name.ar || "---";
        fruitNameEn.textContent = fruit.name.en || "---";

        fruitDescriptionAr.textContent = fruit.description?.[currentLang] || fruit.description.ar || "لا يوجد وصف";

        prevFruitBtn.disabled = (index === 0);
        nextFruitBtn.disabled = (index === fruits.length - 1);

        stopCurrentAudio();
    }
}

function getFruitAudioPath(data, voiceType) {
    const fileName = data.voices?.[voiceType];
    if (fileName) {
        // تأكد أن fileName يحتوي على اسم الملف فقط (مثال: 'apple_boy_ar.mp3')
        return `/audio/ar/fruits/${fileName}`;
    }
    return null;
}

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