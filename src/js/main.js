// main.js — متوافق مع Vite + Firebase SDK v9

import { loadHumanBodyGameContent } from "./human-body-game.js";
import { loadAnimalsGameContent, showNextAnimal, showPreviousAnimal, playCurrentAnimalAudio } from "./animals-game.js"; // 👈 تم إضافة استيراد دوال الحيوانات
// استورد الدوال الأخرى للألعاب الأخرى هنا (فواكه، خضروات، إلخ)
import { applyTranslations, setDirection, currentLang, loadLanguage } from "./lang-handler.js"; // 👈 تأكد من استيراد هذه الدوال

window.addEventListener("DOMContentLoaded", async () => {
  const lang = localStorage.getItem("language") || "ar"; // افتراضي AR
  document.documentElement.lang = lang;
  document.body.setAttribute("dir", lang === "ar" || lang === "he" ? "rtl" : "ltr");

  await loadLanguage(lang); // تحميل الترجمات عند بدء التطبيق
  applyTranslations(); // تطبيق الترجمات الأولية

  handleAuthUI(); // لإظهار أزرار الدخول والخروج

  // 🌍 إدارة توجيه الصفحة بناءً على URL
  // هذا يضمن تحميل المحتوى الصحيح عند الوصول مباشرة عبر URL
  const currentPath = window.location.pathname;
  if (currentPath.includes('/human-body')) {
    loadHumanBodyPage();
  } else if (currentPath.includes('/animals')) {
    loadAnimalsPage();
  } else if (currentPath.includes('/fruits')) {
    loadFruitsPage();
  } else if (currentPath.includes('/vegetables')) {
    loadVegetablesPage();
  } else {
    showHomePage(); // الافتراضي
  }
});

// ✅ هذه الدالة لإدارة واجهة الدخول والخروج
function handleAuthUI() {
  const isLoggedIn = localStorage.getItem("user");

  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!loginBtn || !registerBtn || !logoutBtn) return;

  if (isLoggedIn) {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "inline";
  } else {
    loginBtn.style.display = "inline";
    registerBtn.style.display = "inline";
    logoutBtn.style.display = "none";
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    location.reload();
  });
}

// 🌐 وظائف التنقل (لربطها بـ index.html)
function hideAllSidebarSections() {
  document.querySelectorAll('.sidebar-section').forEach(section => {
    section.style.display = 'none';
  });
}

function clearMainContent() {
  const mainContentArea = document.querySelector("main.main-content");
  if (mainContentArea) {
    mainContentArea.innerHTML = '';
  }
}

// 🏠 الصفحة الرئيسية (يمكن أن تحتوي على محتوى ثابت أو ديناميكي)
window.showHomePage = () => {
  history.pushState(null, '', '/');
  hideAllSidebarSections();
  clearMainContent();
  // يمكنك إضافة محتوى الصفحة الرئيسية هنا
  const mainContentArea = document.querySelector("main.main-content");
  if (mainContentArea) {
    mainContentArea.innerHTML = `
      <div class="welcome-box">
        <h1 data-i18n="welcome_title">مرحبًا بك في الموسوعة التفاعلية للأطفال!</h1>
        <p data-i18n="welcome_text">
          استكشف عالمًا من المعرفة والمرح مع ألعابنا التفاعلية.
          تعلم عن الحيوانات، الفواكه، الخضروات، جسم الإنسان، وتدرب على الحروف الأبجدية.
        </p>
        <div class="features-list">
          <h2 data-i18n="features_title">ميزات التطبيق:</h2>
          <ul>
            <li data-i18n="feature_1">ألعاب تعليمية ممتعة وجذابة.</li>
            <li data-i18n="feature_2">تعلم اللغات العربية والإنجليزية والعبرية.</li>
            <li data-i18n="feature_3">محتوى غني بالصور والأصوات.</li>
            <li data-i18n="feature_4">تتبع التقدم والنقاط.</li>
          </ul>
        </div>
        <img src="/images/main-page-hero.png" alt="Children learning" class="hero-image">
      </div>
    `;
    applyTranslations(); // لتطبيق الترجمات على المحتوى المحقون
  }
};


