// src/subjects/family-groups-game.js
/* لعبة "أين عائلتي؟" — تصنيف بالسحب والإفلات */

import { db } from "../js/firebase-config.js";
import {
  collection, doc, getDoc, getDocs, query, orderBy, limit, startAt
} from "firebase/firestore";
import * as LangMod from "../core/lang-handler.js";
import * as AudioMod from "../core/audio-handler.js";
import * as Activity from "../core/activity-handler.js";

const GAME_KEY = "family-groups";

const SELECTORS = {
  mainWrap:    "#family-groups-game",
  binsWrap:    "#fg-bins",
  card:        "#fg-card",
  img:         "#fg-image",
  nameOnCard:  "#fg-name-on-card",
  title:       "#fg-item-name",
  feedback:    "#fg-feedback",
  score:       "#fg-score",
  btnNew:      "#fg-new-round-btn",
  btnListen:   "#fg-listen-btn",
  sidebarBox:  "#family-groups-controls",
  modeSel:     "#fg-display-mode",
  voiceSel:    "#fg-sound-variant",
  langSel:     "#fg-lang-select",
};

const UI = {
  ar: { title: "أين عائلتي؟", hint: "اسحب الصورة إلى السلة الصحيحة.", correct: "أحسنت! إجابة صحيحة.", wrong: "حاول مرة أخرى.", newRound: "جولة جديدة", listen: "استمع" },
  en: { title: "Where is my family?", hint: "Drag the picture to the correct basket.", correct: "Great! Correct.", wrong: "Try again.", newRound: "New Round", listen: "Listen" },
  he: { title: "איפה המשפחה שלי?", hint: "גרור את התמונה לסל הנכון.", correct: "כל הכבוד! תשובה נכונה.", wrong: "נסה שוב.", newRound: "סיבוב חדש", listen: "האזן" }
};

const FALLBACK_CATEGORIES = {
  ar: ["ثديي","طائر","زاحف","مفترس","عاشب","فاكهة","خضار","أداة","مهنة","جزء جسم"],
  en: ["Mammal","Bird","Reptile","Predator","Herbivore","Fruit","Vegetable","Tool","Profession","Body Part"],
  he: ["יונק","ציפור","זוחל","טורף","צמחוני","פרי","ירק","כלי","מקצוע","איבר"]
};

const state = {
  lang: "ar",
  item: null,
  correctCategory: null,
  options: [],
  score: 0,
  autoNextMs: 1100,
  displayMode: "image",   // image | name | sound
  soundVariant: "boy",     // boy | girl | teacher
};

// ====== نقطة الدخول ======
export async function loadFamilyGroupsGameContent() {
  await mountViews();
  state.lang = safeGetLang();

  // ⬅️ في نسختك السابقة كان onLangChange يعيد تعريب الواجهة فقط؛
  // الآن نحافظ على نفس العنصر ونعيد بناء الصناديق عند تغيير اللغة:
  onLangChange(handleLangChanged);

  // أزرار
  qs(SELECTORS.btnNew)?.addEventListener("click", () => newRound());
  qs(SELECTORS.btnListen)?.addEventListener("click", () => tryPlayItemSound());

  // قوائم اختيار
  const modeSel  = qs(SELECTORS.modeSel);
  const voiceSel = qs(SELECTORS.voiceSel);
  const langSel  = qs(SELECTORS.langSel);

  if (modeSel){
    modeSel.value = state.displayMode;
    modeSel.addEventListener("change", (e) => {
      state.displayMode = e.target.value || "image";
      applyDisplayMode();
    });
  }
  if (voiceSel){
    voiceSel.value = state.soundVariant;
    voiceSel.addEventListener("change", (e) => {
      state.soundVariant = e.target.value || "boy";
      tryPreloadItemAudio();
    });
  }
  if (langSel){
    // صندوق اللغة موجود بتنسيقك الحالي في التحكمات:contentReference[oaicite:3]{index=3}
    langSel.value = state.lang;
    langSel.addEventListener("change", (e) => {
      const next = e.target.value;
      if (LangMod?.setLang) LangMod.setLang(next);
      else if (LangMod?.changeLang) LangMod.changeLang(next);
      // عند اكتمال التحويل، سيُستدعى handleLangChanged عبر onLangChange
    });
  }

  await newRound();
}

