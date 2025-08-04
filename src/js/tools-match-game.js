
// tools-match-game.js (نمط جديد: اختيار كل المهن الصحيحة)
import { db } from "./firebase-config.js";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getCurrentLang, applyTranslations } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let allTools = [];
let allProfessions = [];
let currentTool = null;
let correctAnswers = [];

console.log("✅ tools-match-game.js loaded - Multi-answer mode");

export async function loadToolsMatchGameContent() {
  stopCurrentAudio();

  if (!localStorage.getItem("lang")) {
    localStorage.setItem("lang", "ar");
  }

  const mainContent = document.querySelector("main.main-content");

  mainContent.innerHTML = `
    <section class="tools-match-game-section">
      <h2 data-i18n="tools_match_title">من صاحب الأداة؟</h2>
      <div class="tool-display"></div>
      <div id="profession-options" class="options-grid"></div>
      <button id="check-button" class="check-btn" data-i18n="check">تحقق من الإجابة</button>
      <div id="result-message" class="result-message"></div>
      <button id="next-button" class="next-btn" style="display:none" data-i18n="next">التالي</button>
    </section>
  `;

  applyTranslations();
  initializeSidebarControls();

  await loadAllData();
  showNewTool();

  document.getElementById("check-button").onclick = checkMultiAnswer;
  document.getElementById("next-button").onclick = showNewTool;
}

function initializeSidebarControls() {
  const replayBtn = document.getElementById("tools-match-replay-sound-btn");
  const langSelect = document.getElementById("tools-match-lang-select");
  const modeSelect = document.getElementById("tools-match-display-mode");
  const voiceSelect = document.getElementById("tools-match-voice-select");

  if (replayBtn) {
    replayBtn.onclick = () => {
      const voice = getVoice();
      const lang = getLang();
      const sound = currentTool?.sound?.[lang]?.[voice];
      if (sound) playAudio(sound);
    };
  }

  if (langSelect) {
    langSelect.value = getLang();
    langSelect.onchange = () => {
      localStorage.setItem("lang", langSelect.value);
      loadToolsMatchGameContent();
    };
  }

  if (modeSelect) {
    modeSelect.value = getMode();
    modeSelect.onchange = () => loadToolsMatchGameContent();
  }

  if (voiceSelect) {
    voiceSelect.value = getVoice();
    voiceSelect.onchange = () => loadToolsMatchGameContent();
  }
}

async function loadAllData() {
  const toolsSnap = await getDocs(collection(db, "profession_tools"));
  allTools = toolsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const professionSet = new Set();
  allTools.forEach(tool => (tool.professions || []).forEach(p => professionSet.add(p)));
  allProfessions = Array.from(professionSet);
}

function showNewTool() {
  document.getElementById("result-message").textContent = "";
  document.getElementById("check-button").style.display = "inline-block";
  document.getElementById("next-button").style.display = "none";

  currentTool = getRandomItem(allTools);
  showTool(currentTool);
  showProfessionOptionsMulti(currentTool);
}

function showTool(tool) {
  const container = document.querySelector(".tool-display");
  const mode = getMode();
  const lang = getLang();
  const voice = getVoice();

  container.innerHTML = "";

  if (mode.startsWith("image")) {
    const img = document.createElement("img");
    img.src = "/" + tool.image_path;
    img.alt = tool.name?.[lang] || "";
    img.classList.add("tool-image", "clickable-image");
    img.onclick = () => {
      const sound = tool.sound?.[lang]?.[voice];
      if (sound) playAudio(sound);
    };
    container.appendChild(img);
  }

  if (mode.startsWith("text")) {
    const textEl = document.createElement("div");
    textEl.textContent = tool.name?.[lang] || "؟";
    textEl.classList.add("tool-name", "clickable-text");
    textEl.onclick = () => {
      const sound = tool.sound?.[lang]?.[voice];
      if (sound) playAudio(sound);
    };
    container.appendChild(textEl);
  }

  if (mode.startsWith("sound")) {
    const sound = tool.sound?.[lang]?.[voice];
    if (sound) playAudio(sound);
  }
}

async function showProfessionOptionsMulti(tool) {
  const lang = getLang();
  correctAnswers = [...tool.professions];
  let randomOthers = allProfessions.filter(p => !tool.professions.includes(p));
  const additional = getRandomItems(randomOthers, Math.max(0, 6 - correctAnswers.length));
  const options = shuffleArray([...correctAnswers, ...additional]);

  const container = document.getElementById("profession-options");
  container.innerHTML = "";

  for (const professionId of options) {
    const profSnap = await getDoc(doc(db, "professions", professionId));
    if (!profSnap.exists()) continue;
    const prof = profSnap.data();

    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.dataset.profession = professionId;
    btn.onclick = () => btn.classList.toggle("selected");

    if (getMode().endsWith("image")) {
      const img = document.createElement("img");
      img.src = "/" + prof.image_path;
      img.alt = prof.name?.[lang] || professionId;
      img.style.width = "100px";
      btn.appendChild(img);
    } else {
      btn.textContent = prof.name?.[lang] || professionId;
    }

    container.appendChild(btn);
  }
}

function checkMultiAnswer() {
  const selected = Array.from(document.querySelectorAll(".option-btn.selected")).map(
    el => el.dataset.profession
  );
  const result = document.getElementById("result-message");
  const nextBtn = document.getElementById("next-button");

  const isCorrect =
    selected.length === correctAnswers.length &&
    selected.every(item => correctAnswers.includes(item));

  if (isCorrect) {
    result.textContent = "✅ أحسنت! اخترت جميع المهن الصحيحة.";
    result.style.color = "green";
    playAudio("audio/success/success_toolMatch_a.mp3");
  } else {
    result.textContent = "❌ بعض اختياراتك غير صحيحة. حاول مجددًا.";
    result.style.color = "red";
    playAudio("audio/fail/fail_toolMatch_a.mp3");
  }

  recordActivity("tools-match-multi", {
    tool: currentTool.name?.[getLang()],
    selected,
    correctAnswers,
    success: isCorrect
  });

  document.getElementById("check-button").style.display = "none";
  nextBtn.style.display = "inline-block";
}

function getLang() {
  const selected = document.getElementById("tools-match-lang-select")?.value;
  return selected || localStorage.getItem("lang") || getCurrentLang();
}
function getVoice() {
  return document.getElementById("tools-match-voice-select")?.value || "boy";
}
function getMode() {
  return document.getElementById("tools-match-display-mode")?.value || "image-text";
}
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

window.loadToolsMatchGameContent = loadToolsMatchGameContent;
