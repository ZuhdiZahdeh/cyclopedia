// src/subjects/alphabet-press-game.js
import { db } from '../js/firebase-config.js';
import { collection, getDocs, query } from 'firebase/firestore';
import { getCurrentLang, loadLanguage, applyTranslations, setDirection } from '../core/lang-handler.js';
import { playAudio, stopCurrentAudio } from '../core/audio-handler.js';
import { recordActivity } from '../core/activity-handler.js';

export async function loadAlphabetPressGameContent() {
  const main = document.querySelector('main.main-content');
  if (main) main.innerHTML = `<section><h2>🔤 لعبة الحروف — (نسخة مبدئية)</h2></section>`;
  console.log('[alphabet-press] stub loaded');
}
