// src/subjects/vegetables-game.js
// الخضروات — زر الوصف تلقائيًا + ربط IDs مرن + i18n للأسماء + مسارات صور/صوت احتياطية

import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

let vegetables = [], currentIndex = 0, currentVegData = null;

const pick=(...ids)=>{for(const id of ids){const el=document.getElementById(id); if(el) return el;} return null;};
const grab=(ids)=>{const a=Array.isArray(ids)?ids:[ids]; for(const id of a){const el=document.getElementById(id); if(el) return el;} return null;};
const isAbs=(p)=>/^https?:\/\//i.test(p)||/^data:/i.test(p)||/^blob:/i.test(p);
const norm=(s)=>String(s||'').trim().replace(/^\.?[\\/]+/,'').replace(/\\/g,'/');

const VEG_IMAGE_DIRS=['/images/vegetables/','/images/vegetable/'];
const AUDIO_VEG_DIRS=['vegetables','vegetable'];

function buildImageCandidates(d, lang){
  const names=[]; if(d?.image_path) names.push(d.image_path);
  if(Array.isArray(d?.images)){ for(const it of d.images){ if(typeof it==='string') names.push(it); else if(it&&typeof it==='object') names.push(it[lang]||it.main||it.src||it.default); } }
  else if(d?.images&&typeof d.images==='object'){ names.push(d.images[lang]||d.images.main||d.images.default); }
  if(d?.image) names.push(d.image);

  const out=[]; for(let s of Array.from(new Set(names.filter(Boolean)))){
    s=norm(s); if(isAbs(s)||s.startsWith('/')){ out.push(s); continue; }
    if(s.startsWith('images/')){ out.push('/'+s); continue; }
    for(const b of VEG_IMAGE_DIRS) out.push(b+s);
  } return Array.from(new Set(out));
}
function setImageWithFallback(imgEl,candidates){
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
  return Array.from(new Set(AUDIO_VEG_DIRS.map(dir=>`/audio/${lang}/${dir}/${f}`)));
}

function setHighlightedName(el,name){ if(!el) return; if(!name){el.textContent='';return;} const c=[...name]; const first=c[0]||''; el.innerHTML=`<span class="highlight-first-letter">${first}</span>${c.slice(1).join('')}`; }
function getVegName(d,lang){
  if (d?.name?.[lang]) return d.name[lang];
  const key=d?.slug||d?.id||d?.name?.en||d?.name?.ar||d?.word||'';
  const k=String(key).toLowerCase().replace(/\s+/g,'_');
  const dict=window.translations||{}; const t=(dict.vegetables_words?.[k])||(dict.vegetables?.[k]);
  if (t && t[lang]) return t[lang];
  return d?.name?.ar || d?.name?.en || d?.name?.he || d?.title || d?.word || '';
}

function ensureVegDescBtn(){
  if (grab(['toggle-description-btn-vegetables','toggle-description','desc-btn'])) return;
  const sec=document.getElementById('vegetables-sidebar-controls')||document.querySelector('.subject-controls')||document.querySelector('#sidebar');
  const grid=sec?.querySelector('.controls-grid')||sec; if(!grid) return;
  const btn=document.createElement('button'); btn.id='toggle-description-btn-vegetables'; btn.className='control-btn';
  btn.textContent=(window.translations?.common?.toggle_description)||'الوصف';
  btn.onclick=()=>{ const box=document.getElementById('vegetable-description-box')||document.querySelector('#vegetables-game .info-box');
    if(box) box.style.display=(box.style.display==='none'?'block':'none'); };
  grid.appendChild(btn);
}

/* العرض */
function updateVegetableContent(){
  const lang=getCurrentLang();
  if(!vegetables.length){
    { const el = pick('vegetable-word','item-word','item-name'); if (el) el.textContent = '—'; }
    { const img = pick('vegetable-image','item-image'); if (img){ img.removeAttribute('src'); img.alt=''; } }
    { const el = pick('vegetable-description','item-description'); if (el) el.textContent = '—'; }
    return;
  }
  currentVegData=vegetables[currentIndex]; const d=currentVegData; const name=getVegName(d,lang);

  const wordEl=pick('vegetable-word','item-word','item-name'); const imgEl=pick('vegetable-image','item-image'); const descEl=pick('vegetable-description','item-description');
  if (wordEl){ setHighlightedName(wordEl,name); wordEl.classList.add('clickable-text'); wordEl.onclick=playCurrentVegetableAudio; }

  const candidates=buildImageCandidates(d,lang);
  if (imgEl){ setImageWithFallback(imgEl, candidates.length?candidates:['/images/default.png']); imgEl.alt=name||''; imgEl.classList.add('clickable-image'); imgEl.onclick=playCurrentVegetableAudio; }
  if (descEl) descEl.textContent=(d.description&&(d.description[lang]||d.description.ar||d.description.en))||'—';

  const nextBtn=grab(['next-vegetables-btn','next-btn']); const prevBtn=grab(['prev-vegetables-btn','prev-btn']);
  if (nextBtn) nextBtn.disabled=(vegetables.length<=1||currentIndex===vegetables.length-1);
  if (prevBtn) prevBtn.disabled=(vegetables.length<=1||currentIndex===0);
  stopCurrentAudio();
}

