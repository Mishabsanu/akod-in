import { Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/data";
import { ADDRESS_LINES, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, GENERAL_MESSAGE, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsApp";

export default async function Footer() {
  const categories = await getCategories();

  return (
    <footer id="contact" className="mt-20 bg-black text-white/60">
      {/* About: real text helps search engines understand the brand */}
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-14 sm:px-10 md:grid-cols-[1fr_1.4fr]">
          <h2 className="text-2xl font-light leading-snug tracking-tight text-white sm:text-3xl">
            The best Kerala banana chips, made in God&apos;s Own Country.
          </h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              AKOD makes authentic Kerala snacks the traditional way: hand-picked Kerala bananas, sliced thin and fried in
              pure coconut oil, with no preservatives and no added colours. Every pack is made in Kerala in small batches, so
              it reaches you fresh and crunchy.
            </p>
            <p>
              Choose from classic Kerala banana chips, sweet banana chips, tangy tomato banana chips and more. Order easily on
              WhatsApp and get them delivered anywhere in India.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-14 sm:grid-cols-2 sm:px-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <span className="inline-block rounded-2xl bg-white p-2.5">
            <Image src="/products/logo.jpg" alt="AKOD – Kerala banana chips" width={3067} height={2221} className="h-12 w-auto" />
          </span>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">100% Kerala made. Crafted in pure coconut oil. Delivered across India.</p>
        </div>

        <nav aria-label="Shop">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Shop</h3>
          <ul className="space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="transition hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/search" className="transition hover:text-white">
                All products
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Help</h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/#order" className="transition hover:text-white">
                How to order
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="transition hover:text-white">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href="/returns-refunds" className="transition hover:text-white">
                Returns &amp; Refunds
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="transition hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              <address className="not-italic">
                AKOD Foods
                {ADDRESS_LINES.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
            </li>
            <li>
              <a href={whatsappLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-white">
                <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-white" /> {CONTACT_PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-white/50 sm:flex-row sm:px-10">
          <p>© {new Date().getFullYear()} AKOD Food · www.akod.in</p>
          <p>Made in Kerala, God&apos;s Own Country</p>
        </div>
      </div>
    </footer>
  );
}
