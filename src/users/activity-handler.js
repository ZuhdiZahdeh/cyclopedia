import { db } from './firebase-config.js';
import { doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

// دالة لتسجيل نشاط المستخدم وزيادة النقاط والتحقق من الترقية
export async function recordActivity(user, categoryName) {
  if (!user || !user.uid) return;

  const userRef = doc(db, "users", user.uid);

  // زيادة النقطة وتسجيل النشاط
  const timestamp = Date.now().toString();
  const logEntry = {
    action: `تعرف على اسم في فئة ${categoryName}`,
    category: categoryName,
    timestamp: serverTimestamp()
  };

  await updateDoc(userRef, {
    points: increment(1),
    [`activityLog.${timestamp}`]: logEntry
  });

  // تحقق من النقاط الحالية لتحديث المستوى (اختياري حسب الحاجة)
  // يتم جلب البيانات مرة أخرى بعد التحديث
  // مفضل تنفيذه في صفحة الملف الشخصي أو عند عرض النقاط وليس كل مرة
}
