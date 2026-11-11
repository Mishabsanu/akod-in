// Product photo cut-outs: the studio background (light area touching the edges) is removed,
// so packs stand straight on the page. Served by app/api/cutout/[key].

/** Only photos from Cloudinary are processed (that is where AKOD ECO stores uploads). */
export const isCutoutSource = (url: string) => /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(url);

const toBase64Url = (s: string) => Buffer.from(s, "utf8").toString("base64url");
export const fromBase64Url = (s: string) => Buffer.from(s, "base64url").toString("utf8");

/** Public path of the cut-out for a Cloudinary photo; other URLs are returned unchanged. */
export function cutoutUrl(url: string): string {
  return isCutoutSource(url) ? `/api/cutout/${toBase64Url(url)}` : url;
}

/** Original photo behind a cut-out URL (for share previews and Google, which prefer a plain JPG). */
export function originalPhoto(url: string): string {
  const m = /^\/api\/cutout\/([A-Za-z0-9_-]+)$/.exec(url);
  if (!m) return url;
  try {
    const src = fromBase64Url(m[1]);
    return isCutoutSource(src) ? src : url;
  } catch {
    return url;
  }
}
