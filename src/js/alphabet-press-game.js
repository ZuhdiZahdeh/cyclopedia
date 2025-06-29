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
// يجب أن تكون هذه القائمة مطابقة للقائمة في index.html
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
    // عناصر التحكم (اللغة، الفئة، الصوت) لن يتم الحصول عليها هنا، بل سيتم قراءتها مباشرة من index.html
    const alphabetKeyboard = document.getElementById('alphabet-keyboard');
    const itemDisplayArea = document.getElementById('item-display-area');
    const alphabetPressImage = document.getElementById('alphabet-press-image');
    const alphabetPressItemName = document.getElementById('alphabet-press-item-name');
    const playAudioButton = document.getElementById('alphabet-press-play-audio');
    const gameMessage = document.getElementById('game-message');
    const gameMessageParagraph = gameMessage.querySelector('p');

    // **ملاحظة:** لم نعد نعبئ القوائم المنسدلة هنا لأنها في index.html
    // ولم نعد نضيف مستمعي الأحداث هنا لأنهم في index.html (main script)

    // **جديد:** الحصول على المراجع من الشريط الجانبي في index.html
    const languageSelect = document.getElementById('alphabet-press-language-select');
    const categorySelect = document.getElementById('alphabet-press-category-select');
    const voiceSelect = document.getElementById('alphabet-press-voice-select');


    // تعيين اللغة الافتراضية وتحميل لوحة المفاتيح والعناصر
    // **ملاحظة:** هنا سنقوم فقط بتوليد لوحة المفاتيح وتحميل العناصر بناءً على القيم الحالية في الشريط الجانبي
    generateKeyboard(currentLang); // بناء لوحة المفاتيح بناءً على اللغة الحالية
    if (categorySelect.value) { // إذا كانت هناك فئة محددة بالفعل في الشريط الجانبي
        loadCategoryItems(categorySelect.value);
    } else if (availableCategories.length > 0) { // إذا لم تكن، حدد الفئة الافتراضية
        categorySelect.value = availableCategories[0].id;
        loadCategoryItems(categorySelect.value);
    }

    // إضافة مستمع الحدث لزر "استمع" (هذا الزر لا يزال داخل alphabet-press.html)
    playAudioButton.addEventListener('click', () => {
        if (currentDisplayedItem) {
            const categoryId = categorySelect.value;
            const selectedVoiceType = voiceSelect.value; // جلب نوع الصوت المختار من الشريط الجانبي
            const audioPath = getAudioPath(currentDisplayedItem.sound_base, selectedVoiceType, categoryId);
            playAudio(audioPath);
            const currentUser = JSON.parse(localStorage.getItem("user"));
            if (currentUser) {
                recordActivity(currentUser, categoryId);
            }
        } else {
            showGameMessage('يرجى اختيار حرف أولاً لعرض عنصر.', 'warning');
        }
    });

    // تطبيق الترجمات على خيارات الصوت (لتحديثها إذا تم تغيير اللغة قبل تحميل اللعبة)
    applyTranslations();
}

// **ملاحظة:** الدوال populateLanguageAndCategorySelects لم تعد ضرورية هنا لأنها في index.html

async function setLanguageAndReloadKeyboard(lang) {
    // هذه الدالة الآن ستركز فقط على إعادة بناء لوحة المفاتيح
    // تغيير اللغة وتطبيق الترجمات و setDirection يتم الآن في index.html
    generateKeyboard(lang); // إعادة إنشاء لوحة المفاتيح
    resetDisplay();
    // يجب أن يتم إعادة تحميل الفئات في initializeAlphabetPressSidebarControls في index.html
    // للتأكد من أن الفئات المعروضة في القائمة المنسدلة محدثة باللغة الجديدة
    const categorySelect = document.getElementById('alphabet-press-category-select');
    if (categorySelect.value) {
        loadCategoryItems(categorySelect.value); // أعد تحميل العناصر إذا كانت هناك فئة مختارة
    }
}

// **ملاحظة:** الدالة populateCategoryNames لم تعد ضرورية هنا لأنها في index.html

