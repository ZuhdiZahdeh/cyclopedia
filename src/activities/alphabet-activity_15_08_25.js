// src/activities/alphabet-activity.js
// نشاط الحروف – نسخة نظيفة بدون نقاط فحص

import { db } from '@/core/db-handler.js';
import {
  collection, getDocs, query, where
} from 'firebase/firestore';
import { playAudio, stopCurrentAudio } from '@/core/audio-handler.js';

const LANGS = ['ar','en','he'];
const ALPHABET = {
  ar: ["أ","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه","و","ي"],
  en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  he: ["א","ב","ג","ד","ה","ו","ז","ח","ט","י","כ","ך","ל","מ","ם","נ","ן","ס","ע","פ","ף","צ","ץ","ק","ר","ש","ת"]
};

const SUBJECTS = ["animal","fruit","vegetable","tool","profession","human_body"];
const SUBJECT_ALIASES = {
  animals:'animal', fruits:'fruit', vegetables:'vegetable',
  tools:'tool', professions:'profession',
  body:'human_body', human_body:'human_body'
};

const state = {
  lang: 'ar',
  letter: 'أ',
  subjects: [...SUBJECTS],
  items: [],
  filtered: [],
  index: 0,
  showDescription: false,
};

function normalizeSubjects(list){
  return (list||[]).map(s => SUBJECT_ALIASES[s] || s);
}
function ensureLang(lang){
  const l = LANGS.includes(lang) ? lang : 'ar';
  state.lang = l;
  document.documentElement.lang = l;
  document.documentElement.dir = (l === 'ar' || l === 'he') ? 'rtl' : 'ltr';
  state.letter = (ALPHABET[l] && ALPHABET[l][0]) || state.letter;
}
function computeFirstLetter(word, lang){
  if (!word) return '';
  let w = String(word).trim();
  if (!w) return '';
  if (lang === 'ar'){
    w = w.replace(/^ال/, '');
    const ch = w[0];
    const map = {'إ':'أ','آ':'أ','ا':'أ','ة':'ت'};
    return map[ch] || ch;
  }
  if (lang === 'en') return (w[0] || '').toUpperCase();
  if (lang === 'he'){
    const ch = w[0] || '';
    const map = {'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'};
    return map[ch] || ch;
  }
  return w[0] || '';
}

function pickName(data, lang){
  return data?.name?.[lang] || data?.name?.ar || data?.title?.[lang] || data?.title?.ar || '';
}
function pickDescription(data, lang){
  return data?.description?.[lang] || data?.description?.ar || '';
}
function pickImage(data){
  const img1 = data?.media?.images?.main?.image_path || data?.media?.images?.main?.path || data?.media?.images?.main?.src;
  if (img1) return prefixSlash(img1);
  if (data?.image_path) return prefixSlash(data.image_path);
  if (data?.image) return prefixSlash(data.image);
  if (data?.image_file){
    const dir = subjectToDir(data?.subject);
    if (dir) return `/images/${dir}/${data.image_file}`;
  }
  return '';
}
function pickAudio(data, lang){
  const a1 = data?.media?.sounds?.[lang]?.main?.audio_path || data?.media?.sounds?.[lang]?.main?.path;
  if (a1) return prefixSlash(a1);
  const s = data?.sound?.[lang];
  if (typeof s === 'string') return prefixSlash(s);
  if (s?.boy) return prefixSlash(s.boy);
  if (s?.default) return prefixSlash(s.default);
  if (data?.sound_base){
    const dir = subjectToDir(data?.subject);
    if (dir) return `/audio/${lang}/${dir}/${data.sound_base}.mp3`;
  }
  return '';
}
function subjectToDir(subject){
  const s = SUBJECT_ALIASES[subject] || subject;
  return {
    animal:'animals',
    fruit:'fruits',
    vegetable:'vegetables',
    tool:'tools',
    profession:'professions',
    human_body:'body'
  }[s];
}
function prefixSlash(p){
  if (!p) return '';
  return p.startsWith('/') ? p : `/${p}`;
}
function chunk(arr, size){
  const out = [];
  for (let i=0;i<arr.length;i+=size) out.push(arr.slice(i, i+size));
  return out;
}
function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

