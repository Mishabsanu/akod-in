import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/lib/data";

export const metadata = { title: "Search | AKOD Food" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = await searchProducts(q);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">
        Search results for &ldquo;{q}&rdquo;
      </h1>
      <p className="mt-1 text-sm text-neutral-500">{results.length} products found</p>

      {results.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">No products found. Try another search.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
