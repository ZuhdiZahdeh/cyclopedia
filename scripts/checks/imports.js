// scripts/checks/imports.js
// فاحص استيرادات موحّد لملفات JS/HTML:
// - JS: يتحقق من المسارات النسبية والبُرَاق (packages)
// - HTML: يتحقق من <script src> و<link href> و<img/audio src>
// - يتجاهل: node: builtins, dev-only في ملفات إعداد, أصول dist/assets/* ذات الهاش
// - يعامل /xyz على أنه public/xyz

import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import { pathToFileURL } from "node:url";

console.log("\n——— ▶ imports ———");

const ROOT = process.cwd();

// حزم مسموحة كطرف ثالث بدون فحص وجود ملفات داخلية
const PACKAGE_WHITELIST = [
  "firebase",
  "firebase/app",
  "firebase/auth",
  "firebase/firestore",
  "vite",
];

// بادئات/حالات يجب تجاهلها
const IGNORE_PREFIXES = [
  "node:",               // Node builtins: node:path, node:url ...
  "http://",
  "https://",
  "data:",
];

// ملفات إعداد غالبًا تستورد devDeps (نكتفي بالتأكد أن الحزمة ضمن whitelist)
const DEV_CONFIG_FILES = new Set([
  "vite.config.js",
  "vite.config.mjs",
  "eslint.config.js",
  "eslint.config.mjs",
  "prettier.config.js",
  "prettier.config.mjs",
]);

// HTML tags we care about
const HTML_ATTRS = [
  { tag: "script", attr: "src" },
  { tag: "link", attr: "href" },
  { tag: "img", attr: "src" },
  { tag: "audio", attr: "src" },
  { tag: "source", attr: "src" },
];

function isHashedAsset(p) {
  // dist/assets/main-<hash>.js أو .css
  return /(^|\/)assets\/[A-Za-z0-9_-]+\-[a-f0-9]{6,}\.(js|css|json|png|jpe?g|webp|svg)$/.test(
    p.replace(/\\/g, "/"),
  );
}

function read(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function listJsFiles() {
  // استهدف src وكل JS بالمشروع ما عدا node_modules وdist
  return fg.sync(
    [
      "**/*.js",
      "**/*.mjs",
      "!node_modules/**",
      "!dist/**",
      "!dist-publish/**",
      "!dist-ci/**",
      "!public/**/rename-files.js", // ملفات أدوات داخل public
    ],
    { dot: false },
  );
}

function listHtmlFiles() {
  return fg.sync(
    ["index.html", "html/**/*.html", "public/**/*.html", "users/**/*.html"],
    { dot: false },
  );
}

function isBareSpecifier(spec) {
  return !spec.startsWith(".") && !spec.startsWith("/") && !spec.startsWith("\\");
}

function resolveHtmlPath(spec) {
  if (IGNORE_PREFIXES.some((p) => spec.startsWith(p))) return null;
  // الأصول المولدة من dist/assets نتجاهلها
  if (spec.includes("/assets/") && isHashedAsset(spec)) return null;

  // لو بدأ بـ / فنعتبره مسارًا داخل public/
  if (spec.startsWith("/")) return path.resolve(ROOT, "public" + spec);
  return null; // سيُعالَج كنَسبي لاحقًا حسب الملف
}

function resolveJsImport(fromFile, spec) {
  if (IGNORE_PREFIXES.some((p) => spec.startsWith(p))) return { ok: true };

  // bare package؟
  if (isBareSpecifier(spec)) {
    // لو ضمن whitelist فاعتبره مقبولًا
    if (
      PACKAGE_WHITELIST.includes(spec) ||
      PACKAGE_WHITELIST.some((p) => spec === p || spec.startsWith(p + "/"))
    ) {
      return { ok: true };
    }
    // حاول require.resolve على الجذر
    try {
      // نسمح لـ require.resolve في CommonJS فقط، لكن هنا ESM — لذلك نستخدم trick:
      // نبحث في node_modules مباشرة
      const nm = path.resolve(ROOT, "node_modules", spec.split("/")[0]);
      if (fs.existsSync(nm)) return { ok: true };
    } catch {}
    return { ok: false, reason: "package", resolved: null };
  }

  // مطلق يبدأ بـ "/" => عامله كـ public
  if (spec.startsWith("/")) {
    const p = path.resolve(ROOT, "public" + spec);
    if (fs.existsSync(p)) return { ok: true, resolved: p };
    return { ok: false, reason: "public", resolved: p };
  }

  // نسبي من نفس الملف
  const resolved = path.resolve(path.dirname(fromFile), spec);
  // جرّب حلّ الامتداد تلقائيًا
  const candidates = [
    resolved,
    resolved + ".js",
    resolved + ".mjs",
    resolved + ".ts",
    path.join(resolved, "index.js"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return { ok: true, resolved: c };
  }
  return { ok: false, reason: "relative", resolved: candidates[0] };
}

const problems = [];

/* ====== فحص ملفات JS ====== */
const JS_FILES = listJsFiles();
const importRe =
  // import ... from 'x' | "x"
  /import\s+(?:[^'"]+\s+from\s+)?["']([^"']+)["']/g;

for (const f of JS_FILES) {
  const isDevConfig = DEV_CONFIG_FILES.has(path.basename(f));
  const text = read(f);
  let m;
  while ((m = importRe.exec(text))) {
    const spec = m[1].trim();

    // تجاهل builtins والأشياء المسموحة
    if (IGNORE_PREFIXES.some((p) => spec.startsWith(p))) continue;

    // ملفات الإعداد: سمح بالحزم ضمن whitelist دون resolve
    if (isDevConfig && isBareSpecifier(spec)) {
      if (
        PACKAGE_WHITELIST.includes(spec) ||
        PACKAGE_WHITELIST.some((p) => spec === p || spec.startsWith(p + "/"))
      ) {
        continue;
      }
    }

    const r = resolveJsImport(f, spec);
    if (!r.ok) {
      problems.push(`${f} → ${spec}`);
    }
  }
}

/* ====== فحص ملفات HTML ====== */
const HTML_FILES = listHtmlFiles();
for (const f of HTML_FILES) {
  const t = read(f);
  const norm = t.replace(/\s+/g, " ");
  for (const { tag, attr } of HTML_ATTRS) {
    const re = new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, "gi");
    let m;
    while ((m = re.exec(norm))) {
      const spec = m[1].trim();
      if (IGNORE_PREFIXES.some((p) => spec.startsWith(p))) continue;
      if (spec.includes("/assets/") && isHashedAsset(spec)) continue;

      // /path => public/path
      const pPublic = resolveHtmlPath(spec);
      if (pPublic) {
        if (!fs.existsSync(pPublic)) problems.push(`${f} → ${spec}`);
        continue;
      }

      // نسبي إلى ملف HTML نفسه
      if (spec.startsWith("./") || spec.startsWith("../")) {
        const abs = path.resolve(path.dirname(f), spec);
        if (!fs.existsSync(abs)) problems.push(`${f} → ${spec}`);
      }
    }
  }
}

if (problems.length) {
  console.error("❌ imports — تفاصيل بالأسفل");
  for (const p of problems) console.error(" - " + p);
  process.exit(1);
}

console.log("✅ imports");
