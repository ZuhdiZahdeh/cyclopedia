// =========================
// main.js — ״§„†״³״®״© ״§„…†‚״­״© (״®״§״± B: ״­‚† ״¯†״§…ƒ)
// =========================

// „״÷״© ״§„ˆ״§״¬‡״©
import { getCurrentLang, loadLanguage, applyTranslations, onLangChange } from '../core/lang-handler.js';

// ״×‡״¦״© ״§„״³״§״¯״¨״§״± ״§„״®״§״µ ״¨ƒ„ …ˆ״¶ˆ״¹ (״×״×ˆ„‘‰ ״­‚† …„ ״§„״×״­ƒ… ״§„…†״§״³״¨)
import { initializeSubjectControls } from '../core/initializeSubjectControls.js';

// ״£„״¹״§״¨/״µ״­״§״× ״£״®״±‰ (״×״¨‚‰ ƒ…״§ ‡ ״¨״§״³״×״±״§״¯ ״«״§״¨״×)
import { loadAnimalsGameContent }        from "../subjects/animals-game.js";
import { loadFruitsGameContent }         from "../subjects/fruits-game.js";
import { loadVegetablesGameContent }     from "../subjects/vegetables-game.js";
import { loadProfessionsGameContent }    from "../subjects/professions-game.js";
import { loadToolsGameContent }          from "../subjects/tools-game.js";
import { loadAlphabetActivityContent }   from "../activities/alphabet-activity.js";
import { loadMemoryGameContent }         from "../subjects/memory-game.js";
import { loadToolsMatchGameContent }     from "../subjects/tools-match-game.js";
import { loadHumanBodyGameContent }      from "../subjects/human-body-game.js";

// נ” Firebase Auth
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

/* ------------------------------------------------------------------
   ״×״­…„ CSS ״§„״£״³״§״³ + CSS ״§„״®״§״µ ״¨ƒ„ …ˆ״¶ˆ״¹ ״×„‚״§״¦‹״§
-------------------------------------------------------------------*/
const BASE_CSS = [
  '/css/colors.css',
  '/css/fonts.css',
  '/css/shared-utilities.css',
  '/css/forms.css',
  '/css/common-components-subjects.css',
  '/css/style.css'
];

const SUBJECT_CSS = {
  animal:         '/css/animals.css',
  fruit:          '/css/fruits.css',
  vegetable:      '/css/vegetables.css',
  profession:     '/css/professions.css',
  tools:          '/css/tools.css',
  'human-body':   '/css/human-body.css',
  'memory-game':  '/css/memory-game.css',
  'tools-match':  '/css/tools-match.css',
  'family-groups':'/css/family-groups-game.css', // ״×״£ƒ״¯ ״×״­…„ CSS ״§„״®״§״µ ״¨״§„„״¹״¨״©
};

function ensureCss(paths = []) {
  const head = document.head;
  const existing = new Set(
    [...document.querySelectorAll('link[rel="stylesheet"]')]
      .map(l => {
        try { return new URL(l.getAttribute('href'), location.href).pathname; }
        catch { return l.getAttribute('href') || ''; }
      })
  );
  let appended = false;
  for (const href of paths) {
    if (!existing.has(href)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      head.appendChild(link);
      appended = true;
    }
  }
  if (appended) requestAnimationFrame(() => {});
}
// ״­…‘„ ״§„״£״³״§״³ …״±״© ˆ״§״­״¯״©
ensureCss(BASE_CSS);

/* ------------------------- i18n „״¹†״§״µ״± ״§„״×״­ƒ… ------------------------- */
function rebuildVoiceOptions(sel) {
  if (!sel) return;
  const keep = sel.value || 'boy';
  const options = [
    ['teacher', 'teacher_voice'],
    ['boy',     'boy_voice'],
    ['girl',    'girl_voice'],
    ['child',   'child_voice']
  ];
  sel.innerHTML = options
    .map(([val, key]) => `<option value="${val}" data-i18n="${key}"></option>`)
    .join('');
  sel.value = keep;
}

