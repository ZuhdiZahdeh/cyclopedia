// src/core/initializeSubjectControls.js
import { getCurrentLang } from './lang-handler.js';

function controlsTemplate(prefix, { withToggle = false } = {}) {
  const lang = getCurrentLang() || 'ar';
  return `
    <div class="sidebar-controls">
      <div class="control-group">
        <label for="game-lang-select-${prefix}">🌐 اللغة</label>
        <select id="game-lang-select-${prefix}">
          <option value="ar" ${lang === 'ar' ? 'selected' : ''}>العربية</option>
          <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
          <option value="he" ${lang === 'he' ? 'selected' : ''}>עברית</option>
        </select>
      </div>

      <div class="control-group">
        <label for="voice-select-${prefix}">🎙️ الصوت</label>
        <select id="voice-select-${prefix}">
          <option value="teacher">المعلّم</option>
          <option value="girl">بنت</option>
          <option value="boy">ولد</option>
        </select>
      </div>

      <div class="control-actions">
        <button id="prev-${prefix}-btn" class="btn">◀ السابق</button>
        <button id="play-sound-btn-${prefix}" class="btn">▶ استمع</button>
        <button id="next-${prefix}-btn" class="btn">التالي ▶</button>
        ${withToggle ? `<button id="toggle-description-btn-${prefix}" class="btn secondary">📝 الوصف</button>` : ''}
      </div>
    </div>
  `;
}

export function initializeSubjectControls(subjectType) {
  // أخفِ/افرغ غير الهدف (تم بالفعل في hideAllControls)
  const id = `${subjectType}-sidebar-controls`;
  const host = document.getElementById(id);
  if (!host) {
    console.warn(`[sidebar] هدف غير موجود: #${id}`);
    return;
  }

  let html = '';
  switch (subjectType) {
    case 'fruit':         html = controlsTemplate('fruit'); break;
    case 'vegetable':     html = controlsTemplate('vegetable'); break;
    case 'human-body':    html = controlsTemplate('human-body'); break;
    case 'profession':    html = controlsTemplate('profession', { withToggle: true }); break;
    case 'tools':         html = controlsTemplate('tools', { withToggle: true }); break;
    case 'animal':        html = controlsTemplate('animal'); break;
    case 'alphabet-press':
    case 'memory-game':
    case 'tools-match':
      // ألعاب خاصة؛ إن احتجت لاحقًا أزرارًا سنضيفها هنا
      html = `<div class="sidebar-tip">اختر بطاقة وابدأ اللعب 🎮</div>`;
      break;
    default:
      html = `<div class="sidebar-tip">اختر موضوعًا من الأعلى.</div>`;
  }

  host.innerHTML = html;
  host.style.display = 'block';

  // أبقِ القسم الثابت ظاهرًا
  const staticSection = document.querySelector('#sidebar-section .static-section');
  if (staticSection) staticSection.style.display = '';
}
