if (typeof window !== 'undefined' && !window.__loadAlphabetPage) {
  window.__loadAlphabetPage = async function (...args) {
    const g = (window.loadAlphabetActivityContent || window.loadAlphabetActivity) || null;
    if (typeof g === 'function') return g(...args);
    try {
      const mod = await import('../activities/alphabet-activity.js');
      const fn = mod.loadAlphabetActivityContent || mod.loadAlphabetActivity ||
                 (typeof mod.default === 'function' ? mod.default : null);
      if (typeof fn === 'function') return fn(...args);
    } catch (e) {
      if (__DEV__) console.warn('[alphabet] dynamic import failed', e);
    }
    throw new Error('Alphabet activity loader not found');
  };
}
if (typeof window !== 'undefined' && !window.__loadAlphabetPage) {
  window.__loadAlphabetPage = async function (...args) {
    const g = (window.loadAlphabetActivityContent || window.loadAlphabetActivity) || null;
    if (typeof g === 'function') return g(...args);
    try {
      const mod = await import('../activities/alphabet-activity.js');
      const fn = mod.loadAlphabetActivityContent || mod.loadAlphabetActivity ||
                 (typeof mod.default === 'function' ? mod.default : null);
      if (typeof fn === 'function') return fn(...args);
    } catch (e) {
      if (__DEV__) console.warn('[alphabet] dynamic import failed', e);
    }
    throw new Error('Alphabet activity loader not found');
  };
}
if (typeof window !== 'undefined' && !window.__loadAlphabetPage) {
  window.__loadAlphabetPage = async function (...args) {
    const g = (window.loadAlphabetActivityContent || window.loadAlphabetActivity) || null;
    if (typeof g === 'function') return g(...args);
    try {
      const mod = await import('../activities/alphabet-activity.js');
      const fn = mod.loadAlphabetActivityContent || mod.loadAlphabetActivity ||
                 (typeof mod.default === 'function' ? mod.default : null);
      if (typeof fn === 'function') return fn(...args);
    } catch (e) {
      if (__DEV__) console.warn('[alphabet] dynamic import failed', e);
    }
    throw new Error('Alphabet activity loader not found');
  };
}
if (typeof window !== 'undefined' && !window.__loadAlphabetPage) {
  window.__loadAlphabetPage = async function (...args) {
    const g = (window.loadAlphabetActivityContent || window.loadAlphabetActivity) || null;
    if (typeof g === 'function') return g(...args);
    try {
      const mod = await import('../activities/alphabet-activity.js');
      const fn = mod.loadAlphabetActivityContent || mod.loadAlphabetActivity ||
                 (typeof mod.default === 'function' ? mod.default : null);
      if (typeof fn === 'function') return fn(...args);
    } catch (e) {
      if (__DEV__) console.warn('[alphabet] dynamic import failed', e);
    }
    throw new Error('Alphabet activity loader not found');
  };
}
if (typeof window !== 'undefined' && !window.__loadAlphabetPage) {
  window.__loadAlphabetPage = async function (...args) {
    const g = (window.loadAlphabetActivityContent || window.loadAlphabetActivity) || null;
    if (typeof g === 'function') return g(...args);
    try {
      const mod = await import('../activities/alphabet-activity.js');
      const fn = mod.loadAlphabetActivityContent || mod.loadAlphabetActivity ||
                 (typeof mod.default === 'function' ? mod.default : null);
      if (typeof fn === 'function') return fn(...args);
    } catch (e) {
      if (__DEV__) console.warn('[alphabet] dynamic import failed', e);
    }
    throw new Error('Alphabet activity loader not found');
  };
}
ןasync function window.window.window.window.window.__loadAlphabetPage(...args){
  const g =
    (typeof window !== 'undefined')
      ? (window.loadAlphabetActivityContent || window.loadAlphabetActivity)
      : null;
  if (typeof g === 'function') return g(...args);
  try {
    const mod = await import('../activities/alphabet-activity.js');
    const fn = mod.loadAlphabetActivityContent || mod.loadAlphabetActivity ||
               (typeof mod.default === 'function' ? mod.default : null);
    if (typeof fn === 'function') return fn(...args);
  } catch (e) {
    if (typeof console !== 'undefined') console.warn('[alphabet] dynamic import failed', e);
  }
  throw new Error('Alphabet activity loader not found');
}
// =========================
// =========================
import { getCurrentLang, loadLanguage, applyTranslations, onLangChange } from '../core/lang-handler.js';
import { initializeSubjectControls } from '../core/initializeSubjectControls.js';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
/* ------------------------------------------------------------------
   ׳´ֳ—׳´ֲן¢ג€¦ן¢ֲן¢ג€ CSS ׳´ֲ§ן¢ג€׳´ֲ£׳´ֲ³׳´ֲ§׳´ֲ³ן¢ֲ + CSS ׳´ֲ§ן¢ג€׳´ֲ®׳´ֲ§׳´ֲµ ׳´ֲ¨ן¢ֶ'ן¢ג€ ן¢ג€¦ן¢ֻ†׳´ֲ¶ן¢ֻ†׳´ֲ¹ ׳´ֳ—ן¢ג€ן¢ג€׳´ֲ§׳´ֲ¦ן¢ֲן¢ג€¹׳´ֲ§
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
  'family-groups':'/css/family-groups-game.css', // ׳´ֳ—׳´ֲ£ן¢ֶ'ן¢ֲ׳´ֲ¯ ׳´ֳ—׳´ֲן¢ג€¦ן¢ֲן¢ג€ CSS ׳´ֲ§ן¢ג€׳´ֲ®׳´ֲ§׳´ֲµ ׳´ֲ¨׳´ֲ§ן¢ג€ן¢ג€׳´ֲ¹׳´ֲ¨׳´ֲ©
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
ensureCss(BASE_CSS);
/* ------------------------- i18n ן¢ג€׳´ֲ¹ן¢ג€׳´ֲ§׳´ֲµ׳´ֲ± ׳´ֲ§ן¢ג€׳´ֳ—׳´ֲן¢ֶ'ן¢ג€¦ ------------------------- */
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
const prevIds = ['prev-animal-btn','prev-fruit-btn','prev-vegetable-btn','prev-human-body-btn','prev-profession-btn','prev-tools-btn','prev-btn'];
  const nextIds = ['next-animal-btn','next-fruit-btn','next-vegetable-btn','next-human-body-btn','next-profession-btn','next-tools-btn','next-btn'];
