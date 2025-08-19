// /src/core/audio-handler.js
// نسخة موحّدة مع واجهة توافقية لـ family-groups-game

let currentAudio = null;

/** يشغّل أي مصدر صوتي (URL) */
export function playAudio(filePath) {
  stopCurrentAudio();
  try {
    currentAudio = new Audio(filePath);
    currentAudio.play().catch((err) => {
      console.warn("Audio playback failed:", err);
    });
  } catch (e) {
    console.warn("Audio element init failed:", e);
  }
}

/** يوقف أي صوت جارٍ */
export function stopCurrentAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    currentAudio = null;
  }
}

/* ============== واجهة توافقية ==============
   family-groups-game.js يستدعي playUrl و playFeedback
   نوحّد الأسماء هنا بدون تغيير منطق بقية الصفحات.
*/

/** alias: playUrl(url) → يشغّل الصوت مثل playAudio */
export function playUrl(url) {
  playAudio(url);
}

/**
 * تشغيل مؤثرات صحيحة/خاطئة (اختياري).
 * يمكنك لاحقًا ربط ملفات حقيقية للمؤثرات إن رغبت.
 */
export function playFeedback(type = "correct", lang = "ar") {
  // مؤثر بسيط بالمُولِّد كخطة بديلة
  const beep = (freq = 440, ms = 120) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = "sine"; o.frequency.value = freq; o.start();
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ms / 1000);
      o.stop(ctx.currentTime + ms / 1000 + 0.02);
    } catch {}
  };

  if (type === "correct") beep(600, 120);
  else if (type === "wrong") beep(220, 160);
  else beep(440, 100);
}
