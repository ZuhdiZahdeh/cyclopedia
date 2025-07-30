// src/js/tools-match-game.js
import { db } from "./firebase-config.js";
import { collection, getDocs } from "firebase/firestore";
import { currentLang, translate, applyTranslations } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let allTools = [];
let allProfessions = [];
let currentTool = null;

export async function loadToolsMatchGameContent() {
  stopCurrentAudio();
  const mainContent = document.querySelector("main.main-content");

  mainContent.innerHTML = `
    <div class="game-container">
      <h2 data-i18n="tools_match_title">من صاحب الأداة؟</h2>
      <div class="tool-display">
        <img id="tool-image" src="" alt="Tool" />
      </div>
      <div id="profession-options" class="options-grid"></div>
      <div id="result-message"></div>
      <button id="next-button" class="next-btn" style="display:none" data-i18n="next">التالي</button>
    </div>
  `;

  applyTranslations();

  await loadAllData();
  showNewTool();

  document.getElementById("next-button").onclick = showNewTool;
}

async function loadAllData() {
  const toolsSnap = await getDocs(collection(db, "profession_tools"));
  allTools = toolsSnap.docs.map(doc => doc.data());

  // جمع كل المهن من الأدوات
  const professionSet = new Set();
  allTools.forEach(tool => {
    (tool.professions || []).forEach(p => professionSet.add(p));
  });
  allProfessions = Array.from(professionSet);
}

function showNewTool() {
  document.getElementById("result-message").textContent = "";
  document.getElementById("next-button").style.display = "none";

  currentTool = getRandomItem(allTools);
  const toolImage = document.getElementById("tool-image");
  toolImage.src = "/" + currentTool.image_path;
  toolImage.alt = currentTool.name?.[currentLang] || "Tool";

  // تشغيل صوت الأداة (اختياري)
  const soundPath = currentTool?.sound?.[currentLang]?.boy;
  if (soundPath) playAudio(soundPath);

  showProfessionOptions(currentTool);
}

function showProfessionOptions(tool) {
  const correct = getRandomItem(tool.professions);
  const wrongOptions = getRandomItems(allProfessions.filter(p => !tool.professions.includes(p)), 3);
  const options = shuffleArray([correct, ...wrongOptions]);

  const container = document.getElementById("profession-options");
  container.innerHTML = "";

  options.forEach(prof => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = translateProfession(prof);
    btn.onclick = () => checkAnswer(prof, correct);
    container.appendChild(btn);
  });
}

function checkAnswer(selected, correct) {
  const result = document.getElementById("result-message");
  const nextBtn = document.getElementById("next-button");

  if (selected === correct) {
    result.textContent = translate("correct_answer") || "إجابة صحيحة!";
    result.style.color = "green";
    playAudio("audio/common/correct.mp3");
  } else {
    result.textContent = translate("wrong_answer") || "إجابة خاطئة!";
    result.style.color = "red";
    playAudio("audio/common/wrong.mp3");
  }

  // تسجيل النشاط
  recordActivity("tools-match", {
    tool: currentTool.name?.[currentLang],
    selected,
    correct,
    success: selected === correct
  });

  nextBtn.style.display = "inline-block";
}

// أدوات مساعدة
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomItems(arr, count) {
  const shuffled = shuffleArray([...arr]);
  return shuffled.slice(0, count);
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function translateProfession(professionId) {
  // يمكن لاحقًا ربطه بقاعدة بيانات المهن لعرض الاسم المترجم
  // الآن نعرض الاسم كما هو
  return professionId;
}
