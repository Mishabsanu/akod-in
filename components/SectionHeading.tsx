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
        {eyebrow && <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{eyebrow}</p>}
        <h2 className="mt-1 text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="group flex shrink-0 items-center gap-1.5 text-[13px] text-neutral-600 hover:text-neutral-900">
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
