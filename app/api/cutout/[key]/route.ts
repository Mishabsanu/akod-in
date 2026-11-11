import sharp from "sharp";
import { fromBase64Url, isCutoutSource } from "@/lib/cutout";

export const runtime = "nodejs";

const MAX_SIDE = 1400;
const T_LO = 10; // colour distance: fully background below this…
const T_HI = 32; // …fully kept above this (soft edge / shadow in between)

/**
 * GET /api/cutout/<base64url of a Cloudinary photo URL>
 * Removes the studio background: pixels connected to the image border whose colour is close to the
 * border colour become transparent (inside the pack is never touched), then trims to the product.
 * Cloudinary URLs are versioned, so the result is cached for a year.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  let src = "";
  try {
    src = fromBase64Url(key);
  } catch {}
  if (!isCutoutSource(src)) return new Response("Not found", { status: 404 });

  const upstream = await fetch(src).catch(() => null);
  if (!upstream?.ok) return new Response("Image unavailable", { status: 502 });
  const input = Buffer.from(await upstream.arrayBuffer());

  try {
    const { data, info } = await sharp(input)
      .rotate()
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width: w, height: h } = info;
    const px = w * h;

    // Background colour = median of the border pixels
    const border: number[][] = [[], [], []];
    const sample = (i: number) => {
      for (let c = 0; c < 3; c++) border[c].push(data[i * 4 + c]);
    };
    for (let x = 0; x < w; x++) (sample(x), sample((h - 1) * w + x));
    for (let y = 0; y < h; y++) (sample(y * w), sample(y * w + w - 1));
    const bg = border.map((ch) => ch.sort((a, b) => a - b)[ch.length >> 1]);

    // Distance from the background colour (already-transparent pixels count as background)
    const dist = new Float32Array(px);
    for (let i = 0; i < px; i++) {
      const o = i * 4;
      dist[i] =
        data[o + 3] < 16 ? 0 : Math.hypot(data[o] - bg[0], data[o + 1] - bg[1], data[o + 2] - bg[2]);
    }

    // Flood fill from the border through background-like pixels
    const region = new Uint8Array(px);
    const queue = new Int32Array(px);
    let head = 0;
    let tail = 0;
    const seed = (i: number) => {
      if (!region[i] && dist[i] < T_HI) {
        region[i] = 1;
        queue[tail++] = i;
      }
    };
    for (let x = 0; x < w; x++) (seed(x), seed((h - 1) * w + x));
    for (let y = 0; y < h; y++) (seed(y * w), seed(y * w + w - 1));
    while (head < tail) {
      const i = queue[head++];
      const x = i % w;
      if (x > 0) seed(i - 1);
      if (x < w - 1) seed(i + 1);
      if (i >= w) seed(i - w);
      if (i < px - w) seed(i + w);
    }

    // Fade alpha inside the background region (keeps soft shadows soft); find the product's box
    let minX = w,
      minY = h,
      maxX = -1,
      maxY = -1;
    for (let i = 0; i < px; i++) {
      const o = i * 4;
      if (region[i]) {
        const a = Math.max(0, Math.min(1, (dist[i] - T_LO) / (T_HI - T_LO)));
        data[o + 3] = Math.round(Math.min(data[o + 3], a * 255));
      }
      if (data[o + 3] > 12) {
        const x = i % w;
        const y = (i / w) | 0;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    if (maxX < 0) return new Response("Empty image", { status: 422 });

    const m = Math.round(0.02 * Math.max(w, h));
    const left = Math.max(0, minX - m);
    const top = Math.max(0, minY - m);
    const out = await sharp(data, { raw: { width: w, height: h, channels: 4 } })
      .extract({ left, top, width: Math.min(w, maxX + m + 1) - left, height: Math.min(h, maxY + m + 1) - top })
      .webp({ quality: 88, alphaQuality: 90 })
      .toBuffer();

    return new Response(new Uint8Array(out), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[cutout] failed for", src, error);
    // Fall back to the original photo rather than a broken image
    return Response.redirect(src, 302);
  }
}
