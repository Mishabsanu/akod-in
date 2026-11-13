import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import JsonLd, { breadcrumbLd } from "./JsonLd";
import { ADDRESS_LINES, CONTACT_PHONE_DISPLAY, GENERAL_MESSAGE, POLICY_EMAIL, whatsappLink } from "@/lib/whatsapp";

/** A paragraph, a bullet list ({ ul }), a numbered list ({ ol }) or a small sub-heading ({ h }). */
export type PolicyBlock = string | { ul: string[] } | { ol: string[] } | { h: string };
export type PolicySection = { title: string; body: PolicyBlock[] };

/** Shared layout for Shipping Policy, Returns & Refunds, etc. Ends with the AKOD GROUP contact block. */
export default function PolicyPage({
  title,
  intro,
  path,
  sections,
  contactLead,
  closing,
  related,
}: {
  title: string;
  intro: string;
  path: string;
  sections: PolicySection[];
  contactLead: string;
  closing: string;
  related?: { href: string; label: string }[];
}) {
  const num = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-10">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: title, path },
        ])}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <h1 className="mt-6 text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl">{title}</h1>
      <p className="mt-3 text-neutral-500">{intro}</p>

      <ol className="mt-10 space-y-9">
        {sections.map((s, i) => (
          <li key={s.title}>
            <h2 className="flex gap-3 text-lg font-medium text-neutral-900">
              <span className="font-mono text-sm text-neutral-400">{num(i)}</span>
              {s.title}
            </h2>
            <div className="mt-3 space-y-3 text-[15px] sm:pl-8 leading-relaxed text-neutral-600">
              {s.body.map((b, j) =>
                typeof b === "string" ? (
                  <p key={j}>{b}</p>
                ) : "h" in b ? (
                  <h3 key={j} className="pt-2 text-[15px] font-medium text-neutral-900">
                    {b.h}
                  </h3>
                ) : "ul" in b ? (
                  <ul key={j} className="list-disc space-y-1.5 pl-5 marker:text-neutral-400">
                    {b.ul.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ) : (
                  <ol key={j} className="list-decimal space-y-1.5 pl-5 marker:text-neutral-400">
                    {b.ol.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ol>
                )
              )}
            </div>
          </li>
        ))}

        <li>
          <h2 className="flex gap-3 text-lg font-medium text-neutral-900">
            <span className="font-mono text-sm text-neutral-400">{num(sections.length)}</span>
            Contact Information
          </h2>
          <div className="mt-3 text-[15px] sm:pl-8 leading-relaxed text-neutral-600">
            <p>{contactLead}</p>
            <address className="mt-3 not-italic">
              <p className="font-medium text-neutral-900">AKOD GROUP</p>
              {ADDRESS_LINES.map((l) => (
                <p key={l}>{l}</p>
              ))}
              <p className="mt-2">Website: www.akod.in</p>
              <p>
                Phone / WhatsApp:{" "}
                <a href={whatsappLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="text-neutral-900 underline-offset-4 hover:underline">
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </p>
              <p>
                Email:{" "}
                <a href={`mailto:${POLICY_EMAIL}`} className="text-neutral-900 underline-offset-4 hover:underline">
                  {POLICY_EMAIL}
                </a>
              </p>
            </address>
            <p className="mt-5">{closing}</p>
          </div>
        </li>
      </ol>

      {related && related.length > 0 && (
        <p className="mt-12 flex flex-wrap gap-x-4 gap-y-1 border-t border-neutral-200 pt-6 text-sm text-neutral-500">
          See also:
          {related.map((r) => (
            <Link key={r.href} href={r.href} className="text-neutral-900 underline-offset-4 hover:underline">
              {r.label}
            </Link>
          ))}
        </p>
      )}
    </div>
  );
}
