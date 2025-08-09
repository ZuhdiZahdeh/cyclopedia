// scripts/checks/smoke.js
import { chromium } from "playwright"; // أضِف playwright devDep
import sirv from "sirv";
import http from "node:http";

const app = sirv(".", { dev:true });
const server = http.createServer(app).listen(4173);
const base = "http://localhost:4173/";

const pages = [
  { name:"home", url: "" },
  { name:"tools-match", js: "window.loadToolsMatchPage?.()" },
  // أضف صفحاتك الأخرى هنا (fruits/vegetables...) باستدعاء دوال التحميل
];

const browser = await chromium.launch();
const context = await browser.newContext();
let failed = false;

for (const p of pages) {
  const page = await context.newPage();
  const errs = [];
  page.on("pageerror", e => errs.push("pageerror: "+e.message));
  page.on("console", msg => { if (["error"].includes(msg.type())) errs.push("console: "+msg.text()); });
  await page.goto(base + p.url);
  if (p.js) await page.evaluate(p.js);
  await page.waitForTimeout(1000);
  if (errs.length) {
    failed = true;
    console.error(`❌ أخطاء على صفحة: ${p.name}\n - `+errs.join("\n - "));
  } else {
    console.log(`✓ ${p.name} ok`);
  }
  await page.close();
}

await browser.close();
server.close();
process.exit(failed ? 1 : 0);
