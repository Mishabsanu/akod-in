"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const GRADIENTS = [
  "from-amber-700 via-orange-600 to-amber-500",
  "from-red-800 via-red-600 to-orange-500",
  "from-yellow-900 via-amber-700 to-yellow-600",
  "from-lime-800 via-green-700 to-emerald-500",
];

type SlideCategory = { slug: string; name: string; tagline: string; emoji: string; image: string | null };

export default function HeroSlider({ categories }: { categories: SlideCategory[] }) {
  const slides = categories.slice(0, 4).map((c, idx) => ({
    title: c.name,
    subtitle: c.tagline || `Shop our ${c.name.toLowerCase()} collection`,
    cta: `Shop ${c.name}`,
    href: `/category/${c.slug}`,
    emoji: c.emoji,
    image: c.image,
    bg: GRADIENTS[idx % GRADIENTS.length],
  }));
  const [i, setI] = useState(0);
  const next = () => setI((v) => (v + 1) % slides.length);
  const prev = () => setI((v) => (v - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s) => (
          <div
            key={s.title}
            className={`flex min-w-full items-center bg-gradient-to-r ${s.bg} px-8 py-14 text-white sm:px-20 md:h-[420px]`}
          >
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 md:flex-row md:justify-between">
              <div className="max-w-xl text-center md:text-left">
                <h2 className="text-3xl font-bold drop-shadow sm:text-5xl">{s.title}</h2>
                <p className="mt-4 text-base text-white/90 sm:text-lg">{s.subtitle}</p>
                <Link
                  href={s.href}
                  className="mt-8 inline-block rounded-lg bg-brand px-8 py-3 font-semibold uppercase tracking-wide shadow-lg hover:bg-brand-dark"
                >
                  {s.cta}
                </Link>
              </div>
              {s.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image} alt={s.title} className="h-48 w-48 rounded-full border-4 border-white/70 object-cover shadow-lg sm:h-72 sm:w-72" />
              ) : (
                <div className="text-7xl drop-shadow-lg sm:text-9xl">{s.emoji}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 px-3 text-5xl text-white/90 hover:text-white sm:left-6"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 text-5xl text-white/90 hover:text-white sm:right-6"
      >
        ›
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, idx) => (
          <button
            key={s.title}
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-white" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
