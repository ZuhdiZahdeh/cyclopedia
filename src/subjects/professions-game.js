// src/subjects/professions-game.js
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';
import { fetchSubjectItems } from '../core/items-repo.js';
import { pickLocalized, getImagePath, slugify } from '../core/media-utils.js';

// الحالة
let professions = [];
let currentIndex = 0;
let currentItem  = null;

// كاش للأدوات لاحتساب "الأدوات المرتبطة" بسرعة
let toolsCache = null;

function $(id){ return document.getElementById(id); }
const isAbs = (p) => /^https?:\/\//i.test(p) || /^data:/i.test(p) || /^blob:/i.test(p);

function getEffectiveLang() {
  return $('game-lang-select-profession')?.value || getCurrentLang();
}

function displayName(item, lang) { return pickLocalized(item?.name, lang); }
function resolveImagePath(item) {
  const p = getImagePath(item);
  return p || '/images/default.png';
}

// اختيار مسار الصوت (بأولوية: sound[lang][voice] → voices → تركيب مسار افتراضي)
function audioPath(item, lang, voice='teacher') {
  const s = item?.sound;
  if (s && s[lang]) {
    const node = s[lang];
    if (typeof node === 'string' && node) return node.startsWith('/') ? node : `/${node}`;
    const v = node?.[voice] || node?.teacher || node?.boy || node?.girl;
    if (typeof v === 'string' && v) return v.startsWith('/') ? v : `/${v}`;
  }
  if (item?.voices?.[`${voice}_${lang}`]) {
    const f = item.voices[`${voice}_${lang}`];
    return f.startsWith('/') ? f : `/${f}`;
  }
  if (item?.voices?.[`${lang}_${voice}`]) {
    const f = item.voices[`${lang}_${voice}`];
    return f.startsWith('/') ? f : `/${f}`;
  }
  const base = item?.sound_base || item?.audio_base || item?.id || slugify(displayName(item, lang));
  if (base) return `/audio/${lang}/professions/${slugify(base)}_${voice}_${lang}.mp3`;
  if (typeof item?.audio === 'string') return item.audio.startsWith('/') ? item.audio : `/${item.audio}`;
  return '';
}

// الأدوات المرتبطة بهذه المهنة (مطابقة على معرف/أسماء)
async function getRelatedTools(prof) {
  if (!toolsCache) toolsCache = await fetchSubjectItems('tools', { strict:false });
  const keys = [
    prof?.id,
    pickLocalized(prof?.name,'en'),
    pickLocalized(prof?.name,'ar'),
    pickLocalized(prof?.name,'he')
  ].filter(Boolean).map(s => String(s).toLowerCase());

  return (toolsCache || []).filter(t => {
    const arr = Array.isArray(t?.professions) ? t.professions : [];
    return arr.some(x => keys.includes(String(x).toLowerCase()));
  });
}

// رسم الواجهة
async function updateUI() {
  const lang = getEffectiveLang();

  if (!professions.length) {
    const nameEl = $('profession-word');
    const imgEl  = $('profession-image');
    if (nameEl) nameEl.textContent = '—';
    if (imgEl) { imgEl.removeAttribute('src'); imgEl.alt = ''; }
    // امسح الحقول الأخرى
    const descEl = $('profession-description'); if (descEl) descEl.textContent = '';
    const detSec = $('profession-details-section'); if (detSec) detSec.innerHTML = '';
    const toolsSec = $('profession-tools-section'); if (toolsSec) toolsSec.innerHTML = '';
    return;
  }

  currentItem = professions[currentIndex];
  const name = displayName(currentItem, lang);

  // الاسم + الصورة
  const nameEl = $('profession-word')  || $('item-word')  || $('item-name');
  const imgEl  = $('profession-image') || $('item-image');

  if (nameEl) {
    const s = String(name || '');
    nameEl.innerHTML = `<span class="first-letter">${s[0] || ''}</span>${s.slice(1)}`;
    nameEl.style.cursor = 'pointer';
    nameEl.onclick = playCurrentProfessionAudio;
  }

  if (imgEl) {
    const src = resolveImagePath(currentItem);
    imgEl.alt = name || '';
    imgEl.onclick = playCurrentProfessionAudio;
    imgEl.onerror = () => console.warn('[professions] missing image:', src);
    imgEl.src = src;
  }

  // الوصف
  const descEl = $('profession-description');
  if (descEl) descEl.textContent = pickLocalized(currentItem?.description, lang) || '—';

  // التفاصيل (التصنيف + الحرف الأول)
  const detSec = $('profession-details-section');
  if (detSec) {
    const category = pickLocalized(currentItem?.category, lang) || '---';
    const letter   = pickLocalized(currentItem?.letter, lang)   || '---';
    detSec.innerHTML = `
      <ul class="details-list">
        <li><strong>Category:</strong> ${category}</li>
        <li><strong>الحرف الأول:</strong> ${letter}</li>
      </ul>
    `;
  }

  // الأدوات المرتبطة
  const toolsSec = $('profession-tools-section');
  if (toolsSec) {
    const related = await getRelatedTools(currentItem);
    if (!related.length) {
      toolsSec.innerHTML = `<div class="empty">—</div>`;
    } else {
      const langNow = getEffectiveLang();
      toolsSec.innerHTML = `
        <ul class="tools-list">
          ${related.map(t => `<li>${pickLocalized(t?.name, langNow) || t?.id || ''}</li>`).join('')}
        </ul>
      `;
    }
  }

  // تفعيل/تعطيل أزرار السابق/التالي
  const prevBtn = $('prev-profession-btn');
  const nextBtn = $('next-profession-btn');
  if (prevBtn) prevBtn.disabled = (currentIndex === 0 || professions.length <= 1);
  if (nextBtn) nextBtn.disabled = (currentIndex >= professions.length - 1 || professions.length <= 1);

  // تعطيل زر الاستماع إذا لا يوجد مسار
  const playBtn  = $('play-sound-btn-profession');
  if (playBtn) {
    const voice = $('voice-select-profession')?.value || 'teacher';
    const src   = audioPath(currentItem, lang, voice);
    playBtn.disabled = !src;
  }

  stopCurrentAudio();
}

