// src/subjects/subject-game-factory.js
import { db } from '../js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
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


const log  = (...a)=>{ if (import.meta.env?.DEV) console.log('[subject]', ...a); };
const warn = (...a)=>{ if (import.meta.env?.DEV) console.warn('[subject]', ...a); };

const grab = (ids) => (Array.isArray(ids)?ids:[ids]).map(id=>document.getElementById(id)).find(Boolean) || null;
const pick = (...ids) => grab(ids);
const safeText = (v) => (v == null ? '' : String(v));
const isAbs = (p) => /^https?:\/\//i.test(p) || /^data:/i.test(p) || /^blob:/i.test(p);
const norm  = (s) => String(s || '').trim().replace(/^\.?[\\/]+/, '').replace(/\\/g, '/');

const normalizeLang = (v)=>{
  v = String(v||'').toLowerCase();
  if (v.startsWith('ar')) return 'ar';
  if (v.startsWith('en')) return 'en';
  if (v.startsWith('he')) return 'he';
  return getCurrentLang();
};
const normalizeVoice = (v)=>{
  v = String(v||'').toLowerCase();
  if (v.includes('boy')     || v.includes('ˆ„״¯'))    return 'boy';
  if (v.includes('girl')    || v.includes('״¨†״×'))    return 'girl';
  if (v.includes('teacher') || v.includes('…״¹„…') || v.includes('…״¹„…״©')) return 'teacher';
  return 'boy';
};
const slug = (s)=> safeText(s).trim().toLowerCase().replace(/\s+/g,'_').replace(/[^\w\-]+/g,'');

