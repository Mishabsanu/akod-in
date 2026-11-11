"use client";

import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cartLineFor } from "@/lib/cart";
import type { Product } from "@/lib/data";
import { discountPercent, formatPrice } from "@/lib/format";
import { useCart } from "./CartProvider";
import ProductImage from "./ProductImage";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const TAU = Math.PI * 2;
const SPIN_PER_SECOND = TAU / 70; // one slow turn every 70 s
const MORPH_MS = 850;
const r2 = (v: number) => Math.round(v * 100) / 100;
const r3 = (v: number) => Math.round(v * 1000) / 1000;
const r4 = (v: number) => Math.round(v * 10000) / 10000;

/** Nearest equivalent of `target` to `from` (so the ring turns the short way round). */
const nearest = (from: number, target: number) => target + Math.round((from - target) / TAU) * TAU;

/**
 * Hero: every product stands on a slowly turning ring. Front packs are large and sharp,
 * packs at the back are small, faded and blurred. Drag to spin.
 * Tap a pack: it comes to the front, the others blur away, and the side panel slides in
 * with its pack sizes (variants), add to cart and pairings.
 */
export default function TasteShowcase({ products }: { products: Product[] }) {
  const lineup = products;
  const n = lineup.length;

  const [rot, setRot] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [morphing, setMorphing] = useState(false);
  const [variantId, setVariantId] = useState<string | undefined>();
  const [added, setAdded] = useState<"one" | "box" | null>(null);
  const { add, items } = useCart();

  const hovering = useRef(false);
  const drag = useRef<{ x: number; rot: number; moved: boolean } | null>(null);
  const rotRef = useRef(0);
  rotRef.current = rot;

  const focus = selected !== null ? (lineup[selected] ?? null) : null;
  const open = focus !== null;

  // Slow auto-spin while browsing (paused on hover, drag, when a pack is open, or reduced motion)
  useEffect(() => {
    if (open || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      if (!hovering.current && !drag.current) setRot((r) => r + SPIN_PER_SECOND * dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, n]);

  const morph = () => {
    setMorphing(true);
    window.setTimeout(() => setMorphing(false), MORPH_MS);
  };

  const choose = useCallback(
    (i: number | null) => {
      setAdded(null);
      setMorphing(true);
      window.setTimeout(() => setMorphing(false), MORPH_MS);
      if (i !== null) {
        // Bring the chosen pack to the front of the ring (so closing returns it there)
        setRot(nearest(rotRef.current, -(TAU * i) / n));
        setVariantId(cartLineFor(lineup[i]).line.id);
      } else {
        setVariantId(undefined);
      }
      setSelected(i);
    },
    [lineup, n]
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
      if (!open && e.key === "ArrowRight") (morph(), setRot((r) => r - TAU / n));
      if (!open && e.key === "ArrowLeft") (morph(), setRot((r) => r + TAU / n));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose, open, n]);

  const pairings = useMemo(() => {
    if (!focus) return [];
    const others = products.filter((p) => p.id !== focus.id);
    return [...others.filter((p) => p.category !== focus.category), ...others.filter((p) => p.category === focus.category)]
      .slice(0, 2)
      .map((p) => ({ product: p, ...cartLineFor(p) }));
  }, [focus, products]);

  if (n === 0) return null;

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

  // Drag to spin
  const onPointerDown = (e: React.PointerEvent) => {
    if (open) return;
    drag.current = { x: e.clientX, rot, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    if (d.moved) setRot(d.rot + dx * 0.006);
  };
  const endDrag = () => {
    // Let the click handler see whether this was a drag
    window.setTimeout(() => (drag.current = null), 0);
  };

  const transition = morphing
    ? `left ${MORPH_MS}ms ${EASE}, bottom ${MORPH_MS}ms ${EASE}, transform ${MORPH_MS}ms ${EASE}, opacity 600ms ease, filter 600ms ease`
    : "opacity 300ms ease";

  return (
    <section
      className={`relative overflow-hidden border-b border-neutral-200 bg-white [--stage:100%] ${
        open ? "lg:[--stage:calc(100%-400px)]" : ""
      }`}
    >
      {/* Stage */}
      <div
        className={`relative h-[72svh] min-h-[520px] touch-pan-y select-none lg:h-[calc(100svh-101px)] lg:min-h-[620px] lg:max-h-[980px] ${
          open ? "" : "cursor-grab active:cursor-grabbing"
        }`}
        onPointerEnter={() => (hovering.current = true)}
        onPointerLeave={() => {
          hovering.current = false;
          endDrag();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
      >
        <h1 className="sr-only">AKOD Food — natural snacks, oils and more</h1>

        {/* Back to the ring */}
        <button
          onClick={() => choose(null)}
          tabIndex={open ? 0 : -1}
          aria-label="Back to all products"
          className={`absolute left-6 top-6 z-[300] flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-all duration-500 hover:border-neutral-900 hover:text-neutral-900 sm:left-10 ${
            open ? "opacity-100" : "pointer-events-none -translate-x-2 opacity-0"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        {/* Soft floor shadow under the ring */}
        <div
          className={`pointer-events-none absolute bottom-[14%] h-[42%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.035),transparent)] transition-opacity duration-500 ${
            open ? "opacity-0" : "opacity-100"
          }`}
          style={{ left: "calc(var(--stage) * 0.5)", width: "calc(var(--stage) * 0.84)", transform: "translateX(-50%)" }}
        />

        {/* Ring */}
        {lineup.map((p, i) => {
          const active = i === selected;
          const a = (TAU * i) / n + rot;
          const x = Math.sin(a); // -1 left … 1 right
          const z = Math.cos(a); // 1 front … -1 back
          const depth = (z + 1) / 2; // 0 back … 1 front

          // Rounded so server and browser render identical styles
          let fracX = r4(0.5 + x * 0.36);
          let bottom = r2(17 + (1 - depth) * 33);
          let scale = r3(0.45 + 0.55 * depth);
          let opacity = r3(0.35 + 0.65 * depth);
          let blur = r2((1 - depth) * 5);
          let zIndex = Math.round(depth * 100) + 10;

          if (open && active) {
            fracX = 0.5;
            bottom = 14;
            scale = 1.55;
            opacity = 1;
            blur = 0;
            zIndex = 200;
          } else if (open) {
            fracX = r4(0.5 + (x >= 0 ? 1 : -1) * (0.75 + Math.abs(x) * 0.2));
            opacity = 0;
            blur = 16;
          }

          const showLabel = !open && z > 0.8;

          return (
            <button
              key={p.id}
              onClick={() => {
                if (drag.current?.moved) return;
                choose(active ? null : i);
              }}
              tabIndex={open ? (active ? 0 : -1) : z > 0.3 ? 0 : -1}
              aria-label={active ? "Back to all products" : `Take a closer look at ${p.name}`}
              className={`group absolute w-[28vw] origin-bottom sm:w-[min(17vw,270px)] outline-none ${open && !active ? "pointer-events-none" : ""}`}
              style={{
                left: `calc(var(--stage) * ${fracX})`,
                bottom: `${bottom}%`,
                transform: `translateX(-50%) scale(${scale})`,
                opacity,
                zIndex,
                filter: `blur(${blur}px)`,
                transition,
              }}
            >
              <div className={`transition-transform duration-500 ${!open && z > 0.3 ? "group-hover:-translate-y-3 group-focus-visible:-translate-y-3" : ""}`}>
                <div key={active ? "on" : "off"} className={active ? "animate-[swing_900ms_cubic-bezier(0.22,1,0.36,1)]" : ""}>
                  <ProductImage product={p} bare className="aspect-[3/4] w-full" sizes="(max-width: 1024px) 50vw, 420px" priority={z > 0.6} />
                </div>
              </div>
              <span
                className={`absolute left-1/2 top-full mt-3 w-[180%] -translate-x-1/2 text-center text-[13px] text-neutral-600 transition-opacity duration-300 ${
                  showLabel ? "opacity-100" : "opacity-0"
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
            className="absolute bottom-[5%] z-[250] hidden -translate-x-1/2 animate-[fadeUp_700ms_ease_300ms_both] whitespace-nowrap text-center text-sm text-neutral-500 lg:block"
            style={{ left: "calc(var(--stage) * 0.5)" }}
          >
            {focus.categoryName} · {focus.name}
          </p>
        )}

        {/* Hint */}
        <p
          className={`pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-neutral-400 transition-opacity duration-500 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        >
          Drag to explore · Tap a pack
        </p>
      </div>

      {/* Side panel: only after a pack is chosen */}
      <aside
        aria-hidden={!open}
        className={`border-neutral-200 bg-white transition-all duration-700 lg:absolute lg:inset-y-0 lg:right-0 lg:z-[300] lg:w-[400px] lg:border-l ${
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
