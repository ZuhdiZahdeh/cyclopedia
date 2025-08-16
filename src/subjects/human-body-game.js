// /src/subjects/human-body-game.js
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';
import { fetchSubjectItems, normalizeItemForView } from '../core/items-repo.js';
import { pickLocalized, slugify } from '../core/media-utils.js';

const SUBJECT_KEY = 'human_body';

// بديل SVG inline لا يحتاج شبكة (نستخدمه إن فشل حتى /images/404.png)
const FALLBACK_IMG_DATA =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
       <rect width="100%" height="100%" fill="#f7f7f7"/>
       <rect x="20" y="20" width="760" height="460" rx="16" ry="16" fill="#ffffff" stroke="#e6e6e6"/>
       <text x="50%" y="50%" font-size="28" font-family="sans-serif" fill="#9aa0a6"
             dominant-baseline="middle" text-anchor="middle">Image not found</text>
     </svg>`
  );

let _raw = [];
let _i = 0;
let _uiLang = 'ar';

const $ = (s) => document.querySelector(s);
const pickEl = (...sels) => sels.map(s => $(s)).find(Boolean) || null;

function toPublicUrl(p) {
  if (!p) return '';
  let path = String(p).trim();
  // لا نستخدم public/ مع Vite
  path = path.replace(/^public\//i, '');
  if (!path.startsWith('/')) path = '/' + path;
  return path;
}

function getImagePath(raw, view) {
  // نقبل أكثر من تسمية للحقل
  const src =
    view?.imagePath ||
    raw?.image_path ||
    raw?.imagePath ||
    raw?.image ||
    '';
  return toPublicUrl(src);
}

function audioPath(raw, lang, voice) {
  const s = raw?.sound;
  if (s && typeof s === 'object') {
    const node = s[lang];
    if (typeof node === 'string' && node) return node.startsWith('/') ? node : `/${node}`;
    const v = node?.[voice] || node?.teacher || node?.boy || node?.girl;
    if (typeof v === 'string' && v) return v.startsWith('/') ? v : `/${v}`;
  }
  if (typeof raw?.sound_file === 'string') return raw.sound_file.startsWith('/') ? raw.sound_file : `/${raw.sound_file}`;
  if (typeof raw?.audio === 'string')      return raw.audio.startsWith('/') ? raw.audio : `/${raw.audio}`;
  const base = raw?.sound_base || raw?.audio_base || raw?.id || slugify(pickLocalized(raw?.name, lang) || '');
  return base ? `/audio/${lang}/human_body/${slugify(base)}_${voice}_${lang}.mp3` : '';
}

/**
 * يضبط صورة العنصر مرة واحدة بشكل آمن:
 * - يعيّن src المطلوب.
 * - لو فشل التحميل: يبدّل إلى /images/404.png مرة واحدة فقط.
 * - لو فشل حتى 404.png: يضع SVG inline (FALLBACK_IMG_DATA).
 * لا حلقات إطلاقًا.
 */
function setImgOnce(el, src) {
  if (!el) return;

  // أزل أي onerror مباشر قديم
  el.onerror = null;

  // مستمع خطأ "مرة واحدة فقط"
  const onerr = () => {
    el.removeEventListener('error', onerr);
    el.classList.add('img-error');

    const current = el.getAttribute('src') || '';
    // إن كان الخطأ على الصورة الأصلية، جرّب 404.png
    if (!current.endsWith('/images/404.png') && !current.startsWith('data:image')) {
      el.src = '/images/404.png'; // موجودة الآن داخل public/images/404.png
      // لو فشلت 404.png أيضًا، نستخدم SVG inline (لن يسبّب أي طلب شبكة)
      el.addEventListener('error', () => { el.src = FALLBACK_IMG_DATA; }, { once: true });
      return;
    }

    // لو وصلنا هنا، استخدم SVG inline مباشرة
    el.src = FALLBACK_IMG_DATA;
  };
  el.addEventListener('error', onerr, { once: true });

  // اضبط src المطلوب (أو ضع 404 مباشرة إن كان فارغًا)
  const finalSrc = src && src.trim() ? src : '/images/404.png';
  if (el.getAttribute('src') !== finalSrc) el.setAttribute('src', finalSrc);
}

function render() {
  if (!_raw.length) return;
  const lang = _uiLang;
  const raw  = _raw[_i];
  const view = normalizeItemForView(raw, lang);

  const nameEl = pickEl('#human-body-word', '#item-name', '.item-main-name', '.subject-title');
  const imgEl  = pickEl('#human-body-image', '#item-image', '.subject-image img');
  const descEl = pickEl('#human-body-description', '#item-description', '.subject-description');
  const catEl  = pickEl('#human-body-category', '#item-category');

  // الاسم: الحرف الأول ملوّن + قابل للنقر لتشغيل الصوت
  if (nameEl) {
    const s = String(view.name || '');
    nameEl.innerHTML = `<span class="first-letter">${s[0] || ''}</span>${s.slice(1)}`;
    nameEl.style.cursor = 'pointer';
    nameEl.onclick = onPlay;
  }

  // الصورة: إصلاح المسار + حماية من الحلقات
  if (imgEl) {
    imgEl.alt = view.imageAlt || view.name || '';
    imgEl.classList.remove('img-error');
    imgEl.style.cursor = 'pointer';
    imgEl.onclick = onPlay;
    setImgOnce(imgEl, getImagePath(raw, view));
  }

  if (descEl) descEl.textContent = view.description || '';
  if (catEl)  catEl.textContent  = pickLocalized(raw?.category, lang) || '—';
}

function onNext(){ if(!_raw.length) return; _i = (_i+1)%_raw.length; render(); try{recordActivity('human_body','next',{index:_i});}catch{} }
function onPrev(){ if(!_raw.length) return; _i = (_i-1+_raw.length)%_raw.length; render(); try{recordActivity('human_body','prev',{index:_i});}catch{} }

function onPlay(){
  const langSel  = document.getElementById('game-lang-select-human-body') || document.getElementById('game-lang-select');
  const voiceSel = document.getElementById('voice-select-human-body')     || document.getElementById('voice-select');
  const lang  = (langSel?.value || _uiLang || getCurrentLang());
  const voice = (voiceSel?.value || 'boy');
  const src   = audioPath(_raw[_i], lang, voice);
  stopCurrentAudio?.();
  if (src) playAudio(src);
}

function bind() {
  const prev = document.getElementById('prev-human-body-btn') || document.getElementById('prev-btn');
  const next = document.getElementById('next-human-body-btn') || document.getElementById('next-btn');
  const langSel = document.getElementById('game-lang-select-human-body') || document.getElementById('game-lang-select');
  let   toggleDesc = document.getElementById('toggle-description-btn-human-body') || document.getElementById('toggle-description-btn');

  if (prev) prev.onclick = onPrev;
  if (next) next.onclick = onNext;

  // زر الوصف (إظهار/إخفاء الصندوق السفلي)
  if (!toggleDesc) {
    const grid = document.getElementById('human-body-sidebar-controls');
    if (grid) {
      const row = document.createElement('div'); row.className = 'row';
      toggleDesc = document.createElement('button');
      toggleDesc.id = 'toggle-description-btn-human-body';
      toggleDesc.className = 'btn ghost'; toggleDesc.textContent = 'الوصف';
      row.appendChild(toggleDesc); grid.appendChild(row);
    }
  }
  if (toggleDesc) {
    toggleDesc.onclick = () => {
      const box = document.getElementById('human-body-description-box');
      if (!box) return;
      box.style.display = (getComputedStyle(box).display === 'none') ? 'block' : 'none';
    };
  }

  if (langSel) {
    langSel.onchange = async () => {
      _uiLang = langSel.value;
      await loadLanguage(_uiLang);
      setDirection(_uiLang);
      applyTranslations();
      _raw.sort((a,b) => String(pickLocalized(a?.name,_uiLang)).localeCompare(pickLocalized(b?.name,_uiLang)));
      render();
    };
  }
}

export async function loadHumanBodyGameContent() {
  _uiLang = getCurrentLang();
  bind();
  try {
    _raw = await fetchSubjectItems(SUBJECT_KEY, { strict: true });
    _raw.sort((a,b) => String(pickLocalized(a?.name,_uiLang)).localeCompare(pickLocalized(b?.name,_uiLang)));
    _i = 0;
    render();
  } catch (e) {
    console.error('[human_body] load failed:', e);
  }
}

export function rerenderHumanBody(){ render(); }

if (typeof window !== 'undefined') {
  window.loadHumanBodyGameContent = loadHumanBodyGameContent;
  window.rerenderHumanBody = rerenderHumanBody;
  window.nextBodyPart = onNext;
  window.prevBodyPart = onPrev;
  window.playBodyPart = onPlay;
}
