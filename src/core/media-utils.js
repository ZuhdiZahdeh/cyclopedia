// src/core/media-utils.js
/** أدوات موحّدة لالتقاط صورة العنصر والحقول المترجمة */

export function pickLocalized(mapLike, lang = 'ar') {
  if (!mapLike || typeof mapLike !== 'object') return '';
  return mapLike[lang] || mapLike.ar || mapLike.en || mapLike.he || '';
}

export function getMainImageObject(item) {
  const imgs = item?.media?.images;
  if (Array.isArray(imgs) && imgs.length) {
    const main =
      imgs.find(im => im?.role === 'main') ||
      imgs.find(im => im?.id === 'main') ||
      imgs[0];
    if (main?.path) return main; // {path, alt?, ...}
  }
  if (item?.image_path) return { path: item.image_path, alt: {} }; // توافق للخلف
  return null;
}

export function getImagePath(item) {
  const obj = getMainImageObject(item);
  if (!obj?.path) return '';
  const p = String(obj.path).replace(/^public\//, '');
  return p.startsWith('/') ? p : `/${p}`;
}

export function getImageAlt(item, lang = 'ar') {
  const obj = getMainImageObject(item);
  const alt = obj?.alt || {};
  return pickLocalized(alt, lang) || pickLocalized(item?.name, lang) || '';
}

export function slugify(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]+/g, '');
}
