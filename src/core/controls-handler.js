// src/js/controls-handler.js
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

export function hideAllControls() {
  const s = getSidebar();
  if (!s) return;
  // احذف أي حاوية تحكم قديمة حقّناها سابقًا:
  [...s.querySelectorAll(".sidebar-controls")].forEach(n => n.remove());
}

// ========== قوالب بسيطة لكل موضوع ==========
function fruitControls() {
  return el(`
    <div class="sidebar-controls" id="fruit-sidebar-controls">
      <h4>الفواكه</h4>
      <label>اللغة:
        <select id="game-lang-select-fruit">
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="he">עברית</option>
        </select>
      </label>
      <label>الصوت:
        <select id="voice-select-fruit">
          <option value="teacher">المعلم</option>
          <option value="boy">ولد</option>
          <option value="girl">بنت</option>
        </select>
      </label>
      <div class="row">
        <button id="prev-fruit-btn" class="btn">السابق</button>
        <button id="next-fruit-btn" class="btn">التالي</button>
      </div>
      <button id="play-sound-btn-fruit" class="btn">تشغيل الصوت</button>
    </div>
  `);
}

function animalControls() {
  return el(`
    <div class="sidebar-controls" id="animal-sidebar-controls">
      <h4>الحيوانات</h4>
      <label>اللغة:
        <select id="game-lang-select-animal">
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="he">עברית</option>
        </select>
      </label>
      <label>الصوت:
        <select id="voice-select-animal">
          <option value="teacher">المعلم</option>
          <option value="boy">ولد</option>
          <option value="girl">بنت</option>
        </select>
      </label>
      <div class="row">
        <button id="prev-animal-btn" class="btn">السابق</button>
        <button id="next-animal-btn" class="btn">التالي</button>
      </div>
      <button id="play-sound-btn-animal" class="btn">تشغيل الصوت</button>
      <button id="play-baby-sound-btn-animal" class="btn small">صوت الصغير</button>
    </div>
  `);
}

function vegetableControls() {
  return el(`
    <div class="sidebar-controls" id="vegetable-sidebar-controls">
      <h4>الخضروات</h4>
      <label>اللغة:
        <select id="game-lang-select-vegetable">
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="he">עברית</option>
        </select>
      </label>
      <label>الصوت:
        <select id="voice-select-vegetable">
          <option value="teacher">المعلم</option>
          <option value="boy">ولد</option>
          <option value="girl">بنت</option>
        </select>
      </label>
      <div class="row">
        <button id="prev-vegetable-btn" class="btn">السابق</button>
        <button id="next-vegetable-btn" class="btn">التالي</button>
      </div>
      <button id="play-sound-btn-vegetable" class="btn">تشغيل الصوت</button>
    </div>
  `);
}

// يمكنك لاحقًا إضافة قوالب مماثلة لباقي المواضيع…

// ========== دوال إظهار ==========
export function showFruitControls() {
  const s = getSidebar(); if (!s) return;
  hideAllControls();
  s.appendChild(fruitControls());
}

export function showAnimalControls() {
  const s = getSidebar(); if (!s) return;
  hideAllControls();
  s.appendChild(animalControls());
}

export function showVegetableControls() {
  const s = getSidebar(); if (!s) return;
  hideAllControls();
  s.appendChild(vegetableControls());
}

// مكان موقت للدوال المطلوبة من main.js حتى لا تكسر البناء الآن:
export function showHumanBodyControls(){ hideAllControls(); }
export function showProfessionControls(){ hideAllControls(); }
export function showToolControls(){ hideAllControls(); }
export function showAlphabetPressControls(){ hideAllControls(); }
export function showMemoryGameControls(){ hideAllControls(); }
export function showToolsMatchControls(){ /* تُحمّل من ملف HTML خاص ضمن main.js */ }
