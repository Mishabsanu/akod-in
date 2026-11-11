// Safe to import from client components.
export const formatPrice = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

export const discountPercent = (price: number, mrp: number) => (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);
