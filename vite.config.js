// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  define: {
    __BASE_URL__: JSON.stringify(process.env.VITE_BASE_URL || '/'),
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production')
  },
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
    chunkSizeWarningLimit: 1200,
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // أصغر للحجم
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'vendor-firebase';
            return 'vendor';
          }
          if (id.includes('/src/subjects/')) {
            const m = id.match(/\/src\/subjects\/([^\/]+)\.js$/);
            if (m) return `subject-${m[1]}`;
          }
        }
      },
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
