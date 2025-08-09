// scripts/checks/html-structure.js
import fg from "fast-glob";
import fs from "node:fs";
const HTML = await fg(["index.html", "html/**/*.html"]);
const bad = [];
for (const f of HTML) {
  const t = fs.readFileSync(f, "utf8");
  if (!/\<main[^>]*class=["'][^"']*main-content/.test(t)) bad.push(f);
}
if (bad.length) {
  console.error("❌ صفحات ينقصها <main class=\"main-content\">:\n" + bad.map(x=>" - "+x).join("\n"));
  process.exit(1);
}
console.log("✓ html structure ok");