// ====== عند تغيير اللغة — حافظ على نفس العنصر ======
async function handleLangChanged() {
  state.lang = safeGetLang();
  relocalizeUI();

  // مزامنة قيمة صندوق اللغة (إن وُجد)
  const langSel = qs(SELECTORS.langSel);
  if (langSel) { try { langSel.value = state.lang; } catch {} }

  // إن لم يكن هناك عنصر (في أول تحميل مثلاً) نبدأ جولة جديدة
  if (!state.item) return newRound();

  // تحديث بطاقة نفس العنصر باللغة الجديدة
  fillItemCard(state.item, state.lang);
  applyDisplayMode();

  // إعادة بناء صناديق الفئات فقط باللغة الجديدة
  await rebuildBinsForCurrentItem();
  tryPreloadItemAudio();
}

// ====== حقن الواجهات ======
async function mountViews() {
  // المسرح — يحتوي span للاسم على البطاقة في قالبك الحالي:contentReference[oaicite:4]{index=4}
  const main = document.querySelector("main.main-content") || document.getElementById("main-content");
  if (main) {
    const html = await fetch("/html/family-groups-game.html").then(r => r.text()).catch(() => null);
    main.innerHTML = html || getMainFallbackHTML();
  }
  // الشريط الجانبي — فيه صندوق اللغة/العرض/الصوت في نسختك الحالية:contentReference[oaicite:5]{index=5}
  const sidebar = document.getElementById("sidebar") || document.getElementById("sidebar-wrapper") || document.querySelector(".sidebar");
  if (sidebar) {
    const html = await fetch("/html/family-groups-controls.html").then(r => r.text()).catch(() => null);
    if (html) {
      const wrap = document.createElement("div");
      wrap.innerHTML = html;
      sidebar.appendChild(wrap.firstElementChild);
    } else {
      sidebar.insertAdjacentHTML("beforeend", getSidebarFallbackHTML());
    }
  }
  relocalizeUI();
  applyDisplayMode();
}

// ====== جولة جديدة (تبديل عنصر) ======
async function newRound() {
  clearFeedback();
  const lang = safeGetLang();
  state.lang = lang;

  const itemData = await pickRandomItemWithCategories(lang);
  if (!itemData) { setFeedback(msg(lang, "wrong")); return; }

  state.item = itemData;
  fillItemCard(itemData, lang);
  applyDisplayMode();

  await rebuildBinsForCurrentItem();
  attachDragAndDrop();
  tryPreloadItemAudio();
}

// ====== إعادة بناء صناديق الفئات للعنصر الحالي (حسب اللغة الحالية) ======
async function rebuildBinsForCurrentItem(){
  const lang = state.lang;
  const master   = await getMasterCategories(lang);
  const itemCats = (state.item?.categories?.[lang] || state.item?.categories?.ar || []).filter(Boolean);
  // اختر فئة صحيحة من فئات العنصر باللغة الحالية
  const correct = randFrom(itemCats);
  if (!correct){
    // لو لم توجد فئات بالترجمة الحالية، نرجع لجولة جديدة
    return newRound();
  }

  // ولد مشتتات من القاموس العام، ثم طبّقها
  const distractors = master.filter(c => c && c !== correct);
  shuffle(distractors);
  const options = [correct, ...distractors.slice(0,3)];
  shuffle(options);

  state.correctCategory = correct;
  state.options = options;

  renderBins(options, lang);
}

// ====== جلب عنصر عشوائي ======
async function pickRandomItemWithCategories(lang) {
  try {
    const idxSnap = await getDoc(doc(db, "config", "classification_index"));
    if (idxSnap.exists()) {
      const list = idxSnap.data()?.byLocale?.[lang] || idxSnap.data()?.byLocale?.ar || [];
      if (Array.isArray(list) && list.length) {
        const id = randFrom(list);
        const d = await getDoc(doc(db, "items", id));
        const v = d.exists() ? { id: d.id, ...d.data() } : null;
        if (hasCategories(v, lang)) return v;
      }
    }
  } catch (e) {}

  const seed = Math.random().toString(36).slice(2, 8);
  const q1 = query(collection(db, "items"), orderBy("__name__"), startAt(seed), limit(50));
  const snap = await getDocs(q1);
  const pool = [];
  snap.forEach(d => {
    const v = { id: d.id, ...d.data() };
    if (hasCategories(v, lang)) pool.push(v);
  });
  if (pool.length) return randFrom(pool);

  const q2 = query(collection(db, "items"), orderBy("__name__"), limit(50));
  const snap2 = await getDocs(q2);
  const pool2 = [];
  snap2.forEach(d => {
    const v = { id: d.id, ...d.data() };
    if (hasCategories(v, lang)) pool2.push(v);
  });
  return pool2.length ? randFrom(pool2) : null;
}

