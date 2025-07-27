// tools-match-game.js
// tools-match-game.js

import { db } from "./firebase-config.js";
import { getDocs, collection, query } from "firebase/firestore";
import { currentLang, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let tools = [];
let professions = [];
let currentTool = null;
let correctProfession = null;
let options = [];

export async function loadToolsMatchGameContent() {
  const mainContentArea = document.querySelector("main.main-content");
  const sidebar = document.querySelector("aside.sidebar");
  if (!mainContentArea || !sidebar) return;

  applyTranslations();
  setDirection(currentLang);

  mainContentArea.innerHTML = `
    <div class="game-box tool-match">
      <h2 data-i18n="who_uses_this_tool">من يستخدم هذه الأداة؟</h2>
      <div id="tool-question-container" class="tool-question-container"></div>
      <div id="profession-options" class="options-box"></div>
    </div>
  `;

  sidebar.innerHTML = `
    <button id="next-tool-btn" class="sidebar-btn" data-i18n="next">التالي</button>
    <button id="change-mode-btn" class="sidebar-btn" data-i18n="change_mode">تغيير الشكل</button>
  `;

  document.getElementById("next-tool-btn").onclick = () => generateNewChallenge();
  document.getElementById("change-mode-btn").onclick = () => switchMode();

  await fetchToolsAndProfessions();
  generateNewChallenge();
}

async function fetchToolsAndProfessions() {
  try {
    const toolsSnap = await getDocs(collection(db, "profession_tools"));
    tools = toolsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const profSnap = await getDocs(collection(db, "professions"));
    professions = profSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching tools or professions:", err);
  }
}

let currentMode = 0;
const modes = ["image-to-images", "word-to-images", "word-to-words"];

function switchMode() {
  currentMode = (currentMode + 1) % modes.length;
  generateNewChallenge();
}

function generateNewChallenge() {
  const tool = tools[Math.floor(Math.random() * tools.length)];
  currentTool = tool;

  const matchingProfs = professions.filter(p => p.tools?.includes(tool.id));
  if (matchingProfs.length === 0) return generateNewChallenge();
  correctProfession = matchingProfs[Math.floor(Math.random() * matchingProfs.length)];

  const wrongOptions = professions.filter(p => !p.tools?.includes(tool.id));
  const shuffledWrong = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
  options = [...shuffledWrong, correctProfession].sort(() => 0.5 - Math.random());

  displayToolAndOptions();
}

function displayToolAndOptions() {
  const container = document.getElementById("tool-question-container");
  const optionsBox = document.getElementById("profession-options");
  container.innerHTML = "";
  optionsBox.innerHTML = "";

  if (modes[currentMode] === "image-to-images") {
    const img = document.createElement("img");
    img.src = `/${currentTool.image_path}`;
    img.alt = currentTool.name?.[currentLang] || "tool";
    img.className = "tool-image";
    container.appendChild(img);

  } else if (modes[currentMode] === "word-to-images") {
    const word = document.createElement("h3");
    word.textContent = currentTool.name?.[currentLang] || "؟";
    container.appendChild(word);

  } else if (modes[currentMode] === "word-to-words") {
    const word = document.createElement("h3");
    word.textContent = currentTool.name?.[currentLang] || "؟";
    container.appendChild(word);
  }

  options.forEach(prof => {
    const btn = document.createElement("button");
    btn.className = "profession-option-btn";

    if (modes[currentMode] === "word-to-words") {
      btn.innerHTML = `<span>${prof.name?.[currentLang]}</span>`;
    } else {
      btn.innerHTML = `
        <img src="/${prof.image_path}" alt="${prof.name?.[currentLang]}" />
        <span>${prof.name?.[currentLang]}</span>
      `;
    }

    btn.onclick = () => handleAnswer(prof);
    optionsBox.appendChild(btn);
  });
}

function handleAnswer(selectedProf) {
  const isCorrect = selectedProf.id === correctProfession.id;
  if (isCorrect) {
    alert("✔️ أحسنت! الإجابة صحيحة.");
    recordActivity(JSON.parse(localStorage.getItem("user")), "tools_match_success");
    playAudio("/audio/success/success_toolMatch_a.mp3");

  } else {
    alert("❌ حاول مرة أخرى.");
    recordActivity(JSON.parse(localStorage.getItem("user")), "tools_match_fail");
    playAudio("/audio/fail/fail_toolMatch_a.mp3");
  }
  setTimeout(generateNewChallenge, 1000);
}
