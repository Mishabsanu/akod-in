import Link from "next/link";
import { cartLineFor } from "@/lib/cart";
import type { Product } from "@/lib/data";
import { discountPercent, formatPrice } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.mrp);
  const { line, inStock } = cartLineFor(product);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-lg">
      <Link href={`/product/${product.slug}`} className="relative block">
        <ProductImage product={product} className="aspect-square text-7xl" />
        {off > 0 && (
          <span className="absolute left-2 top-2 rounded bg-brand px-2 py-0.5 text-xs font-semibold text-white">
            {off}% OFF
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-xs text-neutral-500">{product.categoryName}</p>
        <Link href={`/product/${product.slug}`} className="mt-1 line-clamp-2 font-medium hover:text-brand">
          {product.name}
        </Link>
        <p className="text-xs text-neutral-500">
          {product.weight}
          {product.variants.length > 1 && ` · ${product.variants.length} sizes`}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          {off > 0 && <span className="text-sm text-neutral-400 line-through">{formatPrice(product.mrp)}</span>}
        </div>
        <div className="mt-auto pt-3">
          <AddToCartButton line={line} inStock={inStock} />
        </div>
      </div>
    </div>
  );
}
