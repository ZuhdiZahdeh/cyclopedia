// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
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
    sourcemap: false, // أصغر للحجم
    rollupOptions: {
      input: { main: resolve(__dirname, 'index.html') },
    },
  },
  plugins: [{
    name: 'ensure-main-entry',
    transformIndexHtml(html) {
      const tag = '<script type="module" src="/src/js/main.js"></script>';
      return html.includes(tag)
        ? html
        : html.replace('</body>', `\n  <!-- نقطة الدخول (Vite) -->\n  ${tag}\n</body>`);
    },
  }],
});
