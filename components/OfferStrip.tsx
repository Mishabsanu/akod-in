import { Clock, Tag } from "lucide-react";
import Link from "next/link";
import type { Offer, Product } from "@/lib/data";

function endsText(endDate: string) {
  if (!endDate) return "";
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const d = Math.round((Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
  if (d <= 0) return "Ends today";
  if (d === 1) return "Ends tomorrow";
  return `${d} days left`;
}

/**
 * Offers running in a category, shown above its products: store-wide offers, offers on the
 * category, and product offers that cover products in it.
 */
export default function OfferStrip({ offers, products }: { offers: Offer[]; products: Product[] }) {
  const here = offers
    .map((o) => ({ offer: o, items: products.filter((p) => p.offer?.id === o.id) }))
    .filter((x) => x.items.length > 0);
  if (!here.length) return null;

  return (
    <div className="space-y-2">
      {here.map(({ offer: o, items }) => {
        const scope =
          o.appliesTo === "all" || items.length === products.length
            ? "on everything here"
            : `on ${items.length} product${items.length === 1 ? "" : "s"} here`;
        const ends = endsText(o.endDate);
        const target = items.length === 1 ? `/product/${items[0].slug}` : undefined;
        const inner = (
          <>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-neutral-950">
              <Tag className="h-3.5 w-3.5" /> {o.label}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{o.name}</span>
              <span className="block truncate text-xs text-white/60">
                {scope}
                {items.length <= 3 && o.appliesTo !== "all" && ` · ${items.map((p) => p.name).join(", ")}`}
              </span>
            </span>
            {ends && (
              <span className="hidden shrink-0 items-center gap-1.5 text-xs text-white/70 sm:flex">
                <Clock className="h-3.5 w-3.5" /> {ends}
              </span>
            )}
          </>
        );
        const cls = "flex items-center gap-3 rounded-xl bg-neutral-950 px-3 py-2.5 text-white";
        return target ? (
          <Link key={o.id} href={target} className={`${cls} transition hover:bg-neutral-800`}>
            {inner}
          </Link>
        ) : (
          <div key={o.id} className={cls}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
