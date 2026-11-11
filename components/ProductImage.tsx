import Image from "next/image";

type Imageable = { name: string; image?: string | null; tone: string };

/**
 * Product photo from AKOD ECO. Without one: a soft brand tile with the akod mark,
 * so a missing photo still looks deliberate.
 */
export default function ProductImage({
  product,
  className = "",
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority = false,
}: {
  product: Imageable;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (product.image) {
    return (
      <div className={`relative overflow-hidden bg-white ${className}`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes={sizes}
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${product.tone || "bg-stone-100"} ${className}`}>
      <Image
        src="/products/logo.jpg"
        alt=""
        width={3067}
        height={2221}
        className="w-2/5 max-w-40 rounded-[40%] opacity-90 mix-blend-multiply transition duration-500 group-hover:scale-105"
      />
    </div>
  );
}
