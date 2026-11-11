import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { getCategories } from "@/lib/data";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AKOD Food | Snacks, Spices, Dry Fruits & Natural Oils",
  description: "Shop natural snack items, spices, nuts & dry fruits, natural powders and cold pressed oils online.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = (await getCategories()).map(({ slug, name, emoji }) => ({ slug, name, emoji }));
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <CartProvider>
          <Header categories={categories} />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
