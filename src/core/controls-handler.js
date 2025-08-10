// src/core/controls-handler.js
// يحـقِن قوالب تحكم السايدبار لكل موضوع بأسماء IDs موحَّدة
// ويزيل أي قوالب قديمة عند التنقّل

const SIDEBAR_ID = "sidebar-section";

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function getSidebar() {
  const s = document.getElementById(SIDEBAR_ID);
  if (!s) console.warn("[controls] لم يتم العثور على #sidebar-section");
  return s;
}

// احذف فقط القوالب الديناميكية دون المساس بالقسم الثابت (حسابك)
export function hideAllControls() {
  const s = getSidebar();
  if (!s) return;
  s.querySelectorAll(".sidebar-controls").forEach(n => n.remove());
}

// مولد عام لقالب التحكم
function buildControls(prefix, {
  titleKey,               // مفتاح i18n لعنوان القسم (اختياري)
  includeToggleDesc = false,
  includeBabySound = false
} = {}) {
  const titleHtml = titleKey
    ? `<h4 data-i18n="${titleKey}"></h4>`
    : "";

  const toggleBtn = includeToggleDesc
    ? `<button id="toggle-description-btn-${prefix}" class="btn secondary">📝 <span data-i18n="sidebar.description">الوصف</span></button>`
    : "";

  const babyBtn = includeBabySound
    ? `<button id="play-baby-sound-btn-animal" class="btn small">🐣 <span data-i18n="sidebar.baby_sound">صوت الصغير</span></button>`
    : "";

  return el(`
    <div class="sidebar-controls" id="${prefix}-sidebar-controls">
      ${titleHtml}

      <div class="sidebar-game-controls">
        <div class="control-group">
          <label for="game-lang-select-${prefix}" data-i18n="sidebar.language">اللغة</label>
          <select id="game-lang-select-${prefix}">
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="he">עברית</option>
          </select>
        </div>

        <div class="control-group">
          <label for="voice-select-${prefix}" data-i18n="sidebar.voice">الصوت</label>
          <select id="voice-select-${prefix}">
            <option value="teacher" data-i18n="sidebar.voice_teacher">المعلّم</option>
            <option value="girl" data-i18n="sidebar.voice_girl">بنت</option>
            <option value="boy"  data-i18n="sidebar.voice_boy">ولد</option>
          </select>
        </div>

        <div class="sidebar-navigation-buttons">
          <button id="prev-${prefix}-btn" class="btn" data-i18n="sidebar.prev">السابق</button>
          <button id="play-sound-btn-${prefix}" class="btn" data-i18n="sidebar.listen">استمع</button>
          <button id="next-${prefix}-btn" class="btn" data-i18n="sidebar.next">التالي</button>
        </div>

        ${toggleBtn}
        ${babyBtn}
      </div>
    </div>
  `);
}

/* ========== واجهات إظهار لكل موضوع ========== */
// ملاحظة: السكربتات الخاصة بالمواضيع هي التي تربط الأحداث (onchange/onclick)

export function showFruitControls() {
  const s = getSidebar(); if (!s) return;
  hideAllControls();
  s.appendChild(buildControls("fruit", { titleKey: "fruits.title", includeToggleDesc: true }));
}

export function showVegetableControls() {
  const s = getSidebar(); if (!s) return;
  hideAllControls();
  s.appendChild(buildControls("vegetable", { titleKey: "vegetables.title", includeToggleDesc: true }));
}

export function showAnimalControls() {
  const s = getSidebar(); if (!s) return;
  hideAllControls();
  s.appendChild(buildControls("animal", { titleKey: "animals.title", includeBabySound: true }));
}

export function showHumanBodyControls() {
  const s = getSidebar(); if (!s) return;
  hideAllControls();
  s.appendChild(buildControls("human-body", { titleKey: "human_body.title", includeToggleDesc: true }));
}

export function showProfessionControls() {
  const s = getSidebar(); if (!s) return;
  hideAllControls();
  s.appendChild(buildControls("profession", { titleKey: "professions.title", includeToggleDesc: true }));
}

export function showToolControls() {
  const s = getSidebar(); if (!s) return;
  hideAllControls();
  s.appendChild(buildControls("tools", { titleKey: "tools.title", includeToggleDesc: true }));
}

export function showAlphabetPressControls() {
  const s = getSidebar(); if (!s) return;
  hideAllControls();
  s.appendChild(buildControls("alphabet-press", { titleKey: "alphabet_press.title" }));
}

export function showMemoryGameControls() {
  const s = getSidebar(); if (!s) return;
  hideAllControls();
  s.appendChild(buildControls("memory-game", { titleKey: "memory_game.title" }));
}

export function showToolsMatchControls() {
  const s = getSidebar(); if (!s) return;
  hideAllControls();
  s.appendChild(buildControls("tools-match", { titleKey: "tools_match.title" }));
}
