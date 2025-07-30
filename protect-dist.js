import fs from 'fs';
import path from 'path';

const suspicious = ['null', 'undefined', ''];

function scan(dir) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scan(full);
    } else if (suspicious.includes(file)) {
      console.warn("⚠️ ملف مشتبه به:", full);
      fs.unlinkSync(full);
      console.log("🧹 تم الحذف:", full);
    }
  });
}

scan(path.resolve("dist"));

