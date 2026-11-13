import { Award, Gem, Handshake, Heart, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

/** Brand promises: title (from AKOD) + a short supporting line, each with its own colour. */
const ITEMS: { icon: LucideIcon; title: string; text: string; color: string; tint: string }[] = [
  { icon: Gem, title: "Premium quality products", text: "Carefully chosen bananas and ingredients", color: "#7C3AED", tint: "#F3EEFF" },
  { icon: Truck, title: "Free delivery above ₹499", text: "Flat ₹60 delivery below ₹499", color: "#059669", tint: "#E7F8F1" },
  { icon: Award, title: "Authentic flavours of Kerala", text: "Traditional recipes from God's Own Country", color: "#D97706", tint: "#FEF4E2" },
  { icon: Heart, title: "Goodness in every bite", text: "Crunchy, fresh and made in coconut oil", color: "#E11D48", tint: "#FDECEF" },
  { icon: ShieldCheck, title: "A brand you can trust", text: "Packed fresh in small batches", color: "#2563EB", tint: "#EAF1FE" },
  { icon: Handshake, title: "Where quality meets trust", text: "Easy ordering, quick replies on WhatsApp", color: "#0F766E", tint: "#E3F4F2" },
];

/** "Why choose AKOD": six static promise cards (no motion, easy to scan on any screen). */
export default function TrustBar() {
  return (
    <section aria-labelledby="why-akod" className="border-b border-neutral-200 bg-[#fafaf9]">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2 sm:mb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E3202A]">Why choose AKOD</p>
            <h2 id="why-akod" className="mt-1.5 text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
              Made with care, delivered with trust
            </h2>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
          {ITEMS.map(({ icon: Icon, title, text, color, tint }) => (
            <li
              key={title}
              className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_14px_30px_-18px_rgba(0,0,0,0.35)] sm:p-5"
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl transition duration-300 group-hover:scale-105 sm:h-12 sm:w-12"
                style={{ background: tint, color }}
              >
                <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={2} />
              </span>
              <h3 className="mt-4 text-[14px] font-semibold leading-snug text-neutral-900 sm:text-[15px]">{title}</h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-neutral-500 sm:text-[13px]">{text}</p>
              <span className="mt-auto block h-0.5 w-8 rounded-full pt-0 transition-all duration-300 group-hover:w-14" style={{ background: color, marginTop: "1rem" }} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
