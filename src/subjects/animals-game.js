// src/subjects/animals-game.js
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playItemSound, stopCurrentAudio, setVoiceShape, setLanguage } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';
import { fetchSubjectItems, normalizeItemForView } from '../core/items-repo.js';
import { pickLocalized, slugify } from '../core/media-utils.js';

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
    img.style.width='100%'; img.style.height='auto'; img.style.display='block'; img.style.aspectRatio='4 / 3';
  } catch {}
}
__ensureGlobalFixedImgCSS();

const SUBJECT_KEY = 'animals';
let _raw = []; let _i = 0; let _uiLang = 'ar';

const $q = (s) => document.querySelector(s);
const pickEl = (...sels) => sels.map(s => $q(s)).find(Boolean) || null;

function deriveAnimalKey(raw){
  return raw?.id || slugify(pickLocalized(raw?.name,'en') || pickLocalized(raw?.name,_uiLang) || '');
}
function deriveBabyKey(raw){
  const b = raw?.baby || raw?.offspring || {};
  return b?.id || slugify(pickLocalized(b?.name,'en') || pickLocalized(b?.name,_uiLang) || '');
}

function resolveClassification(raw, lang) {
  const cls = raw?.classification ?? raw?.category ?? raw?.group ?? null;
  if (!cls) return '—';
  if (Array.isArray(cls)) return cls.map(c => typeof c==='object'? pickLocalized(c,lang):String(c)).join('، ');
  if (typeof cls==='object') return pickLocalized(cls,lang) || '—';
  return String(cls);
}
function resolveBabyName(raw, lang) {
  const b = raw?.baby || raw?.offspring || null;
  if (!b) return 'غير معروف';
  return pickLocalized(b.name ?? b, lang) || 'غير معروف';
}
function resolveBabyImagePath(raw) {
  const imgs = raw?.media?.images;
  if (Array.isArray(imgs) && imgs.length) {
    const cand =
      imgs.find(im => im?.role==='baby' || im?.id==='baby') ||
      imgs.find(im => im?.role==='offspring' || im?.id==='offspring') ||
      imgs.find(im => String(im?.path||'').match(/\/(baby|offspring)[_/]/i));
    if (cand?.path) {
      const p = String(cand.path).replace(/^public\//,'');
      return p.startsWith('/')? p:`/${p}`;
    }
  }
  const b = raw?.baby || raw?.offspring || null;
  if (b?.image_path) return b.image_path.startsWith('/')? b.image_path:`/${b.image_path}`;
  if (b?.image) return `/images/animals/baby_animals/${b.image}`;
  return '/images/default.png';
}

// —————————————————— الرسم ——————————————————
function render() {
  if (!_raw.length) return;
  const lang = _uiLang;
  const raw  = _raw[_i];
  const view = normalizeItemForView(raw, lang);

  const nameEl = pickEl('#subject-title','#animal-word','#item-name','.subject-title','.subject-name');

  // احصل على <img> حقيقي داخل الحاوية أو أنشئه
  let imgEl = pickEl('#subject-image','#animal-image','#item-image','.subject-image img');
  if (!imgEl) {
    const container = pickEl('.subject-image','#subject-image');
    if (container) {
      imgEl = container.querySelector('img') || document.createElement('img');
      if (!imgEl.parentElement) container.appendChild(imgEl);
    }
  }
  const descEl = pickEl('#subject-description','#animal-description','#item-description','.subject-description');

  const babyNameEl   = document.getElementById('animal-baby');
  const femaleNameEl = document.getElementById('animal-female');
  const categoryEl   = document.getElementById('animal-category');
  const babyImgEl    = document.getElementById('baby-animal-image');

  if (nameEl) {
    const s = String(view.name || '');
    const first = s[0] || '';
    nameEl.innerHTML = `<span class="first-letter highlight-first-letter">${first}</span>${s.slice(1)}`;
    nameEl.style.cursor = 'pointer';
    nameEl.onclick = onPlay;
  }
  if (imgEl) {
    imgEl.onerror = () => console.warn('[animals] missing image:', view.imagePath);
    __ensureFixedLcpAttrs(imgEl, true);
    imgEl.src = view.imagePath || '';
    imgEl.alt = view.imageAlt || view.name || '';
    imgEl.style.cursor = 'pointer';
    imgEl.onclick = onPlay;
  }
  if (descEl) descEl.textContent = view.description || '';

  if (babyNameEl)   babyNameEl.textContent   = resolveBabyName(raw, lang);
  if (femaleNameEl) femaleNameEl.textContent = pickLocalized(raw?.female, lang) || 'غير معروف';
  if (categoryEl)   categoryEl.textContent   = resolveClassification(raw, lang);

  if (babyImgEl) {
    const p = resolveBabyImagePath(raw);
    babyImgEl.setAttribute('width','320'); babyImgEl.setAttribute('height','240');
    babyImgEl.setAttribute('loading','lazy'); babyImgEl.setAttribute('decoding','async'); babyImgEl.setAttribute('fetchpriority','low');
    babyImgEl.src = p;
    babyImgEl.alt = resolveBabyName(raw, lang);
  }

  const prevBtn = document.getElementById('prev-animal-btn') || document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-animal-btn') || document.getElementById('next-btn');
  if (prevBtn) prevBtn.disabled = (_i === 0 && _raw.length > 0);
  if (nextBtn) nextBtn.disabled = (_i === _raw.length - 1 && _raw.length > 0);

  stopCurrentAudio?.();
}

// —————————————————— تنقّل/صوت ——————————————————
function onNext(){ if(!_raw.length) return; _i = Math.min(_i + 1, _raw.length - 1); render(); try{recordActivity('animals','next',{index:_i});}catch{} }
function onPrev(){ if(!_raw.length) return; _i = Math.max(_i - 1, 0);             render(); try{recordActivity('animals','prev',{index:_i});}catch{} }

function onPlay(){
  if (!_raw.length) return;
  stopCurrentAudio?.();
  playItemSound({ type: SUBJECT_KEY, key: deriveAnimalKey(_raw[_i]) });
}
function onPlayBaby(){
  if (!_raw.length) return;
  stopCurrentAudio?.();
  const key = deriveBabyKey(_raw[_i]);
  if (key) playItemSound({ type: 'animals/baby_animals', key });
}

// —————————————————— ربط عناصر التحكم ——————————————————
function bindControls() {
  const prev = document.getElementById('prev-animal-btn') || document.getElementById('prev-btn');
  const next = document.getElementById('next-animal-btn') || document.getElementById('next-btn');
  const play = document.getElementById('play-sound-btn-animal') || document.getElementById('play-sound-btn');
  const playBaby = document.getElementById('play-baby-sound-btn-animal') || document.getElementById('play-baby-sound-btn');
  const langSel  = document.getElementById('game-lang-select-animal') || document.getElementById('game-lang-select');
  const voiceSel = document.getElementById('voice-select-animal')     || document.getElementById('voice-select');
  const toggleDesc    = document.getElementById('toggle-description-btn-animal') || document.getElementById('toggle-description-btn');
  const toggleDetails = document.getElementById('toggle-details-btn-animal')     || document.getElementById('toggle-details-btn');
  const toggleBabyImg = document.getElementById('toggle-baby-image-btn-animal')  || document.getElementById('toggle-baby-image-btn');

  if (prev) prev.onclick = onPrev;
  if (next) next.onclick = onNext;
  if (play) play.onclick = onPlay;
  if (playBaby) playBaby.onclick = onPlayBaby;

  if (toggleDesc)    toggleDesc.onclick    = () => { const box = document.getElementById('animal-description-box') || document.getElementById('subject-description-box') || document.getElementById('item-description-box'); if (!box) return; box.style.display = (getComputedStyle(box).display==='none') ? 'block' : 'none'; };
  if (toggleDetails) toggleDetails.onclick = () => { const box = document.getElementById('animal-details-section'); if (!box) return; box.style.display = (getComputedStyle(box).display==='none') ? 'block' : 'none'; };
  if (toggleBabyImg) toggleBabyImg.onclick = () => { const details = document.getElementById('animal-details-section'); if (!details) return; const sec = details.querySelector('.baby-animal-section'); if (!sec) return; sec.style.display = (getComputedStyle(sec).display==='none') ? 'block' : 'none'; };

  if (langSel) {
    try { langSel.value = getCurrentLang(); } catch {}
    langSel.onchange = async () => {
      _uiLang = langSel.value;
      setLanguage(_uiLang);
      await loadLanguage(_uiLang);
      setDirection(_uiLang);
      applyTranslations();
      _raw.sort((a,b) => String(pickLocalized(a?.name,_uiLang)).localeCompare(pickLocalized(b?.name,_uiLang)));
      render();
    };
  }
  if (voiceSel) voiceSel.onchange = () => setVoiceShape(voiceSel.value);
}

// —————————————————— نقطة الدخول ——————————————————
export async function loadAnimalsGameContent() {
  stopCurrentAudio?.();

  try {
    const main = document.querySelector('main.main-content');
    const resp = await fetch('/html/animals.html', { cache: 'no-store' });
    if (resp.ok && main) main.innerHTML = await resp.text();
  } catch (e) { console.warn('[animals] فشل تحميل animals.html', e); }

  _uiLang = getCurrentLang();
  setDirection(_uiLang);
  applyTranslations();
  bindControls();

  try {
    _raw = await fetchSubjectItems(SUBJECT_KEY, { strict: true });
    _raw.sort((a,b) => String(pickLocalized(a?.name,_uiLang)).localeCompare(pickLocalized(b?.name,_uiLang)));
    _i = 0;
    if (!_raw.length) {
      const nameEl = pickEl('#subject-title','#animal-word','#item-name');
      let imgEl  = pickEl('#subject-image','#animal-image','#item-image','.subject-image img');
      if (!imgEl) {
        const container = pickEl('.subject-image','#subject-image');
        if (container) { imgEl = document.createElement('img'); container.appendChild(imgEl); }
      }
      if (nameEl) nameEl.textContent = 'لا توجد بيانات';
      if (imgEl) imgEl.src = '/images/default.png';
    } else { render(); }
    try { recordActivity('view_animals'); } catch {}
  } catch (e) { console.error('[animals] load failed:', e); }

  if (typeof window !== 'undefined') {
    window.loadAnimalsGameContent = loadAnimalsGameContent;
    window.nextAnimal = onNext;
    window.prevAnimal = onPrev;
    window.playCurrentAnimalAudio = onPlay;
    window.playCurrentBabyAnimalAudio = onPlayBaby;
    window.rerenderAnimals = render;
  }
}