function hasCategories(item, lang) {
  if (!item) return false;
  const arr = (item.categories?.[lang] || item.categories?.ar || []);
  return Array.isArray(arr) && arr.length > 0;
}

// ====== قاموس الفئات ======
async function getMasterCategories(lang) {
  try {
    const cfg = await getDoc(doc(db, "config", "classification_categories"));
    if (cfg.exists()) {
      const list = cfg.data()?.[lang] || cfg.data()?.ar;
      if (Array.isArray(list) && list.length) return unique(list);
    }
  } catch (e) {}
  return unique(FALLBACK_CATEGORIES[lang] || FALLBACK_CATEGORIES.ar);
}

// ====== البطاقة والصناديق ======
function fillItemCard(item, lang) {
  const titleEl = qs(SELECTORS.title);
  const imgEl   = qs(SELECTORS.img);
  const nameOn  = qs(SELECTORS.nameOnCard);

  const label = (item.name?.[lang] || item.name?.ar || "").toString();
  if (titleEl){
    titleEl.textContent = label;
    titleEl.setAttribute("dir", isRTL(lang) ? "rtl" : "ltr");
  }
  if (nameOn){
    nameOn.textContent = label;
    nameOn.setAttribute("dir", isRTL(lang) ? "rtl" : "ltr");
  }

  const mainImage = pickItemImage(item);
  if (imgEl){
    imgEl.src = mainImage?.path || mainImage?.url || item.image_path || "";
    imgEl.alt = mainImage?.alt?.[lang] || mainImage?.alt?.ar || label || "item";
  }
}

function renderBins(options, lang) {
  const binsWrap = qs(SELECTORS.binsWrap);
  if (!binsWrap) return;
  binsWrap.innerHTML = "";
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "fg-bin";
    btn.type = "button";
    btn.dataset.category = String(opt);
    btn.textContent = String(opt);
    btn.setAttribute("aria-selected", "false");
    btn.addEventListener("click", () => tryDropOn(btn));
    binsWrap.appendChild(btn);
  });
}

// ====== سحب/إفلات ======
function attachDragAndDrop() {
  const card = qs(SELECTORS.card);
  const bins = qsa(".fg-bin");
  if (!card) return;

  // بالنقر على البطاقة في وضع "صوت" نشغّل الصوت
  card.addEventListener("click", () => {
    if (state.displayMode === "sound") tryPlayItemSound();
  });

  let dragging = false, startX=0, startY=0, dx=0, dy=0;
  const onDown = (e) => {
    dragging = true; dx = dy = 0;
    startX = "clientX" in e ? e.clientX : e.touches?.[0]?.clientX || 0;
    startY = "clientY" in e ? e.clientY : e.touches?.[0]?.clientY || 0;
    card.style.transition = "none";
    card.setAttribute("aria-grabbed","true");
  };
  const onMove = (e) => {
    if (!dragging) return;
    const cx = "clientX" in e ? e.clientX : e.touches?.[0]?.clientX || 0;
    const cy = "clientY" in e ? e.clientY : e.touches?.[0]?.clientY || 0;
    dx = cx - startX; dy = cy - startY;
    card.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    const target = detectBinHover(card, bins);
    if (target) {
      tryDropOn(target);
    } else {
      card.style.transition = "transform 160ms ease";
      card.style.transform = "translate(0,0)";
      card.setAttribute("aria-grabbed","false");
    }
  };

  card.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  card.addEventListener("touchstart", onDown, {passive:true});
  window.addEventListener("touchmove", onMove, {passive:false});
  window.addEventListener("touchend", onUp);
}

