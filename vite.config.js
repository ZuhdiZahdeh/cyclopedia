// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist-publish',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        "tools-match": resolve(__dirname, 'html/tools-match.html'),
        "tools-match-controls": resolve(__dirname, 'html/tools-match-controls.html'),
        "professions": resolve(__dirname, 'html/professions.html'),
        "alphabet-press": resolve(__dirname, 'html/alphabet-press.html'),
        "vegetables": resolve(__dirname, 'html/vegetables.html'),
        "fruits": resolve(__dirname, 'html/fruits.html'),
        "tools-match-game": resolve(__dirname, 'src/js/tools-match-game.js'),
        "alphabet-press-game": resolve(__dirname, 'src/js/alphabet-press-game.js'),
        "include-all-scripts": resolve(__dirname, 'src/js/include-all-scripts.js'),
        "debug": resolve(__dirname, 'html/debug.html')
      }
    }
  }
});
