// public/js/alphabet-press-game.js

import { db } from './firebase-config.js';
import { collection, getDocs, query } from 'firebase/firestore';
import { currentLang, loadLanguage, applyTranslations, setDirection } from './lang-handler.js';
import { playAudio, stopCurrentAudio } from './audio-handler.js';
import { recordActivity } from './activity-handler.js';

let allItems = [];
let currentDisplayedItem = null;
export let currentAlphabetPressCategory = 'animals';
export let currentAlphabetPressVoice = 'teacher';


const alphabetLetters = {
    'ar': ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'],
    'en': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    'he': ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת']
};

const availableCategories = [
    { id: 'animals', name_ar: 'حيوانات', name_en: 'Animals', name_he: 'חיות' },
    { id: 'fruits', name_ar: 'فواكه', name_en: 'Fruits', name_he: 'פירות' },
    { id: 'vegetables', name_ar: 'خضروات', name_en: 'Vegetables', name_he: 'ירקות' },
    { id: 'human-body', name_ar: 'جسم الإنسان', name_en: 'Human Body', name_he: 'גוף האדם' },
];

export function getCurrentDisplayedItem() {
    return currentDisplayedItem;
}

export function updateAlphabetPressCategory(newCategory) {
    currentAlphabetPressCategory = newCategory;
    loadCategoryItems(newCategory);
}

export function updateAlphabetPressVoice(newVoice) {
    currentAlphabetPressVoice = newVoice;
}

export async function populateAlphabetPressSidebarOptions() {
    const langSelect = document.getElementById('alphabet-press-language-select');
    const catSelect = document.getElementById('alphabet-press-category-select');
    const voiceSelect = document.getElementById('alphabet-press-voice-select');
    const playAudioBtn = document.getElementById('alphabet-press-play-audio-sidebar');

    if (!langSelect || !catSelect || !voiceSelect || !playAudioBtn) {
        console.error("Alphabet press sidebar control elements not found. Cannot initialize options.");
        return;
    }

    langSelect.innerHTML = '';
    ['ar', 'en', 'he'].forEach(langCode => {
        const option = document.createElement('option');
        option.value = langCode;
        option.textContent = { 'ar': 'العربية', 'en': 'English', 'he': 'עברית' }[langCode];
        langSelect.appendChild(option);
    });
    langSelect.value = currentLang;

    catSelect.innerHTML = '';
    availableCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category['name_' + currentLang];
        catSelect.appendChild(option);
    });
    catSelect.value = currentAlphabetPressCategory;

    voiceSelect.innerHTML = `
        <option value="teacher" data-i18n="teacher_voice">المعلم</option>
        <option value="boy" data-i18n="boy_voice">صوت ولد</option>
        <option value="girl" data-i18n="girl_voice">صوت بنت</option>
        <option value="child" data-i18n="child_voice">صوت طفل</option>
    `;
    voiceSelect.value = currentAlphabetPressVoice;


    langSelect.addEventListener('change', async () => {
        await loadLanguage(langSelect.value);
        applyTranslations();
        setDirection(langSelect.value);

        Array.from(catSelect.options).forEach(option => {
            const category = availableCategories.find(cat => cat.id === option.value);
            if (category) {
                option.textContent = category['name_' + currentLang];
            }
        });
        handleAlphabetPressLanguageChange(langSelect.value);
    });

    catSelect.addEventListener('change', () => {
        handleAlphabetPressCategoryChange(catSelect.value);
    });

    voiceSelect.addEventListener('change', () => {
        updateAlphabetPressVoice(voiceSelect.value);
    });

    if (playAudioBtn) {
        playAudioBtn.addEventListener('click', () => {
            playCurrentAlphabetItemAudioFromSidebar();
        });
    }
    console.log("Alphabet press sidebar options initialized.");
}


