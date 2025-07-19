// E:\cyclopedia\src\js\memory-game.js

import { db } from './firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { currentLang, loadLanguage, applyTranslations, setDirection } from './lang-handler.js';
import { playAudio, stopCurrentAudio } from './audio-handler.js';
import { recordActivity } from './activity-handler.js';

// المتغيرات التي ستستخدم عبر اللعبة، معرفة في النطاق العلوي للوحدة
let gameBoard;
let startGameButton;
let langSelect;   // تم تغيير الاسم: كان langButtons
let topicSelect;  // تم إضافة هذا المتغير للتحكم في قائمة الموضوع المنسدلة
let modeSelect;   // تم تغيير الاسم: كان modeButtons
let gameStatusDisplay;

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let lockBoard = false;

let allCardData = {}; 
let currentTopic = 'animals'; 
let currentPlayMode = 'image-image'; 

export async function loadMemoryGameContent() {
    console.log('جارٍ تحميل محتوى لعبة الذاكرة...');

    const mainContentArea = document.querySelector('.main-content');
    mainContentArea.innerHTML = `
       
        <div class="memory-game-grid" id="memory-game-board">
            </div>
        <div class="game-status" id="memory-game-status">
            </div>
    `;

    gameBoard = document.getElementById('memory-game-board');
    gameStatusDisplay = document.getElementById('memory-game-status');
    
    await fetchCardData();
}

export async function initializeMemoryGameSidebarControls() {
    console.log("Initializing Memory Game Sidebar Controls...");
    
    startGameButton = document.getElementById('memory-game-start-button');
    langSelect = document.getElementById('memory-game-lang-select'); // الحصول على مرجع الـ select
    topicSelect = document.getElementById('memory-game-topic-select'); // الحصول على مرجع الـ select
    modeSelect = document.getElementById('memory-game-mode-select'); // الحصول على مرجع الـ select

    setupEventListeners();
    
    // تعيين القيمة الافتراضية للغة ونمط اللعب
    if (langSelect) {
        langSelect.value = currentLang;
    }
    if (modeSelect) {
        modeSelect.value = currentPlayMode;
    }

    // Populate topic options if data is already fetched
    if (Object.keys(allCardData).length > 0) {
        populateTopicOptions(); // استدعاء الدالة الجديدة لملء الـ select
    } else {
        console.log("allCardData is empty, populateTopicOptions will be called after fetchCardData.");
    }
}


function setupEventListeners() {
    if (startGameButton) {
        startGameButton.removeEventListener('click', createBoard);
        startGameButton.addEventListener('click', createBoard);
    }

    if (langSelect) { // تغيير من langButtons
        langSelect.removeEventListener('change', handleLanguageChange); // تغيير الحدث من click إلى change
        langSelect.addEventListener('change', handleLanguageChange);
    }

    if (topicSelect) { // إضافة مستمع حدث للموضوع
        topicSelect.removeEventListener('change', handleTopicChange);
        topicSelect.addEventListener('change', handleTopicChange);
    }

    if (modeSelect) { // تغيير من modeButtons
        modeSelect.removeEventListener('change', handleModeChange); // تغيير الحدث من click إلى change
        modeSelect.addEventListener('change', handleModeChange);
    }
}

function handleLanguageChange(event) {
    // لم يعد هناك حاجة لإزالة/إضافة فئة 'active' مع الـ select
    loadLanguage(event.target.value).then(() => { // استخدام event.target.value
        updateCardTexts();
    });
}

function handleTopicChange(event) { // دالة جديدة للتعامل مع تغيير الموضوع
    currentTopic = event.target.value; // استخدام event.target.value
    createBoard(); // إعادة إنشاء اللوحة بالموضوع الجديد
}

function handleModeChange(event) {
    // لم يعد هناك حاجة لإزالة/إضافة فئة 'active' مع الـ select
    currentPlayMode = event.target.value; // استخدام event.target.value
    createBoard();
}


