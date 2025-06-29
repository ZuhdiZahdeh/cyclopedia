// js/alphabet-press-game.js

import { db } from './firebase-config.js'; // استيراد قاعدة البيانات
import { collection, getDocs, query, where } from 'firebase/firestore'; // استيراد دوال Firestore من حزمة npm
import { currentLang, loadLanguage, applyTranslations, setDirection } from './lang-handler.js'; // لإدارة اللغة
import { playAudio, stopCurrentAudio } from './audio-handler.js'; // لتشغيل وإيقاف الصوت
import { recordActivity } from './activity-handler.js'; // لتسجيل نشاط المستخدم

let allItems = []; // لتخزين جميع العناصر من الفئة المختارة
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
    // أضف المزيد من الفئات هنا
];

export async function loadAlphabetPressGameContent() {
    console.log('جارٍ تحميل محتوى لعبة اضغط على الحرف...');

    // حقن HTML الخاص باللعبة في المنطقة الرئيسية
    const mainContentArea = document.querySelector('.main-content');
    const response = await fetch('/html/alphabet-press.html');
    mainContentArea.innerHTML = await response.text();

    // الحصول على مراجع عناصر DOM الخاصة باللعبة نفسها (غير الموجودة في الشريط الجانبي)
    const alphabetKeyboard = document.getElementById('alphabet-keyboard');
    const itemDisplayArea = document.getElementById('item-display-area');
    const alphabetPressImage = document.getElementById('alphabet-press-image');
    const alphabetPressItemName = document.getElementById('alphabet-press-item-name');
    const playAudioButton = document.getElementById('alphabet-press-play-audio');
    const gameMessage = document.getElementById('game-message');

    // **ملاحظة:** الحصول على مراجع عناصر التحكم من الشريط الجانبي في index.html
    const languageSelect = document.getElementById('alphabet-press-language-select');
    const categorySelect = document.getElementById('alphabet-press-category-select');
    const voiceSelect = document.getElementById('alphabet-press-voice-select');


    // تعيين اللغة الافتراضية وتحميل لوحة المفاتيح والعناصر
    generateKeyboard(currentLang);
    if (categorySelect.value) {
        await loadCategoryItems(categorySelect.value); // تأكد من انتظار تحميل العناصر
    } else if (availableCategories.length > 0) {
        categorySelect.value = availableCategories[0].id;
        await loadCategoryItems(categorySelect.value); // تأكد من انتظار تحميل العناصر
    }

    // إضافة مستمع الحدث لزر "استمع"
    playAudioButton.addEventListener('click', () => {
        // ***** التحقق من currentDisplayedItem قبل محاولة الوصول إليه *****
        if (currentDisplayedItem) {
            const categoryId = categorySelect.value;
            const selectedVoiceType = voiceSelect.value;
            const audioPath = getAudioPath(currentDisplayedItem, selectedVoiceType, categoryId); // تمرير العنصر كاملاً
            playAudio(audioPath);
            const currentUser = JSON.parse(localStorage.getItem("user"));
            if (currentUser) {
                recordActivity(currentUser, categoryId);
            }
        } else {
            showGameMessage('يرجى اختيار حرف أولاً لعرض عنصر.', 'warning');
        }
    });

    applyTranslations();
}

// **ملاحظة:** دوال populateLanguageAndCategorySelects لم تعد ضرورية هنا لأنها في index.html

async function setLanguageAndReloadKeyboard(lang) {
    await loadLanguage(lang); // تحميل ملف اللغة الجديد
    applyTranslations(); // تطبيق الترجمات
    setDirection(lang); // تعيين اتجاه الصفحة
    document.getElementById('alphabet-press-title').textContent = lang === 'ar' ? 'لعبة اضغط على الحرف' : lang === 'en' ? 'Press the Letter Game' : 'משחק לחץ על האות';

    // **ملاحظة:** تحديث الفئات في الشريط الجانبي يتم في index.html
    // هنا فقط نعيد بناء لوحة المفاتيح
    generateKeyboard(lang);
    resetDisplay();

    // بعد تغيير اللغة، أعد تحميل عناصر الفئة لضمان أنها باللغة الصحيحة
    const categorySelect = document.getElementById('alphabet-press-category-select');
    if (categorySelect.value) {
        await loadCategoryItems(categorySelect.value);
    }
}

