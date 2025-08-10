// src/subjects/human-body-game.js
// أجزاء الجسم — سايدبار جاهز + زر وصف + صور/صوت احتياطية

import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

let parts=[], currentIndex=0, currentPartData=null;
let currentPartImages=[], currentImageIndex=0;

const pick=(...ids)=>{for(const id of ids){const el=document.getElementById(id); if(el) return el;} return null;};
const grab=(ids)=>{const a=Array.isArray(ids)?ids:[ids]; for(const id of a){const el=document.getElementById(id); if(el) return el;} return null;};
const isAbs=(p)=>/^https?:\/\//i.test(p)||/^data:/i.test(p)||/^blob:/i.test(p);
const norm=(s)=>String(s||'').trim().replace(/^\.?[\\/]+/,'').replace(/\\/g,'/');

const BODY_IMAGE_DIRS=['/images/human-body/','/images/human_body/','/images/humanbody/','/images/body/'];
const AUDIO_BODY_DIRS=['human-body','body','human_body','humanbody','body_parts'];

function buildImageCandidates(d, lang){
  const names=[]; if(d?.image_path) names.push(d.image_path);
  if(Array.isArray(d?.images)){ for(const it of d.images){ if(typeof it==='string') names.push(it); else if(it&&typeof it==='object') names.push(it[lang]||it.main||it.src||it.default); } }
  else if(d?.images&&typeof d.images==='object'){ names.push(d.images[lang]||d.images.main||d.images.default); }
  if(d?.image) names.push(d.image);

  const out=[]; for(let s of Array.from(new Set(names.filter(Boolean)))){
    s=norm(s);
    if(isAbs(s)||s.startsWith('/')){ out.push(s); continue; }
    if(s.startsWith('images/')){ out.push('/'+s); continue; }
    for(const b of BODY_IMAGE_DIRS) out.push(b+s);
  }
  return Array.from(new Set(out));
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
  if(!file) return [];
  const f=norm(file); if(isAbs(f)||f.startsWith('/')) return [f];
  return Array.from(new Set(AUDIO_BODY_DIRS.map(dir=>`/audio/${lang}/${dir}/${f}`)));
}

function setHighlightedName(el,name){ if(!el) return; if(!name){el.textContent='';return;}
  const c=[...name]; const first=c[0]||''; el.innerHTML=`<span class="highlight-first-letter">${first}</span>${c.slice(1).join('')}`; }
function getDisplayName(d, lang){
  if (d?.name?.[lang]) return d.name[lang];
  const key=d?.slug||d?.id||d?.name?.en||d?.name?.ar||d?.word||'';
  const k=String(key).toLowerCase().replace(/\s+/g,'_');
  const dict=window.translations||{}; const t=(dict.body_words?.[k])||(dict.body?.[k]);
  if (t && t[lang]) return t[lang];
  return d?.name?.ar || d?.name?.en || d?.name?.he || d?.title || d?.word || '';
}

/* Carousel */
function clearCarousel(){ const area=document.querySelector('#human-body-game .image-area'); if(!area) return;
  area.querySelector('#body-carousel-thumbs')?.remove(); area.querySelector('#body-carousel-prev')?.remove(); area.querySelector('#body-carousel-next')?.remove(); }
function buildCarousel(displayName){
  const area=document.querySelector('#human-body-game .image-area'); const mainImg=pick('body-image'); if(!area||!mainImg) return;
  clearCarousel(); if(!currentPartImages||currentPartImages.length<=1) return;
  const prev=document.createElement('button'); prev.id='body-carousel-prev'; prev.className='carousel-nav prev'; prev.textContent='‹';
  const next=document.createElement('button'); next.id='body-carousel-next'; next.className='carousel-nav next'; next.textContent='›';
  prev.onclick=()=>{ currentImageIndex=(currentImageIndex-1+currentPartImages.length)%currentPartImages.length; mainImg.src=currentPartImages[currentImageIndex]; syncThumbsActive(); };
  next.onclick=()=>{ currentImageIndex=(currentImageIndex+1)%currentPartImages.length; mainImg.src=currentPartImages[currentImageIndex]; syncThumbsActive(); };
  const thumbs=document.createElement('div'); thumbs.id='body-carousel-thumbs'; thumbs.className='carousel-thumbs';
  currentPartImages.forEach((src,idx)=>{ const t=document.createElement('img'); t.src=src; t.alt=displayName||''; t.className='carousel-thumb';
    t.onclick=()=>{ currentImageIndex=idx; mainImg.src=currentPartImages[currentImageIndex]; syncThumbsActive(); }; thumbs.appendChild(t); });
  area.appendChild(prev); area.appendChild(next); area.appendChild(thumbs); syncThumbsActive();
}
function syncThumbsActive(){ document.querySelectorAll('#body-carousel-thumbs .carousel-thumb').forEach((img,i)=>img.classList.toggle('active', i===currentImageIndex)); }

