import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // ✅ صفحات الفئات (HTML متعددة)
        animals: resolve('html/animals.html'),
        vegetables: resolve(__dirname, 'html/vegetables.html')

      }
    },
    emptyOutDir: true
  }
});



