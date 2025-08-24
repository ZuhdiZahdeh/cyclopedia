// /src/core/audio-handler.js
// نسخة موحّدة ونهائية لإدارة الصوت عبر كل صفحات الموسوعة
// - تمنع تداخل الأصوات (مع تلاشي اختياري)
// - تدعم شكل الصوت (teacher/boy/girl/child) واللغة (ar/en/he)
// - تبني المسار القياسي لملفات الصوت مع بدائل تلقائية عند غياب الملف
// - تُبقي على التوافق مع playUrl و playFeedback المستعملة سابقًا

/* ---------------------------------- حالة عامة ---------------------------------- */
let currentAudio = null;          // العنصر الحالي HTMLAudioElement
let fadeTimer = null;             // مؤقت التلاشي
let __voiceShape = 'teacher';     // الشكل الافتراضي
let __lang = 'ar';                // اللغة الافتراضية
let audioUnlocked = false;        // Unlock لمحرّك WebAudio (لـ beep فقط)

/* ---------------------------------- إعداد عام ---------------------------------- */

/** نداء يُستحسن استدعاؤه مبكرًا بعد أول تفاعل للمستخدم (click/keydown) */
export function initAudio() {
  try {
    // unlock لمؤثرات WebAudio (لا يؤثر على تشغيل MP3 عبر <audio>)
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx && !audioUnlocked) {
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop();
      audioUnlocked = true;
    }
  } catch {}
}

/* --------------------------- إدارة اللغة/شكل الصوت --------------------------- */
export function setLanguage(lang) {
  const allowed = ['ar', 'en', 'he'];
  if (!allowed.includes(lang)) {
    console.warn('[audio-handler] Unknown language:', lang);
    return __lang;
  }
  __lang = lang;
  try { localStorage.setItem('lang', __lang); } catch {}
  return __lang;
}

export function getLanguage() {
  if (!__lang) {
    try { __lang = localStorage.getItem('lang') || 'ar'; } catch {}
  }
  return __lang;
}

export function setVoiceShape(shape) {
  const allowed = ['teacher', 'boy', 'girl', 'child'];
  if (!allowed.includes(shape)) {
    console.warn('[audio-handler] Unknown voice shape:', shape);
    return __voiceShape;
  }
  __voiceShape = shape;
  try { localStorage.setItem('voiceShape', __voiceShape); } catch {}
  return __voiceShape;
}

export function getVoiceShape() {
  if (!__voiceShape) {
    try { __voiceShape = localStorage.getItem('voiceShape') || 'teacher'; } catch {}
  }
  return __voiceShape;
}

/* ------------------------------- أدوات مساعدة ------------------------------- */

/** إيقاف الصوت الحالي مع تلاشي اختياري */
export function stopCurrentAudio(options = {}) {
  const { fadeMs = 120 } = options;
  if (!currentAudio) return;

  try {
    if (fadeTimer) clearInterval(fadeTimer);
    if (fadeMs > 0) {
      const steps = 10;
      const step = (currentAudio.volume || 1) / steps;
      let i = 0;
      fadeTimer = setInterval(() => {
        i++;
        try { currentAudio.volume = Math.max(0, (currentAudio.volume - step)); } catch {}
        if (i >= steps) {
          clearInterval(fadeTimer);
          try { currentAudio.pause(); currentAudio.currentTime = 0; } catch {}
          currentAudio = null;
        }
      }, Math.max(8, Math.floor(fadeMs / steps)));
      return;
    }
  } catch {}

  try { currentAudio.pause(); currentAudio.currentTime = 0; } catch {}
  currentAudio = null;
}

/** تشغيل أي URL بصيغة آمنة، مع خيارات */
export function playAudio(url, options = {}) {
  const { interrupt = true, volume = 1, fadeOutPrevMs = 100 } = options;

  if (!url) return;

  // أوقف السابق إذا طُلب
  if (interrupt && currentAudio) stopCurrentAudio({ fadeMs: fadeOutPrevMs });

  try {
    const a = new Audio(url);
    a.preload = 'auto';
    a.volume = Math.max(0, Math.min(1, volume));
    currentAudio = a;

    // تشغيل آمن
    const playPromise = a.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch((err) => {
        console.warn('[audio-handler] Playback blocked, will retry on user interaction:', err);
      });
    }

    // تنظيف عند الانتهاء
    a.onended = () => { if (currentAudio === a) currentAudio = null; };
    a.onerror = (e) => { console.warn('[audio-handler] HTMLAudio error for', url, e); };
  } catch (e) {
    console.warn('[audio-handler] Audio element init failed:', e);
  }
}

