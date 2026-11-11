// ------------------------------------------------------------------
// Store data comes from AKOD ECO (GET /api/storefront/catalog).
// Products and categories are managed in AKOD ECO → Products. Only active
// categories and products with "Show on storefront" switched on appear here.
// Server-only: never import this file from a "use client" component.
// ------------------------------------------------------------------
import { cache } from "react";

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  emoji: string;
  color: string; // tailwind bg class used for tiles
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
  emoji: string;
  color: string;
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
  variants: Variant[];
};

type ApiCategory = { slug: string; name: string; description: string; image: string | null; productCount: number };
type ApiProduct = Omit<Product, "emoji" | "color" | "image" | "bestSeller"> & { bestSeller: boolean };
type ApiCatalog = { categories: ApiCategory[]; products: ApiProduct[] };

const API_URL = (process.env.AKOD_ECO_API_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const REVALIDATE_SECONDS = Number(process.env.CATALOG_REVALIDATE_SECONDS) || 60;

// ---- Look & feel: emoji + tile colour picked from the name (AKOD ECO has no such fields) ----
const COLORS = ["bg-amber-100", "bg-red-100", "bg-orange-100", "bg-lime-100", "bg-yellow-100", "bg-emerald-100", "bg-rose-100", "bg-sky-100"];

const EMOJI_RULES: [RegExp, string][] = [
  [/banana/, "🍌"], [/jackfruit/, "🍈"], [/tapioca|potato/, "🥔"], [/murukku/, "🌀"], [/mixture|namkeen/, "🥨"],
  [/pepper/, "⚫"], [/cardamom|elaichi/, "🟢"], [/turmeric|haldi/, "🟡"], [/chil+i|mirch/, "🌶️"], [/masala|salt/, "🧂"],
  [/coconut/, "🥥"], [/clove/, "🌰"], [/cashew|groundnut|peanut|\bnut/, "🥜"], [/almond|badam/, "🌰"], [/raisin|grape/, "🍇"], [/date/, "🟤"],
  [/walnut/, "🧠"], [/pistachio/, "🟩"], [/moringa|leaf|herb/, "🌿"], [/ragi|millet|wheat|rice|grain/, "🌾"],
  [/beetroot/, "🟣"], [/amla|gooseberry/, "🍏"], [/coconut/, "🥥"], [/sesame|gingelly/, "🫘"], [/mustard/, "🟡"],
  [/honey/, "🍯"], [/tea/, "🍵"], [/coffee/, "☕"], [/sweet|halwa|laddu/, "🍬"], [/pickle/, "🫙"],
  [/snack|chips/, "🍿"], [/spice/, "🌶️"], [/dry fruit/, "🥜"], [/powder/, "🌿"], [/oil|ghee/, "🫒"],
];

const pickEmoji = (text: string, fallback: string) => {
  const t = text.toLowerCase();
  return EMOJI_RULES.find(([re]) => re.test(t))?.[1] ?? fallback;
};

// ---- Fetch ----
const EMPTY: ApiCatalog = { categories: [], products: [] };

async function fetchCatalog(): Promise<ApiCatalog> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (process.env.STOREFRONT_API_KEY) headers["x-storefront-key"] = process.env.STOREFRONT_API_KEY;
  try {
    const res = await fetch(`${API_URL}/api/storefront/catalog`, { headers, next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) {
      console.error(`[catalog] AKOD ECO responded ${res.status} for ${API_URL}/api/storefront/catalog`);
      return EMPTY;
    }
    return (await res.json()) as ApiCatalog;
  } catch (error) {
    console.error(`[catalog] Could not reach AKOD ECO at ${API_URL}:`, error);
    return EMPTY;
  }
}

/** Whole catalog, fetched once per request (and cached for REVALIDATE_SECONDS between requests). */
export const getCatalog = cache(async () => {
  const data = await fetchCatalog();

  const categories: Category[] = data.categories
    .filter((c) => c.productCount > 0)
    .map((c, i) => ({
      slug: c.slug,
      name: c.name,
      tagline: c.description,
      emoji: pickEmoji(c.name, "🛍️"),
      color: COLORS[i % COLORS.length],
      image: c.image,
      productCount: c.productCount,
    }));
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));

  const products: Product[] = data.products.map((p) => {
    const cat = catBySlug.get(p.category);
    return {
      ...p,
      emoji: pickEmoji(p.name, cat?.emoji ?? "🛍️"),
      color: cat?.color ?? "bg-neutral-100",
      image: p.images[0],
      description: p.description || p.summary,
    };
  });

  return { categories, products };
});

export const getCategories = async () => (await getCatalog()).categories;
export const getProducts = async () => (await getCatalog()).products;
export const getCategory = async (slug: string) => (await getCategories()).find((c) => c.slug === slug);
export const getProduct = async (slug: string) => (await getProducts()).find((p) => p.slug === slug);
export const getProductsByCategory = async (slug: string) => (await getProducts()).filter((p) => p.category === slug);
export const bestSellers = async () => (await getProducts()).filter((p) => p.bestSeller);
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
