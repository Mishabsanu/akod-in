"use client";

import { Leaf, Menu, Search, ShoppingBag, Truck, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

type NavCategory = { slug: string; name: string };

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
    <header className="sticky top-0 z-[400] shadow-[0_6px_20px_-12px_rgba(184,20,29,0.6)]">
      {/* Announcement strip */}
      <div className="bg-sun text-[12px] font-medium text-neutral-900">
        <div className="mx-auto flex h-8 max-w-[1440px] items-center justify-center gap-8 px-6 sm:px-10">
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> Free delivery above ₹499
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <Leaf className="h-3.5 w-3.5" /> Made in pure coconut oil · No preservatives
          </span>
        </div>
      </div>

      {/* Main bar */}
      <div className="bg-gradient-to-r from-brand-dark via-brand to-[#ef4b2b] text-white">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-6 sm:px-10">
          <Link href="/" className="shrink-0 rounded-full bg-white px-2.5 py-1 shadow-sm ring-2 ring-sun" aria-label="AKOD Food home">
            <Image src="/products/logo.jpg" alt="AKOD Food" width={3067} height={2221} priority className="h-9 w-auto" />
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                    active ? "bg-white text-brand" : "text-white/90 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 md:ml-3">
            <Link href="/search" aria-label="Search" className="rounded-full p-2.5 text-white hover:bg-white/15">
              <Search className="h-[18px] w-[18px]" strokeWidth={2} />
            </Link>
            <Link
              href="/cart"
              aria-label={`Cart, ${count} items`}
              className="relative flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-brand shadow-sm transition hover:bg-sun hover:text-neutral-900"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={2} />
              <span className="text-[13px] font-semibold">{count}</span>
            </Link>
            <button
              className="rounded-full p-2.5 text-white hover:bg-white/15 md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="bg-brand-dark px-6 py-2 text-white md:hidden" aria-label="Menu">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block border-b border-white/10 py-3 text-sm last:border-0 ${pathname === l.href ? "text-sun" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
