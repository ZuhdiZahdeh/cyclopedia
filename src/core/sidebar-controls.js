// شريط جانبي موحّد — لا يحتوي زر "استمع"
export function mountSidebarControls({
  mount = '#sidebar-controls',
  langList = ['ar','en','he'],
  voiceList = ['teacher','boy','girl'],
  initialLang = 'ar'
} = {}) {
  const root = typeof mount === 'string' ? document.querySelector(mount) : mount;
  if (!root) return;

  root.classList.add('sidebar');
  root.innerHTML = `
    <div class="ctrl-row">
      <button class="btn btn-nav"  id="btn-prev">السابق</button>
      <button class="btn btn-nav"  id="btn-next">التالي</button>
    </div>

    <button class="btn btn-desc" id="btn-desc">الوصف</button>

    <div class="form-group">
      <label class="form-label">الصوت</label>
      <select class="select" id="sel-voice">
        ${voiceList.map(v => `<option value="${v}">${voiceLabel(v)}</option>`).join('')}
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">اللغة</label>
      <select class="select" id="sel-lang">
        ${langList.map(l => `<option value="${l}" ${l===initialLang?'selected':''}>${langLabel(l)}</option>`).join('')}
      </select>
    </div>
  `;

  // نطلق أحداثًا عامة ليستمع لها كل موضوع (بدون ربط أسماء دوال محددة)
  root.querySelector('#btn-prev').addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('controls:prev'));
  });
  root.querySelector('#btn-next').addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('controls:next'));
  });
  root.querySelector('#btn-desc').addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('controls:description'));
  });
  root.querySelector('#sel-lang').addEventListener('change', (e) => {
    window.dispatchEvent(new CustomEvent('lang:change', { detail: { lang: e.target.value }}));
  });
  root.querySelector('#sel-voice').addEventListener('change', (e) => {
    window.dispatchEvent(new CustomEvent('voice:change', { detail: { voice: e.target.value }}));
  });
}

function voiceLabel(v) {
  switch (v) {
    case 'teacher': return 'المعلّم';
    case 'boy':     return 'صوت الولد';
    case 'girl':    return 'صوت البنت';
    default:        return v;
  }
}
function langLabel(l) {
  switch (l) {
    case 'ar': return 'العربية';
    case 'en': return 'English';
    case 'he': return 'עברית';
    default:   return l;
  }
}
