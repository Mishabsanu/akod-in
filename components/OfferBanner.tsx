import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import type { Offer, Product } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";

/** Whole days left until the end of `endDate` (India time); 0 = ends today. */
function daysLeft(endDate: string) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  return Math.round((Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
}

const endsText = (endDate: string) => {
  if (!endDate) return "";
  const d = daysLeft(endDate);
  if (d <= 0) return "Ends today";
  if (d === 1) return "Ends tomorrow";
  const day = new Date(`${endDate}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
  return `Ends ${day} · ${d} days left`;
};

/** Home page: one card per live offer (from AKOD ECO → Offers) with the products it covers. */
export default function OfferBanner({ offers, products }: { offers: Offer[]; products: Product[] }) {
  if (!offers.length) return null;

  return (
    <section id="offers" className="mx-auto max-w-[1440px] scroll-mt-24 px-6 pt-14 sm:px-10">
      <div className={`grid gap-4 ${offers.length > 1 ? "lg:grid-cols-2" : ""}`}>
        {offers.map((o) => {
          const items = products.filter((p) => p.offer?.id === o.id);
          const ends = endsText(o.endDate);
          return (
            <article key={o.id} className="relative overflow-hidden rounded-2xl bg-neutral-950 text-white">
              <div className={`grid gap-8 p-7 sm:p-10 ${offers.length === 1 ? "md:grid-cols-[1.1fr_1fr] md:items-center" : ""}`}>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-neutral-950">{o.label}</span>
                    {ends && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-xs text-white/80">
                        <Clock className="h-3.5 w-3.5" /> {ends}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-5 text-3xl font-light leading-tight tracking-tight sm:text-4xl">{o.name}</h2>
                  {o.description && <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">{o.description}</p>}
                  {items.length > 0 && (
                    <Link
                      href={items.length === 1 ? `/product/${items[0].slug}` : o.categories[0] ? `/category/${o.categories[0]}` : "/search"}
                      className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-neutral-950 transition hover:bg-neutral-200"
                    >
                      Shop the offer <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>

                {items.length > 0 && (
                  <ul className="flex gap-3 overflow-x-auto pb-1">
                    {items.slice(0, 3).map((p) => (
                      <li key={p.id} className="w-36 shrink-0 sm:w-40">
                        <Link href={`/product/${p.slug}`} className="group block rounded-xl bg-white p-2 text-neutral-900">
                          <ProductImage product={p} className="aspect-square rounded-lg" sizes="160px" />
                          <p className="mt-2 line-clamp-1 px-1 text-[13px] font-medium">{p.name}</p>
                          <p className="px-1 pb-1 text-[13px]">
                            {formatPrice(p.price)} <span className="text-neutral-400 line-through">{formatPrice(p.mrp)}</span>
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
