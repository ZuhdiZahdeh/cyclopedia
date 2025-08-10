// src/subjects/professions-game.js
import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

let professions=[], currentIndex=0, currentItem=null;

const pick=(...ids)=>{for(const id of ids){const el=document.getElementById(id); if(el) return el;} return null;};
const grab=(ids)=>{const a=Array.isArray(ids)?ids:[ids]; for(const id of a){const el=document.getElementById(id); if(el) return el;} return null;};
const isAbs=(p)=>/^https?:\/\//i.test(p)||/^data:/i.test(p)||/^blob:/i.test(p);
const norm=(s)=>String(s||'').trim().replace(/^\.?[\\/]+/,'').replace(/\\/g,'/');

function setHighlightedName(el,name){ if(!el) return; if(!name){el.textContent='';return;} const c=[...name]; const first=c[0]||''; el.innerHTML=`<span class="highlight-first-letter">${first}</span>${c.slice(1).join('')}`; }

function getProfessionDisplayName(d, lang){
  if (d?.name?.[lang]) return d.name[lang];
  const key=d?.slug||d?.id||d?.name?.en||d?.name?.ar||d?.word||'';
  const k=String(key).toLowerCase().replace(/\s+/g,'_');
  const dict=window.translations||{}; const t=(dict.professions_words?.[k])||(dict.professions?.[k]);
  if (t && t[lang]) return t[lang];
  return d?.name?.ar || d?.name?.en || d?.name?.he || d?.title || d?.word || '';
}

function buildAudioCandidates(d, lang, voice){
  const key=`${voice}_${lang}`; let file=null;
  if(d?.voices&&d.voices[key]) file=d.voices[key];
  else if(d?.sound_base) file=`${d.sound_base}_${voice}_${lang}.mp3`;
  else if(d?.sound?.[lang]?.[voice]) file=d.sound[lang][voice];
  else if(typeof d?.audio==='string') file=d.audio;
  if(!file) return []; const f=norm(file); if(isAbs(f)||f.startsWith('/')) return [f];
  return [`/audio/${lang}/professions/${f}`, `/audio/${lang}/profession/${f}`, `/audio/${lang}/jobs/${f}`];
}

function updateProfessionContent(){
  const lang=getCurrentLang();
  if(!professions.length){
    pick('profession-word','item-word','item-name')?.textContent='—';
    const img=pick('profession-image','item-image'); if(img){ img.removeAttribute('src'); img.alt=''; }
    return;
  }
  currentItem=professions[currentIndex]; const d=currentItem;
  const name=getProfessionDisplayName(d,lang);

  const wordEl=pick('profession-word','item-word','item-name'); const imgEl=pick('profession-image','item-image');
  if (wordEl){ setHighlightedName(wordEl,name); wordEl.classList.add('clickable-text'); wordEl.onclick=playCurrentProfessionAudio; }
  if (imgEl){ const src=(d.image_path||d.image||''); imgEl.src=(isAbs(src)||src.startsWith('/'))?src:`/images/professions/${norm(src)}`; imgEl.alt=name||''; imgEl.onclick=playCurrentProfessionAudio; }

  const nextBtn=grab(['next-professions-btn','next-btn']); const prevBtn=grab(['prev-professions-btn','prev-btn']);
  if (nextBtn) nextBtn.disabled=(professions.length<=1||currentIndex===professions.length-1);
  if (prevBtn) prevBtn.disabled=(professions.length<=1||currentIndex===0);
  stopCurrentAudio();
}

export function showNextProfession(){ if(!professions.length) return; if(currentIndex<professions.length-1) currentIndex++; updateProfessionContent();
  try{ const u=JSON.parse(localStorage.getItem('user')); if(u) recordActivity(u,'professions'); }catch{} }
export function showPreviousProfession(){ if(!professions.length) return; if(currentIndex>0) currentIndex--; updateProfessionContent();
  try{ const u=JSON.parse(localStorage.getItem('user')); if(u) recordActivity(u,'professions'); }catch{} }
export async function playCurrentProfessionAudio(){
  if(!professions.length||!currentItem) return;
  const lang =(grab(['game-lang-select-professions','game-lang-select'])?.value)||getCurrentLang();
  const voice=(grab(['voice-select-professions','voice-select'])?.value)||'teacher';
  const candidates=buildAudioCandidates(currentItem, lang, voice);
  for(const src of candidates){ try{ stopCurrentAudio(); const m=playAudio(src); if(m?.then) await m; return; }catch{} }
}

async function fetchProfessions(){
  try{ const snap=await getDocs(collection(db,'professions'));
    if(!snap.empty){ professions=snap.docs.map(doc=>({id:doc.id,...doc.data()})); console.log('[professions] fetched =',professions.length); return; }
  }catch(e){ console.warn('[professions] fetch failed:',e); }
  professions=[];
}

export async function loadProfessionsGameContent(){
  const prevBtn      = grab(['prev-professions-btn','prev-btn']);
  const nextBtn      = grab(['next-professions-btn','next-btn']);
  const playSoundBtn = grab(['play-sound-btn-professions','listen-btn','listen']);
  const voiceSelect  = grab(['voice-select-professions','voice-select']);
  const langSelect   = grab(['game-lang-select-professions','game-lang-select']);

  if (prevBtn) prevBtn.onclick=showPreviousProfession;
  if (nextBtn) nextBtn.onclick=showNextProfession;
  if (playSoundBtn) playSoundBtn.onclick=playCurrentProfessionAudio;

  if (langSelect){ try{ langSelect.value=getCurrentLang(); }catch{}; langSelect.onchange=async()=>{
    const lng=langSelect.value; await loadLanguage(lng); setDirection(lng); applyTranslations(); updateProfessionContent(); }; }
  if (voiceSelect && !voiceSelect.value) voiceSelect.value='teacher';

  professions=[]; if(prevBtn) prevBtn.disabled=true; if(nextBtn) nextBtn.disabled=true; if(playSoundBtn) playSoundBtn.disabled=true;

  await fetchProfessions();
  if (!professions.length){
    pick('profession-word','item-word','item-name')?.textContent='لا توجد بيانات';
    const img=pick('profession-image','item-image'); if(img) img.src='/images/default.png';
    return;
  }

  const lang=getCurrentLang(); professions.sort((a,b)=>(a?.name?.[lang]||'').localeCompare(b?.name?.[lang]||'')); currentIndex=0; updateProfessionContent();
  if(prevBtn) prevBtn.disabled=(currentIndex===0); if(nextBtn) nextBtn.disabled=(professions.length<=1); if(playSoundBtn) playSoundBtn.disabled=false;

  if (typeof window!=='undefined'){
    window.loadProfessionsGameContent=loadProfessionsGameContent; window.showNextProfession=showNextProfession; window.showPreviousProfession=showPreviousProfession; window.playCurrentProfessionAudio=playCurrentProfessionAudio;
  }
}
