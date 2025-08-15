// src/core/items-repo.js
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../js/firebase-config.js';
import { getImagePath, getImageAlt, pickLocalized } from './media-utils.js';

/** مرادفات معقولة لمفاتيح المواضيع */
function subjectSynonyms(key) {
  const k = String(key).toLowerCase();
  const map = {
    animals:     ['animals','animal'],
    fruits:      ['fruits','fruit'],
    vegetables:  ['vegetables','vegetable','veggies'],
    human_body:  ['human_body','human-body','human body','body','humanbody'],
    tools:       ['tools','tool','profession_tools','profession-tools'],
    professions: ['professions','profession','jobs','job'],
  };
  return map[k] || [k];
}

/** نجرب where على عدة حقول داخل items */
async function tryQueries(colRef, key) {
  const fields = ['subject', 'subjectType', 'category.slug', 'key'];
  const values = subjectSynonyms(key);
  for (const f of fields) {
    for (const v of values) {
      try {
        const q = query(colRef, where(f, '==', v));
        const snap = await getDocs(q);
        if (!snap.empty) {
          console.log(`[items-repo] ✅ items via ${f}=="${v}" → count=${snap.size}`);
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch {
        /* قد يتطلب فهرس — سنتابع المحاولات الأخرى */
      }
    }
  }
  return null;
}

/** فلترة احتياطية (داخل items فقط) حسب مسارات الصور */
function filterByPathHeuristic(all, key) {
  const needles = subjectSynonyms(key).map(v => `/${v}/`);
  const out = all.filter(item => {
    const imgs = item?.media?.images;
    if (Array.isArray(imgs) && imgs.length) {
      return imgs.some(im => needles.some(n => String(im?.path || '').includes(n)));
    }
    const p = String(item?.image_path || '');
    return needles.some(n => p.includes(n));
  });
  console.log(`[items-repo] ℹ️ items via path-heuristic("${key}") → count=${out.length}`);
  return out;
}

export async function fetchSubjectItems(subjectKey) {
  const col = collection(db, 'items');

  // 1) استعلام مباشر داخل items
  const hit = await tryQueries(col, subjectKey);
  if (hit && hit.length) return hit;

  // 2) Fallback داخل items فقط (لا رجوع لأي collection قديم)
  const snapAll = await getDocs(col);
  const all = snapAll.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`[items-repo] ℹ️ items(all) fetched → total=${all.length}`);

  const filtered = filterByPathHeuristic(all, subjectKey);
  return filtered.length ? filtered : all;
}

/** تطبيع عنصر للواجهة */
export function normalizeItemForView(raw, lang = 'ar') {
  const name = pickLocalized(raw?.name, lang);
  const description = pickLocalized(raw?.description, lang);
  const imagePath = getImagePath(raw);
  const imageAlt = getImageAlt(raw, lang) || name;

  return { id: raw.id, name, description, imagePath, imageAlt, _raw: raw };
}
