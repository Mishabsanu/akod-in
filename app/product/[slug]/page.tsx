import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import VariantPicker from "@/components/VariantPicker";
import { getProduct, getProductsByCategory } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  return { title: p ? `${p.name} | AKOD Food` : "AKOD Food", description: p?.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = (await getProductsByCategory(product.category))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-sm text-neutral-600">
        <Link href="/" className="hover:text-brand">Home</Link> /{" "}
        {product.category && (
          <>
            <Link href={`/category/${product.category}`} className="hover:text-brand">{product.categoryName}</Link> /{" "}
          </>
        )}
        <span>{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <ProductImage product={product} className="group aspect-square overflow-hidden rounded-2xl text-[10rem]" />

        <div>
          <p className="text-sm font-medium text-brand">{product.categoryName}</p>
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
          <p className="mt-1 text-neutral-500">{product.weight}</p>

          <VariantPicker product={product} />

          {product.description && <p className="mt-8 leading-relaxed text-neutral-700">{product.description}</p>}
          {product.story && <p className="mt-4 leading-relaxed text-neutral-700">{product.story}</p>}

          {(product.ingredients || product.shelfLife) && (
            <dl className="mt-6 space-y-2 text-sm text-neutral-700">
              {product.ingredients && (
                <div><dt className="inline font-semibold">Ingredients: </dt><dd className="inline">{product.ingredients}</dd></div>
              )}
              {product.shelfLife && (
                <div><dt className="inline font-semibold">Shelf life: </dt><dd className="inline">{product.shelfLife}</dd></div>
              )}
            </dl>
          )}

          <ul className="mt-8 space-y-2 text-sm text-neutral-700">
            <li>🌱 100% natural, no preservatives</li>
            <li>🚚 {product.freeDelivery ? "Free delivery on this product" : "Free delivery on orders above ₹499"}</li>
            <li>↩️ Easy returns within 7 days</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold">You May Also Like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
