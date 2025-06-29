// E:\cyclopedia\public\js\memory-game.js

import { db } from './firebase-config.js'; // استيراد db
import { collection, getDocs } from 'firebase/firestore'; // استيراد getDocs, collection
import { currentLang, loadLanguage, applyTranslations, setDirection } from './lang-handler.js'; // استيراد اللغة
import { playAudio, stopCurrentAudio } from './audio-handler.js'; // استيراد الصوت
import { recordActivity } from './activity-handler.js'; // استيراد تسجيل النشاط

// المتغيرات التي ستستخدم عبر اللعبة
let gameBoard;
let startGameButton;
let langButtons;
let topicButtons = []; // سيتم ملؤها ديناميكيًا
let modeButtons;
let gameStatusDisplay;

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let lockBoard = false;

let allCardData = {}; // لتخزين البيانات المجلوبة من Firestore
let currentTopic = 'animals'; // الموضوع الافتراضي
let currentPlayMode = 'image-image'; // نمط اللعب الافتراضي

// هذه الدوال سيتم استدعاؤها من index.html
export async function loadMemoryGameContent() {
    console.log('جارٍ تحميل محتوى لعبة الذاكرة...');

    const mainContentArea = document.querySelector('.main-content');
    mainContentArea.innerHTML = `
        <h1>لعبة الذاكرة</h1>
        <div class="memory-game-grid" id="memory-game-board">
            </div>
        <div class="game-status" id="memory-game-status">
            </div>
    `;

    // الحصول على مراجع عناصر الـ DOM بعد حقن الـ HTML
    gameBoard = document.getElementById('memory-game-board');
    gameStatusDisplay = document.getElementById('memory-game-status');
    startGameButton = document.getElementById('memory-game-start-button');
    langButtons = document.querySelectorAll('.memory-game-lang-button');
    // topicButtons يتم تحديثها بواسطة populateTopicButtons()
    modeButtons = document.querySelectorAll('.memory-game-mode-button');

    // تهيئة المستمعين للأحداث
    setupEventListeners();

    // جلب البيانات وبناء اللوحة لأول مرة
    await fetchCardData();
}

function setupEventListeners() {
    // إزالة المستمعين القدامى قبل إضافة الجدد لتجنب التكرار
    if (startGameButton) {
        startGameButton.onclick = null; // إزالة onclick المباشر
        startGameButton.addEventListener('click', createBoard);
    }

    if (langButtons) {
        langButtons.forEach(button => {
            button.onclick = null;
            button.addEventListener('click', () => {
                langButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentLanguage = button.id === 'memory-game-lang-ar' ? 'ar' : 'en';
                // تحديث اتجاه ولغة المستند بالكامل
                document.documentElement.setAttribute('lang', currentLanguage);
                document.documentElement.setAttribute('dir', currentLanguage === 'ar' ? 'rtl' : 'ltr');
                updateCardTexts(); // فقط تحديث النصوص للبطاقات الموجودة
            });
        });
    }

    if (modeButtons) {
        modeButtons.forEach(button => {
            button.onclick = null;
            button.addEventListener('click', () => {
                modeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentPlayMode = button.id.replace('memory-game-mode-', '');
                createBoard(); // إعادة إنشاء اللوحة بالنمط الجديد
            });
        });
    }
    // ملاحظة: أزرار المواضيع يتم تهيئتها بواسطة populateTopicButtons
}


// وظيفة لجلب البيانات من Firestore
async function fetchCardData() {
    if (!db) {
        console.error("Firestore DB not initialized.");
        gameStatusDisplay.textContent = (currentLanguage === 'ar' ? 'فشل إعداد قاعدة البيانات.' : 'Database setup failed.');
        return;
    }

    try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        
        const categoriesData = {};
        for (const doc of categoriesSnapshot.docs) {
            const categoryName = doc.id;
            const itemsCollectionRef = collection(db, "categories", categoryName, "items");
            const itemsSnapshot = await getDocs(itemsCollectionRef);
            
            categoriesData[categoryName] = itemsSnapshot.docs.map(itemDoc => {
                const data = itemDoc.data();
                return {
                    id: itemDoc.id,
                    image_name: data.image,
                    name_ar: data.name.ar,
                    name_en: data.name.en,
                    letter_ar: data.letter ? data.letter.ar : '',
                    letter_en: data.letter ? data.letter.en : '',
                    audio_ar: data.voices && data.voices.ar ? data.voices.ar : '',
                    audio_en: data.voices && data.voices.en ? data.voices.en : '',
                };
            });
        }
        allCardData = categoriesData;
        
        populateTopicButtons(); // بناء أزرار المواضيع بعد جلب البيانات
        createBoard(); // بناء اللوحة لأول مرة
        
    } catch (error) {
        console.error('فشل في جلب بيانات البطاقات من Firestore:', error);
        gameStatusDisplay.textContent = (currentLanguage === 'ar' ? 'فشل تحميل البيانات. تحقق من اتصال الإنترنت.' : 'Failed to load data. Check internet connection.');
    }
}

