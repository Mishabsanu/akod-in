"use client";

import { useState } from "react";
import { cartLineFor } from "@/lib/cart";
import type { Product } from "@/lib/data";
import { discountPercent, formatPrice } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";

/** Price, size choice and Add to Cart on the product page. */
export default function VariantPicker({ product }: { product: Product }) {
  const initial = cartLineFor(product).line.id;
  const [selected, setSelected] = useState(initial);
  const { line, inStock } = cartLineFor(product, selected);
  const variant = product.variants.find((v) => v.id === selected);
  const price = variant?.price ?? product.price;
  const mrp = variant ? Math.max(variant.mrp, variant.price) : product.mrp;
  const off = discountPercent(price, mrp);

  return (
    <>
      <div className="mt-5 flex items-baseline gap-3">
        <span className="text-3xl font-bold">{formatPrice(price)}</span>
        {off > 0 && (
          <>
            <span className="text-lg text-neutral-400 line-through">{formatPrice(mrp)}</span>
            <span className="rounded bg-green-100 px-2 py-0.5 text-sm font-semibold text-green-700">{off}% OFF</span>
          </>
        )}
      </div>
      <p className="text-xs text-neutral-500">Inclusive of all taxes</p>

      {product.variants.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelected(v.id)}
                className={`rounded-lg border px-4 py-2 text-sm ${
                  v.id === selected ? "border-brand bg-brand text-white" : "border-neutral-300 hover:border-brand"
                } ${v.inStock ? "" : "opacity-50"}`}
              >
                {v.name}
                {!v.inStock && " (out of stock)"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 max-w-sm">
        <AddToCartButton line={line} inStock={inStock} large />
      </div>
    </>
  );
}
