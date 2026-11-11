import type { CartLine } from "@/components/CartProvider";
import type { Product } from "./data";

/** Cart line for a product: the chosen variant, or its default (first in stock, cheapest) when it has variants. */
export function cartLineFor(product: Product, variantId?: string): { line: CartLine; inStock: boolean } {
  const v = product.variants.find((x) => x.id === variantId) ?? product.variants.find((x) => x.inStock) ?? product.variants[0];
  return {
    line: {
      id: v?.id ?? product.id,
      slug: product.slug,
      name: product.name,
      variant: v?.name ?? product.weight,
      price: v?.price ?? product.price,
      image: v?.image ?? product.image,
      emoji: product.emoji,
      color: product.color,
    },
    inStock: v ? v.inStock : product.inStock,
  };
}