// 🐾 وظيفة تحميل صفحة الحيوانات
window.loadAnimalsPage = async () => {
  history.pushState(null, '', '/animals');
  hideAllSidebarSections();
  clearMainContent();
  document.getElementById("animal-sidebar-controls").style.display = "block"; // إظهار عناصر تحكم الحيوانات
  setupSidebarControls(
    'game-lang-select-animal', 
    'voice-select-animal', 
    'play-sound-btn-animal', 
    'prev-animal-btn', 
    'next-animal-btn',
    loadAnimalsGameContent, // دالة تحميل محتوى اللعبة
    playCurrentAnimalAudio, // دالة تشغيل الصوت
    showPreviousAnimal, // دالة السابق
    showNextAnimal // دالة التالي
  );
  await loadAnimalsGameContent(); // تحميل محتوى لعبة الحيوانات
  applyTranslations(); // تطبيق الترجمات بعد تحميل المحتوى
  setDirection(currentLang); // ضبط الاتجاه
};

// 🧠 وظيفة تحميل صفحة جسم الإنسان
window.loadHumanBodyPage = async () => {
  history.pushState(null, '', '/human-body');
  hideAllSidebarSections();
  clearMainContent();
  document.getElementById("human-body-sidebar-controls").style.display = "block"; // إظهار عناصر تحكم جسم الإنسان
  setupSidebarControls(
    'game-lang-select-human-body', 
    'voice-select-human-body', 
    'play-sound-btn-human-body', 
    'prev-human-body-btn', 
    'next-human-body-btn',
    loadHumanBodyGameContent, // دالة تحميل محتوى اللعبة
    playCurrentHumanBodyAudio, // دالة تشغيل الصوت
    showPreviousHumanBodyPart, // دالة السابق
    showNextHumanBodyPart // دالة التالي
  );
  await loadHumanBodyGameContent(); // تحميل محتوى لعبة جسم الإنسان
  applyTranslations();
  setDirection(currentLang);
};

// 🍎 وظيفة تحميل صفحة الفواكه (مثال - تحتاج إلى ملف fruit-game.js ودواله)
window.loadFruitsPage = async () => {
  history.pushState(null, '', '/fruits');
  hideAllSidebarSections();
  clearMainContent();
  document.getElementById("fruit-sidebar-controls").style.display = "block";
  // تأكد من استيراد الدوال الصحيحة من fruit-game.js
  // setupSidebarControls(
  //   'game-lang-select-fruit', 'voice-select-fruit', 'play-sound-btn-fruit',
  //   'prev-fruit-btn', 'next-fruit-btn', loadFruitsGameContent, 
  //   playCurrentFruitAudio, showPreviousFruit, showNextFruit
  // );
  // await loadFruitsGameContent();
  const mainContentArea = document.querySelector("main.main-content");
  if (mainContentArea) {
    mainContentArea.innerHTML = `<div class="game-box"><h2 data-i18n="fruits_coming_soon">صفحة الفواكه قريبا!</h2></div>`;
    applyTranslations();
  }
};

// 🥦 وظيفة تحميل صفحة الخضروات (مثال - تحتاج إلى ملف vegetables-game.js ودواله)
window.loadVegetablesPage = async () => {
  history.pushState(null, '', '/vegetables');
  hideAllSidebarSections();
  clearMainContent();
  document.getElementById("vegetable-sidebar-controls").style.display = "block";
  // تأكد من استيراد الدوال الصحيحة من vegetables-game.js
  // setupSidebarControls(
  //   'game-lang-select-vegetable', 'voice-select-vegetable', 'play-sound-btn-vegetable',
  //   'prev-vegetable-btn', 'next-vegetable-btn', loadVegetablesGameContent, 
  //   playCurrentVegetableAudio, showPreviousVegetable, showNextVegetable
  // );
  // await loadVegetablesGameContent();
  const mainContentArea = document.querySelector("main.main-content");
  if (mainContentArea) {
    mainContentArea.innerHTML = `<div class="game-box"><h2 data-i18n="vegetables_coming_soon">صفحة الخضروات قريبا!</h2></div>`;
    applyTranslations();
  }
};


