// src/subjects/memory-game.js — unified DB (items)

import { db } from '../js/firebase-config.js';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';


// ---- Fixed image + LCP helpers (unified) ----
const __FIXED_IMG_W = 800, __FIXED_IMG_H = 600;
function __ensureGlobalFixedImgCSS(){
  if (document.getElementById('fixed-img-css')) return;
  const st = document.createElement('style');
  st.id = 'fixed-img-css';
  st.textContent = `[id$="-image"], #subject-image, .subject-image img, img.tool-image, img.option-image { width:100%; height:auto; display:block; aspect-ratio: 4 / 3; }`;
  document.head.appendChild(st);
}
function __ensureFixedLcpAttrs(img, isLcp=true){
  if (!img) return;
  try {
    img.setAttribute('width',  img.getAttribute('width')  || String(__FIXED_IMG_W));
    img.setAttribute('height', img.getAttribute('height') || String(__FIXED_IMG_H));
    img.setAttribute('decoding', 'async');
    img.setAttribute('loading', isLcp ? 'eager' : 'lazy');
    img.setAttribute('fetchpriority', isLcp ? 'high' : 'low');
    // CSS safety
    img.style.width = '100%'; img.style.height = 'auto'; img.style.display = 'block'; img.style.aspectRatio = '4 / 3';
  } catch {}
}
__ensureGlobalFixedImgCSS();


// -------------------- إعدادات وأنماط الأنواع --------------------
const TYPE_SYNONYMS = {
  'animal':      ['animal','animals','Animal','Animals'],
  'fruit':       ['fruit','fruits','Fruit','Fruits'],
  'vegetable':   ['vegetable','vegetables','Vegetable','Vegetables'],
  'profession':  ['profession','professions','Profession','Professions'],
  'tool':        ['tool','tools','profession_tool','profession_tools','Tool','Tools'],
  'human-body':  ['human-body','human_body','humanbody','HumanBody','Human_Body']
};

const IMAGES_DIR = {
  'animal': 'animals',
  'fruit': 'fruits',
  'vegetable': 'vegetables',
  'profession': 'professions',
  'tool': 'profession_tools',   // صور الأدوات عندكم بهذا الاسم
  'human-body': 'human_body'
};
const AUDIO_DIR = {
  'tool': 'tools'               // أصوات الأدوات عندكم audio/<lang>/tools/...
};
function imagesDirFor(type){ return IMAGES_DIR[type] || `${type}s`; }
function audioDirFor(type){ return AUDIO_DIR[type]  || `${type}s`; }

function isRtl(lang){ return lang === 'ar' || lang === 'he'; }

// -------------------- عناصر الواجهة --------------------
let gameBoard, gameStatusDisplay;
let cards = [], flippedCards = [];
let matchedPairs = 0, lockBoard = false;

// الحالة العامة
let allCardData = {};                 // { 'animal': [...], 'fruit': [...] }
let currentType = 'animal';
let currentPlayMode = 'image-image';  // image-image | image-word | image-char | image-audio

// عناصر تحكم السايدبار
let startGameButton, langSelect, typeSelect, modeSelect;

// -------------------- توحيد الحقول من الوثيقة --------------------
function pickMainImageFromMedia(media) {
  if (!media || !Array.isArray(media.images)) return '';
  const main = media.images.find(it => (it.role === 'main' || it.id === 'main'));
  return (main && (main.path || main.url)) || (media.images[0]?.path || media.images[0]?.url || '');
}
function normalizeType(raw){
  const v = String(raw||'').trim();
  for (const [canon, syns] of Object.entries(TYPE_SYNONYMS)) {
    if (syns.includes(v)) return canon;
  }
  // تخمين بسيط
  return (v.replace('_','-').toLowerCase() === 'human-body') ? 'human-body' : v.toLowerCase();
}

function unifyItem(doc, forcedCanonType=null){
  const d = doc.data ? doc.data() : doc;
  const canon = forcedCanonType || normalizeType(d.type);

  const name  = d.name  || {};
  const letter= d.letter|| {};
  const media = d.media || {};

  // صورة
  const image_path = d.image_path
                  || pickMainImageFromMedia(media)
                  || (d.image ? `images/${imagesDirFor(canon)}/${d.image}` : '');

  // أصوات (ندعم عدة أشكال: voices[lang][voice] أو voices[lang] أو مفاتيح مسطحة أو sound_base)
  const voices = d.voices || d.sound || d.sounds || null;
  const sound_base = d.sound_base || d.soundBase || null;

  return {
    id: doc.id || d.id,
    type: canon,

    name_ar:   name.ar || d.name_ar || '',
    name_en:   name.en || d.name_en || '',
    name_he:   name.he || d.name_he || '',

    letter_ar: letter.ar || d.letter_ar || '',
    letter_en: letter.en || d.letter_en || '',
    letter_he: letter.he || d.letter_he || '',

    image_path,
    image_file: d.image || d.image_file || '',

    voices,
    sound_base
  };
}

