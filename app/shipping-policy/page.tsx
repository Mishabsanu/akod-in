import type { Metadata } from "next";
import PolicyPage, { type PolicySection } from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping Policy – Delivery Across India",
  description:
    "AKOD Group shipping policy: orders processed in 1–3 business days, delivered in 2–5 days within Kerala and 4–8 days across India, with tracking on WhatsApp.",
  alternates: { canonical: "/shipping-policy" },
};

const SECTIONS: PolicySection[] = [
  {
    title: "Introduction",
    body: [
      "At AKOD Group, we are committed to delivering quality food products to our customers safely, securely and on time. This Shipping Policy explains how we process, pack and deliver orders placed through our website.",
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
      {
        ul: [
          "Orders are generally processed within 1–3 business days after successful payment confirmation.",
          "Orders placed on Sundays or public holidays may be processed on the next working day.",
          "Orders may require additional processing time during festivals, promotional campaigns or periods of high demand.",
          "Customers will receive an order confirmation after successful placement.",
        ],
      },
    ],
  },
  {
    title: "Estimated Delivery Time",
    body: [
      "Estimated delivery timelines are:",
      {
        ul: [
          "Within the same state: 2–5 business days.",
          "Other states in India: 4–8 business days.",
          "Remote locations: Additional delivery time may apply.",
        ],
      },
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
      "AKOD Group will not be responsible for delays or failed deliveries resulting from incorrect addresses, incomplete information or the customer's unavailability.",
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
    <PolicyPage
      title="Shipping Policy"
      intro="How we process, pack and deliver your AKOD order across India."
      path="/shipping-policy"
      sections={SECTIONS}
      contactLead="For shipping-related queries:"
      closing="We appreciate your trust in AKOD Group."
      related={[
        { href: "/returns-refunds", label: "Returns & Refunds" },
        { href: "/privacy-policy", label: "Privacy Policy" },
      ]}
    />
  );
}
