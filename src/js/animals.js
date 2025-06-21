import { db } from './firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';

const lang = localStorage.getItem("language") || "en";
const category = "animals";
let data = [];

async function loadCategoryItems() {
  try {
    const colRef = collection(db, "categories", category, "items");
    const snapshot = await getDocs(colRef);
    snapshot.forEach(doc => {
      data.push(doc.data());
    });

    renderKeyboard();
  } catch (err) {
    console.error("Error loading category items:", err);
  }
}

function renderKeyboard() {
  const keyboard = document.getElementById("keyboard");
  const letters = [...new Set(data.map(item => item.letter[lang]))];

  keyboard.innerHTML = "";
  letters.forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.addEventListener("click", () => showItem(letter));
    keyboard.appendChild(btn);
  });
}

function showItem(letter) {
  const match = data.find(item => item.letter[lang] === letter);
  if (!match) return;

  document.getElementById("itemName").textContent = match.name[lang];
  document.getElementById("itemImage").src = `/images/animals/${match.image}`;
  const audio = document.getElementById("itemAudio");
  audio.src = `/audio/animals/${match.sound_base}`;
  audio.play().catch(err => console.warn("Audio error:", err));
}

loadCategoryItems();
