import { ArrowRight, Store } from "lucide-react";
import Link from "next/link";
import CategoryGrid from "@/components/CategoryGrid";
import EmptyState from "@/components/EmptyState";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import TrustBar from "@/components/TrustBar";
import { getCatalog } from "@/lib/data";

export const revalidate = 60;

const GRID = "grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4";

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
  const byCategory = (slug: string) => products.filter((p) => p.category === slug);

  return (
    <>
      <Hero products={products} categories={categories} />
      <TrustBar />

      {categories.length > 0 && (
        <section id="categories" className="mx-auto max-w-7xl scroll-mt-32 px-4 pt-16">
          <SectionHeading eyebrow="Explore" title="Shop by category" />
          <div className="mt-8">
            <CategoryGrid categories={categories} products={products} />
          </div>
        </section>
      )}

      {best.length > 0 && (
        <section id="best-sellers" className="mx-auto max-w-7xl scroll-mt-32 px-4 pt-16">
          <SectionHeading eyebrow="Customer favourites" title="Best sellers" />
          <div className={`mt-8 ${GRID}`}>
            {best.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {categories.map((c) => {
        const list = byCategory(c.slug);
        if (list.length === 0) return null;
        return (
          <section key={c.slug} className="mx-auto max-w-7xl px-4 pt-16">
            <SectionHeading eyebrow={c.tagline || "Collection"} title={c.name} href={`/category/${c.slug}`} />
            <div className={`mt-8 ${GRID}`}>
              {list.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Bulk orders */}
      <section id="bulk" className="mx-auto max-w-7xl scroll-mt-32 px-4 pt-20">
        <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-12 text-white sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 right-40 h-48 w-48 rounded-full bg-sun/30" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">For shops, events &amp; gifting</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">Ordering in bulk?</h2>
              <p className="mt-3 text-white/85">
                Get special prices on large orders for retail stores, corporate gifts, weddings and festivals.
              </p>
            </div>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand transition hover:bg-cream"
            >
              Contact us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
