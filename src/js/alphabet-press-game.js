// ✅ النسخة المعدلة من alphabet-press-game.js

console.log("✅ تم تحميل alphabet-press-game.js");
import { db } from './firebase-config.js';
import { collection, getDocs, query } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from './lang-handler.js';
import { playAudio, stopCurrentAudio } from './audio-handler.js';
import { recordActivity } from './activity-handler.js';

let allItems = [];
let currentDisplayedItem = null;
export let currentAlphabetPressCategory = 'animals';
export let currentAlphabetPressVoice = 'teacher';

const alphabetLetters = {
  'ar': ['أ','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'],
  'en': [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
  'he': ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת']
};

 const availableCategories = [
  { id: 'animals', name_ar: 'حيوانات', name_en: 'Animals', name_he: 'חיות' },
  { id: 'fruits', name_ar: 'فواكه', name_en: 'Fruits', name_he: 'פירות' },
  { id: 'vegetables', name_ar: 'خضروات', name_en: 'Vegetables', name_he: 'ירקות' },
  { id: 'human-body', name_ar: 'جسم الإنسان', name_en: 'Human Body', name_he: 'גוף האדם' },
  { id: 'professions', name_ar: 'مهن', name_en: 'Professions', name_he: 'מקצועות' },
  { id: 'profession_tools', name_ar: 'أدوات المهن', name_en: 'Profession Tools', name_he: 'כלי עבודה' },
];

export function getCurrentDisplayedItem() {
  return currentDisplayedItem;
}

export function updateAlphabetPressCategory(newCategory) {
  currentAlphabetPressCategory = newCategory;
  loadCategoryItems(newCategory);
}

export function updateAlphabetPressVoice(newVoice) {
  currentAlphabetPressVoice = newVoice;
}

export async function populateAlphabetPressSidebarOptions() {
  const langSelect = document.getElementById('alphabet-press-language-select');
  const catSelect = document.getElementById('alphabet-press-category-select');
  const voiceSelect = document.getElementById('alphabet-press-voice-select');
  const playAudioBtn = document.getElementById('alphabet-press-play-audio-sidebar');

  if (!langSelect || !catSelect || !voiceSelect || !playAudioBtn) return;

  langSelect.innerHTML = '';
  ['ar', 'en', 'he'].forEach(lang => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = { ar: 'العربية', en: 'English', he: 'עברית' }[lang];
    langSelect.appendChild(option);
  });
  langSelect.value = getCurrentLang();

  catSelect.innerHTML = '';
  availableCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat['name_' + getCurrentLang()];
    catSelect.appendChild(option);
  });
  catSelect.value = currentAlphabetPressCategory;

  voiceSelect.innerHTML = `
    <option value="teacher">المعلم</option>
    <option value="boy">صوت ولد</option>
    <option value="girl">صوت بنت</option>
    <option value="child">صوت طفل</option>
  `;
  voiceSelect.value = currentAlphabetPressVoice;

  langSelect.addEventListener('change', async () => {
    await loadLanguage(langSelect.value);
    applyTranslations();
    setDirection(langSelect.value);
    Array.from(catSelect.options).forEach(opt => {
      const category = availableCategories.find(c => c.id === opt.value);
      if (category) opt.textContent = category['name_' + langSelect.value];
    });
    handleAlphabetPressLanguageChange(langSelect.value);
  });

  catSelect.addEventListener('change', () => {
    handleAlphabetPressCategoryChange(catSelect.value);
  });

  voiceSelect.addEventListener('change', () => {
    updateAlphabetPressVoice(voiceSelect.value);
  });

  playAudioBtn.addEventListener('click', () => {
    playCurrentAlphabetItemAudioFromSidebar();
  });
}

export async function loadAlphabetPressGameContent() {
  const mainContentArea = document.querySelector('.main-content');
  try {
    const response = await fetch('/html/alphabet-press.html');
    if (!response.ok) throw new Error(`Failed to load html: ${response.statusText}`);
    mainContentArea.innerHTML = await response.text();
  } catch (err) {
    console.error(err);
    mainContentArea.innerHTML = "<p style='color:red;'>فشل تحميل اللعبة.</p>";
    return;
  }

  generateKeyboard(getCurrentLang());
  resetDisplay();
  await loadCategoryItems(currentAlphabetPressCategory);
  applyTranslations();
}

export function playCurrentAlphabetItemAudioFromSidebar() {
  if (!currentDisplayedItem) return;
  const audioPath = getAudioPath(currentDisplayedItem, currentAlphabetPressVoice, currentAlphabetPressCategory);
  if (audioPath) {
    playAudio(audioPath);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) recordActivity(user, currentAlphabetPressCategory);
  }
}

