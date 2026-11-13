"use client";

import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import type { CartLine } from "@/lib/cart";
import { useCart } from "./CartProvider";

/**
 * Add to cart; once in the cart it turns into − qty + controls.
 * `size`: "md" for cards, "lg" for the product page and hero panel.
 */
export default function AddToCartButton({
  line,
  inStock = true,
  size = "md",
  className = "",
}: {
  line: CartLine;
  inStock?: boolean;
  size?: "md" | "lg";
  className?: string;
}) {
  const { items, add, setQty, lastAdded } = useCart();
  const qty = items.find((i) => i.id === line.id)?.qty ?? 0;
  const h = size === "lg" ? "h-12 text-sm" : "h-10 text-[12px] sm:text-[13px]";

  if (!inStock) {
    return <span className={`flex w-full items-center justify-center rounded-full bg-neutral-100 text-neutral-400 ${h} ${className}`}>Out of stock</span>;
  }

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => add(line)}
        className={`flex w-full items-center justify-center gap-1.5 rounded-full bg-neutral-900 px-3 font-medium text-white transition hover:bg-neutral-700 active:scale-[0.98] ${h} ${className}`}
      >
        <ShoppingBag className="h-4 w-4" /> Add to cart
      </button>
    );
  }

  return (
    <div className={`flex w-full items-center justify-between rounded-full border border-neutral-900 font-medium text-neutral-900 ${h} ${className}`}>
      <button type="button" onClick={() => setQty(line.id, qty - 1)} className="flex h-full items-center px-3.5" aria-label="One less">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span aria-live="polite" className="flex items-center gap-1">
        {lastAdded === line.id && <Check className="h-3.5 w-3.5" />}
        {qty} in cart
      </span>
      <button type="button" onClick={() => add(line, 1)} className="flex h-full items-center px-3.5" aria-label="One more">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
