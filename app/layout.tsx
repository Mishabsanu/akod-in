import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsApp";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import { getCatalog } from "@/lib/data";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import JsonLd, { organizationLd, websiteLd } from "@/components/JsonLd";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | ${SITE_TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "food",
  alternates: { canonical: "/", languages: { "en-IN": "/" } },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: `${SITE_NAME} | ${SITE_TAGLINE}`, description: SITE_DESCRIPTION },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false },
  // Paste the code from Google Search Console / Bing Webmaster Tools here once you verify the site
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
  other: { "geo.region": "IN", "geo.placename": "India" },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { categories, products, offers } = await getCatalog();
  // Only what the header needs (menu, mega menu photos, instant search)
  const navCategories = categories.map(({ slug, name, productCount }) => ({ slug, name, productCount }));
  const navProducts = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    image: p.image,
    tone: p.tone,
    price: p.price,
    categoryName: p.categoryName,
    sizes: p.variants.length,
  }));

  return (
    <html lang="en-IN" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          <JsonLd data={[organizationLd(), websiteLd()]} />
          <Header categories={navCategories} products={navProducts} offers={offers.map(({ name, label, description }) => ({ name, label, description }))} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
