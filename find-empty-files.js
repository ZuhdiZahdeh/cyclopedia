import fs from 'fs';
import path from 'path';

function findEmptyFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findEmptyFiles(fullPath);
    } else if (stat.size === 0) {
      console.warn("❌ ملف فارغ:", fullPath);
    }
  });
}

findEmptyFiles(path.resolve("dist"));
