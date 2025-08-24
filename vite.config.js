// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',            // للويب (Firebase Hosting)
  publicDir: 'public',
  resolve: {
    alias: {
      '@':           resolve(__dirname, 'src'),
      '@core':       resolve(__dirname, 'src/core'),
      '@subjects':   resolve(__dirname, 'src/subjects'),
      '@activities': resolve(__dirname, 'src/activities'),
      '@js':         resolve(__dirname, 'src/js'),
      '@public':     resolve(__dirname, 'public'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // اجبر Vite أن يعتبر index.html (وغيره) مداخل البناء
      input: {
        main: resolve(__dirname, 'index.html'),
        // أضِف صفحات HTML أخرى هنا إن أردت بنائها كصفحات مستقلة:
        // animals: resolve(__dirname, 'html/animals.html'),
        // fruits: resolve(__dirname, 'html/fruits.html'),
        // ...
      },
    },
  },
  plugins: [
    // يضمن بقاء سطر نقطة الدخول حتى إن شالته أداة أخرى بالخطأ
    {
      name: 'ensure-main-entry',
      transformIndexHtml(html) {
        const tag = '<script type="module" src="/src/js/main.js"></script>';
        return html.includes(tag)
          ? html
          : html.replace('</body>', `\n  <!-- نقطة الدخول (Vite) -->\n  ${tag}\n</body>`);
      },
    },
  ],
});
