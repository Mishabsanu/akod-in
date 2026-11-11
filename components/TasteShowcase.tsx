"use client";

import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cartLineFor } from "@/lib/cart";
import type { Product } from "@/lib/data";
import { discountPercent, formatPrice } from "@/lib/format";
import { useCart } from "./CartProvider";
import ProductImage from "./ProductImage";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * "Try the Taste" — full-screen showcase.
 * Row: packs stand on a turntable, angled toward the centre.
 * Tap one: the others rotate away with a motion blur, the chosen pack swings to the centre,
 * and a side panel slides in with its pack sizes (variants), add to cart and pairings.
 */
export default function TasteShowcase({ products }: { products: Product[] }) {
  const lineup = useMemo(() => {
    const sorted = [...products].sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)));
    const picked: Product[] = [];
    for (const p of sorted) if (!picked.some((x) => x.category === p.category)) picked.push(p);
    for (const p of sorted) if (picked.length < 5 && !picked.includes(p)) picked.push(p);
    return picked.slice(0, 5);
  }, [products]);

  const [selected, setSelected] = useState<number | null>(null);
  const [variantId, setVariantId] = useState<string | undefined>();
  const [added, setAdded] = useState<"one" | "box" | null>(null);
  const { add, items } = useCart();

  const focus = selected !== null ? (lineup[selected] ?? null) : null;
  const open = focus !== null;

  const choose = useCallback(
    (i: number | null) => {
      setAdded(null);
      setSelected(i);
      setVariantId(i === null ? undefined : cartLineFor(lineup[i]).line.id);
    },
    [lineup]
  );

  // Shareable link /#try-<slug>, and Esc to go back
  useEffect(() => {
    const slug = window.location.hash.startsWith("#try-") ? window.location.hash.slice(5) : "";
    const i = lineup.findIndex((p) => p.slug === slug);
    if (i >= 0) choose(i);
  }, [lineup, choose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") choose(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose]);

  const pairings = useMemo(() => {
    if (!focus) return [];
    const others = products.filter((p) => p.id !== focus.id);
    return [...others.filter((p) => p.category !== focus.category), ...others.filter((p) => p.category === focus.category)]
      .slice(0, 2)
      .map((p) => ({ product: p, ...cartLineFor(p) }));
  }, [focus, products]);

  if (lineup.length === 0) return null;

  const current = focus ? cartLineFor(focus, variantId) : null;
  const variant = focus?.variants.find((v) => v.id === variantId);
  const price = variant?.price ?? focus?.price ?? 0;
  const mrp = variant ? Math.max(variant.mrp, variant.price) : (focus?.mrp ?? 0);
  const off = discountPercent(price, mrp);
  const boxLines = current ? [current, ...pairings].filter((b) => b.inStock) : [];
  const boxTotal = boxLines.reduce((s, b) => s + b.line.price, 0);
  const inCart = current ? (items.find((i) => i.id === current.line.id)?.qty ?? 0) : 0;

  const flash = (kind: "one" | "box") => {
    setAdded(kind);
    setTimeout(() => setAdded(null), 2000);
  };

  // Turntable: position of each pack across the stage (0..1)
  const n = lineup.length;
  const slot = (i: number) => (n === 1 ? 0.5 : 0.12 + (0.76 * i) / (n - 1));

  return (
    <section
      className={`relative overflow-hidden border-b border-neutral-200 bg-white [--stage:100%] ${
        open ? "lg:[--stage:calc(100%-400px)]" : ""
      }`}
    >
      {/* Stage */}
      <div className="relative h-[72svh] min-h-[520px] lg:h-[calc(100svh-64px)] lg:min-h-[620px]" style={{ perspective: "1400px" }}>
        {/* Title / back */}
        <div className="absolute left-6 top-8 z-40 sm:left-10">
          <div className={`transition-all duration-500 ${open ? "pointer-events-none -translate-y-2 opacity-0" : "opacity-100"}`}>
            <h1 className="text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl">Try the Taste.</h1>
            <p className="mt-2 text-sm text-neutral-500">Tap any pack to take a closer look.</p>
          </div>
          <button
            onClick={() => choose(null)}
            tabIndex={open ? 0 : -1}
            className={`absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap text-sm text-neutral-600 transition-all duration-500 hover:text-neutral-900 ${
              open ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
            }`}
          >
            <ArrowLeft className="h-4 w-4" /> All packs
          </button>
        </div>

        {/* Floor shadow */}
        <div
          className="pointer-events-none absolute bottom-[13%] h-10 -translate-x-1/2 rounded-[50%] bg-neutral-900/[0.07] blur-xl"
          style={{
            left: "calc(var(--stage) * 0.5)",
            width: open ? "min(26vw, 340px)" : "calc(var(--stage) * 0.8)",
            transition: `left 800ms ${EASE}, width 800ms ${EASE}`,
          }}
        />

        {/* Packs */}
        {lineup.map((p, i) => {
          const active = i === selected;
          const frac = slot(i);
          const side = frac < 0.5 ? -1 : frac > 0.5 ? 1 : 0;
          const dist = Math.abs(frac - 0.5) * 2; // 0 centre … 1 edge

          let left = `calc(var(--stage) * ${frac})`;
          let width = "min(15vw, 200px)";
          let transform = `translateX(-50%) rotateY(${-side * dist * 22}deg) translateZ(${-dist * 60}px)`;
          let opacity = 1;
          let filter = "blur(0px)";
          let z = 10 - Math.round(dist * 5);

          if (open && active) {
            left = "calc(var(--stage) * 0.5)";
            width = "min(30vw, 360px)";
            transform = "translateX(-50%) rotateY(0deg) translateZ(0px)";
            z = 30;
          } else if (open) {
            const away = i < (selected ?? 0) ? -1 : 1;
            left = `calc(var(--stage) * ${0.5 + away * (0.6 + dist * 0.2)})`;
            transform = `translateX(-50%) rotateY(${away * -75}deg) translateZ(-200px)`;
            opacity = 0;
            filter = "blur(14px)";
          }

          return (
            <button
              key={p.id}
              onClick={() => choose(active ? null : i)}
              tabIndex={open && !active ? -1 : 0}
              aria-label={active ? "Back to all packs" : `Take a closer look at ${p.name}`}
              className={`group absolute bottom-[14%] origin-bottom outline-none ${open && !active ? "pointer-events-none" : ""}`}
              style={{
                left,
                width,
                transform,
                opacity,
                filter,
                zIndex: z,
                transformStyle: "preserve-3d",
                transition: `left 800ms ${EASE}, width 800ms ${EASE}, transform 800ms ${EASE}, opacity 600ms ease, filter 600ms ease`,
              }}
            >
              <div className={`transition-transform duration-500 ${!open ? "group-hover:-translate-y-3 group-focus-visible:-translate-y-3" : ""}`}>
                <div key={active ? "on" : "off"} className={active ? "animate-[swing_900ms_cubic-bezier(0.22,1,0.36,1)]" : ""}>
                  <ProductImage product={p} bare className="aspect-[3/4.1] w-full" sizes="(max-width: 1024px) 40vw, 360px" priority={i < 3} />
                </div>
              </div>
              <span
                className={`absolute left-1/2 top-full mt-5 w-[160%] -translate-x-1/2 text-center text-[13px] transition-opacity duration-300 ${
                  open ? "opacity-0" : "text-neutral-500 group-hover:text-neutral-900"
                }`}
              >
                {p.name}
              </span>
            </button>
          );
        })}

        {/* Caption under the chosen pack */}
        {focus && (
          <p
            key={focus.id}
            className="absolute bottom-[6%] hidden -translate-x-1/2 animate-[fadeUp_700ms_ease_300ms_both] whitespace-nowrap text-center text-sm text-neutral-500 lg:block"
            style={{ left: "calc(var(--stage) * 0.5)" }}
          >
            {focus.categoryName} · {focus.name}
          </p>
        )}
      </div>

      {/* Side panel: only after a pack is chosen */}
      <aside
        aria-hidden={!open}
        className={`border-neutral-200 bg-white transition-all duration-700 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[400px] lg:border-l ${
          open
            ? "max-h-[1400px] border-t opacity-100 lg:max-h-none lg:translate-x-0 lg:border-t-0"
            : "max-h-0 overflow-hidden opacity-0 lg:max-h-none lg:translate-x-full"
        }`}
        style={{ transitionTimingFunction: EASE }}
      >
        {focus && current && (
          <div key={focus.id} className="flex h-full flex-col overflow-y-auto px-6 py-8 sm:px-8">
            <div className="flex items-start justify-between gap-4">
              <div className="animate-[fadeUp_600ms_ease_200ms_both]">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{focus.categoryName}</p>
                <h2 className="mt-1.5 text-2xl font-light tracking-tight text-neutral-900">{focus.name}</h2>
              </div>
              <button
                onClick={() => choose(null)}
                aria-label="Close"
                className="-mr-2 rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex animate-[fadeUp_600ms_ease_260ms_both] items-baseline gap-3">
              <span className="text-xl text-neutral-900">{formatPrice(price)}</span>
              {off > 0 && (
                <>
                  <span className="text-sm text-neutral-400 line-through">{formatPrice(mrp)}</span>
                  <span className="text-sm text-brand">{off}% off</span>
                </>
              )}
            </div>
            {(focus.summary || focus.description) && (
              <p className="mt-3 line-clamp-3 animate-[fadeUp_600ms_ease_300ms_both] text-sm leading-relaxed text-neutral-500">
                {focus.summary || focus.description}
              </p>
            )}

            {/* Pack sizes (variants) */}
            {focus.variants.length > 0 && (
              <div className="mt-7 animate-[fadeUp_600ms_ease_340ms_both]">
                <p className="text-sm text-neutral-900">
                  Pack size <span className="text-neutral-400">· {variant?.name}</span>
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {focus.variants.map((v) => {
                    const on = v.id === variantId;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setVariantId(v.id)}
                        aria-pressed={on}
                        className={`rounded-md border px-3 py-2.5 text-left transition ${
                          on ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200 hover:border-neutral-400"
                        } ${v.inStock ? "" : "opacity-50"}`}
                      >
                        <span className="block text-sm text-neutral-900">{v.name}</span>
                        <span className="block text-xs text-neutral-500">{v.inStock ? formatPrice(v.price) : "Sold out"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                add(current.line);
                flash("one");
              }}
              disabled={!current.inStock}
              className="mt-6 flex h-12 w-full shrink-0 animate-[fadeUp_600ms_ease_380ms_both] items-center justify-center gap-2 rounded-full bg-neutral-900 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
            >
              {added === "one" ? (
                <>
                  <Check className="h-4 w-4" /> Added{inCart > 1 ? ` · ${inCart} in cart` : ""}
                </>
              ) : current.inStock ? (
                <>Add to cart{inCart > 0 ? ` · ${inCart} in cart` : ""}</>
              ) : (
                "Out of stock"
              )}
            </button>
            <Link
              href={`/product/${focus.slug}`}
              className="mt-3 text-center text-[13px] text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              View full details
            </Link>

            {/* Pairings */}
            {pairings.length > 0 && (
              <div className="mt-8 animate-[fadeUp_600ms_ease_440ms_both] border-t border-neutral-200 pt-6">
                <p className="text-sm text-neutral-500">Goes well with</p>
                <ul className="mt-2 divide-y divide-neutral-200">
                  {pairings.map(({ product: p, line, inStock }) => (
                    <li key={p.id} className="flex items-center gap-4 py-3">
                      <Link href={`/product/${p.slug}`} className="shrink-0">
                        <ProductImage product={{ ...p, image: line.image }} className="h-16 w-16 rounded-md" sizes="64px" mini />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link href={`/product/${p.slug}`} className="block truncate text-sm text-neutral-900 hover:underline">
                          {p.name}
                        </Link>
                        <p className="text-xs text-neutral-500">
                          {line.variant} · {inStock ? formatPrice(line.price) : "Out of stock"}
                        </p>
                      </div>
                      {inStock && (
                        <button
                          onClick={() => add(line)}
                          aria-label={`Add ${p.name}`}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Whole box */}
            <div className="mt-auto pt-6">
              <div className="flex items-baseline justify-between border-t border-neutral-200 pt-4 text-sm">
                <span className="text-neutral-500">Full box · {boxLines.length} items</span>
                <span className="text-neutral-900">{formatPrice(boxTotal)}</span>
              </div>
              <button
                onClick={() => {
                  boxLines.forEach((b) => add(b.line));
                  flash("box");
                }}
                disabled={boxLines.length === 0}
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-900 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-400 disabled:hover:bg-transparent"
              >
                {added === "box" ? (
                  <>
                    <Check className="h-4 w-4" /> Box added
                  </>
                ) : (
                  <>
                    Add full box to cart <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </aside>
    </section>
  );
}
