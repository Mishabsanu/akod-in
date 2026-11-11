"use client";

import { useState } from "react";
import type { Product } from "@/lib/data";
import ProductImage from "./ProductImage";

export default function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const images = product.images;
  const current = { ...product, image: images[active] ?? product.image };

  return (
    <div>
      <ProductImage
        product={current}
        className="aspect-square rounded-3xl border border-line"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.slice(0, 5).map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`overflow-hidden rounded-xl border-2 transition ${i === active ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <ProductImage product={{ ...product, image: src }} className="aspect-square" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
