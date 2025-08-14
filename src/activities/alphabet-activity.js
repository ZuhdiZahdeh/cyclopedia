// src/activities/alphabet-activity.js
import { db } from '@/core/db-handler.js';
import {
  collection, getDocs, query, where, documentId, doc, getDoc
} from 'firebase/firestore';

const LANGS = ['ar','en','he'];
const ALPHABET = {
  ar: ["أ","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه","و","ي"],
  en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  he: ["א","ב","ג","ד","ה","ו","ז","ח","ט","י","כ","ך","ל","מ","ם","נ","ן","ס","ע","פ","ף","צ","ץ","ק","ר","ש","ת"]
};
const ALL_SUBJECTS = ["animals","fruits","vegetables","tools","professions","human_body"];

const state = {
  lang: 'ar',
  letter: 'أ',
  subjects: [...ALL_SUBJECTS],
  tags: [],
  preferViews: true,
  autoplay: true,
  items: [],
  idx: 0,
  mode: 'explore'  // explore | quiz
};

// مشغّل صوت بسيط مستقل
const player = new Audio();
function playAudio(src){ try { if (!src) return; player.src = src; player.play().catch(()=>{});} catch{} }
function stopAudio(){ try { player.pause(); player.currentTime = 0; } catch{} }

const SIDEBAR_ID = 'alphabet-activity-controls';

// ============ نقطة الدخول العامة (تُستدعى بعد حقن HTML) ============
export async function loadAlphabetActivityContent(options = {}) {
  const {
    mainSelector = '#alphabet-activity-main',
    sidebarSelector = '.sidebar'
  } = options;

  ensureLang('ar'); // افتراضي
  updateLetterBadge();

  // ابنِ الشريط الجانبي بالكامل برمجيًا
  mountSidebar(sidebarSelector);

  // هيّئ شبكة الحروف حسب اللغة الحالية
  buildLettersGrid();

  // حمل البيانات واعرض
  await reloadData();
  render();

  // أربط أحداث الاستكشاف
  bindExploreControls();

  // الاختبار
  document.getElementById('quiz-next')?.addEventListener('click', buildQuiz);
}

// ============ الشريط الجانبي (بناء برمجي) ============
function mountSidebar(sidebarSelector){
  const sidebar = document.querySelector(sidebarSelector);
  if (!sidebar) return console.warn('[alphabet] Sidebar not found:', sidebarSelector);

  // أزل نسخة قديمة إن وجدت
  sidebar.querySelector('#'+SIDEBAR_ID)?.remove();

  const wrap = document.createElement('div');
  wrap.id = SIDEBAR_ID;                 // ← توحيد مع الثابت
  wrap.className = 'sidebar-section';   // مهم: ليتعامل معه نظام السايدبار

  wrap.innerHTML = `
    <div class="sidebar-section">
      <h3 class="sidebar-title">🌐 اللغة</h3>
      <select id="lang-select" class="select">
        <option value="ar"${state.lang==='ar'?' selected':''}>العربية</option>
        <option value="en"${state.lang==='en'?' selected':''}>English</option>
        <option value="he"${state.lang==='he'?' selected':''}>עברית</option>
      </select>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-title">🅰️ الحروف</h3>
      <div id="letters-grid" class="letters-grid"></div>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-title">🧩 المواضيع</h3>
      <div id="subjects-filter" class="subjects-filter">
        ${ALL_SUBJECTS.map(s => `
          <label><input type="checkbox" value="${s}" ${state.subjects.includes(s)?'checked':''}> ${labelOf(s)}</label>
        `).join('')}
      </div>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-title">🏷️ وسوم</h3>
      <input id="tags-input" class="input" placeholder="مثال: mammal, desert" />
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-title">🎮 الوضع</h3>
      <div class="mode-row">
        <label><input type="radio" name="mode" value="explore" ${state.mode==='explore'?'checked':''}> استكشاف</label>
        <label><input type="radio" name="mode" value="quiz" ${state.mode==='quiz'?'checked':''}> اختبار سريع</label>
      </div>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-title">⚙️ خيارات</h3>
      <label class="switch">
        <input id="autoplay-audio" type="checkbox" ${state.autoplay?'checked':''}>
        <span>تشغيل الصوت تلقائيًا</span>
      </label>
      <label class="switch">
        <input id="prefer-views" type="checkbox" ${state.preferViews?'checked':''}>
        <span>تسريع عبر المشاهد (views)</span>
      </label>
    </div>
  `;
  sidebar.prepend(wrap); // أعلى الشريط الجانبي

  // ربط أحداث الشريط الجانبي
  document.getElementById('lang-select')?.addEventListener('change', async e=>{
    ensureLang(e.target.value);
    buildLettersGrid();
    await reloadData();
    render();
    if (state.mode === 'quiz') buildQuiz();
  });

  document.getElementById('prefer-views')?.addEventListener('change', async e=>{
    state.preferViews = !!e.target.checked;
    await reloadData();
    render();
  });

  document.getElementById('autoplay-audio')?.addEventListener('change', e=>{
    state.autoplay = !!e.target.checked;
  });

  document.querySelectorAll('#subjects-filter input[type="checkbox"]').forEach(cb=>{
    cb.addEventListener('change', async ()=>{
      state.subjects = getSelectedSubjects();
      state.idx = 0;
      await reloadData();
      render();
      if (state.mode === 'quiz') buildQuiz();
    });
  });

  document.getElementById('tags-input')?.addEventListener('input', ()=>{
    state.tags = parseTags();
    filterByTagsInState();
    state.idx = 0;
    render();
  });

  document.querySelectorAll('input[name="mode"]').forEach(r=>{
    r.addEventListener('change', e=>{
      state.mode = e.target.value;
      updateModeView();
      if (state.mode === 'quiz') buildQuiz();
    });
  });
}