/* تنقّل وصوت */
export function showNextVegetable(){ if(!vegetables.length) return; if(currentIndex<vegetables.length-1) currentIndex++; updateVegetableContent();
  try{ const u=JSON.parse(localStorage.getItem('user')); if(u) Promise.resolve(recordActivity(u,'vegetables')).catch(()=>{}); }catch{} }
export function showPreviousVegetable(){ if(!vegetables.length) return; if(currentIndex>0) currentIndex--; updateVegetableContent();
  try{ const u=JSON.parse(localStorage.getItem('user')); if(u) Promise.resolve(recordActivity(u,'vegetables')).catch(()=>{}); }catch{} }
export async function playCurrentVegetableAudio(){
  if(!vegetables.length||!currentVegData) return;
  const lang =(grab(['game-lang-select-vegetables','game-lang-select'])?.value)||getCurrentLang();
  const voice=(grab(['voice-select-vegetables','voice-select'])?.value)||'teacher';
  const candidates=buildAudioCandidates(currentVegData, lang, voice);
  for(const src of candidates){ try{ stopCurrentAudio(); const m=playAudio(src); if(m&&m.then) await m; return; }catch{} }
}

/* جلب البيانات */
async function fetchVegetables(){
  try{ const snap=await getDocs(collection(db,'vegetables'));
    if(!snap.empty){ vegetables=snap.docs.map(doc=>({id:doc.id,...doc.data()})); console.log('[vegetables] ✅ from vegetables | count =',vegetables.length); return; }
  }catch(e){ console.warn('[vegetables] fetch vegetables failed:',e); }
  try{ const snap=await getDocs(collection(db,'categories','vegetables','items'));
    if(!snap.empty){ vegetables=snap.docs.map(doc=>({id:doc.id,...doc.data()})); console.log('[vegetables] ✅ from categories/vegetables/items | count =',vegetables.length); return; }
  }catch(e){ console.warn('[vegetables] fetch categories/vegetables/items failed:',e); }
  vegetables=[];
}

/* التحميل */
export async function loadVegetablesGameContent(){
  const prevBtn      = grab(['prev-vegetables-btn','prev-btn']);
  const nextBtn      = grab(['next-vegetables-btn','next-btn']);
  const playSoundBtn = grab(['play-sound-btn-vegetables','listen-btn','listen']);
  const voiceSelect  = grab(['voice-select-vegetables','voice-select']);
  const langSelect   = grab(['game-lang-select-vegetables','game-lang-select']);

  ensureVegDescBtn();

  if (prevBtn) prevBtn.onclick=showPreviousVegetable;
  if (nextBtn) nextBtn.onclick=showNextVegetable;
  if (playSoundBtn) playSoundBtn.onclick=playCurrentVegetableAudio;

  const toggleDescBtn=grab(['toggle-description-btn-vegetables','toggle-description','desc-btn']);
  if (toggleDescBtn){
    toggleDescBtn.onclick=()=>{ const box=document.getElementById('vegetable-description-box')||document.querySelector('#vegetables-game .info-box');
      if(box) box.style.display=(box.style.display==='none'?'block':'none'); };
  }

  if (langSelect){
    try{ langSelect.value=getCurrentLang(); }catch{}
    langSelect.onchange=async()=>{ const lng=langSelect.value; await loadLanguage(lng); setDirection(lng); applyTranslations(); updateVegetableContent(); };
  }
  if (voiceSelect && !voiceSelect.value) voiceSelect.value='teacher';

  vegetables=[]; if(prevBtn) prevBtn.disabled=true; if(nextBtn) nextBtn.disabled=true; if(playSoundBtn) playSoundBtn.disabled=true;

  await fetchVegetables();
  if (!vegetables.length){
    { const el = pick('vegetable-word','item-word','item-name'); if (el) el.textContent = 'لا توجد بيانات'; }
    { const img = pick('vegetable-image','item-image'); if (img) img.src = '/images/default.png'; }
    { const el = pick('vegetable-description','item-description'); if (el) el.textContent = '—'; }
    return;
  }

  const lang=getCurrentLang(); vegetables.sort((a,b)=>(a?.name?.[lang]||'').localeCompare(b?.name?.[lang]||'')); currentIndex=0; updateVegetableContent();
  if(prevBtn) prevBtn.disabled=(currentIndex===0); if(nextBtn) nextBtn.disabled=(vegetables.length<=1); if(playSoundBtn) playSoundBtn.disabled=false;

  if (typeof window!=='undefined'){
    window.loadVegetablesGameContent=loadVegetablesGameContent; window.showNextVegetable=showNextVegetable; window.showPreviousVegetable=showPreviousVegetable; window.playCurrentVegetableAudio=playCurrentVegetableAudio;
  }
}
