import { db } from "../js/firebase-config.js";
import { collection, doc, getDoc, getDocs, query, orderBy, limit, startAt } from "firebase/firestore";
import * as LangMod from "../core/lang-handler.js";
import * as AudioMod from "../core/audio-handler.js";
import * as Activity from "../core/activity-handler.js";
import { mountSidebarControls } from "../core/sidebar-controls.js";

const GAME_KEY = "family-groups";

const SEL = {
  binsWrap:   "#fg-bins",
  card:       "#fg-card",
  img:        "#fg-image",
  nameOnCard: "#fg-name-on-card",
  title:      "#fg-item-name",
  feedback:   "#fg-feedback",
  score:      "#fg-score",
  btnNew:     "#fg-new-round-btn",
  btnListen:  "#fg-listen-btn",
  sidebar:    "#family-groups-controls",
  // legacy (إن وُجد)
  modeSel:    "#fg-display-mode",
  voiceSel:   "#fg-sound-variant",
  langSel:    "#fg-lang-select",
};

const UI = {
  ar: { hint:"اسحب الصورة إلى السلة الصحيحة.", correct:"أحسنت! إجابة صحيحة.", wrong:"حاول مرة أخرى.", newRound:"جولة جديدة", listen:"استمع" },
  en: { hint:"Drag the picture to the correct basket.", correct:"Great! Correct.", wrong:"Try again.", newRound:"New Round", listen:"Listen" },
  he: { hint:"גרור את התמונה לסל הנכון.", correct:"כל הכבוד! תשובה נכונה.", wrong:"נסה שוב.", newRound:"סיבוב חדש", listen:"האזן" }
};

const FALLBACK_CATS = {
  ar:["ثديي","طائر","زاحف","مفترس","عاشب","فاكهة","خضروات","أدوات","مهن","جزء جسم"],
  en:["Mammal","Bird","Reptile","Predator","Herbivore","Fruit","Vegetable","Tool","Profession","Body Part"],
  he:["יונק","ציפור","זוחל","טורף","צמחוני","פרי","ירק","כלי","מקצוע","איבר"]
};

const state = {
  lang:"ar",
  item:null,
  correctCategory:null,
  options:[],
  score:0,
  autoNextMs:1100,
  displayMode:"image", // image | name | sound
  soundVariant:"boy"   // boy | girl | teacher | child
};

/* ======= مؤثرات النجاح/الفشل ======= */
const WIN_BASE_SUCCESS = "C:\\cyclopedia\\public\\audio\\success\\";
const WIN_BASE_FAIL    = "C:\\cyclopedia\\public\\audio\\fail\\";
const SUCCESS_FILES = ["success_toolMatch_a.mp3","success_toolMatch_b.mp3","success_toolMatch_c.mp3","success_toolMatch_d.mp3","success_toolMatch_e.mp3"];
const FAIL_FILES    = ["fail_toolMatch_a.mp3","fail_toolMatch_b.mp3","fail_toolMatch_c.mp3"];

function normalizeAudioPath(winBase, fileName) {
  if (location.protocol.startsWith("http")) {
    const folder = winBase.toLowerCase().includes("\\success\\") ? "success" : "fail";
    return `/audio/${folder}/${fileName}`;
  }
  try {
    const drive = winBase.slice(0, 2).replace(":", "");
    const tail  = winBase.slice(2).replace(/\\/g, "/");
    return `file:///${drive}:${tail}${fileName}`;
  } catch(_) { return fileName; }
}
function playRandomFrom(winBase, files){
  if (!files?.length) return;
  const name = files[Math.floor(Math.random()*files.length)];
  const url  = normalizeAudioPath(winBase, name);
  try { (AudioMod?.playUrl ? AudioMod.playUrl(url) : new Audio(url).play().catch(()=>{})); } catch {}
}
function playCorrect(){ playRandomFrom(WIN_BASE_SUCCESS, SUCCESS_FILES); }
function playWrong(){   playRandomFrom(WIN_BASE_FAIL,    FAIL_FILES);   }

/* ======= تهيئة المشهد ======= */
export async function loadFamilyGroupsGameContent(){
  await mountViews();
  state.lang = getSelectedLang();
  bindControls();
  await newRound(true);
}