function resolveImagePath(item){
  if (item.image_path) return item.image_path;
  if (item.image_file) return `images/${imagesDirFor(item.type)}/${item.image_file}`;
  return '';
}

function resolveAudioPath(item, lang, voice='teacher'){
  // 1) voices[lang] = string | {boy/girl/teacher}
  if (item.voices) {
    const vLang = item.voices[lang];
    if (typeof vLang === 'string') return vLang;
    if (vLang && typeof vLang === 'object' && vLang[voice]) return vLang[voice];

    // 2) مفاتيح مسطحة: teacher_ar أو ar_teacher
    const flat1 = `${voice}_${lang}`;
    const flat2 = `${lang}_${voice}`;
    if (item.voices[flat1]) return item.voices[flat1];
    if (item.voices[flat2]) return item.voices[flat2];
  }

  // 3) sound_base => audio/<lang>/<dir>/<base>_teacher_<lang>.mp3
  if (item.sound_base) {
    return `audio/${lang}/${audioDirFor(item.type)}/${item.sound_base}_${voice}_${lang}.mp3`;
  }

  // 4) sound[lang] = string | {voice}
  if (item.sound && item.sound[lang]) {
    const sv = item.sound[lang];
    if (typeof sv === 'string') return sv;
    if (typeof sv === 'object' && sv[voice]) return sv[voice];
  }

  return '';
}

function textByLang(item, kind){
  const lang = getCurrentLang();
  if (kind === 'name')   return (lang === 'ar' ? item.name_ar : lang === 'he' ? item.name_he : item.name_en) || '';
  if (kind === 'letter') return (lang === 'ar' ? item.letter_ar : lang === 'he' ? item.letter_he : item.letter_en) || '';
  return '';
}

// -------------------- أصوات الفوز/النشاط --------------------
const APPLAUSE_URL = "/audio/success/clapping.mp3";   // ملفك من public/audio/success
function playWinApplause(){
  try { playAudio(APPLAUSE_URL); }
  catch { try { new Audio(APPLAUSE_URL).play().catch(()=>{}); } catch {} }
}
function safeRecordActivity(userOrType, maybeType){
  try {
    const u = (typeof userOrType === 'object' && userOrType) || JSON.parse(localStorage.getItem('user'));
    const t = (typeof userOrType === 'string') ? userOrType : maybeType;
    if (u && (u.uid || u.userId)) recordActivity(u, t);
  } catch {}
}

// -------------------- تحميل الصفحة --------------------
export async function loadMemoryGameContent(){
  const host = document.getElementById('memory-game-host') || document.querySelector('.main-content');
  if (!host) return;

  host.innerHTML = `
    <section class="subject-page memory-game">
      <div class="memory-game-grid" id="memory-game-board"></div>
      <div class="game-status" id="memory-game-status"></div>
    </section>
  `;

  gameBoard = document.getElementById('memory-game-board');
  gameStatusDisplay = document.getElementById('memory-game-status');

  await fetchCardDataFromItems(); // يبني allCardData حسب النوع
  try { await applyTranslations(); } catch {}
}

export async function initializeMemoryGameSidebarControls(){
  startGameButton = document.getElementById('memory-game-start-button');
  langSelect      = document.getElementById('memory-game-lang-select');
  typeSelect      = document.getElementById('memory-game-topic-select'); // سنستخدمه لاختيار type
  modeSelect      = document.getElementById('memory-game-mode-select');

  if (startGameButton) startGameButton.onclick = () => createBoard();

  if (langSelect){
    langSelect.value = getCurrentLang();
    langSelect.onchange = (e) => {
      const lang = e.target.value;
      loadLanguage(lang).then(() => {
        setDirection(lang);
        updateCardTexts();
      });
    };
  }

  if (typeSelect){
    typeSelect.onchange = (e) => {
      currentType = e.target.value;
      createBoard();
    };
  }

  if (modeSelect){
    modeSelect.value = currentPlayMode;
    modeSelect.onchange = (e) => {
      currentPlayMode = e.target.value;
      createBoard();
    };
  }

  if (Object.keys(allCardData).length) populateTypeOptions();
}
window.initializeMemoryGameSidebarControls = initializeMemoryGameSidebarControls;

