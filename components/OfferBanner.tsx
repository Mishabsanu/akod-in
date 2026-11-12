import { ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import { cartLineFor } from "@/lib/cart";
import type { Offer, Product } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";
import OfferCountdown from "./OfferCountdown";
import ProductImage from "./ProductImage";
import { WhatsAppIcon } from "./WhatsApp";

/** "50% OFF" → ["50%", "OFF"]; "₹50 OFF" → ["₹50", "OFF"] */
const splitLabel = (label: string) => {
  const [big, ...rest] = label.split(" ");
  return [big, rest.join(" ") || "OFF"];
};

/** The default pack of a product on offer, with its offer price, MRP and saving. */
function deal(p: Product) {
  const { line, inStock } = cartLineFor(p);
  const v = p.variants.find((x) => x.id === line.id);
  const mrp = v ? Math.max(v.mrp, v.price) : Math.max(p.mrp, p.price);
  return { p, line, inStock, mrp, save: Math.max(0, mrp - line.price) };
}

type Deal = ReturnType<typeof deal>;

/** One product in the offer rail: photo, price vs MRP, saving, one-tap WhatsApp order. */
function DealCard({ d, label }: { d: Deal; label: string }) {
  const { p, line, inStock, mrp, save } = d;
  return (
    <li className="flex w-[68%] shrink-0 snap-start flex-col rounded-2xl bg-white p-2.5 text-neutral-900 min-[480px]:w-[45%] sm:w-[220px] sm:p-3 lg:w-auto">
      <Link href={`/product/${p.slug}`} className="group relative block">
        <ProductImage product={{ ...p, image: line.image }} className="aspect-square rounded-xl" sizes="(max-width: 640px) 60vw, 220px" />
        <span className="absolute left-2 top-2 rounded-full bg-neutral-950 px-2.5 py-1 text-[11px] font-bold text-white">{label}</span>
      </Link>
      <Link href={`/product/${p.slug}`} className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug hover:underline">
        {p.name}
      </Link>
      <p className="text-xs text-neutral-500">{line.variant}</p>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
        <span className="text-lg font-bold">{formatPrice(line.price)}</span>
        {mrp > line.price && <span className="text-[13px] text-neutral-400 line-through">{formatPrice(mrp)}</span>}
      </div>
      {save > 0 && <p className="mt-0.5 text-xs font-semibold text-neutral-900">You save {formatPrice(save)}</p>}
      <div className="mt-auto pt-3">
        {inStock ? (
          <a
            href={whatsappLink(orderMessage(p, line.variant, line.price))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-neutral-950 text-[13px] font-medium text-white transition hover:bg-neutral-700"
          >
            <WhatsAppIcon className="h-4 w-4" /> Order now
          </a>
        ) : (
          <span className="flex h-10 w-full items-center justify-center rounded-full bg-neutral-100 text-[13px] text-neutral-400">Out of stock</span>
        )}
      </div>
    </li>
  );
}

/** One offer: what it is and how long it lasts on the left, its products on a swipeable rail. */
function OfferCard({ o, deals }: { o: Offer; deals: Deal[] }) {
  const [big, small] = splitLabel(o.label);
  const best = Math.max(...deals.map((d) => d.save));
  const shopHref = deals.length === 1 ? `/product/${deals[0].p.slug}` : o.categories[0] ? `/category/${o.categories[0]}` : "/search";

  return (
    <article className="relative isolate overflow-hidden rounded-3xl bg-neutral-950 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 -z-10 h-80 w-80 rounded-full bg-white/[0.08] blur-3xl" />

      <div className="grid lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* Offer details */}
        <div className="flex flex-col p-5 sm:p-8 lg:p-10">
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/70">
            <Tag className="h-3.5 w-3.5" /> {deals.length} product{deals.length === 1 ? "" : "s"} on offer
          </p>

          <div className="mt-4 flex items-end gap-2 leading-none sm:mt-5">
            <span className="text-6xl font-black tracking-[-0.05em] sm:text-7xl">{big}</span>
            <span className="mb-1.5 text-2xl font-light text-white/60 sm:mb-2 sm:text-3xl">{small}</span>
          </div>

          <h3 className="mt-3 text-xl font-light leading-snug tracking-tight sm:text-2xl">{o.name}</h3>
          {o.description && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/60">{o.description}</p>}
          {best > 0 && <p className="mt-3 text-sm text-white/80">Save up to {formatPrice(best)} per pack</p>}

          {o.endDate && (
            <div className="mt-6">
              <OfferCountdown endDate={o.endDate} />
            </div>
          )}

          <div className="mt-6 lg:mt-auto lg:pt-8">
            <Link
              href={shopHref}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-sm font-medium transition hover:bg-white hover:text-neutral-950 sm:w-auto"
            >
              See all offer products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Products in the offer */}
        <div className="border-t border-white/10 py-5 sm:py-8 lg:border-l lg:border-t-0 lg:py-10">
          <div className="flex items-baseline justify-between gap-4 px-5 sm:px-8">
            <p className="text-sm font-medium">Grab these deals</p>
            {deals.length > 1 && <p className="text-xs text-white/50 lg:hidden">Swipe for more →</p>}
          </div>
          <ul className="no-scrollbar mt-4 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 sm:scroll-px-8 sm:px-8 lg:grid lg:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] lg:gap-4 lg:overflow-visible lg:pb-0">
            {deals.map((d) => (
              <DealCard key={d.p.id} d={d} label={o.label} />
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

/** Home page: live offers (AKOD ECO → Offers), each with its countdown and products ready to order. */
export default function OfferBanner({ offers, products }: { offers: Offer[]; products: Product[] }) {
  const shown = offers
    .map((o) => ({
      o,
      // Biggest saving first
      deals: products
        .filter((p) => p.offer?.id === o.id)
        .map(deal)
        .sort((a, b) => Number(b.inStock) - Number(a.inStock) || b.save - a.save),
    }))
    .filter((x) => x.deals.length > 0);
  if (!shown.length) return null;

  return (
    <section id="offers" aria-labelledby="offers-title" className="mx-auto max-w-[1440px] scroll-mt-24 px-4 pt-10 sm:px-6 sm:pt-14 lg:px-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-[livePing_1.4s_ease-out_infinite] rounded-full bg-neutral-900" />
              <span className="relative h-2 w-2 rounded-full bg-neutral-900" />
            </span>
            Live now
          </p>
          <h2 id="offers-title" className="mt-1.5 text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
            {shown.length === 1 ? "Today's offer" : "Today's offers"}
          </h2>
        </div>
      </div>

      <div className="mt-6 space-y-5 sm:mt-8">
        {shown.map(({ o, deals }) => (
          <OfferCard key={o.id} o={o} deals={deals} />
        ))}
      </div>
    </section>
  );
}
