export async function loadHumanBodyGameContent() {
  const main = document.querySelector('main.main-content');
  if (main) main.innerHTML = `<section><h2>🧠 جسم الإنسان — (نسخة مبدئية)</h2></section>`;
  console.log('[human-body] stub loaded');
}
