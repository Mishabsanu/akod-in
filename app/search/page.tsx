import { Search, SearchX } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import { getProducts, searchProducts } from "@/lib/data";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  // Search results are not indexed; the plain "All products" page is
  return q.trim()
    ? { title: `Search: ${q.trim()}`, robots: { index: false, follow: true } }
    : {
        title: "All Products – Kerala Banana Chips & Snacks",
        description: "Every AKOD product in one place: Kerala banana chips and authentic Kerala snacks, made in pure coconut oil.",
        alternates: { canonical: "/search" },
      };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const term = q.trim();
  const results = term ? await searchProducts(term) : await getProducts();

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
      <form action="/search" role="search" className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
        <input
          name="q"
          defaultValue={term}
          placeholder="Search snacks, oils, honey…"
          aria-label="Search products"
          className="w-full border-b border-neutral-300 bg-transparent py-3 pl-8 text-2xl font-light tracking-tight text-neutral-900 outline-none placeholder:text-neutral-300 focus:border-neutral-900"
        />
      </form>

      <p className="mt-6 text-sm text-neutral-500">
        {term ? <>Results for &ldquo;{term}&rdquo; · </> : "All products · "}
        {results.length} product{results.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No products found"
          text="Check the spelling or try a simpler word, like “chips” or “oil”."
          action={{ href: "/search", label: "See all products" }}
        />
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
