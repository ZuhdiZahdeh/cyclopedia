export function setupDescriptionToggleButton() {
  const toggleBtn = document.getElementById('toggle-description-btn');
  const descriptionBox = document.getElementById('vegetable-description-box');

  if (!toggleBtn || !descriptionBox) return;

  let isVisible = true;

  toggleBtn.addEventListener('click', () => {
    isVisible = !isVisible;
    descriptionBox.style.display = isVisible ? 'block' : 'none';
    toggleBtn.textContent = isVisible ? 'إخفاء الوصف' : 'إظهار الوصف';
  });
}