// memory-game.js (نسخة محدثة تدعم جميع المواضيع)

import { db } from "./firebase-config.js";
import { collection, getDocs } from "firebase/firestore";
import { currentLang } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let allMemoryItems = [];
let currentTopic = 'animals';
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let totalPairs = 0;

const memoryTopics = [
  { id: 'animals', label_ar: 'حيوانات', label_en: 'Animals', label_he: 'חיות' },
  { id: 'fruits', label_ar: 'فواكه', label_en: 'Fruits', label_he: 'פירות' },
  { id: 'vegetables', label_ar: 'خضروات', label_en: 'Vegetables', label_he: 'ירקות' },
  { id: 'human-body', label_ar: 'جسم الإنسان', label_en: 'Human Body', label_he: 'גוף האדם' }
];

export async function loadMemoryGameContent() {
  const mainContent = document.querySelector("main.main-content");
  if (!mainContent) return;

  const response = await fetch("/html/memory-game.html");
  const html = await response.text();
  mainContent.innerHTML = html;

  populateTopicOptions();
  document.getElementById("memory-game-topic-select").addEventListener("change", async (e) => {
    currentTopic = e.target.value;
    await startMemoryGame();
  });

  document.getElementById("restart-memory-game-btn").addEventListener("click", startMemoryGame);
  await startMemoryGame();
}

export function populateTopicOptions() {
  const topicSelectElement = document.getElementById('memory-game-topic-select');
  if (!topicSelectElement) {
    console.error("❌ عنصر اختيار المواضيع غير موجود.");
    return;
  }

  topicSelectElement.innerHTML = '';
  memoryTopics.forEach(topic => {
    const option = document.createElement('option');
    option.value = topic.id;
    option.textContent = topic[`label_${currentLang}`] || topic.label_en;
    topicSelectElement.appendChild(option);
  });
  topicSelectElement.value = currentTopic;
}

async function startMemoryGame() {
  stopCurrentAudio();
  const memoryGrid = document.getElementById("memory-game-grid");
  if (!memoryGrid) return;

  allMemoryItems = await fetchItems(currentTopic);
  if (allMemoryItems.length === 0) {
    memoryGrid.innerHTML = '<p>لا توجد بيانات لعرضها.</p>';
    return;
  }

  const selectedItems = shuffle([...allMemoryItems]).slice(0, 6);
  const cards = shuffle([...selectedItems, ...selectedItems]);

  memoryGrid.innerHTML = cards.map((item, index) => `
    <div class="memory-card" data-name="${item.name?.[currentLang] || ''}" data-index="${index}">
      <img class="front-face" src="/images/${currentTopic}/${item.image}" alt="${item.name?.[currentLang] || ''}" />
      <div class="back-face"></div>
    </div>
  `).join('');

  matchedPairs = 0;
  totalPairs = selectedItems.length;
  document.querySelectorAll(".memory-card").forEach(card => {
    card.addEventListener("click", flipCard);
  });
}

function flipCard() {
  if (lockBoard || this === firstCard) return;
  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }
  secondCard = this;
  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  matchedPairs++;
  if (matchedPairs === totalPairs) {
    recordActivity(JSON.parse(localStorage.getItem("user")), `memory-${currentTopic}`);
  }
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function fetchItems(topic) {
  try {
    const snapshot = await getDocs(collection(db, `categories/${topic}/items`));
    return snapshot.docs.map(doc => doc.data());
  } catch (err) {
    console.error("Error fetching items:", err);
    return [];
  }
}
