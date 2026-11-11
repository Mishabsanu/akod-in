import Link from "next/link";
import { cartLineFor } from "@/lib/cart";
import type { Product } from "@/lib/data";
import { discountPercent, formatPrice } from "@/lib/format";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";
import ProductImage from "./ProductImage";
import { WhatsAppIcon } from "./WhatsApp";

/** Minimal card: product on a light stage, text below, quick WhatsApp order on the image. */
export default function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.mrp);
  const { line, inStock } = cartLineFor(product);
  const sizes = product.variants.length;

  return (
    <article className="group">
      <div className="relative">
        <Link href={`/product/${product.slug}`} className="block">
          <ProductImage product={product} className="aspect-[4/5] rounded-md" />
        </Link>
        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-brand">{off}% off</span>
        )}
        {inStock && (
          <a
            href={whatsappLink(orderMessage(product, line.variant, line.price))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Order ${product.name} on WhatsApp`}
            title="Order on WhatsApp"
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md transition hover:bg-neutral-900 hover:text-white"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
          </a>
        )}
      </div>

      <Link href={`/product/${product.slug}`} className="mt-3 block">
        <p className="text-sm font-medium text-neutral-900 group-hover:underline">{product.name}</p>
        <p className="mt-0.5 text-[13px] text-neutral-500">
          {product.categoryName}
          {product.weight && ` · ${product.weight}`}
          {sizes > 1 && ` · ${sizes} sizes`}
        </p>
        <p className="mt-1.5 text-sm text-neutral-900">
          {sizes > 1 && <span className="text-neutral-500">From </span>}
          {formatPrice(product.price)}
          {off > 0 && <span className="ml-2 text-neutral-400 line-through">{formatPrice(product.mrp)}</span>}
          {!inStock && <span className="ml-2 text-[13px] text-neutral-400">· Out of stock</span>}
        </p>
      </Link>
    </article>
  );
}
