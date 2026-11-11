import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsApp";
import { getCatalog } from "@/lib/data";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "AKOD Food | Natural Snacks, Spices, Honey & Cold Pressed Oils",
  description: "Shop natural snacks, spices, honey, natural powders and cold pressed oils from AKOD, delivered fresh to your door.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { categories, products } = await getCatalog();
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
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">
          <Header categories={navCategories} products={navProducts} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <WhatsAppFloat />
      </body>
    </html>
  );
}
