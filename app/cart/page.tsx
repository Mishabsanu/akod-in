"use client";

import { Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import EmptyState from "@/components/EmptyState";
import ProductImage from "@/components/ProductImage";
import { formatPrice } from "@/lib/format";

const FREE_DELIVERY = 499;
const DELIVERY_FEE = 49;

export default function CartPage() {
  const { items, count, setQty, remove, clear } = useCart();

  const subtotal = items.reduce((s, l) => s + l.price * l.qty, 0);
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY ? 0 : DELIVERY_FEE;
  const progress = Math.min(100, Math.round((subtotal / FREE_DELIVERY) * 100));

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        text="Looks like you haven't added anything yet."
        action={{ href: "/", label: "Start shopping" }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-end justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">Your cart</h1>
        <button onClick={clear} className="text-sm text-muted hover:text-brand">
          Clear cart
        </button>
      </div>
      <p className="mt-1 text-sm text-muted">
        {count} item{count === 1 ? "" : "s"}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 p-4 sm:p-5">
              <Link href={`/product/${item.slug}`} className="shrink-0">
                <ProductImage product={item} className="h-24 w-24 rounded-xl" sizes="96px" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/product/${item.slug}`} className="line-clamp-2 font-semibold text-ink hover:text-brand">
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">
                      {item.variant} · {formatPrice(item.price)} each
                    </p>
                  </div>
                  <p className="shrink-0 font-bold text-ink">{formatPrice(item.price * item.qty)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-line">
                    <button onClick={() => setQty(item.id, item.qty - 1)} className="p-2.5 hover:text-brand" aria-label="Decrease">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => setQty(item.id, item.qty + 1)} className="p-2.5 hover:text-brand" aria-label="Increase">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    className="flex items-center gap-1.5 text-sm text-muted hover:text-brand"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-line bg-cream p-6 lg:sticky lg:top-40">
          <h2 className="font-display text-xl font-semibold text-ink">Order summary</h2>

          <div className="mt-5 rounded-xl bg-white p-4">
            <p className="flex items-center gap-2 text-sm text-ink">
              <Truck className="h-4 w-4 text-leaf" />
              {delivery === 0 ? (
                <span className="font-semibold text-leaf">You&apos;ve unlocked free delivery</span>
              ) : (
                <span>
                  Add <b>{formatPrice(FREE_DELIVERY - subtotal)}</b> more for free delivery
                </span>
              )}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sand">
              <div className="h-full rounded-full bg-leaf transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-medium">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="font-medium">{delivery === 0 ? <span className="text-leaf">Free</span> : formatPrice(delivery)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-4 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold">{formatPrice(subtotal + delivery)}</dd>
            </div>
          </dl>

          <button
            onClick={() => alert("Checkout coming soon! Connect your payment gateway here.")}
            className="mt-6 h-12 w-full rounded-full bg-brand font-semibold text-white transition hover:bg-brand-dark"
          >
            Proceed to checkout
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure checkout · Prices include taxes
          </p>
        </aside>
      </div>
    </div>
  );
}
