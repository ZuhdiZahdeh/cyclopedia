export async function loadToolsGameContent() {
  const main = document.querySelector('main.main-content');
  if (main) main.innerHTML = `<section><h2>🛠 الأدوات — (نسخة مبدئية)</h2></section>`;
  console.log('[tools] stub loaded');
}
