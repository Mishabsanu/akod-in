"use client";

import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cartLineFor } from "@/lib/cart";
import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { useCart } from "./CartProvider";
import ProductImage from "./ProductImage";

/**
 * "Try the Taste": packs stand in a row. Tapping one brings it forward and slides in the
 * "In this box" panel (that pack + two others from different ranges) to add in one go.
 * Tapping it again, or closing the panel, goes back to the row.
 */
export default function TasteShowcase({ products }: { products: Product[] }) {
  const lineup = useMemo(() => {
    // Prefer photos, then spread across categories, max 5
    const sorted = [...products].sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)));
    const picked: Product[] = [];
    for (const p of sorted) if (!picked.some((x) => x.category === p.category)) picked.push(p);
    for (const p of sorted) if (picked.length < 5 && !picked.includes(p)) picked.push(p);
    return picked.slice(0, 5);
  }, [products]);

  const [selected, setSelected] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const { add } = useCart();

  // Shareable link: /#try-<product-slug> opens with that pack chosen
  useEffect(() => {
    const slug = window.location.hash.startsWith("#try-") ? window.location.hash.slice(5) : "";
    const i = lineup.findIndex((p) => p.slug === slug);
    if (i >= 0) setSelected(i);
  }, [lineup]);

  const focus = selected === null ? null : lineup[selected];
  const open = focus !== null && focus !== undefined;

  // The box: chosen pack + up to 2 companions, preferring other categories
  const box = useMemo(() => {
    if (!focus) return [];
    const others = products.filter((p) => p.id !== focus.id);
    const companions = [
      ...others.filter((p) => p.category !== focus.category),
      ...others.filter((p) => p.category === focus.category),
    ].slice(0, 2);
    return [focus, ...companions].map((p) => ({ product: p, ...cartLineFor(p) }));
  }, [focus, products]);

  if (lineup.length === 0) return null;

  const available = box.filter((b) => b.inStock);
  const total = available.reduce((s, b) => s + b.line.price, 0);

  const choose = (i: number) => {
    setAdded(false);
    setSelected((cur) => (cur === i ? null : i));
  };

  const addBox = () => {
    available.forEach((b) => add(b.line));
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <section className="overflow-hidden border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col lg:flex-row">
        {/* Stage */}
        <div className="relative flex min-h-[560px] min-w-0 flex-1 flex-col px-6 pb-8 pt-10 transition-all duration-500 sm:px-10 lg:min-h-[640px]">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl">Try the Taste.</h1>
            <p className="mt-2 max-w-sm text-sm text-neutral-500">
              {open ? "Here's a box built around your pick." : "Tap any pack to build your box."}
            </p>
          </div>

          <div className="relative mt-auto flex items-end justify-center gap-[3%] pt-10">
            <div className="pointer-events-none absolute bottom-1 left-1/2 h-6 w-[75%] -translate-x-1/2 rounded-[50%] bg-neutral-900/[0.06] blur-md" />
            {lineup.map((p, i) => {
              const active = i === selected;
              const size = !open ? "w-[17%] max-w-[190px]" : active ? "w-[30%] max-w-[250px]" : "w-[13%] max-w-[120px] opacity-50 hover:opacity-90";
              return (
                <button
                  key={p.id}
                  onClick={() => choose(i)}
                  aria-label={active ? `Close ${p.name}` : `Build a box with ${p.name}`}
                  aria-pressed={active}
                  className={`group relative z-0 flex flex-col items-center transition-all duration-500 ease-out hover:-translate-y-1 ${active ? "z-10" : ""} ${size}`}
                >
                  <ProductImage product={p} bare mini={open && !active} className="aspect-[3/4.1] w-full" sizes="(max-width: 1024px) 30vw, 250px" priority={i < 3} />
                  {!open && (
                    <span className="mt-4 line-clamp-1 text-center text-[13px] text-neutral-600 transition group-hover:text-neutral-900">{p.name}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Caption of the chosen pack */}
          <div className="mt-8 flex min-h-[72px] flex-wrap items-end justify-between gap-4 border-t border-neutral-200 pt-5">
            {focus ? (
              <>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{focus.categoryName}</p>
                  <p className="mt-1 text-lg font-medium text-neutral-900">{focus.name}</p>
                  <p className="text-sm text-neutral-500">
                    {focus.variants.length > 1 ? "From " : ""}
                    {formatPrice(focus.price)} · {focus.weight}
                  </p>
                </div>
                <Link
                  href={`/product/${focus.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
                >
                  View product <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <p className="text-sm text-neutral-400">
                {lineup.length} favourites · {products.length} products in store
              </p>
            )}
          </div>
        </div>

        {/* In this box — only after a pack is chosen */}
        <aside
          aria-hidden={!open}
          className={`shrink-0 overflow-hidden border-neutral-200 bg-white transition-all duration-500 ease-out ${
            open
              ? "max-h-[900px] border-t opacity-100 lg:max-h-none lg:w-[380px] lg:border-l lg:border-t-0"
              : "max-h-0 opacity-0 lg:max-h-none lg:w-0"
          }`}
        >
          <div className="flex h-full w-full flex-col px-6 py-8 sm:px-8 lg:w-[380px]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">In this box</p>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close box"
                tabIndex={open ? 0 : -1}
                className="-mr-2 rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="mt-2 divide-y divide-neutral-200">
              {box.map(({ product: p, line, inStock }) => (
                <li key={p.id}>
                  <Link href={`/product/${p.slug}`} tabIndex={open ? 0 : -1} className="group flex gap-4 py-4">
                    <ProductImage product={{ ...p, image: line.image }} className="h-20 w-20 shrink-0 rounded-md" sizes="80px" mini />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-900 group-hover:underline">{p.name}</p>
                      <p className="text-xs text-neutral-500">
                        {p.categoryName} · {line.variant}
                      </p>
                      <p className={`mt-1.5 text-sm ${inStock ? "text-neutral-900" : "text-neutral-400 line-through"}`}>
                        {formatPrice(line.price)}
                      </p>
                      {!inStock && <p className="text-xs text-brand">Out of stock</p>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              <div className="flex items-baseline justify-between border-t border-neutral-200 pt-4 text-sm">
                <span className="text-neutral-500">
                  {available.length} item{available.length === 1 ? "" : "s"}
                </span>
                <span className="text-base font-medium text-neutral-900">{formatPrice(total)}</span>
              </div>
              <button
                onClick={addBox}
                tabIndex={open ? 0 : -1}
                disabled={available.length === 0}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" /> Added to cart
                  </>
                ) : available.length === 0 ? (
                  "Currently out of stock"
                ) : (
                  <>
                    Add full box to cart <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
