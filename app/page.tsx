import { Store } from "lucide-react";
import CategoryGrid from "@/components/CategoryGrid";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import TasteShowcase from "@/components/TasteShowcase";
import OfferBanner from "@/components/OfferBanner";
import TrustBar from "@/components/TrustBar";
import { WhatsAppButton } from "@/components/WhatsApp";
import JsonLd, { itemListLd } from "@/components/JsonLd";
import { getCatalog } from "@/lib/data";
import { GENERAL_MESSAGE } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const GRID = "grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4";
const WRAP = "mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10";

export default async function Home() {
  const { categories, products, offers } = await getCatalog();

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Store}
        title="Our store is getting ready"
        text="We're stocking the shelves. Fresh products will appear here very soon."
      />
    );
  }

  const best = products.filter((p) => p.bestSeller).slice(0, 8);

  return (
    <>
      <JsonLd data={itemListLd("AKOD Kerala banana chips and snacks", products)} />
      <TasteShowcase products={products} />
      <OfferBanner offers={offers} products={products} />
      <TrustBar />

      {categories.length > 0 && (
        <section id="categories" className={`${WRAP} scroll-mt-24 pt-20`}>
          <SectionHeading title="Shop by category" />
          <div className="mt-8">
            <CategoryGrid categories={categories} products={products} />
          </div>
        </section>
      )}

      {best.length > 0 && (
        <section id="best-sellers" className={`${WRAP} scroll-mt-24 pt-20`}>
          <SectionHeading title="Best sellers" href="/search" linkLabel="Shop all" />
          <div className={`mt-8 ${GRID}`}>
            {best.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {categories.map((c) => {
        const list = products.filter((p) => p.category === c.slug);
        if (list.length === 0) return null;
        return (
          <section key={c.slug} className={`${WRAP} pt-20`}>
            <SectionHeading title={c.name} href={`/category/${c.slug}`} />
            <div className={`mt-8 ${GRID}`}>
              {list.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        );
      })}

      {/* How ordering works: WhatsApp */}
      <section id="order" className={`${WRAP} scroll-mt-24 pt-24`}>
        <div className="grid gap-10 rounded-2xl bg-neutral-950 px-6 py-10 text-white sm:px-12 sm:py-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-white/50">HOW TO ORDER</p>
            <h2 className="mt-3 text-2xl font-light tracking-tight sm:text-3xl md:text-4xl">Order in a quick WhatsApp chat.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
              Pick your packs, tap Order on WhatsApp, and we&apos;ll confirm your order, delivery and payment right in the chat.
            </p>
            <WhatsAppButton text={GENERAL_MESSAGE} label="Chat with us" className="mt-7 w-full bg-white sm:w-auto !text-neutral-900 hover:!bg-neutral-200" />
          </div>
          <ol className="space-y-5">
            {[
              ["01", "Choose a pack", "Browse and pick the size you want."],
              ["02", "Tap Order on WhatsApp", "Your order is written for you."],
              ["03", "We confirm & deliver", "We reply quickly with the total and delivery time."],
            ].map(([n, t, d]) => (
              <li key={n} className="flex gap-4 border-t border-white/10 pt-5 first:border-0 first:pt-0">
                <span className="font-mono text-xs text-white/40">{n}</span>
                <div>
                  <p className="text-sm font-medium">{t}</p>
                  <p className="mt-0.5 text-[13px] text-white/50">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
