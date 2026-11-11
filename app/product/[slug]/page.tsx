import { Clock, Leaf, RotateCcw, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import SectionHeading from "@/components/SectionHeading";
import VariantPicker from "@/components/VariantPicker";
import { getProduct, getProductsByCategory } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  return { title: p ? `${p.name} | AKOD Food` : "AKOD Food", description: p?.summary || p?.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = (await getProductsByCategory(product.category)).filter((p) => p.slug !== product.slug).slice(0, 4);

  const details = [
    ["Ingredients", product.ingredients],
    ["Shelf life", product.shelfLife],
    ["SKU", product.sku],
  ].filter(([, v]) => v);

  const perks = [
    { icon: Leaf, text: "100% natural, no preservatives" },
    { icon: Truck, text: product.freeDelivery ? "Free delivery on this product" : "Free delivery on orders above ₹499" },
    { icon: RotateCcw, text: "Easy returns within 7 days" },
    ...(product.shelfLife ? [{ icon: Clock, text: `Best within ${product.shelfLife}` }] : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...(product.category ? [{ label: product.categoryName, href: `/category/${product.category}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-8 grid gap-10 md:grid-cols-2 lg:gap-16">
        <ProductGallery product={product} />

        <div className="md:pt-4">
          {product.categoryName && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">{product.categoryName}</p>
          )}
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">{product.name}</h1>
          {product.summary && <p className="mt-3 text-muted">{product.summary}</p>}

          <VariantPicker product={product} />

          <ul className="mt-8 grid gap-3 rounded-2xl bg-cream p-5 sm:grid-cols-2">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-ink/85">
                <Icon className="h-4 w-4 shrink-0 text-leaf" />
                {text}
              </li>
            ))}
          </ul>

          {(product.description || product.story) && (
            <div className="mt-8 border-t border-line pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink">About this product</h2>
              {product.description && <p className="mt-3 leading-relaxed text-ink/80">{product.description}</p>}
              {product.story && <p className="mt-3 leading-relaxed text-ink/80">{product.story}</p>}
            </div>
          )}

          {details.length > 0 && (
            <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
              {details.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[120px_1fr] gap-4 py-3">
                  <dt className="text-muted">{label}</dt>
                  <dd className="text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeading eyebrow="More to try" title="You may also like" href={`/category/${product.category}`} />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
