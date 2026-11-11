import { ArrowRight, Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Category, Product } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";

export default function Hero({ products, categories }: { products: Product[]; categories: Category[] }) {
  // Prefer products that have photos for the collage
  const showcase = [...products].sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image))).slice(0, 4);
  const firstCategory = categories[0];

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand/5" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-sun/15" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 md:py-20 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-leaf/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-leaf">
            <Leaf className="h-3.5 w-3.5" />
            Pure &amp; natural · Made in Kerala
          </p>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
            Real food, made the <span className="text-brand">traditional</span> way.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            Crunchy snacks, cold pressed oils, pure honey and stone-ground powders — no preservatives, packed fresh and
            delivered to your door.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#best-sellers"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
            >
              Shop best sellers
              <ArrowRight className="h-4 w-4" />
            </Link>
            {firstCategory && (
              <Link
                href="#categories"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-7 py-3.5 text-sm font-semibold text-ink transition hover:border-ink/40"
              >
                Browse categories
              </Link>
            )}
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {[
              [String(products.length), "Products"],
              [String(categories.length), "Categories"],
              ["₹499+", "Free delivery"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-2xl font-semibold text-ink">{value}</dd>
                <dd className="text-xs uppercase tracking-wider text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {showcase.some((p) => p.image) ? (
          <div className="hidden grid-cols-2 gap-4 sm:grid">
            {showcase.map((p, i) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className={`group overflow-hidden rounded-3xl border border-white bg-white shadow-[0_20px_40px_-24px_rgba(29,26,23,0.35)] transition hover:-translate-y-1 ${
                  i % 2 === 1 ? "translate-y-6" : ""
                }`}
              >
                <ProductImage product={p} className="aspect-square" sizes="(max-width: 1024px) 50vw, 22vw" priority={i < 2} />
                <div className="px-4 py-3">
                  <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                  <p className="text-xs text-muted">
                    {p.variants.length > 1 ? "From " : ""}
                    {formatPrice(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // No product photos yet: one calm brand panel instead of repeated placeholders
          <div className="relative mx-auto hidden aspect-square w-full max-w-md items-center justify-center sm:flex">
            <div className="absolute inset-6 rounded-full bg-white shadow-[0_30px_60px_-30px_rgba(29,26,23,0.35)]" />
            <div className="absolute inset-0 rounded-full border border-dashed border-brand/20" />
            <Image src="/products/logo.jpg" alt="AKOD" width={3067} height={2221} priority className="relative w-3/5 mix-blend-multiply" />
            {products.slice(0, 3).map((p, i) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className={`absolute rounded-2xl border border-line bg-white px-4 py-2.5 shadow-md transition hover:-translate-y-0.5 ${
                  ["left-0 top-10", "-right-2 bottom-20", "bottom-2 left-10"][i]
                }`}
              >
                <p className="max-w-40 truncate text-sm font-semibold text-ink">{p.name}</p>
                <p className="text-xs text-muted">
                  {p.variants.length > 1 ? "From " : ""}
                  {formatPrice(p.price)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
