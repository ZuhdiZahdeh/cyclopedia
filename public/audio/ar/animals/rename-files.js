// rename-files.js
const fs = require('fs');
const path = require('path');

// ✅ هذا هو المسار الصحيح لمجلد الملفات
const folderPath = 'E:/cyclopedia/public/audio/ar/animals/New folder';

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('❌ خطأ في قراءة المجلد:', err);
    return;
  }

  files.forEach((file) => {
    const oldPath = path.join(folderPath, file);

    // ✅ نتأكد أن الملف هو mp3 فقط
    if (!file.endsWith('.mp3')) return;

    // ✅ تعديل الاسم من alligator_boy_teacher_.mp3 إلى alligator_teacher_ar.mp3
    const newFile = file
      .replace('_boy_', '_')       // حذف كلمة boy
      .replace(/_\.mp3$/, '_ar.mp3'); // استبدال _ في النهاية بـ ar

    const newPath = path.join(folderPath, newFile);

    if (oldPath !== newPath) {
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error(`❌ فشل في إعادة تسمية ${file}:`, err);
        } else {
          console.log(`✔ ${file} → ${newFile}`);
        }
      });
    }
  });
});
