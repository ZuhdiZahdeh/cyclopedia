// src/js/fruits-game.js

import { db } from "./firebase-config.js";
import { getDocs, collection, query } from "firebase/firestore";
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

    mainContentArea.innerHTML = `
        <div class="game-box">
            <h2 id="fruit-name-ar" class="item-main-name">---</h2>
            <img id="fruit-image" src="" alt="Fruit" />
            <h3 id="fruit-name-en" class="fruit-name-en">---</h3>
            <div class="info-box"> <h4>الوصف:</h4>
                <p id="fruit-description-ar" class="fruit-description-ar"></p>
                <p id="fruit-description-en" class="fruit-description-en"></p>
            </div>
            <div class="navigation-buttons">
                <button id="prev-fruit-btn" class="nav-button">السابق</button>
                <button id="next-fruit-btn" class="nav-button">التالي</button>
            </div>
        </div>
    `;

    fruitSidebarControls.innerHTML = `
        <div class="sidebar-game-controls">
            <div class="control-group">
                <label for="game-lang-select-fruit">لغة اللعبة:</label>
                <select id="game-lang-select-fruit"></select>
            </div>
            <div class="control-group">
                <label for="voice-select-fruit">نوع الصوت:</label>
                <select id="voice-select-fruit"></select>
            </div>
            <button id="play-sound-btn-fruit" class="action-button">تشغيل الصوت</button>
            <button id="view-all-fruits-btn" class="action-button">عرض كل الفواكه</button>
        </div>
    `;

    setupGameControls(
        document.getElementById('game-lang-select-fruit'),
        document.getElementById('voice-select-fruit'),
        document.getElementById('play-sound-btn-fruit'),
        document.getElementById('next-fruit-btn'),
        document.getElementById('prev-fruit-btn'),
        loadFruitsGameContent,
        playCurrentFruitAudio,
        showPreviousFruit,
        showNextFruit
    );

    try {
        const q = query(collection(db, "categories", "fruits", "items")); // ✅ التصحيح هنا
        const querySnapshot = await getDocs(q);
        fruits = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log(`✅ تم تحميل ${fruits.length} عنصر من مجموعة الفواكه.`);

        if (fruits.length > 0) {
            console.table(fruits.map(f => ({
                id: f.id,
                name_ar: f.name?.ar,
                image: f.image,
                sound_base: f.sound_base,
                voices: f.voices ? Object.keys(f.voices) : []
            })));

            currentIndex = 0;
            displayFruit(fruits[currentIndex]);
            disableFruitButtonsInSidebar(false);
        } else {
            mainContentArea.innerHTML = `<p class="info-message">لا توجد فواكه متاحة حالياً.</p>`;
            disableFruitButtonsInSidebar(true);
        }
    } catch (error) {
        console.error("❌ خطأ أثناء تحميل بيانات الفواكه:", error);
        mainContentArea.innerHTML = `<p class="error-message">حدث خطأ أثناء تحميل بيانات الفواكه. يرجى المحاولة لاحقاً.</p>`;
        disableFruitButtonsInSidebar(true);
    }
}

function displayFruit(fruitData) {
    currentFruitData = fruitData;
    const fruitNameAr = document.getElementById("fruit-name-ar");
    const fruitNameEn = document.getElementById("fruit-name-en");
    const fruitImage = document.getElementById("fruit-image");
    const fruitDescriptionAr = document.getElementById("fruit-description-ar");
    const fruitDescriptionEn = document.getElementById("fruit-description-en");

    if (fruitNameAr) fruitNameAr.innerText = fruitData.name?.ar || "---";
    if (fruitNameEn) fruitNameEn.innerText = fruitData.name?.en || "---";
    if (fruitImage && fruitData.image) {
        fruitImage.src = `/images/fruits/${fruitData.image}`;
        fruitImage.alt = fruitData.name?.en || "Fruit image";
    }
    if (fruitDescriptionAr) fruitDescriptionAr.innerText = fruitData.description?.ar || "---";
    if (fruitDescriptionEn) fruitDescriptionEn.innerText = fruitData.description?.en || "---";

    const nextBtn = document.getElementById("next-fruit-btn");
    const prevBtn = document.getElementById("prev-fruit-btn");
    if (nextBtn) nextBtn.disabled = (currentIndex >= fruits.length - 1);
    if (prevBtn) prevBtn.disabled = (currentIndex <= 0);

    applyTranslations();
}

function showNextFruit() {
    stopCurrentAudio();
    if (currentIndex < fruits.length - 1) {
        currentIndex++;
        displayFruit(fruits[currentIndex]);
    }
}

function showPreviousFruit() {
    stopCurrentAudio();
    if (currentIndex > 0) {
        currentIndex--;
        displayFruit(fruits[currentIndex]);
    }
}

function playCurrentFruitAudio() {
    if (currentFruitData) {
        const voiceType = document.getElementById('voice-select-fruit').value;
        const audioPath = getFruitAudioPath(currentFruitData, voiceType);
        if (audioPath) {
            playAudio(audioPath);
            recordActivity(JSON.parse(localStorage.getItem("user")), "fruits");
        }
    } else {
        console.warn('⚠️ لا توجد فاكهة معروضة لتشغيل الصوت.');
    }
}

function getFruitAudioPath(data, voiceType) {
    const langFolder = document.getElementById('game-lang-select-fruit').value;
    const subjectFolder = 'fruits';

    const voiceKey = `${voiceType}_${langFolder}`;
    let fileName;

    if (data.voices && data.voices[voiceKey]) {
        fileName = data.voices[voiceKey];
        console.log(`✅ Found voice file: ${voiceKey} → ${fileName}`);
    } else if (data.sound_base) {
        fileName = `${data.sound_base}_${voiceType}_${langFolder}.mp3`;
        console.warn(`⚠️ Used fallback from sound_base: ${fileName}`);
    } else {
        console.error(`❌ No voice or sound_base for: ${data.name?.[currentLang]}`);
        return null;
    }

    const audioPath = `/audio/${langFolder}/${subjectFolder}/${fileName}`;
    console.log(`🎧 Full audio path: ${audioPath}`);
    return audioPath;
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

export {
    showNextFruit,
    showPreviousFruit,
    playCurrentFruitAudio
};
