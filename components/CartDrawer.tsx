"use client";

import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatPrice } from "@/lib/format";
import { deliveryFee, FREE_DELIVERY_ABOVE } from "@/lib/whatsapp";
import { useCart } from "./CartProvider";
import ProductImage from "./ProductImage";

/** Slide-out cart: opens when something is added, or from the header bag. */
export default function CartDrawer() {
  const { items, count, subtotal, setQty, remove, drawerOpen, setDrawerOpen, lastAdded } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const left = Math.max(0, FREE_DELIVERY_ABOVE - subtotal);
  const fee = deliveryFee(subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_ABOVE) * 100));

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
      <div
        onClick={() => setDrawerOpen(false)}
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          drawerOpen ? "visible translate-x-0 shadow-2xl" : "invisible translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 sm:px-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-900">
            Your cart <span className="text-neutral-400">({count})</span>
          </p>
          <button
            ref={closeRef}
            onClick={() => setDrawerOpen(false)}
            aria-label="Close cart"
            className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
              <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
            </span>
            <p className="mt-5 text-lg font-light tracking-tight">Your cart is empty</p>
            <p className="mt-1 text-sm text-neutral-500">Add some Kerala crunch to get started.</p>
            <button onClick={() => setDrawerOpen(false)} className="mt-6 h-11 rounded-full bg-neutral-900 px-7 text-sm font-medium text-white hover:bg-neutral-700">
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="border-b border-neutral-200 px-5 py-4 sm:px-6">
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

            <ul className="flex-1 divide-y divide-neutral-100 overflow-y-auto px-5 sm:px-6">
              {items.map((item) => (
                <li key={item.id} className={`flex gap-4 py-4 transition-colors duration-700 ${lastAdded === item.id ? "bg-neutral-50" : ""}`}>
                  <Link href={`/product/${item.slug}`} onClick={() => setDrawerOpen(false)} className="shrink-0">
                    <ProductImage product={item} className="h-20 w-16 rounded-md" sizes="64px" mini />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <p className="line-clamp-2 text-sm text-neutral-900">{item.name}</p>
                      <p className="shrink-0 text-sm text-neutral-900">{formatPrice(item.price * item.qty)}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {item.variant} · {formatPrice(item.price)} each
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-neutral-200">
                        <button onClick={() => setQty(item.id, item.qty - 1)} className="p-2" aria-label="One less">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-6 text-center text-[13px]">{item.qty}</span>
                        <button onClick={() => setQty(item.id, item.qty + 1)} className="p-2" aria-label="One more">
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

            <div className="border-t border-neutral-200 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-neutral-500">Subtotal</span>
                <span className="text-neutral-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between text-sm">
                <span className="text-neutral-500">Delivery</span>
                <span className="text-neutral-900">{fee ? formatPrice(fee) : "Free"}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between border-t border-neutral-200 pt-2">
                <span className="text-sm font-medium text-neutral-900">Total</span>
                <span className="text-lg text-neutral-900">{formatPrice(subtotal + fee)}</span>
              </div>
              <Link
                href="/cart"
                onClick={() => setDrawerOpen(false)}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                Add address &amp; order <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-2 text-center text-xs text-neutral-400">Your order is sent to us on WhatsApp</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
