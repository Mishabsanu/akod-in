"use client";

import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

type NavCategory = { slug: string; name: string };

/** Black & white header. */
export default function Header({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  const links = [
    { href: "/", label: "Home" },
    ...categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
    { href: "/#bulk", label: "Bulk Orders" },
  ];

  return (
    <header className="sticky top-0 z-[400]">
      {/* Announcement strip */}
      <div className="border-b border-neutral-200 bg-white text-[10.5px] uppercase tracking-[0.28em] text-neutral-900">
        <div className="mx-auto flex h-8 max-w-[1440px] items-center justify-center gap-6 px-6 sm:px-10">
          <span>Free delivery above ₹499</span>
          <span className="hidden h-1 w-1 rotate-45 bg-neutral-900 sm:block" />
          <span className="hidden sm:inline">Crafted in pure coconut oil</span>
          <span className="hidden h-1 w-1 rotate-45 bg-neutral-900 md:block" />
          <span className="hidden md:inline">No preservatives</span>
        </div>
      </div>

      {/* Main bar */}
      <div className="bg-black text-white">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-6 px-6 sm:px-10">
          <Link href="/" className="shrink-0 rounded-full bg-white px-3 py-1.5" aria-label="AKOD Food home">
            <Image src="/products/logo.jpg" alt="AKOD Food" width={3067} height={2221} priority className="h-8 w-auto" />
          </Link>

          <nav className="ml-auto hidden items-center gap-8 md:flex" aria-label="Main">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`group relative py-2 text-[11.5px] font-medium uppercase tracking-[0.22em] transition-colors ${
                    active ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-white transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-6">
            <Link
              href="/search"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-white hover:bg-white hover:text-black"
            >
              <Search className="h-4 w-4" strokeWidth={1.6} />
            </Link>
            <Link
              href="/cart"
              aria-label={`Cart, ${count} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-white hover:bg-white hover:text-black"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.6} />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold text-black ring-2 ring-black">
                  {count}
                </span>
              )}
            </Link>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="bg-black px-6 py-2 md:hidden" aria-label="Menu">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block border-b border-white/10 py-3.5 text-[12px] uppercase tracking-[0.22em] last:border-0 ${
                pathname === l.href ? "text-white" : "text-white/60"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
