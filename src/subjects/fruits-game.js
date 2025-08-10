// src/subjects/fruits-game.js
// الفواكه — يحافظ على هيكلك، يضيف زر الوصف تلقائياً ويربط IDs مختلفة ويحدّث الاسم مع اللغة

import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

let fruits=[], currentIndex=0, currentFruitData=null;

const pick=(...ids)=>{for(const id of ids){const el=document.getElementById(id); if(el) return el;} return null;};
const grab=(ids)=>{const a=Array.isArray(ids)?ids:[ids]; for(const id of a){const el=document.getElementById(id); if(el) return el;} return null;};
const isAbs=(p)=>/^https?:\/\//i.test(p)||/^data:/i.test(p)||/^blob:/i.test(p);
const norm=(s)=>String(s||'').trim().replace(/^\.?[\\/]+/,'').replace(/\\/g,'/');

function ensureCss(href,id){ if(document.getElementById(id)) return; const l=document.createElement('link'); l.rel='stylesheet'; l.href=href; l.id=id; document.head.appendChild(l); }

const FRUIT_IMAGE_DIRS=['/images/fruits/','/images/fruit/'];
const AUDIO_FRUIT_DIRS=['fruits','fruit'];

function buildImageCandidates(d, lang){
  const names=[]; if(d?.image_path) names.push(d.image_path);
  if(Array.isArray(d?.images)){ for(const it of d.images){ if(typeof it==='string') names.push(it); else if(it&&typeof it==='object') names.push(it[lang]||it.main||it.src||it.default); } }
  else if(d?.images&&typeof d.images==='object'){ names.push(d.images[lang]||d.images.main||d.images.default); }
  if(d?.image) names.push(d.image);

  const out=[]; for(let s of Array.from(new Set(names.filter(Boolean)))){
    s=norm(s); if(isAbs(s)||s.startsWith('/')){ out.push(s); continue; }
    if(s.startsWith('images/')){ out.push('/'+s); continue; }
    for(const b of FRUIT_IMAGE_DIRS) out.push(b+s);
  } return Array.from(new Set(out));
}
function setImageWithFallback(imgEl, candidates){
  let i=0; const tryNext=()=>{ if(!imgEl) return; if(i>=candidates.length){ imgEl.src='/images/default.png'; return; }
    imgEl.onerror=()=>{ i++; tryNext(); }; imgEl.src=candidates[i]; }; tryNext();
}
function buildAudioCandidates(d, lang, voice){
  const key=`${voice}_${lang}`; let file=null;
  if(d?.voices&&d.voices[key]) file=d.voices[key];
  else if(d?.sound_base) file=`${d.sound_base}_${voice}_${lang}.mp3`;
  else if(d?.sound?.[lang]?.[voice]) file=d.sound[lang][voice];
  else if(typeof d?.audio==='string') file=d.audio;
  if(!file) return []; const f=norm(file); if(isAbs(f)||f.startsWith('/')) return [f];
  return Array.from(new Set(AUDIO_FRUIT_DIRS.map(dir=>`/audio/${lang}/${dir}/${f}`)));
}

function setHighlightedName(el,name){ if(!el) return; if(!name){el.textContent='';return;} const c=[...name]; const first=c[0]||''; el.innerHTML=`<span class="highlight-first-letter">${first}</span>${c.slice(1).join('')}`; }
function getFruitName(d,lang){
  if (d?.name?.[lang]) return d.name[lang];
  const key=d?.slug||d?.id||d?.name?.en||d?.name?.ar||d?.word||'';
  const k=String(key).toLowerCase().replace(/\s+/g,'_');
  const dict=window.translations||{}; const t=(dict.fruits_words?.[k])||(dict.fruits?.[k]);
  if (t && t[lang]) return t[lang];
  return d?.name?.ar || d?.name?.en || d?.name?.he || d?.title || d?.word || '';
}

function ensureFruitsDescBtn(){
  if (grab(['toggle-description-btn-fruits','toggle-description','desc-btn'])) return;
  const sec=document.getElementById('fruits-sidebar-controls')||document.querySelector('.subject-controls')||document.querySelector('#sidebar');
  const grid=sec?.querySelector('.controls-grid')||sec; if(!grid) return;
  const btn=document.createElement('button'); btn.id='toggle-description-btn-fruits'; btn.className='control-btn';
  btn.textContent=(window.translations?.common?.toggle_description)||'الوصف';
  btn.onclick=()=>{ const box=document.getElementById('fruit-description-box')||document.querySelector('#fruits-game .info-box');
    if(box) box.style.display=(box.style.display==='none'?'block':'none'); };
  grid.appendChild(btn);
}

