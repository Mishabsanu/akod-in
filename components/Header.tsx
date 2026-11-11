"use client";

import { Menu, Search, ShoppingBag, X } from "lucide-react";
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

  const links = [{ href: "/", label: "Home" }, ...categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name })), { href: "/#bulk", label: "Bulk Orders" }];

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-6 sm:px-10">
        <Link href="/" className="shrink-0" aria-label="AKOD Food home">
          <Image src="/products/logo.jpg" alt="AKOD Food" width={3067} height={2221} priority className="h-9 w-auto" />
        </Link>

        <nav className="ml-auto hidden items-center gap-7 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[13px] transition-colors ${pathname === l.href ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-4">
          <Link href="/search" aria-label="Search" className="rounded-full p-2 text-neutral-700 hover:bg-neutral-100">
            <Search className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </Link>
          <Link href="/cart" aria-label={`Cart, ${count} items`} className="relative rounded-full p-2 text-neutral-700 hover:bg-neutral-100">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
            {count > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 px-1 text-[9px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            className="rounded-full p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-5 w-5" strokeWidth={1.6} /> : <Menu className="h-5 w-5" strokeWidth={1.6} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-neutral-200 bg-white px-6 py-2 md:hidden" aria-label="Menu">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block py-3 text-sm text-neutral-800">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
