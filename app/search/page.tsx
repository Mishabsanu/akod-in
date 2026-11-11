import { SearchX } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import { getProducts, searchProducts } from "@/lib/data";

export const metadata = { title: "Search | AKOD Food" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const term = q.trim();
  const results = term ? await searchProducts(term) : await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">{term ? "Search" : "Shop"}</p>
      <h1 className="mt-1.5 font-display text-3xl font-semibold text-ink">
        {term ? <>Results for &ldquo;{term}&rdquo;</> : "All products"}
      </h1>
      <p className="mt-2 text-sm text-muted">
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
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
