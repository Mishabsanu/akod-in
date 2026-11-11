"use client";

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
  const size = large ? "py-3 text-base" : "py-2 text-sm";

  if (!inStock) {
    return (
      <button disabled className={`w-full cursor-not-allowed rounded-lg bg-neutral-200 font-semibold text-neutral-500 ${size}`}>
        Out of Stock
      </button>
    );
  }

  if (qty === 0) {
    return (
      <button
        onClick={() => add(line)}
        className={`w-full rounded-lg bg-brand font-semibold text-white hover:bg-brand-dark ${size}`}
      >
        Add to Cart
      </button>
    );
  }

  return (
    <div className={`flex w-full items-center justify-between rounded-lg border-2 border-brand font-semibold text-brand ${size}`}>
      <button onClick={() => setQty(line.id, qty - 1)} className="px-4" aria-label="Decrease quantity">
        −
      </button>
      <span>{qty}</span>
      <button onClick={() => setQty(line.id, qty + 1)} className="px-4" aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
