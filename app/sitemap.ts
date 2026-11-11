import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/data";
import { originalPhoto } from "@/lib/cutout";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

/** /sitemap.xml — home, every category and every product (with photos), refreshed hourly. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, products } = await getCatalog();
  const now = new Date();
  const img = (u?: string) => {
    if (!u) return [];
    const o = originalPhoto(u);
    return [o.startsWith("http") ? o : absoluteUrl(o)];
  };

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/search"), lastModified: now, changeFrequency: "daily", priority: 0.6 },
    ...categories.map((c) => ({
      url: absoluteUrl(`/category/${c.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: img(c.image ?? undefined),
    })),
    ...products.map((p) => ({
      url: absoluteUrl(`/product/${p.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: p.images.slice(0, 5).flatMap((u) => img(u)),
    })),
  ];
}
