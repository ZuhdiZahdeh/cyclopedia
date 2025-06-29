// js/alphabet-press-game.js

import { db } from './firebase-config.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { currentLang, loadLanguage, applyTranslations, setDirection } from './lang-handler.js';
import { playAudio, stopCurrentAudio } from './audio-handler.js';
import { recordActivity } from './activity-handler.js';

let allItems = [];
let currentDisplayedItem = null; // لتتبع العنصر المعروض حاليا

// تعريف الحروف لكل لغة
const alphabetLetters = {
    'ar': ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'],
    'en': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    'he': ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת']
};

// تعريف الفئات المتوفرة (يمكن جلبها ديناميا من Firestore لاحقاً)
const availableCategories = [
    { id: 'animals', name_ar: 'حيوانات', name_en: 'Animals', name_he: 'חיות' },
    { id: 'fruits', name_ar: 'فواكه', name_en: 'Fruits', name_he: 'פירות' },
    { id: 'vegetables', name_ar: 'خضروات', name_en: 'Vegetables', name_he: 'ירקות' },
    { id: 'human-body', name_ar: 'جسم الإنسان', name_en: 'Human Body', name_he: 'גוף האדם' },
];

// دالة تصدير العنصر المعروض حاليا ليتم الوصول إليه من index.html
export function getCurrentDisplayedItem() {
    return currentDisplayedItem;
}

// دوال تصدير للوصول إلى قوائم الاختيار من index.html
export function getAlphabetPressCategorySelect() {
    return document.getElementById('alphabet-press-category-select');
}

export function getAlphabetPressVoiceSelect() {
    return document.getElementById('alphabet-press-voice-select');
}


export async function loadAlphabetPressGameContent() {
    console.log('جارٍ تحميل محتوى لعبة اضغط على الحرف...');

    // حقن HTML الخاص باللعبة في المنطقة الرئيسية
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
        return; // توقف التنفيذ إذا فشل تحميل HTML
    }

    // الحصول على مراجع عناصر DOM الخاصة باللعبة نفسها (الآن بدون زر الصوت الرئيسي)
    const alphabetKeyboard = document.getElementById('alphabet-keyboard');
    const itemDisplayArea = document.getElementById('item-display-area');
    const alphabetPressImage = document.getElementById('alphabet-press-image');
    const alphabetPressItemName = document.getElementById('alphabet-press-item-name');
    // **تمت إزالة: const playAudioButton = document.getElementById('alphabet-press-play-audio');**
    const gameMessage = document.getElementById('game-message');

    // **ملاحظة:** الحصول على مراجع عناصر التحكم من الشريط الجانبي في index.html
    // لا داعي للحصول عليها هنا مرة أخرى، لأنها ستُمرر إلى initializeAlphabetPressSidebarControls
    // أو يتم الوصول إليها عبر الدوال المصدرة getAlphabetPressCategorySelect/VoiceSelect()

    // تعيين اللغة الافتراضية وتحميل لوحة المفاتيح والعناصر
    generateKeyboard(currentLang);
    
    const categorySelect = getAlphabetPressCategorySelect(); // الحصول على المرجع باستخدام الدالة المصدرة
    if (categorySelect && categorySelect.value) {
        await loadCategoryItems(categorySelect.value);
    } else if (availableCategories.length > 0) {
        if (categorySelect) {
            categorySelect.value = availableCategories[0].id;
            await loadCategoryItems(categorySelect.value);
        }
    }

    // *** تمت إزالة مستمع الحدث لزر "استمع" من هنا لأن الزر أصبح في الشريط الجانبي ***
    // playAudioButton.addEventListener('click', () => { ... });

    applyTranslations();
}

// *** دالة جديدة لتشغيل الصوت، يمكن استدعاؤها من الشريط الجانبي ***
export function playCurrentAlphabetItemAudioFromSidebar(itemData, selectedVoiceType, categoryId) {
    if (itemData) {
        const audioPath = getAudioPath(itemData, selectedVoiceType, categoryId);
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


async function setLanguageAndReloadKeyboard(lang) {
    await loadLanguage(lang);
    applyTranslations();
    setDirection(lang);
    const titleElement = document.getElementById('alphabet-press-title');
    if (titleElement) {
        titleElement.textContent = lang === 'ar' ? 'لعبة اضغط على الحرف' : lang === 'en' ? 'Press the Letter Game' : 'משחק לחץ على האות';
    }

    generateKeyboard(lang);
    resetDisplay();

    const categorySelect = getAlphabetPressCategorySelect(); // استخدم الدالة المصدرة
    if (categorySelect && categorySelect.value) {
        await loadCategoryItems(categorySelect.value);
    }
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
    } catch (error) {
        console.error('خطأ في تحميل عناصر الفئة:', error);
        showGameMessage('فشل تحميل العناصر. يرجى المحاولة مرة أخرى.', 'error');
        allItems = [];
    }
}

function handleLetterPress(letter) {
    stopCurrentAudio();

    const categorySelect = getAlphabetPressCategorySelect(); // استخدم الدالة المصدرة
    const selectedCategoryId = categorySelect ? categorySelect.value : 'animals';

    const filteredItems = allItems.filter(item => {
        return item.letter && item.letter[currentLang] && item.letter[currentLang].toLowerCase() === letter.toLowerCase();
    });

    if (filteredItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredItems.length);
        const selectedItem = filteredItems[randomIndex];
        displayItem(selectedItem); // هنا يتم تعيين currentDisplayedItem
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
    // لا يوجد زر صوت هنا في القسم الرئيسي بعد الآن
    // const categorySelect = getAlphabetPressCategorySelect(); // يمكن الحصول عليه هنا إذا لزم الأمر
    // const voiceSelect = getAlphabetPressVoiceSelect(); // يمكن الحصول عليه هنا إذا لزم الأمر

    currentDisplayedItem = itemData; // ***** تم تعيينه هنا *****

    // استخدام دالة الحصول على العنصر من alphabet-press-game.js
    const categorySelectFromGame = getAlphabetPressCategorySelect();
    const categoryId = categorySelectFromGame ? categorySelectFromGame.value : 'animals';

    if (alphabetPressImage) alphabetPressImage.src = `/images/${categoryId}/${itemData.image}`;
    if (alphabetPressImage) alphabetPressImage.alt = itemData.name[currentLang];

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

    // *** تشغيل الصوت تلقائياً عند عرض العنصر هنا ***
    const voiceSelectFromGame = getAlphabetPressVoiceSelect();
    const selectedVoiceType = voiceSelectFromGame ? voiceSelectFromGame.value : 'teacher';
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