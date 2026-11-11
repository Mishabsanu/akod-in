import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbLd } from "@/components/JsonLd";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, GENERAL_MESSAGE, whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Shipping Policy – Delivery Across India",
  description:
    "AKOD Foods shipping policy: orders processed in 1–3 business days, delivered in 2–5 days within Kerala and 4–8 days across India, with tracking on WhatsApp.",
  alternates: { canonical: "/shipping-policy" },
};

const SECTIONS: { title: string; body: (string | string[])[] }[] = [
  {
    title: "Introduction",
    body: [
      "At AKOD Foods, we are committed to delivering quality food products to our customers safely, securely and on time. This Shipping Policy explains how we process, pack and deliver orders placed through our website.",
    ],
  },
  {
    title: "Shipping Locations",
    body: [
      "We currently accept orders for delivery within India, subject to serviceability of the delivery location.",
      "International shipping may be available depending on the product, destination and applicable export regulations.",
    ],
  },
  {
    title: "Order Processing",
    body: [
      [
        "Orders are generally processed within 1–3 business days after successful payment confirmation.",
        "Orders placed on Sundays or public holidays may be processed on the next working day.",
        "Orders may require additional processing time during festivals, promotional campaigns or periods of high demand.",
        "Customers will receive an order confirmation after successful placement.",
      ],
    ],
  },
  {
    title: "Estimated Delivery Time",
    body: [
      "Estimated delivery timelines are:",
      [
        "Within the same state: 2–5 business days.",
        "Other states in India: 4–8 business days.",
        "Remote locations: Additional delivery time may apply.",
      ],
      "Delivery timelines are estimates and may vary depending on the courier service, location, weather conditions and other unforeseen circumstances.",
    ],
  },
  {
    title: "Shipping Charges",
    body: [
      "Shipping charges, if applicable, will be displayed during checkout before payment.",
      "Free shipping may be offered on selected orders, promotional campaigns or purchases above a specified order value.",
    ],
  },
  {
    title: "Order Tracking",
    body: [
      "Once your order is dispatched, tracking information will be shared through SMS, email or WhatsApp, wherever available.",
      "Customers can use the tracking details to monitor their shipments.",
    ],
  },
  {
    title: "Delivery Issues",
    body: [
      "Customers are requested to provide accurate delivery addresses and contact details while placing orders.",
      "AKOD Foods will not be responsible for delays or failed deliveries resulting from incorrect addresses, incomplete information or the customer's unavailability.",
      "If an order is delayed, lost or marked as delivered but not received, customers should contact our support team.",
    ],
  },
  {
    title: "Damaged Packages",
    body: [
      "If a package arrives visibly damaged, customers are encouraged to take photographs or videos of the package and contact us immediately.",
      "Please refer to our Returns & Refunds Policy for further details.",
    ],
  },
];

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Shipping Policy", path: "/shipping-policy" },
        ])}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shipping Policy" }]} />
      <h1 className="mt-6 text-4xl font-light tracking-tight text-neutral-900">Shipping Policy</h1>
      <p className="mt-3 text-neutral-500">How we process, pack and deliver your AKOD order across India.</p>

      <ol className="mt-10 space-y-9">
        {SECTIONS.map((s, i) => (
          <li key={s.title}>
            <h2 className="flex gap-3 text-lg font-medium text-neutral-900">
              <span className="font-mono text-sm text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </h2>
            <div className="mt-3 space-y-3 pl-8 text-[15px] leading-relaxed text-neutral-600">
              {s.body.map((b, j) =>
                Array.isArray(b) ? (
                  <ul key={j} className="list-disc space-y-1.5 pl-5 marker:text-neutral-400">
                    {b.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={j}>{b}</p>
                )
              )}
            </div>
          </li>
        ))}

        <li>
          <h2 className="flex gap-3 text-lg font-medium text-neutral-900">
            <span className="font-mono text-sm text-neutral-400">{String(SECTIONS.length + 1).padStart(2, "0")}</span>
            Contact Information
          </h2>
          <div className="mt-3 pl-8 text-[15px] leading-relaxed text-neutral-600">
            <p>For shipping-related queries:</p>
            <address className="mt-3 not-italic">
              <p className="font-medium text-neutral-900">AKOD Foods</p>
              <p>Website: www.akod.in</p>
              <p>
                Phone / WhatsApp:{" "}
                <a href={whatsappLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="text-neutral-900 underline-offset-4 hover:underline">
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </p>
              <p>
                Email:{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-neutral-900 underline-offset-4 hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </address>
            <p className="mt-5">We appreciate your trust in AKOD Foods.</p>
          </div>
        </li>
      </ol>
    </div>
  );
}
