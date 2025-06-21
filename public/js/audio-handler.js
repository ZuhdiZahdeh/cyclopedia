let currentAudio = null;

export function playAudio(filePath) {
  stopCurrentAudio();

  currentAudio = new Audio(filePath);
  currentAudio.play().catch((err) => {
    console.warn("Audio playback failed:", err);
  });
}

export function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}