export async function loadAlphabetPressGameContent() {
    console.log('جارٍ تحميل محتوى لعبة اضغط على الحرف...');

    const mainContentArea = document.querySelector('.main-content');
    try {
        const response = await fetch('/html/alphabet-press.html');
        if (!response.ok) {
            throw new Error(`Failed to load alphabet-press.html: ${response.statusText}`);
        }
        mainContentArea.innerHTML = await response.text();
    } catch (error) {
        console.error("Error loading alphabet-press.html:", error);
        mainContentArea.innerHTML = "<p style='color: red;'>فشل تحميل لعبة الحروف. يرجى التأكد من وجود ملف /html/alphabet-press.html.</p>";
        return;
    }

    generateKeyboard(currentLang);
    resetDisplay();

    await loadCategoryItems(currentAlphabetPressCategory);
    applyTranslations();
}


export function playCurrentAlphabetItemAudioFromSidebar() {
    if (currentDisplayedItem) {
        const categoryId = currentAlphabetPressCategory;
        const selectedVoiceType = currentAlphabetPressVoice;
        
        const audioPath = getAudioPath(currentDisplayedItem, selectedVoiceType, categoryId);
        if (audioPath) {
            playAudio(audioPath);
            const currentUser = JSON.parse(localStorage.getItem("user"));
            if (currentUser) {
                recordActivity(currentUser, categoryId);
            }
        }
    } else {
        console.warn('لا يوجد عنصر معروض لتشغيل الصوت من الشريط الجانبي.');
        showGameMessage('يرجى اختيار حرف أولاً لعرض عنصر.', 'warning');
    }
}


export async function handleAlphabetPressLanguageChange(newLang) {
    // Note: loadLanguage, applyTranslations, setDirection are handled by index.html when global language changes
    // This function specifically updates the game's internal state and UI dependent on language
    // update currentLang (imported from lang-handler) to match newLang if it's not already updated globally
    // If you want lang-handler to manage currentLang, you should not update it here directly.
    // The current setup allows lang-handler to update currentLang and then this function is called.

    // No need to loadLanguage, applyTranslations, setDirection here as it's already done globally in index.html
    // Just ensure the keyboard and items are updated based on the new global currentLang

    generateKeyboard(currentLang);
    resetDisplay();

    await loadCategoryItems(currentAlphabetPressCategory);
}

export async function handleAlphabetPressCategoryChange(newCategoryId) {
    currentAlphabetPressCategory = newCategoryId;
    await loadCategoryItems(newCategoryId);
    resetDisplay();
}


function generateKeyboard(lang) {
    const alphabetKeyboard = document.getElementById('alphabet-keyboard');
    if (!alphabetKeyboard) {
        console.error("Keyboard container not found.");
        return;
    }
    alphabetKeyboard.innerHTML = '';

    const letters = alphabetLetters[lang];
    if (!letters) {
        console.error('لا توجد حروف معرفة لهذه اللغة:', lang);
        return;
    }

    letters.forEach(letter => {
        const button = document.createElement('button');
        button.classList.add('keyboard-button');
        button.textContent = letter;
        button.addEventListener('click', () => handleLetterPress(letter));
        alphabetKeyboard.appendChild(button);
    });
}

async function loadCategoryItems(categoryId) {
    showGameMessage('جارٍ تحميل العناصر...', 'info');
    try {
        const itemsCollectionRef = collection(db, 'categories', categoryId, 'items');
        const q = query(itemsCollectionRef);
        const querySnapshot = await getDocs(q);
        allItems = querySnapshot.docs.map(doc => doc.data());
        console.log(`تم تحميل ${allItems.length} عنصرًا للفئة ${categoryId}.`);
        hideGameMessage();
        
        if (allItems.length === 0) {
            showGameMessage(`لا توجد عناصر متاحة للفئة "${categoryId}".`, 'warning');
        }

    } catch (error) {
        console.error('خطأ في تحميل عناصر الفئة:', error);
        showGameMessage('فشل تحميل العناصر. يرجى المحاولة مرة أخرى.', 'error');
        allItems = [];
    }
}

