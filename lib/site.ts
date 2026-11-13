// Site-wide facts used for SEO (metadata, sitemap, structured data).
// Set NEXT_PUBLIC_SITE_URL to the live address if it ever changes (default https://www.akod.in).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.akod.in").replace(/\/+$/, "");
export const SITE_NAME = "AKOD GROUP";
export const SITE_TAGLINE = "Best Kerala Banana Chips Online – Made in God's Own Country";
export const SITE_DESCRIPTION =
  "AKOD brings you the best Kerala banana chips and authentic Kerala snacks, freshly made in God's Own Country in pure coconut oil. No preservatives. Order on WhatsApp – delivered across India.";

export const SITE_KEYWORDS = [
  "best Kerala banana chips",
  "Kerala banana chips",
  "Kerala banana chips online",
  "buy banana chips online India",
  "banana chips",
  "nendran banana chips",
  "coconut oil banana chips",
  "sweet banana chips",
  "Kerala sweet banana chips",
  "tangy tomato banana chips",
  "tapioca chips Kerala",
  "jackfruit chips Kerala",
  "Kerala snacks online",
  "authentic Kerala products",
  "made in Kerala",
  "God's Own Country snacks",
  "Kerala homemade snacks",
  "no preservatives snacks India",
  "AKOD",
  "AKOD GROUP",
  "AKOD banana chips",
];

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
