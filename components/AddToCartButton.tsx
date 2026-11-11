"use client";

import { Minus, Plus } from "lucide-react";
import { useCart, type CartLine } from "./CartProvider";

/**
 * Add to cart. `compact` = round quick-add button for product cards; otherwise a full-width button.
 */
export default function AddToCartButton({
  line,
  inStock = true,
  large = false,
  compact = false,
}: {
  line: CartLine;
  inStock?: boolean;
  large?: boolean;
  compact?: boolean;
}) {
  const { items, add, setQty } = useCart();
  const qty = items.find((i) => i.id === line.id)?.qty ?? 0;

  if (compact) {
    if (!inStock) return null;
    if (qty === 0) {
      return (
        <button
          onClick={() => add(line)}
          aria-label={`Add ${line.name} to cart`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md transition hover:bg-neutral-900 hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </button>
      );
    }
    return (
      <div className="flex h-10 items-center rounded-full bg-neutral-900 text-white shadow-md">
        <button onClick={() => setQty(line.id, qty - 1)} className="px-3" aria-label="Decrease quantity">
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="min-w-4 text-center text-sm" aria-live="polite">
          {qty}
        </span>
        <button onClick={() => setQty(line.id, qty + 1)} className="px-3" aria-label="Increase quantity">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  const size = large ? "h-14 text-base" : "h-11 text-sm";

  if (!inStock) {
    return (
      <button disabled className={`w-full cursor-not-allowed rounded-full bg-neutral-100 font-medium text-neutral-400 ${size}`}>
        Out of stock
      </button>
    );
  }

  if (qty === 0) {
    return (
      <button
        onClick={() => add(line)}
        className={`w-full rounded-full bg-neutral-900 font-medium text-white transition hover:bg-neutral-700 active:scale-[0.99] ${size}`}
      >
        Add to cart
      </button>
    );
  }

  return (
    <div className={`flex w-full items-center justify-between rounded-full border border-neutral-900 font-medium text-neutral-900 ${size}`}>
      <button onClick={() => setQty(line.id, qty - 1)} className="flex h-full items-center px-5" aria-label="Decrease quantity">
        <Minus className="h-4 w-4" />
      </button>
      <span aria-live="polite">{qty} in cart</span>
      <button onClick={() => setQty(line.id, qty + 1)} className="flex h-full items-center px-5" aria-label="Increase quantity">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