function generateKeyboard(lang) {
    const alphabetKeyboard = document.getElementById('alphabet-keyboard');
    alphabetKeyboard.innerHTML = ''; // مسح لوحة المفاتيح الحالية

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
    stopCurrentAudio(); // إيقاف أي صوت يتم تشغيله حاليا

    // **ملاحظة:** نحصل على الفئة المختارة مباشرة من الشريط الجانبي
    const categorySelect = document.getElementById('alphabet-press-category-select');
    const selectedCategoryId = categorySelect.value;


    const filteredItems = allItems.filter(item => {
        // تأكد من أن حقل 'letter' موجود للعنصر واللغة الحالية
        return item.letter && item.letter[currentLang] && item.letter[currentLang].toLowerCase() === letter.toLowerCase();
    });

    if (filteredItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredItems.length);
        const selectedItem = filteredItems[randomIndex];
        displayItem(selectedItem);
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
            recordActivity(currentUser, selectedCategoryId); // يمرر user و categoryName فقط
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
    const categorySelect = document.getElementById('alphabet-press-category-select'); // الحصول على مرجع الفئة
    const voiceSelect = document.getElementById('alphabet-press-voice-select'); // الحصول على مرجع الصوت


    currentDisplayedItem = itemData; // حفظ العنصر المعروض

    const categoryId = categorySelect.value; // جلب قيمة الفئة من الشريط الجانبي
    alphabetPressImage.src = `/images/${categoryId}/${itemData.image}`;
    alphabetPressImage.alt = itemData.name[currentLang];

    // تمييز الحرف الأول
    const itemName = itemData.name[currentLang];
    if (itemName) {
        const firstLetter = itemName.charAt(0);
        const restOfName = itemName.substring(1);
        alphabetPressItemName.innerHTML = `<span class="highlight-first-letter">${firstLetter}</span>${restOfName}`;
    } else {
        alphabetPressItemName.textContent = '';
    }

    itemDisplayArea.style.display = 'flex'; // إظهار منطقة العرض
    hideGameMessage(); // إخفاء أي رسالة لعبة

    const selectedVoiceType = voiceSelect.value; // جلب نوع الصوت المختار من الشريط الجانبي
    const audioPath = getAudioPath(itemData.sound_base, selectedVoiceType, categoryId);
    playAudio(audioPath);
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
        recordActivity(currentUser, categoryId); // يمرر user و categoryName فقط
    }
}

function getAudioPath(baseFileName, voiceType, categoryId) {
    const langFolder = currentLang; // مجلد اللغة ديناميكي
    const subjectFolder = categoryId; // مجلد الموضوع (animals/fruits)

    let fileName;
    if (currentDisplayedItem && currentDisplayedItem.voices && currentDisplayedItem.voices[voiceType]) {
        fileName = currentDisplayedItem.voices[voiceType];
    } else {
        fileName = baseFileName.replace('.mp3', `_${voiceType}_${langFolder}.mp3`);
    }

    return `/audio/${langFolder}/${subjectFolder}/${fileName}`;
}

function resetDisplay() {
    const itemDisplayArea = document.getElementById('item-display-area');
    itemDisplayArea.style.display = 'none'; // إخفاء منطقة العرض
    currentDisplayedItem = null;
    stopCurrentAudio(); // إيقاف الصوت عند إعادة الضبط
    hideGameMessage();
}

function showGameMessage(message, type) {
    const gameMessage = document.getElementById('game-message');
    const gameMessageParagraph = gameMessage.querySelector('p');
    gameMessageParagraph.textContent = message;
    gameMessage.className = 'info-box'; // إعادة تعيين الفئات
    if (type === 'info') {
        gameMessage.style.backgroundColor = 'var(--color-info-background)';
        gameMessage.style.color = 'var(--color-info-text)';
    } else if (type === 'warning') {
        gameMessage.style.backgroundColor = 'var(--color-warning-background)';
        gameMessage.style.color = 'var(--color-warning-text)';
    } else if (type === 'error') {
        gameMessage.style.backgroundColor = 'var(--color-danger)';
        gameMessage.style.color = 'var(--color-white)';
    }
    gameMessage.style.display = 'block';
}

function hideGameMessage() {
    document.getElementById('game-message').style.display = 'none';
}