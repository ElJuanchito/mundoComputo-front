import { bootstrapApplication } from '@angular/platform-browser';
import { toggleDarkMode, setFontSize } from './app/utils/theme-utils';
import { App } from './app/app';
import { appConfig } from './app/app.config';

// Exponer funciones globales para los botones
(window as any).toggleDarkMode = toggleDarkMode;
(window as any).setFontSize = setFontSize;

// Inyectar controles de tema en el DOM
fetch('src/assets/theme-controls.html')
  .then(res => res.text())
  .then(html => {
    const root = document.getElementById('theme-controls-root');
    if (root) root.innerHTML = html;
  });

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
