// vite.config.js (محدَّث)
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

export default defineConfig({
  root: __dirname,
  base: "/",                                // إبقِها كما هي للنشر على Firebase
  publicDir: resolve(__dirname, "public"),  // نخزّن html الجزئية داخل public/html
  resolve: {
    alias: {
      "@":           resolve(__dirname, "src"),
      "@core":       resolve(__dirname, "src/core"),
      "@activities": resolve(__dirname, "src/activities"),
    }
  },
  server:  { port: 5173, open: false },
  preview: { port: 4173, open: false },
  // تحسين الاستيراد لفirebase + اعتماد أصوات كأصول عند الاستيراد (إن لزم)
  optimizeDeps: { include: ["firebase/app", "firebase/firestore"] },
  assetsInclude: ["**/*.mp3", "**/*.ogg", "**/*.wav", "**/*.m4a", "**/*.webm"],
  build:   {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    sourcemap: true
    // لا نضيف rollupOptions.input لأننا نعتمد على public/html + الحقن الديناميكي
  }
});

