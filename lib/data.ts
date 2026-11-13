// ------------------------------------------------------------------
// Store data comes from AKOD ECO (GET /api/storefront/catalog).
// Products and categories are managed in AKOD ECO → Products. Only active
// categories and products with "Show on storefront" switched on appear here.
// Server-side only: never import this file from a "use client" component.
// ------------------------------------------------------------------
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { cutoutUrl } from "./cutout";

/**
 * Local photo fallback: public/products/<product-slug>.(png|webp|jpg|jpeg), used when the product
 * has no photo in AKOD ECO. Photos uploaded in AKOD ECO always win.
 */
const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");
const LOCAL_EXTS = ["png", "webp", "jpg", "jpeg"];
function localPhoto(slug: string): string | undefined {
  for (const ext of LOCAL_EXTS) {
    if (existsSync(path.join(PRODUCTS_DIR, `${slug}.${ext}`))) return `/products/${slug}.${ext}`;
  }
  return undefined;
}

/**
 * Stand-in photos for products that have none yet: the named pack cut-outs in public/products
 * (e.g. sweet-banana-chips.png). Each product always gets the same one. Remove by uploading
 * a real photo in AKOD ECO.
 */
function standInPhotos(): string[] {
  try {
    return readdirSync(PRODUCTS_DIR)
      .filter((f) => /^[a-z0-9-]+\.png$/.test(f) && !f.startsWith("logo"))
      .sort()
      .map((f) => `/products/${f}`);
  } catch {
    return [];
  }
}
const pickStandIn = (pool: string[], key: string) =>
  pool.length ? pool[[...key].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % pool.length] : undefined;

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  tone: string; // soft tailwind background used when there is no photo
  image: string | null;
  productCount: number;
};

export type Variant = {
  id: string;
  sku: string;
  name: string; // e.g. "250 g"
  price: number;
  mrp: number;
  image: string | null;
  inStock: boolean;
};

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: string; // category slug
  categoryName: string;
  price: number; // selling price (INR)
  mrp: number; // original price (INR)
  weight: string;
  tone: string;
  image?: string;
  images: string[];
  description: string;
  summary: string;
  story: string;
  ingredients: string;
  shelfLife: string;
  freeDelivery: boolean;
  inStock: boolean;
  bestSeller?: boolean;
  /** Ticked "Show in Home Banner" in AKOD ECO */
  inBanner?: boolean;
  variants: Variant[];
  /** Live offer already applied to the prices above (from AKOD ECO → Offers) */
  offer?: { id: string; name: string; label: string };
};

type ApiCategory = { slug: string; name: string; description: string; image: string | null; productCount: number };
type ApiProduct = Omit<Product, "tone" | "image" | "bestSeller"> & { bestSeller: boolean };
/** A live offer (AKOD ECO → Offers). */
export type Offer = {
  id: string;
  name: string;
  label: string; // "15% OFF" / "₹50 OFF"
  description: string;
  endDate: string; // YYYY-MM-DD or ""
  appliesTo: "all" | "categories" | "products";
  categories: string[]; // slugs
};
type ApiCatalog = { categories: ApiCategory[]; products: ApiProduct[]; offers?: Offer[] };

const API_URL = (process.env.AKOD_ECO_API_URL ?? "http://localhost:3000").replace(/\/+$/, "");

/** Soft backgrounds for photo-less products and categories (literal class names so Tailwind keeps them). */
const TONES = ["bg-amber-50", "bg-rose-50", "bg-lime-50", "bg-orange-50", "bg-emerald-50", "bg-yellow-50", "bg-stone-100", "bg-red-50"];

/** "NATURAL OIL" → "Natural Oil"; names already in mixed case are kept as typed. */
const displayName = (s: string) =>
  s === s.toUpperCase() ? s.toLowerCase().replace(/(^|[\s&/-])([a-z])/g, (_, a: string, b: string) => a + b.toUpperCase()) : s;

// ---- Fetch ----
const EMPTY: ApiCatalog = { categories: [], products: [], offers: [] };

/** Give up on AKOD ECO after this long instead of leaving the page loading. */
const FETCH_TIMEOUT_MS = 8000;

async function fetchCatalog(): Promise<ApiCatalog> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (process.env.STOREFRONT_API_KEY) headers["x-storefront-key"] = process.env.STOREFRONT_API_KEY;
  try {
    const res = await fetch(`${API_URL}/api/storefront/catalog`, {
      headers,
      cache: "no-store", // always live from AKOD ECO — no caching
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`AKOD ECO responded ${res.status}`);
    const data = (await res.json()) as ApiCatalog;
    return Array.isArray(data.products) && Array.isArray(data.categories) ? data : EMPTY;
  } catch (error) {
    console.error(`[catalog] Could not load from ${API_URL}:`, error);
    return EMPTY;
  }
}

/** Whole catalog, fetched once per request (never cached). */
export const getCatalog = cache(async () => {
  const data = await fetchCatalog();

  const categories: Category[] = data.categories
    .filter((c) => c.productCount > 0)
    .map((c, i) => ({
      slug: c.slug,
      name: displayName(c.name),
      tagline: c.description,
      tone: TONES[i % TONES.length],
      image: c.image,
      productCount: c.productCount,
    }));
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));
  const pool = standInPhotos();

  const products: Product[] = data.products.map((p) => {
    const cat = catBySlug.get(p.category);
    const local = p.images.length ? undefined : (localPhoto(p.slug) ?? pickStandIn(pool, p.slug));
    // Uploaded photos are served as cut-outs (studio background removed)
    const images = local ? [local] : p.images.map(cutoutUrl);
    return {
      ...p,
      images,
      variants: p.variants.map((v) => ({ ...v, image: v.image ? cutoutUrl(v.image) : v.image })),
      categoryName: cat?.name ?? displayName(p.categoryName),
      tone: cat?.tone ?? "bg-stone-100",
      image: images[0],
      description: p.description || p.summary,
    };
  });

  return { categories, products, offers: data.offers ?? [] };
});

export const getCategories = async () => (await getCatalog()).categories;
export const getProducts = async () => (await getCatalog()).products;
export const getCategory = async (slug: string) => (await getCategories()).find((c) => c.slug === slug);
export const getProduct = async (slug: string) => (await getProducts()).find((p) => p.slug === slug);
export const getProductsByCategory = async (slug: string) => (await getProducts()).filter((p) => p.category === slug);
export const searchProducts = async (q: string) => {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return (await getProducts()).filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      p.categoryName.toLowerCase().includes(term)
  );
};

export { formatPrice } from "./format";