function detectBinHover(card, bins) {
  const c = card.getBoundingClientRect();
  let best = null, bestArea = 0;
  bins.forEach(bin => {
    const b = bin.getBoundingClientRect();
    const interW = Math.max(0, Math.min(c.right, b.right) - Math.max(c.left, b.left));
    const interH = Math.max(0, Math.min(c.bottom, b.bottom) - Math.max(c.top, b.top));
    const area = interW * interH;
    if (area > bestArea) { bestArea = area; best = bin; }
  });
  return bestArea > 200 ? best : null;
}

function tryDropOn(binEl) {
  const chosen = binEl?.dataset?.category;
  const correct = state.correctCategory;
  if (!chosen || !correct) return;

  if (chosen === correct) {
    binEl.classList.add("correct");
    addScore(1);
    setFeedback(msg(state.lang, "correct"));
    playCorrect();
    logActivity(true, chosen, correct);
    swallowCard(binEl);
    window.setTimeout(() => newRound(), state.autoNextMs);
  } else {
    binEl.classList.add("incorrect");
    setFeedback(msg(state.lang, "wrong"));
    playWrong();
    logActivity(false, chosen, correct);
    window.setTimeout(() => binEl.classList.remove("incorrect"), 360);
    const card = qs(SELECTORS.card);
    if (card){
      card.style.transition = "transform 160ms ease";
      card.style.transform = "translate(0,0)";
      card.setAttribute("aria-grabbed","false");
    }
  }
}

function swallowCard(binEl) {
  const card = qs(SELECTORS.card);
  if (!card) return;
  const b = binEl.getBoundingClientRect();
  const c = card.getBoundingClientRect();
  const dx = (b.left + b.width/2) - (c.left + c.width/2);
  const dy = (b.top  + b.height/2) - (c.top  + c.height/2);
  card.style.transition = "transform 240ms ease";
  card.style.transform = `translate(${dx}px, ${dy}px) scale(0.8)`;
}

// ====== صوت/نقاط/سجل ======
function tryPlayItemSound() {
  const url = pickItemSoundUrl(state.item, state.lang, state.soundVariant);
  if (url) {
    if (AudioMod?.playUrl) AudioMod.playUrl(url);
    else new Audio(url).play().catch(()=>{});
  }
}

function tryPreloadItemAudio() {
  const url = pickItemSoundUrl(state.item, state.lang, state.soundVariant);
  if (!url) return;
  const a = document.createElement("audio");
  a.src = url; a.preload = "auto";
}

function playCorrect() { if (AudioMod?.playFeedback) AudioMod.playFeedback("correct", state.lang); else beep(600, 120); }
function playWrong()   { if (AudioMod?.playFeedback) AudioMod.playFeedback("wrong", state.lang);   else beep(220, 160); }

function addScore(n=1) { state.score += n; const el = qs(SELECTORS.score); if (el) el.textContent = String(state.score); }

function logActivity(ok, chosen, correct) {
  const payload = { type: GAME_KEY, ok, chosen, correct, itemId: state.item?.id, lang: state.lang, ts: Date.now() };
  if (Activity?.recordActivity) Activity.recordActivity(payload);
}

// ====== مساعدين ======
function pickItemImage(item) {
  const images = item?.media?.images;
  if (Array.isArray(images) && images.length) {
    const main = images.find(x => x.role === "main") || images[0];
    return main;
  }
  if (item?.image_path || item?.image_file) {
    return { path: item.image_path || `images/${item.type}/${item.image_file}` };
  }
  return null;
}

function pickItemSoundUrl(item, lang, preferredVariant) {
  if (!item?.sound) return null;
  const s = item.sound[lang] || item.sound.ar;
  if (!s) return null;
  if (typeof s === "string") return s;
  if (typeof s === "object") {
    return s[preferredVariant] || s.boy || s.girl || s.teacher || Object.values(s)[0];
  }
  return null;
}

function applyDisplayMode() {
  const card = qs(SELECTORS.card);
  const img  = qs(SELECTORS.img);
  const name = qs(SELECTORS.nameOnCard);
  if (!card || !img) return;

  card.classList.remove("mode-image","mode-name","mode-sound");
  if (state.displayMode === "name") {
    card.classList.add("mode-name");
    img.setAttribute("aria-hidden","true");
    if (name) name.setAttribute("aria-hidden","false");
  } else if (state.displayMode === "sound") {
    card.classList.add("mode-sound");
    img.setAttribute("aria-hidden","true");
    if (name) name.setAttribute("aria-hidden","false");
  } else {
    card.classList.add("mode-image");
    img.setAttribute("aria-hidden","false");
    if (name) name.setAttribute("aria-hidden","true");
  }
}