// -------------------- الجلب من items حسب type --------------------
async function fetchOneType(canonType){
  const syns = TYPE_SYNONYMS[canonType] || [canonType];
  const itemsRef = collection(db, 'items');

  let collected = [];
  const batchSyns = [...syns];
  while (batchSyns.length){
    const slice = batchSyns.splice(0, 10);
    const snap = await getDocs(query(itemsRef, where('type','in', slice), limit(500)));
    collected.push(...snap.docs.map(doc => unifyItem(doc, canonType)));
  }
  return collected;
}

async function fetchCardDataFromItems(){
  allCardData = {};
  const CANONICAL = ['animal','fruit','vegetable','profession','tool','human-body'];

  for (const t of CANONICAL){
    try {
      const arr = await fetchOneType(t);
      if (arr.length) allCardData[t] = arr;
    } catch (e){
      console.warn('[memory-game] fetch type failed:', t, e);
    }
  }

  const first = Object.keys(allCardData)[0];
  if (first) currentType = first;

  populateTypeOptions();
  createBoard();
}

// -------------------- بناء لوحة اللعبة --------------------
function shuffleArray(a){
  const arr = [...a];
  for (let i=arr.length-1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createBoard(){
  const lang = getCurrentLang();
  if (!gameBoard) return;

  gameBoard.innerHTML = '';
  if (gameStatusDisplay) gameStatusDisplay.textContent = '';

  flippedCards = [];
  matchedPairs = 0;
  lockBoard = false;

  const pool = allCardData[currentType] || [];
  if (pool.length < 6){
    if (gameStatusDisplay){
      gameStatusDisplay.textContent =
        (lang==='ar' ? 'لا توجد بيانات كافية لهذا النوع.' :
         lang==='he' ? 'אין מספיק פריטים' : 'Not enough data for this type.');
    }
    return;
  }

  const chosen = shuffleArray(pool).slice(0, 6);
  const cardSet = [];

  chosen.forEach(item => {
    const img = resolveImagePath(item);
    const names = { text_ar:item.name_ar, text_en:item.name_en, text_he:item.name_he };

    if (currentPlayMode === 'image-image'){
      cardSet.push({ type:'image', value:img, id:item.id, ...names });
      cardSet.push({ type:'image', value:img, id:item.id, ...names });
    }
    if (currentPlayMode === 'image-word' && (item.name_ar || item.name_en || item.name_he)){
      const word = textByLang(item, 'name');
      cardSet.push({ type:'image', value:img,  id:item.id, ...names });
      cardSet.push({ type:'word',  value:word, id:item.id, ...names });
    }
    if (currentPlayMode === 'image-char' && (item.letter_ar || item.letter_en || item.letter_he)){
      const ch = textByLang(item, 'letter');
      cardSet.push({ type:'image', value:img, id:item.id, ...names });
      cardSet.push({ type:'char',  value:ch,  id:item.id, ...names });
    }
    if (currentPlayMode === 'image-audio'){
      const audio = resolveAudioPath(item, getCurrentLang(), 'boy');
      if (audio){
        cardSet.push({ type:'image', value:img,   id:item.id, ...names });
        cardSet.push({ type:'audio', value:audio, id:item.id, ...names, image_url_for_audio_card: img });
      }
    }
  });

  if (cardSet.length < 12){
    if (gameStatusDisplay){
      gameStatusDisplay.textContent =
        (lang==='ar' ? 'لا توجد عناصر كافية لهذا النمط.' :
         lang==='he' ? 'אין מספיק קלפים' : 'Not enough cards for this mode.');
    }
    return;
  }

  const deck = shuffleArray(cardSet);
  deck.forEach(card => {
    const el = document.createElement('div');
    el.className = 'memory-card';
    el.dataset.cardId = card.id;
    el.dataset.cardType = card.type;

    let front = '';
    if (card.type === 'image'){
      front = `<img src="${card.value}" alt="${card.id}" width="240" height="180" loading="lazy" decoding="async" fetchpriority="low" />`;
    } else if (card.type === 'word' || card.type === 'char'){
      front = `<span class="card-display-text">${card.value || ''}</span>`;
    } else if (card.type === 'audio'){
      front = `
        <img src="${card.image_url_for_audio_card}" alt="${card.id}" />
        <audio src="${card.value}" preload="auto"></audio>
        <button class="play-audio-btn" type="button">▶</button>
      `;
    }

    el.innerHTML = `
      <div class="front-face">${front}</div>
      <div class="back-face"></div>
    `;

    if (card.type === 'word' || card.type === 'char'){
      const span = el.querySelector('.card-display-text');
      if (span) span.style.direction = isRtl(getCurrentLang()) ? 'rtl' : 'ltr';
    }

    if (card.type === 'audio'){
      const btn = el.querySelector('.play-audio-btn');
      if (btn) btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const audio = el.querySelector('audio');
        if (audio) playAudio(audio.src);
      });
    }

    el.addEventListener('click', onFlip);
    gameBoard.appendChild(el);
  });

  cards = document.querySelectorAll('.memory-card');
}

