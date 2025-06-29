// js/alphabet-press-game.js

import { db } from './firebase-config.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { currentLang, loadLanguage, applyTranslations, setDirection } from './lang-handler.js';
import { playAudio, stopCurrentAudio } from './audio-handler.js';
import { recordActivity } from './activity-handler.js';

let allItems = []; // لتخزين جميع العناصر من الفئة المختارة
let currentDisplayedItem = null; // لتتبع العنصر المعروض حاليا
let currentAlphabetPressCategory = 'animals'; // تتبع الفئة المختارة حاليا للعبة الحروف
let currentAlphabetPressVoice = 'teacher'; // تتبع الصوت المختار حاليا للعبة الحروف


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
// هذه الدوال ستجلب العنصر من DOM في كل مرة يتم استدعاؤها
// وهي ضرورية لأن الـ select قد لا تكون موجودة عند التحميل الأولي
export function getAlphabetPressCategorySelect() {
    return document.getElementById('alphabet-press-category-select');
}

export function getAlphabetPressVoiceSelect() {
    return document.getElementById('alphabet-press-voice-select');
}

// تحديث هذه الدوال لتتلقى القيمة مباشرة بدلاً من الاعتماد على DOM
export function updateAlphabetPressCategory(newCategory) {
    currentAlphabetPressCategory = newCategory;
    loadCategoryItems(newCategory); // إعادة تحميل العناصر عند تغيير الفئة
}

export function updateAlphabetPressVoice(newVoice) {
    currentAlphabetPressVoice = newVoice;
    // لا حاجة لإعادة تحميل العناصر، فقط تحديث المتغير
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
        return; // توقف التنفيذ إذا فشل تحميل HTML
    }

    // تهيئة لوحة المفاتيح بناءً على اللغة الحالية
    generateKeyboard(currentLang);
    resetDisplay(); // مسح أي عنصر معروض سابقًا

    // تحميل العناصر للفئة الافتراضية أو المختارة حاليا
    await loadCategoryItems(currentAlphabetPressCategory);

    // تطبيق الترجمات بعد تحميل المحتوى (لضمان ترجمة عنوان اللعبة)
    applyTranslations();
}


// دالة عامة لتشغيل الصوت من الشريط الجانبي
export function playCurrentAlphabetItemAudioFromSidebar() {
    if (currentDisplayedItem) {
        const categoryId = currentAlphabetPressCategory; // استخدم المتغير المُخزّن
        const selectedVoiceType = currentAlphabetPressVoice; // استخدم المتغير المُخزّن
        
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


// دالة يتم استدعاؤها عند تغيير اللغة من الشريط الجانبي
export async function handleAlphabetPressLanguageChange(newLang) {
    await loadLanguage(newLang); // تحميل ملف اللغة الجديد
    applyTranslations(); // تطبيق الترجمات (للصفحة كلها)
    setDirection(newLang); // تعيين اتجاه الصفحة

    // تحديث لوحة المفاتيح باللغة الجديدة
    generateKeyboard(newLang);
    resetDisplay(); // مسح العرض الحالي

    // إعادة تحميل عناصر الفئة لضمان أنها باللغة الصحيحة (إذا كانت البيانات تعتمد على اللغة)
    await loadCategoryItems(currentAlphabetPressCategory);
}

// دالة يتم استدعاؤها عند تغيير الفئة من الشريط الجانبي
export async function handleAlphabetPressCategoryChange(newCategoryId) {
    currentAlphabetPressCategory = newCategoryId; // تحديث الفئة المختارة
    await loadCategoryItems(newCategoryId); // إعادة تحميل العناصر للفئة الجديدة
    resetDisplay(); // مسح العرض الحالي
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
        
        // إذا لم يتم العثور على عناصر، اعرض رسالة مناسبة
        if (allItems.length === 0) {
            showGameMessage(`لا توجد عناصر متاحة للفئة "${categoryId}".`, 'warning');
        }

    } catch (error) {
        console.error('خطأ في تحميل عناصر الفئة:', error);
        // رسالة الخطأ من Firestore قد تكون غير مفهومة للمستخدم، لذا اعرض رسالة عامة
        showGameMessage('فشل تحميل العناصر. يرجى المحاولة مرة أخرى.', 'error');
        allItems = [];
    }
}

function handleLetterPress(letter) {
    stopCurrentAudio();

    // استخدم المتغير المخزن للفئة
    const selectedCategoryId = currentAlphabetPressCategory;

    const filteredItems = allItems.filter(item => {
        // تأكد من أن item.letter موجود وأن فيه الخاصية currentLang
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
    
    currentDisplayedItem = itemData; // ***** تم تعيينه هنا *****

    const categoryId = currentAlphabetPressCategory; // استخدم المتغير المخزن

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

    // تشغيل الصوت تلقائياً عند عرض العنصر هنا
    const selectedVoiceType = currentAlphabetPressVoice; // استخدم المتغير المخزن
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