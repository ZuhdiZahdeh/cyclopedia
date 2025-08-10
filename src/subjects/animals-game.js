// src/subjects/animals-game.js

import { db } from "../core/db-handler.js";
import { collection, getDocs, query } from "firebase/firestore";
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from "../core/lang-handler.js";
import { playAudio, stopCurrentAudio } from "../core/audio-handler.js";
import { recordActivity } from "../core/activity-handler.js";

let animals = [];
let currentIndex = 0;
let currentAnimalData = null;

export async function loadAnimalsGameContent() {
  stopCurrentAudio();

  const main = document.querySelector("main.main-content");
  if (!main) {
    console.error("[animals] لم يتم العثور على main.main-content");
    return;
  }

  // تحميل القالب HTML
  try {
    const resp = await fetch("/html/animals.html", { cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    main.innerHTML = await resp.text();
  } catch (e) {
    console.error("[animals] فشل تحميل /html/animals.html:", e);
    return;
  }

  // عناصر الشريط الجانبي (أولوية للملحّق، ثم العام كـ fallback)
  const langSelect   = document.getElementById("game-lang-select-animal")     || document.getElementById("game-lang-select");
  const voiceSelect  = document.getElementById("voice-select-animal")         || document.getElementById("voice-select");
  const playBtn      = document.getElementById("play-sound-btn-animal")       || document.getElementById("play-sound-btn");
  const playBabyBtn  = document.getElementById("play-baby-sound-btn-animal")  || document.getElementById("play-baby-sound-btn");
  const prevBtn      = document.getElementById("prev-animal-btn")             || document.getElementById("prev-btn");
  const nextBtn      = document.getElementById("next-animal-btn")             || document.getElementById("next-btn");
  const toggleDesc   = document.getElementById("toggle-description-btn-animal") || document.getElementById("toggle-description-btn");
  const toggleDetails= document.getElementById("toggle-details-btn-animal")     || document.getElementById("toggle-details-btn");
  const toggleBabyImg= document.getElementById("toggle-baby-image-btn-animal")  || document.getElementById("toggle-baby-image-btn");

  // جلب البيانات (ندعم مسارين: categories/animals/items ثم animals)
  await fetchAnimals();

  if (animals.length === 0) {
    console.warn("[animals] لا توجد بيانات");
    const img  = document.getElementById("animal-image");
    const word = document.getElementById("animal-word");
    const desc = document.getElementById("animal-description");
    if (img)  img.src = "/images/default.png";
    if (word) word.textContent = "لا توجد بيانات";
    if (desc) desc.textContent = "لا يوجد وصف متوفر.";
    disableSidebar(true);
    return;
  }

  currentIndex = 0;
  updateAnimalContent();
  disableSidebar(false);

  // تزامن اللغة مع الواجهة
  if (langSelect) {
    try { langSelect.value = getCurrentLang(); } catch {}
    langSelect.onchange = async () => {
      const newLang = langSelect.value;
      await loadLanguage(newLang);
      setDirection(newLang);
      applyTranslations();
      updateAnimalContent();
    };
  }

  if (voiceSelect) voiceSelect.onchange = () => stopCurrentAudio();
  if (playBtn)     playBtn.onclick      = () => playCurrentAnimalAudio();
  if (playBabyBtn) playBabyBtn.onclick  = () => playCurrentBabyAnimalAudio();
  if (prevBtn)     prevBtn.onclick      = () => showPreviousAnimal();
  if (nextBtn)     nextBtn.onclick      = () => showNextAnimal();

  // أزرار إظهار/إخفاء الصناديق (تدعم وجودها أو عدمه)
  if (toggleDesc) {
    const box = document.getElementById("animal-description-box");
    toggleDesc.onclick = () => { if (box) box.style.display = (box.style.display === "none" ? "block" : "none"); };
  }
  if (toggleDetails) {
    const box = document.getElementById("animal-details-section");
    toggleDetails.onclick = () => { if (box) box.style.display = (box.style.display === "none" ? "block" : "none"); };
  }
  if (toggleBabyImg) {
    toggleBabyImg.onclick = () => {
      const detailsBox = document.getElementById("animal-details-section");
      if (!detailsBox) return;
      const babySec = detailsBox.querySelector(".baby-animal-section");
      if (!babySec) return;
      babySec.style.display = (babySec.style.display === "none") ? "block" : "none";
    };
  }

  applyTranslations();
  setDirection(getCurrentLang());
  safeRecord("view_animals");
}

function updateAnimalContent() {
  if (animals.length === 0) return;

  const lang = getCurrentLang();
  currentAnimalData = animals[currentIndex];

  const imgEl        = document.getElementById("animal-image");
  const wordEl       = document.getElementById("animal-word");
  const descEl       = document.getElementById("animal-description");
  const babyNameEl   = document.getElementById("animal-baby");
  const femaleNameEl = document.getElementById("animal-female");
  const categoryEl   = document.getElementById("animal-category");
  const babyImgEl    = document.getElementById("baby-animal-image");
  const prevBtn      = document.getElementById("prev-animal-btn") || document.getElementById("prev-btn");
  const nextBtn      = document.getElementById("next-animal-btn") || document.getElementById("next-btn");

  const animalName = currentAnimalData?.name?.[lang] || currentAnimalData?.name?.ar || "";

  // الصورة + تشغيل الصوت عند الضغط
  if (imgEl) {
    imgEl.src = resolveAnimalImagePath(currentAnimalData);
    imgEl.alt = animalName || "animal";
    imgEl.onclick = playCurrentAnimalAudio;
    imgEl.classList.add("clickable-image");
  }

  // الاسم في المنتصف + تلوين الحرف الأول
  if (wordEl) {
    if (animalName) {
      const first = animalName[0] ?? "";
      wordEl.innerHTML = `<span class="highlight-first-letter">${first}</span>${animalName.slice(1)}`;
    } else {
      wordEl.textContent = "";
    }
    wordEl.onclick = playCurrentAnimalAudio;
    wordEl.classList.add("clickable-text");
  }

  if (descEl)       descEl.textContent     = currentAnimalData?.description?.[lang] || "لا يوجد وصف";
  if (babyNameEl)   babyNameEl.textContent = currentAnimalData?.baby?.name?.[lang] || currentAnimalData?.baby?.[lang] || "غير معروف";
  if (femaleNameEl) femaleNameEl.textContent = currentAnimalData?.female?.[lang] || "غير معروف";

  if (categoryEl) {
    const cls = currentAnimalData.classification;
    categoryEl.textContent = Array.isArray(cls)
      ? cls.map(c => (typeof c === "object" && c?.[lang]) ? c[lang] : c).join(", ")
      : (cls?.[lang] || cls || "غير معروف");
  }

  if (babyImgEl) {
    const p = currentAnimalData?.baby?.image_path || currentAnimalData?.baby?.image;
    if (p) {
      babyImgEl.src = p.startsWith("/") ? p : `/${p}`;
      babyImgEl.alt = currentAnimalData?.baby?.name?.[lang] || "baby animal";
    } else {
      babyImgEl.src = "/images/default.png";
      babyImgEl.alt = "لا توجد صورة للابن";
    }
  }

  if (prevBtn) prevBtn.disabled = (currentIndex === 0);
  if (nextBtn) nextBtn.disabled = (currentIndex === animals.length - 1);

  stopCurrentAudio();
}

async function fetchAnimals() {
  animals = [];
  try {
    // المحبوب عندك سابقًا: categories/animals/items
    const ref = collection(db, "categories", "animals", "items");
    const snap = await getDocs(query(ref));
    animals = snap.docs.map(d => d.data());
  } catch (e) {
    console.warn("[animals] فشل مسار categories/animals/items، سيتم تجربة animals:", e);
  }

  // مسار بديل: animals مباشرة
  if (!animals?.length) {
    try {
      const ref2 = collection(db, "animals");
      const snap2 = await getDocs(query(ref2));
      animals = snap2.docs.map(d => d.data());
    } catch (e2) {
      console.error("[animals] فشل جلب الحيوانات:", e2);
      animals = [];
    }
  }

  // ترتيب أبجدي بسيط حسب لغة الواجهة
  const lang = getCurrentLang();
  animals.sort((a, b) => {
    const na = (a?.name?.[lang] || a?.name?.en || a?.name?.ar || "").toLowerCase();
    const nb = (b?.name?.[lang] || b?.name?.en || b?.name?.ar || "").toLowerCase();
    return na.localeCompare(nb);
  });

  console.log(`[animals] fetched = ${animals.length}`);
}

export function showNextAnimal() {
  stopCurrentAudio();
  if (currentIndex < animals.length - 1) {
    currentIndex++;
    updateAnimalContent();
    safeRecord("animals_next");
  }
}

export function showPreviousAnimal() {
  stopCurrentAudio();
  if (currentIndex > 0) {
    currentIndex--;
    updateAnimalContent();
    safeRecord("animals_prev");
  }
}

export function playCurrentAnimalAudio() {
  if (!currentAnimalData) {
    console.warn("[animals] لا يوجد عنصر معروض");
    return;
  }
  const voiceType = (document.getElementById("voice-select-animal")?.value
                  || document.getElementById("voice-select")?.value) || "boy";
  const audioPath = getAnimalAudioPath(currentAnimalData, voiceType);
  if (audioPath) {
    playAudio(audioPath);
    safeRecord("animals_audio");
  }
}

export function playCurrentBabyAnimalAudio() {
  if (!currentAnimalData?.baby) {
    console.warn("[animals] لا توجد بيانات ابن الحيوان");
    return;
  }
  const voiceType = (document.getElementById("voice-select-animal")?.value
                  || document.getElementById("voice-select")?.value) || "boy";
  const audioPath = getBabyAnimalAudioPath(currentAnimalData.baby, voiceType);
  if (audioPath) {
    playAudio(audioPath);
    safeRecord("animals_baby_audio");
  }
}

/** مسارات الصوت **/
function getAnimalAudioPath(data, voiceType) {
  const lang = getCurrentLang();

  // 1) الشكل الشائع: sound[lang][voiceType]
  if (data?.sound?.[lang]?.[voiceType]) {
    const raw = data.sound[lang][voiceType];
    return raw.includes("/") ? `/${raw.replace(/^\/+/, "")}` : `/audio/${lang}/animals/${raw}`;
  }

  // 2) voices['boy_ar'] مثلًا
  const key = `${voiceType}_${lang}`;
  if (data?.voices?.[key]) {
    const raw = data.voices[key];
    return raw.includes("/") ? `/${raw.replace(/^\/+/, "")}` : `/audio/${lang}/animals/${raw}`;
  }

  // 3) sound_base => animals/{base}_{voiceType}_{lang}.mp3
  if (data?.sound_base) {
    return `/audio/${lang}/animals/${data.sound_base}_${voiceType}_${lang}.mp3`;
  }

  // 4) fallback إضافي إن وُجد اسم ملف مباشر
  if (data?.animal_sound_file) {
    const raw = data.animal_sound_file;
    return raw.includes("/") ? `/${raw.replace(/^\/+/, "")}` : `/audio/${lang}/animals/${raw}`;
  }

  console.warn("[animals] لا يوجد تعريف صوتي:", data?.name?.[lang] || data?.name?.ar);
  return null;
}

function getBabyAnimalAudioPath(baby, voiceType) {
  const lang = getCurrentLang();

  if (baby?.sound?.[lang]?.[voiceType]) {
    const raw = baby.sound[lang][voiceType];
    return raw.includes("/") ? `/${raw.replace(/^\/+/, "")}` : `/audio/${lang}/animals/baby_animals/${raw}`;
  }
  if (baby?.sound_base) {
    return `/audio/${lang}/animals/baby_animals/${baby.sound_base}_${voiceType}_${lang}.mp3`;
  }
  if (baby?.sound_file) {
    const raw = baby.sound_file;
    return raw.includes("/") ? `/${raw.replace(/^\/+/, "")}` : `/audio/${lang}/animals/baby_animals/${raw}`;
  }

  console.warn("[animals] لا يوجد صوت للابن:", baby?.name?.[lang] || "");
  return null;
}

/** مسارات الصور **/
function resolveAnimalImagePath(item) {
  if (item?.image_path) return item.image_path.startsWith("/") ? item.image_path : `/${item.image_path}`;
  if (item?.image)      return `/images/animals/${item.image}`;
  return "/images/default.png";
}

function disableSidebar(disabled) {
  const ids = [
    // النمط الملحّق (المفضّل)
    "play-sound-btn-animal", "play-baby-sound-btn-animal",
    "prev-animal-btn", "next-animal-btn",
    "voice-select-animal", "game-lang-select-animal",
    "toggle-description-btn-animal", "toggle-details-btn-animal", "toggle-baby-image-btn-animal",
    // الأسماء العامة كـ fallback
    "play-sound-btn", "play-baby-sound-btn",
    "prev-btn", "next-btn",
    "voice-select", "game-lang-select",
    "toggle-description-btn", "toggle-details-btn", "toggle-baby-image-btn",
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
