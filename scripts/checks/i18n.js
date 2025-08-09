// scripts/checks/i18n.js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { start, ok, fail } from "../utils/reporter.js";

start("i18n");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../");

const CANDIDATE_DIRS = ["dist/lang", "src/lang", "lang"];
let baseDir = null;
for (const d of CANDIDATE_DIRS) {
  const p = path.join(root, d);
  if (fs.existsSync(p)) { baseDir = p; break; }
}

if (!baseDir) {
  process.exit(ok("i18n", "لا توجد ملفات لغات"));
}

const LANGS = ["ar", "en", "he"].filter(code => fs.existsSync(path.join(baseDir, `${code}.json`)));
if (LANGS.length < 2) {
  process.exit(ok("i18n", "لغة واحدة فقط — تخطٍ"));
}

function readJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); }
  catch (e) { return null; }
}

function flattenKeys(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj ?? {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out.push(...flattenKeys(v, key));
    } else {
      out.push(key);
    }
  }
  return out.sort();
}

const maps = {};
for (const code of LANGS) {
  const file = path.join(baseDir, `${code}.json`);
  const json = readJSON(file);
  if (!json) {
    maps[code] = { keys: [], invalid: true, file };
  } else {
    maps[code] = { keys: flattenKeys(json), invalid: false, file };
  }
}

const base = LANGS[0];
const baseKeys = maps[base].keys;

const issues = [];
for (const code of LANGS) {
  if (maps[code].invalid) {
    issues.push(`ملف لغة غير صالح JSON: ${maps[code].file}`);
    continue;
  }
  if (code === base) continue;

  const these = maps[code].keys;
  const missing = baseKeys.filter(k => !these.includes(k));
  const extra   = these.filter(k => !baseKeys.includes(k));

  if (missing.length) {
    issues.push(`[${code}] مفاتيح ناقصة (${missing.length}):\n   - ` + missing.join("\n   - "));
  }
  if (extra.length) {
    issues.push(`[${code}] مفاتيح زائدة (${extra.length}):\n   - ` + extra.join("\n   - "));
  }
}

if (issues.length) {
  process.exit(fail("i18n", issues));
} else {
  process.exit(ok("i18n", `مطابقة كاملة بين ${LANGS.join(", ")}`));
}
