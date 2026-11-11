import Image from "next/image";

type Imageable = { name: string; image?: string | null; tone?: string; variant?: string; weight?: string };

/** Pack colours for products without a photo (picked from the name, so a product always gets the same one). */
const PACK_COLORS = ["#e3202a", "#f2b21b", "#3f6b2a", "#c2410c", "#8a1c1c", "#0f766e", "#b45309", "#4d7c0f"];
const packColor = (name: string) => PACK_COLORS[[...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % PACK_COLORS.length];

/** A clean pouch mock-up, so products without photos still look like products. */
export function PackShot({ name, label, className = "", mini = false }: { name: string; label?: string; className?: string; mini?: boolean }) {
  const color = packColor(name);
  return (
    <div
      className={`relative flex aspect-[3/4.1] flex-col items-center overflow-hidden rounded-[14%_14%_10%_10%/10%_10%_6%_6%] shadow-[0_24px_40px_-24px_rgba(0,0,0,0.55)] ${className}`}
      style={{ background: `linear-gradient(160deg, ${color} 0%, ${color} 55%, color-mix(in srgb, ${color} 75%, black) 100%)` }}
    >
      {/* seal + tear notch */}
      <div className="h-[7%] w-full bg-black/15" />
      <div className="absolute left-0 top-[10%] h-[3%] w-full bg-white/15" />
      {/* glossy edge */}
      <div className="pointer-events-none absolute inset-y-0 left-[8%] w-[10%] bg-white/15 blur-[2px]" />
      <div className="mt-[22%] flex w-[78%] flex-col items-center rounded-[10px] bg-white/95 px-[6%] py-[8%] text-center">
        <Image src="/products/logo.jpg" alt="" width={3067} height={2221} className="w-1/2 mix-blend-multiply" />
        {!mini && (
          <>
            <p className="mt-[6%] line-clamp-2 text-[clamp(8px,1.1vw,13px)] font-semibold leading-tight text-neutral-900">{name}</p>
            {label && <p className="mt-0.5 text-[clamp(7px,0.9vw,11px)] text-neutral-500">{label}</p>}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Product photo from AKOD ECO, or a pack mock-up when there is none.
 * `bare` drops the grey stage (for the Try the Taste showcase).
 */
export default function ProductImage({
  product,
  className = "",
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority = false,
  bare = false,
  mini = false,
}: {
  product: Imageable;
  className?: string;
  sizes?: string;
  priority?: boolean;
  bare?: boolean;
  /** Small thumbnail: pack mock-up without text */
  mini?: boolean;
}) {
  const stage = bare ? "" : "bg-[#f5f5f3]";

  if (product.image) {
    return (
      <div className={`relative overflow-hidden ${stage} ${className}`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          className={`object-contain mix-blend-multiply ${bare ? "" : "p-[6%]"} transition duration-500 group-hover:scale-[1.03]`}
          sizes={sizes}
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${stage} ${className}`}>
      <PackShot
        name={product.name}
        label={product.variant ?? product.weight}
        mini={mini}
        className={`${bare ? "w-full" : "w-[48%]"} transition duration-500 group-hover:-translate-y-1`}
      />
    </div>
  );
}
