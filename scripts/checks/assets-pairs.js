// scripts/checks/assets-pairs.js
import fg from "fast-glob";
import fs from "node:fs";

const items = (await fg(["dist/images/fruits/*.png"])).map(p=>p.split("/").pop().replace(".png",""));
const langs = ["ar","en","he"].filter(l => fs.existsSync(`dist/audio/${l}/fruits`));

const missing = [];
for (const it of items) {
  for (const l of langs) {
    const cand = [`dist/audio/${l}/fruits/${it}_boy_${l}.mp3`, `dist/audio/${l}/fruits/${it}_girl_${l}.mp3`, `dist/audio/${l}/fruits/${it}_teacher_${l}.mp3`];
    if (!cand.some(fs.existsSync)) missing.push(`${it} → ${l}`);
  }
}
if (missing.length) {
  console.error("❌ عناصر بلا ملف صوت مطابق:\n" + missing.map(x=>" - "+x).join("\n"));
  process.exit(1);
}
console.log("✓ audio-image pairs ok");
