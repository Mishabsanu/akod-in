"use client";

import { createContext, useContext, useEffect, useState } from "react";

/** What the cart needs to show a line without the catalog (kept in localStorage). */
export type CartLine = {
  id: string; // AKOD ECO product id (or variant id) — what an order will be placed for
  slug: string; // product page
  name: string;
  variant: string; // weight / variant label
  price: number;
  image?: string;
  tone: string;
};

export type CartItem = CartLine & { qty: number };

type CartContextType = {
  items: CartItem[];
  count: number;
  subtotal: number;
  /** Adds and opens the cart drawer (pass `{ silent: true }` to stay put). */
  add: (line: CartLine, qty?: number, opts?: { silent?: boolean }) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  /** Id of the line just added (for a brief highlight in the drawer). */
  lastAdded: string | null;
};

const CartContext = createContext<CartContextType | null>(null);
const KEY = "akod-cart-v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && typeof i.id === "string" && i.qty > 0));
      }
      localStorage.removeItem("akod-cart"); // old demo cart
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const add = (line: CartLine, qty = 1, opts?: { silent?: boolean }) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === line.id);
      if (found) return prev.map((i) => (i.id === line.id ? { ...i, ...line, qty: i.qty + qty } : i));
      return [...prev, { ...line, qty }];
    });
    setLastAdded(line.id);
    window.setTimeout(() => setLastAdded((cur) => (cur === line.id ? null : cur)), 1600);
    if (!opts?.silent) setDrawerOpen(true);
  };

  const setQty = (id: string, qty: number) =>
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i))));

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, count, subtotal, add, setQty, remove, clear, drawerOpen, setDrawerOpen, lastAdded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
