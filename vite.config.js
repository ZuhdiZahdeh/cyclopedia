// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        "tools-match": resolve(__dirname, 'html/tools-match.html'),
        professions: resolve(__dirname, 'html/professions.html'),
        toolsMatchScript: resolve(__dirname, 'src/js/tools-match-game.js') // ✅ أضف هذا
      }
    }
  }
});

