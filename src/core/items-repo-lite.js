// src/core/items-repo-lite.js
// قراءة فقط بدون قنوات WebChannel (أخف وأسرع للعرض)
// استعمله في صفحات المواضيع التي لا تحتاج تحديث لحظي

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore/lite';
import { firebaseConfig } from '../core/firebase-config.js'; // عدِّل المسار إن لزم

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

function docToObj(d) { return { id: d.id, ...d.data() }; }

/** إحضار العناصر حسب نوع الموضوع (animal / fruit / vegetable / human_body / profession / tools ...) */
export async function getItemsByType(type, opts = {}) {
  const { order = 'name.ar', take = 500 } = opts;
  // ملاحظة: orderBy بحقل مفرد لا يحتاج فهرس مركّب
  const col = collection(db, 'items');
  const q   = query(col, where('type', '==', type), orderBy(order), limit(take));
  const snap = await getDocs(q);
  const arr = snap.docs.map(docToObj);
  console.log('[items-repo-lite]', `type=${type}`, 'count=', arr.length);
  return arr;
}

/** عنصر مفرد بالمعرّف */
export async function getItemById(id) {
  const col = collection(db, 'items');
  const q = query(col, where('__name__', '==', id), limit(1));
  const snap = await getDocs(q);
  const d = snap.docs[0];
  return d ? docToObj(d) : null;
}
