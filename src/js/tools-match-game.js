import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebase-config.js";
import { currentLang, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let tools = [];
let professions = [];
let currentMode = "image-to-images"; // أو: word-to-images, word-to-words
let currentChallenge = null;

export async function loadToolsMatchGameContent() {
  const mainContent = document.querySelector("main.main-content");
  const sidebar = document.querySelector("aside.sidebar");

  mainContent.innerHTML = `
    <div id="tools-match-container">
      <h2 data-i18n="tools_game_title">من صاحب الأداة؟</h2>
      <p data-i18n="tools_game_instructions">اختر المهنة الصحيحة التي تستخدم هذه الأداة.</p>
      <div id="tools-match-question"></div>
      <div id="tools-match-options"></div>
    </div>
  `;

  sidebar.innerHTML = `
    <button id="next-question-btn" class="tools-btn">التالي</button>
    <button id="change-mode-btn" class="tools-btn">تغيير الشكل</button>
  `;

  document.getElementById("next-question-btn").addEventListener("click", generateNewChallenge);
  document.getElementById("change-mode-btn").addEventListener("click", changeDisplayMode);

  await fetchToolsAndProfessions();
  generateNewChallenge();

  applyTranslations();
  setDirection(currentLang);
}

async function fetchToolsAndProfessions() {
  const toolsSnapshot = await getDocs(collection(db, "tools"));
  tools = toolsSnapshot.docs.map(doc => doc.data());

  const professionsSnapshot = await getDocs(collection(db, "professions"));
  professions = professionsSnapshot.docs.map(doc => doc.data());
}

function generateNewChallenge() {
  stopCurrentAudio();
  const questionEl = document.getElementById("tools-match-question");
  const optionsEl = document.getElementById("tools-match-options");
  questionEl.innerHTML = "";
  optionsEl.innerHTML = "";

  const tool = tools[Math.floor(Math.random() * tools.length)];
  const correctProfession = professions.find(p => p.tools?.includes(tool.id));
  if (!correctProfession) return generateNewChallenge();

  currentChallenge = { tool, correctProfession };

  const otherProfessions = professions
    .filter(p => p.name && p.name[currentLang])
    .filter(p => p !== correctProfession)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const options = [...otherProfessions, correctProfession].sort(() => 0.5 - Math.random());

  if (currentMode === "image-to-images") {
    const img = document.createElement("img");
    img.src = "/" + tool.image_path;
    img.alt = tool.name[currentLang];
    img.className = "tool-image";
    img.onclick = () => playAudio(tool.sound?.[currentLang]?.teacher);
    questionEl.appendChild(img);

    options.forEach(p => {
      const option = document.createElement("img");
      option.src = "/images/professions/" + p.image_file;
      option.alt = p.name[currentLang];
      option.className = "profession-option";
      option.onclick = () => checkAnswer(p);
      optionsEl.appendChild(option);
    });
  } else if (currentMode === "word-to-images") {
    const span = document.createElement("span");
    span.textContent = tool.name[currentLang];
    span.className = "tool-word";
    span.onclick = () => playAudio(tool.sound?.[currentLang]?.teacher);
    questionEl.appendChild(span);

    options.forEach(p => {
      const option = document.createElement("img");
      option.src = "/images/professions/" + p.image_file;
      option.alt = p.name[currentLang];
      option.className = "profession-option";
      option.onclick = () => checkAnswer(p);
      optionsEl.appendChild(option);
    });
  } else {
    const span = document.createElement("span");
    span.textContent = tool.name[currentLang];
    span.className = "tool-word";
    span.onclick = () => playAudio(tool.sound?.[currentLang]?.teacher);
    questionEl.appendChild(span);

    options.forEach(p => {
      const option = document.createElement("button");
      option.textContent = p.name[currentLang];
      option.className = "profession-option-btn";
      option.onclick = () => checkAnswer(p);
      optionsEl.appendChild(option);
    });
  }
}

function changeDisplayMode() {
  const modes = ["image-to-images", "word-to-images", "word-to-words"];
  const currentIndex = modes.indexOf(currentMode);
  currentMode = modes[(currentIndex + 1) % modes.length];
  generateNewChallenge();
}

function checkAnswer(selected) {
  const isCorrect = selected === currentChallenge.correctProfession;
  recordActivity("tools-game", {
    correct: isCorrect,
    tool: currentChallenge.tool.id,
    profession: selected.name[currentLang]
  });
  playAudio(isCorrect ? "audio/common/correct.mp3" : "audio/common/wrong.mp3");
}