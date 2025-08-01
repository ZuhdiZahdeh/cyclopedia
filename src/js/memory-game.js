// E:\cyclopedia\src\js\memory-game.js
// E:\cyclopedia\src\js\memory-game.js

import { db } from './firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from './lang-handler.js';
import { playAudio, stopCurrentAudio } from './audio-handler.js';
import { recordActivity } from './activity-handler.js';

// المتغيرات التي ستستخدم عبر اللعبة، معرفة في النطاق العلوي للوحدة
let gameBoard;
let startGameButton;
let langSelect;
let topicSelect;
let modeSelect;
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
    langSelect = document.getElementById('memory-game-lang-select');
    topicSelect = document.getElementById('memory-game-topic-select');
    modeSelect = document.getElementById('memory-game-mode-select');

    setupEventListeners();
const lang = getCurrentLang();
    // تعيين القيمة الافتراضية للغة ونمط اللعب
    if (langSelect) {
        langSelect.value = lang;
    }
    if (modeSelect) {
        modeSelect.value = currentPlayMode;
    }

    // Populate topic options if data is already fetched
    if (Object.keys(allCardData).length > 0) {
        populateTopicOptions();
    } else {
        console.log("allCardData is empty, populateTopicOptions will be called after fetchCardData.");
    }
}

function setupEventListeners() {
    if (startGameButton) {
        startGameButton.removeEventListener('click', createBoard);
        startGameButton.addEventListener('click', createBoard);
    }

    if (langSelect) {
        langSelect.removeEventListener('change', handleLanguageChange);
        langSelect.addEventListener('change', handleLanguageChange);
    }

    if (topicSelect) {
        topicSelect.removeEventListener('change', handleTopicChange);
        topicSelect.addEventListener('change', handleTopicChange);
    }

    if (modeSelect) {
        modeSelect.removeEventListener('change', handleModeChange);
        modeSelect.addEventListener('change', handleModeChange);
    }
}

function handleLanguageChange(event) {
    loadLanguage(event.target.value).then(() => {
        // تحديث اتجاه الصفحة بناءً على اللغة الجديدة
        setDirection(event.target.value);
        updateCardTexts();
    });
}

function handleTopicChange(event) {
    currentTopic = event.target.value;
    createBoard(); // إعادة إنشاء اللوحة بالموضوع الجديد
}

function handleModeChange(event) {
    currentPlayMode = event.target.value;
    createBoard();
}

/**
 * دالة مساعدة للحصول على النص أو مسار الصوت أو الحرف الصحيح بناءً على اللغة الحالية.
 * @param {object} item - كائن البيانات للعنصر (من Firebase).
 * @param {string} type - نوع البيانات المطلوب ('name', 'letter', 'audio').
 * @returns {string} النص أو مسار الصوت أو الحرف المناسب للغة الحالية.
 */
function getTextForCurrentLang(item, type) {
    const lang = getCurrentLang();
    if (type === 'name') return item[`name_${lang}`];
    if (type === 'letter') return item[`letter_${lang}`];
    if (type === 'audio') return item[`audio_${lang}`];
    return ''; // أو يمكن أن تكون قيمة افتراضية مناسبة
}


