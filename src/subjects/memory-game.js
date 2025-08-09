export async function loadMemoryGameContent() {
  const main = document.querySelector('main.main-content');
  if (main) main.innerHTML = `<section><h2>🃏 لعبة الذاكرة — (نسخة مبدئية)</h2></section>`;
  console.log('[memory-game] stub loaded');
}
