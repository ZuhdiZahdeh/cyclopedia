// src/core/initializeSubjectControls.js
import { getCurrentLang } from './lang-handler.js';

/** قالب موحّد: [السابق|التالي] ثم [الوصف (ghost)] ثم [الصوت] ثم [اللغة] */
function controlsTemplate(prefix, { withDescription = true } = {}) {
  const lang = getCurrentLang?.() || 'ar';
  return `
    <div class="control-grid" data-subject="${prefix}">
      <div class="row two-col">
        <button id="prev-${prefix}-btn" class="btn secondary" type="button" data-i18n="prev">السابق</button>
        <button id="next-${prefix}-btn" class="btn primary"  type="button" data-i18n="next">التالي</button>
      </div>

      ${withDescription ? `
      <div class="row">
        <!-- مهم: زر الوصف بصنف ghost -->
        <button id="toggle-description-btn-${prefix}" class="btn ghost" type="button" data-i18n="description">الوصف</button>
      </div>` : ''}

      <div class="row">
        <label for="voice-select-${prefix}" class="ctrl-label" data-i18n="voice">الصوت</label>
        <select id="voice-select-${prefix}" class="ctrl-select">
          <option value="teacher" data-i18n="voice_teacher">المعلّم</option>
          <option value="boy"     data-i18n="voice_boy">ولد</option>
          <option value="girl"    data-i18n="voice_girl">بنت</option>
        </select>
      </div>

      <div class="row">
        <label for="game-lang-select-${prefix}" class="ctrl-label" data-i18n="language">اللغة</label>
        <select id="game-lang-select-${prefix}" class="ctrl-select">
          <option value="ar" ${lang==='ar'?'selected':''}>العربية</option>
          <option value="en" ${lang==='en'?'selected':''}>English</option>
          <option value="he" ${lang==='he'?'selected':''}>עברית</option>
        </select>
      </div>
    </div>
  `;
}

/** يبني الشريط داخل الحاوية #<subject>-sidebar-controls */
export function initializeSubjectControls(subjectType) {
  const hostId = `${subjectType}-sidebar-controls`;
  const host = document.getElementById(hostId);
  if (!host) { console.warn(`[sidebar] لم يتم العثور على الحاوية: #${hostId}`); return; }

  // 🎮 مسار خاص: لعبة الذاكرة — حقن ملف HTML خارجي ثم تهيئة السكربت
  if (subjectType === 'memory-game') {
    fetch('/html/memory-game-controls.html')
      .then(r => r.text())
      .then(html => {
        host.innerHTML = html;
        host.style.display = 'block';

        // تفعيل مهيّئ لعبة الذاكرة بعد الحقن
        if (typeof window.initializeMemoryGameSidebarControls === 'function') {
          window.initializeMemoryGameSidebarControls();
        }

        // الحفاظ على ظهور قسم "حسابي" أسفل الشريط
        const staticSection = document.querySelector('#sidebar-section .static-section');
        if (staticSection) staticSection.style.display = '';
      })
      .catch(err => {
        console.error('[sidebar] فشل تحميل أدوات لعبة الذاكرة:', err);
        host.innerHTML = `<div class="sidebar-tip" data-i18n="select_topic">تعذر تحميل أدوات لعبة الذاكرة</div>`;
        host.style.display = 'block';
      });
    return;
  }

  // مواضيع تتبع القالب الموحّد
  const unified = new Set(['animal', 'fruit', 'vegetable', 'profession', 'human-body', 'human_body', 'humanbody']);
  let html = '';

  if (unified.has(subjectType)) {
    html = controlsTemplate(subjectType, { withDescription: true });
  } else if (subjectType === 'tools') {
    // إبقاء صفحة الأدوات على القالب الموحّد (هي أصل القالب أساسًا)
    html = controlsTemplate('tools', { withDescription: true });
  } else {
    html = `<div class="sidebar-tip" data-i18n="select_topic">اختر الموضوع</div>`;
  }

  host.innerHTML = html;
  host.style.display = 'block';

  // الحفاظ على ظهور قسم "حسابي" أسفل الشريط
  const staticSection = document.querySelector('#sidebar-section .static-section');
  if (staticSection) staticSection.style.display = '';
}
