export async function loadLanguage(lang) {
  try {
    const response = await fetch(`lang/${lang}.json`);
    const translations = await response.json();
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (translations[key]) el.textContent = translations[key];
    });
  } catch (error) {
    console.error(`❌ Error loading language file (${lang}.json):`, error);
  }
}