function relocalizeUI() {
  const lang = safeGetLang();
  const sb = qs(SELECTORS.sidebarBox);
  const t = UI[lang] || UI.ar;
  const btnNew = qs(SELECTORS.btnNew);
  const btnListen = qs(SELECTORS.btnListen);
  const hint = document.getElementById("fg-hint");
  const title = qs(SELECTORS.title);
  if (sb) sb.setAttribute("dir", isRTL(lang) ? "rtl" : "ltr");
  if (btnNew)    btnNew.textContent    = (lang==="ar"?"🔄 ":"") + t.newRound;
  if (btnListen) btnListen.textContent = (lang==="ar"?"🔊 ":"") + t.listen;
  if (hint)      hint.textContent      = t.hint;
  if (title)     title.setAttribute("dir", isRTL(lang) ? "rtl" : "ltr");
}

function setFeedback(text){ const el = qs(SELECTORS.feedback); if (el) el.textContent = text || ""; }
function clearFeedback(){ setFeedback(""); }

function safeGetLang() {
  const l = (LangMod?.getCurrentLang && LangMod.getCurrentLang())
         || (LangMod?.getActiveLang && LangMod.getActiveLang())
         || "ar";
  return (l==="ar"||l==="en"||l==="he") ? l : "ar";
}
function onLangChange(fn){ if (LangMod?.onLangChange) LangMod.onLangChange(fn); }

function isRTL(lang){ return lang==="ar" || lang==="he"; }
function randFrom(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function unique(a){ return [...new Set(a.filter(Boolean).map(x=>String(x)))]; }

function qs(s){ return document.querySelector(s); }
function qsa(s){ return Array.from(document.querySelectorAll(s)); }

function beep(freq=440, ms=120){
  try {
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type="sine"; o.frequency.value=freq; o.start();
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime+0.01);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+ms/1000);
    o.stop(ctx.currentTime + ms/1000 + 0.02);
  } catch {}
}

// ==== Fallbacks ====
function getMainFallbackHTML(){
  return `
  <section id="family-groups-game" class="subject-screen">
    <h2 id="fg-item-name" class="subject-title"></h2>
    <div class="fg-stage">
      <button id="fg-card" class="fg-card mode-image" aria-grabbed="false">
        <img id="fg-image"
             src=""
             alt=""
             width="400" height="300"
             loading="lazy" decoding="async"
             style="aspect-ratio: 4 / 3; object-fit: contain;" />
        <span id="fg-name-on-card" class="fg-name-on-card" aria-hidden="true"></span>
      </button>
      <div class="fg-bins" id="fg-bins"></div>
    </div>
    <div class="fg-feedback" id="fg-feedback" aria-live="polite"></div>
  </section>`;
}

function getSidebarFallbackHTML(){
  return `
  <div class="sidebar-section" id="family-groups-controls" style="display:block;">
    <h3 class="sidebar-title">🎯 أين عائلتي؟</h3>
    <div class="sidebar-controls">
      <label class="control-line">
        <span>شكل العرض:</span>
        <select id="fg-display-mode">
          <option value="image">صورة</option>
          <option value="name">اسم</option>
          <option value="sound">صوت</option>
        </select>
      </label>
      <label class="control-line">
        <span>اختيار الصوت:</span>
        <select id="fg-sound-variant">
          <option value="boy">ولد</option>
          <option value="girl">بنت</option>
          <option value="teacher">معلّم</option>
        </select>
      </label>
      <div class="btn-row">
        <button id="fg-new-round-btn" class="nav-btn">🔄 جولة جديدة</button>
        <button id="fg-listen-btn" class="nav-btn ghost">🔊 استمع</button>
      </div>
    </div>
    <div class="sidebar-stats">
      <div class="stat-line"><span>⭐ النقاط:</span> <strong id="fg-score">0</strong></div>
      <p class="hint" id="fg-hint">اسحب الصورة إلى السلة الصحيحة.</p>
    </div>
  </div>`;
}
