import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export default function EmptyState({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Icon className="h-9 w-9" strokeWidth={1.6} />
      </span>
      <h1 className="mt-6 font-display text-2xl font-semibold text-ink">{title}</h1>
      {text && <p className="mt-2 text-muted">{text}</p>}
      {action && (
        <Link href={action.href} className="mt-8 rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
          {action.label}
        </Link>
      )}
    </div>
  );
}
