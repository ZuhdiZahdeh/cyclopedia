// src/core/items-repo.js
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../js/firebase-config.js';
import { getImagePath, getImageAlt, pickLocalized } from './media-utils.js';

/** …״±״§״¯״§״× „ƒ„ …ˆ״¶ˆ״¹ „״×״­״³† ״§„…״·״§״¨‚״© */
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

/** †״­״§ˆ„ where ״¹„‰ ״¹״¯״© ״­‚ˆ„ ״¯״§״®„ items */
async function tryQueries(colRef, key) {
  const fields = ['subject', 'subjectType', 'category.slug', 'key'];
  const values = subjectSynonyms(key);
  for (const f of fields) {
    for (const v of values) {
      try {
        const q = query(colRef, where(f, '==', v));
        const snap = await getDocs(q);
        if (!snap.empty) {
          if (import.meta.env.DEV) if (import.meta.env.DEV) console.log(`[items-repo] ג… items via ${f}=="${v}" ג†’ count=${snap.size}`);
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch {
        // ‚״¯ ״×״·„״¨ ‡״±״³״› †ƒ…„ ״¨״§„…״­״§ˆ„״§״× ״§„״£״®״±‰
      }
    }
  }
  return null;
}

/** „״×״±״© ״§״­״×״§״·״© ג€” ״¯״§״®„ items ‚״· ג€” ״­״³״¨ …״³״§״±״§״× ״§„״µˆ״± */
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
  if (import.meta.env.DEV) if (import.meta.env.DEV) console.log(`[items-repo] ג„¹ן¸ items via path-heuristic("${key}") ג†’ count=${out.length}`);
  return out;
}

/**
 * ״¬„״¨ ״¹†״§״µ״± …ˆ״¶ˆ״¹ …† …״¬…ˆ״¹״© items ‚״·.
 * strict=true: ״¥† „… ״×ˆ״¬״¯ …״·״§״¨‚״§״×״ ״¹״¯ [] ״¨״¯„ ƒ„ ״§„״¹†״§״µ״± („…†״¹ ״¸‡ˆ״± ״¹†״§״µ״± ״®״§״·״¦״©).
 */
export async function fetchSubjectItems(subjectKey, { strict = true } = {}) {
  const col = collection(db, 'items');

  // …״­״§ˆ„״© ״§״³״×״¹„״§…״§״× …״¨״§״´״±״©
  const hit = await tryQueries(col, subjectKey);
  if (hit && hit.length) return hit;

  // ״§״¬„״¨ ״§„ƒ„ ״«… ״¬״±‘״¨ „״×״±״© ״§„…״³״§״±
  const snapAll = await getDocs(col);
  const all = snapAll.docs.map(d => ({ id: d.id, ...d.data() }));
  if (import.meta.env.DEV) if (import.meta.env.DEV) console.log(`[items-repo] ג„¹ן¸ items(all) fetched ג†’ total=${all.length}`);

  const filtered = filterByPathHeuristic(all, subjectKey);
  if (filtered.length) return filtered;

  console.warn(`[items-repo] ג ן¸ no matches for subject="${subjectKey}"`);
  return strict ? [] : all;  // ג† ‡״°״§ …†״¹ ״³‚ˆ״· ״§„״µ״­״© ״¹„‰ ״¹†״§״µ״± ״÷״± ״µ״­״­״©
}

/** ״×״·״¨״¹ ״§„״¹†״µ״± „ˆ״§״¬‡״© ״§„״¹״±״¶ */
export function normalizeItemForView(raw, lang = 'ar') {
  const name = pickLocalized(raw?.name, lang);
  const description = pickLocalized(raw?.description, lang);
  const imagePath = getImagePath(raw);
  const imageAlt = getImageAlt(raw, lang) || name;

  return { id: raw.id, name, description, imagePath, imageAlt, _raw: raw };
}