prevIds.forEach(id => { const el = document.getElementById(id); if (el) el.setAttribute('data-i18n','previous'); });
  nextIds.forEach(id => { const el = document.getElementById(id); if (el) el.setAttribute('data-i18n','next'); });
document
    .querySelectorAll('[id^="toggle-description-btn"]')
    .forEach(el => el.setAttribute('data-i18n','Description'));
document.querySelectorAll('select[id^="voice-select"]').forEach(sel => {
    const lab = document.querySelector(`label[for="${sel.id}"]`);
    if (lab) lab.setAttribute('data-i18n','Voice');
    rebuildVoiceOptions(sel);
  });
  document.querySelectorAll('select[id^="game-lang-select"]').forEach(sel => {
    const lab = document.querySelector(`label[for="${sel.id}"]`);
    if (lab) lab.setAttribute('data-i18n','Language');
  });
const accTitleInner = document.querySelector('.static-section .sidebar-title [data-i18n]');
  if (accTitleInner) {
    accTitleInner.setAttribute('data-i18n','your_account');
  } else {
    const accTitle = document.querySelector('.static-section .sidebar-title');
    if (accTitle) accTitle.setAttribute('data-i18n','your_account');
  }
try { applyTranslations(); } catch {}
}
/* ------------------------- ׳´ֲ£׳´ֲ¯ן¢ֻ†׳´ֲ§׳´ֳ— ן¢ֻ†׳´ֲ§׳´ֲ¬ן¢ג€¡׳´ֲ© ׳´ֲ¨׳´ֲ³ן¢ֲ׳´ֲ·׳´ֲ© ן¢ג€ן¢ג€׳´ֲ³׳´ֲ§ן¢ֲ׳´ֲ¯׳´ֲ¨׳´ֲ§׳´ֲ± ------------------------- */
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
/* ------------------------- ׳´ֲ׳´ֲ³׳´ֲ§׳´ֲ¨ ׳´ֲ§ן¢ג€ן¢ג€¦׳´ֲ³׳´ֳ—׳´ֲ®׳´ֲ¯ן¢ג€¦: ן¢ֻ†׳´ֲ§׳´ֲ¬ן¢ג€¡׳´ֲ© ׳´ֲ§ן¢ג€׳´ֲ£׳´ֲ²׳´ֲ±׳´ֲ§׳´ֲ± ------------------------- */
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
/* ------------------------- ׳´ֳ—׳´ֲ±׳´ֳ—ן¢ֲ׳´ֲ¨ ײ²ֲ׳´ֲ׳´ֲ³׳´ֲ§׳´ֲ¨ן¢ֶ'ײ²ֲ ׳´ֳ—׳´ֲ׳´ֳ— ׳´ֲ§ן¢ג€׳´ֳ—׳´ֲן¢ֶ'ן¢ג€˜ן¢ג€¦ ׳´ֲ§ן¢ג€׳´ֲ¸׳´ֲ§ן¢ג€¡׳´ֲ± ------------------------- */
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
/* ------------------------- ן¢ג€¦׳´ֲן¢ג€¦ן¢ג€ ׳´ֲµן¢ֲ׳´ֲ׳´ֲ§׳´ֳ— ׳´ֲ¹׳´ֲ§ן¢ג€¦ (ן¢ג€¦ן¢ֲ׳´ֲ׳´ֲµן¢ג€˜ן¢ֲן¢ג€) ------------------------- */
const FRAGMENT_SELECTORS = [
  "#page-content",
  ".subject-page",
  "#fruits-game",
  "main .main-content",
  "main",
  "body"
];
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
if (subjectType && SUBJECT_CSS[subjectType]) {
      ensureCss(['/css/common-components-subjects.css', SUBJECT_CSS[subjectType]]);
    }