function labelOf(subject){
  return {
    animals:'الحيوانات', fruits:'الفواكه', vegetables:'الخضروات',
    tools:'الأدوات', professions:'المهن', human_body:'جسم الإنسان'
  }[subject] || subject;
}

function buildLettersGrid(){
  const grid = document.getElementById('letters-grid'); if (!grid) return;
  grid.innerHTML = '';
  (ALPHABET[state.lang]||[]).forEach(L=>{
    const b = document.createElement('button');
    b.className = 'nav-btn letter-btn';
    b.textContent = L;
    b.onclick = async ()=>{
      state.letter = L;
      state.idx = 0;
      updateLetterBadge();
      await reloadData();
      render();
      if (state.mode === 'quiz') buildQuiz();
    };
    grid.appendChild(b);
  });
}

// ============ تحميل البيانات ============
async function reloadData(){
  stopAudio();
  let list = [];
  if (state.preferViews){
    try { list = await loadViaViews(state.lang, state.letter, state.subjects); }
    catch(e){ console.warn('[views] fallback -> items:', e?.message||e); }
  }
  if (!list || !list.length){
    list = await queryItemsByLetter(state.lang, state.letter, state.subjects);
  }
  state.items = applyTagFilter(list, state.tags);
  sortByName(state.items, state.lang);
  state.idx = 0;
}

async function loadViaViews(lang, letter, subjects){
  const s = await getDoc(doc(collection(db,'views_letters'), `${lang}_${letter}`));
  if (!s.exists()) return [];
  const data = s.data() || {};
  let ids = [];
  if (subjects?.length && data.ids_by_subject){
    subjects.forEach(sub => ids.push(...(data.ids_by_subject[sub] || [])));
  } else { ids = data.ids_all || []; }
  ids = Array.from(new Set(ids));
  if (!ids.length) return [];

  const chunks = chunk(ids, 10);
  const out = [];
  for (const c of chunks){
    const q = query(collection(db,'items'), where(documentId(),'in', c));
    const snap = await getDocs(q);
    snap.forEach(d=>out.push({id:d.id, ...d.data()}));
  }
  return out;
}

async function queryItemsByLetter(lang, letter, subjects){
  const col = collection(db, 'items');
  const results = [];
  const subjChunks = chunk(subjects?.length?subjects:ALL_SUBJECTS, 10);

  for (const subc of subjChunks){
    let q1 = query(col, where('subject','in', subc), where(`letter.${lang}`, '==', letter));
    let s1 = await getDocs(q1); let arr=[]; s1.forEach(d=>arr.push({id:d.id,...d.data()}));
    if (!arr.length){
      let q2 = query(col, where('subject','in', subc), where(`first_letters.${lang}`, '==', letter));
      let s2 = await getDocs(q2); s2.forEach(d=>arr.push({id:d.id,...d.data()}));
    }
    results.push(...arr);
  }

  if (!results.length){
    const qAll = query(col, where('subject','in', subjects?.length?subjects:ALL_SUBJECTS));
    const sAll = await getDocs(qAll); const tmp=[]; sAll.forEach(d=>tmp.push({id:d.id,...d.data()}));
    return tmp.filter(it => computeFirstLetter(it?.name?.[lang]||'', lang) === letter);
  }
  return results;
}

// ============ العرض (استكشاف + اختبار) ============
function bindExploreControls(){
  document.getElementById('prev-btn')?.addEventListener('click', ()=>{
    if (!state.items.length) return;
    state.idx = (state.idx - 1 + state.items.length) % state.items.length;
    render();
  });
  document.getElementById('next-btn')?.addEventListener('click', ()=>{
    if (!state.items.length) return;
    state.idx = (state.idx + 1) % state.items.length;
    render();
  });
  document.getElementById('listen-btn')?.addEventListener('click', ()=>{
    const it = state.items[state.idx]; playAudio(pickAudio(it?.sound, state.lang));
  });
  document.getElementById('toggle-desc-btn')?.addEventListener('click', ()=>{
    const el = document.getElementById('item-description');
    el.style.display = (el.style.display === 'none' || !el.style.display) ? 'block' : 'none';
  });
}

