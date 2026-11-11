"use client";

import { useState } from "react";
import { cartLineFor } from "@/lib/cart";
import type { Product } from "@/lib/data";
import { discountPercent, formatPrice } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";

/** Price, size choice and Add to Cart on the product page. */
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
        <span className="text-3xl font-bold text-ink">{formatPrice(price)}</span>
        {off > 0 && (
          <>
            <span className="text-lg text-muted line-through">{formatPrice(mrp)}</span>
            <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-bold text-brand">Save {off}%</span>
          </>
        )}
      </div>
      <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>

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
                  className={`min-w-20 rounded-xl border px-4 py-2.5 text-left text-sm transition ${
                    active ? "border-brand bg-brand-soft ring-1 ring-brand" : "border-line bg-white hover:border-ink/40"
                  } ${v.inStock ? "" : "opacity-60"}`}
                >
                  <span className={`block font-semibold ${active ? "text-brand" : "text-ink"}`}>{v.name}</span>
                  <span className="block text-xs text-muted">{v.inStock ? formatPrice(v.price) : "Out of stock"}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="mt-8 max-w-sm">
        <AddToCartButton line={line} inStock={inStock} large />
      </div>
    </>
  );
}