function onFlip(){
  if (lockBoard) return;
  if (this === flippedCards[0]) return;
  if (this.classList.contains('matched')) return;

  this.classList.add('flipped');
  flippedCards.push(this);

  if (this.dataset.cardType === 'audio'){
    const audio = this.querySelector('audio');
    if (audio) playAudio(audio.src);
  }

  if (flippedCards.length === 2){
    lockBoard = true;
    checkForMatch();
  }
}

function checkForMatch(){
  const lang = getCurrentLang();
  const [a,b] = flippedCards;
  const sameId = a.dataset.cardId === b.dataset.cardId;

  let ok = false;
  if (sameId){
    const t1 = a.dataset.cardType, t2 = b.dataset.cardType;
    if (currentPlayMode === 'image-image') ok = (t1==='image' && t2==='image');
    if (currentPlayMode === 'image-word')  ok = (t1!==t2 && [t1,t2].includes('image') && [t1,t2].includes('word'));
    if (currentPlayMode === 'image-char')  ok = (t1!==t2 && [t1,t2].includes('image') && [t1,t2].includes('char'));
    if (currentPlayMode === 'image-audio') ok = (t1!==t2 && [t1,t2].includes('image') && [t1,t2].includes('audio'));
  }

  if (ok){
    flippedCards.forEach(c => { c.removeEventListener('click', onFlip); c.classList.add('matched'); });
    resetTurn();
    matchedPairs++;

    if (gameStatusDisplay){
      gameStatusDisplay.textContent =
        (lang==='ar' ? 'لقد وجدت زوجًا!' : lang==='he' ? 'מצאת זוג!' : 'You found a pair!');
    }

    // سجل النشاط إن كان هناك مستخدم
    safeRecordActivity(JSON.parse(localStorage.getItem('user')), currentType);

    if (matchedPairs === 6){
      setTimeout(() => {
        if (gameStatusDisplay){
          gameStatusDisplay.textContent =
            (lang==='ar' ? 'تهانينا! لقد فزت باللعبة!' : lang==='he' ? 'מזל טוב! ניצחת!' : 'Congratulations! You won!');
        }
        // 👏 تصفيق الفوز
        playWinApplause();
      }, 400);
    }
  } else {
    setTimeout(() => {
      flippedCards.forEach(c => c.classList.remove('flipped'));
      resetTurn();
      if (gameStatusDisplay){
        gameStatusDisplay.textContent =
          (lang==='ar' ? 'حاول مرة أخرى.' : lang==='he' ? 'נסה שוב.' : 'Try again.');
      }
    }, 800);
  }
}

function resetTurn(){ flippedCards = []; lockBoard = false; }

function updateCardTexts(){
  const lang = getCurrentLang();
  cards.forEach(el => {
    const id   = el.dataset.cardId;
    const type = el.dataset.cardType;
    const pool = allCardData[currentType] || [];
    const item = pool.find(x => x.id === id);
    if (!item) return;

    if (type === 'word' || type === 'char'){
      const span = el.querySelector('.card-display-text');
      if (!span) return;
      span.textContent = (type === 'word') ? textByLang(item,'name') : textByLang(item,'letter');
      span.style.direction = isRtl(lang) ? 'rtl' : 'ltr';
    }
    if (type === 'audio'){
      const audio = el.querySelector('audio');
      if (audio) audio.src = resolveAudioPath(item, lang, 'teacher');
    }
  });
}

function populateTypeOptions(){
  const select = document.getElementById('memory-game-topic-select');
  if (!select) return;

  select.innerHTML = '';
  Object.keys(allCardData).forEach(type => {
    const opt = document.createElement('option');
    opt.value = type;
    opt.textContent = ({
      'animal':'Animals','fruit':'Fruits','vegetable':'Vegetables','profession':'Professions','tool':'Tools','human-body':'Human Body'
    }[type]) || type;
    select.appendChild(opt);
  });

  if (Object.keys(allCardData).includes(currentType)) {
    select.value = currentType;
  } else if (select.options.length){
    currentType = select.value = select.options[0].value;
  }
}
export { populateTypeOptions };