hideAllControls();
const res = await fetch(htmlPath, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`ן¢ֲ׳´ֲ´ן¢ג€ ׳´ֳ—׳´ֲן¢ג€¦ן¢ֲן¢ג€ ׳´ֲ§ן¢ג€׳´ֲµן¢ֲ׳´ֲ׳´ֲ©: ${htmlPath} (status ${res.status})`);
    let html = await res.text();
if (/<\!doctype html>|<html|<header[^>]+top-navbar/i.test(html)) {
      console.warn(`[loader] "${htmlPath}" ׳´ֲ£׳´ֲ¹׳´ֲ§׳´ֲ¯ ן¢ֻ†׳´ֲן¢ֲן¢ג€׳´ֲ© ן¢ֶ'׳´ֲ§ן¢ג€¦ן¢ג€׳´ֲ© (׳´ֳ·׳´ֲ§ן¢ג€׳´ֲ¨ן¢ג€¹׳´ֲ§ index.html). ׳´ֲ³׳´ֲ£׳´ֲ׳´ֲ§ן¢ֻ†ן¢ג€ ׳´ֲ§׳´ֲ³׳´ֳ—׳´ֲ®׳´ֲ±׳´ֲ§׳´ֲ¬ ׳´ֲ¬׳´ֲ²׳´ֲ¡ ׳´ֲ§ן¢ג€ן¢ג€¦׳´ֲ׳´ֳ—ן¢ֻ†ן¢ג€° ן¢ֲן¢ג€׳´ֲ·.`);
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const candidate = FRAGMENT_SELECTORS.map(sel => doc.querySelector(sel)).find(Boolean);
      html = candidate ? candidate.innerHTML : '<p>׳´ֳ—׳´ֲ¹׳´ֲ°ן¢ג€˜׳´ֲ± ׳´ֳ—׳´ֲן¢ג€¦ן¢ֲן¢ג€ ׳´ֲ§ן¢ג€׳´ֲµן¢ֲ׳´ֲ׳´ֲ©.</p>';
    }
