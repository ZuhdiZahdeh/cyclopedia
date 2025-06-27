// ====== إعدادات Firebase ======
// يجب عليك إضافة إعدادات مشروع Firebase الخاص بك هنا.
// يمكنك العثور عليها في Firebase Console -> Project settings -> General -> Your apps -> Firebase SDK snippet -> Config
// مثال:
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ====== عناصر DOM ======
const fruitImage = document.getElementById('fruit-image');
const fruitNameAr = document.getElementById('fruit-name-ar');
const fruitNameEn = document.getElementById('fruit-name-en');
const fruitDescriptionAr = document.getElementById('fruit-description-ar');
const soundBoyBtn = document.getElementById('sound-boy-btn');
const soundGirlBtn = document.getElementById('sound-girl-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let fruits = []; // لتخزين بيانات الفواكه
let currentIndex = 0; // الفهرس الحالي للفاكهة المعروضة
let currentAudio = null; // لتتبع الصوت الحالي وتشغيله/إيقافه

// ====== دالة لجلب بيانات الفواكه من Firestore ======
async function fetchFruits() {
    try {
        // المسار الذي اتفقنا عليه: categories/fruits/items
        const querySnapshot = await db.collection('categories').doc('fruits').collection('items').get();
        fruits = querySnapshot.docs.map(doc => doc.data());

        if (fruits.length > 0) {
            displayFruit(currentIndex);
        } else {
            console.log("لا توجد فواكه في قاعدة البيانات.");
            fruitNameAr.textContent = "لا توجد فواكه";
            fruitNameEn.textContent = "";
            fruitDescriptionAr.textContent = "يرجى إضافة بيانات الفواكه إلى Firestore.";
            fruitImage.src = "";
            disableButtons();
        }
    } catch (error) {
        console.error("خطأ في جلب بيانات الفواكه:", error);
        fruitNameAr.textContent = "حدث خطأ";
        fruitDescriptionAr.textContent = "تعذر تحميل البيانات.";
        fruitImage.src = "";
        disableButtons();
    }
}

// ====== دالة لعرض الفاكهة بناءً على الفهرس ======
function displayFruit(index) {
    if (index >= 0 && index < fruits.length) {
        const fruit = fruits[index];
        fruitImage.src = fruit.image; // المسار الكامل للصورة
        fruitImage.alt = fruit.name.en;
        fruitNameAr.textContent = fruit.name.ar;
        fruitNameEn.textContent = fruit.name.en;
        fruitDescriptionAr.textContent = fruit.description.ar;

        // تحديث حالة أزرار التنقل
        prevBtn.disabled = (index === 0);
        nextBtn.disabled = (index === fruits.length - 1);

        // إيقاف أي صوت يتم تشغيله حالياً
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
    }
}

// ====== دالة لتشغيل الصوت ======
function playSound(voiceType) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    const fruit = fruits[currentIndex];
    let soundPath = '';

    if (voiceType === 'boy' && fruit.voices && fruit.voices.boy) {
        soundPath = `audio/ar/fruits/${fruit.voices.boy}`;
    } else if (voiceType === 'girl' && fruit.voices && fruit.voices.girl) {
        soundPath = `audio/ar/fruits/${fruit.voices.girl}`;
    } else {
        // في حال عدم وجود صوت محدد، يمكن استخدام sound_base كبديل
        // أو إظهار رسالة خطأ
        console.warn(`لا يوجد صوت ${voiceType} لـ ${fruit.name.en}`);
        return;
    }

    currentAudio = new Audio(soundPath);
    currentAudio.play().catch(e => console.error("خطأ في تشغيل الصوت:", e));
}

// ====== وظائف المساعدة للأزرار ======
function disableButtons() {
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    soundBoyBtn.disabled = true;
    soundGirlBtn.disabled = true;
}

// ====== معالجات الأحداث (Event Listeners) ======
nextBtn.addEventListener('click', () => {
    if (currentIndex < fruits.length - 1) {
        currentIndex++;
        displayFruit(currentIndex);
    }
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayFruit(currentIndex);
    }
});

soundBoyBtn.addEventListener('click', () => playSound('boy'));
soundGirlBtn.addEventListener('click', () => playSound('girl'));

// ====== بدء جلب البيانات عند تحميل الصفحة ======
document.addEventListener('DOMContentLoaded', fetchFruits);