// 🅰️ وظيفة تحميل صفحة لعبة الحروف (مثال)
window.loadAlphabetPressPage = async () => {
  history.pushState(null, '', '/alphabet-press');
  hideAllSidebarSections();
  clearMainContent();
  document.getElementById("alphabet-press-sidebar-controls").style.display = "block";
  // تحتاج إلى استيراد دوال لعبة الحروف من alphabet-press-game.js
  // setupAlphabetPressControls(); // دالة خاصة بلعبة الحروف
  // await loadAlphabetPressGameContent();
  const mainContentArea = document.querySelector("main.main-content");
  if (mainContentArea) {
    mainContentArea.innerHTML = `<div class="game-box"><h2 data-i18n="alphabet_coming_soon">لعبة الحروف قريبا!</h2></div>`;
    applyTranslations();
  }
};

// 🃏 وظيفة تحميل صفحة لعبة الذاكرة (مثال)
window.loadMemoryGamePage = async () => {
  history.pushState(null, '', '/memory-game');
  hideAllSidebarSections();
  clearMainContent();
  document.getElementById("memory-game-sidebar-controls").style.display = "block";
  // تحتاج إلى استيراد دوال لعبة الذاكرة من memory-game.js
  // setupMemoryGameControls(); // دالة خاصة بلعبة الذاكرة
  // await loadMemoryGameContent();
  const mainContentArea = document.querySelector("main.main-content");
  if (mainContentArea) {
    mainContentArea.innerHTML = `<div class="game-box"><h2 data-i18n="memory_game_coming_soon">لعبة الذاكرة قريبا!</h2></div>`;
    applyTranslations();
  }
};

// ⚙️ دالة مساعدة لإعداد عناصر التحكم في الشريط الجانبي لأي لعبة
// 🔴 تم تعديل هذه الدالة لتستخدم الدوال الممررة بدلاً من الاعتماد على الأسماء الثابتة
function setupSidebarControls(
  langSelectId, voiceSelectId, playSoundBtnId, prevBtnId, nextBtnId,
  loadContentFunc, playAudioFunc, showPrevFunc, showNextFunc
) {
  const langSelect = document.getElementById(langSelectId);
  const voiceSelect = document.getElementById(voiceSelectId);
  const playSoundBtn = document.getElementById(playSoundBtnId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);

  // تهيئة قائمة اللغات (إذا لم تكن مهيأة بالفعل)
  if (langSelect && langSelect.options.length === 0) {
    ['ar', 'en', 'he'].forEach(langCode => {
      const option = document.createElement('option');
      option.value = langCode;
      option.textContent = { 'ar': 'العربية', 'en': 'English', 'he': 'עברית' }[langCode];
      langSelect.appendChild(option);
    });
    langSelect.value = currentLang; // تعيين اللغة الحالية
  } else if (langSelect) {
      langSelect.value = currentLang;
  }

  // تهيئة قائمة الأصوات (إذا لم تكن مهيأة بالفعل)
  if (voiceSelect && voiceSelect.options.length === 0) {
      ['teacher', 'boy', 'girl', 'child'].forEach(voiceType => {
          const option = document.createElement('option');
          option.value = voiceType;
          option.textContent = { 'teacher': 'المعلم', 'boy': 'صوت ولد', 'girl': 'صوت بنت', 'child': 'صوت طفل' }[voiceType];
          voiceSelect.appendChild(option);
      });
      voiceSelect.value = 'teacher'; // الافتراضي
  }

  // مستمعي الأحداث لأزرار وعناصر التحكم
  if (langSelect) {
    langSelect.onchange = async () => {
      const newLang = langSelect.value;
      await loadLanguage(newLang);
      applyTranslations();
      setDirection(newLang);
      await loadContentFunc(); // إعادة تحميل المحتوى باللغة الجديدة
    };
  }

  if (playSoundBtn) playSoundBtn.onclick = () => {
    playAudioFunc();
  };

  if (prevBtn) prevBtn.onclick = () => {
    showPrevFunc();
  };

  if (nextBtn) nextBtn.onclick = () => {
    showNextFunc();
  };
}
