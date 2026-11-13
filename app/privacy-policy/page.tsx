import type { Metadata } from "next";
import PolicyPage, { type PolicySection } from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How AKOD GROUP collects, uses, stores and protects your personal information when you visit www.akod.in or order our Kerala products.",
  alternates: { canonical: "/privacy-policy" },
};

const SECTIONS: PolicySection[] = [
  {
    title: "Introduction",
    body: [
      "Welcome to AKOD.",
      "We respect your privacy and are committed to protecting the personal information you share with us when visiting our website, creating an account or purchasing our products.",
      "This Privacy Policy explains how we collect, use, store and protect your personal information.",
    ],
  },
  {
    title: "Information We Collect",
    body: [
      "When you interact with our website, we may collect the following information:",
      { h: "Personal Information" },
      { ul: ["Full name.", "Mobile number.", "Email address.", "Billing address.", "Shipping and delivery address."] },
      { h: "Order Information" },
      { ul: ["Products purchased.", "Order history.", "Order value and transaction details.", "Delivery and tracking information."] },
      { h: "Technical Information" },
      { ul: ["IP address.", "Browser and device information.", "Website usage data.", "Cookies and similar tracking technologies."] },
      "Payment card details and other sensitive payment credentials are generally processed by our authorised payment gateway providers. We do not intend to store complete card details on our website.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "We may use your information to:",
      {
        ul: [
          "Process and deliver customer orders.",
          "Send order confirmations and shipping updates.",
          "Provide customer support.",
          "Process refunds, returns and replacements.",
          "Improve our website and shopping experience.",
          "Communicate new products, offers and promotions where permitted.",
          "Prevent fraudulent transactions and unauthorised activities.",
          "Comply with applicable legal and regulatory requirements.",
        ],
      },
    ],
  },
  {
    title: "Sharing of Information",
    body: [
      "We do not sell customers' personal information.",
      "However, we may share relevant information with trusted service providers when necessary, including:",
      {
        ul: [
          "Courier and logistics companies.",
          "Payment gateway providers.",
          "Website hosting and technical service providers.",
          "Customer support and communication platforms.",
          "Marketing and analytics service providers.",
          "Government authorities where legally required.",
        ],
      },
      "Such sharing will be limited to what is reasonably necessary for the relevant purpose and subject to applicable legal requirements.",
    ],
  },
  {
    title: "Cookies and Tracking Technologies",
    body: [
      "Our website may use cookies and similar technologies to:",
      {
        ul: [
          "Improve website functionality.",
          "Remember customer preferences.",
          "Understand website traffic.",
          "Analyse shopping behaviour.",
          "Improve advertising and marketing performance.",
        ],
      },
      "Customers can manage cookie preferences through available website settings or their browser settings.",
    ],
  },
  {
    title: "Data Security",
    body: [
      "We take reasonable technical and organisational measures to protect customer information against unauthorised access, misuse, loss, alteration or disclosure.",
      "However, no internet-based system can guarantee complete security.",
    ],
  },
  {
    title: "Data Retention",
    body: [
      "We retain personal information only for as long as reasonably necessary to fulfil the purposes described in this policy, including order processing, customer support, legal compliance and dispute resolution.",
    ],
  },
  {
    title: "Your Privacy Rights",
    body: [
      "Subject to applicable law, customers may have the right to:",
      {
        ul: [
          "Request access to their personal information.",
          "Request correction of inaccurate information.",
          "Request deletion of information where legally permissible.",
          "Withdraw consent where processing is based on consent.",
          "Raise privacy-related complaints.",
        ],
      },
      "To exercise these rights, customers can contact our privacy support team.",
    ],
  },
  {
    title: "Third-Party Websites",
    body: [
      "Our website may contain links to third-party websites or services.",
      "AKOD GROUP is not responsible for the privacy practices of external websites. Customers are encouraged to review their respective privacy policies.",
    ],
  },
  {
    title: "Children's Privacy",
    body: [
      "Our website is intended for general consumers and is not directed at children.",
      "We do not knowingly collect children's personal information in violation of applicable laws.",
    ],
  },
  {
    title: "Changes to This Privacy Policy",
    body: [
      "AKOD GROUP reserves the right to update this Privacy Policy from time to time.",
      "Any changes will be published on this page with the revised effective date.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="How we collect, use and protect your personal information."
      path="/privacy-policy"
      sections={SECTIONS}
      contactLead="For privacy-related questions, requests or complaints:"
      closing="We value your trust and are committed to handling your personal information responsibly."
      related={[
        { href: "/shipping-policy", label: "Shipping Policy" },
        { href: "/returns-refunds", label: "Returns & Refunds" },
      ]}
    />
  );
}
