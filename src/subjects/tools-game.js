// src/subjects/tools-game.js
// صفحة الأدوات — سايدبار جاهز + Carousel + مسارات صور/صوت احتياطية + تضمين CSS عند الحاجة

import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

/* ============== حالة الصفحة ============== */
let tools = [];
let currentIndex = 0;
let currentToolData = null;
let currentToolImages = [];
let currentImageIndex = 0;

/* ============== أدوات عامة ============== */
const pick = (...ids) => { for (const id of ids){ const el = document.getElementById(id); if (el) return el; } return null; };
const grab = (ids) => { const a = Array.isArray(ids) ? ids : [ids]; for (const id of a){ const el = document.getElementById(id); if (el) return el; } return null; };
const isAbs = (p) => /^https?:\/\//i.test(p) || /^data:/i.test(p) || /^blob:/i.test(p);
const norm = (s) => String(s||'').trim().replace(/^\.?[\\/]+/,'').replace(/\\/g,'/');

function ensureCss(href, id){
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet'; link.href = href; link.id = id;
  document.head.appendChild(link);
}

/* ============== مسارات الصور/الصوت ============== */
const TOOL_IMAGE_DIRS = ['/images/profession_tools/','/images/tools/','/images/profession-tools/','/images/professions_tools/'];
const AUDIO_TOOLS_DIRS = ['tools','profession_tools','profession-tools','tool'];

function buildImageCandidates(d, lang){
  const names = [];
  if (d?.image_path) names.push(d.image_path);

  if (Array.isArray(d?.images)){
    for(const it of d.images){
      if (typeof it === 'string') names.push(it);
      else if (it && typeof it === 'object') names.push(it[lang]||it.main||it.src||it.default);
    }
  } else if (d?.images && typeof d.images === 'object'){
    names.push(d.images[lang]||d.images.main||d.images.default);
  }
  if (d?.image) names.push(d.image);

  const out = [];
  for (let s of Array.from(new Set(names.filter(Boolean)))){
    s = norm(s);
    if (isAbs(s) || s.startsWith('/')) { out.push(s); continue; }
    if (s.startsWith('images/')) { out.push('/'+s); continue; }
    for (const base of TOOL_IMAGE_DIRS) out.push(base+s);
  }
  return Array.from(new Set(out));
}
function setImageWithFallback(imgEl, candidates){
  let i = 0;
  const tryNext = () => {
    if (!imgEl) return;
    if (i >= candidates.length){ imgEl.src = '/images/default.png'; return; }
    imgEl.onerror = () => { i++; tryNext(); };
    imgEl.src = candidates[i];
  };
  tryNext();
}
function buildAudioCandidates(d, lang, voice){
  const key = `${voice}_${lang}`;
  let file = null;
  if (d?.voices && d.voices[key]) file = d.voices[key];
  else if (d?.sound_base)         file = `${d.sound_base}_${voice}_${lang}.mp3`;
  else if (d?.sound?.[lang]?.[voice]) file = d.sound[lang][voice];
  else if (typeof d?.audio === 'string') file = d.audio;

  if (!file) return [];
  const f = norm(file);
  if (isAbs(f) || f.startsWith('/')) return [f];
  return Array.from(new Set(AUDIO_TOOLS_DIRS.map(dir => `/audio/${lang}/${dir}/${f}`)));
}

/* ============== واجهة الاسم ============== */
function setHighlightedName(el, name){
  if (!el) return;
  if (!name){ el.textContent = ''; return; }
  const chars = [...name]; const first = chars[0] || '';
  el.innerHTML = `<span class="highlight-first-letter">${first}</span>${chars.slice(1).join('')}`;
}
function translateProfessionKey(key){ return (window.translations?.professions?.[key]) || key; }

