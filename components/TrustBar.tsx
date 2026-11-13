import { Award, Gem, Handshake, Heart, ShieldCheck, Sparkle, Truck, type LucideIcon } from "lucide-react";

/** Each promise gets its own colour (icon badge), on a warm Kerala-sunset band. */
const ITEMS: { icon: LucideIcon; text: string; color: string }[] = [
  { icon: Gem, text: "Premium quality products", color: "#7C3AED" },
  { icon: Truck, text: "Free delivery on orders above ₹499", color: "#0E9F6E" },
  { icon: Award, text: "Authentic flavours of Kerala", color: "#D97706" },
  { icon: Heart, text: "Goodness in every bite", color: "#E11D48" },
  { icon: ShieldCheck, text: "A brand you can trust", color: "#2563EB" },
  { icon: Handshake, text: "Where quality meets trust", color: "#0F766E" },
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {ITEMS.map(({ icon: Icon, text, color }) => (
        <li key={text} className="flex shrink-0 items-center gap-3 px-5 sm:px-7">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_-4px_rgba(0,0,0,0.35)] ring-2 ring-white/40 sm:h-9 sm:w-9"
            style={{ color }}
          >
            <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.2} />
          </span>
          <span className="whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.14em] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] sm:text-[13.5px]">
            {text}
          </span>
          <Sparkle className="ml-5 h-3.5 w-3.5 shrink-0 fill-yellow-200 text-yellow-200 sm:ml-7" />
        </li>
      ))}
    </ul>
  );
}

/** Brand promises, scrolling slowly in a loop (pauses on hover, still for reduced motion). */
export default function TrustBar() {
  return (
    <section
      aria-label="Why AKOD"
      className="group relative overflow-hidden py-3.5 sm:py-4"
      style={{ background: "linear-gradient(90deg, #C8102E 0%, #E3202A 25%, #F05A28 60%, #F59E0B 100%)" }}
    >
      {/* subtle shine + soft edges in the band's own colours */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#C8102E] to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#F59E0B] to-transparent sm:w-20" />
      <div className="relative flex w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3">
        <Row />
        <div className="flex motion-reduce:hidden">
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
