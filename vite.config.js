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
        animals: resolve(__dirname, 'cyclopedia-app/html/animals.html'),
        birds: resolve(__dirname, 'cyclopedia-app/html/birds.html'),
        body: resolve(__dirname, 'cyclopedia-app/html/body.html'),
        colors: resolve(__dirname, 'cyclopedia-app/html/colors-page.html'),
        fruits: resolve(__dirname, 'cyclopedia-app/html/fruits.html'),
        vegetables: resolve(__dirname, 'cyclopedia-app/html/vegetables.html'),
        humanBody: resolve(__dirname, 'cyclopedia-app/html/human-body.html'),
        plants: resolve(__dirname, 'cyclopedia-app/html/plants.html'),
        fish: resolve(__dirname, 'cyclopedia-app/html/fish.html'),
        transport: resolve(__dirname, 'cyclopedia-app/html/transport.html'),
        numbers: resolve(__dirname, 'cyclopedia-app/html/numbers.html'),
        time: resolve(__dirname, 'cyclopedia-app/html/time.html'),

        // ✅ صفحة المهن الجديدة
        professions: resolve(__dirname, 'cyclopedia-app/html/professions.html')
      }
    }
  }
});
