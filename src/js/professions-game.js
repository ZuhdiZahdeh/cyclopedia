import { db } from './firebase-config.js';
import { doc, getDocs, collection } from 'firebase/firestore';
import { currentLang, setDirection } from './lang-handler.js';
import { playAudio, stopCurrentAudio } from './audio-handler.js';
import { recordActivity } from './activity-handler.js';

let professions = [];
let currentProfessionIndex = 0;
let currentProfession = null;

// تحميل بيانات المهن من قاعدة البيانات
async function loadProfessionsGameContent() {
  const mainContent = document.querySelector('main.main-content');
  const response = await fetch('/html/professions.html');
  const html = await response.text();
  mainContent.innerHTML = html;

  // تحميل البيانات من Firestore
  const querySnapshot = await getDocs(collection(db, 'professions'));
  professions = querySnapshot.docs.map(doc => doc.data());

  // عرض أول مهنة
  showProfession(0);

  // ربط الأحداث بالأزرار في القسم الجانبي
  document.getElementById('next-profession-btn')?.addEventListener('click', showNextProfession);
  document.getElementById('prev-profession-btn')?.addEventListener('click', showPreviousProfession);
  document.getElementById('play-sound-btn-profession')?.addEventListener('click', playCurrentProfessionAudio);

  document.getElementById('game-lang-select-profession')?.addEventListener('change', () => {
    currentLang = document.getElementById('game-lang-select-profession').value;
    setDirection(currentLang);
    showProfession(currentProfessionIndex);
  });

  // الضغط على النص أو الصورة لتشغيل الصوت
  document.getElementById('profession-name')?.addEventListener('click', playCurrentProfessionAudio);
  document.getElementById('profession-image')?.addEventListener('click', playCurrentProfessionAudio);

  // زر الوصف
  document.getElementById('toggle-description-btn-profession')?.addEventListener('click', () => {
    const descEl = document.getElementById('profession-description');
    if (descEl) descEl.classList.toggle('hidden');
  });

  // تسجيل النشاط
  recordActivity('view_professions');
}

// عرض مهنة حسب الفهرس
function showProfession(index) {
  if (index < 0 || index >= professions.length) return;

  currentProfessionIndex = index;
  currentProfession = professions[index];

  const lang = currentLang;
  const nameEl = document.getElementById('profession-name');
  const imgEl = document.getElementById('profession-image');
  const descEl = document.getElementById('profession-description');

  if (nameEl) nameEl.textContent = currentProfession.name?.[lang] || '';
  if (imgEl) imgEl.src = currentProfession.image_path || '';
  if (descEl) descEl.textContent = currentProfession.description?.[lang] || '';
}

// التنقل إلى المهنة التالية
function showNextProfession() {
  const nextIndex = (currentProfessionIndex + 1) % professions.length;
  showProfession(nextIndex);
}

// التنقل إلى المهنة السابقة
function showPreviousProfession() {
  const prevIndex = (currentProfessionIndex - 1 + professions.length) % professions.length;
  showProfession(prevIndex);
}

// تشغيل صوت المهنة
function playCurrentProfessionAudio() {
  if (!currentProfession) return;

  const voiceType = document.getElementById('voice-select-profession')?.value || 'boy';
  const lang = currentLang;
  const soundPath = currentProfession.sound?.[lang]?.[voiceType];

  if (soundPath) playAudio(soundPath);
}

// التصدير النهائي
export {
  loadProfessionsGameContent,
  showNextProfession,
  showPreviousProfession,
  playCurrentProfessionAudio,
};
