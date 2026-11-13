// Orders and questions go to WhatsApp (the store does not take payments).
// Set NEXT_PUBLIC_WHATSAPP_NUMBER to your number with country code, digits only, e.g. 919876543210.
// Without it, WhatsApp opens and asks the customer which chat to send the message to.

import { formatPrice } from "./format";
import { SITE_URL } from "./site";

/** AKOD GROUP WhatsApp (+91 90746 84488); NEXT_PUBLIC_WHATSAPP_NUMBER overrides it. */
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919074684488").replace(/\D/g, "");
export const CONTACT_PHONE_DISPLAY = "+91 90746 84488";
/** General contact (footer, Google business info). */
export const CONTACT_EMAIL = "akodfood@gmail.com";
/** Support address named in the Shipping, Returns & Privacy policies. */
export const POLICY_EMAIL = "support@akodgroup.com";

export const ADDRESS_LINES = ["KK Tower, Nallamthanni", "Edakkara Road, Pathiripadam PO", "Malappuram District, Kerala, India"];
export const ADDRESS = {
  streetAddress: "KK Tower, Nallamthanni, Edakkara Road, Pathiripadam PO",
  addressLocality: "Malappuram",
  addressRegion: "Kerala",
  addressCountry: "IN",
};

/** wa.me link with a pre-filled message. */
export function whatsappLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** "Hi AKOD! I'd like to order: Sweet Banana Chips (400 g) – ₹349" + product link when the site URL is known. */
export function orderMessage(p: { name: string; slug: string; offer?: { name: string } }, size?: string, price?: number): string {
  const what = `${p.name}${size ? ` (${size})` : ""}${price ? ` – ${formatPrice(price)}` : ""}${p.offer ? ` [${p.offer.name}]` : ""}`;
  const link = SITE_URL ? `\n${SITE_URL}/product/${p.slug}` : "";
  return `Hi AKOD! I'd like to order: ${what}${link}`;
}

export const GENERAL_MESSAGE = "Hi AKOD! I have a question about your products.";

/** Orders at or above this get free delivery; below it, the charge is confirmed on WhatsApp. */
export const FREE_DELIVERY_ABOVE = 499;

export type DeliveryAddress = {
  name: string;
  phone: string;
  address: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  note: string;
};

/** Whole cart + delivery address as one WhatsApp order message. */
export function cartOrderMessage(
  items: { name: string; variant: string; price: number; qty: number }[],
  a: DeliveryAddress
): string {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const lines = items.map(
    (i, n) => `${n + 1}. ${i.name}${i.variant ? ` (${i.variant})` : ""} × ${i.qty} = ${formatPrice(i.price * i.qty)}`
  );
  const delivery = subtotal >= FREE_DELIVERY_ABOVE ? "Free" : "To be confirmed";
  const place = [a.address, a.landmark && `Landmark: ${a.landmark}`, [a.city, a.district].filter(Boolean).join(", "), `${a.state} – ${a.pincode}`]
    .filter(Boolean)
    .join("\n");
  return [
    "Hi AKOD! I'd like to place an order 🛒",
    "",
    ...lines,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    `Delivery: ${delivery}`,
    "",
    "*Deliver to*",
    a.name,
    `Phone: ${a.phone}`,
    place,
    ...(a.note ? ["", `Note: ${a.note}`] : []),
  ].join("\n");
}
