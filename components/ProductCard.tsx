"use client";

import Link from "next/link";
import { useState } from "react";
import { cartLineFor } from "@/lib/cart";
import type { Product } from "@/lib/data";
import { discountPercent, formatPrice } from "@/lib/format";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";
import ProductImage from "./ProductImage";
import { WhatsAppIcon } from "./WhatsApp";

/**
 * Product card: photo, name, size chips (variants) and price for the chosen size,
 * with a WhatsApp order button for that size.
 */
export default function ProductCard({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(() => cartLineFor(product).line.id);
  const { line, inStock } = cartLineFor(product, variantId);
  const variant = product.variants.find((v) => v.id === variantId);
  const price = variant?.price ?? product.price;
  const mrp = variant ? Math.max(variant.mrp, variant.price) : product.mrp;
  const off = discountPercent(price, mrp);

  return (
    <article className="group flex flex-col">
      <div className="relative">
        <Link href={`/product/${product.slug}`} className="block">
          <ProductImage product={product} className="aspect-[4/5] rounded-md" />
        </Link>
        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-brand">{off}% off</span>
        )}
      </div>

      <Link href={`/product/${product.slug}`} className="mt-3 block">
        <p className="text-[15px] font-medium leading-snug text-neutral-900 group-hover:underline">{product.name}</p>
        <p className="mt-0.5 text-[13px] text-neutral-500">{product.categoryName}</p>
      </Link>

      {/* Sizes */}
      {product.variants.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-1.5" role="radiogroup" aria-label={`${product.name} size`}>
          {product.variants.map((v) => {
            const on = v.id === variantId;
            return (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setVariantId(v.id)}
                className={`rounded-full border px-2.5 py-1 text-xs transition ${
                  on ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 text-neutral-700 hover:border-neutral-900"
                } ${v.inStock ? "" : "line-through opacity-50"}`}
              >
                {v.name}
              </button>
            );
          })}
        </div>
      )}

      <p className="mt-3 text-[15px] text-neutral-900">
        {formatPrice(price)}
        {off > 0 && <span className="ml-2 text-sm text-neutral-400 line-through">{formatPrice(mrp)}</span>}
        {product.variants.length <= 1 && line.variant && <span className="ml-2 text-[13px] text-neutral-500">· {line.variant}</span>}
      </p>

      <div className="mt-auto pt-3">
        {inStock ? (
          <a
            href={whatsappLink(orderMessage(product, line.variant, price))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 text-[13px] font-medium text-white transition hover:bg-neutral-700"
          >
            <WhatsAppIcon className="h-4 w-4" /> Order {line.variant}
          </a>
        ) : (
          <span className="flex h-10 w-full items-center justify-center rounded-full bg-neutral-100 text-[13px] text-neutral-400">Out of stock</span>
        )}
      </div>
    </article>
  );
}
