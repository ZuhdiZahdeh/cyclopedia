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
        professions: resolve(__dirname, 'html/professions.html'),
        toolsMatchScript: resolve(__dirname, 'src/js/tools-match-game.js'),
        includeAllScripts: resolve(__dirname, 'src/js/include-all-scripts.js'),
        alphabetPressGame: resolve(__dirname, 'src/js/alphabet-press-game.js'),
		  alphabetPressPage: resolve(__dirname, 'html/alphabet-press.html'),
		  toolsMatchControls: resolve(__dirname, 'html/tools-match-controls.html'),
        debug: resolve(__dirname, 'html/debug.html')
      }
    }
  }
});
