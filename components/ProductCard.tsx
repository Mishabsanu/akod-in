"use client";

import Link from "next/link";
import { useState } from "react";
import { cartLineFor } from "@/lib/cart";
import type { Product } from "@/lib/data";
import { discountPercent, formatPrice } from "@/lib/format";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";
import AddToCartButton from "./AddToCartButton";
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
        <div className="absolute inset-x-2 top-2 flex items-start sm:inset-x-3 sm:top-3">
          {product.offer ? (
            <span
              title={product.offer.name}
              className="flex max-w-full items-center gap-1.5 overflow-hidden rounded-full bg-neutral-900 py-1 pl-1 pr-2.5 text-[11px] text-white"
            >
              <span className="shrink-0 rounded-full bg-white px-2 py-0.5 font-bold text-neutral-900">{product.offer.label}</span>
              <span className="truncate font-medium">{product.offer.name}</span>
            </span>
          ) : (
            off > 0 && <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-brand">{off}% off</span>
          )}
        </div>
      </div>

      <Link href={`/product/${product.slug}`} className="mt-3 block">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-neutral-900 group-hover:underline sm:text-[15px]">{product.name}</p>
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

      <p className="mt-2.5 text-sm text-neutral-900 sm:mt-3 sm:text-[15px]">
        {formatPrice(price)}
        {off > 0 && <span className="ml-1.5 text-xs text-neutral-400 line-through sm:ml-2 sm:text-sm">{formatPrice(mrp)}</span>}
        {product.variants.length <= 1 && line.variant && <span className="ml-2 text-[13px] text-neutral-500">· {line.variant}</span>}
      </p>

      <div className="mt-auto flex gap-2 pt-3">
        <AddToCartButton line={{ ...line, price }} inStock={inStock} className="min-w-0 flex-1" />
        {inStock && (
          <a
            href={whatsappLink(orderMessage(product, line.variant, price))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Order ${product.name} ${line.variant} on WhatsApp now`}
            title="Order this now on WhatsApp"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-900 transition hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
          >
            <WhatsAppIcon className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}