function i18nNormalizeControls() {
  // ״£״²״±״§״± ״§„״³״§״¨‚/״§„״×״§„ ״§„״´״§״¦״¹״© „ƒ„ ״§„״µ״­״§״×
  const prevIds = ['prev-animal-btn','prev-fruit-btn','prev-vegetable-btn','prev-human-body-btn','prev-profession-btn','prev-tools-btn','prev-btn'];
  const nextIds = ['next-animal-btn','next-fruit-btn','next-vegetable-btn','next-human-body-btn','next-profession-btn','next-tools-btn','next-btn'];

  prevIds.forEach(id => { const el = document.getElementById(id); if (el) el.setAttribute('data-i18n','previous'); });
  nextIds.forEach(id => { const el = document.getElementById(id); if (el) el.setAttribute('data-i18n','next'); });

  // ״²״± ״¹״±״¶ ״§„ˆ״µ ״¥† ˆ״¬״¯
  document
    .querySelectorAll('[id^="toggle-description-btn"]')
    .forEach(el => el.setAttribute('data-i18n','Description'));

  // …„״µ‚״§״× ״§„„״÷״©/״§„״µˆ״× + ״®״§״±״§״× ״§„״µˆ״×
  document.querySelectorAll('select[id^="voice-select"]').forEach(sel => {
    const lab = document.querySelector(`label[for="${sel.id}"]`);
    if (lab) lab.setAttribute('data-i18n','Voice');
    rebuildVoiceOptions(sel);
  });
  document.querySelectorAll('select[id^="game-lang-select"]').forEach(sel => {
    const lab = document.querySelector(`label[for="${sel.id}"]`);
    if (lab) lab.setAttribute('data-i18n','Language');
  });

  // ״¹†ˆ״§† ֲ«״­״³״§״¨ƒֲ»
  const accTitleInner = document.querySelector('.static-section .sidebar-title [data-i18n]');
  if (accTitleInner) {
    accTitleInner.setAttribute('data-i18n','your_account');
  } else {
    const accTitle = document.querySelector('.static-section .sidebar-title');
    if (accTitle) accTitle.setAttribute('data-i18n','your_account');
  }

  try { applyTranslations(); } catch {}
}

/* ------------------------- ״£״¯ˆ״§״× ˆ״§״¬‡״© ״¨״³״·״© „„״³״§״¯״¨״§״± ------------------------- */
// „״§ ״×״±‘״÷ ״§„‚״³… ״§„״«״§״¨״× (…״«„ ֲ«״­״³״§״¨ƒֲ»)
function hideAllControls() {
  document
    .querySelectorAll("#sidebar-section .sidebar-section:not(.static-section)")
    .forEach((sec) => {
      sec.style.display = "none";
      sec.innerHTML = "";
    });
  const aside = document.getElementById("sidebar-section");
  if (aside) aside.style.display = "";
}

/* ------------------------- ״­״³״§״¨ ״§„…״³״×״®״¯…: ˆ״§״¬‡״© ״§„״£״²״±״§״± ------------------------- */
function updateAccountActionsUI(user) {
  const loggedIn = !!user;
  const setHidden = (id, hidden) => {
    const el = document.getElementById(id);
    if (el) el.hidden = hidden;
  };
  setHidden('loginBtn',       loggedIn);
  setHidden('registerBtn',    loggedIn);
  setHidden('my-profile-btn', !loggedIn);
  setHidden('my-report-btn',  !loggedIn);
  setHidden('logoutBtn',      !loggedIn);
}

async function handleLogout() {
  try {
    const auth = getAuth();
    await signOut(auth);
  } catch (e) {
    console.error('Signout error:', e);
  }
}
window.handleLogout = handleLogout;

/* ------------------------- ״×״±״×״¨ ֲ«״­״³״§״¨ƒֲ» ״×״­״× ״§„״×״­ƒ‘… ״§„״¸״§‡״± ------------------------- */
function getActiveControlsSection() {
  const aside = document.getElementById('sidebar-section');
  if (!aside) return null;
  const candidates = Array
    .from(aside.querySelectorAll('.sidebar-section:not(.static-section)'))
    .filter(sec => getComputedStyle(sec).display !== 'none' && sec.innerHTML.trim() !== '');
  return candidates.length ? candidates[candidates.length - 1] : null;
}

function placeAccountSectionBelowActiveControls() {
  const aside   = document.getElementById('sidebar-section');
  const account = aside ? aside.querySelector('.sidebar-section.static-section') : null;
  if (!aside || !account) return;
  const active = getActiveControlsSection();
  if (active) {
    active.insertAdjacentElement('afterend', account);
  } else {
    aside.appendChild(account);
  }
}
window.placeAccountSectionBelowActiveControls = placeAccountSectionBelowActiveControls;

let _sidebarObserver;
function initSidebarObserver() {
  const aside = document.getElementById('sidebar-section');
  if (!aside || _sidebarObserver) return;

  let scheduled = false;
  _sidebarObserver = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      placeAccountSectionBelowActiveControls();
      scheduled = false;
    });
  });

  _sidebarObserver.observe(aside, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'hidden', 'class']
  });
}

/* ------------------------- …״­…„ ״µ״­״§״× ״¹״§… (…״­״µ‘†) ------------------------- */
const FRAGMENT_SELECTORS = [
  "#page-content",
  ".subject-page",
  "#fruits-game",
  "main .main-content",
  "main",
  "body"
];