function render(){
  updateModeView();

  const nameEl = document.getElementById('item-name');
  const imgEl  = document.getElementById('item-image');
  const descEl = document.getElementById('item-description');

  if (!state.items.length){
    nameEl.innerHTML = emphasizeFirst('(لا عناصر)', state.lang, state.letter);
    imgEl.src = ''; imgEl.alt=''; descEl.textContent='';
    return;
  }

  const it  = state.items[state.idx];
  const nm  = it?.name?.[state.lang] || '';
  const ds  = it?.description?.[state.lang] || '';
  const src = it?.image_path || '';

  nameEl.innerHTML = emphasizeFirst(nm, state.lang, state.letter);
  imgEl.src = src; imgEl.alt = nm;
  descEl.textContent = ds || '';

  if (state.autoplay){
    playAudio(pickAudio(it?.sound, state.lang));
  }
}

function buildQuiz(){
  const promptEl = document.getElementById('quiz-prompt');
  const optsEl   = document.getElementById('quiz-options');
  const fbEl     = document.getElementById('quiz-feedback');

  promptEl.innerHTML=''; optsEl.innerHTML=''; fbEl.textContent='';

  const pool = state.items.slice();
  if (pool.length < 4){
    document.getElementById('quiz-title').textContent = 'يلزم 4 عناصر على الأقل لهذا الحرف/الفلاتر.';
    return;
  }

  shuffle(pool);
  const correct = pool[0];
  const distractors = pool.slice(1)
    .filter(it => (it?.name?.[state.lang]||'') !== (correct?.name?.[state.lang]||''))
    .slice(0,3);

  const img = document.createElement('img');
  img.src = correct?.image_path || '';
  img.alt = correct?.name?.[state.lang] || '';
  promptEl.appendChild(img);

  shuffle([correct, ...distractors]).forEach(it=>{
    const name = it?.name?.[state.lang] || '';
    const b = document.createElement('button');
    b.className = 'nav-btn';
    b.textContent = name;
    b.onclick = ()=>{
      const ok = name === (correct?.name?.[state.lang]||'');
      fbEl.textContent = ok ? 'إجابة صحيحة ✅' : 'حاول مرة أخرى ❌';
      if (ok) playAudio(pickAudio(correct?.sound, state.lang));
    };
    optsEl.appendChild(b);
  });
}

// ============ أدوات ============
function updateLetterBadge(){ const b = document.getElementById('letter-badge'); if (b) b.textContent = state.letter || ''; }
function updateModeView(){
  const qv = document.getElementById('quiz-view');
  if (state.mode === 'quiz'){ qv.style.display='block'; }
  else { qv.style.display='none'; }
}
function getSelectedSubjects(){
  return Array.from(document.querySelectorAll('#subjects-filter input[type="checkbox"]:checked')).map(e=>e.value);
}
function parseTags(){
  const raw = (document.getElementById('tags-input')?.value||'').trim();
  return raw ? raw.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean) : [];
}
function filterByTagsInState(){ state.items = applyTagFilter(state.items, state.tags); }
function applyTagFilter(list, tags){
  if (!tags?.length) return list;
  return list.filter(it => {
    const t = (it?.tags || []).map(x=>String(x).toLowerCase());
    return tags.every(tag => t.includes(tag));
  });
}
function sortByName(list, lang){
  list.sort((a,b)=>{
    const A = (a?.name?.[lang]||'').toString();
    const B = (b?.name?.[lang]||'').toString();
    return A.localeCompare(B, lang==='en'?'en':(lang==='he'?'he':'ar'));
  });
}
function chunk(arr, n){ const out=[]; for(let i=0;i<arr.length;i+=n) out.push(arr.slice(i,i+n)); return out; }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j]];} return a; }
function pickAudio(soundMap, lang){
  const m = soundMap?.[lang]; if (!m) return null;
  return m.boy || m.girl || m.teacher || Object.values(m)[0] || null;
}
function emphasizeFirst(text, lang, expectedLetter){
  if (!text) return '';
  const target = expectedLetter || computeFirstLetter(text, lang);
  const idx = text.indexOf(target);
  if (idx>=0){
    return text.slice(0,idx) + `<span style="color:#e53935;font-weight:800">${text[idx]}</span>` + text.slice(idx+1);
  }
  return `<span style="color:#e53935;font-weight:800">${text[0]||''}</span>${text.slice(1)}`;
}
function ensureLang(lang){
  state.lang = LANGS.includes(lang) ? lang : 'ar';
  document.documentElement.lang = state.lang;
  document.documentElement.dir  = (state.lang==='ar' || state.lang==='he') ? 'rtl' : 'ltr';
  state.letter = (ALPHABET[state.lang] && ALPHABET[state.lang][0]) || state.letter;
}
function computeFirstLetter(word, lang){
  if (!word) return '';
  let w = word.trim();
  if (lang==='ar'){ w = w.replace(/^ال/, ''); return (w[0]||''); }
  if (lang==='en') return (w[0]||'').toUpperCase();
  if (lang==='he'){ const f=(w[0]||''); const map={'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'}; return map[f]||f; }
  return w[0]||'';
}