async function fetchCardData() {
    if (!db) {
        console.error("Firestore DB not initialized. Cannot fetch data.");
        gameStatusDisplay.textContent = (currentLang === 'ar' ? 'فشل إعداد قاعدة البيانات.' : 'Database setup failed.');
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
                // console.log("Firestore Document Data:", data); // يمكنك إزالة هذا بعد التحقق
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
        
        populateTopicOptions(); // استدعاء الدالة الجديدة لملء قائمة المواضيع المنسدلة
        createBoard(); 
        
    } catch (error) {
        console.error('فشل في جلب بيانات البطاقات من Firestore:', error);
        gameStatusDisplay.textContent = (currentLang === 'ar' ? 'فشل تحميل البيانات. تحقق من اتصال الإنترنت.' : 'Failed to load data. Check internet connection.');
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {
    if (!gameBoard) {
        console.error("Game board element not found in createBoard.");
        return;
    }
    gameBoard.innerHTML = '';
    gameStatusDisplay.textContent = '';

    flippedCards = [];
    matchedPairs = 0;
    lockBoard = false;

    const selectedTopicItems = allCardData[currentTopic];
    if (!selectedTopicItems || selectedTopicItems.length < 6) {
        console.warn(`لا توجد بيانات كافية للموضوع ${currentTopic} أو الموضوع غير موجود.`);
        gameStatusDisplay.textContent = (currentLang === 'ar' ? 'لا توجد بيانات كافية لهذا الموضوع.' : 'Not enough data for this topic.');
        return;
    }

    const shuffledTopicItems = shuffleArray([...selectedTopicItems]);
    const chosenItems = shuffledTopicItems.slice(0, 6);

    const gameCardsForMode = [];

    chosenItems.forEach(item => {
        if (currentPlayMode === 'image-image') {
            gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, text_ar: item.name_ar, text_en: item.name_en });
            gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, text_ar: item.name_ar, text_en: item.name_en });
        }
        else if (currentPlayMode === 'image-word') {
            gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, text_ar: item.name_ar, text_en: item.name_en });
            gameCardsForMode.push({ type: 'word', value: (currentLang === 'ar' ? item.name_ar : item.name_en), id: item.id, text_ar: item.name_ar, text_en: item.name_en });
        }
        else if (currentPlayMode === 'image-char') {
            if (item.letter_ar && item.letter_en) {
                gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, text_ar: item.name_ar, text_en: item.name_en });
                gameCardsForMode.push({ type: 'char', value: (currentLang === 'ar' ? item.letter_ar : item.letter_en), id: item.id, text_ar: item.name_ar, text_en: item.name_en });
            } else {
                console.warn(`لا يوجد حرف لـ ${item.id} في الموضوع ${currentTopic}. سيتم تخطي هذا العنصر لهذا النمط.`);
            }
        }
        else if (currentPlayMode === 'image-audio') {
            if (item.audio_ar && item.audio_en) {
                gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, text_ar: item.name_ar, text_en: item.name_en });
                gameCardsForMode.push({ type: 'audio', value: `audio/${currentLang}/${currentTopic}/${currentLang === 'ar' ? item.audio_ar : item.audio_en}`, id: item.id, text_ar: item.name_ar, text_en: item.name_en, image_url_for_audio_card: `images/${currentTopic}/${item.image_name}` });
            } else {
                console.warn(`لا يوجد صوت لـ ${item.id} في الموضوع ${currentTopic}. سيتم تخطي هذا العنصر لهذا النمط.`);
            }
        }
    });

    if (gameCardsForMode.length < 12) {
         gameStatusDisplay.textContent = (currentLang === 'ar' ? 'لا توجد عناصر كافية لهذا النمط والموضوع.' : 'Not enough items for this mode and topic.');
         console.error("Not enough cards generated for the selected mode.");
         return;
    }

    const shuffledCards = shuffleArray(gameCardsForMode);

    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.cardType = card.type;

        let frontContent = '';
        let cardText = currentLang === 'ar' ? card.text_ar : card.text_en;

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
                        playAudio(audio.src);
                    }
                });
            }
        }

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });

    cards = document.querySelectorAll('.memory-card');
}

