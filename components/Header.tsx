"use client";

import { Leaf, Mail, Menu, Search, ShoppingBag, Truck, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

type NavCategory = { slug: string; name: string };

export default function Header({ categories }: { categories: NavCategory[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const { count } = useCart();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        className={`relative whitespace-nowrap py-3 text-sm font-medium transition-colors ${
          active ? "text-brand" : "text-ink/80 hover:text-brand"
        }`}
      >
        {label}
        {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand" />}
      </Link>
    );
  };

  const searchBox = (
    <form onSubmit={onSearch} role="search" className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search snacks, oils, spices…"
        aria-label="Search products"
        className="w-full rounded-full border border-line bg-cream py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-brand focus:bg-white"
      />
    </form>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      {/* Announcement bar */}
      <div className="bg-ink text-xs text-white/85">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-2 sm:justify-between">
          <p className="flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 text-sun" />
            Free delivery on orders above ₹499
          </p>
          <p className="hidden items-center gap-2 sm:flex">
            <Leaf className="h-3.5 w-3.5 text-sun" />
            100% natural · No preservatives
          </p>
          <a href="mailto:support@akodfood.com" className="hidden items-center gap-2 hover:text-white md:flex">
            <Mail className="h-3.5 w-3.5" />
            support@akodfood.com
          </a>
        </div>
      </div>

      {/* Main row */}
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:gap-8">
          <button
            className="-ml-1 rounded-full p-2 text-ink hover:bg-cream md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex shrink-0 items-center" aria-label="AKOD Food home">
            <Image src="/products/logo.jpg" alt="AKOD Food" width={3067} height={2221} priority className="h-11 w-auto md:h-14" />
          </Link>

          <div className="hidden max-w-xl flex-1 md:block">{searchBox}</div>

          <div className="ml-auto flex items-center gap-1">
            <button aria-label="Account" className="rounded-full p-2.5 text-ink hover:bg-cream hover:text-brand">
              <User className="h-5 w-5" />
            </button>
            <Link href="/cart" aria-label={`Cart, ${count} items`} className="relative rounded-full p-2.5 text-ink hover:bg-cream hover:text-brand">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="px-4 pb-3 md:hidden">{searchBox}</div>
      </div>

      {/* Category nav (desktop) */}
      <nav className="hidden border-b border-line md:block" aria-label="Categories">
        <div className="no-scrollbar mx-auto flex max-w-7xl items-center gap-8 overflow-x-auto px-4">
          {navLink("/", "Home")}
          {categories.map((c) => navLink(`/category/${c.slug}`, c.name))}
          <Link href="/#bulk" className="ml-auto whitespace-nowrap py-3 text-sm font-medium text-brand hover:text-brand-dark">
            Bulk Orders
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-b border-line bg-white md:hidden" aria-label="Menu">
          {[{ slug: "", name: "Home" }, ...categories].map((c) => (
            <Link
              key={c.slug || "home"}
              href={c.slug ? `/category/${c.slug}` : "/"}
              className="block border-b border-line/70 px-5 py-3.5 text-sm font-medium last:border-0"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/#bulk" className="block px-5 py-3.5 text-sm font-medium text-brand">
            Bulk Orders
          </Link>
        </nav>
      )}
    </header>
  );
}
