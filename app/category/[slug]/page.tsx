import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getCategory(slug);
  return { title: cat ? `${cat.name} | AKOD Food` : "AKOD Food" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug } = await params;
  const { sort } = await searchParams;
  const [cat, categories] = await Promise.all([getCategory(slug), getCategories()]);
  if (!cat) notFound();

  const list = [...(await getProductsByCategory(slug))];
  if (sort === "low") list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);
  if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

  const sorts = [
    ["", "Featured"],
    ["low", "Price: Low to High"],
    ["high", "Price: High to Low"],
    ["name", "Name A–Z"],
  ];

  return (
    <>
      <section className={`${cat.color}`}>
        <div className="mx-auto max-w-7xl px-4 py-10">
          <nav className="text-sm text-neutral-600">
            <Link href="/" className="hover:text-brand">Home</Link> / <span>{cat.name}</span>
          </nav>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            {cat.emoji} {cat.name}
          </h1>
          <p className="mt-2 text-neutral-700">{cat.tagline}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <h3 className="mb-3 font-semibold">Categories</h3>
          <ul className="space-y-1">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className={`block rounded-md px-3 py-2 text-sm ${
                    c.slug === slug ? "bg-brand text-white" : "hover:bg-cream hover:text-brand"
                  }`}
                >
                  {c.emoji} {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-neutral-600">{list.length} products</p>
            <div className="flex flex-wrap gap-2">
              {sorts.map(([key, label]) => (
                <Link
                  key={key}
                  href={key ? `/category/${slug}?sort=${key}` : `/category/${slug}`}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    (sort ?? "") === key ? "border-brand bg-brand text-white" : "border-neutral-300 hover:border-brand"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
