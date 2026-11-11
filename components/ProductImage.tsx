import Image from "next/image";

type Imageable = { name: string; image?: string | null; emoji: string; color: string };

// Shows the product photo from AKOD ECO if there is one, otherwise an emoji placeholder.
export default function ProductImage({ product, className = "" }: { product: Imageable; className?: string }) {
  if (product.image) {
    return (
      <div className={`relative bg-white ${className}`}>
        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${product.color || "bg-neutral-100"} ${className}`}>
      <span className="transition group-hover:scale-110">{product.emoji}</span>
    </div>
  );
}