// وظيفة لخلط المصفوفة (خوارزمية Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// وظيفة لإنشاء لوحة اللعبة بالبطاقات
function createBoard() {
    if (!gameBoard) {
        console.error("Game board element not found.");
        return;
    }
    gameBoard.innerHTML = ''; // مسح أي بطاقات سابقة
    gameStatusDisplay.textContent = ''; // مسح رسائل الحالة

    flippedCards = [];
    matchedPairs = 0;
    lockBoard = false;

    const selectedTopicItems = allCardData[currentTopic];
    if (!selectedTopicItems || selectedTopicItems.length < 6) {
        console.warn(`لا توجد بيانات كافية للموضوع ${currentTopic} أو الموضوع غير موجود.`);
        gameStatusDisplay.textContent = (currentLanguage === 'ar' ? 'لا توجد بيانات كافية لهذا الموضوع.' : 'Not enough data for this topic.');
        return;
    }

    // اختيار 6 عناصر عشوائية من الموضوع لإنشاء 6 أزواج (12 بطاقة)
    const shuffledTopicItems = shuffleArray([...selectedTopicItems]); // عمل نسخة لتجنب تغيير الأصل
    const chosenItems = shuffledTopicItems.slice(0, 6);

    const gameCardsForMode = [];

    chosenItems.forEach(item => {
        // إضافة نوع البطاقة إلى البيانات (صورة، كلمة، حرف، صوت)
        if (currentPlayMode === 'image-image') {
            gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, text_ar: item.name_ar, text_en: item.name_en });
            gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, text_ar: item.name_ar, text_en: item.name_en });
        }
        else if (currentPlayMode === 'image-word') {
            gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, text_ar: item.name_ar, text_en: item.name_en });
            gameCardsForMode.push({ type: 'word', value: (currentLanguage === 'ar' ? item.name_ar : item.name_en), id: item.id, text_ar: item.name_ar, text_en: item.name_en });
        }
        else if (currentPlayMode === 'image-char') {
            if (item.letter_ar && item.letter_en) {
                gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, text_ar: item.name_ar, text_en: item.name_en });
                gameCardsForMode.push({ type: 'char', value: (currentLanguage === 'ar' ? item.letter_ar : item.letter_en), id: item.id, text_ar: item.name_ar, text_en: item.name_en });
            } else {
                console.warn(`لا يوجد حرف لـ ${item.id} في الموضوع ${currentTopic}. سيتم تخطي هذا العنصر لهذا النمط.`);
            }
        }
        else if (currentPlayMode === 'image-audio') {
            if (item.audio_ar && item.audio_en) {
                gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, text_ar: item.name_ar, text_en: item.name_en });
                // ملاحظة: مسار الصوت يعتمد على اللغة الحالية
                gameCardsForMode.push({ type: 'audio', value: `audio/${currentLanguage}/${currentTopic}/${currentLanguage === 'ar' ? item.audio_ar : item.audio_en}`, id: item.id, text_ar: item.name_ar, text_en: item.name_en, image_url_for_audio_card: `images/${currentTopic}/${item.image_name}` });
            } else {
                console.warn(`لا يوجد صوت لـ ${item.id} في الموضوع ${currentTopic}. سيتم تخطي هذا العنصر لهذا النمط.`);
            }
        }
    });

    if (gameCardsForMode.length < 12) {
         gameStatusDisplay.textContent = (currentLanguage === 'ar' ? 'لا توجد عناصر كافية لهذا النمط والموضوع.' : 'Not enough items for this mode and topic.');
         console.error("Not enough cards generated for the selected mode.");
         return;
    }

    const shuffledCards = shuffleArray(gameCardsForMode);

    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.cardType = card.type; // لتحديد نوع البطاقة عند المطابقة

        let frontContent = '';
        let cardText = currentLanguage === 'ar' ? card.text_ar : card.text_en;

        if (card.type === 'image') {
            frontContent = `<img src="${card.value}" alt="${card.id}">`;
        } else if (card.type === 'word' || card.type === 'char') {
            frontContent = `<span class="card-display-text">${card.value}</span>`;
        } else if (card.type === 'audio') {
            frontContent = `
                <img src="${card.image_url_for_audio_card}" alt="${card.id}">
                <audio src="${card.value}" preload="auto"></audio>
                <button class="play-audio-btn">▶</button>
            `;
        }

        cardElement.innerHTML = `
            <div class="front-face">
                ${frontContent}
                <span class="card-text">${cardText}</span>
            </div>
            <div class="back-face"></div>
        `;
        
        if (card.type === 'audio') {
            const playButton = cardElement.querySelector('.play-audio-btn');
            if (playButton) {
                playButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const audio = cardElement.querySelector('audio');
                    if (audio) {
                        playAudio(audio.src); // استخدام دالة playAudio من audio-handler.js
                    }
                });
            }
        }

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });

    cards = document.querySelectorAll('.memory-card');
}