async function fetchCardData() {
	const lang = getCurrentLang();
    if (!db) {
        console.error("Firestore DB not initialized. Cannot fetch data.");
        gameStatusDisplay.textContent = (lang === 'ar' ? 'فشل إعداد قاعدة البيانات.' : 'Database setup failed.');
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
                    name_he: data.name.he || '', // أضف جلب الاسم العبري
                    letter_ar: data.letter ? data.letter.ar : '',
                    letter_en: data.letter ? data.letter.en : '',
                    letter_he: data.letter ? data.letter.he : '', // أضف جلب الحرف العبري
                    audio_ar: data.voices && data.voices.ar ? data.voices.ar : '',
                    audio_en: data.voices && data.voices.en ? data.voices.en : '',
                    audio_he: data.voices && data.voices.he ? data.voices.he : '', // أضف جلب الصوت العبري
                };
            });
        }
        allCardData = categoriesData;

        populateTopicOptions();
        createBoard();

    } catch (error) {
        console.error('فشل تحميل البيانات:', error);
        gameStatusDisplay.textContent = (lang === 'ar' ? 'فشل تحميل البيانات.' : lang === 'he' ? 'שגיאה בטעינת נתונים' : 'Failed to load data.');
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
	const lang = getCurrentLang();
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
        gameStatusDisplay.textContent = (lang === 'ar' ? 'لا توجد بيانات كافية لهذا الموضوع.' : 'Not enough data for this topic.');
        return;
    }

    const shuffledTopicItems = shuffleArray([...selectedTopicItems]);
    const chosenItems = shuffledTopicItems.slice(0, 6); // نختار 6 عناصر لإنشاء 12 بطاقة

    const gameCardsForMode = [];

    chosenItems.forEach(item => {
        // بيانات النص لجميع اللغات لحفظها في البطاقة
        const cardTextData = {
            text_ar: item.name_ar,
            text_en: item.name_en,
            text_he: item.name_he
        };

        if (currentPlayMode === 'image-image') {
            gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, ...cardTextData });
            gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, ...cardTextData });
        }
        else if (currentPlayMode === 'image-word') {
            // تحقق من وجود الاسم باللغة العبرية قبل إضافته
            if (item.name_he) {
                gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, ...cardTextData });
                // استخدام getTextForCurrentLang للحصول على النص المناسب للغة الحالية
                gameCardsForMode.push({ type: 'word', value: getTextForCurrentLang(item, 'name'), id: item.id, ...cardTextData });
            } else {
                console.warn(`لا يوجد اسم عبري لـ ${item.id} في الموضوع ${currentTopic}. سيتم تخطي هذا العنصر لهذا النمط.`);
            }
        }
        else if (currentPlayMode === 'image-char') {
            // تحقق من وجود الحروف في جميع اللغات
            if (item.letter_ar && item.letter_en && item.letter_he) {
                gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, ...cardTextData });
                // استخدام getTextForCurrentLang للحصول على الحرف المناسب للغة الحالية
                gameCardsForMode.push({ type: 'char', value: getTextForCurrentLang(item, 'letter'), id: item.id, ...cardTextData });
            } else {
                console.warn(`لا يوجد حرف لـ ${item.id} في الموضوع ${currentTopic} لجميع اللغات المطلوبة. سيتم تخطي هذا العنصر لهذا النمط.`);
            }
        }
        else if (currentPlayMode === 'image-audio') {
            // تحقق من وجود الصوتيات في جميع اللغات
            if (item.audio_ar && item.audio_en && item.audio_he) {
                gameCardsForMode.push({ type: 'image', value: `images/${currentTopic}/${item.image_name}`, id: item.id, ...cardTextData });
                // استخدام getTextForCurrentLang للحصول على مسار الصوت المناسب للغة الحالية
                gameCardsForMode.push({
                    type: 'audio',
                    value: `audio/${lang}/${currentTopic}/${getTextForCurrentLang(item, 'audio')}`,
                    id: item.id,
                    ...cardTextData,
                    image_url_for_audio_card: `images/${currentTopic}/${item.image_name}`
                });
            } else {
                console.warn(`لا يوجد صوت لـ ${item.id} في الموضوع ${currentTopic} لجميع اللغات المطلوبة. سيتم تخطي هذا العنصر لهذا النمط.`);
            }
        }
    });

    // يجب أن تكون هناك 12 بطاقة (6 أزواج) للعبة كاملة
    if (gameCardsForMode.length < 12) {
         gameStatusDisplay.textContent = (lang === 'ar' ? 'لا توجد عناصر كافية لهذا النمط والموضوع.' : 'Not enough items for this mode and topic.');
         console.error("Not enough cards generated for the selected mode. Generated:", gameCardsForMode.length);
         return;
    }

    const shuffledCards = shuffleArray(gameCardsForMode);

    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.cardType = card.type;

        let frontContent = '';

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

        // ✨ نقل هذا الجزء ليأتي بعد تعيين innerHTML ✨
        if (card.type === 'word' || card.type === 'char') {
            const displaySpan = cardElement.querySelector('.card-display-text');
            if (displaySpan) { // تحقق مرة أخرى للتأكد من وجود العنصر
                if (lang === 'he') {
                    displaySpan.style.direction = 'rtl';
                } else {
                    displaySpan.style.direction = 'ltr';
                }
            }
        }
        // ✨ نهاية الجزء المنقول ✨

        if (card.type === 'audio') {
            const playButton = cardElement.querySelector('.play-audio-btn');
            if (playButton) {
                playButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // منع قلب البطاقة عند النقر على زر التشغيل
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
    // التأكد أن البطاقة ليست هي نفسها التي تم قلبها أولاً
    if (this === flippedCards[0]) return;
    // منع قلب البطاقات المطابقة مرة أخرى
    if (this.classList.contains('matched')) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    // إذا كانت البطاقة التي تم قلبها من نوع "صوت"، قم بتشغيل الصوت
    if (this.dataset.cardType === 'audio') {
        const audio = this.querySelector('audio');
        if (audio) {
            playAudio(audio.src);
        }
    }


    if (flippedCards.length === 2) {
        lockBoard = true;
        checkForMatch();
    }
}

function checkForMatch() {
	const lang = getCurrentLang();
    const [firstCard, secondCard] = flippedCards;
    const firstCardId = firstCard.dataset.cardId;
    const secondCardId = secondCard.dataset.cardId;
    const firstCardType = firstCard.dataset.cardType;
    const secondCardType = secondCard.dataset.cardType;

    let isMatch = false;

    // الشرط الأساسي للمطابقة هو تطابق الـ ID
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
        gameStatusDisplay.textContent = (lang === 'ar' ? 'لقد وجدت زوجًا!' : lang === 'he' ? 'מצאת זוג!' : 'You found a pair!');
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
            recordActivity(currentUser, currentTopic);
        }

        if (matchedPairs === 6) { // 6 أزواج تعني نهاية اللعبة (12 بطاقة)
            setTimeout(() => {
                gameStatusDisplay.textContent = (lang === 'ar' ? 'تهانينا! لقد فزت باللعبة!' : lang === 'he' ? 'מזל טוב! ניצחת במשחק!' : 'Congratulations! You won the game!');
            }, 500);
        }
    } else {
        unflipCards();
        gameStatusDisplay.textContent = (lang === 'ar' ? 'حاول مرة أخرى.' : lang === 'he' ? 'נסה שוב.' : 'Try again.');
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
	const lang = getCurrentLang();
	
    cards.forEach(cardElement => {
        const cardId = cardElement.dataset.cardId;
        const cardType = cardElement.dataset.cardType;
        const topicItems = allCardData[currentTopic];
        const originalItem = topicItems ? topicItems.find(data => data.id === cardId) : null;

        if (originalItem) {
            // تحديث محتوى البطاقة بناءً على نوعها واللغة الحالية
            const displaySpan = cardElement.querySelector('.card-display-text');
            if (displaySpan) {
                if (cardType === 'word') {
                    displaySpan.textContent = getTextForCurrentLang(originalItem, 'name');
                } else if (cardType === 'char') {
                    displaySpan.textContent = getTextForCurrentLang(originalItem, 'letter');
                }

                // تحديث اتجاه النص للبطاقات النصية عند تغيير اللغة
                if (cardType === 'word' || cardType === 'char') {
                    if (lang === 'he') {
                        displaySpan.style.direction = 'rtl';
                    } else {
                        displaySpan.style.direction = 'ltr';
                    }
                }
            }

            // تحديث مسار الصوت لبطاقات الصوت
            if (cardType === 'audio') {
                const audioElem = cardElement.querySelector('audio');
                if (audioElem) {
                    audioElem.src = `audio/${lang}/${currentTopic}/${getTextForCurrentLang(originalItem, 'audio')}`;
                }
            }
        }
    });
}

export function populateTopicOptions() {
    const topicSelectElement = document.getElementById('memory-game-topic-select');
    if (!topicSelectElement) {
        console.error("Topic select element not found in memory game sidebar controls.");
        return;
    }
    topicSelectElement.innerHTML = ''; // مسح الخيارات القديمة

    const categories = Object.keys(allCardData);

    categories.forEach(topicKey => {
        const option = document.createElement('option');
        option.value = topicKey;
        // هنا يمكنك إضافة ترجمة لأسماء الفئات إذا كانت متوفرة لديك
        // حالياً، يتم عرض اسم المفتاح Capitalized
        option.textContent = topicKey.charAt(0).toUpperCase() + topicKey.slice(1);

        topicSelectElement.appendChild(option);
    });

    // تعيين القيمة الافتراضية للـ select بناءً على currentTopic
    topicSelectElement.value = currentTopic;
}