/** alias تاريخي: تُستخدم في بعض الصفحات */
export function playUrl(url, options = {}) {
  playAudio(url, options);
}

/* --------------------------- بناء مسار ملف الصوت --------------------------- */
/**
 * يُنشئ المسار القياسي لملفاتك:
 *   /audio/{lang}/{type}/{key}_{voiceShape}_{lang}.mp3
 * الأمثلة:
 *   audio/ar/tools/anvil_boy_ar.mp3
 *   audio/en/animals/lion_teacher_en.mp3
 */
export function resolveItemSound({ type, key, lang = getLanguage(), voice = getVoiceShape(), base = 'audio' }) {
  if (!type || !key) {
    console.warn('[audio-handler] resolveItemSound needs {type, key}');
    return null;
  }
  // تأمين العناصر
  const safe = (s) => String(s).trim().toLowerCase();
  const L = safe(lang);
  const V = safe(voice);
  const T = safe(type);
  const K = safe(key);
  return `/${base}/${L}/${T}/${K}_${V}_${L}.mp3`;
}

/**
 * تشغيل صوت عنصر وفق النمط القياسي، مع بدائل تلقائية عند غياب الملف:
 * يبدأ بالشكل الحالي ثم يجرب: teacher → boy → girl → child
 */
export async function playItemSound({ type, key, lang = getLanguage(), voice = getVoiceShape(), base = 'audio' } = {}) {
  if (!type || !key) return;

  // ترتيب البدائل بدون تكرار
  const pref = [voice, 'teacher', 'boy', 'girl', 'child']
    .map(v => v.toLowerCase())
    .filter((v, i, arr) => ['teacher','boy','girl','child'].includes(v) && arr.indexOf(v) === i);

  for (const v of pref) {
    const url = resolveItemSound({ type, key, lang, voice: v, base });
    // فحص سريع بعمل HEAD (غير ممكن دائمًا عبر CORS). بديل عملي: نحاول التشغيل،
    // وإن فشل التحميل نتابع للبديل التالي.
    const ok = await tryPlay(url);
    if (ok) return true;
  }

  console.warn('[audio-handler] No available voice file for', { type, key, lang });
  return false;
}

/** محاولة تشغيل فعليّة مع التقاط خطأ تحميل المصدر */
function tryPlay(url) {
  return new Promise((resolve) => {
    try {
      const a = new Audio();
      a.preload = 'auto';
      a.src = url;

      const onError = () => {
        cleanup();
        resolve(false);
      };
      const onCanPlay = () => {
        cleanup();
        playAudio(url); // تشغيل حقيقي عبر الممر القياسي
        resolve(true);
      };
      const cleanup = () => {
        a.removeEventListener('error', onError);
        a.removeEventListener('canplaythrough', onCanPlay);
        a.src = '';
      };

      a.addEventListener('error', onError, { once: true });
      a.addEventListener('canplaythrough', onCanPlay, { once: true });
      // بدء التحميل
      a.load();
    } catch (e) {
      console.warn('[audio-handler] tryPlay error for', url, e);
      resolve(false);
    }
  });
}

/* -------------------------------- مؤثرات صوتية ------------------------------- */
/** مؤثر “صحيح/خطأ” بسيط (ويبقى متوافقًا مع النسخة القديمة) */
export function playFeedback(type = 'correct', lang = 'ar') {
  // unlock عند الحاجة
  initAudio();

  const beep = (freq = 440, ms = 120) => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine'; o.frequency.value = freq;
      o.start();
      const t0 = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.2, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + (ms / 1000));
      o.stop(t0 + (ms / 1000) + 0.02);
    } catch {}
  };

  if (type === 'correct') beep(600, 120);
  else if (type === 'wrong') beep(220, 160);
  else beep(440, 100);
}

/* --------------------------------- أدوات إضافية --------------------------------- */

/** إرجاع العنصر الصوتي الحالي (للاختبارات/التصحيح) */
export function getCurrentAudio() { return currentAudio; }

/** تحميل مُسبق لقائمة أصوات (اختياري لتحسين الاستجابة) */
export function preloadSounds(urls = []) {
  urls.forEach((u) => { try { const a = new Audio(); a.src = u; a.preload = 'auto'; } catch {} });
}
