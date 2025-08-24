// src/subjects/family-groups-game.js
import { db } from "../js/firebase-config.js";
import {
  collection, doc, getDoc, getDocs, query, orderBy, limit, startAt
} from "firebase/firestore";
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
  // دعم النسخ القديمة (اختياري)
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
  ar:["ثديي","طائر","زاحف","مفترس","عاشب","فاكهة","خضار","أداة","مهنة","جزء جسم"],
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

export async function loadFamilyGroupsGameContent(){
  await mountViews();
  state.lang = getSelectedLang();
  bindControls();
  await newRound(true);
}

async function mountViews(){
  // المسرح
  const main = document.querySelector("main.main-content") || document.getElementById("main-content");
  if (main){
    const html = await fetch("/html/family-groups-game.html").then(r=>r.text()).catch(()=>null);
    main.innerHTML = html || fallbackMainHTML();
  }
  // الشريط الجانبي
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

  // تركيب الشريط الموحّد (لغة/صوت) داخل #sidebar-controls
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
  // أزرار النشاط الخاصة
  qs(SEL.btnNew)?.addEventListener("click", ()=>newRound(true));
  qs(SEL.btnListen)?.addEventListener("click", ()=>tryPlayItemSound());

  // أحداث عامة من الشريط الموحّد
  window.addEventListener("lang:change", (e)=>{
    const next = (e.detail?.lang) || "ar";
    LangMod?.setLang?.(next);
    state.lang = next;
    handleLangChanged();
  });

  window.addEventListener("voice:change", (e)=>{
    const v = (e.detail?.voice) || "boy";
    AudioMod?.setVoiceShape?.(v); // آمنة حتى لو غير موجودة
    state.soundVariant = v;
    tryPreloadItemAudio();
  });

  window.addEventListener("controls:next", ()=> newRound(true));
  window.addEventListener("controls:prev", ()=> newRound(true));
  window.addEventListener("controls:description", ()=> {
    // في هذا النشاط: اجعل زر "الوصف" يشغّل الصوت كمساعدة
    tryPlayItemSound();
  });

  // دعم قديم (selects) إذا كانت موجودة
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
  if (autoPlay) tryPlayItemSound(); // تشغيل تلقائي عند بداية كل جولة
}

async function handleLangChanged(){
  state.lang = getSelectedLang();
  relocalizeUI();
  if (!state.item) return newRound(true);
  fillItemCard(state.item, state.lang);
  await rebuildBinsForCurrentItem();
  tryPreloadItemAudio();
}

async function rebuildBinsForCurrentItem(){
  const lang = state.lang;
  const master   = await getMasterCategories(lang);
  const itemCats = (state.item?.categories?.[lang] || state.item?.categories?.ar || []).filter(Boolean);
  const correct  = itemCats.length ? rand(itemCats) : null;
  if (!correct) return newRound(true);

  const distractors = master.filter(c=>c && c!==correct);
  shuffle(distractors);
  const options = [correct, ...distractors.slice(0,3)];
  shuffle(options);

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
  if (nameOn){  nameOn.textContent  = label; nameOn.setAttribute("dir", isRTL(lang)?"rtl":"ltr"); }

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
  };
  const move = e=>{
    if (!dragging) return;
    const cx = ("clientX" in e? e.clientX : e.touches?.[0]?.clientX)||0;
    const cy = ("clientY" in e? e.clientY : e.touches?.[0]?.clientY)||0;
    dx=cx-sx; dy=cy-sy;
    card.style.transform=`translate(${dx}px,${dy}px)`;
  };
  const up = ()=>{
    if (!dragging) return;
    dragging=false;
    const target = detectBinHover(card,bins);
    if (target) tryDropOn(target);
    else {
      card.style.transition="transform 160ms ease";
      card.style.transform="translate(0,0)";
      card.setAttribute("aria-grabbed","false");
    }
  };

  card.addEventListener("pointerdown", down);
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup",   up);
  card.addEventListener("touchstart", down, {passive:true});
  window.addEventListener("touchmove", move, {passive:false});
  window.addEventListener("touchend",  up);
}

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
  return bestArea>200 ? best : null;
}

function tryDropOn(binEl){
  const chosen  = binEl?.dataset?.category;
  const correct = state.correctCategory;
  if (!chosen || !correct) return;

  if (chosen===correct){
    binEl.classList.add("correct");
    addScore(1);
    setFeedback(msg("correct"));
    playCorrect();
    logActivity(true, chosen, correct);
    swallowCard(binEl);
    setTimeout(()=>newRound(true), state.autoNextMs);
  } else {
    binEl.classList.add("incorrect");
    setFeedback(msg("wrong"));
    playWrong();
    logActivity(false, chosen, correct);
    setTimeout(()=>binEl.classList.remove("incorrect"), 360);
    const card = qs(SEL.card);
    card.style.transition="transform 160ms ease";
    card.style.transform="translate(0,0)";
    card.setAttribute("aria-grabbed","false");
  }
}

function swallowCard(binEl){
  const card = qs(SEL.card); if (!card) return;
  const b = binEl.getBoundingClientRect();
  const c = card.getBoundingClientRect();
  const dx = (b.left+b.width/2)  - (c.left+c.width/2);
  const dy = (b.top +b.height/2) - (c.top +c.height/2);
  card.style.transition="transform 240ms ease";
  card.style.transform = `translate(${dx}px,${dy}px) scale(0.8)`;
}

// ---------------- الصوت/النقاط/السجل ----------------
function tryPlayItemSound(){
  const url = pickItemSoundUrl(state.item, state.lang, getSelectedVoice());
  if (!url) return;
  try {
    if (AudioMod?.playUrl) AudioMod.playUrl(url);
    else new Audio(url).play().catch(()=>{});
  } catch {}
}
function tryPreloadItemAudio(){
  const url = pickItemSoundUrl(state.item, state.lang, getSelectedVoice());
  if (!url) return;
  const a = document.createElement("audio");
  a.src = url; a.preload = "auto";
}
function playCorrect(){ AudioMod?.playFeedback?.("correct", state.lang); }
function playWrong(){   AudioMod?.playFeedback?.("wrong",   state.lang); }
function addScore(n=1){ state.score+=n; const el=qs(SEL.score); if (el) el.textContent=String(state.score); }
function logActivity(ok, chosen, correct){
  const payload={ type:GAME_KEY, ok, chosen, correct, itemId:state.item?.id, lang:state.lang, ts:Date.now() };
  Activity?.recordActivity?.(payload);
}

// ---------------- مساعدين ----------------
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
  if (mode==="name"){ card.classList.add("mode-name"); img.setAttribute("aria-hidden","true");  name?.setAttribute("aria-hidden","false"); }
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
  }catch{}
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
    const cfg = await getDoc(doc(db,"config","classification_categories"));
    if (cfg.exists()){
      const list = cfg.data()?.[lang] || cfg.data()?.ar;
      if (Array.isArray(list) && list.length) return uniq(list);
    }
  }catch{}
  return uniq(FALLBACK_CATS[lang] || FALLBACK_CATS.ar);
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

// Utils
function msg(key){ return (UI[state.lang]||UI.ar)[key]; }
function isRTL(lang){ return lang==="ar" || lang==="he"; }
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function uniq(a){ return [...new Set(a.filter(Boolean).map(String))]; }
function qs(s){ return document.querySelector(s); }
function qsa(s){ return Array.from(document.querySelectorAll(s)); }

// Fallbacks (لو فشل جلب الـHTML)
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