// ״¥״²״§„״© ״¬…״¹ ˆ״³ˆ… <script> …† HTML ״§„״¬״²״¦ (״­…״§״© …† ״£״®״·״§״¡ MIME)
function stripScripts(html) {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('script').forEach(s => s.remove());
    return doc.body.innerHTML || html;
  } catch {
    return html.replace(/<script[\s\S]*?<\/script>/gi, '');
  }
}

async function loadPage(htmlPath, moduleLoader, subjectType) {
  const mainContent = document.getElementById('app-main') || document.querySelector('main.main-content');
  try {
    // CSS ״§„…ˆ״¶ˆ״¹ (״¥† ˆ״¬״¯)
    if (subjectType && SUBJECT_CSS[subjectType]) {
      ensureCss(['/css/common-components-subjects.css', SUBJECT_CSS[subjectType]]);
    }

    hideAllControls();

    const res = await fetch(htmlPath, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`״´„ ״×״­…„ ״§„״µ״­״©: ${htmlPath} (status ${res.status})`);
    let html = await res.text();

    // „ˆ ״±״¬״¹״× ˆ״«‚״© ƒ״§…„״© ״¨״§„״®״·״£
    if (/<\!doctype html>|<html|<header[^>]+top-navbar/i.test(html)) {
      console.warn(`[loader] "${htmlPath}" ״£״¹״§״¯ ˆ״«‚״© ƒ״§…„״© (״÷״§„״¨‹״§ index.html). ״³״£״­״§ˆ„ ״§״³״×״®״±״§״¬ ״¬״²״¡ ״§„…״­״×ˆ‰ ‚״·.`);
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const candidate = FRAGMENT_SELECTORS.map(sel => doc.querySelector(sel)).find(Boolean);
      html = candidate ? candidate.innerHTML : '<p>״×״¹״°‘״± ״×״­…„ ״§„״µ״­״©.</p>';
    }

    // נ”’ ״×†״¸ ״£ <script> ״¯״§״®„ ״§„״¬״²״¦
    mainContent.innerHTML = stripScripts(html);

    // ״×״±״¬…״§״× ˆ״±״© „…״­״×ˆ‰ ״§„״µ״­״© ״§„…״­‚ˆ†
    try { await applyTranslations(); } catch {}

    // ״×‡״¦״© …״¬…ˆ״¹״© ״§„״×״­ƒ… „„…ˆ״¶ˆ״¹ (״¥† ˆ״¬״¯)״ ״«… ״¶״¹ ֲ«״­״³״§״¨ƒֲ» ״×״­״×‡״§ + ״·״¨‘‚ i18n „״×„ƒ ״§„״¹†״§״µ״±
    if (subjectType) initializeSubjectControls(subjectType);
    i18nNormalizeControls();

    // ††״×״¸״± ״±… „״¶…״§† ״§ƒ״×…״§„ ״­‚† ״¹†״§״µ״± ״§„״×״­ƒ… ״«… †״±״×‘״¨ ֲ«״­״³״§״¨ƒֲ»
    requestAnimationFrame(() => {
      placeAccountSectionBelowActiveControls();
      initSidebarObserver(); // …״±‘״© ˆ״§״­״¯״©
    });

    // ״×״´״÷„ …†״·‚ ״§„״µ״­״©/״§„„״¹״¨״© ״¥† ˆ״¬״¯
    if (typeof moduleLoader === 'function') {
      await moduleLoader();
    }

    if (import.meta.env.DEV) if (import.meta.env.DEV) console.log(`ג… ״×… ״×״­…„ ״§„״µ״­״©: ${htmlPath}`);
  } catch (err) {
    console.error(`ג ״®״·״£  ״×״­…„ ״§„״µ״­״©: ${htmlPath}`, err);
    if (mainContent) {
      mainContent.innerHTML = `<div class="error-box">تعذر تحميل المحتوى المطلوب.</div>`;
    }
  }
}

onLangChange(() => {
  i18nNormalizeControls();
});

/* ------------------------- ״±״¨״· ״§„״¯ˆ״§„ ״¨†״§״°״© ״§„…״×״µ״­ ------------------------- */
window.showHomePage = () => {
  const main = document.getElementById('app-main') || document.querySelector('main.main-content');
  main.innerHTML = `
    <section id="welcome-message">
      <h1 data-i18n="welcome_title"></h1>
      <p data-i18n="welcome_tagline"></p>
    </section>
  `;
  hideAllControls();
  requestAnimationFrame(() => {
    placeAccountSectionBelowActiveControls();
    initSidebarObserver();
  });
};

