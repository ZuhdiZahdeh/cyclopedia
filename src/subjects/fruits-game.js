// src/subjects/fruits-game.js
import { makeSubjectGame } from './subject-game-factory.js';

const { loadContent } = makeSubjectGame({
  key: 'fruit',
  keyPlural: 'fruits',
  container: '#fruits-game',
  imageDir: 'images/fruits',
  audioFolder: 'fruits',
  controlsGrid: '#fruit-sidebar-controls, #sidebar-section',
  selectors: {
    word: ['fruit-word','item-word','item-name'],
    image: ['fruit-image','item-image'],
    category: ['fruit-category','item-category'],
    description: ['fruit-description','item-description'],
    descriptionBox: ['fruit-description-box']
  },
  controls: {
    lang: ['game-lang-select-fruit','game-lang-select'],
    voice: ['voice-select-fruit','voice-select'],
    prev: ['prev-fruit-btn','prev-btn'],
    next: ['next-fruit-btn','next-btn'],
    play: ['play-sound-btn-fruit','listen','listen-btn'],
    toggleDesc: ['toggle-description-btn','toggle-description']
  },
  collectionCandidates: [
    ['categories','fruits','items'],
    '/fruits'
  ]
});

export const loadFruitsGameContent = loadContent;
if (typeof window !== 'undefined') window.loadFruitsGameContent = loadContent;
