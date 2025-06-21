// src/js/vegetables.js
import { db } from './firebase-config.js'; // تأكد أن المسار صحيح
import { collection, getDocs } from 'firebase/firestore';
import { playAudio } from './audio-handler.js';
import { loadLanguage } from './lang-handler.js';

const lang = localStorage.getItem('language') || 'en';
const category = 'vegetables';
let data = [];

document.addEventListener('DOMContentLoaded', async () => {
  document.documentElement.lang = lang;
  document.body.setAttribute("dir", lang === "ar" || lang === "he" ? "rtl" : "ltr");

  await loadLanguage(lang);
  data = await fetchCategoryData();

  if (data.length > 0) {
    renderKeyboard(data);
  }
});

async function fetchCategoryData() {
  try {
    const snapshot = await getDocs(collection(db, category));
    return snapshot.docs.map(doc => doc.data());
  } catch (err) {
    console.error(`Error fetching ${category} data:`, err);
    return [];
  }
}

function renderKeyboard(items) {
  const keyboardSection = document.getElementById('keyboard');
  keyboardSection.innerHTML = '';

  const uniqueLetters = [...new Set(items.map(item => item.letter?.[lang]))].sort();
  uniqueLetters.forEach(letter => {
    const btn = document.createElement('button');
    btn.textContent = letter;
    btn.addEventListener('click', () => handleLetterClick(letter));
    keyboardSection.appendChild(btn);
  });
}

function handleLetterClick(letter) {
  const match = data.find(item => item.letter?.[lang] === letter);
  if (match) displayItem(match);
}

function displayItem(item) {
  const imageEl = document.getElementById('itemImage');
  const nameEl = document.getElementById('itemName');

  imageEl.src = `images/${category}/${item.image}`;
  nameEl.textContent = item.word?.[lang] || '—';
  playAudio(`audio/${category}/${item.audio}`);
}