export function makeSubjectGame(cfg) {
  // --- ״­״§„״© ---
  let items = [];
  let currentIndex = 0;
  let currentItem = null;
  let gameLang = getCurrentLang();

  const logP = (...a)=>{ if (import.meta.env?.DEV) console.log(`[${cfg.key}]`, ...a); };
  const warnP= (...a)=>{ if (import.meta.env?.DEV) console.warn(`[${cfg.key}]`, ...a); };

  // --- ״¬„״¨ ״§„״¨״§†״§״× ---
  async function tryFetch(pathSegments) {
    const snap = await getDocs(collection(db, ...pathSegments));
    const buff = [];
    snap.forEach((doc)=>buff.push({ id: doc.id, ...doc.data() }));
    return buff;
  }

  async function fetchItems() {
    let list = [];
    for (const cand of cfg.collectionCandidates) {
      try {
        if (Array.isArray(cand)) {
          const r = await tryFetch(cand);
          if (r.length) { list = r; logP('from', cand.join('/'), '| count =', r.length); break; }
        } else if (typeof cand === 'string') {
          const segs = cand.replace(/^\//, '').split('/').filter(Boolean);
          const r = await tryFetch(segs);
          if (r.length) { list = r; logP('from', cand, '| count =', r.length); break; }
        }
      } catch (e) { warnP('fetch failed', cand, e?.message || e); }
    }
    items = list;
  }

  // --- ‚״±״§״¡״§״× ״¢…†״© ---
  const nameFor = (d, lang) =>
    d?.name?.[lang] ?? d?.name?.ar ?? d?.name?.en ?? d?.name?.he ?? d?.title ?? d?.word ?? '';

  const categoryFor = (d, lang) =>
    d?.category?.[lang] ?? d?.category?.ar ?? d?.category?.en ?? d?.category?.he ?? '';

  const descriptionFor = (d, lang) =>
    d?.description?.[lang] ?? d?.description?.ar ?? d?.description?.en ?? d?.description?.he ?? '';

  function imageFor(d) {
    let p = d?.image_path || d?.imageFile || d?.image_file || d?.image || d?.img || '';
    if (!p) return '';
    p = norm(p);
    if (isAbs(p)) return p;
    if (!/[\/\\]/.test(p)) p = `${cfg.imageDir}/${p}`;
    p = p.replace(/^public\//, '');
    return `/${p}`;
  }

  function audioFor(d, lang, voice) {
    let p = null;
    if (d?.sound?.[lang]?.[voice]) p = d.sound[lang][voice];
    else if (d?.sound?.[lang])     p = d.sound[lang];
    else if (d?.sound?.ar?.[voice]) p = d.sound.ar[voice];
    else if (d?.sound?.en?.[voice]) p = d.sound.en[voice];
    else if (d?.sound?.he?.[voice]) p = d.sound.he[voice];
    else if (d?.sound_file)         p = d.sound_file;
    else if (d?.audio)              p = d.audio;

    if (!p) {
      const base = d?.sound_base || d?.audio_base || d?.base || d?.id || slug(nameFor(d, lang));
      if (base) p = `audio/${lang}/${cfg.audioFolder}/${slug(base)}_${voice}_${lang}.mp3`;
    }
    if (!p) return '';
    p = norm(p);
    if (isAbs(p)) return p;
    p = p.replace(/^public\//, '');
    return `/${p}`;
  }

  // --- UI helpers ---
  function splitFirstLetter(str) {
    const s = safeText(str).trim();
    if (!s) return { first: '', rest: '' };
    const m = s.match(/([\p{L}\p{N}])/u);
    if (!m) return { first: s[0] || '', rest: s.slice(1) };
    const i = m.index ?? 0;
    return { first: s[i], rest: s.slice(i + 1) };
  }
  function renderName(name, lang) {
    const el = pick(...cfg.selectors.word);
    if (!el) return;
    const { first, rest } = splitFirstLetter(name);
    el.innerHTML = `<span class="first-letter">${first || ''}</span>${rest || ''}`;
    el.dir = (lang === 'ar' || lang === 'he') ? 'rtl' : 'ltr';
  }

  function setImage(imgEl, src, alt) {
    if (!imgEl) return;
    imgEl.classList.remove('img-error');
    imgEl.alt = safeText(alt);
    __ensureFixedLcpAttrs(imgEl, true);
    if (!src) { imgEl.removeAttribute('src'); return; }
    imgEl.onload  = ()=> imgEl.classList.remove('img-error');
    imgEl.onerror = ()=> { imgEl.classList.add('img-error'); warnP('missing image', src); };
    imgEl.src = src;
    logP('img src =', src);
  }

  function ensureControlsStyling({prevBtn, nextBtn, playBtn, toggleDescBtn}) {
    const add = (el, classes)=>{ if (!el) return; classes.split(/\s+/).forEach(c=>el.classList.add(c)); };
    add(prevBtn,       'btn secondary');
    add(nextBtn,       'btn primary');
    add(playBtn,       'btn listen');
    add(toggleDescBtn, 'btn ghost');
  }

  function ensureToggleDescriptionButton() {
    let btn = grab(cfg.controls.toggleDesc);
    if (btn) return btn;

    const grid =
      document.querySelector(`${cfg.controlsGrid} .control-grid`) ||
      document.querySelector(`${cfg.controlsGrid}[data-subject="${cfg.key}"]`) ||
      document.querySelector(cfg.controlsGrid) ||
      document.getElementById('sidebar-section');

    if (!grid) return null;

    const row = document.createElement('div');
    row.className = 'row';
    btn = document.createElement('button');
    btn.id = cfg.controls.toggleDesc[0] || `toggle-description-btn-${cfg.key}`;
    btn.type = 'button';
    btn.className = 'btn ghost';
    btn.setAttribute('data-i18n', 'description');
    btn.textContent = '״§„ˆ״µ';
    row.appendChild(btn);

    const afterListen = grid.querySelector(cfg.controls.play.map(id=>`#${id}`).join(','))?.closest('.row');
    if (afterListen && afterListen.parentElement === grid) {
      afterListen.insertAdjacentElement('afterend', row);
    } else {
      grid.appendChild(row);
    }
    try { applyTranslations(); } catch {}
    return btn;
  }

  // --- ״×״­״¯״« ״§„ˆ״§״¬‡״© ---
  function updateContent() {
    const lang = gameLang;
    const d = items[currentIndex];
    currentItem = d;

    renderName(nameFor(d, lang), lang);

    const imgEl = pick(...cfg.selectors.image);
    setImage(imgEl, imageFor(d), nameFor(d, lang));

    const catEl = pick(...cfg.selectors.category);
    if (catEl) catEl.textContent = categoryFor(d, lang) || 'ג€”';

    const descEl = pick(...cfg.selectors.description);
    if (descEl) descEl.textContent = descriptionFor(d, lang) || 'ג€”';

    logP('update', { index: currentIndex, id: d?.id, name: nameFor(d, lang) });
  }

  // --- ״µˆ״× ---
  function playCurrentAudio() {
    if (!currentItem) return;
    const langSel = grab(cfg.controls.lang);
    const vSel    = grab(cfg.controls.voice);
    const lang    = normalizeLang(langSel?.value || gameLang);
    const voice   = normalizeVoice(vSel?.value || 'boy');
    const path    = audioFor(currentItem, lang, voice);
    if (path) {
      logP('play', { path, lang, voice, id: currentItem?.id });
      playAudio(path);
      recordActivity(cfg.keyPlural, 'listen', { index: currentIndex, lang, voice });
    } else {
      warnP('no audio for', currentItem?.id);
    }
  }

  // --- ״±״¨״· ״§„״£״­״¯״§״« ---
  function bindControls() {
    const prevBtn  = grab(cfg.controls.prev);
    const nextBtn  = grab(cfg.controls.next);
    const playBtn  = grab(cfg.controls.play);
    let   toggleDescBtn = grab(cfg.controls.toggleDesc);
    const langSel  = grab(cfg.controls.lang);
    const voiceSel = grab(cfg.controls.voice);

    if (!toggleDescBtn) toggleDescBtn = ensureToggleDescriptionButton();
    [prevBtn, nextBtn, playBtn].forEach(b => { if (b) b.disabled = false; });
    ensureControlsStyling({prevBtn, nextBtn, playBtn, toggleDescBtn});

    logP('bind', {
      prev: !!prevBtn, next: !!nextBtn, play: !!playBtn,
      langSel: !!langSel, voiceSel: !!voiceSel, toggleDescBtn: !!toggleDescBtn
    });

    if (prevBtn) prevBtn.onclick = () => {
      if (currentIndex > 0) { currentIndex--; updateContent(); recordActivity(cfg.keyPlural, 'prev', { index: currentIndex }); }
    };
    if (nextBtn) nextBtn.onclick = () => {
      if (currentIndex < items.length - 1) { currentIndex++; updateContent(); recordActivity(cfg.keyPlural, 'next', { index: currentIndex }); }
    };
    if (playBtn) playBtn.onclick = () => playCurrentAudio();

    if (langSel) langSel.onchange = async () => {
      gameLang = normalizeLang(langSel.value);
      await loadLanguage(gameLang);
      setDirection(gameLang);
      applyTranslations();
      items.sort((a,b)=> safeText(nameFor(a, gameLang)).localeCompare(safeText(nameFor(b, gameLang))));
      updateContent();
    };
    if (voiceSel) voiceSel.onchange = () => stopCurrentAudio();

    if (toggleDescBtn) {
      toggleDescBtn.onclick = () => {
        const box =
          document.getElementById(cfg.selectors.descriptionBox[0]) ||
          document.querySelector(`${cfg.container} .details-area`) ||
          document.querySelector(`${cfg.container} .info-box`);
        if (box) box.style.display = (box.style.display === 'none' ? 'block' : 'none');
      };
    }

    const wordEl = pick(...cfg.selectors.word);
    const imgEl  = pick(...cfg.selectors.image);
    [wordEl, imgEl].forEach(el => { if (el) el.style.cursor = 'pointer'; if (el) el.onclick = () => playCurrentAudio(); });
  }

  // --- ״×״­…„ ---
  async function loadContent() {
    logP('loadContent()');
    if (!document.querySelector(cfg.container)) { warnP('container not found:', cfg.container); return; }

    const sel = grab(cfg.controls.lang);
    gameLang = normalizeLang(sel?.value || getCurrentLang());

    bindControls();
    await fetchItems();
    if (!items.length) { warnP('no data'); return; }

    items.sort((a,b)=> safeText(nameFor(a, gameLang)).localeCompare(safeText(nameFor(b, gameLang))));
    currentIndex = 0;
    updateContent();
  }

  // „„״×״´״®״µ
  if (typeof window !== 'undefined') {
    window[`_${cfg.key}`] = () => ({ items, currentIndex, currentItem, gameLang });
    window[`playCurrent${cfg.key[0].toUpperCase()+cfg.key.slice(1)}Audio`] = () => playCurrentAudio();
  }

  return { loadContent };
}