/* ============== Carousel ============== */
function clearCarousel(){
  const area = document.querySelector('#tools-game .image-area'); if (!area) return;
  const t = area.querySelector('#tool-carousel-thumbs'); if (t) t.remove();
  const p = area.querySelector('#tool-carousel-prev');   if (p) p.remove();
  const n = area.querySelector('#tool-carousel-next');   if (n) n.remove();
}
function buildCarousel(displayName){
  const area = document.querySelector('#tools-game .image-area'), mainImg = pick('tool-image'); if (!area || !mainImg) return;
  clearCarousel();
  if (!currentToolImages || currentToolImages.length <= 1) return;

  const prevBtn = document.createElement('button'); prevBtn.id='tool-carousel-prev'; prevBtn.className='carousel-nav prev'; prevBtn.textContent='‹';
  const nextBtn = document.createElement('button'); nextBtn.id='tool-carousel-next'; nextBtn.className='carousel-nav next'; nextBtn.textContent='›';

  prevBtn.onclick = () => { currentImageIndex = (currentImageIndex-1+currentToolImages.length)%currentToolImages.length; mainImg.src=currentToolImages[currentImageIndex]; syncThumbsActive(); };
  nextBtn.onclick = () => { currentImageIndex = (currentImageIndex+1)%currentToolImages.length; mainImg.src=currentToolImages[currentImageIndex]; syncThumbsActive(); };

  const thumbs = document.createElement('div'); thumbs.id='tool-carousel-thumbs'; thumbs.className='carousel-thumbs';
  currentToolImages.forEach((src,idx)=>{ const t = document.createElement('img'); t.src=src; t.alt=displayName||''; t.className='carousel-thumb';
    t.onclick = () => { currentImageIndex = idx; mainImg.src=currentToolImages[currentImageIndex]; syncThumbsActive(); };
    thumbs.appendChild(t);
  });

  area.appendChild(prevBtn); area.appendChild(nextBtn); area.appendChild(thumbs);
  syncThumbsActive();
}
function syncThumbsActive(){
  document.querySelectorAll('#tool-carousel-thumbs .carousel-thumb').forEach((img,i)=>img.classList.toggle('active', i===currentImageIndex));
}

/* ============== العرض ============== */
function updateToolContent(){
  const lang = getCurrentLang();
  if (!tools.length){
    { const el = pick('tool-word','tool-name'); if (el) el.textContent = '—'; }
    { const img = pick('tool-image'); if (img) { img.removeAttribute('src'); img.alt = ''; } }
    { const el = pick('tool-description'); if (el) el.textContent = '—'; }
    { const el = pick('tool-professions'); if (el) el.textContent = '—'; }
    clearCarousel();
    return;
  }
  currentToolData = tools[currentIndex];
  const d = currentToolData;

  const displayName = (d.name && (d.name[lang] || d.name.ar || d.name.en || d.name.he)) || d.title || d.word || '';

  const wordEl = pick('tool-word','tool-name');
  const imgEl  = pick('tool-image');
  const descEl = pick('tool-description');
  const profEl = pick('tool-professions');

  if (wordEl){ setHighlightedName(wordEl, displayName); wordEl.classList.add('clickable-text'); wordEl.onclick = playCurrentToolAudio; }

  currentToolImages = buildImageCandidates(d, lang);
  currentImageIndex = 0;

  if (imgEl){
    setImageWithFallback(imgEl, currentToolImages.length ? currentToolImages : ['/images/default.png']);
    imgEl.alt = displayName || '';
    imgEl.classList.add('clickable-image');
    imgEl.onclick = playCurrentToolAudio;
  }
  buildCarousel(displayName);

  if (descEl) descEl.textContent = (d.description && (d.description[lang] || d.description.ar || d.description.en)) || '—';
  if (profEl){
    const list = Array.isArray(d.professions) ? d.professions : (d.professions ? Object.values(d.professions) : []);
    profEl.textContent = list.length ? list.map(translateProfessionKey).join('، ') : '—';
  }

  const nextBtn = grab(['next-tools-btn','next-btn']);
  const prevBtn = grab(['prev-tools-btn','prev-btn']);
  if (nextBtn) nextBtn.disabled = (tools.length <= 1 || currentIndex === tools.length - 1);
  if (prevBtn) prevBtn.disabled = (tools.length <= 1 || currentIndex === 0);

  stopCurrentAudio();
}

