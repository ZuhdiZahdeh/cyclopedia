// src/subjects/human-body-game.js
import { makeSubjectGame } from './subject-game-factory.js';

const { loadContent } = makeSubjectGame({
  key: 'human-body',
  keyPlural: 'human-body', // يُستخدم في النشاط فقط
  container: '#human-body-game',
  imageDir: 'images/human-body',
  audioFolder: 'human-body',
  controlsGrid: '#human-body-sidebar-controls, #sidebar-section',
  selectors: {
    word: ['human-body-word','item-word','item-name'],
    image: ['human-body-image','item-image'],
    category: ['human-body-category','item-category'],
    description: ['human-body-description','item-description'],
    descriptionBox: ['human-body-description-box']
  },
  controls: {
    lang: ['game-lang-select-human-body','game-lang-select'],
    voice: ['voice-select-human-body','voice-select'],
    prev: ['prev-human-body-btn','prev-btn'],
    next: ['next-human-body-btn','next-btn'],
    play: ['play-sound-btn-human-body','listen','listen-btn'],
    toggleDesc: ['toggle-description-btn','toggle-description']
  },
  // نحاول عدّة مسارات شائعة
  collectionCandidates: [
    ['categories','human-body','items'],
    ['categories','body','items'],
    '/human-body', '/human_body', '/body'
  ]
});

export const loadHumanBodyGameContent = loadContent;
if (typeof window !== 'undefined') window.loadHumanBodyGameContent = loadContent;
