import Link from "next/link";
import { cartLineFor } from "@/lib/cart";
import type { Product } from "@/lib/data";
import { discountPercent, formatPrice } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.mrp);
  const { line, inStock } = cartLineFor(product);
  const sizes = product.variants.length;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(29,26,23,0.25)]">
      <Link href={`/product/${product.slug}`} className="relative block">
        <ProductImage product={product} className="aspect-[4/5]" />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {off > 0 && <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-white">{off}% OFF</span>}
          {product.freeDelivery && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-leaf">Free delivery</span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{product.categoryName}</p>
        <Link href={`/product/${product.slug}`} className="mt-1 line-clamp-2 font-semibold leading-snug text-ink hover:text-brand">
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-muted">
          {product.weight}
          {sizes > 1 && <span className="text-ink/60"> · {sizes} sizes</span>}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          {sizes > 1 && <span className="text-xs text-muted">From</span>}
          <span className="text-lg font-bold text-ink">{formatPrice(product.price)}</span>
          {off > 0 && <span className="text-sm text-muted line-through">{formatPrice(product.mrp)}</span>}
        </div>
        <div className="mt-auto pt-4">
          <AddToCartButton line={line} inStock={inStock} />
        </div>
      </div>
    </article>
  );
}
