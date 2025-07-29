// public/js/tools-game.js

import { db } from "./firebase-config.js";
import { getDocs, collection, query } from "firebase/firestore";
import {
  currentLang,
  loadLanguage,
  applyTranslations,
  setDirection
} from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let tools = [];
let currentIndex = 0;
let currentToolData = null;

export async function loadToolsGameContent() {
  stopCurrentAudio();

  const mainContentArea = document.querySelector("main.main-content");
  if (!mainContentArea) {
    console.error("Main content area not found.");
    return;
  }

  // Inject HTML
  mainContentArea.innerHTML = `
    <div class="game-box">
      <h2 id="tool-name" class="item-main-name"></h2>
      <img id="tool-image" src="" alt="tool" />

      <div class="tool-description-box info-box" id="tool-description-box" style="display:none;">
        <h4>الوصف:</h4>
        <p id="tool-description">---</p>
        <p><strong>المهن المرتبطة:</strong> <span id="tool-professions"></span></p>
      </div>
    </div>
  `;

  // عناصر التحكم
  const langSelect = document.getElementById("game-lang-select-tools"); // استخدم نفس القائمة الحالية
  const voiceSelect = document.getElementById("voice-select-tools");
  const playSoundBtn = document.getElementById("play-sound-btn-tools");
  const prevBtn = document.getElementById("prev-tools-btn");
  const nextBtn = document.getElementById("next-tools-btn");
  const toggleDescBtn = document.getElementById("toggle-description-btn-tools");

  await fetchTools();

  if (tools.length === 0) {
    console.warn("No tools found.");
    document.getElementById("tool-name").textContent = "لا توجد بيانات";
    document.getElementById("tool-description").textContent = "غير متوفر.";
    document.getElementById("tool-image").src = "/images/default.png";
    disableToolButtons(true);
    return;
  }

  currentIndex = 0;
  updateToolContent();
  disableToolButtons(false);

  // اللغة
  langSelect.onchange = async () => {
    const newLang = langSelect.value;
    await loadLanguage(newLang);
    applyTranslations();
    setDirection(newLang);
    await loadToolsGameContent();
  };

  if (playSoundBtn) playSoundBtn.onclick = () => {
    playCurrentToolAudio();
  };
  if (prevBtn) prevBtn.onclick = () => {
    showPreviousTool();
  };
  if (nextBtn) nextBtn.onclick = () => {
    showNextTool();
  };
  if (toggleDescBtn) toggleDescBtn.onclick = () => {
    const descBox = document.getElementById("tool-description-box");
    descBox.style.display = descBox.style.display === "none" ? "block" : "none";
  };

  applyTranslations();
  setDirection(langSelect.value);
}

function updateToolContent() {
  if (tools.length === 0) return;

  currentToolData = tools[currentIndex];

  const nameEl = document.getElementById("tool-name");
  const descEl = document.getElementById("tool-description");
  const profEl = document.getElementById("tool-professions");
  const imageContainer = document.getElementById("tool-image");

  const parent = imageContainer.parentElement;
  imageContainer.remove();

  // الاسم
  nameEl.textContent = currentToolData.name?.[currentLang] || "";

  // الوصف
  descEl.textContent = currentToolData.description?.[currentLang] || "لا يوجد وصف.";

  // المهن المرتبطة
  profEl.textContent = (currentToolData.professions || []).map(prof => translateProfessionName(prof)).join("، ");

  // الصورة
  const img = document.createElement("img");
  img.id = "tool-image";
  img.src = `/${currentToolData.image_path}`;
  img.alt = currentToolData.name?.[currentLang] || "";
  parent.insertBefore(img, parent.children[1]);

  // أزرار التنقل
  document.getElementById("prev-tools-btn").disabled = currentIndex === 0;
  document.getElementById("next-tools-btn").disabled = currentIndex === tools.length - 1;

  stopCurrentAudio();
}

async function fetchTools() {
  try {
    const colRef = collection(db, "profession_tools");
    const q = query(colRef);
    const snap = await getDocs(q);
    tools = snap.docs.map(doc => doc.data());
  } catch (err) {
    console.error("Error fetching tools from Firestore:", err);
    tools = [];
  }
}

export function showNextTool() {
  stopCurrentAudio();
  if (currentIndex < tools.length - 1) {
    currentIndex++;
    updateToolContent();
    recordActivity(JSON.parse(localStorage.getItem("user")), "tools");
  }
}

export function showPreviousTool() {
  stopCurrentAudio();
  if (currentIndex > 0) {
    currentIndex--;
    updateToolContent();
    recordActivity(JSON.parse(localStorage.getItem("user")), "tools");
  }
}

export function playCurrentToolAudio() {
  if (currentToolData) {
    const selectedVoice = document.getElementById("voice-select-tools").value;
    const lang = document.getElementById("game-lang-select-tools").value;
    const fileName = currentToolData.sound?.[lang]?.[selectedVoice];
    if (!fileName) {
      console.error("Audio not available for this tool/voice/lang");
      return;
    }
    const path = `/${fileName}`;
    playAudio(path);
    recordActivity(JSON.parse(localStorage.getItem("user")), "tools_audio");
  } else {
    console.warn("No tool selected for audio playback.");
  }
}

function disableToolButtons(isDisabled) {
  ["play-sound-btn-tools", "prev-tools-btn", "next-tools-btn", "toggle-description-btn-tools", "game-lang-select-tools", "voice-select-tools"]
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.disabled = isDisabled;
    });
}

// ترجمة أسماء المهن المعروفة إلى اللغة الحالية
function translateProfessionName(key) {
  const translations = {
    "Blacksmith": { ar: "حداد", en: "Blacksmith", he: "נפח" },
    "Baker": { ar: "خباز", en: "Baker", he: "אופה" },
    "Cook": { ar: "طباخ", en: "Cook", he: "טבח" },
    "Policeman": { ar: "شرطي", en: "Policeman", he: "שוטר" },
    "Engineer": { ar: "مهندس", en: "Engineer", he: "מהנדס" },
    "Architect": { ar: "معماري", en: "Architect", he: "אדריכל" },
    "Teacher": { ar: "معلم", en: "Teacher", he: "מורה" },
    "Doctor": { ar: "طبيب", en: "Doctor", he: "רופא" },
    "Nurse": { ar: "ممرضة", en: "Nurse", he: "אחות" },
    "Carpenter": { ar: "نجار", en: "Carpenter", he: "נגר" },
    "Photographer": { ar: "مصور", en: "Photographer", he: "צלם" },
    "Artist": { ar: "فنان", en: "Artist", he: "אמן" },
    "Mechanic": { ar: "ميكانيكي", en: "Mechanic", he: "מכונאי" },
    "Plumber": { ar: "سباك", en: "Plumber", he: "אינסטלטור" },
    "Electrician": { ar: "كهربائي", en: "Electrician", he: "חשמלאי" },
    "Farmer": { ar: "مزارع", en: "Farmer", he: "חקלאי" },
    "Construction_worker": { ar: "عامل بناء", en: "Construction Worker", he: "פועל בניין" },
    "Driver": { ar: "سائق", en: "Driver", he: "נהג" },
    "Barber": { ar: "حلاق", en: "Barber", he: "ספר" },
    "Tailor": { ar: "خياط", en: "Tailor", he: "חייט" },
    "Welder": { ar: "لحام", en: "Welder", he: "רתך" },
  };
  return translations[key]?.[currentLang] || key;
}
