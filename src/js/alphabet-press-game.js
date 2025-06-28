// js/alphabet-press-game.js

import { db } from './firebase-config.js'; // استيراد قاعدة البيانات [cite: 20]
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js'; // استيراد دوال Firestore [cite: 20]
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

// تعريف الفئات المتوفرة (يمكن جلبها ديناميكيا من Firestore لاحقاً)
const availableCategories = [
    { id: 'animals', name_ar: 'حيوانات', name_en: 'Animals', name_he: 'חיות' },
    { id: 'fruits', name_ar: 'فواكه', name_en: 'Fruits', name_he: 'פירות' },
    // أضف المزيد من الفئات هنا
];

export async function loadAlphabetPressGameContent() {
    console.log('جارٍ تحميل محتوى لعبة اضغط على الحرف...');

    // حقن HTML الخاص باللعبة في المنطقة الرئيسية 
    const mainContentArea = document.querySelector('.main-content');
    const response = await fetch('games/alphabet-press.html');
    mainContentArea.innerHTML = await response.text();

    // الحصول على مراجع عناصر DOM بعد حقن HTML [cite: 22]
    const languageSelect = document.getElementById('alphabet-press-language-select');
    const categorySelect = document.getElementById('alphabet-press-category-select');
    const alphabetKeyboard = document.getElementById('alphabet-keyboard');
    const itemDisplayArea = document.getElementById('item-display-area');
    const alphabetPressImage = document.getElementById('alphabet-press-image');
    const alphabetPressItemName = document.getElementById('alphabet-press-item-name');
    const playAudioButton = document.getElementById('alphabet-press-play-audio');
    const gameMessage = document.getElementById('game-message');
    const gameMessageParagraph = gameMessage.querySelector('p');

    // تعبئة قائمة اللغات والفئات
    populateLanguageAndCategorySelects(languageSelect, categorySelect);

    // إضافة مستمعي الأحداث
    languageSelect.addEventListener('change', () => {
        setLanguageAndReloadKeyboard(languageSelect.value);
    });
    categorySelect.addEventListener('change', () => {
        loadCategoryItems(categorySelect.value);
        resetDisplay();
    });
    playAudioButton.addEventListener('click', () => {
        if (currentDisplayedItem) {
            const audioPath = getAudioPath(currentDisplayedItem.sound_base, 'boy', categorySelect.value); // يمكن اختيار نوع الصوت ديناميكيا
            playAudio(audioPath); [cite: 21]
            recordActivity('listen', categorySelect.value, currentDisplayedItem.name[currentLang]); [cite: 21]
        }
    });

    // تعيين اللغة الافتراضية وتحميل لوحة المفاتيح والعناصر
    setLanguageAndReloadKeyboard(currentLang);
    // حدد فئة افتراضية أو اطلب من المستخدم الاختيار
    if (availableCategories.length > 0) {
        categorySelect.value = availableCategories[0].id;
        loadCategoryItems(categorySelect.value);
    }
}

function populateLanguageAndCategorySelects(languageSelect, categorySelect) {
    // تعبئة اللغات
    ['ar', 'en', 'he'].forEach(langCode => {
        const option = document.createElement('option');
        option.value = langCode;
        option.textContent = { 'ar': 'العربية', 'en': 'English', 'he': 'עברית' }[langCode];
        languageSelect.appendChild(option);
    });
    languageSelect.value = currentLang; // تعيين اللغة الحالية كقيمة افتراضية

    // تعبئة الفئات
    availableCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category['name_' + currentLang]; // عرض اسم الفئة باللغة الحالية
        categorySelect.appendChild(option);
    });
}

