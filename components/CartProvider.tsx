"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "@/lib/cart";

export type CartItem = CartLine & { qty: number };

type CartContextType = {
  items: CartItem[];
  count: number;
  subtotal: number;
  /** Adds to the cart (the drawer opens only from the header bag). */
  add: (line: CartLine, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  /** Line just added, for a short highlight */
  lastAdded: string | null;
};

const CartContext = createContext<CartContextType | null>(null);
const KEY = "akod-cart-v3";
const MAX_QTY = 99;

/** Cart kept in this browser (localStorage); orders are sent on WhatsApp from /cart. */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && typeof i.id === "string" && i.qty > 0 && typeof i.price === "number"));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const add = useCallback((line: CartLine, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === line.id);
      if (found) return prev.map((i) => (i.id === line.id ? { ...i, ...line, qty: Math.min(MAX_QTY, i.qty + qty) } : i));
      return [...prev, { ...line, qty }];
    });
    setLastAdded(line.id);
    window.setTimeout(() => setLastAdded((cur) => (cur === line.id ? null : cur)), 1600);
  }, []);

  const setQty = useCallback(
    (id: string, qty: number) =>
      setItems((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)))),
    []
  );
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.price * i.qty, 0),
      add,
      setQty,
      remove,
      clear,
      drawerOpen,
      setDrawerOpen,
      lastAdded,
    }),
    [items, add, setQty, remove, clear, drawerOpen, lastAdded]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
