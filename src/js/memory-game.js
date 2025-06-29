// E:\cyclopedia\src\js\memory-game.js

import { db } from './firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { currentLang, loadLanguage, applyTranslations, setDirection } from './lang-handler.js'; // استيراد currentLang من lang-handler
import { playAudio, stopCurrentAudio } from './audio-handler.js';
import { recordActivity } from './activity-handler.js';

// المتغيرات التي ستستخدم عبر اللعبة، معرفة في النطاق العلوي للوحدة
let gameBoard;
let startGameButton;
let langButtons;
let topicButtons = []; 
let modeButtons;
let gameStatusDisplay;

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let lockBoard = false;

let allCardData = {}; 
let currentTopic = 'animals'; // الموضوع الافتراضي
let currentPlayMode = 'image-image'; // نمط اللعب الافتراضي

// هذه الدالة ستُستدعى من index.html لتحميل محتوى اللعبة وتهيئته في main-content
export async function loadMemoryGameContent() {
    console.log('جارٍ تحميل محتوى لعبة الذاكرة...');

    const mainContentArea = document.querySelector('.main-content');
    // تأكد أن الهيكل الرئيسي للعبة (game-board, game-status) سيُحقن هنا
    mainContentArea.innerHTML = `
        <h1>لعبة الذاكرة</h1>
        <div class="memory-game-grid" id="memory-game-board">
            </div>
        <div class="game-status" id="memory-game-status">
            </div>
    `;

    // الحصول على مراجع عناصر الـ DOM بعد حقن الـ HTML
    // هذا أمر حاسم، تأكد من أن هذه العناصر موجودة فعلاً بعد الـ innerHTML
    gameBoard = document.getElementById('memory-game-board');
    gameStatusDisplay = document.getElementById('memory-game-status');
    
    // جلب البيانات وبناء اللوحة لأول مرة
    // يتم استدعاء populateTopicButtons و createBoard داخل fetchCardData
    await fetchCardData();
}

