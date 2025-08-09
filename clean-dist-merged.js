// clean-dist-merged.js  (موحّد للنشر من dist)
import fs from 'fs';
import path from 'path';

const DIST   = path.resolve('dist');
const PUBLIC = path.resolve('public');

function deleteUnwantedFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const ignoredNames      = ['.DS_Store', 'null', 'undefined'];
  const ignoredExtensions = ['.map', '.md'];

  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      deleteUnwantedFiles(full);
    } else {
      const shouldDelete =
        ignoredNames.includes(entry) ||
        ignoredExtensions.some(ext => entry.endsWith(ext));
      if (shouldDelete) fs.unlinkSync(full);
    }
  }
}

function ensureCopied(srcRel, destRel) {
  const src  = path.join(PUBLIC, srcRel);
  const dest = path.join(DIST,   destRel);
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log(`✅ نسخ ${srcRel} → ${destRel}`);
}

function verifyRequired(paths) {
  let ok = true;
  for (const p of paths) {
    const full = path.join(DIST, p);
    if (!fs.existsSync(full)) {
      console.error(`❌ مفقود: dist/${p}`);
      ok = false;
    }
  }
  if (!ok) {
    console.error('⚠️ يرجى التأكد أن الملفات الجزئية داخل public/html/* قبل البناء.');
    process.exitCode = 1; // لا نفشل البناء لكن نُظهر كود خروج تحذيري
  }
}

// 1) تنظيف ملفات غير مطلوبة من dist
deleteUnwantedFiles(DIST);

// 2) تأكيد وجود html الجزئية داخل dist (لو نُسيت داخل public)
ensureCopied('html', 'html'); // لا يضر إن كانت موجودة مسبقًا

// 3) تحقق صريح
verifyRequired([
  'html/fruits.html',
  'html/animals.html',
  'html/vegetables.html',
  'html/professions.html',
  'html/tools-match.html',
  'html/alphabet-press.html'
]);
