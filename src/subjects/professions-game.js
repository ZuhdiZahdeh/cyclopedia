export async function loadProfessionsGameContent() {
  const main = document.querySelector('main.main-content');
  if (main) main.innerHTML = `<section><h2>👩‍🏭 المهن — (نسخة مبدئية)</h2></section>`;
  console.log('[professions] stub loaded');
}
