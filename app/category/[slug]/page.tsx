import { PackageOpen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import JsonLd, { categoryLd } from "@/components/JsonLd";
import OfferStrip from "@/components/OfferStrip";
import { getCatalog, getCategories, getCategory, getProductsByCategory } from "@/lib/data";

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) return { title: "Category not found", robots: { index: false } };
  const title = `${cat.name} – Authentic Kerala ${cat.name} Online`;
  const description =
    cat.tagline ||
    `Shop ${cat.productCount} authentic Kerala ${cat.name.toLowerCase()} by AKOD, made in God's Own Country in pure coconut oil. Order on WhatsApp, delivered across India.`;
  return {
    title,
    description,
    alternates: { canonical: `/category/${cat.slug}` },
    openGraph: { url: `/category/${cat.slug}`, title, description },
  };
}

const SORTS = [
  ["", "Featured"],
  ["low", "Price: low to high"],
  ["high", "Price: high to low"],
  ["name", "Name A–Z"],
] as const;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; stock?: string }>;
}) {
  const { slug } = await params;
  const { sort = "", stock } = await searchParams;
  const [cat, categories, { offers }] = await Promise.all([getCategory(slug), getCategories(), getCatalog()]);
  if (!cat) notFound();

  let list = [...(await getProductsByCategory(slug))];
  if (stock === "1") list = list.filter((p) => p.inStock);
  if (sort === "low") list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);
  if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

  const href = (next: { sort?: string; stock?: string }) => {
    const q = new URLSearchParams();
    const s = next.sort ?? sort;
    const st = next.stock ?? stock;
    if (s) q.set("sort", s);
    if (st === "1") q.set("stock", "1");
    const qs = q.toString();
    return `/category/${slug}${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-10 sm:px-10 sm:py-14">
          <JsonLd data={categoryLd(cat, list)} />
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: cat.name }]} />
          <h1 className="mt-4 text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl">{cat.name}</h1>
          <p className="mt-3 max-w-2xl text-muted">
            {cat.tagline ||
              `${cat.productCount} authentic Kerala product${cat.productCount === 1 ? "" : "s"}, made in pure coconut oil and packed fresh in God's Own Country.`}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Categories</h2>
          <ul className="space-y-1">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                    c.slug === slug ? "bg-neutral-100 font-medium text-neutral-900" : "text-ink/80 hover:bg-cream"
                  }`}
                >
                  {c.name}
                  <span className="text-xs text-muted">{c.productCount}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          {/* Mobile category chips */}
          <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 lg:hidden">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
                  c.slug === slug ? "border-neutral-900 bg-neutral-900 text-white" : "border-line bg-white text-ink"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted">
                <span className="font-semibold text-ink">{list.length}</span> products
              </p>
              <Link
                href={href({ stock: stock === "1" ? "" : "1" })}
                className={`flex items-center gap-2 text-sm ${stock === "1" ? "text-neutral-900" : "text-ink/80 hover:text-ink"}`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    stock === "1" ? "border-neutral-900 bg-neutral-900 text-white" : "border-ink/30"
                  }`}
                >
                  {stock === "1" && <span className="h-1.5 w-1.5 rounded-sm bg-white" />}
                </span>
                In stock only
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {SORTS.map(([key, label]) => (
                <Link
                  key={key}
                  href={href({ sort: key })}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                    sort === key ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/80 hover:border-ink/40"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <OfferStrip offers={offers} products={list} />
          </div>
          {list.length === 0 ? (
            <EmptyState icon={PackageOpen} title="Nothing here right now" text="Try turning off “In stock only”." />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