// وظيفة قلب البطاقة
function flipCard() {
    if (lockBoard) return;
    if (this === flippedCards[0]) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        lockBoard = true; // اقفل اللوحة لمنع النقر أثناء المقارنة
        checkForMatch();
    }
}

// وظيفة التحقق من التطابق
function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;
    const firstCardId = firstCard.dataset.cardId;
    const secondCardId = secondCard.dataset.cardId;
    const firstCardType = firstCard.dataset.cardType;
    const secondCardType = secondCard.dataset.cardType;

    let isMatch = false;

    if (firstCardId === secondCardId) {
        // هنا نحدد قواعد المطابقة بناءً على النمط
        if (currentPlayMode === 'image-image') {
            isMatch = (firstCardType === 'image' && secondCardType === 'image');
        } else if (currentPlayMode === 'image-word') {
            isMatch = (
                (firstCardType === 'image' && secondCardType === 'word') ||
                (firstCardType === 'word' && secondCardType === 'image')
            );
        } else if (currentPlayMode === 'image-char') {
             isMatch = (
                (firstCardType === 'image' && secondCardType === 'char') ||
                (firstCardType === 'char' && secondCardType === 'image')
            );
        } else if (currentPlayMode === 'image-audio') {
             isMatch = (
                (firstCardType === 'image' && secondCardType === 'audio') ||
                (firstCardType === 'audio' && secondCardType === 'image')
            );
        }
    }

    if (isMatch) {
        disableCards();
        matchedPairs++;
        gameStatusDisplay.textContent = (currentLanguage === 'ar' ? 'لقد وجدت زوجًا!' : 'You found a pair!');
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
            recordActivity(currentUser, currentTopic); // تسجيل نشاط +1 نقطة 
        }

        if (matchedPairs === 6) { // 6 أزواج = 12 بطاقة
            setTimeout(() => {
                gameStatusDisplay.textContent = (currentLanguage === 'ar' ? 'تهانينا! لقد فزت باللعبة!' : 'Congratulations! You won the game!');
            }, 500);
        }
    } else {
        unflipCards();
        gameStatusDisplay.textContent = (currentLanguage === 'ar' ? 'حاول مرة أخرى.' : 'Try again.');
    }
}

// وظيفة تعطيل البطاقات المتطابقة (تبقى مفتوحة)
function disableCards() {
    flippedCards.forEach(card => {
        card.removeEventListener('click', flipCard); // منع النقر عليها مرة أخرى
        card.classList.add('matched'); // إضافة فئة لتحديد أنها متطابقة وتبقى مفتوحة
    });
    resetBoard();
}

// وظيفة إعادة قلب البطاقات غير المتطابقة
function unflipCards() {
    setTimeout(() => {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        resetBoard();
    }, 1000); // انتظر 1 ثانية قبل قلب البطاقات مرة أخرى
}

// وظيفة إعادة تعيين حالة اللوحة
function resetBoard() {
    [flippedCards, lockBoard] = [[], false];
}

