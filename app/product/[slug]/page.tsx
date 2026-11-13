import { Clock, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import SectionHeading from "@/components/SectionHeading";
import VariantPicker from "@/components/VariantPicker";
import JsonLd, { breadcrumbLd, productLd } from "@/components/JsonLd";
import { getProduct, getProductsByCategory } from "@/lib/data";
import { originalPhoto } from "@/lib/cutout";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Product not found", robots: { index: false } };
  const sizes = p.variants.map((v) => v.name).join(", ");
  const title = `${p.name} – Buy Online in India | Kerala Made`;
  const description =
    `${p.summary || p.description || `Authentic ${p.name} from Kerala, made in pure coconut oil.`} ` +
    `${p.variants.length > 1 ? `From ${formatPrice(p.price)}` : formatPrice(p.price)}${sizes ? ` · ${sizes}` : ""}. Order on WhatsApp, delivered across India.`;
  const image = p.image ? [{ url: originalPhoto(p.image), alt: p.name }] : undefined;
  return {
    title,
    description: description.slice(0, 300),
    keywords: [p.name, `${p.name} online`, `buy ${p.name}`, p.categoryName, "Kerala banana chips", "AKOD"].filter(Boolean),
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { type: "website", url: `/product/${p.slug}`, title, description, images: image },
    twitter: { card: "summary_large_image", title, description, images: image?.map((i) => i.url) },
  };
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
    { icon: Truck, text: product.freeDelivery ? "Free delivery on this product" : "Free delivery on orders above ₹499" },
    ...(product.shelfLife ? [{ icon: Clock, text: `Best within ${product.shelfLife}` }] : []),
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
      <JsonLd
        data={[
          productLd(product),
          breadcrumbLd([
            { name: "Home", path: "/" },
            ...(product.category ? [{ name: product.categoryName, path: `/category/${product.category}` }] : []),
            { name: product.name, path: `/product/${product.slug}` },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...(product.category ? [{ label: product.categoryName, href: `/category/${product.category}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-8 grid items-start gap-10 md:grid-cols-[minmax(0,300px)_1fr] lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
        <div className="mx-auto w-full max-w-[300px] md:sticky md:top-28 md:max-w-[min(100%,52svh)]">
          <ProductGallery product={product} />
        </div>

        <div className="md:pt-4">
          {product.categoryName && (
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{product.categoryName}</p>
          )}
          <h1 className="mt-2 text-3xl font-light leading-tight tracking-tight text-neutral-900 sm:text-4xl">{product.name}</h1>
          {product.summary && <p className="mt-3 text-muted">{product.summary}</p>}

          <VariantPicker product={product} />

          <ul className="mt-8 grid gap-3 rounded-md bg-[#f5f5f3] p-5 sm:grid-cols-2">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-ink/85">
                <Icon className="h-4 w-4 shrink-0 text-neutral-900" />
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
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
