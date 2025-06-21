import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        animals: resolve(__dirname, 'html/animals.html'),
        vegetables: resolve(__dirname, 'html/vegetables.html')
      }
    },
    emptyOutDir: true
  }
});




