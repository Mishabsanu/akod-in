import { BadgeCheck, Leaf, ShieldCheck, Truck } from "lucide-react";

const ITEMS = [
  { icon: Leaf, title: "100% Natural", text: "No preservatives or colours" },
  { icon: Truck, title: "Free Delivery", text: "On orders above ₹499" },
  { icon: ShieldCheck, title: "Secure Payments", text: "UPI, cards & net banking" },
  { icon: BadgeCheck, title: "Quality Checked", text: "Packed fresh in small batches" },
];

export default function TrustBar() {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-7 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="text-xs text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