/* زر وصف إن لم يكن موجودًا */
function ensureBodyDescBtn(){
  if (grab(['toggle-description-btn-body','toggle-description','desc-btn'])) return;
  const sec=document.getElementById('human-body-sidebar-controls')||document.querySelector('.subject-controls')||document.querySelector('#sidebar');
  const grid=sec?.querySelector('.controls-grid')||sec; if(!grid) return;
  const btn=document.createElement('button'); btn.id='toggle-description-btn-body'; btn.className='control-btn';
  btn.textContent=(window.translations?.common?.toggle_description)||'الوصف';
  btn.onclick=()=>{ const box=document.getElementById('body-description-box')||document.querySelector('#human-body-game .info-box');
    if(box) box.style.display=(box.style.display==='none'?'block':'none'); };
  grid.appendChild(btn);
}

/* العرض */
function updateBodyContent(){
  const lang=getCurrentLang();
  if(!parts.length){
    pick('body-word')?.textContent='—'; const img=pick('body-image'); if(img){ img.removeAttribute('src'); img.alt=''; }
    pick('body-description')?.textContent='—'; clearCarousel(); return;
  }
  currentPartData=parts[currentIndex]; const d=currentPartData; const displayName=getDisplayName(d,lang);

  const wordEl=pick('body-word'), imgEl=pick('body-image'), descEl=pick('body-description');
  if (wordEl){ setHighlightedName(wordEl,displayName); wordEl.classList.add('clickable-text'); wordEl.onclick=playCurrentBodyAudio; }

  currentPartImages=buildImageCandidates(d,lang); currentImageIndex=0;
  if (imgEl){ setImageWithFallback(imgEl,currentPartImages.length?currentPartImages:['/images/default.png']); imgEl.alt=displayName||''; imgEl.classList.add('clickable-image'); imgEl.onclick=playCurrentBodyAudio; }
  buildCarousel(displayName);

  if (descEl) descEl.textContent=(d.description&&(d.description[lang]||d.description.ar||d.description.en))||'—';

  const nextBtn=grab(['next-body-btn','next-btn']); const prevBtn=grab(['prev-body-btn','prev-btn']);
  if (nextBtn) nextBtn.disabled=(parts.length<=1||currentIndex===parts.length-1);
  if (prevBtn) prevBtn.disabled=(parts.length<=1||currentIndex===0);
  stopCurrentAudio();
}

/* تنقّل وصوت */
export function showNextBodyPart(){ if(!parts.length) return; if(currentIndex<parts.length-1) currentIndex++; updateBodyContent();
  try{ const u=JSON.parse(localStorage.getItem('user')); if(u) recordActivity(u,'body'); }catch{} }
export function showPreviousBodyPart(){ if(!parts.length) return; if(currentIndex>0) currentIndex--; updateBodyContent();
  try{ const u=JSON.parse(localStorage.getItem('user')); if(u) recordActivity(u,'body'); }catch{} }
export async function playCurrentBodyAudio(){
  if(!parts.length||!currentPartData) return;
  const lang =(grab(['game-lang-select-body','game-lang-select'])?.value)||getCurrentLang();
  const voice=(grab(['voice-select-body','voice-select'])?.value)||'teacher';
  const candidates=buildAudioCandidates(currentPartData, lang, voice);
  for (const src of candidates){ try{ stopCurrentAudio(); const m=playAudio(src); if(m?.then) await m; return; }catch{} }
  console.warn('[body][audio] no valid source for', currentPartData?.id);
}

/* جلب البيانات */
async function fetchBodyParts(){
  const paths=[ ['human-body'], ['human_body'], ['body'], ['categories','human-body','items'], ['categories','human_body','items'], ['categories','body','items'] ];
  parts=[];
  for (const segs of paths){
    try{ const snap=await getDocs(collection(db, ...segs));
      if(!snap.empty){ parts=snap.docs.map(doc=>({id:doc.id,...doc.data()})); console.log('[body] ✅ fetched from:', segs.join('/'),'count =',parts.length); return; }
      else{ console.log('[body] empty:', segs.join('/')); } }
    catch(e){ console.warn('[body] fetch failed:', segs.join('/'), e?.code||e?.message||e); }
  }
  console.error('[body] ❌ no collection returned data');
}

