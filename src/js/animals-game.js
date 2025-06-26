import { db } from "./firebase-config.js";
import { getDocs, collection } from "firebase/firestore";
import { currentLang } from "./lang-handler.js";
import { playAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let animals = [];
let currentIndex = 0;
let selectedVoice = "teacher"; // الصوت الافتراضي

const currentUser = JSON.parse(localStorage.getItem("user") || "{}"); // جلب المستخدم الحالي

export async function loadAnimalsGameContent() {
  const mainContentArea = document.querySelector("main.main-content");
  if (!mainContentArea) {
    console.error("Main content area not found.");
    return;
  }

  // حقن الهيكل HTML الخاص بلعبة الحيوانات في منطقة المحتوى الرئيسية
  mainContentArea.innerHTML = `
    <h1 style="text-align: center;">🐾 تعرف على الحيوانات</h1>
    <div class="game-box">
      <img id="animal-image" src="" alt="animal" /> <h2 id="animal-word">---</h2>
      
      <div class="animal-details-section">
        <h3>تفاصيل إضافية:</h3>
        <ul id="animal-details-list">
          <li><strong>اسم الابناء:</strong> <span id="animal-baby">---</span></li>
          <li><strong>اسم الزوجة:</strong> <span id="animal-female">---</span></li>
          <li><strong>الصنف:</strong> <span id="animal-category">---</span></li>
        </ul>
        <div class="animal-description-box">
          <h4>الوصف:</h4>
          <p id="animal-description">---</p>
        </div>
      </div>
      <div class="voice-selection">
        <label for="voice-select">اختر الصوت:</label>
        <select id="voice-select">
          <option value="teacher">المعلم</option>
          <option value="boy">صوت ولد</option>
          <option value="girl">صوت بنت</option>
          <option value="child">صوت طفل</option>
        </select>
      </div>
      <button id="play-sound-btn">🔊 استمع</button>
      <button id="next-animal-btn">التالي ➡️</button>
    </div>
  `;

  // ... (بقية الكود لا تتغير) ...
  // بقية الكود في animals-game.js صحيح
  // ...
}

async function fetchAnimals() { /* ... */ }
function showAnimal(index) { /* ... */ }
function getAudioPath(data, voiceType) { /* ... */ }