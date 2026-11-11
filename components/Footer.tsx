import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/data";

export default async function Footer() {
  const categories = await getCategories();

  return (
    <footer id="contact" className="mt-20 bg-ink text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <span className="inline-block rounded-2xl bg-white p-2.5">
            <Image src="/products/logo.jpg" alt="AKOD Food" width={3067} height={2221} className="h-12 w-auto" />
          </span>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Natural snacks, spices, honey, powders and cold pressed oils — made the traditional way and delivered fresh to
            your door.
          </p>
        </div>

        <div>
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
              <Link href="/search?q=" className="transition hover:text-white">
                All products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Help</h3>
          <ul className="space-y-2.5 text-sm">
            <li>Shipping Policy</li>
            <li>Returns &amp; Refunds</li>
            <li>Privacy Policy</li>
            <li>Terms &amp; Conditions</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sun" />
              Your address here
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sun" />
              +91 00000 00000
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sun" />
              <a href="mailto:support@akodfood.com" className="hover:text-white">
                support@akodfood.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} AKOD Food. All rights reserved.</p>
          <p>Prices include all taxes</p>
        </div>
      </div>
    </footer>
  );
}
