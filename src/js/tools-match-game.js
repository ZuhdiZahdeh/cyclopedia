// tools-match-game.js (نسخة نهائية)
import { db } from "./firebase-config.js";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getCurrentLang, applyTranslations } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let allTools = [];
let allProfessions = [];
let currentTool = null;
console.log("✅ tools-match-game.js loaded - النسخة الأخيرة");
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
      <div id="result-message" class="result-message"></div>
      <button id="next-button" class="next-btn" style="display:none" data-i18n="next">التالي</button>
    </section>
  `;

  applyTranslations();
  initializeSidebarControls();

  await loadAllData();
  showNewTool();

  document.getElementById("next-button").onclick = showNewTool;
}

// ✅ ربط عناصر التحكم الجانبية مع اللعبة
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

// 🧠 تحميل جميع الأدوات والمهن من Firestore
async function loadAllData() {
  const toolsSnap = await getDocs(collection(db, "profession_tools"));
  allTools = toolsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const professionSet = new Set();
  allTools.forEach(tool => (tool.professions || []).forEach(p => professionSet.add(p)));
  allProfessions = Array.from(professionSet);
}

// 🔁 عرض أداة جديدة
function showNewTool() {
  document.getElementById("result-message").textContent = "";
  document.getElementById("next-button").style.display = "none";

  currentTool = getRandomItem(allTools);
  showTool(currentTool);
  showProfessionOptions(currentTool);
}

// 🎨 عرض الأداة بصريًا أو صوتيًا أو نصيًا
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

// 🧩 عرض خيارات المهن (واحدة صحيحة + 3 عشوائية)
async function showProfessionOptions(tool) {
  const correct = getRandomItem(tool.professions);
  const wrongOptions = getRandomItems(
    allProfessions.filter(p => !tool.professions.includes(p)),
    3
  );
  const options = shuffleArray([correct, ...wrongOptions]);

  const container = document.getElementById("profession-options");
  container.innerHTML = "";

  for (const professionId of options) {
    const btn = document.createElement("button");
    btn.className = "option-btn";

    const profSnap = await getDoc(doc(db, "professions", professionId));
    if (!profSnap.exists()) continue;
    const prof = profSnap.data();
    const lang = getLang();
    const mode = getMode();

    if (mode.endsWith("image")) {
      const img = document.createElement("img");
      img.src = "/" + prof.image_path;
      img.alt = prof.name?.[lang] || professionId;
      img.style.width = "100px";
      btn.appendChild(img);
    } else {
      btn.textContent = prof.name?.[lang] || professionId;
    }

    btn.onclick = () => checkAnswer(professionId, correct);
    container.appendChild(btn);
  }
}

// ✅ التحقق من الإجابة
function checkAnswer(selected, correct) {
  const result = document.getElementById("result-message");
  const nextBtn = document.getElementById("next-button");

  if (selected === correct) {
    result.textContent = "إجابة صحيحة!";
    result.style.color = "green";
    playAudio("audio/success/success_toolMatch_a.mp3");
  } else {
    result.textContent = "إجابة خاطئة!";
    result.style.color = "red";
    playAudio("audio/fail/fail_toolMatch_a.mp3");
  }
 console.log("🧪 checkAnswer invoked in tools-match-game.js");
  recordActivity("tools-match", {
    tool: currentTool.name?.[getLang()],
    selected,
    correct,
    success: selected === correct
  });

  nextBtn.style.display = "inline-block";
}

// أدوات مساعدة
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

// ربط عالمي
window.loadToolsMatchGameContent = loadToolsMatchGameContent;
