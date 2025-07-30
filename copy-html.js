// copy-html.js - نسخة آمنة مع كشف الأخطاء
import fs from 'fs';
import path from 'path';

const sourceDir = path.resolve('html');
const targetDir = path.resolve('dist/html');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.readdirSync(sourceDir).forEach((file) => {
  try {
    if (file.endsWith('.html')) {
      const srcFile = path.join(sourceDir, file);
      const destFile = path.join(targetDir, file);

      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, destFile);
        console.log(`✅ Copied ${file} to dist/html/`);
      } else {
        console.warn(`⚠️ File not found: ${srcFile}`);
      }
    }
  } catch (err) {
    console.error(`❌ Failed to copy ${file}:`, err.message);
  }
});
