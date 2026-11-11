import type { Product } from "./data";

/** The pack a customer is looking at: product + chosen size, price and photo. */
export type CartLine = {
  id: string; // AKOD ECO product id (or variant id)
  slug: string; // product page
  name: string;
  variant: string; // weight / variant label
  price: number;
  image?: string;
  tone: string;
};

/** Pack for a product: the chosen variant, or its default (first in stock, cheapest) when it has variants. */
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
      tone: product.tone,
    },
    inStock: v ? v.inStock : product.inStock,
  };
}
