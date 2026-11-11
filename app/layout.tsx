import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { getCategories } from "@/lib/data";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "AKOD Food | Natural Snacks, Spices, Honey & Cold Pressed Oils",
  description: "Shop natural snacks, spices, honey, natural powders and cold pressed oils from AKOD, delivered fresh to your door.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = (await getCategories()).map(({ slug, name }) => ({ slug, name }));
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          <Header categories={categories} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
