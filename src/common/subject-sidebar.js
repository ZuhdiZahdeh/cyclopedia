// /src/common/subject-sidebar.js
import { loadLanguage, applyTranslations, setDirection, getCurrentLang } from '../core/lang-handler.js';

export async function ensureSubjectSidebar({
  onPrev, onNext, onToggleDesc, onVoiceChange, onLangChange,
  sidebarSelector = '#sidebar, #sidebar-section, .sidebar'
} = {}) {

  let sidebar = document.querySelector(sidebarSelector);
  if (!sidebar) {
    const main = document.querySelector('main') || document.body;
    sidebar = document.createElement('aside');
    sidebar.id = 'sidebar';
    sidebar.className = 'sidebar';
    (main.parentNode || document.body).insertBefore(sidebar, main);
  }

  let container = document.getElementById('subject-sidebar-controls');
  if (!container) {
    container = document.createElement('div');
    container.id = 'subject-sidebar-controls';
    sidebar.appendChild(container);
  }

  // تحميل القالب (ومنع الكاش)
  let html = '';
  try {
    const resp = await fetch('/html/subject-controls.html?v=1', { cache: 'no-store' });
    if (resp.ok) html = await resp.text();
  } catch {}
  container.innerHTML = html || fallbackHtml();
  container.hidden = false;
  container.style.setProperty('display', 'block', 'important');

  // ربط الأزرار
  container.addEventListener('click', (e) => {
    const id = e.target?.id;
    if (id === 'prev-subj-btn' && onPrev) onPrev();
    if (id === 'next-subj-btn' && onNext) onNext();
    if (id === 'toggle-description-btn' && onToggleDesc) onToggleDesc();
  });
  container.addEventListener('change', (e) => {
    const t = e.target;
    if (!t?.id) return;
    if (t.id === 'voice-select' && onVoiceChange) onVoiceChange();
    if (t.id === 'game-lang-select' && onLangChange) onLangChange(t.value);
  });

  applyTranslations();

  // ضبط القيم الحالية
  const lang = getCurrentLang?.() || document.documentElement.lang || 'ar';
  const langSel = container.querySelector('#game-lang-select');
  if (langSel) langSel.value = lang;

  return container;
}

export function ensureClickToPlayUniversal(playFn, {
  nameSelectors = ['#animal-word','#fruit-word','#vegetable-word','#tool-word','#human-part-word','#profession-word','.item-main-name'],
  imageSelectors= ['#animal-image','#fruit-image','#vegetable-image','#tool-image','#human-part-image','#profession-image','.main-image'],
} = {}) {
  const bindOnce = (el) => {
    if (!el || el.dataset.clickBound) return;
    el.classList.add('clickable-text');
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => playFn && playFn(), { passive: true });
    el.dataset.clickBound = '1';
  };
  const nameEl = document.querySelector(nameSelectors.join(','));
  const imgEl  = document.querySelector(imageSelectors.join(','));
  bindOnce(nameEl);
  bindOnce(imgEl);
}

export function setHighlightedName(el, text) {
  if (!el) return;
  const s = (text || '').toString();
  el.innerHTML = s ? `<span class="highlight-first-letter">${s.charAt(0)}</span>${s.slice(1)}` : '—';
}

function fallbackHtml(){
  return `
  <div class="control-grid">
    <div class="row two-col">
      <button id="prev-subj-btn" class="btn secondary">السابق</button>
      <button id="next-subj-btn" class="btn primary">التالي</button>
    </div>
    <div class="row">
      <button id="toggle-description-btn" class="btn ghost">الوصف</button>
    </div>
    <div class="row">
      <label for="voice-select" class="ctrl-label">الصوت</label>
      <select id="voice-select" class="ctrl-select">
        <option value="teacher">المعلم</option>
        <option value="boy">ولد</option>
        <option value="girl">بنت</option>
      </select>
    </div>
    <div class="row">
      <label for="game-lang-select" class="ctrl-label">اللغة</label>
      <select id="game-lang-select" class="ctrl-select">
        <option value="ar">العربية</option>
        <option value="en">English</option>
        <option value="he">עברית</option>
      </select>
    </div>
  </div>`;
}
