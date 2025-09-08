// Utilidades globales para modo oscuro y tamaño de fuente
export function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

export function setFontSize(size: 'small' | 'normal' | 'large') {
  document.body.classList.remove('font-small', 'font-large');
  if (size === 'small') {
    document.body.classList.add('font-small');
  } else if (size === 'large') {
    document.body.classList.add('font-large');
  }
  // Si es normal, no se agrega ninguna clase
}
