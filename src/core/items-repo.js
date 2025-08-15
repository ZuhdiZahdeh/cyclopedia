// src/core/items-repo.js
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../js/firebase-config.js';
import { getImagePath, getImageAlt, pickLocalized } from './media-utils.js';

/** مرادفات لكل موضوع لتحسين المطابقة */
function subjectSynonyms(key) {
  const k = String(key || '').toLowerCase();
  const map = {
    animals:     ['animals','animal'],
    fruits:      ['fruits','fruit'],
    vegetables:  ['vegetables','vegetable','veggies'],
    human_body:  [
      'human_body','human-body','human body','humanbody',
      'body','bodyparts','body_parts','organs','skeleton','bones'
    ],
    tools:       ['tools','tool','profession_tools','profession-tools'],
    professions: ['professions','profession','jobs','job'],
  };
  return map[k] || [k];
}

/** نحاول where على عدة حقول داخل items */
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
        // قد يتطلب فهرس؛ نكمل بالمحاولات الأخرى
      }
    }
  }
  return null;
}

/** فلترة احتياطية — داخل items فقط — حسب مسارات الصور */
function filterByPathHeuristic(all, key) {
  const needles = subjectSynonyms(key).map(v => `/${v}/`);
  const out = all.filter(item => {
    const imgs = item?.media?.images;
    if (Array.isArray(imgs) && imgs.length) {
      return imgs.some(im => {
        const p = String(im?.path || '');
        return needles.some(n => p.includes(n));
      });
    }
    const p = String(item?.image_path || '');
    return needles.some(n => p.includes(n));
  });
  console.log(`[items-repo] ℹ️ items via path-heuristic("${key}") → count=${out.length}`);
  return out;
}

/**
 * يجلب عناصر موضوع من مجموعة items فقط.
 * strict=true: إن لم توجد مطابقات، يُعيد [] بدل كل العناصر (لمنع ظهور عناصر خاطئة).
 */
export async function fetchSubjectItems(subjectKey, { strict = true } = {}) {
  const col = collection(db, 'items');

  // محاولة استعلامات مباشرة
  const hit = await tryQueries(col, subjectKey);
  if (hit && hit.length) return hit;

  // اجلب الكل ثم جرّب فِلترة المسار
  const snapAll = await getDocs(col);
  const all = snapAll.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`[items-repo] ℹ️ items(all) fetched → total=${all.length}`);

  const filtered = filterByPathHeuristic(all, subjectKey);
  if (filtered.length) return filtered;

  console.warn(`[items-repo] ⚠️ no matches for subject="${subjectKey}"`);
  return strict ? [] : all;  // ← هذا يمنع سقوط الصفحة على عناصر غير صحيحة
}

/** تطبيع العنصر لواجهة العرض */
export function normalizeItemForView(raw, lang = 'ar') {
  const name = pickLocalized(raw?.name, lang);
  const description = pickLocalized(raw?.description, lang);
  const imagePath = getImagePath(raw);
  const imageAlt = getImageAlt(raw, lang) || name;

  return { id: raw.id, name, description, imagePath, imageAlt, _raw: raw };
}
