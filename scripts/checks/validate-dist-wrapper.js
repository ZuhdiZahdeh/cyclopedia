// scripts/checks/validate-dist-wrapper.js
// هدفه تشغيل validate-dist-paths أينما كان موقعه، وإخراج موحّد جميل.

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const CANDIDATES = [
  "scripts/checks/validate-dist-paths.js",
  "scripts/validate-dist-paths.js",
  "validate-dist-paths.js",
];

function findScript() {
  for (const p of CANDIDATES) {
    const full = path.resolve(process.cwd(), p);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

const target = findScript();

console.log("\n——— ▶ validate-dist-paths ———");

if (!target) {
  console.error("❌ validate-dist-paths — تفاصيل بالأسفل");
  console.error(
    " - Error: لم يتم العثور على سكربت 'validate-dist-paths.js' في أي من المواقع المتوقعة:\n   " +
      CANDIDATES.map((x) => `- ${x}`).join("\n   "),
  );
  process.exitCode = 1;
  process.exit(1);
}

const res = spawnSync(process.execPath, [target], {
  stdio: "inherit",
  env: process.env,
});

if (res.status !== 0) {
  console.error("❌ validate-dist-paths — تفاصيل بالأسفل");
  process.exit(res.status ?? 1);
} else {
  console.log("✓ validate-dist-paths");
}
