// tools-match-game.js (نسخة ثابتة ومحسّنة مع اختيارٍ متعدد)
import { db } from "./firebase-config.js";
import { collection, getDocs } from "firebase/firestore";
import { getCurrentLang, applyTranslations } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let allTools = [];
let professionsMap = new Map();   // id -> data
let allProfessionIds = [];        // مصفوفة معرفات المهن
let currentTool = null;
let correctAnswers = [];


export async function loadToolsMatchGameContent() {
  stopCurrentAudio();

  if (!localStorage.getItem("lang")) localStorage.setItem("lang", "ar");

  const main = document.querySelector("main.main-content");
  main.innerHTML = `
    <section class="tools-match-game-section">
      <h2 class="game-title" data-i18n="tools_match_title">من صاحب الأداة؟</h2>

      <div class="tool-display"></div>

      <div id="profession-options" class="options-grid" aria-live="polite"></div>

      <div class="actions">
        <button id="check-button" class="check-btn" data-i18n="check">تحقق من الإجابة</button>
        <button id="next-button" class="next-btn" style="display:none" data-i18n="next">التالي</button>
      </div>

      <div id="result-message" class="result-message" role="status"></div>
    </section>
  `;

  applyTranslations();
  initSidebarControls();

  await loadAllData();
  showNewTool();

  document.getElementById("check-button").onclick = checkMultiAnswer;
  document.getElementById("next-button").onclick = showNewTool;
}

function initSidebarControls() {
  const replayBtn = document.getElementById("tools-match-replay-sound-btn");
  const langSelect  = document.getElementById("tools-match-lang-select");
  const modeSelect  = document.getElementById("tools-match-display-mode");
  const voiceSelect = document.getElementById("tools-match-voice-select");

  replayBtn && (replayBtn.onclick = () => {
    const s = currentTool?.sound?.[getLang()]?.[getVoice()];
    if (s) playAudio(s);
  });

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

// تحميل البيانات دفعة واحدة
async function loadAllData() {
  const toolsSnap = await getDocs(collection(db, "profession_tools"));
  allTools = toolsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const profSnap = await getDocs(collection(db, "professions"));
  professionsMap = new Map(profSnap.docs.map(d => [d.id, { id: d.id, ...d.data() }]));
  allProfessionIds = Array.from(professionsMap.keys());

}

function showNewTool() {
  const result = document.getElementById("result-message");
  result.textContent = "";
  document.getElementById("check-button").style.display = "inline-block";
  document.getElementById("next-button").style.display = "none";

  currentTool = getRandomItem(allTools);
  showTool(currentTool);
  showProfessionOptionsMulti(currentTool);
}

function showTool(tool) {
  const container = document.querySelector(".tool-display");
  const mode  = getMode();
  const lang  = getLang();
  const voice = getVoice();

  container.innerHTML = "";

  if (mode.startsWith("image")) {
    const img = document.createElement("img");
    img.src = "/" + tool.image_path;
    img.alt = tool.name?.[lang] || "";
    img.classList.add("tool-image", "clickable-image");
    img.onclick = () => {
      const s = tool.sound?.[lang]?.[voice];
      if (s) playAudio(s);
    };
    container.appendChild(img);
  }

  if (mode.startsWith("text")) {
    const t = document.createElement("div");
    t.textContent = tool.name?.[lang] || "؟";
    t.classList.add("tool-name", "clickable-text");
    t.onclick = () => {
      const s = tool.sound?.[lang]?.[voice];
      if (s) playAudio(s);
    };
    container.appendChild(t);
  }

  if (mode.startsWith("sound")) {
    const s = tool.sound?.[lang]?.[voice];
    if (s) playAudio(s);
  }
}
function showProfessionOptionsMulti(tool) {
  const lang = getLang();

  // الإجابات الصحيحة (كما في حقل professions داخل الأداة)
  correctAnswers = Array.isArray(tool.professions) ? [...tool.professions] : [];

  // إكمال حتى 6 خيارات على الأقل
  const pool = allProfessionIds.filter(id => !correctAnswers.includes(id));
  const need = Math.max(0, 6 - correctAnswers.length);
  const fillers = getRandomItems(pool, need);

  const options = shuffleArray([...new Set([...correctAnswers, ...fillers])]);
  const container = document.getElementById("profession-options");
  container.innerHTML = "";

  for (const id of options) {
    const prof = professionsMap.get(id);

    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.dataset.profession = id;
    btn.onclick = () => btn.classList.toggle("selected");

    if (getMode().endsWith("image") && prof?.image_path) {
      const img = document.createElement("img");
      img.src = "/" + prof.image_path;
      img.alt = prof?.name?.[lang] || id;
      img.style.width = "100px";
      btn.appendChild(img);
    } else {
      btn.textContent = prof?.name?.[lang] || id;
    }

    container.appendChild(btn);
  }

}

function checkMultiAnswer() {
  const selected = Array.from(document.querySelectorAll(".option-btn.selected"))
    .map(el => el.dataset.profession);

  const result = document.getElementById("result-message");
  const nextBtn = document.getElementById("next-button");

  const isCorrect =
    selected.length === correctAnswers.length &&
    selected.every(id => correctAnswers.includes(id));

  result.classList.remove("ok", "bad");
  if (isCorrect) {
    result.textContent = "أحسنت! اخترت جميع المهن الصحيحة.";
    result.classList.add("ok");
    playAudio("/audio/success/success_toolMatch_a.mp3");
  } else {
    result.textContent = "بعض اختياراتك غير صحيحة. حاول مجددًا.";
    result.classList.add("bad");
    playAudio("/audio/fail/fail_toolMatch_a.mp3");
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

// Helpers
function getLang()  { return document.getElementById("tools-match-lang-select")?.value || localStorage.getItem("lang") || getCurrentLang(); }
function getVoice() { return document.getElementById("tools-match-voice-select")?.value || "boy"; }
function getMode()  { return document.getElementById("tools-match-display-mode")?.value || "image-text"; }
function getRandomItem(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function getRandomItems(arr, n){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a.slice(0,n); }
function shuffleArray(arr){ return getRandomItems(arr, arr.length); }

window.loadToolsMatchGameContent = loadToolsMatchGameContent;
