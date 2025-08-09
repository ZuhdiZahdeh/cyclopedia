export async function loadToolsMatchGameContent() {
  const main = document.querySelector('main.main-content');
  if (main) main.innerHTML = `<section><h2>⚒ من صاحب الأداة؟ — (نسخة مبدئية)</h2></section>`;
  console.log('[tools-match] stub loaded');
}
