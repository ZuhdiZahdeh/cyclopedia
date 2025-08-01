
import { getCurrentLang, setDirection, applyTranslations } from './lang-handler.js';
import { loadAnimalsGameContent } from './animals-game.js';
import { loadFruitsGameContent } from './fruits-game.js';
import { loadVegetablesGameContent } from './vegetables-game.js';
import { loadHumanBodyGameContent } from './human-body-game.js';
import { loadProfessionsGameContent } from './professions-game.js';
import { loadToolsGameContent } from './tools-game.js';
import { loadAlphabetPressGameContent } from './alphabet-press-game.js';
import { loadMemoryGameContent } from './memory-game.js';

export async function initializeSubjectControls(subjectType) {
  // إخفاء جميع أقسام الشريط الجانبي
  document.querySelectorAll('.sidebar-section').forEach(section => {
    section.style.display = 'none';
  });

  // عرض القسم المطلوب بناءً على نوع الموضوع
  const activeSection = document.getElementById(`${subjectType}-sidebar-controls`);
  if (activeSection) {
    activeSection.style.display = 'block';

    // ✅ إعادة تطبيق الترجمة بعد عرض القسم
    applyTranslations();
  }

  // تحميل المحتوى الخاص بالموضوع
  if (subjectType === 'animals') {
    await loadAnimalsGameContent();
  } else if (subjectType === 'fruits') {
    await loadFruitsGameContent();
  } else if (subjectType === 'vegetables') {
    await loadVegetablesGameContent();
  } else if (subjectType === 'human-body') {
    await loadHumanBodyGameContent();
  } else if (subjectType === 'professions') {
    await loadProfessionsGameContent();
  } else if (subjectType === 'tools') {
    await loadToolsGameContent();
  } else if (subjectType === 'alphabet-press') {
    await loadAlphabetPressGameContent();
  } else if (subjectType === 'memory-game') {
    await loadMemoryGameContent();
  }

  // إعادة تعيين اتجاه النص إذا تغيرت اللغة
  const lang = getCurrentLang();
  setDirection(lang);
}