async function mountViews(){
  const main = document.querySelector("main.main-content") || document.getElementById("main-content");
  if (main){
    const html = await fetch("/html/family-groups-game.html").then(r=>r.text()).catch(()=>null);
    main.innerHTML = html || fallbackMainHTML();
  }
  const sidebar = document.getElementById("sidebar") || document.querySelector(".sidebar");
  if (sidebar){
    const html = await fetch("/html/family-groups-controls.html").then(r=>r.text()).catch(()=>null);
    if (html){
      const wrap = document.createElement("div"); wrap.innerHTML = html;
      sidebar.appendChild(wrap.firstElementChild);
    } else {
      sidebar.insertAdjacentHTML("beforeend", fallbackSidebarHTML());
    }
  }
  const scRoot = document.querySelector("#family-groups-controls #sidebar-controls");
  if (scRoot){
    const initLang  = getSelectedLang();
    const initVoice = getSelectedVoice();
    mountSidebarControls({ mount: scRoot, initialLang: initLang, initialVoice: initVoice });
  }
  relocalizeUI();
  applyDisplayMode();
}

function bindControls(){
  qs(SEL.btnNew)?.addEventListener("click", ()=>newRound(true));
  qs(SEL.btnListen)?.addEventListener("click", ()=>tryPlayItemSound());

  window.addEventListener("lang:change", (e)=>{
    const next = (e.detail?.lang) || "ar";
    LangMod?.setLang?.(next);
    state.lang = next;
    handleLangChanged();
  });
  window.addEventListener("voice:change", (e)=>{
    const v = (e.detail?.voice) || "boy";
    AudioMod?.setVoiceShape?.(v);
    state.soundVariant = v;
    tryPreloadItemAudio();
  });
  window.addEventListener("controls:next", ()=> newRound(true));
  window.addEventListener("controls:prev", ()=> newRound(true));
  window.addEventListener("controls:description", ()=> { tryPlayItemSound(); });

  // legacy (إن وُجد)
  qs(SEL.langSel)?.addEventListener("change", e=>{
    const next = e.target.value;
    LangMod?.setLang?.(next);
    state.lang = next;
    handleLangChanged();
  });
  qs(SEL.voiceSel)?.addEventListener("change", e=>{
    state.soundVariant = e.target.value || "boy";
    AudioMod?.setVoiceShape?.(state.soundVariant);
    tryPreloadItemAudio();
  });
  qs(SEL.modeSel)?.addEventListener("change", e=>{
    state.displayMode = e.target.value || "image";
    applyDisplayMode();
  });
}

/* ======= جولة جديدة ======= */
async function newRound(autoPlay){
  clearFeedback();
  state.lang = getSelectedLang();

  const it = await pickRandomItemWithCategories(state.lang);
  if (!it){ setFeedback(msg("wrong")); return; }

  state.item = it;
  fillItemCard(it, state.lang);
  await rebuildBinsForCurrentItem();

  attachDragAndDrop();
  tryPreloadItemAudio();
  if (autoPlay) tryPlayItemSound();
}

async function handleLangChanged(){
  state.lang = getSelectedLang();
  relocalizeUI();
  if (!state.item) return newRound(true);
  fillItemCard(state.item, state.lang);
  await rebuildBinsForCurrentItem();
  tryPreloadItemAudio();
}

