import fs from 'fs';
import path from 'path';

const basePath = path.resolve('dist');

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        // تحقق من أن المسار صالح ومقروء
        fs.readFileSync(fullPath);
      }
    } catch (err) {
      console.error("❌ File error:", fullPath);
      console.error("   Reason:", err.message);
    }
  });
}

walk(basePath);
