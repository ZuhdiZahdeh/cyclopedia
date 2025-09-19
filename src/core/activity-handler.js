// activity-handler.js — safe activity logging

import { db } from '../js/firebase-config.js';
import {
  collection, addDoc, serverTimestamp
} from 'firebase/firestore';

// احصل على المستخدم الحالي (من localStorage أو كائن مباشر)
function getCurrentUser(maybeUser) {
  try {
    if (maybeUser && (maybeUser.uid || maybeUser.userId)) return maybeUser;
    const u = JSON.parse(localStorage.getItem('user'));
    if (u && (u.uid || u.userId)) return u;
  } catch {}
  return null;
}

/**
 * سجل نشاطًا آمنًا.
 * الاستخدامات المقبولة:
 *   recordActivity(user, "memory")          // نوع فقط
 *   recordActivity(user, {type:"memory", extra:"..."})  // حمولة مخصّصة
 *   recordActivity("memory")                // سيقرأ المستخدم من localStorage
 */
export async function recordActivity(userOrPayload, typeOrPayload) {
  const user = getCurrentUser(
    typeof userOrPayload === 'object' && userOrPayload && !typeOrPayload ? userOrPayload : undefined
  ) || getCurrentUser();

  // إذا لا يوجد مستخدم مصادَق — لا تكتب شيئًا
  if (!user || !(user.uid || user.userId)) {
    return; // resolve silently
  }
  const uid = user.uid || user.userId;

  // ابنِ الحمولة
  let payload;
  if (typeof userOrPayload === 'string' && !typeOrPayload) {
    payload = { type: userOrPayload };
  } else if (typeof typeOrPayload === 'string') {
    payload = { type: typeOrPayload };
  } else if (typeof typeOrPayload === 'object' && typeOrPayload) {
    payload = { ...typeOrPayload };
  } else if (typeof userOrPayload === 'object' && userOrPayload && userOrPayload.type) {
    payload = { ...userOrPayload };
  } else {
    payload = { type: 'generic' };
  }

  // أضف التوقيت إن لم يوجد
  if (!payload.ts) payload.ts = serverTimestamp();

  try {
    await addDoc(collection(db, 'activity', uid, 'events'), payload);
  } catch (e) {
    // كتم أخطاء الأذونات (ضيف أو قواعد Firestore تمنع الكتابة)
    const msg = String(e && (e.code || e.message) || '');
    if (msg.includes('permission-denied') || /insufficient permissions/i.test(msg)) {
      return; // لا تُزعج الـConsole
    }
    // غير ذلك: سجّل تحذيرًا لطيفًا بدون رمي
    console.warn('[activity] recordActivity failed:', e);
  }
}

// اختياري: دالة ملائمة تُغلف النوع فقط
export function recordSimple(type, extra = {}) {
  return recordActivity({ type, ...extra });
}