export async function handleAlphabetPressLanguageChange(newLang) {
  generateKeyboard(getCurrentLang());
  resetDisplay();
  await loadCategoryItems(currentAlphabetPressCategory);
}

export async function handleAlphabetPressCategoryChange(newCategoryId) {
  currentAlphabetPressCategory = newCategoryId;
  await loadCategoryItems(newCategoryId);
  resetDisplay();
}

function generateKeyboard(lang) {
  const container = document.getElementById('alphabet-keyboard');
  if (!container) return;
  container.innerHTML = '';
  (alphabetLetters[lang] || []).forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'keyboard-button';
    btn.textContent = letter;
    btn.onclick = () => handleLetterPress(letter);
    container.appendChild(btn);
  });
}

async function loadCategoryItems(categoryId) {
  showGameMessage('جارٍ التحميل...', 'info');
  try {
    const ref = collection(db, 'categories', categoryId, 'items');
    const q = query(ref);
    const snapshot = await getDocs(q);
    allItems = snapshot.docs.map(doc => doc.data());
    hideGameMessage();
    if (allItems.length === 0) showGameMessage('لا توجد عناصر لهذه الفئة.', 'warning');
  } catch (err) {
    console.error(err);
    showGameMessage('فشل تحميل العناصر.', 'error');
    allItems = [];
  }
}

function handleLetterPress(letter) {
  stopCurrentAudio();
  const lang = getCurrentLang();
  const results = allItems.filter(item => item.letter?.[lang]?.toLowerCase() === letter.toLowerCase());
  if (results.length > 0) {
    const item = results[Math.floor(Math.random() * results.length)];
    displayItem(item);
  } else {
    resetDisplay();
    showGameMessage(`لا يوجد عنصر يبدأ بالحرف "${letter}"`, 'warning');
  }
}

function displayItem(item) {
  currentDisplayedItem = item;

  const imgEl = document.getElementById('alphabet-press-image');
  const nameEl = document.getElementById('alphabet-press-item-name');
  const name = item.name?.[getCurrentLang()] || '';

  if (imgEl) {
    imgEl.src = `/images/${currentAlphabetPressCategory}/${item.image}`;
    imgEl.alt = name;
  }
  if (nameEl) {
    nameEl.innerHTML = name ? `<span class="highlight-first-letter">${name[0]}</span>${name.slice(1)}` : '';
  }

  const audioPath = getAudioPath(item, currentAlphabetPressVoice, currentAlphabetPressCategory);
  if (audioPath) {
    playAudio(audioPath);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) recordActivity(user, currentAlphabetPressCategory);
  }

  const display = document.getElementById('item-display-area');
  if (display) display.style.display = 'flex';

  hideGameMessage();
}

function getAudioPath(itemData, voiceType, categoryId) {
  const lang = getCurrentLang();
  const voiceKey = `${voiceType}_${lang}`;
  const folder = `/audio/${lang}/${categoryId}/`;

  let fileName = null;

  if (categoryId === 'professions' && itemData.sound?.[lang]?.[voiceType]) {
    // ✅ المهن - الصوت محفوظ بشكل مباشر
    return `/${itemData.sound[lang][voiceType]}`;
  } else if (itemData.voices?.[voiceKey]) {
    // ✅ الأدوات والحيوانات وأجزاء الجسم والفواكه والخضروات - الصوت موجود داخل voices
    fileName = itemData.voices[voiceKey];
  } else if (itemData.sound_base) {
    // ✅ توليد اسم الملف إذا كان sound_base موجودًا
    fileName = `${itemData.sound_base}_${voiceType}_${lang}.mp3`;
  }

  if (!fileName) {
    console.warn(`🔇 لا يوجد ملف صوت للعنصر: ${itemData.name?.[lang]}`);
    return null;
  }

  return `${folder}${fileName}`;
}

function resetDisplay() {
  const display = document.getElementById('item-display-area');
  if (display) display.style.display = 'none';
  currentDisplayedItem = null;
  stopCurrentAudio();
  hideGameMessage();
}

function showGameMessage(msg, type) {
  const box = document.getElementById('game-message');
  if (!box) return;
  box.querySelector('p').textContent = msg;
  box.style.display = 'block';
  box.className = 'info-box';
  box.style.backgroundColor = {
    'info': 'var(--color-info)',
    'warning': 'var(--color-warning)',
    'error': 'var(--color-danger)'
  }[type] || 'var(--color-info)';
  box.style.color = (type === 'warning') ? 'var(--color-text-primary)' : 'var(--color-white)';
}

function hideGameMessage() {
  const box = document.getElementById('game-message');
  if (box) box.style.display = 'none';
}