// ״µ״­״§״× ״§„…ˆ״§״¶״¹ (״×״¨‚‰ ƒ…״§ ‡)
window.loadAnimalsPage        = () => loadPage("/html/animals.html",        loadAnimalsGameContent,       "animal");
window.loadFruitsPage         = () => loadPage("/html/fruits.html",         loadFruitsGameContent,        "fruit");
window.loadVegetablesPage     = () => loadPage("/html/vegetables.html",     loadVegetablesGameContent,    "vegetable");
window.loadHumanBodyPage      = () => loadPage("/html/human-body.html",     loadHumanBodyGameContent,     "human-body");
window.loadProfessionsPage    = () => loadPage("/html/professions.html",    loadProfessionsGameContent,   "profession");
window.loadToolsPage          = () => loadPage("/html/tools.html",          loadToolsGameContent,         "tools");

// ג… ֲ«״£† ״¹״§״¦„״×״ֲ» — ״­‚† HTML ״«… ״§״³״×״±״§״¯ ״¯†״§…ƒ „„…ˆ״¯ˆ„
window.loadFamilyGroupsGamePage = () =>
  loadPage(
    "/html/family-groups-game.html",
    async () => {
      // ״×״£ƒ״¯ ״×״­…„ CSS
      ensureCss(['/css/common-components-subjects.css', '/css/family-groups-game.css']);

      // ג… ״§״³״×״±״§״¯ …״¶…ˆ† ״¹״¨״± import.meta.glob
      const mods = import.meta.glob('/src/subjects/*-game.js');
      const loader = mods['/src/subjects/family-groups-game.js'];
      if (!loader) {
        console.error('[family-groups] module not found in Vite glob');
        return;
      }
      try {
        const m = await loader();                // ״³״­ˆ‘„ ״¥„‰ assets/family-groups-game-*.js ״×„‚״§״¦‹״§
        if (m?.loadFamilyGroupsGameContent) {
          await m.loadFamilyGroupsGameContent();
        } else {
          console.error('[family-groups] load function missing');
        }
      } catch (e) {
        // „ˆ ״­״µ„ 404/ƒ״§״´ ‚״¯… — ״£״¹״¯ ״§„…״­״§ˆ„״© ״¨״×‡״´״± ״¨״³״· „ƒ״³״± ״§„ƒ״§״´
        console.warn('[family-groups] first dynamic import failed, retrying with cache-bustג€¦', e);
        const bust = Date.now();
        const modsBust = import.meta.glob('/src/subjects/*-game.js?v=*'); // †…״· …״¹ ״§״³״×״¹„״§…
        const loaderBust = modsBust['/src/subjects/family-groups-game.js?v=*'];
        if (loaderBust) {
          const m2 = await loaderBust();
          m2?.loadFamilyGroupsGameContent?.();
        }
      }
    },
    "family-groups"
  );


// †״´״§״· ״§„״­״±ˆ
window.loadAlphabetActivity = () =>
  loadPage(
    "/html/alphabet-activity.html",
    async () => {
      ensureCss(['/css/common-components-subjects.css', '/css/alphabet-activity.css']);
      await loadAlphabetActivityContent();
    }
  );

window.loadMemoryGamePage    = () => loadPage("/html/memory-game.html",    loadMemoryGameContent,        "memory-game");
window.loadToolsMatchPage    = () => loadPage("/html/tools-match.html",    loadToolsMatchGameContent,    "tools-match");

// ״­״³״§״¨ ״§„…״³״×״®״¯…
window.loadLogin    = () => loadPage("/users/login.html");
window.loadRegister = () => loadPage("/users/register.html");
window.loadProfile  = () => loadPage("/users/profile.html");
window.loadMyReport = () => loadPage("/users/my-report.html");

/* ------------------------- ״×‡״¦״© ״§„„״÷״© ------------------------- */
(function initLang() {
  const lang = getCurrentLang();
  loadLanguage(lang).then(() => applyTranslations());
})();

/* ------------------------- …״±״§‚״¨״© ״­״§„״© ״§„״¯״®ˆ„ ------------------------- */
(function initAuthWatch() {
  try {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      updateAccountActionsUI(user);
    });
  } catch (e) {
    console.warn('[auth] Firebase Auth ״÷״± …‡‘״£״© ״¨״¹״¯. ״³״×… ״§״³״×״®״¯״§… ״§„״­״§„״© ״§„״§״×״±״§״¶״©.', e);
    updateAccountActionsUI(null);
  }
})();

// ״×״´״÷„ ״§„״µ״­״© ״§„״±״¦״³״© ״¹†״¯ ״§„״¬״§‡״²״©
window.addEventListener('DOMContentLoaded', () => {
  showHomePage();
});


