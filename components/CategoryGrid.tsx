import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Category, Product } from "@/lib/data";
import { PackShot } from "./ProductImage";

const FAN = [
  "z-10 -rotate-[8deg] -translate-x-[58%] translate-y-[6%] group-hover:-translate-x-[72%] group-hover:-rotate-[12deg]",
  "z-20 group-hover:-translate-y-[4%]",
  "z-10 rotate-[8deg] translate-x-[58%] translate-y-[6%] group-hover:translate-x-[72%] group-hover:rotate-[12deg]",
];

/**
 * Wide category cards: name, count and a link on the left, up to three of its packs fanned out
 * on the right. One category fills the row; two sit side by side; more form a grid.
 */
export default function CategoryGrid({ categories, products }: { categories: Category[]; products: Product[] }) {
  const cols =
    categories.length === 1 ? "grid-cols-1" : categories.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  const wide = categories.length === 1;

  return (
    <div className={`grid gap-4 sm:gap-6 ${cols}`}>
      {categories.map((c, ci) => {
        const items = products.filter((p) => p.category === c.slug);
        const withPhoto = items.filter((p) => p.image);
        // Centre pack first, then the two sides
        const fan = (withPhoto.length ? withPhoto : items).slice(0, 3);
        const order = fan.length === 3 ? [fan[1], fan[0], fan[2]] : fan.length === 2 ? [fan[0], fan[1]] : fan;

        return (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className={`group relative flex overflow-hidden rounded-2xl bg-[#f4f4f2] transition duration-500 hover:bg-[#efefec] ${
              wide ? "min-h-[300px] flex-col sm:flex-row sm:items-center" : "min-h-[280px] flex-col"
            }`}
          >
            {/* Text */}
            <div className={`relative z-30 flex flex-col p-6 sm:p-9 ${wide ? "sm:w-[42%]" : ""}`}>
              <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-400">{String(ci + 1).padStart(2, "0")}</span>
              <h3 className={`mt-2 font-light tracking-tight text-neutral-900 ${wide ? "text-3xl sm:text-5xl" : "text-2xl sm:text-3xl"}`}>{c.name}</h3>
              <p className="mt-2 text-sm text-neutral-500">
                {c.tagline || `${c.productCount} product${c.productCount === 1 ? "" : "s"}`}
              </p>
              <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-[13px] font-medium text-white transition group-hover:gap-3">
                Shop {c.name} <ArrowRight className="h-4 w-4" />
              </span>
            </div>

            {/* Fanned packs */}
            <div className={`relative flex flex-1 items-end justify-center ${wide ? "min-h-[260px] sm:min-h-[300px]" : "min-h-[220px]"}`}>
              <div className="pointer-events-none absolute bottom-6 left-1/2 h-8 w-[60%] -translate-x-1/2 rounded-[50%] bg-black/[0.07] blur-xl" />
              <div className={`relative mb-6 ${wide ? "w-[34%] max-w-[190px]" : "w-[38%] max-w-[160px]"}`}>
                {order.map((p, i) => {
                  const pos = order.length === 3 ? FAN[i] : order.length === 2 ? FAN[i === 0 ? 0 : 2] : FAN[1];
                  const center = order.length === 3 ? i === 0 : order.length === 1;
                  return (
                    <div
                      key={p.id}
                      className={`${center ? "relative" : "absolute inset-0"} origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${pos} ${
                        center ? "" : "scale-[0.86]"
                      }`}
                    >
                      {p.image ? (
                        <div className="relative aspect-[3/4] w-full">
                          <Image src={p.image} alt={p.name} fill sizes="200px" className="object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.18)]" />
                        </div>
                      ) : (
                        <PackShot name={p.name} className="w-full" />
                      )}
                    </div>
                  );
                })}
                {/* Keeps height when only side packs are absolute */}
                {order.length === 2 && <div className="invisible aspect-[3/4] w-full" />}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