function handleLetterPress(letter) {
    stopCurrentAudio();

    const selectedCategoryId = currentAlphabetPressCategory;

    const filteredItems = allItems.filter(item => {
        return item.letter && item.letter[currentLang] && item.letter[currentLang].toLowerCase() === letter.toLowerCase();
    });

    if (filteredItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredItems.length);
        const selectedItem = filteredItems[randomIndex];
        displayItem(selectedItem);
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
            recordActivity(currentUser, selectedCategoryId);
        }
    } else {
        resetDisplay();
        showGameMessage(`عذراً، لا يوجد عنصر يبدأ بالحرف "${letter}" في هذه الفئة.`, 'warning');
    }
}

function displayItem(itemData) {
    const itemDisplayArea = document.getElementById('item-display-area');
    const alphabetPressImage = document.getElementById('alphabet-press-image');
    const alphabetPressItemName = document.getElementById('alphabet-press-item-name');
    
    currentDisplayedItem = itemData;

    const categoryId = currentAlphabetPressCategory;

    if (alphabetPressImage) {
        alphabetPressImage.src = `/images/${categoryId}/${itemData.image}`;
        alphabetPressImage.alt = itemData.name[currentLang];
    } else {
        console.warn("Alphabet press image element not found.");
    }

    const itemName = itemData.name[currentLang];
    if (alphabetPressItemName && itemName) {
        const firstLetter = itemName.charAt(0);
        const restOfName = itemName.substring(1);
        alphabetPressItemName.innerHTML = `<span class="highlight-first-letter">${firstLetter}</span>${restOfName}`;
    } else if (alphabetPressItemName) {
        alphabetPressItemName.textContent = '';
    }

    if (itemDisplayArea) itemDisplayArea.style.display = 'flex';
    hideGameMessage();

    const selectedVoiceType = currentAlphabetPressVoice;
    const audioPath = getAudioPath(itemData, selectedVoiceType, categoryId);
    if (audioPath) {
        playAudio(audioPath);
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
            recordActivity(currentUser, categoryId);
        }
    }
}

function getAudioPath(itemData, voiceType, categoryId) {
    const langFolder = currentLang;
    const subjectFolder = categoryId;

    let fileName;
    if (itemData && itemData.voices && itemData.voices[voiceType]) {
        fileName = itemData.voices[voiceType];
    } else {
        if (itemData && itemData.sound_base) {
            fileName = itemData.sound_base.replace('.mp3', `_${voiceType}_${langFolder}.mp3`);
        } else {
            console.warn(`لم يتم العثور على مسار صوت لـ ${itemData?.name?.[currentLang]} بنوع الصوت ${voiceType}.`);
            return null;
        }
    }
    return `/audio/${langFolder}/${subjectFolder}/${fileName}`;
}

function resetDisplay() {
    const itemDisplayArea = document.getElementById('item-display-area');
    if (itemDisplayArea) itemDisplayArea.style.display = 'none';
    currentDisplayedItem = null;
    stopCurrentAudio();
    hideGameMessage();
}

function showGameMessage(message, type) {
    const gameMessage = document.getElementById('game-message');
    if (!gameMessage) return;
    const gameMessageParagraph = gameMessage.querySelector('p');
    if (!gameMessageParagraph) return;
    gameMessageParagraph.textContent = message;
    gameMessage.className = 'info-box';
    if (type === 'info') {
        gameMessage.style.backgroundColor = 'var(--color-info)';
        gameMessage.style.color = 'var(--color-white)';
    } else if (type === 'warning') {
        gameMessage.style.backgroundColor = 'var(--color-warning)';
        gameMessage.style.color = 'var(--color-text-primary)';
    } else if (type === 'error') {
        gameMessage.style.backgroundColor = 'var(--color-danger)';
        gameMessage.style.color = 'var(--color-white)';
    }
    gameMessage.style.display = 'block';
}

function hideGameMessage() {
    const gameMessage = document.getElementById('game-message');
    if (gameMessage) gameMessage.style.display = 'none';
}