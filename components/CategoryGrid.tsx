import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Category, Product } from "@/lib/data";
import { PackShot } from "./ProductImage";

/** Category tiles on a light stage: category photo, else a product in it. */
export default function CategoryGrid({ categories, products }: { categories: Category[]; products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((c) => {
        const sample = products.find((p) => p.category === c.slug && p.image) ?? products.find((p) => p.category === c.slug);
        const photo = c.image ?? sample?.image ?? null;
        return (
          <Link key={c.slug} href={`/category/${c.slug}`} className="group block">
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md bg-[#f5f5f3]">
              {photo ? (
                <Image
                  src={photo}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={`${c.image ? "object-cover" : "object-contain p-4"} transition duration-500 group-hover:scale-[1.03]`}
                />
              ) : (
                sample && <PackShot name={sample.name} className="w-[30%] transition duration-500 group-hover:-translate-y-1" />
              )}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900">{c.name}</p>
                <p className="text-[13px] text-neutral-500">
                  {c.productCount} product{c.productCount === 1 ? "" : "s"}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-neutral-400 transition group-hover:text-neutral-900" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
