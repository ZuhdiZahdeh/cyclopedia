// E:\cyclopedia\vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path'; // استيراد resolve لتحديد المسارات المطلقة

export default defineConfig({
  // المسار الأساسي العام عند النشر.
  // './' يعني أن الأصول سيتم خدمتها من نفس الدليل النسبي لـ index.html
  base: './', 
  
  build: {
    // دليل الإخراج الذي سيتم فيه وضع الملفات المجمعة
    outDir: 'dist', 
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        profile: resolve(__dirname, 'public/users/profile.html'),
        login: resolve(__dirname, 'public/users/login-form.html'),
        register: resolve(__dirname, 'public/users/register-form.html'),
      },
    },
    // تمكين إنتاج خرائط المصدر (source maps) لسهولة التصحيح
    sourcemap: true,
  },
  // مساعدة Vite في حل المسارات التي قد لا تكون قياسية
  resolve: {
    alias: {

      '@src': resolve(__dirname, 'public/src'), 
    },
  },
});