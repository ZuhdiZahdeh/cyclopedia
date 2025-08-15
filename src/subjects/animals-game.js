// src/subjects/animals-game.js
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';
import { fetchSubjectItems, normalizeItemForView } from '../core/items-repo.js';
import { pickLocalized, slugify } from '../core/media-utils.js';

const SUBJECT_KEY = 'animals';

let _raw = [];
let _i = 0;
let _uiLang = 'ar';

// مختصرات اختيار العناصر
const $q = (s) => document.querySelector(s);
const pickEl = (...sels) => sels.map(s => $q(s)).find(Boolean) || null;

// —————————————————— أدوات مساعدة للحقول المرنة ——————————————————
function resolveClassification(raw, lang) {
  const cls = raw?.classification ?? raw?.category ?? raw?.group ?? null;
  if (!cls) return '—';
  if (Array.isArray(cls)) {
    return cls.map(c => typeof c === 'object' ? pickLocalized(c, lang) : String(c)).join('، ');
  }
  if (typeof cls === 'object') return pickLocalized(cls, lang) || '—';
  return String(cls);
}

function resolveBabyName(raw, lang) {
  // أشكال محتملة: raw.baby.name[lang] / raw.baby[lang] / raw.offspring.name[lang]
  const b = raw?.baby || raw?.offspring || null;
  if (!b) return 'غير معروف';
  return pickLocalized(b.name ?? b, lang) || 'غير معروف';
}

