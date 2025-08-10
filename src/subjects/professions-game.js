// src/subjects/professions-game.js
// صفحة المهن – نسخة موحّدة، تدعم معرّفات الشريط باللاحقة -profession مع fallback للأسماء العامة.

import { db } from "../core/db-handler.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from "../core/lang-handler.js";
import { playAudio, stopCurrentAudio } from "../core/audio-handler.js";
import { recordActivity } from "../core/activity-handler.js";

let professions = [];
let currentIndex = 0;
let currentProfession = null;
const toolsCache = new Map(); // professionId -> tools[]

export async function loadProfessionsGameContent() {
  stopCurrentAudio();

  const main = document.querySelector("main.main-content");
  if (!main) {
    console.error("[professions] main.main-content غير موجود");
    return;
  }

  // تحميل قالب الصفحة
  try {
    const resp = await fetch("/html/professions.html", { cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    main.innerHTML = await resp.text();
  } catch (e) {
    console.error("[professions] فشل تحميل /html/professions.html:", e);
    return;
  }

  // تهيئة اللغة والاتجاه والترجمة
  try { setDirection(getCurrentLang()); } catch {}
  applyTranslations();

  // عناصر الشريط الجانبي (أولوية للملحّق …-profession ثم الأسماء العامة كـ fallback)
  const langSelect   = document.getElementById("game-lang-select-profession") || document.getElementById("game-lang-select");
  const voiceSelect  = document.getElementById("voice-select-profession")    || document.getElementById("voice-select");
  const playBtn      = document.getElementById("play-sound-btn-profession")  || document.getElementById("play-sound-btn");
  const prevBtn      = document.getElementById("prev-profession-btn")        || document.getElementById("prev-btn");
  const nextBtn      = document.getElementById("next-profession-btn")        || document.getElementById("next-btn");
  const toggleDesc   = document.getElementById("toggle-description-btn-profession") || document.getElementById("toggle-description-btn");
  const toggleDetails= document.getElementById("toggle-details-btn-profession")    || document.getElementById("toggle-details-btn");
  const toggleTools  = document.getElementById("toggle-tools-btn-profession")      || document.getElementById("toggle-tools-btn");

  disableSidebar(true);

  await fetchProfessions();
  if (professions.length === 0) {
    console.warn("[professions] لا توجد بيانات");
    const wordEl = document.getElementById("profession-word");
    if (wordEl) wordEl.textContent = "لا توجد بيانات";
    return;
  }

  currentIndex = 0;
  updateProfessionContent();
  disableSidebar(false);

  // أحداث الشريط الجانبي
  if (langSelect) {
    try { langSelect.value = getCurrentLang(); } catch {}
    langSelect.onchange = async () => {
      const lang = langSelect.value;
      await loadLanguage(lang);
      setDirection(lang);
      applyTranslations();
      updateProfessionContent(); // تحديث النصوص والصوت
    };
  }

  if (voiceSelect) voiceSelect.onchange = () => stopCurrentAudio();
  if (playBtn)     playBtn.onclick      = () => playCurrentProfessionAudio();
  if (prevBtn)     prevBtn.onclick      = () => showPrevProfession();
  if (nextBtn)     nextBtn.onclick      = () => showNextProfession();

  if (toggleDesc) {
    const box = document.getElementById("profession-description-box");
    toggleDesc.onclick = () => { if (box) box.style.display = (box.style.display === "none" ? "block" : "none"); };
  }
  if (toggleDetails) {
    const box = document.getElementById("profession-details-section");
    toggleDetails.onclick = () => { if (box) box.style.display = (box.style.display === "none" ? "block" : "none"); };
  }
  if (toggleTools) {
    const box = document.getElementById("profession-tools-section");
    toggleTools.onclick = () => { if (box) box.style.display = (box.style.display === "none" ? "block" : "none"); };
  }

  applyTranslations();
  safeRecord("view_professions");
}

function updateProfessionContent() {
  if (professions.length === 0) return;

  const lang = getCurrentLang();
  currentProfession = professions[currentIndex];

  const wordEl    = document.getElementById("profession-word");
  const imgEl     = document.getElementById("profession-image");
  const descEl    = document.getElementById("profession-description");
  const letterEl  = document.getElementById("profession-letter");
  const categoryEl= document.getElementById("profession-category");
  const prevBtn   = document.getElementById("prev-profession-btn") || document.getElementById("prev-btn");
  const nextBtn   = document.getElementById("next-profession-btn") || document.getElementById("next-btn");

  const name = currentProfession?.name?.[lang] || currentProfession?.name?.en || currentProfession?.name?.ar || "";
  const first = name?.[0] ?? "";

  if (wordEl) {
    wordEl.innerHTML = name
      ? `<span class="highlight-first-letter">${first}</span>${name.slice(1)}`
      : "";
    wordEl.classList.add("clickable-text");
    wordEl.onclick = playCurrentProfessionAudio;
  }

  if (imgEl) {
    imgEl.src = resolveImagePath(currentProfession);
    imgEl.alt = name || "profession";
    imgEl.classList.add("clickable-image");
    imgEl.onclick = playCurrentProfessionAudio;
  }

  if (descEl)     descEl.textContent = currentProfession?.description?.[lang] || "—";
  if (letterEl)   letterEl.textContent = currentProfession?.letter?.[lang] || currentProfession?.letter || "—";
  if (categoryEl) categoryEl.textContent = currentProfession?.category?.[lang] || currentProfession?.category || "—";

  if (prevBtn) prevBtn.disabled = (currentIndex === 0);
  if (nextBtn) nextBtn.disabled = (currentIndex === professions.length - 1);

  stopCurrentAudio();

  // تحميل أدوات المهنة (اختياري إذا كانت مفعّلة في القالب)
  loadToolsForCurrentProfession().catch(err => console.error("[professions] tools error:", err));
}

async function fetchProfessions() {
  try {
    const ref = collection(db, "professions");
    const snap = await getDocs(ref);
    professions = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // ترتيب بسيط حسب اللغة الحالية
    const lang = getCurrentLang();
    professions.sort((a, b) => {
      const na = (a?.name?.[lang] || a?.name?.en || a?.name?.ar || "").toLowerCase();
      const nb = (b?.name?.[lang] || b?.name?.en || b?.name?.ar || "").toLowerCase();
      return na.localeCompare(nb);
    });

    console.log(`[professions] fetched = ${professions.length}`);
  } catch (err) {
    console.error("[professions] خطأ أثناء الجلب:", err);
    professions = [];
  }
}

export function showNextProfession() {
  stopCurrentAudio();
  if (currentIndex < professions.length - 1) {
    currentIndex++;
    updateProfessionContent();
    safeRecord("professions_next");
  }
}

export function showPrevProfession() {
  stopCurrentAudio();
  if (currentIndex > 0) {
    currentIndex--;
    updateProfessionContent();
    safeRecord("professions_prev");
  }
}

export function playCurrentProfessionAudio() {
  if (!currentProfession) return;
  const voiceType = (document.getElementById("voice-select-profession")?.value
                  || document.getElementById("voice-select")?.value) || "boy";
  const audioPath = getProfessionAudioPath(currentProfession, voiceType);
  if (audioPath) {
    playAudio(audioPath);
    safeRecord("profession_audio");
  }
}

function getProfessionAudioPath(data, voiceType) {
  const lang = getCurrentLang();

  // 1) الشكل الكامل: sound[lang][voiceType]
  if (data?.sound?.[lang]?.[voiceType]) {
    const raw = data.sound[lang][voiceType];
    return raw.includes("/") ? `/${raw.replace(/^\/+/, "")}` : `/audio/${lang}/professions/${raw}`;
  }

  // 2) fallback: sound_base => audio/{lang}/professions/{base}_{voiceType}_{lang}.mp3
  if (data?.sound_base) {
    return `/audio/${lang}/professions/${data.sound_base}_${voiceType}_${lang}.mp3`;
  }

  console.warn("[professions] لا يوجد تعريف صوتي للمهنة:", data?.name?.[lang] || data?.name?.ar);
  return null;
}

function resolveImagePath(item) {
  // يدعم image_path أو image_file
  if (item?.image_path) return item.image_path.startsWith("/") ? item.image_path : `/${item.image_path}`;
  if (item?.image_file) return `/images/professions/${item.image_file}`;
  return "/images/default.png";
}

/** أدوات المهنة **/
async function loadToolsForCurrentProfession() {
  const section = document.getElementById("profession-tools-section");
  const grid    = document.getElementById("profession-tools-grid");
  const empty   = document.getElementById("profession-tools-empty");
  if (!section || !grid || !currentProfession?.id) return;

  const profId = currentProfession.id;
  let tools = toolsCache.get(profId);

  if (!tools) {
    try {
      const toolsRef = collection(db, "profession_tools");
      const q = query(toolsRef, where("professions", "array-contains", profId));
      const snap = await getDocs(q);
      tools = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      toolsCache.set(profId, tools);
    } catch (e) {
      console.error("[professions] فشل جلب الأدوات:", e);
      tools = [];
    }
  }

  renderTools(grid, tools);
  section.style.display = "block";
  if (empty) empty.style.display = tools.length ? "none" : "block";
}

function renderTools(container, tools) {
  const lang = getCurrentLang();
  container.innerHTML = "";

  tools.forEach(t => {
    const card = document.createElement("div");
    card.className = "tool-card";

    const img = document.createElement("img");
    img.src = t?.image_path ? (t.image_path.startsWith("/") ? t.image_path : `/${t.image_path}`) : "/images/default.png";
    img.alt = t?.name?.[lang] || t?.name?.ar || "tool";

    const nm = document.createElement("div");
    nm.className = "tool-name";
    const toolName = t?.name?.[lang] || t?.name?.ar || "";
    const first = toolName?.[0] ?? "";
    nm.innerHTML = toolName ? `<span class="highlight-first-letter">${first}</span>${toolName.slice(1)}` : "";

    card.appendChild(img);
    card.appendChild(nm);

    // تشغيل صوت الأداة عند الضغط إن توفر
    card.onclick = () => {
      const voiceType = (document.getElementById("voice-select-profession")?.value
                      || document.getElementById("voice-select")?.value) || "boy";
      const audio = getToolAudioPath(t, voiceType);
      if (audio) playAudio(audio);
    };

    container.appendChild(card);
  });
}

function getToolAudioPath(tool, voiceType) {
  const lang = getCurrentLang();
  // يدعم sound[lang][voiceType] أو اسم ملف فقط
  const raw = tool?.sound?.[lang]?.[voiceType];
  if (!raw) return null;
  return raw.includes("/") ? `/${raw.replace(/^\/+/, "")}` : `/audio/${lang}/tools/${raw}`;
}

function disableSidebar(disabled) {
  const ids = [
    // المعرّفات المُلحقة (المفضّلة)
    "play-sound-btn-profession","prev-profession-btn","next-profession-btn",
    "voice-select-profession","game-lang-select-profession",
    "toggle-description-btn-profession","toggle-details-btn-profession","toggle-tools-btn-profession",
    // بدائل عامة (fallback) إن وُجدت في الشريط الموحّد
    "play-sound-btn","prev-btn","next-btn",
    "voice-select","game-lang-select",
    "toggle-description-btn","toggle-details-btn","toggle-tools-btn",
  ];
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.disabled = !!disabled; });
}

function safeRecord(eventKey) {
  try { recordActivity(eventKey); }
  catch {
    try { recordActivity(JSON.parse(localStorage.getItem("user") || "null"), eventKey); }
    catch {}
  }
}
