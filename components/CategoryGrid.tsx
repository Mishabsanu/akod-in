import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Category, Product } from "@/lib/data";

/** Category tiles: category photo, else the first product photo in it, else a soft tile with its initial. */
export default function CategoryGrid({ categories, products }: { categories: Category[]; products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((c) => {
        const photo = c.image ?? products.find((p) => p.category === c.slug && p.image)?.image ?? null;
        return (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className={`group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl ${c.tone} p-5 transition hover:shadow-lg`}
          >
            {photo ? (
              <>
                <Image src={photo} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
              </>
            ) : (
              <span className="absolute -right-3 -top-8 font-display text-[9rem] font-semibold leading-none text-ink/[0.06]">
                {c.name.charAt(0)}
              </span>
            )}
            <div className={`relative flex items-end justify-between gap-2 ${photo ? "text-white" : "text-ink"}`}>
              <div>
                <h3 className="font-display text-lg font-semibold leading-tight sm:text-xl">{c.name}</h3>
                <p className={`mt-0.5 text-xs ${photo ? "text-white/80" : "text-muted"}`}>
                  {c.productCount} product{c.productCount === 1 ? "" : "s"}
                </p>
              </div>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition group-hover:rotate-45 ${
                  photo ? "bg-white/90 text-ink" : "bg-white text-ink"
                }`}
              >
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
