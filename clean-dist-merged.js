import fs from 'fs';
import path from 'path';

function deleteUnwantedFiles(dir) {
  if (!fs.existsSync(dir)) return;

  const ignoredNames = ['.DS_Store', 'null', 'undefined'];
  const ignoredExtensions = ['.map', '.md'];

  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      deleteUnwantedFiles(fullPath);
    } else {
      const shouldIgnore =
        ignoredNames.includes(file) ||
        ignoredExtensions.some(ext => file.endsWith(ext));

      if (shouldIgnore) {
        fs.unlinkSync(fullPath);
      }
    }
  });
}

function copyDir(srcRelative, destRelative) {
  const src = path.resolve(srcRelative);
  const dest = path.resolve(destRelative);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`✅ تم نسخ ${srcRelative} إلى ${destRelative}`);
  }
}

deleteUnwantedFiles(path.resolve('dist'));

copyDir('public/audio', 'dist-publish/audio');
copyDir('public/images', 'dist-publish/images');
copyDir('public/fonts', 'dist-publish/fonts');
copyDir('public/extra', 'dist-publish/extra');
