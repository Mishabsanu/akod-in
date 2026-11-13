import { Award, Gem, Handshake, Heart, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

const ITEMS: { icon: LucideIcon; text: string }[] = [
  { icon: Gem, text: "Premium quality products" },
  { icon: Truck, text: "Free delivery on orders above ₹499" },
  { icon: Award, text: "Authentic flavours of Kerala" },
  { icon: Heart, text: "Goodness in every bite" },
  { icon: ShieldCheck, text: "A brand you can trust" },
  { icon: Handshake, text: "Where quality meets trust" },
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {ITEMS.map(({ icon: Icon, text }) => (
        <li key={text} className="flex shrink-0 items-center gap-2.5 px-6 sm:px-8">
          <Icon className="h-[18px] w-[18px] shrink-0 text-neutral-900" strokeWidth={1.5} />
          <span className="whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.16em] text-neutral-900 sm:text-[13px]">{text}</span>
          <span className="ml-6 h-1 w-1 rotate-45 bg-neutral-300 sm:ml-8" />
        </li>
      ))}
    </ul>
  );
}

/** Brand promises, scrolling slowly in a loop (pauses on hover, still for reduced motion). */
export default function TrustBar() {
  return (
    <section aria-label="Why AKOD" className="group relative overflow-hidden border-y border-neutral-200 bg-white py-4 sm:py-5">
      {/* soft fade at both edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-24" />
      <div className="flex w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center">
        <Row />
        <div className="flex motion-reduce:hidden">
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
