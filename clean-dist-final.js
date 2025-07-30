
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

function copyPublicAudioToDistPublish() {
  const src = path.resolve('public/audio');
  const dest = path.resolve('dist-publish/audio');

  try {
    fs.cpSync(src, dest, { recursive: true });
    console.log("✅ تم نسخ مجلد audio إلى dist-publish.");
  } catch (err) {
    console.error("❌ فشل نسخ مجلد الصوت:", err);
  }
}

deleteDSStoreFiles(path.resolve('dist'));
copyPublicAudioToDistPublish();
