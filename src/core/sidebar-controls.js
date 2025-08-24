// src/core/sidebar-controls.js
// شريط جانبي موحّد — أيقونات للصوت واللغة + أحداث عامة
export function mountSidebarControls({
  mount = '#sidebar-controls',
  langs = ['ar','en','he'],
  voices = ['teacher','boy','girl','child'],
  initialLang = 'ar',
  initialVoice = 'boy'
} = {}) {
  const root = typeof mount === 'string' ? document.querySelector(mount) : mount;
  if (!root) return;

  root.classList.add('sidebar-controls-unified');
  root.innerHTML = `
    <div class="ctrl-row">
      <button class="btn btn-nav"  data-action="prev">السابق</button>
      <button class="btn btn-nav"  data-action="next">التالي</button>
    </div>

    <button class="btn btn-desc ghost" data-action="desc">الوصف</button>

    <div class="form-group">
      <label class="form-label">الصوت</label>
      <div class="voice-group">
        ${voices.map(v => `
          <button type="button" class="btn-voice" data-voice="${v}" title="${voiceLabel(v)}">${voiceIcon(v)}</button>
        `).join('')}
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">اللغة</label>
      <div class="lang-group">
        ${langs.map(l => `
          <button type="button" class="btn-lang" data-lang="${l}" title="${langLabel(l)}">${langIcon(l)}</button>
        `).join('')}
      </div>
    </div>
  `;

  // تفعيل الحالة الأولية
  setActive(root.querySelectorAll('.btn-voice'), b => b.dataset.voice === initialVoice);
  setActive(root.querySelectorAll('.btn-lang'),  b => b.dataset.lang  === initialLang);

  // أحداث تنقّل ووصف
  root.querySelector('[data-action="prev"]')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('controls:prev'));
  });
  root.querySelector('[data-action="next"]')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('controls:next'));
  });
  root.querySelector('[data-action="desc"]')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('controls:description'));
  });

  // أحداث الصوت
  root.querySelectorAll('.btn-voice').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      setActive(root.querySelectorAll('.btn-voice'), b=>b===btn);
      window.dispatchEvent(new CustomEvent('voice:change', { detail:{ voice: btn.dataset.voice }}));
    });
  });

  // أحداث اللغة
  root.querySelectorAll('.btn-lang').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      setActive(root.querySelectorAll('.btn-lang'), b=>b===btn);
      window.dispatchEvent(new CustomEvent('lang:change', { detail:{ lang: btn.dataset.lang }}));
    });
  });
}

// ——— مساعدات ———
function setActive(list, isActive){
  list.forEach(el => el.classList.toggle('active', !!isActive(el)));
}

function voiceLabel(v){
  return v==='teacher' ? 'المعلّم' : v==='boy' ? 'ولد' : v==='girl' ? 'بنت' : 'طفل';
}
function voiceIcon(v){
  return v==='teacher' ? '👩‍🏫' : v==='boy' ? '👦' : v==='girl' ? '👧' : '🧒';
}
function langLabel(l){
  return l==='ar' ? 'العربية' : l==='en' ? 'English' : 'עברית';
}
function langIcon(l){
  // يمكنك تبديلها لأعلام لاحقًا إن رغبت
  return l==='ar' ? 'AR' : l==='en' ? 'EN' : 'HE';
}
