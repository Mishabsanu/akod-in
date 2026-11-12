import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Offer, Product } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";
import OfferCountdown from "./OfferCountdown";
import { PackShot } from "./ProductImage";
import { WhatsAppIcon } from "./WhatsApp";

/** "50% OFF" → ["50%", "OFF"]; "₹50 OFF" → ["₹50", "OFF"] */
const splitLabel = (label: string) => {
  const [big, ...rest] = label.split(" ");
  return [big, rest.join(" ") || "OFF"];
};

function Pack({ p, className = "" }: { p: Product; className?: string }) {
  return p.image ? (
    <div className={`relative aspect-[3/4] ${className}`}>
      <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 60vw, 360px" className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]" />
    </div>
  ) : (
    <PackShot name={p.name} className={className} />
  );
}

/** One offer as a poster: huge discount, live countdown, the product(s) with a price sticker. */
function OfferPoster({ o, items, compact }: { o: Offer; items: Product[]; compact: boolean }) {
  const [big, small] = splitLabel(o.label);
  const hero = items[0];
  const side = items.slice(1, 3);
  const save = hero ? hero.mrp - hero.price : 0;
  const shopHref = items.length === 1 ? `/product/${hero.slug}` : o.categories[0] ? `/category/${o.categories[0]}` : "/search";

  return (
    <article className="relative isolate overflow-hidden rounded-3xl bg-neutral-950 text-white">
      {/* Backdrop: soft glow + fine grid */}
      <div className="pointer-events-none absolute -right-24 top-1/2 -z-10 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-white/[0.07] blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "44px 44px" }}
      />

      <div className={`grid items-center gap-10 p-7 sm:p-12 ${compact ? "" : "lg:grid-cols-[1.15fr_1fr] lg:gap-6"}`}>
        {/* Copy */}
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">
            <Sparkles className="h-3.5 w-3.5" /> Limited-time offer
          </p>

          <div className="mt-6 flex items-end gap-3 leading-none">
            <span className="text-[5.5rem] font-black tracking-[-0.06em] sm:text-[8rem]">{big}</span>
            <span className="mb-3 text-3xl font-light tracking-tight text-white/70 sm:mb-5 sm:text-5xl">{small}</span>
          </div>

          <h2 className="mt-4 max-w-xl text-2xl font-light leading-snug tracking-tight sm:text-3xl">{o.name}</h2>
          {o.description && <p className="mt-3 line-clamp-2 max-w-lg text-sm leading-relaxed text-white/55">{o.description}</p>}

          {o.endDate && (
            <div className="mt-7">
              <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/50">Ends in</p>
              <OfferCountdown endDate={o.endDate} />
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={shopHref}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              Shop the offer <ArrowRight className="h-4 w-4" />
            </Link>
            {hero && hero.inStock && (
              <a
                href={whatsappLink(orderMessage(hero, hero.weight, hero.price))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <WhatsAppIcon className="h-4 w-4" /> Order on WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Product(s) */}
        {hero && (
          <Link href={`/product/${hero.slug}`} className="group relative mx-auto flex w-full max-w-md items-end justify-center pb-6 pt-4">
            <div className="pointer-events-none absolute bottom-2 left-1/2 h-10 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/60 blur-2xl" />
            {side[0] && <Pack p={side[0]} className="absolute bottom-8 left-0 w-[34%] -rotate-[10deg] opacity-80 transition duration-500 group-hover:-translate-x-2" />}
            {side[1] && <Pack p={side[1]} className="absolute bottom-8 right-0 w-[34%] rotate-[10deg] opacity-80 transition duration-500 group-hover:translate-x-2" />}
            <Pack p={hero} className="relative z-10 w-[58%] transition duration-500 group-hover:-translate-y-2" />

            {/* Price sticker */}
            <div className="absolute right-0 top-2 z-20 flex h-28 w-28 rotate-12 flex-col items-center justify-center rounded-full bg-white text-center text-neutral-950 shadow-2xl sm:h-32 sm:w-32">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Now</span>
              <span className="text-2xl font-black leading-none sm:text-3xl">{formatPrice(hero.price)}</span>
              {hero.mrp > hero.price && <span className="text-xs text-neutral-400 line-through">{formatPrice(hero.mrp)}</span>}
              {save > 0 && <span className="mt-0.5 text-[10px] font-bold uppercase text-neutral-950">Save {formatPrice(save)}</span>}
            </div>
            <span className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15 backdrop-blur">
              {hero.name}
              {items.length > 1 && ` + ${items.length - 1} more`}
            </span>
          </Link>
        )}
      </div>
    </article>
  );
}

/** Home page: live offers (AKOD ECO → Offers) as bold posters. */
export default function OfferBanner({ offers, products }: { offers: Offer[]; products: Product[] }) {
  const shown = offers
    .map((o) => ({ o, items: products.filter((p) => p.offer?.id === o.id) }))
    .filter((x) => x.items.length > 0);
  if (!shown.length) return null;

  return (
    <section id="offers" className="mx-auto max-w-[1440px] scroll-mt-24 px-6 pt-14 sm:px-10">
      <div className={`grid gap-5 ${shown.length > 1 ? "xl:grid-cols-2" : ""}`}>
        {shown.map(({ o, items }) => (
          <OfferPoster key={o.id} o={o} items={items} compact={shown.length > 1} />
        ))}
      </div>
    </section>
  );
}
