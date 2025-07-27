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
        // الصفحة الرئيسية
        main: resolve(__dirname, 'index.html'),
        // صفحات الموسوعة التعليمية
		// animals: resolve(__dirname, 'html/animals.html'),
        // birds: resolve(__dirname, 'html/birds.html'),
        // body: resolve(__dirname, 'html/body.html'),
        // colors: resolve(__dirname, 'html/colors-page.html'),
        // fruits: resolve(__dirname, 'html/fruits.html'),
        // vegetables: resolve(__dirname, 'html/vegetables.html'),
        // humanBody: resolve(__dirname, 'html/human-body.html'),
        // plants: resolve(__dirname, 'html/plants.html'),
        // fish: resolve(__dirname, 'html/fish.html'),
        // transport: resolve(__dirname, 'html/transport.html'),
        // numbers: resolve(__dirname, 'html/numbers.html'),
        // time: resolve(__dirname, 'html/time.html'),
		"tools-match": resolve(__dirname, 'html/tools-match.html'),
        professions: resolve(__dirname, 'html/professions.html')
      }
    }
  }
});
