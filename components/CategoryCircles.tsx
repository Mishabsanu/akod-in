import Link from "next/link";
import type { Category } from "@/lib/data";

export default function CategoryCircles({ categories }: { categories: Category[] }) {
  return (
    <section className="bg-cream">
      <div className="no-scrollbar mx-auto flex max-w-5xl justify-start gap-6 overflow-x-auto px-4 py-6 sm:justify-center sm:gap-12">
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="group flex w-24 shrink-0 flex-col items-center text-center">
            <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-peach text-4xl transition group-hover:scale-105 group-hover:shadow-md">
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
              ) : (
                c.emoji
              )}
            </span>
            <span className="mt-2 text-sm leading-tight text-neutral-800 group-hover:text-brand">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
