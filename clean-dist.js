import fs from 'fs';
import path from 'path';

function deleteDSStoreFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      deleteDSStoreFiles(fullPath);
    } else if (file === '.DS_Store') {
      console.log("🧹 حذف:", fullPath);
      fs.unlinkSync(fullPath);
    }
  });
}

deleteDSStoreFiles(path.resolve('dist'));
