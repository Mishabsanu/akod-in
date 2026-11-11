import type { Metadata } from "next";
import PolicyPage, { type PolicySection } from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Returns & Refunds Policy",
  description:
    "AKOD returns and refunds: report damaged, wrong or defective products within 48 hours for a replacement or refund. Approved refunds are initiated within 5–7 business days.",
  alternates: { canonical: "/returns-refunds" },
};

const SECTIONS: PolicySection[] = [
  {
    title: "Our Commitment",
    body: [
      "At AKOD, customer satisfaction and product quality are our priorities. We take care to ensure that every product is properly inspected, packed and dispatched.",
      "As we deal primarily in food and consumable products, our return and refund policy is designed to maintain product safety and hygiene.",
    ],
  },
  {
    title: "Return Eligibility",
    body: [
      "Returns or replacements may be accepted under the following circumstances:",
      {
        ul: [
          "The product received is damaged.",
          "The wrong product, flavour or variation has been delivered.",
          "The product received is expired or has an incorrect expiry date.",
          "The package is defective, leaking, broken or improperly sealed.",
          "The product has a verified manufacturing or quality defect.",
          "The product received is significantly different from the description provided on our website.",
        ],
      },
      "Customers must report such issues within 48 hours of delivery, along with supporting photographs or videos. This reporting period does not limit any rights available under applicable consumer protection laws.",
    ],
  },
  {
    title: "Non-Returnable Products",
    body: [
      "Due to food safety and hygiene considerations, the following conditions generally apply:",
      {
        ul: [
          "Opened or partially consumed food products cannot be returned for change of mind.",
          "Products cannot be returned simply because the customer does not like the taste or flavour.",
          "Products purchased during clearance or special promotional sales are not eligible for change-of-mind returns, subject to applicable law.",
          "Products damaged after delivery due to improper storage or handling by the customer are not eligible for return.",
        ],
      },
      "These restrictions do not apply to products that are defective, unsafe, wrongly supplied or otherwise eligible for a remedy under applicable law.",
    ],
  },
  {
    title: "How to Request a Return or Replacement",
    body: [
      "To report an issue, customers should contact our support team with:",
      {
        ol: [
          "Order ID or order confirmation.",
          "Customer name and contact details.",
          "Product name and quantity.",
          "Description of the issue.",
          "Clear photographs or videos showing the issue and packaging.",
        ],
      },
      "Our team will review the complaint and communicate the next steps.",
    ],
  },
  {
    title: "Refund Policy",
    body: [
      "Refunds may be provided in the following situations:",
      {
        ul: [
          "The order is cancelled before dispatch and cancellation is accepted.",
          "The product is unavailable after payment.",
          "The wrong or damaged product is verified and a refund is approved.",
          "A product quality complaint is verified and a refund is determined to be the appropriate remedy.",
          "The order cannot be fulfilled by AKOD.",
        ],
      },
      "Approved refunds will generally be initiated within 5–7 business days. The actual credit time may depend on the bank, payment gateway or payment method.",
      "Refunds will normally be processed through the original payment method.",
    ],
  },
  {
    title: "Replacement Policy",
    body: [
      "Where appropriate, AKOD may offer a replacement instead of a refund.",
      "Replacement products will be dispatched subject to stock availability and confirmation of the complaint.",
    ],
  },
  {
    title: "Order Cancellation",
    body: [
      "Customers may request cancellation before the order is dispatched.",
      "Once an order has been shipped, cancellation may not be possible. In such cases, customers should contact our support team for assistance.",
      "If an order cannot be fulfilled by AKOD, the customer will be informed and an applicable refund will be processed.",
    ],
  },
  {
    title: "Shipping Charges for Returns",
    body: [
      "If a return or replacement is approved because of a verified mistake, damage or defect attributable to AKOD or its delivery arrangements, the customer will not be charged for the return.",
      "For other cases, return shipping arrangements will be communicated separately, subject to applicable law.",
    ],
  },
  {
    title: "Refund Processing Time",
    body: [
      "Once a refund is approved, it will generally be initiated within 5–7 business days.",
      "The time required for the amount to appear in the customer's account may vary depending on the payment provider or financial institution.",
    ],
  },
];

export default function ReturnsRefundsPage() {
  return (
    <PolicyPage
      title="Returns & Refunds Policy"
      intro="What to do if something isn't right with your AKOD order."
      path="/returns-refunds"
      sections={SECTIONS}
      contactLead="For return, replacement and refund requests:"
      closing="Our team is committed to resolving genuine customer concerns fairly and promptly."
      related={[
        { href: "/shipping-policy", label: "Shipping Policy" },
        { href: "/privacy-policy", label: "Privacy Policy" },
      ]}
    />
  );
}
