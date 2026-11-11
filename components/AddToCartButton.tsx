"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart, type CartLine } from "./CartProvider";

export default function AddToCartButton({
  line,
  inStock = true,
  large = false,
}: {
  line: CartLine;
  inStock?: boolean;
  large?: boolean;
}) {
  const { items, add, setQty } = useCart();
  const qty = items.find((i) => i.id === line.id)?.qty ?? 0;
  const size = large ? "h-12 text-base" : "h-10 text-sm";

  if (!inStock) {
    return (
      <button disabled className={`w-full cursor-not-allowed rounded-full border border-line bg-cream font-medium text-muted ${size}`}>
        Out of stock
      </button>
    );
  }

  if (qty === 0) {
    return (
      <button
        onClick={() => add(line)}
        className={`flex w-full items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white shadow-sm transition hover:bg-brand-dark active:scale-[0.98] ${size}`}
      >
        <ShoppingBag className={large ? "h-5 w-5" : "h-4 w-4"} />
        Add to cart
      </button>
    );
  }

  return (
    <div className={`flex w-full items-center justify-between rounded-full bg-brand-soft font-semibold text-brand ${size}`}>
      <button onClick={() => setQty(line.id, qty - 1)} className="flex h-full items-center px-4 hover:text-brand-dark" aria-label="Decrease quantity">
        <Minus className="h-4 w-4" />
      </button>
      <span aria-live="polite">{qty} in cart</span>
      <button onClick={() => setQty(line.id, qty + 1)} className="flex h-full items-center px-4 hover:text-brand-dark" aria-label="Increase quantity">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
