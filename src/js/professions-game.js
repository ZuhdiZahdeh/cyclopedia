import { db } from './firebase-config.js';
import { getDocs, collection } from 'firebase/firestore';
import { setLanguage, getCurrentLang, setDirection, loadLanguage } from './lang-handler.js';
import { playAudio, stopCurrentAudio } from './audio-handler.js';
import { recordActivity } from './activity-handler.js';

let professions = [];
let currentProfessionIndex = 0;
let currentProfession = null;

export async function loadProfessionsGameContent() {
  const mainContent = document.querySelector('main.main-content');
  const response = await fetch('/html/professions.html');
  const html = await response.text();
  mainContent.innerHTML = html;

  const querySnapshot = await getDocs(collection(db, 'professions'));
  professions = querySnapshot.docs.map(doc => doc.data());

  showProfession(0);

  // ✅ الأحداث الجانبية
  document.getElementById('next-profession-btn')?.addEventListener('click', showNextProfession);
  document.getElementById('prev-profession-btn')?.addEventListener('click', showPreviousProfession);
  document.getElementById('play-sound-btn-profession')?.addEventListener('click', playCurrentProfessionAudio);

  document.getElementById('game-lang-select-profession')?.addEventListener('change', () => {
    const selectedLang = document.getElementById('game-lang-select-profession').value;
    setLanguage(selectedLang);
    showProfession(currentProfessionIndex);
  });

  document.getElementById('voice-select-profession')?.addEventListener('change', () => {
    showProfession(currentProfessionIndex);
  });

  document.getElementById('profession-name')?.addEventListener('click', playCurrentProfessionAudio);
  document.getElementById('profession-image')?.addEventListener('click', playCurrentProfessionAudio);

  document.getElementById('toggle-description-btn-profession')?.addEventListener('click', () => {
    const descEl = document.getElementById('profession-description');
    if (descEl) descEl.classList.toggle('hidden');
  });

  // سجل النشاط
  recordActivity('view_professions');
}

function showProfession(index) {
  if (index < 0 || index >= professions.length) return;

  currentProfessionIndex = index;
  currentProfession = professions[index];

  const lang = getCurrentLang();
  const nameEl = document.getElementById('profession-name');
  const imgEl = document.getElementById('profession-image');
  const descEl = document.getElementById('profession-description');

  if (nameEl) {
    nameEl.textContent = currentProfession.name?.[lang] || '';
    nameEl.classList.add('clickable-text'); // لتفعيل المؤشر
  }
  if (imgEl) {
    imgEl.src = currentProfession.image_path || '';
    imgEl.classList.add('clickable-image'); // لتفعيل المؤشر
  }
  if (descEl) descEl.textContent = currentProfession.description?.[lang] || '';
}

function showNextProfession() {
  const nextIndex = (currentProfessionIndex + 1) % professions.length;
  showProfession(nextIndex);
}

function showPreviousProfession() {
  const prevIndex = (currentProfessionIndex - 1 + professions.length) % professions.length;
  showProfession(prevIndex);
}

function playCurrentProfessionAudio() {
  if (!currentProfession) return;

  const voiceType = document.getElementById('voice-select-profession')?.value || 'boy';
  const lang = getCurrentLang();
  const soundPath = currentProfession.sound?.[lang]?.[voiceType];

  if (soundPath) playAudio(soundPath);
}


// التصدير النهائي
export {
  showNextProfession,
  showPreviousProfession,
  playCurrentProfessionAudio,
};