async function setLanguageAndReloadKeyboard(lang) {
    await loadLanguage(lang); // تحميل ملف اللغة الجديد 
    applyTranslations(); // تطبيق الترجمات 
    setDirection(lang); // تعيين اتجاه الصفحة [cite: 43]
    document.getElementById('alphabet-press-title').textContent = lang === 'ar' ? 'لعبة اضغط على الحرف' : lang === 'en' ? 'Press the Letter Game' : 'משחק לחץ על האות';
    populateCategoryNames(); // تحديث أسماء الفئات باللغة الجديدة
    generateKeyboard(lang); // إعادة إنشاء لوحة المفاتيح
    resetDisplay();
}

function populateCategoryNames() {
    const categorySelect = document.getElementById('alphabet-press-category-select');
    Array.from(categorySelect.options).forEach(option => {
        const category = availableCategories.find(cat => cat.id === option.value);
        if (category) {
            option.textContent = category['name_' + currentLang];
        }
    });
}

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
        // يمكننا جلب جميع العناصر ثم تصفيتها بواسطة JavaScript لتحسين الأداء إذا كانت المجموعة صغيرة
        // أو استخدام where إذا كان هناك حقل مخصص للحرف الأول لتحسين الاستعلام
        const q = query(itemsCollectionRef); // جلب كل العناصر
        const querySnapshot = await getDocs(q); [cite: 23]
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

    const filteredItems = allItems.filter(item => {
        // تأكد من أن حقل 'letter' موجود للعنصر واللغة الحالية
        return item.letter && item.letter[currentLang] && item.letter[currentLang].toLowerCase() === letter.toLowerCase();
    });

    if (filteredItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredItems.length);
        const selectedItem = filteredItems[randomIndex];
        displayItem(selectedItem);
        recordActivity('alphabet_press', document.getElementById('alphabet-press-category-select').value, selectedItem.name[currentLang], letter);
    } else {
        resetDisplay();
        showGameMessage(`عذراً، لا يوجد عنصر يبدأ بالحرف "${letter}" في هذه الفئة.`, 'warning');
    }
}

function displayItem(itemData) {
    const itemDisplayArea = document.getElementById('item-display-area');
    const alphabetPressImage = document.getElementById('alphabet-press-image');
    const alphabetPressItemName = document.getElementById('alphabet-press-item-name');

    currentDisplayedItem = itemData; // حفظ العنصر المعروض

    alphabetPressImage.src = `/images/${document.getElementById('alphabet-press-category-select').value}/${itemData.image}`; [cite: 23]
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
    
    // تشغيل الصوت تلقائيًا عند عرض العنصر
    const categoryId = document.getElementById('alphabet-press-category-select').value;
    const audioPath = getAudioPath(itemData.sound_base, 'boy', categoryId); // يمكن اختيار نوع الصوت ديناميكيا
    playAudio(audioPath); [cite: 21]
    recordActivity('listen', categoryId, itemData.name[currentLang]); // تسجيل الاستماع 
}

function getAudioPath(baseFileName, voiceType, categoryId) {
    // بناء المسار الكامل لملف الصوت 
    // تأكد من أن baseFileName هو الاسم الأساسي مثل "apple.mp3" أو "alligator.mp3"
    // وأن ملفات الصوت الفعلية هي "apple_boy_ar.mp3" أو "alligator_teacher_ar.mp3"
    // يمكن تعديل هذا المنطق بناءً على كيفية تسمية ملفات الصوت بالضبط
    const langFolder = currentLang; // مجلد اللغة ديناميكي
    const subjectFolder = categoryId; // مجلد الموضوع (animals/fruits)
    
    let fileName;
    if (currentDisplayedItem && currentDisplayedItem.voices && currentDisplayedItem.voices[voiceType]) {
        fileName = currentDisplayedItem.voices[voiceType];
    } else {
        // Fallback إذا لم يكن هناك صوت محدد لنوع الصوت (boy, girl, teacher)
        // نفترض أن baseFileName موجود مباشرة في المجلد
        fileName = baseFileName.replace('.mp3', `_${voiceType}_${langFolder}.mp3`); // مثال: apple_boy_ar.mp3
    }
    
    return `/audio/${langFolder}/${subjectFolder}/${fileName}`; [cite: 23, 24]
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