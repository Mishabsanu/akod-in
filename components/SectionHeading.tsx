import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel = "View all",
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>}
        <h2 className="mt-1.5 font-display text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink hover:text-brand">
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
