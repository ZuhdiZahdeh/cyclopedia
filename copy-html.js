// copy-html.js
import fs from 'fs';
import path from 'path';

const sourceDir = path.resolve('html');
const targetDir = path.resolve('dist/html');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.readdirSync(sourceDir).forEach((file) => {
  if (file.endsWith('.html')) {
    const srcFile = path.join(sourceDir, file);
    const destFile = path.join(targetDir, file);
    fs.copyFileSync(srcFile, destFile);
    console.log(`✅ Copied ${file} to dist/html/`);
  }
});
