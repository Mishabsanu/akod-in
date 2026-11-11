import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** /robots.txt — let search engines crawl the shop, skip internal endpoints and search result pages. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/cart", "/search?"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