/* سايدبار */
async function ensureBodySidebar(){
  const sidebar=document.getElementById('sidebar')||document.querySelector('.sidebar'); if(!sidebar) return;
  let container=document.getElementById('human-body-sidebar-controls'); if(container){ container.style.display='block'; return; }
  try{
    const resp=await fetch('/html/human-body-controls.html',{cache:'no-store'}); const html=await resp.text();
    const tmp=document.createElement('div'); tmp.innerHTML=html.trim(); container=tmp.firstElementChild;
    container.id='human-body-sidebar-controls'; container.classList.add('subject-controls'); container.style.display='block';
    const account=sidebar.querySelector('.static-section'); account?sidebar.insertBefore(container,account):sidebar.appendChild(container);
    applyTranslations();
  }catch(e){ console.warn('[body] controls load failed:',e); }
}

/* التحميل */
export async function loadHumanBodyGameContent(){
  console.log('[body] loadHumanBodyGameContent()'); stopCurrentAudio();

  const main=document.querySelector('main.main-content'); if(!main){ console.error('main not found'); return; }
  try{ const resp=await fetch('/html/human-body.html',{cache:'no-store'}); main.innerHTML=await resp.text(); }
  catch{ main.innerHTML=`<section id="human-body-game" class="topic-container subject-page">
    <div class="game-box"><h2 id="body-word" class="item-main-name" data-i18n="body.title">🧍‍♂️ أجزاء الجسم</h2>
    <div class="image-area"><img id="body-image" alt="" src="" loading="lazy" /></div>
    <div class="body-description-box info-box" id="body-description-box" style="display:none;"><h4 data-i18n="common.description">الوصف</h4><p id="body-description">—</p></div></div></section>`; }

  await ensureBodySidebar(); ensureBodyDescBtn();

  try{ window.hideAllControls?.(); window.showSubjectControls?.('human-body'); }catch{
    document.querySelectorAll('.sidebar-section[id$="-sidebar-controls"]').forEach(sec=>{
      sec.style.display=(sec.id==='human-body-sidebar-controls')?'block':'none';
    });
  }

  const prevBtn      = grab(['prev-body-btn','prev-btn']);
  const nextBtn      = grab(['next-body-btn','next-btn']);
  const playSoundBtn = grab(['play-sound-btn-body','listen-btn','listen']);
  const voiceSelect  = grab(['voice-select-body','voice-select']);
  const langSelect   = grab(['game-lang-select-body','game-lang-select']);
  const toggleDescBtn= grab(['toggle-description-btn-body','toggle-description','desc-btn']);

  if (prevBtn) prevBtn.onclick=showPreviousBodyPart;
  if (nextBtn) nextBtn.onclick=showNextBodyPart;
  if (playSoundBtn) playSoundBtn.onclick=playCurrentBodyAudio;
  if (toggleDescBtn){
    toggleDescBtn.onclick=()=>{ const box=document.getElementById('body-description-box')||document.querySelector('#human-body-game .info-box');
      if(box) box.style.display=(box.style.display==='none'?'block':'none'); };
  }
  if (langSelect){ try{ langSelect.value=getCurrentLang(); }catch{}; langSelect.onchange=async()=>{
    const lng=langSelect.value; await loadLanguage(lng); setDirection(lng); applyTranslations(); updateBodyContent(); };
  }
  if (voiceSelect && !voiceSelect.value) voiceSelect.value='teacher';

  parts=[]; if(prevBtn) prevBtn.disabled=true; if(nextBtn) nextBtn.disabled=true; if(playSoundBtn) playSoundBtn.disabled=true;

  await fetchBodyParts();
  if (!parts.length){
    pick('body-word')?.textContent='لا توجد بيانات'; const img=pick('body-image'); if(img) img.src='/images/default.png';
    pick('body-description')?.textContent='—'; clearCarousel(); return;
  }

  const lang=getCurrentLang(); parts.sort((a,b)=>(a?.name?.[lang]||'').localeCompare(b?.name?.[lang]||'')); currentIndex=0; updateBodyContent();
  if(prevBtn) prevBtn.disabled=(currentIndex===0); if(nextBtn) nextBtn.disabled=(parts.length<=1); if(playSoundBtn) playSoundBtn.disabled=false;
  applyTranslations(); setDirection(lang);

  if (typeof window!=='undefined'){ window.loadHumanBodyGameContent=loadHumanBodyGameContent; window.showNextBodyPart=showNextBodyPart; window.showPreviousBodyPart=showPreviousBodyPart; window.playCurrentBodyAudio=playCurrentBodyAudio; }
  console.log('[body] initial render done');
}