/* العرض */
function updateFruitContent(){
  const lang=getCurrentLang();
  if(!fruits.length){
    pick('fruit-word','item-word','item-name')?.textContent='—';
    const img=pick('fruit-image','item-image'); if(img){ img.removeAttribute('src'); img.alt=''; }
    pick('fruit-description','item-description')?.textContent='—'; return;
  }
  currentFruitData=fruits[currentIndex]; const d=currentFruitData; const name=getFruitName(d,lang);

  const wordEl=pick('fruit-word','item-word','item-name'); const imgEl=pick('fruit-image','item-image'); const descEl=pick('fruit-description','item-description');
  if (wordEl){ setHighlightedName(wordEl,name); wordEl.classList.add('clickable-text'); wordEl.onclick=playCurrentFruitAudio; }
  const candidates=buildImageCandidates(d,lang);
  if (imgEl){ setImageWithFallback(imgEl, candidates.length?candidates:['/images/default.png']); imgEl.alt=name||''; imgEl.classList.add('clickable-image'); imgEl.onclick=playCurrentFruitAudio; }
  if (descEl) descEl.textContent=(d.description&&(d.description[lang]||d.description.ar||d.description.en))||'—';

  const nextBtn=grab(['next-fruits-btn','next-btn']); const prevBtn=grab(['prev-fruits-btn','prev-btn']);
  if (nextBtn) nextBtn.disabled=(fruits.length<=1||currentIndex===fruits.length-1);
  if (prevBtn) prevBtn.disabled=(fruits.length<=1||currentIndex===0);
  stopCurrentAudio();
}

/* تنقّل وصوت */
export function showNextFruit(){ if(!fruits.length) return; if(currentIndex<fruits.length-1) currentIndex++; updateFruitContent();
  try{ const u=JSON.parse(localStorage.getItem('user')); if(u) recordActivity(u,'fruits'); }catch{} }
export function showPreviousFruit(){ if(!fruits.length) return; if(currentIndex>0) currentIndex--; updateFruitContent();
  try{ const u=JSON.parse(localStorage.getItem('user')); if(u) recordActivity(u,'fruits'); }catch{} }
export async function playCurrentFruitAudio(){
  if(!fruits.length||!currentFruitData) return;
  const lang =(grab(['game-lang-select-fruits','game-lang-select'])?.value)||getCurrentLang();
  const voice=(grab(['voice-select-fruits','voice-select'])?.value)||'teacher';
  const candidates=buildAudioCandidates(currentFruitData, lang, voice);
  for(const src of candidates){ try{ stopCurrentAudio(); const m=playAudio(src); if(m?.then) await m; return; }catch{} }
}

/* جلب البيانات */
async function fetchFruits(){
  try{ const snap=await getDocs(collection(db,'fruits'));
    if(!snap.empty){ fruits=snap.docs.map(doc=>({id:doc.id,...doc.data()})); console.log('[fruits] ✅ from fruits | count =',fruits.length); return; }
  }catch(e){ console.warn('[fruits] fetch fruits failed:',e); }
  try{ const snap=await getDocs(collection(db,'categories','fruits','items'));
    if(!snap.empty){ fruits=snap.docs.map(doc=>({id:doc.id,...doc.data()})); console.log('[fruits] ✅ from categories/fruits/items | count =',fruits.length); return; }
  }catch(e){ console.warn('[fruits] fetch categories/fruits/items failed:',e); }
  fruits=[];
}

/* التحميل */
export async function loadFruitsGameContent(){
  ensureCss('/css/fruits.css','fruits-css');

  const prevBtn      = grab(['prev-fruits-btn','prev-btn']);
  const nextBtn      = grab(['next-fruits-btn','next-btn']);
  const playSoundBtn = grab(['play-sound-btn-fruits','listen-btn','listen']);
  const voiceSelect  = grab(['voice-select-fruits','voice-select']);
  const langSelect   = grab(['game-lang-select-fruits','game-lang-select']);

  ensureFruitsDescBtn();

  if (prevBtn) prevBtn.onclick=showPreviousFruit;
  if (nextBtn) nextBtn.onclick=showNextFruit;
  if (playSoundBtn) playSoundBtn.onclick=playCurrentFruitAudio;

  const toggleDescBtn=grab(['toggle-description-btn-fruits','toggle-description','desc-btn']);
  if (toggleDescBtn){
    toggleDescBtn.onclick=()=>{ const box=document.getElementById('fruit-description-box')||document.querySelector('#fruits-game .info-box');
      if(box) box.style.display=(box.style.display==='none'?'block':'none'); };
  }

  if (langSelect){ try{ langSelect.value=getCurrentLang(); }catch{}; langSelect.onchange=async()=>{
    const lng=langSelect.value; await loadLanguage(lng); setDirection(lng); applyTranslations(); updateFruitContent(); }; }
  if (voiceSelect && !voiceSelect.value) voiceSelect.value='teacher';

  fruits=[]; if(prevBtn) prevBtn.disabled=true; if(nextBtn) nextBtn.disabled=true; if(playSoundBtn) playSoundBtn.disabled=true;

  await fetchFruits();
  if (!fruits.length){
    pick('fruit-word','item-word','item-name')?.textContent='لا توجد بيانات';
    const img=pick('fruit-image','item-image'); if(img) img.src='/images/default.png';
    pick('fruit-description','item-description')?.textContent='—'; return;
  }

  const lang=getCurrentLang(); fruits.sort((a,b)=>(a?.name?.[lang]||'').localeCompare(b?.name?.[lang]||'')); currentIndex=0; updateFruitContent();
  if(prevBtn) prevBtn.disabled=(currentIndex===0); if(nextBtn) nextBtn.disabled=(fruits.length<=1); if(playSoundBtn) playSoundBtn.disabled=false;

  if (typeof window!=='undefined'){
    window.loadFruitsGameContent=loadFruitsGameContent; window.showNextFruit=showNextFruit; window.showPreviousFruit=showPreviousFruit; window.playCurrentFruitAudio=playCurrentFruitAudio;
  }
}
