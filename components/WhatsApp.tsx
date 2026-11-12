import { GENERAL_MESSAGE, whatsappLink } from "@/lib/whatsapp";

/** WhatsApp glyph (brand icons are not in lucide). */
export function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.47 15.02L2.05 22l5.1-1.5A9.92 9.92 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.03.9.9-2.95-.2-.31a8.17 8.17 0 1 1 6.81 3.69Zm4.49-6.12c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22a7.43 7.43 0 0 1-1.37-1.7c-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 0 0-.66.31 2.78 2.78 0 0 0-.87 2.07c0 1.22.89 2.4 1.01 2.57.12.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

/** Black pill / full-width button that opens WhatsApp with a message. */
export function WhatsAppButton({
  text,
  label = "Order on WhatsApp",
  size = "md",
  variant = "solid",
  className = "",
  disabled = false,
}: {
  text: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline";
  className?: string;
  disabled?: boolean;
}) {
  const sizes = { sm: "h-10 px-4 text-[13px]", md: "h-12 px-6 text-sm", lg: "h-14 px-7 text-base" };
  const look =
    variant === "solid"
      ? "bg-neutral-900 text-white hover:bg-neutral-700"
      : "border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white";
  if (disabled) {
    return (
      <span className={`inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-neutral-100 font-medium text-neutral-400 ${sizes[size]} ${className}`}>
        {label}
      </span>
    );
  }
  return (
    <a
      href={whatsappLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition ${look} ${sizes[size]} ${className}`}
    >
      <WhatsAppIcon className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
      {label}
    </a>
  );
}

/** Floating "chat with us" button, bottom-right on every page. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(GENERAL_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[500] flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-3 sm:h-14 sm:px-4 text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] transition-all hover:pr-5 sm:bottom-7 sm:right-7"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300 group-hover:max-w-[160px]">
        Chat with us
      </span>
    </a>
  );
}
