// src/core/initializeSubjectControls.js
import { getCurrentLang } from './lang-handler.js';

// قالب مطابق لصفحة الأدوات: [السابق|التالي] ثم [الوصف] ثم [الصوت] ثم [اللغة]
function controlsTemplate(prefix, { withDescription = true } = {}) {
  const lang = getCurrentLang() || 'ar';
  return `
    <div class="control-grid">
      <div class="row two-col">
        <button id="prev-${prefix}-btn" class="btn secondary" data-i18n="common.prev">السابق</button>
        <button id="next-${prefix}-btn" class="btn primary" data-i18n="common.next">التالي</button>
      </div>

      ${withDescription ? `
      <div class="row">
        <!-- استخدمت نفس مظهر زر الأدوات -->
        <button id="toggle-description-btn-${prefix}" class="btn listen" data-i18n="common.toggle_description">الوصف</button>
      </div>` : ''}

      <div class="row">
        <label for="voice-select-${prefix}" class="ctrl-label" data-i18n="common.voice">الصوت</label>
        <select id="voice-select-${prefix}" class="ctrl-select">
          <option value="teacher" data-i18n="voices.teacher">المعلم</option>
          <option value="boy" data-i18n="voices.boy">ولد</option>
          <option value="girl" data-i18n="voices.girl">بنت</option>
        </select>
      </div>

      <div class="row">
        <label for="game-lang-select-${prefix}" class="ctrl-label" data-i18n="common.language">اللغة</label>
        <select id="game-lang-select-${prefix}" class="ctrl-select">
          <option value="ar" ${lang==='ar'?'selected':''}>العربية</option>
          <option value="en" ${lang==='en'?'selected':''}>English</option>
          <option value="he" ${lang==='he'?'selected':''}>עברית</option>
        </select>
      </div>
    </div>
  `;
}

export function initializeSubjectControls(subjectType) {
  const id = `${subjectType}-sidebar-controls`;
  const host = document.getElementById(id);
  if (!host) { console.warn(`[sidebar] الحاوية غير موجودة: #${id}`); return; }

  let html = '';
  switch (subjectType) {
    // كل هذه المواضيع ستأخذ نفس شريط الأدوات تماماً
    case 'fruit':
    case 'vegetable':
    case 'human-body':
    case 'animal':
    case 'profession':
      html = controlsTemplate(subjectType, { withDescription: true });
      break;

    // صفحات الألعاب/خلافه
    case 'tools':
    case 'alphabet-press':
    case 'memory-game':
    case 'tools-match':
      html = `<div class="sidebar-tip" data-i18n="start_game">ابدأ اللعب</div>`;
      break;

    default:
      html = `<div class="sidebar-tip" data-i18n="select_topic">اختر الموضوع</div>`;
  }

  // إضافات خاصة (تأتي أسفل الشريط الموحد)
  if (subjectType === 'animal') {
    html += `
    <div class="control-grid">
      <div class="row"><button id="play-baby-sound-btn-animal" class="btn" data-i18n="listen_baby_animal">👶🔊 اسم الابن</button></div>
      <div class="row"><button id="toggle-details-btn-animal" class="btn secondary" data-i18n="show_details">ℹ️ التفاصيل</button></div>
      <div class="row"><button id="toggle-baby-image-btn-animal" class="btn secondary" data-i18n="show_baby_image">🍼 صورة الابن</button></div>
    </div>`;
  }
  if (subjectType === 'profession') {
    html += `
    <div class="control-grid">
      <div class="row"><button id="toggle-details-btn-profession" class="btn secondary" data-i18n="show_details">ℹ️ التفاصيل</button></div>
      <div class="row"><button id="toggle-tools-btn-profession" class="btn secondary" data-i18n="tool_related_professions">🧰 الأدوات</button></div>
    </div>`;
  }

  host.innerHTML = html;
  host.style.display = 'block';

  // أبقِ قسم "حسابك" ظاهرًا
  const staticSection = document.querySelector('#sidebar-section .static-section');
  if (staticSection) staticSection.style.display = '';
}