// **هذه هي الدالة التي كنت تبحث عنها.**
// يجب أن تكون موجودة في هذا الملف (memory-game.js) ومُصدّرة.
// هي مسؤولة عن تهيئة عناصر التحكم في الشريط الجانبي للعبة الذاكرة.
export async function initializeMemoryGameSidebarControls() { // تأكد من وجود 'export' هنا
    console.log("Initializing Memory Game Sidebar Controls...");
    // الحصول على مراجع الأزرار في الشريط الجانبي بعد أن تكون موجودة في الـ DOM
    // تأكد من أن هذه IDs والفئات موجودة في HTML ملف index.html
    startGameButton = document.getElementById('memory-game-start-button');
    langButtons = document.querySelectorAll('.memory-game-lang-button');
    modeButtons = document.querySelectorAll('.memory-game-mode-button');

    // تهيئة المستمعين للأحداث لعناصر التحكم في الشريط الجانبي
    setupEventListeners();
    
    // بعد تهيئة أزرار اللغة، تأكد من تحديث حالتها بناءً على currentLang العالمية
    // currentLang هو المتغير المستورد من lang-handler
    langButtons.forEach(button => {
        if (button.id === `memory-game-lang-${currentLang}`) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // Populate topic buttons if data is already fetched
    // هذا يسمح لـ populateTopicButtons بالعمل حتى لو تم استدعاؤها مبكرًا
    if (Object.keys(allCardData).length > 0) {
        populateTopicButtons();
    } else {
        // إذا لم يتم جلب البيانات بعد، لا تقلق، populateTopicButtons ستُستدعى بعد fetchCardData
        console.log("allCardData is empty, populateTopicButtons will be called after fetchCardData.");
    }
}


function setupEventListeners() {
    // إزالة المستمعين القدامى قبل إضافة الجدد لتجنب التكرار
    if (startGameButton) {
        startGameButton.removeEventListener('click', createBoard);
        startGameButton.addEventListener('click', createBoard);
    }

    if (langButtons) {
        langButtons.forEach(button => {
            button.removeEventListener('click', handleLanguageChange);
            button.addEventListener('click', handleLanguageChange);
        });
    }

    if (modeButtons) {
        modeButtons.forEach(button => {
            button.removeEventListener('click', handleModeChange);
            button.addEventListener('click', handleModeChange);
        });
    }
}

function handleLanguageChange(event) {
    langButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    // تحديث currentLang العالمية باستخدام دالة loadLanguage من lang-handler
    loadLanguage(event.target.id === 'memory-game-lang-ar' ? 'ar' : 'en').then(() => {
        // بعد تحديث اللغة العالمية، قم بتحديث نصوص البطاقات المحلية في اللعبة
        updateCardTexts();
    });
}

function handleModeChange(event) {
    modeButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    currentPlayMode = event.target.id.replace('memory-game-mode-', '');
    createBoard(); // إعادة إنشاء اللوحة بالنمط الجديد
}


async function fetchCardData() {
    if (!db) {
        console.error("Firestore DB not initialized. Cannot fetch data.");
        // استخدام currentLang هنا
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
        
        // بمجرد جلب البيانات، قم بتهيئة أزرار المواضيع
        populateTopicButtons(); 
        createBoard(); // بناء اللوحة لأول مرة
        
    } catch (error) {
        console.error('فشل في جلب بيانات البطاقات من Firestore:', error);
        // استخدام currentLang هنا
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
    // التأكد من أن gameBoard قد تم الحصول على مرجعه
    if (!gameBoard) {
        console.error("Game board element not found in createBoard.");
        return;
    }
    gameBoard.innerHTML = '';
    gameStatusDisplay.textContent = '';

    flippedCards = [];
    matchedPairs = 0;
    lockBoard = false;

    // استخدام currentTopic
    const selectedTopicItems = allCardData[currentTopic];
    if (!selectedTopicItems || selectedTopicItems.length < 6) {
        console.warn(`لا توجد بيانات كافية للموضوع ${currentTopic} أو الموضوع غير موجود.`);
        // استخدام currentLang هنا
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
            // استخدام currentLang هنا
            gameCardsForMode.push({ type: 'word', value: (currentLang === 'ar' ? item.name_ar : item.name_en), id: item.id, text_ar: item.name_ar, text_en: item.name_en });
        }
        else if (currentPlayMode === 'image-char') {
            if (item.letter_ar && item.letter_en) {
                gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, text_ar: item.name_ar, text_en: item.name_en });
                // استخدام currentLang هنا
                gameCardsForMode.push({ type: 'char', value: (currentLang === 'ar' ? item.letter_ar : item.letter_en), id: item.id, text_ar: item.name_ar, text_en: item.name_en });
            } else {
                console.warn(`لا يوجد حرف لـ ${item.id} في الموضوع ${currentTopic}. سيتم تخطي هذا العنصر لهذا النمط.`);
            }
        }
        else if (currentPlayMode === 'image-audio') {
            if (item.audio_ar && item.audio_en) {
                gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, text_ar: item.name_ar, text_en: item.name_en });
                // استخدام currentLang هنا
                gameCardsForMode.push({ type: 'audio', value: `audio/${currentLang}/${currentTopic}/${currentLang === 'ar' ? item.audio_ar : item.audio_en}`, id: item.id, text_ar: item.name_ar, text_en: item.name_en, image_url_for_audio_card: `images/${currentTopic}/${item.image_name}` });
            } else {
                console.warn(`لا يوجد صوت لـ ${item.id} في الموضوع ${currentTopic}. سيتم تخطي هذا العنصر لهذا النمط.`);
            }
        }
    });

    if (gameCardsForMode.length < 12) {
         // استخدام currentLang هنا
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
        // استخدام currentLang هنا
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
        // استخدام currentLang هنا
        gameStatusDisplay.textContent = (currentLang === 'ar' ? 'لقد وجدت زوجًا!' : 'You found a pair!');
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
            recordActivity(currentUser, currentTopic);
        }

        if (matchedPairs === 6) {
            setTimeout(() => {
                // استخدام currentLang هنا
                gameStatusDisplay.textContent = (currentLang === 'ar' ? 'تهانينا! لقد فزت باللعبة!' : 'Congratulations! You won the game!');
            }, 500);
        }
    } else {
        unflipCards();
        // استخدام currentLang هنا
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
                // استخدام currentLang هنا
                cardTextSpan.textContent = currentLang === 'ar' ? originalItem.name_ar : originalItem.name_en;
            }

            if (cardType === 'word') {
                 const displaySpan = cardElement.querySelector('.card-display-text');
                 // استخدام currentLang هنا
                 if(displaySpan) displaySpan.textContent = currentLang === 'ar' ? originalItem.name_ar : originalItem.name_en;
            } else if (cardType === 'char') {
                const displaySpan = cardElement.querySelector('.card-display-text');
                // استخدام currentLang هنا
                if(displaySpan) displaySpan.textContent = currentLang === 'ar' ? originalItem.letter_ar : originalItem.letter_en;
            } else if (cardType === 'audio') {
                const audioElem = cardElement.querySelector('audio');
                // استخدام currentLang هنا (تحديث مسار الصوت)
                if(audioElem) audioElem.src = `audio/${currentLang}/${currentTopic}/${currentLang === 'ar' ? originalItem.audio_ar : originalItem.audio_en}`;
            }
        }
    });
}

const topicSelectionDiv = document.querySelector('#memory-game-sidebar-controls .topic-selection');
export function populateTopicButtons() {
    // التأكد من أن topicSelectionDiv موجود قبل محاولة التفاعل معه
    if (!topicSelectionDiv) {
        console.error("Topic selection div not found in memory game sidebar controls for populateTopicButtons.");
        return;
    }
    topicSelectionDiv.innerHTML = '<h3>اختر الموضوع:</h3>';

    const categories = Object.keys(allCardData);
    
    const sidebarTopicButtons = [];

    categories.forEach(topicKey => {
        const button = document.createElement('button');
        button.id = `memory-game-topic-${topicKey}`;
        button.classList.add('memory-game-topic-button');
        button.textContent = topicKey.charAt(0).toUpperCase() + topicKey.slice(1);

        if (topicKey === currentTopic) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            // استخدام نطاق أكثر تحديدًا للبحث عن الأزرار
            document.querySelectorAll('#memory-game-sidebar-controls .memory-game-topic-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentTopic = topicKey;
            createBoard();
        });
        topicSelectionDiv.appendChild(button);
        sidebarTopicButtons.push(button);
    });
    topicButtons = sidebarTopicButtons;
}