async function fetchItemsBySubjects(subjects){
  const wanted = normalizeSubjects(subjects && subjects.length ? subjects : SUBJECTS);
  const chunks = chunk(wanted, 10);
  const col = collection(db, 'items');
  const all = [];
  for (const part of chunks){
    const qy = query(col, where('subject', 'in', part));
    const snap = await getDocs(qy);
    snap.forEach(doc => {
      const data = doc.data();
      const rec = {
        id: doc.id,
        subject: SUBJECT_ALIASES[data?.subject] || data?.subject,
        name: {
          ar: pickName(data, 'ar'),
          en: pickName(data, 'en'),
          he: pickName(data, 'he'),
        },
        description: {
          ar: pickDescription(data, 'ar'),
          en: pickDescription(data, 'en'),
          he: pickDescription(data, 'he'),
        },
        image: pickImage(data),
        audio: {
          ar: pickAudio(data,'ar'),
          en: pickAudio(data,'en'),
          he: pickAudio(data,'he'),
        },
        tags: data?.tags || [],
        difficulty: data?.difficulty || 'normal',
      };
      all.push(rec);
    });
  }
  return all;
}

function filterByLetter(items, letter, lang){
  const L = String(letter || '').trim();
  return items.filter(it => computeFirstLetter(it.name[lang], lang) === L);
}

function renderCurrent(){
  const nameEl = qs('#aa-name');
  const imgEl  = qs('#aa-image');
  const descEl = qs('#aa-desc');
  const countEl= qs('#aa-count');
  const letterBar = qs('#aa-letter-bar');

  if (letterBar) letterBar.textContent = state.letter || '';

  if (!state.filtered.length){
    if (nameEl) nameEl.innerHTML = `<span style="opacity:.8">(لا عناصر)</span>`;
    if (imgEl)  imgEl.src = '';
    if (descEl) descEl.style.display = 'none';
    if (countEl) countEl.textContent = '0';
    toggleNavButtons(false);
    return;
  }

  const idx = Math.max(0, Math.min(state.index, state.filtered.length-1));
  state.index = idx;
  const it = state.filtered[idx];

  const nm = it.name[state.lang] || '';
  const first = nm ? nm[0] : '';
  const rest  = nm ? nm.slice(1) : '';
  if (nameEl) nameEl.innerHTML = `<span style="font-weight:700">${first}</span>${rest}`;

  if (imgEl) imgEl.src = it.image || '';

  if (descEl){
    const txt = it.description[state.lang] || '';
    descEl.textContent = txt;
    descEl.style.display = state.showDescription && txt ? 'block' : 'none';
  }

  if (countEl) countEl.textContent = String(state.filtered.length);

  toggleNavButtons(true);
}

function toggleNavButtons(enabled){
  const btnPrev = qs('#aa-prev');
  const btnNext = qs('#aa-next');
  const btnPlay = qs('#aa-play');
  const btnDesc = qs('#aa-toggle-desc');

  [btnPrev, btnNext, btnPlay, btnDesc].forEach(b => {
    if (!b) return;
    b.disabled = !enabled;
  });
}

async function refetchAndRender(){
  stopCurrentAudio?.();
  state.items = await fetchItemsBySubjects(state.subjects);
  state.filtered = filterByLetter(state.items, state.letter, state.lang);
  state.index = 0;
  renderCurrent();
}

function refilterAndRender(){
  stopCurrentAudio?.();
  state.filtered = filterByLetter(state.items, state.letter, state.lang);
  state.index = 0;
  renderCurrent();
}

function buildUI(){
  let host = qs('#alphabet-activity-board');
  if (!host){
    const main = qs('.main-content') || document.body;
    host = document.createElement('section');
    host.id = 'alphabet-activity-board';
    host.innerHTML = `
      <div id="aa-letter-bar" class="aa-letter" style="text-align:center;margin:10px auto;padding:10px 16px;background:#111;color:#fff;border-radius:12px;max-width:520px;font-size:28px;letter-spacing:3px"></div>

      <div class="aa-card" style="text-align:center;margin-top:12px">
        <div id="aa-name" style="font-size:28px;font-weight:600;margin:6px 0"></div>
        <div class="image-area" style="display:flex;justify-content:center;margin:8px 0 12px">
          <img id="aa-image" alt="" loading="lazy" style="max-width:min(520px,90%);max-height:360px;object-fit:contain;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.08)" />
        </div>
        <div id="aa-desc" class="content-box" style="display:none;margin:8px auto;max-width:640px;font-size:16px;line-height:1.7"></div>
      </div>

      <div class="aa-actions" style="display:flex;gap:8px;justify-content:center;margin:12px 0 6px">
        <button id="aa-prev" class="btn nav-btn">السابق</button>
        <button id="aa-play" class="btn nav-btn">استمع</button>
        <button id="aa-toggle-desc" class="btn nav-btn">الوصف</button>
        <button id="aa-next" class="btn nav-btn">التالي</button>
      </div>

      <div style="text-align:center;margin-bottom:10px;opacity:.8">عدد العناصر: <span id="aa-count">0</span></div>
    `;
    main.appendChild(host);
  }

  mountSidebar('#alphabet-activity-controls');
  bindMainActions();

  const lb = qs('#aa-letter-bar');
  if (lb) lb.textContent = state.letter;
}

