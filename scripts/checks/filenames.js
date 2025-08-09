// scripts/checks/filenames.js
import fg from "fast-glob";
import { start, ok, fail } from "../utils/reporter.js";

start("filenames");

const BAD = [
  / \.([a-z0-9]+)$/i,
  /\.\.[a-z0-9]+$/i,
  /\(\d+\)\.[a-z0-9]+$/i
];

const files = await fg(["dist/**/*.{png,jpg,jpeg,webp,mp3}", "src/**/*.{png,jpg,jpeg,webp,mp3}"], { dot:false });
const problems = [];
for (const f of files) if (BAD.some(rx => rx.test(f))) problems.push(f);

if (problems.length) {
  process.exit(fail("filenames", problems));
} else {
  process.exit(ok("filenames"));
}