/* ======= بناء الخيارات ======= */
async function rebuildBinsForCurrentItem(){
  const lang   = state.lang;
  const master = await getMasterCategories(lang);

  const itemCats = sanitizeCats(state.item?.categories?.[lang] || state.item?.categories?.ar);
  const correct  = itemCats.length ? itemCats[Math.floor(Math.random()*itemCats.length)] : "";

  if (!correct) return newRound(true);

  const distractors = sampleWithoutReplacement(master, 3, new Set([correct]));
  if (distractors.length < 3){
    const fb = sanitizeCats(FALLBACK_CATS[lang] || FALLBACK_CATS.ar);
    const more = sampleWithoutReplacement(fb, 3 - distractors.length, new Set([correct, ...distractors]));
    distractors.push(...more);
  }

  let options = [correct, ...distractors].map(asCleanString).filter(Boolean);
  options = uniq(options).slice(0, 4);
  while (options.length < 4){
    const fb = sampleWithoutReplacement(FALLBACK_CATS[lang] || FALLBACK_CATS.ar, 1, new Set(options))[0];
    if (fb) options.push(fb);
  }
  for (let i = options.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  state.correctCategory = correct;
  state.options = options;
  renderBins(options);
}

function fillItemCard(item, lang){
  const titleEl = qs(SEL.title);
  const imgEl   = qs(SEL.img);
  const nameOn  = qs(SEL.nameOnCard);

  const label = (item.name?.[lang] || item.name?.ar || "").toString();
  if (titleEl){ titleEl.textContent = label; titleEl.setAttribute("dir", isRTL(lang)?"rtl":"ltr"); }
  if (nameOn){  nameOn.textContent  = label;  nameOn.setAttribute("dir", isRTL(lang)?"rtl":"ltr"); }

  const mainImage = pickItemImage(item);
  if (imgEl){
    imgEl.src = mainImage?.path || mainImage?.url || item.image_path || "";
    imgEl.alt = mainImage?.alt?.[lang] || mainImage?.alt?.ar || label || "item";
  }
  applyDisplayMode();
}

function renderBins(options){
  const wrap = qs(SEL.binsWrap);
  if (!wrap) return;
  wrap.innerHTML = "";
  options.forEach(opt=>{
    const b = document.createElement("button");
    b.className = "fg-bin";
    b.type = "button";
    b.dataset.category = String(opt);
    b.textContent = String(opt);
    b.addEventListener("click", ()=>tryDropOn(b));
    wrap.appendChild(b);
  });
}

/* ======= سحب/إفلات + تصغير ديناميكي أقوى ======= */
function attachDragAndDrop(){
  const card = qs(SEL.card);
  const bins = qsa(".fg-bin");
  if (!card) return;

  card.addEventListener("click", ()=>{
    if (state.displayMode==="sound") tryPlayItemSound();
  });

  let dragging=false, sx=0, sy=0, dx=0, dy=0;

  const down = e=>{
    dragging = true; dx=dy=0;
    sx = ("clientX" in e? e.clientX : e.touches?.[0]?.clientX)||0;
    sy = ("clientY" in e? e.clientY : e.touches?.[0]?.clientY)||0;
    card.style.transition="none";
    card.setAttribute("aria-grabbed","true");
    card.classList.add("dragging");
  };

  const move = e=>{
    if (!dragging) return;
    const cx = ("clientX" in e? e.clientX : e.touches?.[0]?.clientX)||0;
    const cy = ("clientY" in e? e.clientY : e.touches?.[0]?.clientY)||0;
    dx=cx-sx; dy=cy-sy;

    const scale = dynamicScaleFor(card, bins, dx, dy);
    card.style.transform=`translate(${dx}px,${dy}px) scale(${scale})`;
  };

  const up = ()=>{
    if (!dragging) return;
    dragging=false;
    const target = detectBinHover(card,bins);
    if (target) tryDropOn(target);
    else {
      card.style.transition="transform 160ms ease";
      card.style.transform="translate(0,0) scale(1)";
      card.setAttribute("aria-grabbed","false");
      card.classList.remove("dragging");
    }
  };

  card.addEventListener("pointerdown", down);
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup",   up);
  card.addEventListener("touchstart", down, {passive:true});
  window.addEventListener("touchmove", move, {passive:false});
  window.addEventListener("touchend",  up);
}

/** تصغير ديناميكي أقوى: ~0.95 ← ~0.52 */
function dynamicScaleFor(card, bins, dx, dy){
  const c = card.getBoundingClientRect();
  const cx = c.left + c.width/2 + dx;
  const cy = c.top  + c.height/2 + dy;

  let minD = Infinity;
  bins.forEach(bin=>{
    const b = bin.getBoundingClientRect();
    const bx = b.left + b.width/2;
    const by = b.top  + b.height/2;
    const d  = Math.hypot(cx-bx, cy-by);
    if (d < minD) minD = d;
  });

  const D0 = 100;  // يبدأ التصغير باكراً
  const D1 = 520;  // يصل للحجم الطبيعي أسرع
  const t  = clamp01((minD - D0) / (D1 - D0));
  const smooth = t * t * (3 - 2*t); // Smoothstep
  const sMax = 0.95, sMin = 0.42;   // ← أصغر من قبل (0.62)
  return +(sMin + (sMax - sMin) * smooth).toFixed(3);
}

/* ======= كشف التقاطع وتقييم الإسقاط ======= */
function detectBinHover(card, bins){
  const c = card.getBoundingClientRect();
  let best=null, bestArea=0;
  bins.forEach(bin=>{
    const b = bin.getBoundingClientRect();
    const interW = Math.max(0, Math.min(c.right,b.right) - Math.max(c.left,b.left));
    const interH = Math.max(0, Math.min(c.bottom,b.bottom) - Math.max(c.top,b.top));
    const area = interW*interH;
    if (area>bestArea){ bestArea=area; best=bin; }
  });
  return bestArea>160 ? best : null;
}

function tryDropOn(binEl){
  const chosen  = binEl?.dataset?.category;
  const correct = state.correctCategory;
  if (!chosen || !correct) return;

  if (chosen===correct){
    animateCorrectDrop(binEl);
    addScore(1);
    setFeedback(msg("correct"));
    playCorrect();
    logActivity(true, chosen, correct);
    setTimeout(()=>newRound(true), state.autoNextMs);
  } else {
    binEl.classList.add("incorrect");
    setFeedback(msg("wrong"));
    playWrong();
    logActivity(false, chosen, correct);
    setTimeout(()=>binEl.classList.remove("incorrect"), 360);

    const card = qs(SEL.card);
    card.style.transition="transform 160ms ease";
    card.style.transform="translate(0,0) scale(1)";
    card.setAttribute("aria-grabbed","false");
    card.classList.remove("dragging");
  }
}

/* ======= ارتداد + وميض أخضر عند الصح ======= */
function animateCorrectDrop(binEl){
  const card = qs(SEL.card); if (!card) return;

  flashBinGreen(binEl);

  const b = binEl.getBoundingClientRect();
  const c = card.getBoundingClientRect();
  const dx = (b.left+b.width/2)  - (c.left+c.width/2);
  const dy = (b.top +b.height/2) - (c.top +c.height/2);

  card.style.transition = "transform 220ms cubic-bezier(.2,.9,.3,1.2)";
  card.style.transform  = `translate(${dx}px,${dy}px) scale(0.72)`;

  setTimeout(()=>{
    card.style.transition = "transform 120ms ease-out";
    card.style.transform  = `translate(${dx}px,${dy}px) scale(0.82)`;
  }, 220);

  setTimeout(()=>{
    card.style.transition = "transform 120ms ease-in";
    card.style.transform  = `translate(${dx}px,${dy}px) scale(0.78)`;
    card.setAttribute("aria-grabbed","false");
    card.classList.remove("dragging");
  }, 360);
}

function flashBinGreen(binEl){
  ensureFlashStyle();
  binEl.classList.remove("correct");
  binEl.style.animation = "fg-correct-flash 420ms ease-out 1";
  setTimeout(()=>{ binEl.classList.add("correct"); }, 420);
}
let __flashStyleInjected = false;
function ensureFlashStyle(){
  if (__flashStyleInjected) return;
  const css = `
  @keyframes fg-correct-flash {
    0%   { box-shadow: 0 0 0 rgba(46,204,113,0); background: rgba(46,204,113,.10); }
    40%  { box-shadow: 0 0 0 10px rgba(46,204,113,.22); background: rgba(46,204,113,.18); }
    100% { box-shadow: 0 0 0 rgba(46,204,113,0); background: rgba(46,204,113,.08); }
  }`;
  const tag = document.createElement("style");
  tag.setAttribute("data-fg-correct-flash","1");
  tag.textContent = css;
  document.head.appendChild(tag);
  __flashStyleInjected = true;
}

/* ======= الصوت/النقاط/السجل ======= */
function tryPlayItemSound(){
  const url = pickItemSoundUrl(state.item, state.lang, getSelectedVoice());
  if (!url) return;
  try { (AudioMod?.playUrl ? AudioMod.playUrl(url) : new Audio(url).play().catch(()=>{})); } catch {}
}
function tryPreloadItemAudio(){
  const url = pickItemSoundUrl(state.item, state.lang, getSelectedVoice());
  if (!url) return;
  const a = document.createElement("audio");
  a.src = url; a.preload = "auto";
}
function addScore(n=1){
  state.score+=n;
  const el=qs(SEL.score);
  if (el) el.textContent=String(state.score);
}
function logActivity(ok, chosen, correct){
  const payload={ type:GAME_KEY, ok, chosen, correct, itemId:state.item?.id, lang:state.lang, ts:Date.now() };
  Activity?.recordActivity?.(payload);
}

/* ======= مساعدين ======= */
function getSelectedLang(){
  const sys = (LangMod?.getCurrentLang && LangMod.getCurrentLang())
           || (LangMod?.getActiveLang && LangMod.getActiveLang());
  const v = sys || state.lang || "ar";
  return (v==="ar"||v==="en"||v==="he") ? v : "ar";
}
function getSelectedVoice(){
  const sys = (AudioMod?.getVoiceShape && AudioMod.getVoiceShape()) || state.soundVariant || "boy";
  return sys;
}
function applyDisplayMode(){
  const card = qs(SEL.card), img=qs(SEL.img), name=qs(SEL.nameOnCard);
  if (!card || !img) return;
  const mode = state.displayMode || "image";
  card.classList.remove("mode-image","mode-name","mode-sound");
  if (mode==="name"){  card.classList.add("mode-name");  img.setAttribute("aria-hidden","true");  name?.setAttribute("aria-hidden","false"); }
  else if (mode==="sound"){ card.classList.add("mode-sound"); img.setAttribute("aria-hidden","true"); name?.setAttribute("aria-hidden","false"); }
  else { card.classList.add("mode-image"); img.setAttribute("aria-hidden","false"); name?.setAttribute("aria-hidden","true"); }
}
function relocalizeUI(){
  const lang = state.lang = getSelectedLang();
  const t = UI[lang] || UI.ar;
  const sb = qs(SEL.sidebar);
  const btnNew   = qs(SEL.btnNew);
  const btnListen= qs(SEL.btnListen);
  const hint     = document.getElementById("fg-hint");
  const title    = qs(SEL.title);
  if (sb)       sb.setAttribute("dir", isRTL(lang)?"rtl":"ltr");
  if (btnNew)   btnNew.textContent    = (lang==="ar"?"🔄 ":"") + t.newRound;
  if (btnListen)btnListen.textContent = (lang==="ar"?"🔊 ":"") + t.listen;
  if (hint)     hint.textContent      = t.hint;
  if (title)    title.setAttribute("dir", isRTL(lang)?"rtl":"ltr");
}
function setFeedback(text){ const el=qs(SEL.feedback); if (el) el.textContent=text||""; }
function clearFeedback(){ setFeedback(""); }

async function pickRandomItemWithCategories(lang){
  try{
    const idxSnap = await getDoc(doc(db,"config","classification_index"));
    if (idxSnap.exists()){
      const list = idxSnap.data()?.byLocale?.[lang] || idxSnap.data()?.byLocale?.ar || [];
      if (Array.isArray(list) && list.length){
        const id = rand(list);
        const d  = await getDoc(doc(db,"items", id));
        const v  = d.exists()? {id:d.id, ...d.data()} : null;
        if (hasCats(v,lang)) return v;
      }
    }
  }catch(e){}
  const seed = Math.random().toString(36).slice(2,8);
  const q1 = query(collection(db,"items"), orderBy("__name__"), startAt(seed), limit(50));
  const s1 = await getDocs(q1);
  const p1=[]; s1.forEach(d=>{ const v={id:d.id,...d.data()}; if (hasCats(v,lang)) p1.push(v); });
  if (p1.length) return rand(p1);

  const q2 = query(collection(db,"items"), orderBy("__name__"), limit(50));
  const s2 = await getDocs(q2);
  const p2=[]; s2.forEach(d=>{ const v={id:d.id,...d.data()}; if (hasCats(v,lang)) p2.push(v); });
  return p2.length? rand(p2) : null;
}
function hasCats(item, lang){
  const arr = item?.categories?.[lang] || item?.categories?.ar || [];
  return Array.isArray(arr) && arr.length>0;
}
async function getMasterCategories(lang){
  try{
    const snap = await getDoc(doc(db,"config","classification_categories"));
    if (snap.exists()){
      const data = snap.data() || {};
      const raw =
        data?.byLocale?.[lang] ??
        data?.byLocale?.ar ??
        data?.[lang] ??
        data?.ar ??
        [];
      const list = sanitizeCats(raw);
      if (list.length) return uniq(list);
    }
  } catch (e) {}
  return uniq(sanitizeCats(FALLBACK_CATS[lang] || FALLBACK_CATS.ar));
}
function pickItemImage(item){
  const images = item?.media?.images;
  if (Array.isArray(images) && images.length){
    return images.find(x=>x.role==="main") || images[0];
  }
  if (item?.image_path || item?.image_file){
    return { path: item.image_path || `images/${item.type}/${item.image_file}` };
  }
  return null;
}
function pickItemSoundUrl(item, lang, variant){
  if (!item?.sound) return null;
  const s = item.sound[lang] || item.sound.ar;
  if (!s) return null;
  if (typeof s === "string") return s;
  if (typeof s === "object") return s[variant] || s.boy || s.girl || s.teacher || Object.values(s)[0];
  return null;
}

/* ======= Utils ======= */
function msg(key){ return (UI[state.lang]||UI.ar)[key]; }
function isRTL(lang){ return lang==="ar" || lang==="he"; }
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function uniq(a){ return [...new Set(a.filter(Boolean).map(String))]; }
function clamp01(x){ return Math.max(0, Math.min(1, x)); }
function qs(s){ return document.querySelector(s); }
function qsa(s){ return Array.from(document.querySelectorAll(s)); }

// تنظيف الفئات + عينات آمنة
function asCleanString(x){ if (typeof x === "string") return x.trim(); if (x == null) return ""; return String(x).trim(); }
function sanitizeCats(arr){ if (!Array.isArray(arr)) return []; return arr.map(asCleanString).filter(Boolean); }
function sampleWithoutReplacement(arr, k, exclude = new Set()){
  const clean = sanitizeCats(arr).filter(v => !exclude.has(v));
  const out = [];
  for (let i = clean.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [clean[i], clean[j]] = [clean[j], clean[i]]; }
  for (let i = 0; i < clean.length && out.length < k; i++){ const v = clean[i]; if (v && !out.includes(v)) out.push(v); }
  return out;
}

/* ======= Fallback HTML (إذا فشل تحميل الجزئي) ======= */
function fallbackMainHTML(){
  return `
  <section id="family-groups-game" class="subject-screen">
    <h2 id="fg-item-name" class="subject-title"></h2>
    <div class="fg-stage">
      <button id="fg-card" class="fg-card mode-image" aria-grabbed="false">
        <img id="fg-image" src="" alt="" width="400" height="300" loading="lazy" decoding="async"
             style="aspect-ratio:4/3;object-fit:contain;" />
        <span id="fg-name-on-card" class="fg-name-on-card" aria-hidden="true"></span>
      </button>
      <div class="fg-bins" id="fg-bins"></div>
    </div>
    <div class="fg-feedback" id="fg-feedback" aria-live="polite"></div>
  </section>`;
}
function fallbackSidebarHTML(){
  return `
  <div class="sidebar-section" id="family-groups-controls" style="display:block;">
    <h3 class="sidebar-title">🎯 أين عائلتي؟</h3>
    <div id="sidebar-controls"></div>
    <div class="btn-row" style="margin-top:.5rem">
      <button id="fg-new-round-btn" class="nav-btn">🔄 ${UI.ar.newRound}</button>
      <button id="fg-listen-btn"   class="nav-btn ghost">🔊 ${UI.ar.listen}</button>
    </div>
    <div class="sidebar-stats">
      <div class="stat-line"><span>⭐ النقاط:</span> <strong id="fg-score">0</strong></div>
      <p class="hint" id="fg-hint">${UI.ar.hint}</p>
    </div>
  </div>`;
}
