import type { Category, Product } from "@/lib/data";
import { originalPhoto } from "@/lib/cutout";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

/** Structured data (schema.org) so Google shows rich results: brand, products, prices, breadcrumbs. */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON from our own data; "<" is escaped so it cannot close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const abs = (u?: string | null) => {
  if (!u) return undefined;
  const o = originalPhoto(u);
  return o.startsWith("http") ? o : absoluteUrl(o);
};

export const organizationLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: ["AKOD", "AKOD Banana Chips"],
  url: SITE_URL,
  logo: absoluteUrl("/products/logo.jpg"),
  description: SITE_DESCRIPTION,
  slogan: "Best Kerala banana chips, made in God's Own Country",
  foundingLocation: { "@type": "Place", name: "Kerala, India" },
  areaServed: { "@type": "Country", name: "India" },
  ...(WHATSAPP_NUMBER && {
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${WHATSAPP_NUMBER}`,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Malayalam", "Hindi"],
    },
  }),
});

export const websiteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "en-IN",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
});

export function productLd(p: Product) {
  const url = absoluteUrl(`/product/${p.slug}`);
  const priceValidUntil = `${new Date().getFullYear() + 1}-12-31`;
  const offerFor = (price: number, inStock: boolean, sku: string, name?: string) => ({
    "@type": "Offer",
    url,
    sku,
    ...(name && { name }),
    price: price.toFixed(2),
    priceCurrency: "INR",
    priceValidUntil,
    availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": `${SITE_URL}/#organization` },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
    },
  });
  const prices = p.variants.length ? p.variants.map((v) => v.price) : [p.price];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.name,
    url,
    sku: p.sku,
    image: p.images.map(abs).filter(Boolean),
    description: p.summary || p.description || `${p.name} – authentic Kerala snack by AKOD, made in coconut oil.`,
    brand: { "@type": "Brand", name: "AKOD" },
    category: p.categoryName || "Snacks",
    countryOfOrigin: { "@type": "Country", name: "India" },
    ...(p.ingredients && { additionalProperty: [{ "@type": "PropertyValue", name: "Ingredients", value: p.ingredients }] }),
    offers:
      p.variants.length > 1
        ? {
            "@type": "AggregateOffer",
            priceCurrency: "INR",
            lowPrice: Math.min(...prices).toFixed(2),
            highPrice: Math.max(...prices).toFixed(2),
            offerCount: p.variants.length,
            availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            offers: p.variants.map((v) => offerFor(v.price, v.inStock, v.sku, `${p.name} ${v.name}`)),
          }
        : offerFor(p.price, p.inStock, p.sku),
  };
}

export const itemListLd = (name: string, products: Product[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/product/${p.slug}`), name: p.name })),
});

export const categoryLd = (c: Category, products: Product[]) => [
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: c.name, path: `/category/${c.slug}` },
  ]),
  itemListLd(`${c.name} – AKOD Kerala`, products),
];