function mountSidebar(sidebarSelector){
  const sidebar = qs(sidebarSelector) || createSidebarFallback();
  if (!sidebar) return;

  sidebar.innerHTML = `
    <div class="sidebar-section">
      <h3 class="sidebar-title">اللغة</h3>
      <select id="aa-lang" class="select">
        <option value="ar">العربية</option>
        <option value="en">English</option>
        <option value="he">עברית</option>
      </select>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-title">الحروف</h3>
      <div id="aa-letters" class="letters-grid" style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px"></div>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-title">المواضيع</h3>
      <div id="aa-subjects" class="subjects-filter" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px"></div>
    </div>
  `;

  const sel = qs('#aa-lang');
  if (sel){
    sel.value = state.lang;
    sel.addEventListener('change', () => {
      ensureLang(sel.value);
      buildLetters();
      refilterAndRender();
    });
  }

  buildLetters();

  const subWrap = qs('#aa-subjects');
  if (subWrap){
    subWrap.innerHTML = SUBJECTS.map(s => `
      <label style="display:flex;align-items:center;gap:6px">
        <input type="checkbox" value="${s}" ${state.subjects.includes(s)?'checked':''}>
        <span>${labelOf(s)}</span>
      </label>
    `).join('');
    subWrap.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      chk.addEventListener('change', ()=>{
        const val = chk.value;
        if (chk.checked && !state.subjects.includes(val)) state.subjects.push(val);
        if (!chk.checked) state.subjects = state.subjects.filter(v => v!==val);
        refetchAndRender();
      });
    });
  }
}

function createSidebarFallback(){
  const aside = document.createElement('aside');
  aside.id = 'alphabet-activity-controls';
  aside.className = 'sidebar-section';
  const left = qs('#left-sidebar') || qs('.sidebar') || qs('aside') || null;
  if (left) left.appendChild(aside);
  else document.body.prepend(aside);
  return aside;
}

function buildLetters(){
  const grid = qs('#aa-letters');
  if (!grid) return;
  grid.innerHTML = '';

  const letters = ALPHABET[state.lang] || [];
  letters.forEach(ch => {
    const btn = document.createElement('button');
    btn.className = 'btn letter-btn';
    btn.textContent = ch;
    btn.style.padding = '8px 0';
    btn.addEventListener('click', ()=>{
      state.letter = ch;
      qsa('#aa-letters .letter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      refilterAndRender();
    });
    if (ch === state.letter) btn.classList.add('active');
    grid.appendChild(btn);
  });
}

function labelOf(subject){
  return {
    animal:'الحيوانات', fruit:'الفواكه', vegetable:'الخضروات',
    tool:'الأدوات', profession:'المهن', human_body:'جسم الإنسان'
  }[subject] || subject;
}

function bindMainActions(){
  qs('#aa-prev')?.addEventListener('click', ()=>{
    if (!state.filtered.length) return;
    state.index = (state.index - 1 + state.filtered.length) % state.filtered.length;
    renderCurrent();
  });
  qs('#aa-next')?.addEventListener('click', ()=>{
    if (!state.filtered.length) return;
    state.index = (state.index + 1) % state.filtered.length;
    renderCurrent();
  });
  qs('#aa-play')?.addEventListener('click', ()=>{
    if (!state.filtered.length) return;
    const it = state.filtered[state.index];
    const src = it?.audio?.[state.lang];
    if (src) playAudio(src);
  });
  qs('#aa-toggle-desc')?.addEventListener('click', ()=>{
    state.showDescription = !state.showDescription;
    renderCurrent();
  });
}

function observeGlobalLang(){
  const m = new MutationObserver(() => {
    const newLang = document.documentElement.lang || 'ar';
    if (newLang !== state.lang){
      ensureLang(newLang);
      buildLetters();
      refilterAndRender();
    }
  });
  m.observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
}

export async function loadAlphabetActivity(){
  try{
    ensureLang(document.documentElement.lang || state.lang);
    buildUI();
    observeGlobalLang();
    await refetchAndRender();
    console.log('✅ [alphabet-activity] ready:', {lang: state.lang, letter: state.letter, subjects: state.subjects});
  }catch(err){
    console.error('[alphabet-activity] failed to init', err);
    const nameEl = qs('#aa-name');
    if (nameEl) nameEl.textContent = 'حدث خطأ أثناء التحميل';
  }
}

export const loadAlphabetActivityContent = loadAlphabetActivity;
