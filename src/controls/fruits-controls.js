// 📁 src/controls/fruits-controls.js
import { playAudio } from "../core/audio-handler.js";
import { getCurrentLang, loadLanguage, applyTranslations } from "../core/lang-handler.js";
import { getCurrentFruit, showNextFruit, showPreviousFruit, loadFruitsGameContent } from "../subjects/fruits.js";
import { recordActivity } from "../core/activity-handler.js";

export function setupFruitControls() {
  const langSelect = document.getElementById("game-lang-select-fruit");
  const voiceSelect = document.getElementById("voice-select-fruit");
  const playBtn = document.getElementById("play-sound-btn-fruit");
  const nextBtn = document.getElementById("next-fruit-btn");
  const prevBtn = document.getElementById("prev-fruit-btn");

  if (langSelect) {
    langSelect.value = getCurrentLang();
    langSelect.onchange = async () => {
      await loadLanguage(langSelect.value);
      await loadFruitsGameContent();
      applyTranslations();
    };
  }

  if (voiceSelect) {
    voiceSelect.value = "teacher";
  }

  if (playBtn) {
    playBtn.onclick = () => {
      const fruit = getCurrentFruit();
      const voice = voiceSelect.value;
      const lang = langSelect.value;
      const voiceKey = `${voice}_${lang}`;
      let file = fruit?.voices?.[voiceKey] || `${fruit.sound_base}_${voice}_${lang}.mp3`;
      let path = `/audio/${lang}/fruits/${file}`;

      playAudio(path);
      recordActivity(JSON.parse(localStorage.getItem("user")), "fruits");
    };
  }

  if (nextBtn) nextBtn.onclick = showNextFruit;
  if (prevBtn) prevBtn.onclick = showPreviousFruit;
}