// تحديث نص البطاقات عند تغيير اللغة
function updateCardTexts() {
    cards.forEach(cardElement => {
        const cardId = cardElement.dataset.cardId;
        const cardType = cardElement.dataset.cardType;
        const topicItems = allCardData[currentTopic];
        const originalItem = topicItems ? topicItems.find(data => data.id === cardId) : null;

        if (originalItem) {
            const cardTextSpan = cardElement.querySelector('.card-text');
            if (cardTextSpan) {
                cardTextSpan.textContent = currentLanguage === 'ar' ? originalItem.name_ar : originalItem.name_en;
            }

            // إذا كانت بطاقة من نوع 'word' أو 'char'، قد تحتاج لتحديث المحتوى الرئيسي
            if (cardType === 'word') {
                 const displaySpan = cardElement.querySelector('.card-display-text');
                 if(displaySpan) displaySpan.textContent = currentLanguage === 'ar' ? originalItem.name_ar : originalItem.name_en;
            } else if (cardType === 'char') {
                const displaySpan = cardElement.querySelector('.card-display-text');
                if(displaySpan) displaySpan.textContent = currentLanguage === 'ar' ? originalItem.letter_ar : originalItem.letter_en;
            } else if (cardType === 'audio') {
                // تحديث مسار الصوت للبطاقة الصوتية
                const audioElem = cardElement.querySelector('audio');
                if(audioElem) audioElem.src = `audio/${currentLanguage}/${currentTopic}/${currentLanguage === 'ar' ? originalItem.audio_ar : originalItem.audio_en}`;
            }
        }
    });
    // تحديث رسالة حالة اللعبة باللغة الجديدة
    if (gameStatusDisplay.textContent) {
        // لا يوجد مفتاح ترجمة هنا، لذا فقط إعادة تعيين إذا كنت تريد ترجمتها
        // وإلا، ستبقى كما هي حتى يتم العثور على زوج جديد
    }
}

// وظيفة لملء أزرار المواضيع ديناميكيًا
const topicSelectionDiv = document.querySelector('.topic-selection');
export function populateTopicButtons() {
    if (!topicSelectionDiv) {
        console.error("Topic selection div not found.");
        return;
    }
    topicSelectionDiv.innerHTML = '<h3>اختر الموضوع:</h3>'; // مسح الأزرار القديمة

    // الحصول على قائمة الفئات من البيانات المجلوبة
    const categories = Object.keys(allCardData);
    
    // الأزرار الفعلية التي سيتم استخدامها في الشريط الجانبي
    const sidebarTopicButtons = [];

    categories.forEach(topicKey => {
        const button = document.createElement('button');
        button.id = `memory-game-topic-${topicKey}`;
        button.classList.add('memory-game-topic-button');
        button.textContent = topicKey.charAt(0).toUpperCase() + topicKey.slice(1); // تحويل الاسم الأول لحرف كبير

        if (topicKey === currentTopic) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            // تحديث حالة الأزرار المرئية في الشريط الجانبي
            document.querySelectorAll('.memory-game-topic-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentTopic = topicKey;
            createBoard(); // إعادة إنشاء اللوحة بالموضوع الجديد
        });
        topicSelectionDiv.appendChild(button);
        sidebarTopicButtons.push(button);
    });
    // تحديث المتغير topicButtons ليعكس الأزرار الجديدة
    topicButtons = sidebarTopicButtons;
}

// وظيفة لتهيئة عناصر التحكم في الشريط الجانبي للعبة الذاكرة
export async function initializeMemoryGameSidebarControls() {
    // هذه الدالة ستُستدعى من index.html بعد تحميل محتوى اللعبة وSidebar
    // لا حاجة لتهيئة langButtons, modeButtons, startGameButton هنا
    // حيث تم ذلك في setupEventListeners()
    // populateTopicButtons() يتم استدعاؤها في fetchCardData()

    // التأكد من أن قوائم اختيار اللغة والصوت في الشريط الجانبي تحتوي على خياراتها
    // أزرار اللغة موجودة بالفعل في HTML ومُعالجة بواسطة setupEventListeners
    // أزرار المواضيع تُنشأ بواسطة populateTopicButtons
    // أزرار نمط اللعب موجودة بالفعل في HTML ومُعالجة بواسطة setupEventListeners
}