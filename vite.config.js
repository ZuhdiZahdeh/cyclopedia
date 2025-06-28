// E:\cyclopedia\vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // المسار الأساسي العام عند النشر.
  // './' يعني أن الأصول سيتم خدمتها من نفس الدليل النسبي للملفات المخرجة.
  // هذا حيوي لـ GitHub Pages أو الاستضافة التي لا تخدم من جذر المسار.
  base: './', 
  
  build: {
    // دليل الإخراج الذي سيتم فيه وضع الملفات المجمعة
    outDir: 'dist', 
    rollupOptions: {
      input: {
        // تحديد ملف الإدخال الرئيسي لـ Rollup.
        // بما أن index.html موجود في الجذر، فإن مساره هو __dirname + 'index.html'
        main: resolve(__dirname, 'index.html'),
        // **Vite سيتعامل تلقائيًا مع مجلد public/ كأصول ثابتة.**
        // **لذلك، ملفات JS داخل public/src/js/ لا تحتاج لأن تكون هنا كمدخلات Rollup.**
        // Rollup (جزء من Vite) سيجدها عبر عبارات import في index.html
        // طالما أن المسارات في index.html صحيحة بالنسبة لمجلد public بعد النشر.
      },
    },
    // تمكين إنتاج خرائط المصدر (source maps) لسهولة التصحيح
    sourcemap: true,
  },
  // مجلد public هو المجلد الافتراضي لـ Vite للأصول الثابتة، لا حاجة لتعريفه صراحة هنا
  // publicDir: 'public', // هذا هو الافتراضي وعادة لا يحتاج إلى تعريف
  
  // لا نحتاج إلى alias هنا إذا كانت المسارات في index.html تشير مباشرة إلى public/src/js/
  // و Vite يتعامل مع publicDir بشكل صحيح.
  // إذا كنت تفضل استخدام @src في الاستيرادات (مثال: import { x } from '@src/js/file.js';)
  // فيمكنك إبقائه:
  // resolve: {
  //   alias: {
  //     '@src': resolve(__dirname, 'public/src'), 
  //   },
  // },
});