function flipCard() {
    if (lockBoard) return;
    if (this === flippedCards[0]) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        lockBoard = true;
        checkForMatch();
    }
}

function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;
    const firstCardId = firstCard.dataset.cardId;
    const secondCardId = secondCard.dataset.cardId;
    const firstCardType = firstCard.dataset.cardType;
    const secondCardType = secondCard.dataset.cardType;

    let isMatch = false;

    if (firstCardId === secondCardId) {
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
        gameStatusDisplay.textContent = (currentLang === 'ar' ? 'لقد وجدت زوجًا!' : 'You found a pair!');
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
            recordActivity(currentUser, currentTopic);
        }

        if (matchedPairs === 6) {
            setTimeout(() => {
                gameStatusDisplay.textContent = (currentLang === 'ar' ? 'تهانينا! لقد فزت باللعبة!' : 'Congratulations! You won the game!');
            }, 500);
        }
    } else {
        unflipCards();
        gameStatusDisplay.textContent = (currentLang === 'ar' ? 'حاول مرة أخرى.' : 'Try again.');
    }
}

function disableCards() {
    flippedCards.forEach(card => {
        card.removeEventListener('click', flipCard);
        card.classList.add('matched');
    });
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [flippedCards, lockBoard] = [[], false];
}

function updateCardTexts() {
    cards.forEach(cardElement => {
        const cardId = cardElement.dataset.cardId;
        const cardType = cardElement.dataset.cardType;
        const topicItems = allCardData[currentTopic];
        const originalItem = topicItems ? topicItems.find(data => data.id === cardId) : null;

        if (originalItem) {
            const cardTextSpan = cardElement.querySelector('.card-text');
            if (cardTextSpan) {
                cardTextSpan.textContent = currentLang === 'ar' ? originalItem.name_ar : originalItem.name_en;
            }

            if (cardType === 'word') {
                 const displaySpan = cardElement.querySelector('.card-display-text');
                 if(displaySpan) displaySpan.textContent = currentLang === 'ar' ? originalItem.name_ar : originalItem.name_en;
            } else if (cardType === 'char') {
                const displaySpan = cardElement.querySelector('.card-display-text');
                if(displaySpan) displaySpan.textContent = currentLang === 'ar' ? originalItem.letter_ar : originalItem.letter_en;
            } else if (cardType === 'audio') {
                const audioElem = cardElement.querySelector('audio');
                if(audioElem) audioElem.src = `audio/${currentLang}/${currentTopic}/${currentLang === 'ar' ? originalItem.audio_ar : originalItem.audio_en}`;
            }
        }
    });
}

// دالة populateTopicButtons الأصلية التي كانت تنشئ أزرار
// الآن سنغيرها لـ populateTopicOptions (جديدة) لتعمل مع الـ select
// const topicSelectionDiv = document.querySelector('#memory-game-sidebar-controls .topic-selection');
// export function populateTopicButtons() { ... }

// الدالة الجديدة لملء قائمة المواضيع المنسدلة
export function populateTopicOptions() { // تم تغيير الاسم
    const topicSelectElement = document.getElementById('memory-game-topic-select'); // الحصول على الـ select
    if (!topicSelectElement) {
        console.error("Topic select element not found in memory game sidebar controls.");
        return;
    }
    topicSelectElement.innerHTML = ''; // مسح الخيارات القديمة

    const categories = Object.keys(allCardData);
    
    categories.forEach(topicKey => {
        const option = document.createElement('option');
        option.value = topicKey;
        // يمكنك استخدام الترجمة هنا إذا كان لديك ترجمة لأسماء الفئات
        option.textContent = topicKey.charAt(0).toUpperCase() + topicKey.slice(1); // مثال: تحويل "animals" إلى "Animals"
        
        topicSelectElement.appendChild(option);
    });

    // تعيين القيمة الافتراضية للـ select بناءً على currentTopic
    topicSelectElement.value = currentTopic;
}