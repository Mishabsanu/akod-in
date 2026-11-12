"use client";

import { useState } from "react";
import { cartLineFor } from "@/lib/cart";
import type { Product } from "@/lib/data";
import { discountPercent, formatPrice } from "@/lib/format";
import { orderMessage } from "@/lib/whatsapp";
import { WhatsAppButton } from "./WhatsApp";

/** Price, size choice and Order on WhatsApp on the product page. */
export default function VariantPicker({ product }: { product: Product }) {
  const [selected, setSelected] = useState(() => cartLineFor(product).line.id);
  const { line, inStock } = cartLineFor(product, selected);
  const variant = product.variants.find((v) => v.id === selected);
  const price = variant?.price ?? product.price;
  const mrp = variant ? Math.max(variant.mrp, variant.price) : product.mrp;
  const off = discountPercent(price, mrp);

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-2xl font-normal text-neutral-900">{formatPrice(price)}</span>
        {off > 0 && (
          <>
            <span className="text-lg text-muted line-through">{formatPrice(mrp)}</span>
            <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">Save {off}%</span>
          </>
        )}
      </div>
      <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>
      {product.offer && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-3.5 py-1.5 text-[13px] font-medium text-white">
          {product.offer.name} · {product.offer.label} applied
        </p>
      )}

      {product.variants.length > 0 && (
        <fieldset className="mt-7">
          <legend className="mb-3 text-sm font-semibold text-ink">
            Pack size{variant && <span className="font-normal text-muted"> — {variant.name}</span>}
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const active = v.id === selected;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelected(v.id)}
                  aria-pressed={active}
                  className={`min-w-20 rounded-md border px-4 py-2.5 text-left text-sm transition ${
                    active ? "border-neutral-900 bg-white ring-1 ring-neutral-900" : "border-line bg-white hover:border-ink/40"
                  } ${v.inStock ? "" : "opacity-60"}`}
                >
                  <span className={`block font-semibold ${"text-neutral-900"}`}>{v.name}</span>
                  <span className="block text-xs text-muted">{v.inStock ? formatPrice(v.price) : "Out of stock"}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="mt-8 max-w-sm">
        <WhatsAppButton
          text={orderMessage(product, line.variant, line.price)}
          label={inStock ? "Order on WhatsApp" : "Out of stock"}
          disabled={!inStock}
          size="lg"
          className="w-full"
        />
        <p className="mt-3 text-center text-xs text-neutral-500">We reply on WhatsApp to confirm your order and delivery.</p>
      </div>
    </>
  );
}
