// src/core/items-repo-lite.js
// ‚״±״§״¡״© ‚״· ״¨״¯ˆ† ‚†ˆ״§״× WebChannel (״£״® ˆ״£״³״±״¹ „„״¹״±״¶)
// ״§״³״×״¹…„‡  ״µ״­״§״× ״§„…ˆ״§״¶״¹ ״§„״× „״§ ״×״­״×״§״¬ ״×״­״¯״« „״­״¸

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore/lite';
import { firebaseConfig } from '../core/firebase-config.js'; // ״¹״¯‘„ ״§„…״³״§״± ״¥† „״²…

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

function docToObj(d) { return { id: d.id, ...d.data() }; }

/** ״¥״­״¶״§״± ״§„״¹†״§״µ״± ״­״³״¨ †ˆ״¹ ״§„…ˆ״¶ˆ״¹ (animal / fruit / vegetable / human_body / profession / tools ...) */
export async function getItemsByType(type, opts = {}) {
  const { order = 'name.ar', take = 500 } = opts;
  // …„״§״­״¸״©: orderBy ״¨״­‚„ …״±״¯ „״§ ״­״×״§״¬ ‡״±״³ …״±ƒ‘״¨
  const col = collection(db, 'items');
  const q   = query(col, where('type', '==', type), orderBy(order), limit(take));
  const snap = await getDocs(q);
  const arr = snap.docs.map(docToObj);
  if (import.meta.env.DEV) if (import.meta.env.DEV) console.log('[items-repo-lite]', `type=${type}`, 'count=', arr.length);
  return arr;
}

/** ״¹†״µ״± …״±״¯ ״¨״§„…״¹״±‘ */
export async function getItemById(id) {
  const col = collection(db, 'items');
  const q = query(col, where('__name__', '==', id), limit(1));
  const snap = await getDocs(q);
  const d = snap.docs[0];
  return d ? docToObj(d) : null;
}


