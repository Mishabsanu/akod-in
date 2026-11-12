import { BadgeCheck, Leaf, MessageCircle, Truck } from "lucide-react";

const ITEMS = [
  { icon: Leaf, title: "100% natural", text: "No preservatives or colours" },
  { icon: Truck, title: "Free delivery", text: "On orders above ₹499" },
  { icon: MessageCircle, title: "Order on WhatsApp", text: "Quick replies, easy ordering" },
  { icon: BadgeCheck, title: "Made in coconut oil", text: "Packed fresh in small batches" },
];

export default function TrustBar() {
  return (
    <section className="border-b border-neutral-200">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-6 px-4 py-6 sm:px-6 lg:px-10 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0 text-neutral-900" strokeWidth={1.4} />
            <div>
              <p className="text-[13px] font-medium text-neutral-900">{title}</p>
              <p className="text-xs text-neutral-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
