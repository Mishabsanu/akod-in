"use client";

import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import { GENERAL_MESSAGE, whatsappLink } from "@/lib/whatsapp";
import ProductImage from "./ProductImage";
import { WhatsAppIcon } from "./WhatsApp";

export type NavCategory = { slug: string; name: string; productCount: number };
export type NavProduct = { slug: string; name: string; image?: string; tone: string; price: number; categoryName: string; sizes: number };

const BASE_MESSAGES = ["Free delivery on orders above ₹499", "Crafted in pure coconut oil", "No preservatives · No added flavours", "Packed fresh in small batches"];

/**
 * Header: rotating message strip, centred logo, Shop mega menu with photos, instant search
 * (/ or Ctrl+K), WhatsApp chat. Hides while scrolling down, comes back when scrolling up.
 */
export default function Header({
  categories,
  products,
  offers = [],
}: {
  categories: NavCategory[];
  products: NavProduct[];
  /** Live offers, announced first in the top strip, e.g. "Onam Offer · 15% OFF" */
  offers?: { name: string; label: string; description: string }[];
}) {
  const MESSAGES = [...offers.map((o) => `${o.label} · ${o.name}`), ...BASE_MESSAGES];
  const pathname = usePathname();
  const router = useRouter();

  const [msg, setMsg] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const megaTimer = useRef<number | undefined>(undefined);

  // Close everything on navigation
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setMega(false);
  }, [pathname]);

  // Rotating announcement
  useEffect(() => {
    const t = window.setInterval(() => setMsg((m) => (m + 1) % MESSAGES.length), 3500);
    return () => window.clearInterval(t);
  }, [MESSAGES.length]);

  // Solid + compact after scrolling; hide on scroll down, show on scroll up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setHidden(y > 240 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard: "/" or Ctrl/Cmd+K opens search, Esc closes overlays
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof Element && Boolean(e.target.closest("input, textarea, select, [contenteditable]"));
      if ((e.key === "/" && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
        setMega(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) window.setTimeout(() => inputRef.current?.focus(), 50);
    else setQ("");
  }, [searchOpen]);

  // Lock page scroll under full-screen overlays
  useEffect(() => {
    const lock = searchOpen || menuOpen;
    const prev = document.body.style.overflow;
    if (lock) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [searchOpen, menuOpen]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return products.slice(0, 6);
    return products
      .filter((p) => p.name.toLowerCase().includes(t) || p.categoryName.toLowerCase().includes(t))
      .slice(0, 6);
  }, [q, products]);

  useEffect(() => setCursor(0), [q]);

  /** Enter / "See all": full results page for the typed words. */
  const submitSearch = (e?: { preventDefault: () => void }) => {
    e?.preventDefault();
    router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
    setSearchOpen(false);
  };

  const openMega = () => {
    window.clearTimeout(megaTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    megaTimer.current = window.setTimeout(() => setMega(false), 120);
  };

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        className={`group relative py-2 text-[12px] font-medium uppercase tracking-[0.16em] transition-colors ${
          active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
        }`}
      >
        {label}
        <span className={`absolute -bottom-0.5 left-0 h-px bg-neutral-900 transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
      </Link>
    );
  };

  const iconBtn =
    "relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 transition hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-neutral-900";

  const featured = products.filter((p) => p.image).slice(0, 3);

  return (
    <>
      <header
        className={`sticky top-0 z-[400] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${hidden && !mega ? "-translate-y-full" : "translate-y-0"}`}
      >
        {/* Rotating message strip */}
        <div className="bg-neutral-950 text-white">
          <div className="relative mx-auto flex h-8 max-w-[1440px] items-center justify-center overflow-hidden px-6">
            {MESSAGES.map((m, i) => (
              <p
                key={m}
                aria-hidden={i !== msg}
                className={`absolute max-w-[calc(100%-3rem)] truncate text-[10.5px] uppercase tracking-[0.26em] transition-all duration-500 ${
                  i === msg ? "translate-y-0 opacity-100" : i === (msg + MESSAGES.length - 1) % MESSAGES.length ? "-translate-y-3 opacity-0" : "translate-y-3 opacity-0"
                }`}
              >
                {m}
              </p>
            ))}
          </div>
        </div>

        {/* Main bar */}
        <div
          className={`border-b bg-white/90 backdrop-blur-xl transition-all duration-300 ${
            scrolled || mega ? "border-neutral-200 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.35)]" : "border-transparent"
          }`}
          onMouseLeave={closeMega}
        >
          <div className={`mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4 transition-all duration-300 sm:px-10 ${scrolled ? "h-[68px]" : "h-[80px] md:h-[104px]"}`}>
            {/* Left: menu (mobile) / nav (desktop) */}
            <div className="flex items-center gap-7">
              <button className={`${iconBtn} md:hidden`} aria-label="Open menu" onClick={() => setMenuOpen(true)}>
                <Menu className="h-5 w-5" strokeWidth={1.6} />
              </button>
              <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
                <button
                  onMouseEnter={openMega}
                  onFocus={openMega}
                  onClick={() => setMega((v) => !v)}
                  aria-expanded={mega}
                  className={`flex items-center gap-1 py-2 text-[12px] font-medium uppercase tracking-[0.16em] transition-colors ${
                    mega ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Shop <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${mega ? "rotate-180" : ""}`} />
                </button>
                {categories.slice(0, 2).map((c) => navLink(`/category/${c.slug}`, c.name))}
              </nav>
            </div>

            {/* Centre: logo */}
            <Link href="/" aria-label="AKOD Food home" className="justify-self-center">
              <Image
                src="/products/logo.jpg"
                alt="AKOD Food"
                width={3067}
                height={2221}
                priority
                className={`w-auto transition-all duration-300 ${scrolled ? "h-12 md:h-14" : "h-14 md:h-20"}`}
              />
            </Link>

            {/* Right: search + WhatsApp */}
            <div className="flex items-center justify-end gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden h-10 items-center gap-3 rounded-full border border-neutral-200 pl-4 pr-2 text-[13px] text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900 md:flex lg:ml-4"
              >
                <Search className="h-4 w-4" strokeWidth={1.6} />
                Search
                <kbd className="rounded-full bg-neutral-100 px-2 py-0.5 font-sans text-[10px] text-neutral-500">/</kbd>
              </button>
              <button className={`${iconBtn} md:hidden`} aria-label="Search" onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5" strokeWidth={1.6} />
              </button>
              <a
                href={whatsappLink(GENERAL_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden h-10 items-center gap-2 rounded-full bg-neutral-900 px-4 text-[13px] font-medium text-white transition hover:bg-neutral-700 sm:flex"
              >
                <WhatsAppIcon className="h-4 w-4" /> Chat with us
              </a>
              <a
                href={whatsappLink(GENERAL_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className={`${iconBtn} sm:hidden`}
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop mega menu */}
          <div
            onMouseEnter={openMega}
            className={`absolute inset-x-0 top-full hidden overflow-hidden border-b border-neutral-200 bg-white transition-all duration-300 md:block ${
              mega ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
            }`}
          >
            <div className="mx-auto grid max-w-[1440px] grid-cols-[220px_1fr] gap-12 px-10 py-10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">Categories</p>
                <ul className="mt-4 space-y-1">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/category/${c.slug}`}
                        className="group flex items-center justify-between rounded-md py-2 text-[15px] text-neutral-900"
                      >
                        <span className="transition group-hover:translate-x-1">{c.name}</span>
                        <span className="text-xs text-neutral-400">{c.productCount}</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/search" className="group flex items-center gap-2 py-2 text-[15px] text-neutral-900">
                      <span className="transition group-hover:translate-x-1">All products</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {featured.map((p) => (
                  <Link key={p.slug} href={`/product/${p.slug}`} className="group">
                    <ProductImage product={p} className="aspect-[4/3] rounded-md" sizes="320px" />
                    <p className="mt-3 text-sm text-neutral-900 group-hover:underline">{p.name}</p>
                    <p className="text-[13px] text-neutral-500">
                      {p.sizes > 1 ? "From " : ""}
                      {formatPrice(p.price)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      <div className={`fixed inset-0 z-[650] ${searchOpen ? "" : "pointer-events-none"}`} aria-hidden={!searchOpen}>
        <div
          onClick={() => setSearchOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${searchOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          className={`absolute inset-x-0 top-0 bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            searchOpen ? "visible translate-y-0 shadow-2xl" : "invisible -translate-y-full"
          }`}
        >
          <form onSubmit={submitSearch} className="mx-auto flex max-w-[1100px] items-center gap-4 border-b border-neutral-200 px-6 py-6 sm:px-10">
            <Search className="h-5 w-5 shrink-0 text-neutral-400" strokeWidth={1.6} />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") (e.preventDefault(), setCursor((c) => Math.min(c + 1, results.length - 1)));
                if (e.key === "ArrowUp") (e.preventDefault(), setCursor((c) => Math.max(c - 1, 0)));
                if (e.key === "Enter" && results[cursor] && cursor > 0) {
                  e.preventDefault();
                  router.push(`/product/${results[cursor].slug}`);
                  setSearchOpen(false);
                }
              }}
              placeholder="Search snacks, chips, oils…"
              aria-label="Search products"
              className="w-full bg-transparent text-2xl font-light tracking-tight text-neutral-900 outline-none placeholder:text-neutral-300 sm:text-3xl"
            />
            <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search" className={iconBtn}>
              <X className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </form>

          <div className="mx-auto max-w-[1100px] px-6 py-6 sm:px-10">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="rounded-full border border-neutral-200 px-4 py-1.5 text-[13px] text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">
              {q.trim() ? `${results.length ? "Products" : "No matches"}` : "Popular right now"}
            </p>
            {results.length > 0 ? (
              <ul className="mt-3 grid gap-1 sm:grid-cols-2">
                {results.map((p, i) => (
                  <li key={p.slug}>
                    <Link
                      href={`/product/${p.slug}`}
                      onMouseEnter={() => setCursor(i)}
                      className={`flex items-center gap-4 rounded-lg p-2 transition ${i === cursor && q.trim() ? "bg-neutral-100" : "hover:bg-neutral-50"}`}
                    >
                      <ProductImage product={p} className="h-16 w-14 shrink-0 rounded-md" sizes="56px" mini />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-neutral-900">{p.name}</p>
                        <p className="text-xs text-neutral-500">{p.categoryName}</p>
                      </div>
                      <p className="shrink-0 text-sm text-neutral-900">
                        {p.sizes > 1 && <span className="text-xs text-neutral-400">From </span>}
                        {formatPrice(p.price)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-neutral-500">Try “chips”, “banana” or “oil”.</p>
            )}
            {q.trim() && (
              <button
                onClick={() => submitSearch()}
                className="mt-5 inline-flex items-center gap-2 text-[13px] text-neutral-900 underline-offset-4 hover:underline"
              >
                See all results for “{q.trim()}” <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-[650] md:hidden ${menuOpen ? "" : "pointer-events-none"}`} aria-hidden={!menuOpen}>
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
        />
        <nav
          aria-label="Menu"
          className={`absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
            <Image src="/products/logo.jpg" alt="AKOD Food" width={3067} height={2221} className="h-11 w-auto" />
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className={iconBtn}>
              <X className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">Shop</p>
            <ul className="mt-2">
              {[{ slug: "", name: "Home", productCount: 0 }, ...categories].map((c) => (
                <li key={c.slug || "home"}>
                  <Link
                    href={c.slug ? `/category/${c.slug}` : "/"}
                    className="flex items-center justify-between border-b border-neutral-100 py-4 text-lg font-light text-neutral-900"
                  >
                    {c.name}
                    {c.productCount > 0 && <span className="text-xs text-neutral-400">{c.productCount}</span>}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/search" className="flex items-center justify-between border-b border-neutral-100 py-4 text-lg font-light text-neutral-900">
                  All products <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
              <li>
                <a
                  href={whatsappLink(GENERAL_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-4 text-lg font-light text-neutral-900"
                >
                  <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
                </a>
              </li>
            </ul>
            {featured.length > 0 && (
              <>
                <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-neutral-400">Popular</p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {featured.map((p) => (
                    <Link key={p.slug} href={`/product/${p.slug}`}>
                      <ProductImage product={p} className="aspect-[3/4] rounded-md" sizes="120px" />
                      <p className="mt-1.5 line-clamp-2 text-xs text-neutral-700">{p.name}</p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
