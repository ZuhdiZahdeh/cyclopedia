import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // مهم ليعمل الموقع بعد النشر على Firebase
  build: {
    outDir: 'dist', // المجلد الذي يتم نشره لاحقاً
  }
});