function resolveBabyImagePath(raw) {
  // 1) من media.images (role/id = baby/offspring)
  const imgs = raw?.media?.images;
  if (Array.isArray(imgs) && imgs.length) {
    const cand =
      imgs.find(im => im?.role === 'baby' || im?.id === 'baby') ||
      imgs.find(im => im?.role === 'offspring' || im?.id === 'offspring') ||
      imgs.find(im => String(im?.path || '').match(/\/(baby|offspring)[_/]/i));
    if (cand?.path) {
      const p = String(cand.path).replace(/^public\//, '');
      return p.startsWith('/') ? p : `/${p}`;
    }
  }
  // 2) توافق للخلف: raw.baby.image_path || raw.baby.image
  const b = raw?.baby || raw?.offspring || null;
  if (b?.image_path) return b.image_path.startsWith('/') ? b.image_path : `/${b.image_path}`;
  if (b?.image)      return `/images/animals/baby_animals/${b.image}`;
  return '/images/default.png';
}

function audioPathAnimal(raw, lang, voice) {
  // 1) الشكل الموحّد: sound[lang][voice] أو sound[lang] كسلسلة
  const s = raw?.sound;
  if (s && typeof s === 'object') {
    const node = s[lang];
    if (typeof node === 'string' && node) return node.startsWith('/') ? node : `/${node}`;
    const v = node?.[voice] || node?.teacher || node?.boy || node?.girl;
    if (typeof v === 'string' && v) return v.startsWith('/') ? v : `/${v}`;
  }
  // 2) voices['boy_ar'] ونحوها
  const key = `${voice}_${lang}`;
  if (raw?.voices?.[key]) {
    const f = raw.voices[key];
    return f.startsWith('/') ? f : `/${f}`;
  }
  // 3) sound_base
  const base = raw?.sound_base || raw?.audio_base || raw?.id || slugify(pickLocalized(raw?.name, lang));
  if (base) return `/audio/${lang}/animals/${slugify(base)}_${voice}_${lang}.mp3`;
  // 4) توافق قديم
  if (raw?.animal_sound_file) {
    const f = raw.animal_sound_file;
    return f.startsWith('/') ? f : `/${f}`;
  }
  return '';
}

function audioPathBaby(raw, lang, voice) {
  // بيانات الابن داخل raw.baby أو raw.offspring أو داخل sound.baby
  const b = raw?.baby || raw?.offspring || null;
  if (b?.sound?.[lang]?.[voice]) {
    const f = b.sound[lang][voice];
    return f.startsWith('/') ? f : `/${f}`;
  }
  if (raw?.sound?.baby?.[lang]?.[voice]) {
    const f = raw.sound.baby[lang][voice];
    return f.startsWith('/') ? f : `/${f}`;
  }
  const base = b?.sound_base || b?.audio_base || slugify(pickLocalized(b?.name ?? {}, lang));
  if (base) return `/audio/${lang}/animals/baby_animals/${slugify(base)}_${voice}_${lang}.mp3`;
  if (b?.sound_file) {
    const f = b.sound_file;
    return f.startsWith('/') ? f : `/${f}`;
  }
  return '';
}

// —————————————————— الرسم ——————————————————
function render() {
  if (!_raw.length) return;
  const lang = _uiLang;
  const raw  = _raw[_i];
  const view = normalizeItemForView(raw, lang); // {name, description, imagePath, imageAlt}

  const nameEl = pickEl('#subject-title','#animal-word','#item-name','.subject-title','.subject-name');
  const imgEl  = pickEl('#subject-image','#animal-image','#item-image','.subject-image img','.subject-image');
  const descEl = pickEl('#subject-description','#animal-description','#item-description','.subject-description');

  const babyNameEl   = document.getElementById('animal-baby');
  const femaleNameEl = document.getElementById('animal-female');
  const categoryEl   = document.getElementById('animal-category');
  const babyImgEl    = document.getElementById('baby-animal-image');

  // الاسم (مع تمييز أول حرف)
  if (nameEl) {
    const s = String(view.name || '');
    const first = s[0] || '';
    nameEl.innerHTML = `<span class="first-letter highlight-first-letter">${first}</span>${s.slice(1)}`;
    nameEl.style.cursor = 'pointer';
    nameEl.onclick = onPlay;
  }

  // الصورة الرئيسية + تشغيل عند النقر
  if (imgEl) {
    imgEl.onerror = () => console.warn('[animals] missing image:', view.imagePath);
    imgEl.src = view.imagePath || '';
    imgEl.alt = view.imageAlt || view.name || '';
    imgEl.style.cursor = 'pointer';
    imgEl.onclick = onPlay;
  }

  if (descEl) descEl.textContent = view.description || '';

  // بيانات إضافية (إن وُجدت)
  if (babyNameEl)   babyNameEl.textContent   = resolveBabyName(raw, lang);
  if (femaleNameEl) femaleNameEl.textContent = pickLocalized(raw?.female, lang) || 'غير معروف';
  if (categoryEl)   categoryEl.textContent   = resolveClassification(raw, lang);

  if (babyImgEl) {
    const p = resolveBabyImagePath(raw);
    babyImgEl.src = p;
    babyImgEl.alt = resolveBabyName(raw, lang);
  }

  // تعطيل/تمكين أزرار التالي/السابق إن لزم
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
  const langSel  = document.getElementById('game-lang-select-animal') || document.getElementById('game-lang-select');
  const voiceSel = document.getElementById('voice-select-animal')     || document.getElementById('voice-select');
  const lang  = (langSel?.value || _uiLang || getCurrentLang());
  const voice = (voiceSel?.value || 'teacher');
  const src   = audioPathAnimal(_raw[_i], lang, voice);
  stopCurrentAudio?.();
  if (src) playAudio(src);
}

function onPlayBaby(){
  const langSel  = document.getElementById('game-lang-select-animal') || document.getElementById('game-lang-select');
  const voiceSel = document.getElementById('voice-select-animal')     || document.getElementById('voice-select');
  const lang  = (langSel?.value || _uiLang || getCurrentLang());
  const voice = (voiceSel?.value || 'teacher');
  const src   = audioPathBaby(_raw[_i], lang, voice);
  stopCurrentAudio?.();
  if (src) playAudio(src);
}

// —————————————————— ربط عناصر التحكم ——————————————————
function bindControls() {
  const prev = document.getElementById('prev-animal-btn') || document.getElementById('prev-btn');
  const next = document.getElementById('next-animal-btn') || document.getElementById('next-btn');
  const play = document.getElementById('play-sound-btn-animal') || document.getElementById('play-sound-btn');
  const playBaby = document.getElementById('play-baby-sound-btn-animal') || document.getElementById('play-baby-sound-btn');
  const langSel  = document.getElementById('game-lang-select-animal') || document.getElementById('game-lang-select');
  const toggleDesc    = document.getElementById('toggle-description-btn-animal') || document.getElementById('toggle-description-btn');
  const toggleDetails = document.getElementById('toggle-details-btn-animal')     || document.getElementById('toggle-details-btn');
  const toggleBabyImg = document.getElementById('toggle-baby-image-btn-animal')  || document.getElementById('toggle-baby-image-btn');

  if (prev) prev.onclick = onPrev;
  if (next) next.onclick = onNext;
  if (play) play.onclick = onPlay;
  if (playBaby) playBaby.onclick = onPlayBaby;

  if (toggleDesc) {
    toggleDesc.onclick = () => {
      const box = document.getElementById('animal-description-box') || document.getElementById('subject-description-box') || document.getElementById('item-description-box');
      if (!box) return;
      const show = getComputedStyle(box).display === 'none';
      box.style.display = show ? 'block' : 'none';
    };
  }
  if (toggleDetails) {
    toggleDetails.onclick = () => {
      const box = document.getElementById('animal-details-section');
      if (!box) return;
      const show = getComputedStyle(box).display === 'none';
      box.style.display = show ? 'block' : 'none';
    };
  }
  if (toggleBabyImg) {
    toggleBabyImg.onclick = () => {
      const details = document.getElementById('animal-details-section');
      if (!details) return;
      const sec = details.querySelector('.baby-animal-section');
      if (!sec) return;
      const show = getComputedStyle(sec).display === 'none';
      sec.style.display = show ? 'block' : 'none';
    };
  }

  if (langSel) {
    try { langSel.value = getCurrentLang(); } catch {}
    langSel.onchange = async () => {
      _uiLang = langSel.value;
      await loadLanguage(_uiLang);
      setDirection(_uiLang);
      applyTranslations();
      // ترتيب حسب الاسم في اللغة المختارة
      _raw.sort((a,b) => String(pickLocalized(a?.name,_uiLang)).localeCompare(pickLocalized(b?.name,_uiLang)));
      render();
    };
  }
}

// —————————————————— نقطة الدخول ——————————————————
export async function loadAnimalsGameContent() {
  stopCurrentAudio?.();

  // تحميل قالب الصفحة HTML
  try {
    const main = document.querySelector('main.main-content');
    const resp = await fetch('/html/animals.html', { cache: 'no-store' });
    if (resp.ok && main) main.innerHTML = await resp.text();
    console.log('[animals] ✔ تم تحميل الصفحة: /html/animals.html');
  } catch (e) {
    console.warn('[animals] فشل تحميل animals.html', e);
  }

  _uiLang = getCurrentLang();
  setDirection(_uiLang);
  applyTranslations();

  bindControls();

  try {
    _raw = await fetchSubjectItems(SUBJECT_KEY, { strict: true });
    console.log('[animals] fetched', _raw.length);
    _raw.sort((a,b) => String(pickLocalized(a?.name,_uiLang)).localeCompare(pickLocalized(b?.name,_uiLang)));
    _i = 0;
    if (!_raw.length) {
      const nameEl = pickEl('#subject-title','#animal-word','#item-name');
      const imgEl  = pickEl('#subject-image','#animal-image','#item-image');
      if (nameEl) nameEl.textContent = 'لا توجد بيانات';
      if (imgEl) imgEl.src = '/images/default.png';
    } else {
      render();
    }
    try { recordActivity('view_animals'); } catch {}
  } catch (e) {
    console.error('[animals] load failed:', e);
  }

  // جعل الدوال متاحة لـ window للتوافق مع main.js
  if (typeof window !== 'undefined') {
    window.loadAnimalsGameContent = loadAnimalsGameContent;
    window.nextAnimal = onNext;
    window.prevAnimal = onPrev;
    window.playCurrentAnimalAudio = onPlay;
    window.playCurrentBabyAnimalAudio = onPlayBaby;
    window.rerenderAnimals = render;
  }
}
