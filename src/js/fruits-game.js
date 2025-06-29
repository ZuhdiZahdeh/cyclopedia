// src/js/fruits-game.js

import { db } from "./firebase-config.js";
import { getDocs, collection, query } from "firebase/firestore"; // أضف query
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let fruits = [];
let currentIndex = 0;
let currentFruitData = null;

export async function loadFruitsGameContent() {
    stopCurrentAudio();
    const mainContentArea = document.querySelector("main.main-content");
    const fruitSidebarControls = document.getElementById("fruit-sidebar-controls");

    if (!mainContentArea || !fruitSidebarControls) {
        console.error("Main content area or fruit sidebar controls not found.");
        return;
    }

    // 1. حقن HTML الخاص بلعبة الفواكه في منطقة المحتوى الرئيسية (بدون أزرار التنقل)
    mainContentArea.innerHTML = `
        <div class="game-box">
            <h2 id="fruit-name-ar" class="item-main-name">---</h2>
            <img id="fruit-image" src="" alt="Fruit" />
            <h3 id="fruit-name-en" class="fruit-name-en">---</h3>
            <div class="info-box"> <h4>الوصف:</h4>
                <p id="fruit-description-ar" class="fruit-description">---</p>
            </div>
            </div>
    `;

    const fruitImage = document.getElementById("fruit-image");
    const fruitNameAr = document.getElementById("fruit-name-ar");
    const fruitNameEn = document.getElementById("fruit-name-en");
    const fruitDescriptionAr = document.getElementById("fruit-description-ar");

    // الحصول على مرجع select اللغة من الشريط الجانبي
    const gameLangSelect = document.getElementById('game-lang-select-fruit');
    if (!gameLangSelect) {
        console.error("Language select for fruit game not found.");
        return;
    }

    await fetchFruits(gameLangSelect.value);

    if (fruits.length === 0) {
        console.warn("No fruits found for this category. Please check Firestore data or rules.");
        if (fruitImage) fruitImage.src = "/images/default.png";
        if (fruitNameAr) fruitNameAr.textContent = "لا توجد بيانات";
        if (fruitNameEn) fruitNameEn.textContent = "";
        if (fruitDescriptionAr) fruitDescriptionAr.textContent = "يرجى إضافة بيانات الفواكه إلى Firestore.";
        disableFruitButtonsInSidebar(true);
        return;
    }

    currentIndex = 0;
    updateFruitContent();
    disableFruitButtonsInSidebar(false);
}

function updateFruitContent() {
    if (fruits.length === 0) return;

    currentFruitData = fruits[currentIndex];

    const fruitImage = document.getElementById("fruit-image");
    const fruitNameAr = document.getElementById("fruit-name-ar");
    const fruitNameEn = document.getElementById("fruit-name-en");
    const fruitDescriptionAr = document.getElementById("fruit-description-ar");

    const prevFruitBtn = document.getElementById('prev-fruit-btn');
    const nextFruitBtn = document.getElementById('next-fruit-btn');

    if (fruitImage) fruitImage.src = `/images/fruits/${currentFruitData.image}`;
    if (fruitImage) fruitImage.alt = currentFruitData.name.en;

    if (fruitNameAr) fruitNameAr.textContent = currentFruitData.name?.[currentLang] || currentFruitData.name.ar || "---";
    if (fruitNameEn) fruitNameEn.textContent = currentFruitData.name.en || "---";

    if (fruitDescriptionAr) fruitDescriptionAr.textContent = currentFruitData.description?.[currentLang] || currentFruitData.description.ar || "لا يوجد وصف";

    if (prevFruitBtn) prevFruitBtn.disabled = (currentIndex === 0);
    if (nextFruitBtn) nextFruitBtn.disabled = (currentIndex === fruits.length - 1);

    stopCurrentAudio();
}

async function fetchFruits(lang) {
    try {
        const fruitsCollectionRef = collection(db, "categories", "fruits", "items");
        const q = query(fruitsCollectionRef);
        const snapshot = await getDocs(q);
        fruits = snapshot.docs.map(doc => doc.data());
        console.log("Fetched fruits:", fruits);
    } catch (error) {
        console.error("Error fetching fruits from Firestore:", error);
        fruits = [];
    }
}

// ***** دوال مصدّرة ليتم استدعاؤها من index.html *****
export function showNextFruit() {
    stopCurrentAudio();
    if (currentIndex < fruits.length - 1) {
        currentIndex++;
        updateFruitContent();
        recordActivity(JSON.parse(localStorage.getItem("user")), "fruits");
    }
}

export function showPreviousFruit() {
    stopCurrentAudio();
    if (currentIndex > 0) {
        currentIndex--;
        updateFruitContent();
        recordActivity(JSON.parse(localStorage.getItem("user")), "fruits");
    }
}

export function playCurrentFruitAudio() {
    if (currentFruitData) {
        const voiceSelect = document.getElementById('voice-select-fruit');
        const selectedVoiceType = voiceSelect ? voiceSelect.value : 'boy';
        const audioPath = getFruitAudioPath(currentFruitData, selectedVoiceType);
        if (audioPath) {
            playAudio(audioPath);
            recordActivity(JSON.parse(localStorage.getItem("user")), "fruits");
        }
    } else {
        console.warn('لا توجد فاكهة معروضة لتشغيل الصوت.');
    }
}

function getFruitAudioPath(data, voiceType) {
    const langFolder = document.getElementById('game-lang-select-fruit').value;
    const subjectFolder = 'fruits';

    let fileName;
    if (data.voices && data.voices[voiceType]) {
        fileName = data.voices[voiceType];
    } else if (data.sound_base) {
        fileName = data.sound_base.replace('.mp3', `_${voiceType}_${langFolder}.mp3`);
    } else {
        console.warn(`لا يوجد مسار صوت لـ ${data.name?.[currentLang]} بنوع الصوت ${voiceType}.`);
        return null;
    }
    return `/audio/${langFolder}/${subjectFolder}/${fileName}`;
}

function disableFruitButtonsInSidebar(isDisabled) {
    const playSoundBtn = document.getElementById("play-sound-btn-fruit");
    const nextBtn = document.getElementById("next-fruit-btn");
    const prevBtn = document.getElementById("prev-fruit-btn");
    const voiceSelect = document.getElementById("voice-select-fruit");
    const langSelect = document.getElementById("game-lang-select-fruit");

    if (playSoundBtn) playSoundBtn.disabled = isDisabled;
    if (nextBtn) nextBtn.disabled = isDisabled;
    if (prevBtn) prevBtn.disabled = isDisabled;
    if (voiceSelect) voiceSelect.disabled = isDisabled;
    if (langSelect) langSelect.disabled = isDisabled;
}