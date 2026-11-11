import Link from "next/link";
import CategoryCircles from "@/components/CategoryCircles";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import { getCatalog } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const { categories, products } = await getCatalog();
  const best = products.filter((p) => p.bestSeller);
  const byCategory = (slug: string) => products.filter((p) => p.category === slug);

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <div className="text-7xl">🛍️</div>
        <h1 className="mt-4 text-2xl font-bold">Our store is getting ready</h1>
        <p className="mt-2 text-neutral-500">Products will appear here soon. Please check back shortly.</p>
      </div>
    );
  }

  return (
    <>
      <CategoryCircles categories={categories} />
      <HeroSlider categories={categories} />

      {/* Trust badges */}
      <section className="border-b border-neutral-100">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 text-center text-sm md:grid-cols-4">
          {[
            ["🌱", "100% Natural"],
            ["🚚", "Free Delivery above ₹499"],
            ["🔒", "Secure Payments"],
            ["⭐", "Trusted Quality"],
          ].map(([icon, label]) => (
            <div key={label} className="flex items-center justify-center gap-2">
              <span className="text-2xl">{icon}</span>
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="mx-auto max-w-7xl px-4 pt-12">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Best Selling Products</h2>
        <p className="mt-2 text-center text-neutral-500">Our customers&apos; favourites</p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {best.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Shop by category tiles */}
      <section className="mx-auto max-w-7xl px-4 pt-14">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Shop By Category</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`${c.color} group flex flex-col items-center rounded-2xl p-6 text-center transition hover:-translate-y-1 hover:shadow-md`}
            >
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt={c.name} className="h-16 w-16 rounded-full object-cover transition group-hover:scale-110" />
              ) : (
                <span className="text-5xl transition group-hover:scale-110">{c.emoji}</span>
              )}
              <span className="mt-3 font-semibold">{c.name}</span>
              <span className="mt-1 text-xs text-neutral-600">{c.tagline}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* One row per category */}
      {categories.map((c) => (
        <section key={c.slug} className="mx-auto max-w-7xl px-4 pt-14">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                {c.emoji} {c.name}
              </h2>
              <p className="text-sm text-neutral-500">{c.tagline}</p>
            </div>
            <Link href={`/category/${c.slug}`} className="text-sm font-semibold text-brand hover:underline">
              View All →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {byCategory(c.slug)
              .slice(0, 5)
              .map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
          </div>
        </section>
      ))}
    </>
  );
}
