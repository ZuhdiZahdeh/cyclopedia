// src/core/initializeSubjectControls.js
import { getCurrentLang } from './lang-handler.js';

function controlsTemplate(prefix, { withDescriptionToggle = false } = {}) {
  const lang = getCurrentLang() || 'ar';
  return `
    <div class="sidebar-controls">
      <div class="control-group">
        <label for="game-lang-select-${prefix}" data-i18n="Language">اللغة</label>
        <select id="game-lang-select-${prefix}">
          <option value="ar" data-i18n="lang_arabic" ${lang === 'ar' ? 'selected' : ''}>العربية</option>
          <option value="en" data-i18n="lang_english" ${lang === 'en' ? 'selected' : ''}>English</option>
          <option value="he" data-i18n="lang_hebrew"  ${lang === 'he' ? 'selected' : ''}>עברית</option>
        </select>
      </div>

      <div class="control-group">
        <label for="voice-select-${prefix}" data-i18n="Voice">الصوت</label>
        <select id="voice-select-${prefix}">
          <option value="boy"     data-i18n="boy_voice">صوت الولد</option>
          <option value="girl"    data-i18n="girl_voice">صوت البنت</option>
          <option value="teacher" data-i18n="teacher_voice">صوت المعلم</option>
        </select>
      </div>

      <div class="control-actions">
        <button id="prev-${prefix}-btn" class="btn" data-i18n="previous">◀ السابق</button>
        <button id="play-sound-btn-${prefix}" class="btn" data-i18n="listen">▶ استمع</button>
        <button id="next-${prefix}-btn" class="btn" data-i18n="next">التالي ▶</button>
        ${withDescriptionToggle
          ? `<button id="toggle-description-btn-${prefix}" class="btn secondary" data-i18n="show_description">📝 الوصف</button>`
          : ''
        }
      </div>
    </div>
  `;
}

export function initializeSubjectControls(subjectType) {
  const id = `${subjectType}-sidebar-controls`;
  const host = document.getElementById(id);
  if (!host) {
    console.warn(`[sidebar] الحاوية غير موجودة: #${id}`);
    return;
  }

  let html = '';

  switch (subjectType) {
    case 'fruit': {
      // نفس نسق الخضروات (بدون أزرار إضافية)
      html = controlsTemplate('fruit');
      break;
    }

    case 'vegetable': {
      html = controlsTemplate('vegetable');
      break;
    }

    case 'human-body': {
      html = controlsTemplate('human-body');
      break;
    }

    case 'profession': {
      // المهن: نضيف زر الوصف + (التفاصيل/الأدوات) مثل ما اتفقنا
      html = controlsTemplate('profession', { withDescriptionToggle: true });
      html += `
        <div class="control-actions">
          <button id="toggle-details-btn-profession" class="btn secondary" data-i18n="show_details">ℹ️ التفاصيل</button>
          <button id="toggle-tools-btn-profession"   class="btn secondary" data-i18n="tool_related_professions">🧰 الأدوات</button>
        </div>
      `;
      break;
    }

    case 'animal': {
      // الحيوانات: نضيف الوصف + التفاصيل + صورة الابن + زر صوت الابن (باللواحق المطلوبة)
      html = controlsTemplate('animal', { withDescriptionToggle: true });
      html += `
        <div class="control-actions">
          <button id="play-baby-sound-btn-animal"   class="btn"          data-i18n="listen_baby_animal">👶🔊 اسم الابن</button>
          <button id="toggle-details-btn-animal"    class="btn secondary" data-i18n="show_details">ℹ️ التفاصيل</button>
          <button id="toggle-baby-image-btn-animal" class="btn secondary" data-i18n="show_baby_image">🍼 صورة الابن</button>
        </div>
      `;
      break;
    }

    case 'tools':
    case 'alphabet-press':
    case 'memory-game':
    case 'tools-match': {
      html = `<div class="sidebar-tip" data-i18n="start_game">ابدأ اللعب</div>`;
      break;
    }

    default: {
      html = `<div class="sidebar-tip" data-i18n="select_topic">اختر الموضوع</div>`;
    }
  }

  host.innerHTML = html;
  host.style.display = 'block';

  // أبقِ القسم الثابت (إن وُجد) ظاهرًا
  const staticSection = document.querySelector('#sidebar-section .static-section');
  if (staticSection) staticSection.style.display = '';
}
