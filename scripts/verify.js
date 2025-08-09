// scripts/verify.js
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { start, ok, fail } from "./utils/reporter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const run = (cmd, args, name) =>
  new Promise((resolve) => {
    start(name);
    const p = spawn(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
    p.on("close", (code) => resolve({ name, code }));
  });

// NOTE: أدرجنا validate-dist-wrapper أولًا لأنه أسرع ويطلع مشاكل أسماء/مسارات بدري
const tasks = [
  ["node", [path.join(__dirname, "checks/validate-dist-wrapper.js")], "validate-dist-paths"],
  ["node", [path.join(__dirname, "checks/filenames.js")], "filenames"],
  ["node", [path.join(__dirname, "checks/imports.js")], "imports"],
  ["node", [path.join(__dirname, "checks/html-structure.js")], "html"],
  ["node", [path.join(__dirname, "checks/i18n.js")], "i18n"],
  ["node", [path.join(__dirname, "checks/assets-pairs.js")], "audio-image-pairs"],
  ["npx", ["eslint", "."], "eslint"],
  ["npx", ["prettier", "--check", "."], "prettier"],
  ["npx", ["vite", "build", "--outDir", "dist-ci"], "vite-build"],
  ["node", [path.join(__dirname, "checks/smoke.js")], "smoke"],
];

const failed = [];
for (const [cmd, args, name] of tasks) {
  /* eslint-disable no-await-in-loop */
  const { code } = await run(cmd, args, name);
  if (code !== 0) failed.push(name);
}

if (failed.length) {
  process.exit(fail("verify", failed.map((n) => `فحص '${n}' فشل`)));
} else {
  process.exit(ok("verify", "كل الفحوص مرّت بنجاح"));
}