// **ملاحظة:** الدالة populateCategoryNames لم تعد ضرورية هنا لأنها في index.html

function generateKeyboard(lang) {
    const alphabetKeyboard = document.getElementById('alphabet-keyboard');
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

    const categorySelect = document.getElementById('alphabet-press-category-select');
    const selectedCategoryId = categorySelect.value;

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
    const categorySelect = document.getElementById('alphabet-press-category-select');
    const voiceSelect = document.getElementById('alphabet-press-voice-select');

    currentDisplayedItem = itemData; // ***** تم تعيينه هنا *****

    const categoryId = categorySelect.value;
    alphabetPressImage.src = `/images/${categoryId}/${itemData.image}`;
    alphabetPressImage.alt = itemData.name[currentLang];

    const itemName = itemData.name[currentLang];
    if (itemName) {
        const firstLetter = itemName.charAt(0);
        const restOfName = itemName.substring(1);
        alphabetPressItemName.innerHTML = `<span class="highlight-first-letter">${firstLetter}</span>${restOfName}`;
    } else {
        alphabetPressItemName.textContent = '';
    }

    itemDisplayArea.style.display = 'flex';
    hideGameMessage();

    const selectedVoiceType = voiceSelect.value;
    // ***** تمرير itemData إلى getAudioPath بدلاً من currentDisplayedItem.sound_base *****
    const audioPath = getAudioPath(itemData, selectedVoiceType, categoryId);
    playAudio(audioPath);
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
        recordActivity(currentUser, categoryId);
    }
}

// ***** تعديل دالة getAudioPath لتقبل العنصر كاملاً *****
function getAudioPath(itemData, voiceType, categoryId) {
    const langFolder = currentLang;
    const subjectFolder = categoryId;

    let fileName;
    // الشرط الأول هو الأهم: استخدم اسم الملف المحدد في حقل 'voices' أولاً
    if (itemData && itemData.voices && itemData.voices[voiceType]) {
        fileName = itemData.voices[voiceType];
    } else {
        // Fallback إذا لم يتم العثور على صوت محدد لنوع الصوت
        // في هذه الحالة، سنبني اسم الملف بناءً على baseFileName
        // إذا كان baseFileName هو 'donkey.mp3' ونريد 'donkey_girl_ar.mp3'
        // يجب أن تتطابق قاعدة البيانات مع أسماء الملفات الفعلية على السيرفر
        // للتأكد من أن المسار صحيح تمامًا
        if (itemData && itemData.sound_base) {
            // مثال: donkey.mp3 -> donkey_girl_ar.mp3
            fileName = itemData.sound_base.replace('.mp3', `_${voiceType}_${langFolder}.mp3`);
        } else {
            console.warn(`لم يتم العثور على مسار صوت لـ ${itemData?.name?.[currentLang]} بنوع الصوت ${voiceType}.`);
            return null; // أو مسار صوت افتراضي للخطأ
        }
    }
    return `/audio/${langFolder}/${subjectFolder}/${fileName}`;
}

function resetDisplay() {
    const itemDisplayArea = document.getElementById('item-display-area');
    itemDisplayArea.style.display = 'none';
    currentDisplayedItem = null;
    stopCurrentAudio();
    hideGameMessage();
}

function showGameMessage(message, type) {
    const gameMessage = document.getElementById('game-message');
    const gameMessageParagraph = gameMessage.querySelector('p');
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
    document.getElementById('game-message').style.display = 'none';
}