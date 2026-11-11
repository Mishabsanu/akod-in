// Orders and questions go to WhatsApp (the store does not take payments).
// Set NEXT_PUBLIC_WHATSAPP_NUMBER to your number with country code, digits only, e.g. 919876543210.
// Without it, WhatsApp opens and asks the customer which chat to send the message to.

import { formatPrice } from "./format";
import { SITE_URL } from "./site";

export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

/** wa.me link with a pre-filled message. */
export function whatsappLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** "Hi AKOD! I'd like to order: Sweet Banana Chips (400 g) – ₹349" + product link when the site URL is known. */
export function orderMessage(p: { name: string; slug: string }, size?: string, price?: number): string {
  const what = `${p.name}${size ? ` (${size})` : ""}${price ? ` – ${formatPrice(price)}` : ""}`;
  const link = SITE_URL ? `\n${SITE_URL}/product/${p.slug}` : "";
  return `Hi AKOD! I'd like to order: ${what}${link}`;
}

export const GENERAL_MESSAGE = "Hi AKOD! I have a question about your products.";
