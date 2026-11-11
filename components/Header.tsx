"use client";

import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

type NavCategory = { slug: string; name: string };

/* Premium palette: deep wine, ivory and antique gold */
const GOLD = "#c9a45c";

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
      <div className="bg-[#1a0507] text-[10.5px] uppercase tracking-[0.28em]" style={{ color: GOLD }}>
        <div className="mx-auto flex h-8 max-w-[1440px] items-center justify-center gap-6 px-6 sm:px-10">
          <span>Free delivery above ₹499</span>
          <span className="hidden h-1 w-1 rotate-45 sm:block" style={{ background: GOLD }} />
          <span className="hidden sm:inline">Crafted in pure coconut oil</span>
          <span className="hidden h-1 w-1 rotate-45 md:block" style={{ background: GOLD }} />
          <span className="hidden md:inline">No preservatives</span>
        </div>
      </div>

      {/* Main bar */}
      <div
        className="relative text-[#f6ecdc]"
        style={{
          background:
            "radial-gradient(120% 180% at 50% -40%, #7a1520 0%, #4a0b12 55%, #2e060b 100%)",
        }}
      >
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-6 px-6 sm:px-10">
          <Link
            href="/"
            className="shrink-0 rounded-full bg-[#fbf6ee] px-3 py-1.5 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.5)]"
            style={{ boxShadow: `0 0 0 1px ${GOLD}, 0 6px 16px -6px rgba(0,0,0,0.6)` }}
            aria-label="AKOD Food home"
          >
            <Image src="/products/logo.jpg" alt="AKOD Food" width={3067} height={2221} priority className="h-8 w-auto mix-blend-multiply" />
          </Link>

          <nav className="ml-auto hidden items-center gap-8 md:flex" aria-label="Main">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`group relative py-2 text-[11.5px] font-medium uppercase tracking-[0.22em] transition-colors ${
                    active ? "text-white" : "text-[#f6ecdc]/75 hover:text-white"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`}
                    style={{ background: GOLD }}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-6">
            <Link
              href="/search"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full border transition hover:bg-white/5"
              style={{ borderColor: `${GOLD}66`, color: GOLD }}
            >
              <Search className="h-4 w-4" strokeWidth={1.6} />
            </Link>
            <Link
              href="/cart"
              aria-label={`Cart, ${count} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border transition hover:bg-white/5"
              style={{ borderColor: `${GOLD}66`, color: GOLD }}
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.6} />
              {count > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold text-[#2e060b]"
                  style={{ background: GOLD }}
                >
                  {count}
                </span>
              )}
            </Link>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border md:hidden"
              style={{ borderColor: `${GOLD}66`, color: GOLD }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {/* Gold hairline */}
        <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${GOLD} 20%, ${GOLD} 80%, transparent)` }} />
      </div>

      {menuOpen && (
        <nav className="bg-[#2e060b] px-6 py-2 md:hidden" aria-label="Menu">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block border-b border-white/10 py-3.5 text-[12px] uppercase tracking-[0.22em] last:border-0"
              style={{ color: pathname === l.href ? GOLD : "#f6ecdc" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
