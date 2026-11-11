"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/lib/data";
import { useCart } from "./CartProvider";

export default function Header({ categories }: { categories: Pick<Category, "slug" | "name" | "emoji">[] }) {
  const router = useRouter();
  const { count } = useCart();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Top announcement bar */}
      <div className="bg-peach text-xs text-neutral-800 sm:text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
          <p className="truncate">
            🚚 Free delivery on orders above ₹499 | 100% natural products, no preservatives
          </p>
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <a href="mailto:support@akodfood.com" className="hover:text-brand">
              ✉ support@akodfood.com
            </a>
            <span className="text-neutral-400">|</span>
            <Link href="/#contact" className="hover:text-brand">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:gap-8 md:py-4">
        <button
          className="text-2xl md:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
        </button>

        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/products/logo.jpg"
            alt="AKOD Food"
            width={3067}
            height={2221}
            priority
            className="h-12 w-auto md:h-16"
          />
        </Link>

        <form onSubmit={onSearch} className="hidden flex-1 md:flex">
          <div className="flex w-full items-center rounded-lg bg-neutral-100">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search For Anything..."
              className="w-full bg-transparent px-5 py-3 text-sm outline-none placeholder:text-neutral-500"
            />
            <button type="submit" className="border-l border-neutral-200 px-5 text-lg" aria-label="Search">
              🔍
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-5 text-xl md:ml-0">
          <button aria-label="Account" className="hover:text-brand">
            👤
          </button>
          <Link href="/cart" aria-label="Cart" className="relative hover:text-brand">
            🛒
            <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[11px] font-semibold text-white">
              {count}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={onSearch} className="px-4 pb-3 md:hidden">
        <div className="flex items-center rounded-lg bg-neutral-100">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search For Anything..."
            className="w-full bg-transparent px-4 py-2.5 text-sm outline-none"
          />
          <button type="submit" className="px-4" aria-label="Search">
            🔍
          </button>
        </div>
      </form>

      {/* Category nav (desktop) */}
      <nav className="hidden border-t-4 border-brand md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-8 px-4 py-2 text-[15px]">
          <div
            className="relative"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <button className="flex items-center gap-1 py-1 hover:text-brand">
              Shop All <span className="text-xs">▼</span>
            </button>
            {shopOpen && (
              <div className="absolute left-0 top-full w-56 rounded-md border border-neutral-100 bg-white py-2 shadow-lg">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-cream hover:text-brand"
                  >
                    <span>{c.emoji}</span> {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="py-1 hover:text-brand">
              {c.name}
            </Link>
          ))}
          <Link href="/#contact" className="ml-auto text-sm text-neutral-600 hover:text-brand">
            Bulk Order
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t-4 border-brand bg-white md:hidden">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 border-b border-neutral-100 px-5 py-3"
            >
              <span>{c.emoji}</span> {c.name}
            </Link>
          ))}
          <Link href="/#contact" onClick={() => setMenuOpen(false)} className="block px-5 py-3 text-neutral-600">
            Bulk Order
          </Link>
        </nav>
      )}
    </header>
  );
}
