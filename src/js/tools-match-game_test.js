import { db } from "./firebase-config.js";
import { getDocs, collection } from "firebase/firestore";
import { currentLang, currentVoice, loadLanguage, applyTranslations, setDirection } from "./lang-handler.js";
import { playAudio, stopCurrentAudio } from "./audio-handler.js";
import { recordActivity } from "./activity-handler.js";

let tools = [];
let currentTool = null;

export async function loadToolsMatchGameContent() {
  stopCurrentAudio();

  // تحميل محتوى اللعبة في <main>
  const mainContent = document.querySelector("main.main-content");
  const html = await fetch("/html/tools-match.html").then(res => res.text());
  mainContent.innerHTML = html;

  // ✅ تحميل واجهة التحكم في <aside>
  const sidebar = document.querySelector("aside.sidebar");
  if (sidebar) {
    const controlsHTML = await fetch("/html/tools-match-controls.html").then(res => res.text());
    sidebar.innerHTML = controlsHTML;
  }

  await loadLanguage(); // تحميل اللغة الحالية
  applyTranslations();  // تطبيق الترجمة على النصوص

  await fetchTools();   // تحميل الأدوات من قاعدة البيانات
  renderTool();         // عرض أول أداة
}

async function fetchTools() {
  const snapshot = await getDocs(collection(db, "profession_tools"));
  tools = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

function renderTool() {
  const toolContainer = document.getElementById("tool-display");
  const optionsContainer = document.getElementById("profession-options");

  if (!tools.length || !toolContainer || !optionsContainer) return;

  const randomIndex = Math.floor(Math.random() * tools.length);
  currentTool = tools[randomIndex];

  // عرض صورة الأداة
  const toolImg = document.createElement("img");
  toolImg.src = "/" + currentTool.image_path;
  toolImg.alt = currentTool.name[currentLang];
  toolImg.classList.add("tool-image");
  toolImg.addEventListener("click", () => playToolAudio());

  toolContainer.innerHTML = "";
  toolContainer.appendChild(toolImg);

  // تشغيل صوت الأداة تلقائيًا
  playToolAudio();

  // عرض المهن المرتبطة
  optionsContainer.innerHTML = "";
  const shuffled = [...currentTool.professions].sort(() => Math.random() - 0.5);
  shuffled.forEach(profession => {
    const btn = document.createElement("button");
    btn.className = "profession-btn";
    btn.textContent = profession; // سيتم تعويضها لاحقًا بالترجمة أو الصورة حسب النمط
    btn.addEventListener("click", () => checkAnswer(profession));
    optionsContainer.appendChild(btn);
  });
}

function playToolAudio() {
  if (!currentTool || !currentTool.sound || !currentTool.sound[currentLang]) return;

  const voiceType = currentVoice; // boy / girl / teacher
  const audioPath = currentTool.sound[currentLang][voiceType];
  if (audioPath) {
    playAudio("/" + audioPath);
  }
}

function checkAnswer(selectedProfession) {
  const isCorrect = currentTool.professions.includes(selectedProfession);
  alert(isCorrect ? "✅ صحيح!" : "❌ خطأ!");
  recordActivity("tools-match", { tool: currentTool.name[currentLang], selectedProfession, isCorrect });
  renderTool();
}
