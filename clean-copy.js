// clean-copy.js - نسخ dist إلى dist-publish مع تنظيف الملفات المشبوهة
import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('dist');
const destDir = path.resolve('dist-publish');

function copyAndClean(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyAndClean(srcPath, destPath);
    } else {
      // حذف الملفات غير المرغوب فيها
      const ignored = ['.DS_Store', 'null', 'undefined'];
      const extIgnored = ['.map', '.md'];

      if (ignored.includes(file) || extIgnored.some(e => file.endsWith(e))) {
        console.warn("🧹 حذف:", srcPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log("✅ نسخ:", destPath);
      }
    }
  });
}

copyAndClean(srcDir, destDir);
