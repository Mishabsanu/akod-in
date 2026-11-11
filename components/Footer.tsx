import Link from "next/link";
import { getCategories } from "@/lib/data";

export default async function Footer() {
  const categories = await getCategories();
  return (
    <footer id="contact" className="mt-16 bg-neutral-900 text-neutral-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="inline-block rounded-full bg-brand px-4 py-1.5 text-lg font-extrabold italic text-white">
            AKOD Food
          </span>
          <p className="mt-4 text-sm leading-relaxed">
            Natural snacks, spices, dry fruits, powders and cold pressed oils, delivered fresh to your doorstep.
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-white">Shop</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-white">Help</h3>
          <ul className="space-y-2 text-sm">
            <li>Shipping Policy</li>
            <li>Returns & Refunds</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-white">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li>📍 Your address here</li>
            <li>📞 +91 00000 00000</li>
            <li>
              ✉ <a href="mailto:support@akodfood.com" className="hover:text-white">support@akodfood.com</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} AKOD Food. All rights reserved.
      </div>
    </footer>
  );
}
