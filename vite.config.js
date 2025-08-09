import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

export default defineConfig({
  root: __dirname,
  base: "/",                              // يضمن توليد /assets/* بشكل صحيح على Firebase
  publicDir: resolve(__dirname, "public"),// ينسخ public/** إلى dist/**
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  server:  { port: 5173, open: false },
  preview: { port: 4173, open: false },
  build:   { outDir: resolve(__dirname, "dist"), emptyOutDir: true, sourcemap: true }
});
