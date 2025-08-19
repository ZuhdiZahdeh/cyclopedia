// vite.config.js
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

export default defineConfig(	{
  // الأساس مناسب لـ Firebase Hosting على الجذر /
  base: "./",	 // مهم لعمل التطبيق داخل WebView

  // يتعامل Vite تلقائيًا مع مجلد public؛ نثبّت المسار صراحةً
  publicDir: resolve(__dirname, "public"),

  // مسارات مختصرة موحّدة لكل المشروع
  resolve: {
    alias: {
      "@":           resolve(__dirname, "src"),
      "@core":       resolve(__dirname, "src/core"),
      "@subjects":   resolve(__dirname, "src/subjects"),
      "@activities": resolve(__dirname, "src/activities"),
      "@js":         resolve(__dirname, "src/js"),
      // Alias مباشر لملف Firebase لديك (استعمله: import { db } from "@config")
      "@config":     resolve(__dirname, "src/js/firebase-config.js"),
      "@public":     resolve(__dirname, "public"),
    },
  },

  server:  { port: 5173, open: false, host: true },
  preview: { port: 4173, open: false, host: true },

  // تحسين الاستيراد لفirebase + اعتبار الصوت أصولًا
  optimizeDeps: { include: ["firebase/app", "firebase/firestore"] },
  assetsInclude: ["**/*.mp3", "**/*.ogg", "**/*.wav", "**/*.m4a", "**/*.webm"],

  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    sourcemap: true,
    // لا حاجة لتحديد rollupOptions.input؛ نستخدم index.html والحقن الديناميكي لصفحات html الجزئية
  },
});
