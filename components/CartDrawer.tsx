"use client";

import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "./CartProvider";
import ProductImage from "./ProductImage";

const FREE_DELIVERY = 499;

/** Slide-out cart: opens whenever something is added, or from the header cart button. */
export default function CartDrawer() {
  const { items, count, subtotal, setQty, remove, drawerOpen, setDrawerOpen, lastAdded } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const left = Math.max(0, FREE_DELIVERY - subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_DELIVERY) * 100));

  // Esc closes; lock page scroll while open; focus the close button
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [drawerOpen, setDrawerOpen]);

  return (
    <div className={`fixed inset-0 z-[600] ${drawerOpen ? "" : "pointer-events-none"}`} aria-hidden={!drawerOpen}>
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          drawerOpen ? "visible translate-x-0 shadow-2xl" : "invisible translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-900">
            Your cart <span className="text-neutral-400">({count})</span>
          </p>
          <button
            ref={closeRef}
            onClick={() => setDrawerOpen(false)}
            aria-label="Close cart"
            className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
              <ShoppingBag className="h-6 w-6 text-neutral-900" strokeWidth={1.5} />
            </span>
            <p className="mt-5 text-lg font-light tracking-tight text-neutral-900">Your cart is empty</p>
            <p className="mt-1 text-sm text-neutral-500">Add something tasty to get started.</p>
            <button
              onClick={() => setDrawerOpen(false)}
              className="mt-6 h-11 rounded-full bg-neutral-900 px-7 text-sm font-medium text-white hover:bg-neutral-700"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            {/* Free delivery progress */}
            <div className="border-b border-neutral-200 px-6 py-4">
              <p className="flex items-center gap-2 text-[13px] text-neutral-700">
                <Truck className="h-4 w-4" strokeWidth={1.6} />
                {left === 0 ? (
                  <span className="font-medium text-neutral-900">You&apos;ve unlocked free delivery</span>
                ) : (
                  <span>
                    <b className="font-medium text-neutral-900">{formatPrice(left)}</b> away from free delivery
                  </span>
                )}
              </p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full rounded-full bg-neutral-900 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Lines */}
            <ul className="flex-1 divide-y divide-neutral-100 overflow-y-auto px-6">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`flex gap-4 py-5 transition-colors duration-700 ${lastAdded === item.id ? "bg-neutral-50" : ""}`}
                >
                  <Link href={`/product/${item.slug}`} onClick={() => setDrawerOpen(false)} className="shrink-0">
                    <ProductImage product={item} className="h-24 w-20 rounded-md" sizes="80px" mini />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setDrawerOpen(false)}
                        className="line-clamp-2 text-sm text-neutral-900 hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="shrink-0 text-sm text-neutral-900">{formatPrice(item.price * item.qty)}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">{item.variant}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-neutral-200">
                        <button onClick={() => setQty(item.id, item.qty - 1)} className="p-2 hover:text-neutral-500" aria-label="Decrease">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-6 text-center text-[13px]">{item.qty}</span>
                        <button onClick={() => setQty(item.id, item.qty + 1)} className="p-2 hover:text-neutral-500" aria-label="Increase">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-neutral-200 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-neutral-500">Subtotal</span>
                <span className="text-lg text-neutral-900">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-neutral-400">Taxes included. Delivery calculated at checkout.</p>
              <button
                onClick={() => alert("Checkout coming soon! Connect your payment gateway here.")}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/cart"
                onClick={() => setDrawerOpen(false)}
                className="mt-3 block text-center text-[13px] text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
