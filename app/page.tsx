import { ArrowRight, Store } from "lucide-react";
import Link from "next/link";
import CategoryGrid from "@/components/CategoryGrid";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import TasteShowcase from "@/components/TasteShowcase";
import TrustBar from "@/components/TrustBar";
import { getCatalog } from "@/lib/data";

export const revalidate = 60;

const GRID = "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4";
const WRAP = "mx-auto max-w-[1440px] px-6 sm:px-10";

export default async function Home() {
  const { categories, products } = await getCatalog();

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Store}
        title="Our store is getting ready"
        text="We're stocking the shelves. Fresh products will appear here very soon."
      />
    );
  }

  const best = products.filter((p) => p.bestSeller).slice(0, 8);

  return (
    <>
      <TasteShowcase products={products} />
      <TrustBar />

      {categories.length > 0 && (
        <section id="categories" className={`${WRAP} scroll-mt-24 pt-20`}>
          <SectionHeading title="Shop by category" />
          <div className="mt-8">
            <CategoryGrid categories={categories} products={products} />
          </div>
        </section>
      )}

      {best.length > 0 && (
        <section id="best-sellers" className={`${WRAP} scroll-mt-24 pt-20`}>
          <SectionHeading title="Best sellers" href="/search" linkLabel="Shop all" />
          <div className={`mt-8 ${GRID}`}>
            {best.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {categories.map((c) => {
        const list = products.filter((p) => p.category === c.slug);
        if (list.length === 0) return null;
        return (
          <section key={c.slug} className={`${WRAP} pt-20`}>
            <SectionHeading title={c.name} href={`/category/${c.slug}`} />
            <div className={`mt-8 ${GRID}`}>
              {list.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Bulk orders */}
      <section id="bulk" className={`${WRAP} scroll-mt-24 pt-24`}>
        <div className="flex flex-col items-start justify-between gap-6 rounded-md bg-[#f5f5f3] px-8 py-12 sm:px-12 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">Ordering in bulk?</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Special prices for retail stores, corporate gifting, weddings and festivals.
            </p>
          </div>
          <Link
            href="#contact"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-neutral-900 px-7 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            Contact us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
