// src/subjects/fruits-game.js
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';
import { fetchSubjectItems, normalizeItemForView } from '../core/items-repo.js';
import { pickLocalized, slugify } from '../core/media-utils.js';

const SUBJECT_KEY = 'fruits';

let _raw = [];
let _i = 0;
let _uiLang = 'ar';

const $q = (s) => document.querySelector(s);
const pickEl = (...sels) => sels.map(s => $q(s)).find(Boolean) || null;

function getAudioPath(raw, lang, voice) {
  // 1) حقول الصوت المهيكلة
  const s = raw?.sound;
  if (s && typeof s === 'object') {
    const node = s[lang];
    if (typeof node === 'string' && node) return node.startsWith('/') ? node : `/${node}`;
    const v = node?.[voice] || node?.teacher || node?.boy || node?.girl;
    if (typeof v === 'string' && v) return v.startsWith('/') ? v : `/${v}`;
  }
  // 2) ملفات قديمة
  if (typeof raw?.sound_file === 'string') return raw.sound_file.startsWith('/') ? raw.sound_file : `/${raw.sound_file}`;
  if (typeof raw?.audio === 'string')      return raw.audio.startsWith('/') ? raw.audio : `/${raw.audio}`;
  // 3) تركيب مسار افتراضي
  const base =
    raw?.sound_base || raw?.audio_base || raw?.base ||
    raw?.id || slugify(pickLocalized(raw?.name, lang));
  return base ? `/audio/${lang}/fruits/${slugify(base)}_${voice}_${lang}.mp3` : '';
}

function render() {
  if (!_raw.length) return;
  const lang = _uiLang;
  const view = normalizeItemForView(_raw[_i], lang);

  const nameEl = pickEl('#subject-title','#fruit-word','#fruit-name','#item-name','.subject-title','.subject-name');
  const imgEl  = pickEl('#subject-image','#fruit-image','#item-image','.subject-image img','.subject-image');
  const descEl = pickEl('#subject-description','#fruit-description','#item-description','.subject-description');

  if (nameEl) {
    const s = String(view.name || '');
    const first = s[0] || '';
    nameEl.innerHTML = `<span class="first-letter">${first}</span>${s.slice(1)}`;
    nameEl.style.cursor = 'pointer';
    nameEl.onclick = onPlay;
  }
  if (imgEl) {
    imgEl.alt = view.imageAlt || '';
    imgEl.onerror = () => console.warn('[fruits] missing image:', view.imagePath);
    imgEl.src = view.imagePath || '';
    imgEl.style.cursor = 'pointer';
    imgEl.onclick = onPlay;
  }
  if (descEl) descEl.textContent = view.description || '';
}

function onNext() {
  if (!_raw.length) return;
  _i = (_i + 1) % _raw.length;
  render();
  try { recordActivity('fruits','next',{ index:_i }); } catch {}
}
function onPrev() {
  if (!_raw.length) return;
  _i = (_i - 1 + _raw.length) % _raw.length;
  render();
  try { recordActivity('fruits','prev',{ index:_i }); } catch {}
}
function onPlay() {
  const langSel  = document.getElementById('game-lang-select-fruit') || document.getElementById('game-lang-select');
  const voiceSel = document.getElementById('voice-select-fruit')     || document.getElementById('voice-select');
  const lang  = (langSel?.value || _uiLang || getCurrentLang());
  const voice = (voiceSel?.value || 'teacher');
  const src   = getAudioPath(_raw[_i], lang, voice);
  stopCurrentAudio?.();
  if (src) playAudio(src);
}

function bindControls() {
  const prev = document.getElementById('prev-fruit-btn') || document.getElementById('prev-btn');
  const next = document.getElementById('next-fruit-btn') || document.getElementById('next-btn');
  const play = document.getElementById('play-sound-btn-fruit') || document.getElementById('listen') || document.getElementById('listen-btn');
  const langSel  = document.getElementById('game-lang-select-fruit') || document.getElementById('game-lang-select');
  const toggleDesc = document.getElementById('toggle-description-btn-fruit') || document.getElementById('toggle-description-btn') || document.getElementById('toggle-description');

  if (prev) prev.onclick = onPrev;
  if (next) next.onclick = onNext;
  if (play) play.onclick = onPlay;

  if (toggleDesc) {
    toggleDesc.onclick = () => {
      const box = document.getElementById('fruit-description-box') || document.getElementById('subject-description-box') || document.getElementById('item-description-box');
      if (!box) return;
      const show = getComputedStyle(box).display === 'none';
      box.style.display = show ? 'block' : 'none';
    };
  }

  if (langSel) {
    langSel.onchange = async () => {
      _uiLang = langSel.value;
      await loadLanguage(_uiLang);
      setDirection(_uiLang);
      applyTranslations();
      // ترتيب حسب الاسم المترجم
      _raw.sort((a,b) => String(pickLocalized(a?.name,_uiLang)).localeCompare(pickLocalized(b?.name,_uiLang)));
      render();
    };
  }
}

export async function loadFruitsGameContent() {
  _uiLang = getCurrentLang();
  bindControls();
  try {
    _raw = await fetchSubjectItems(SUBJECT_KEY, { strict: true });
    console.log('[fruits] fetched', _raw.length);
    // ترتيب مبدئي
    _raw.sort((a,b) => String(pickLocalized(a?.name,_uiLang)).localeCompare(pickLocalized(b?.name,_uiLang)));
    _i = 0;
    render();
  } catch (e) {
    console.error('[fruits] load failed:', e);
  }
}

export function rerenderFruits(){ render(); }

if (typeof window !== 'undefined') {
  window.loadFruitsGameContent = loadFruitsGameContent;
  window.rerenderFruits = rerenderFruits;
  window.nextFruit = onNext;
  window.prevFruit = onPrev;
  window.playFruit = onPlay;
}