/* ============== تنقّل وصوت ============== */
export function showNextTool(){
  if (!tools.length) return;
  if (currentIndex < tools.length - 1) currentIndex++;
  updateToolContent();
  try {
    const u = JSON.parse(localStorage.getItem('user'));
    if (u) Promise.resolve(recordActivity(u,'tools')).catch(()=>{});
  } catch {}
}
export function showPreviousTool(){
  if (!tools.length) return;
  if (currentIndex > 0) currentIndex--;
  updateToolContent();
  try {
    const u = JSON.parse(localStorage.getItem('user'));
    if (u) Promise.resolve(recordActivity(u,'tools')).catch(()=>{});
  } catch {}
}
export async function playCurrentToolAudio(){
  if (!tools.length || !currentToolData) return;
  const lang  = (grab(['game-lang-select-tools','game-lang-select'])?.value) || getCurrentLang();
  const voice = (grab(['voice-select-tools','voice-select'])?.value) || 'teacher';
  const candidates = buildAudioCandidates(currentToolData, lang, voice);
  for (const src of candidates){
    try { stopCurrentAudio(); const m = playAudio(src); if (m && typeof m.then === 'function') await m; return; }
    catch {}
  }
  console.warn('[tools][audio] لا يوجد مصدر صوت صالح', currentToolData?.id);
}

/* ============== جلب البيانات ============== */
async function fetchTools(){
  try{
    const snap = await getDocs(collection(db,'profession_tools'));
    if (!snap.empty){ tools = snap.docs.map(d=>({id:d.id,...d.data()})); console.log('[tools] ✅ from profession_tools | count =', tools.length); return; }
  }catch(e){ console.warn('[tools] fetch profession_tools failed:', e); }
  try{
    const snap = await getDocs(collection(db,'categories','tools','items'));
    if (!snap.empty){ tools = snap.docs.map(d=>({id:d.id,...d.data()})); console.log('[tools] ✅ from categories/tools/items | count =', tools.length); return; }
  }catch(e){ console.warn('[tools] fetch categories/tools/items failed:', e); }
  tools = [];
}

/* ============== سايدبار (robust) ============== */
async function ensureToolsSidebar(){
  const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
  if (!sidebar){ console.warn('[tools] sidebar not found'); return null; }
  let container = document.getElementById('tools-sidebar-controls');
  if (container){ container.style.display = 'block'; return container; }

  const FALLBACK_HTML = `
  <div class="sidebar-section subject-controls" id="tools-sidebar-controls" style="display:block;">
    <h3 class="sidebar-title" data-i18n="tools.controls_title">🧰 أدوات — التحكم</h3>
    <div class="controls-grid">
      <button id="prev-tools-btn" class="control-btn" data-i18n="common.prev">السابق</button>
      <button id="next-tools-btn" class="control-btn" data-i18n="common.next">التالي</button>
      <button id="play-sound-btn-tools" class="control-btn" data-i18n="common.listen">استمع</button>
      <button id="toggle-description-btn-tools" class="control-btn" data-i18n="common.toggle_description">الوصف</button>

      <label for="voice-select-tools" class="control-label" data-i18n="common.voice">نوع الصوت</label>
      <select id="voice-select-tools" class="select-control">
        <option value="teacher" data-i18n="voices.teacher">المعلم</option>
        <option value="boy"     data-i18n="voices.boy">ولد</option>
        <option value="girl"    data-i18n="voices.girl">بنت</option>
      </select>

      <label for="game-lang-select-tools" class="control-label" data-i18n="common.language">اللغة</label>
      <select id="game-lang-select-tools" class="select-control">
        <option value="ar">العربية</option>
        <option value="en">English</option>
        <option value="he">עברית</option>
      </select>
    </div>
  </div>`;

  let html = '';
  try { const resp = await fetch('/html/tools-controls.html',{cache:'no-store'}); if (resp.ok) html = await resp.text(); }
  catch(e){ console.warn('[tools] controls fetch error:', e); }

  const tmp = document.createElement('div'); tmp.innerHTML = (html || FALLBACK_HTML).trim();
  container = tmp.firstElementChild;
  container.id = 'tools-sidebar-controls';
  container.classList.add('subject-controls');
  container.style.display = 'block';

  const account = sidebar.querySelector('.static-section');
  if (account) sidebar.insertBefore(container, account); else sidebar.appendChild(container);

  applyTranslations();
  return container;
}

