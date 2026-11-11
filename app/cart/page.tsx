"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import ProductImage from "@/components/ProductImage";
import { formatPrice } from "@/lib/format";

const FREE_DELIVERY = 499;
const DELIVERY_FEE = 49;

export default function CartPage() {
  const { items, setQty, remove, clear } = useCart();

  const lines = items;

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY ? 0 : DELIVERY_FEE;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <div className="text-7xl">🛒</div>
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Shopping Cart</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200">
          {lines.map((product) => (
            <div key={product.id} className="flex gap-4 p-4">
              <Link href={`/product/${product.slug}`}>
                <ProductImage product={product} className="h-20 w-20 shrink-0 overflow-hidden rounded-lg text-4xl" />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link href={`/product/${product.slug}`} className="font-medium hover:text-brand">
                  {product.name}
                </Link>
                <span className="text-xs text-neutral-500">{product.variant}</span>
                <div className="mt-auto flex items-center gap-4 pt-2">
                  <div className="flex items-center rounded-md border border-neutral-300">
                    <button onClick={() => setQty(product.id, product.qty - 1)} className="px-3 py-1" aria-label="Decrease">−</button>
                    <span className="px-2 text-sm">{product.qty}</span>
                    <button onClick={() => setQty(product.id, product.qty + 1)} className="px-3 py-1" aria-label="Increase">+</button>
                  </div>
                  <button onClick={() => remove(product.id)} className="text-sm text-neutral-500 hover:text-brand">
                    Remove
                  </button>
                </div>
              </div>
              <div className="font-semibold">{formatPrice(product.price * product.qty)}</div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-xl border border-neutral-200 p-5">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{delivery === 0 ? <span className="text-green-700">FREE</span> : formatPrice(delivery)}</dd>
            </div>
            {delivery > 0 && (
              <p className="text-xs text-neutral-500">
                Add {formatPrice(FREE_DELIVERY - subtotal)} more for free delivery
              </p>
            )}
            <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-bold">
              <dt>Total</dt><dd>{formatPrice(subtotal + delivery)}</dd>
            </div>
          </dl>
          <button
            onClick={() => alert("Checkout coming soon! Connect your payment gateway here.")}
            className="mt-5 w-full rounded-lg bg-brand py-3 font-semibold text-white hover:bg-brand-dark"
          >
            Proceed to Checkout
          </button>
          <button onClick={clear} className="mt-3 w-full text-sm text-neutral-500 hover:text-brand">
            Clear cart
          </button>
        </aside>
      </div>
    </div>
  );
}