// تنقّل/صوت
export function showNextProfession() {
  if (!professions.length) return;
  if (currentIndex < professions.length - 1) currentIndex++;
  updateUI();
  try { recordActivity('professions', 'next', { index: currentIndex }); } catch {}
}

export function showPreviousProfession() {
  if (!professions.length) return;
  if (currentIndex > 0) currentIndex--;
  updateUI();
  try { recordActivity('professions', 'prev', { index: currentIndex }); } catch {}
}

export async function playCurrentProfessionAudio() {
  if (!professions.length || !currentItem) return;
  const lang  = getEffectiveLang();
  const voice = $('voice-select-profession')?.value || 'teacher';
  const src   = audioPath(currentItem, lang, voice);
  if (!src) return;
  try { stopCurrentAudio(); await Promise.resolve(playAudio(src)); } catch (e) {
    console.warn('[professions] audio failed:', src, e);
  }
}

// جلب البيانات (من items فقط) + strict لمنع عرض غير المطابق
async function fetchProfessionsData() {
  const arr = await fetchSubjectItems('professions', { strict:true });
  console.log('[professions] ✅ source: items | count =', arr?.length || 0);
  return arr || [];
}

// ربط عناصر التحكم
function bindControls() {
  const prevBtn  = $('prev-profession-btn');
  const nextBtn  = $('next-profession-btn');
  const playBtn  = $('play-sound-btn-profession');
  const langSel  = $('game-lang-select-profession');
  const voiceSel = $('voice-select-profession');

  if (prevBtn) prevBtn.onclick = showPreviousProfession;
  if (nextBtn) nextBtn.onclick = showNextProfession;
  if (playBtn) playBtn.onclick = playCurrentProfessionAudio;
  if (voiceSel && !voiceSel.value) voiceSel.value = 'teacher';

  if (langSel) {
    try { langSel.value = getCurrentLang(); } catch {}
    langSel.onchange = async () => {
      const lng = langSel.value;
      await loadLanguage(lng);
      setDirection(lng);
      applyTranslations();
      professions.sort((a, b) => (displayName(a, lng) || '').localeCompare(displayName(b, lng) || ''));
      updateUI();
    };
  }

  const toggleDesc    = $('toggle-description-btn-profession');
  const toggleDetails = $('toggle-details-btn-profession');
  const toggleTools   = $('toggle-tools-btn-profession');

  const toggleDisplay = (id) => {
    const box = $(id);
    if (!box) return;
    const hidden = getComputedStyle(box).display === 'none';
    box.style.display = hidden ? 'block' : 'none';
  };

  if (toggleDesc)    toggleDesc.onclick    = () => toggleDisplay('profession-description-box');
  if (toggleDetails) toggleDetails.onclick = () => toggleDisplay('profession-details-section');
  if (toggleTools)   toggleTools.onclick   = () => toggleDisplay('profession-tools-section');
}

// نقطة الدخول
export async function loadProfessionsGameContent() {
  ['prev-profession-btn','next-profession-btn','play-sound-btn-profession'].forEach(id => {
    const b = $(id); if (b) b.disabled = true;
  });

  bindControls();
  professions = await fetchProfessionsData();

  if (!professions.length) {
    const nameEl = $('profession-word');
    const imgEl  = $('profession-image');
    if (nameEl) nameEl.textContent = 'لا توجد بيانات';
    if (imgEl)  imgEl.src = '/images/default.png';
    return;
  }

  const lang = getEffectiveLang();
  professions.sort((a, b) => (displayName(a, lang) || '').localeCompare(displayName(b, lang) || ''));
  currentIndex = 0;
  await updateUI();

  ['prev-profession-btn','next-profession-btn','play-sound-btn-profession'].forEach(id => {
    const b = $(id); if (b) b.disabled = false;
  });

  if (typeof window !== 'undefined') {
    window.loadProfessionsGameContent = loadProfessionsGameContent;
    window.showNextProfession = showNextProfession;
    window.showPreviousProfession = showPreviousProfession;
    window.playCurrentProfessionAudio = playCurrentProfessionAudio;
  }
}