/* ============== التحميل ============== */
export async function loadToolsGameContent(){
  console.log('[tools] loadToolsGameContent()');
  stopCurrentAudio();

  const main = document.querySelector('main.main-content');
  if (!main){ console.error('main.main-content not found'); return; }
  try { const resp = await fetch('/html/tools.html',{cache:'no-store'}); main.innerHTML = await resp.text(); }
  catch {
    main.innerHTML = `
      <section id="tools-game" class="topic-container subject-page">
        <div class="game-box">
          <h2 id="tool-word" class="item-main-name" data-i18n="tools.title">🧰 الأدوات</h2>
          <div class="image-area"><img id="tool-image" alt="" src="" loading="lazy" /></div>
          <div class="tool-description-box info-box" id="tool-description-box" style="display:none;">
            <h4 data-i18n="common.description">الوصف</h4>
            <p id="tool-description">—</p>
            <p><strong data-i18n="tools.related_professions">المهن المرتبطة</strong>: <span id="tool-professions">—</span></p>
          </div>
        </div>
      </section>`;
  }

  ensureCss('/css/tools.css','tools-css'); // مهم لتنسيق الصور والأزرار

  const controls = await ensureToolsSidebar();
  if (!controls){ console.warn('[tools] controls not mounted'); return; }

  try {
    window.hideAllControls?.(); window.showSubjectControls?.('tools');
  } catch {
    document.querySelectorAll('.sidebar-section[id$="-sidebar-controls"]').forEach(sec=>{
      sec.style.display = (sec.id === 'tools-sidebar-controls') ? 'block' : 'none';
    });
  }

  const prevBtn       = grab(['prev-tools-btn','prev-btn']);
  const nextBtn       = grab(['next-tools-btn','next-btn']);
  const playSoundBtn  = grab(['play-sound-btn-tools','listen-btn','listen']);
  const voiceSelect   = grab(['voice-select-tools','voice-select']);
  const langSelect    = grab(['game-lang-select-tools','game-lang-select']);
  const toggleDescBtn = grab(['toggle-description-btn-tools','toggle-description','desc-btn']);

  if (prevBtn) prevBtn.onclick = showPreviousTool;
  if (nextBtn) nextBtn.onclick = showNextTool;
  if (playSoundBtn) playSoundBtn.onclick = playCurrentToolAudio;
  if (toggleDescBtn){
    toggleDescBtn.onclick = () => {
      const box = document.getElementById('tool-description-box') || document.querySelector('#tools-game .info-box');
      if (box) box.style.display = (box.style.display === 'none' ? 'block' : 'none');
    };
  }
  if (langSelect){
    try { langSelect.value = getCurrentLang(); } catch {}
    langSelect.onchange = async () => {
      const lng = langSelect.value;
      await loadLanguage(lng);
      setDirection(lng);
      applyTranslations();
      updateToolContent();
    };
  }
  if (voiceSelect && !voiceSelect.value) voiceSelect.value = 'teacher';

  tools = [];
  if (prevBtn) prevBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = true;
  if (playSoundBtn) playSoundBtn.disabled = true;

  await fetchTools();

  if (!tools.length){
    { const el = pick('tool-word','tool-name'); if (el) el.textContent = 'لا توجد بيانات'; }
    { const img = pick('tool-image'); if (img) img.src = '/images/default.png'; }
    { const el = pick('tool-description'); if (el) el.textContent = '—'; }
    { const el = pick('tool-professions'); if (el) el.textContent = '—'; }
    clearCarousel();
    return;
  }

  const lang = getCurrentLang();
  tools.sort((a,b)=>(a?.name?.[lang]||'').localeCompare(b?.name?.[lang]||''));
  currentIndex = 0;
  updateToolContent();

  if (prevBtn) prevBtn.disabled = (currentIndex === 0);
  if (nextBtn) nextBtn.disabled = (tools.length <= 1);
  if (playSoundBtn) playSoundBtn.disabled = false;

  applyTranslations();
  setDirection(lang);

  if (typeof window !== 'undefined'){
    window.loadToolsGameContent = loadToolsGameContent;
    window.showNextTool         = showNextTool;
    window.showPreviousTool     = showPreviousTool;
    window.playCurrentToolAudio = playCurrentToolAudio;
  }
  console.log('[tools] initial render done');
}