mainContent.innerHTML = stripScripts(html);
try { await applyTranslations(); } catch {}
if (subjectType) initializeSubjectControls(subjectType);
    i18nNormalizeControls();
requestAnimationFrame(() => {
      placeAccountSectionBelowActiveControls();
      initSidebarObserver(); // ן¢ג€¦׳´ֲ±ן¢ג€˜׳´ֲ© ן¢ֻ†׳´ֲ§׳´ֲ׳´ֲ¯׳´ֲ©
    });
if (typeof moduleLoader === 'function') {
      await moduleLoader();
    }
if (__DEV__) console.log(`׳'ֲג€¦ ׳´ֳ—ן¢ג€¦ ׳´ֳ—׳´ֲן¢ג€¦ן¢ֲן¢ג€ ׳´ֲ§ן¢ג€׳´ֲµן¢ֲ׳´ֲ׳´ֲ©: ${htmlPath}`);
  } catch (err) {
    console.error(`׳'ֲֲ ׳´ֲ®׳´ֲ·׳´ֲ£ ן¢ֲן¢ֲ ׳´ֳ—׳´ֲן¢ג€¦ן¢ֲן¢ג€ ׳´ֲ§ן¢ג€׳´ֲµן¢ֲ׳´ֲ׳´ֲ©: ${htmlPath}`, err);
    if (mainContent) {
      mainContent.innerHTML = `<div class="error-box">״×״¹״°״± ״×״…„ ״§„…״״×ˆ‰ ״§„…״·„ˆ״¨.</div>`;
    }
  }
}
onLangChange(() => {
  i18nNormalizeControls();
});
/* ------------------------- ׳´ֲ±׳´ֲ¨׳´ֲ· ׳´ֲ§ן¢ג€׳´ֲ¯ן¢ֻ†׳´ֲ§ן¢ג€ ׳´ֲ¨ן¢ג€׳´ֲ§ן¢ֲ׳´ֲ°׳´ֲ© ׳´ֲ§ן¢ג€ן¢ג€¦׳´ֳ—׳´ֲµן¢ֲ׳´ֲ ------------------------- */
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
window.loadAnimalsPage        = () => loadPage("/html/animals.html",        loadAnimalsGameContent,       "animal");
window.loadFruitsPage         = () => loadPage("/html/fruits.html",         loadFruitsGameContent,        "fruit");
window.loadVegetablesPage     = () => loadPage("/html/vegetables.html",     loadVegetablesGameContent,    "vegetable");
window.loadHumanBodyPage      = () => loadPage("/html/human-body.html",     loadHumanBodyGameContent,     "human-body");
window.loadProfessionsPage    = () => loadPage("/html/professions.html",    loadProfessionsGameContent,   "profession");
window.loadToolsPage          = () => loadPage("/html/tools.html",          loadToolsGameContent,         "tools");
window.loadFamilyGroupsGamePage = () =>
  loadPage(
    "/html/family-groups-game.html",
    async () => {
ensureCss(['/css/common-components-subjects.css', '/css/family-groups-game.css']);
const mods = import.meta.glob('/src/subjects/*-game.js');
      const loader = mods['/src/subjects/family-groups-game.js'];
      if (!loader) {
        console.error('[family-groups] module not found in Vite glob');
        return;
      }
      try {
        const m = await loader();                // ׳´ֲ³ן¢ֲן¢ֲ׳´ֲן¢ֻ†ן¢ג€˜ן¢ֲן¢ג€ ׳´ֲ¥ן¢ג€ן¢ג€° assets/family-groups-game-*.js ׳´ֳ—ן¢ג€ן¢ג€׳´ֲ§׳´ֲ¦ן¢ֲן¢ג€¹׳´ֲ§
        if (m?.loadFamilyGroupsGameContent) {
          await m.loadFamilyGroupsGameContent();
        } else {
          console.error('[family-groups] load function missing');
        }
      } catch (e) {
console.warn('[family-groups] first dynamic import failed, retrying with cache-bust׳'ג‚¬ֲ¦', e);
        const bust = Date.now();
        const modsBust = import.meta.glob('/src/subjects/*-game.js?v=*'); // ן¢ג€ן¢ג€¦׳´ֲ· ן¢ג€¦׳´ֲ¹ ׳´ֲ§׳´ֲ³׳´ֳ—׳´ֲ¹ן¢ג€׳´ֲ§ן¢ג€¦
        const loaderBust = modsBust['/src/subjects/family-groups-game.js?v=*'];
        if (loaderBust) {
          const m2 = await loaderBust();
          m2?.loadFamilyGroupsGameContent?.();
        }
      }
    },
    "family-groups"
  );
window.loadAlphabetActivity = () =>
  loadPage(
    "/html/alphabet-activity.html",
    async () => {
      ensureCss(['/css/common-components-subjects.css', '/css/alphabet-activity.css']);
      await window.window.window.window.window.__loadAlphabetPage();
    }
  );
window.loadMemoryGamePage    = () => loadPage("/html/memory-game.html",    loadMemoryGameContent,        "memory-game");
window.loadToolsMatchPage    = () => loadPage("/html/tools-match.html",    loadToolsMatchGameContent,    "tools-match");
window.loadLogin    = () => loadPage("/users/login.html");
window.loadRegister = () => loadPage("/users/register.html");
window.loadProfile  = () => loadPage("/users/profile.html");
window.loadMyReport = () => loadPage("/users/my-report.html");
/* ------------------------- ׳´ֳ—ן¢ג€¡ן¢ֲ׳´ֲ¦׳´ֲ© ׳´ֲ§ן¢ג€ן¢ג€׳´ֳ·׳´ֲ© ------------------------- */
(function initLang() {
  const lang = getCurrentLang();
  loadLanguage(lang).then(() => applyTranslations());
})();
/* ------------------------- ן¢ג€¦׳´ֲ±׳´ֲ§ן¢ג€׳´ֲ¨׳´ֲ© ׳´ֲ׳´ֲ§ן¢ג€׳´ֲ© ׳´ֲ§ן¢ג€׳´ֲ¯׳´ֲ®ן¢ֻ†ן¢ג€ ------------------------- */
(function initAuthWatch() {
  try {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      updateAccountActionsUI(user);
    });
  } catch (e) {
    console.warn('[auth] Firebase Auth ׳´ֳ·ן¢ֲ׳´ֲ± ן¢ג€¦ן¢ג€¡ן¢ֲן¢ג€˜׳´ֲ£׳´ֲ© ׳´ֲ¨׳´ֲ¹׳´ֲ¯. ׳´ֲ³ן¢ֲ׳´ֳ—ן¢ג€¦ ׳´ֲ§׳´ֲ³׳´ֳ—׳´ֲ®׳´ֲ¯׳´ֲ§ן¢ג€¦ ׳´ֲ§ן¢ג€׳´ֲ׳´ֲ§ן¢ג€׳´ֲ© ׳´ֲ§ן¢ג€׳´ֲ§ן¢ֲ׳´ֳ—׳´ֲ±׳´ֲ§׳´ֲ¶ן¢ֲ׳´ֲ©.', e);
    updateAccountActionsUI(null);
  }
})();
window.addEventListener('DOMContentLoaded', () => {
  showHomePage();
});





