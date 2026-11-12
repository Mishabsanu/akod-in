import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Instant refresh: AKOD ECO calls this after a product, offer, category or stock change,
 * so the store shows it right away instead of waiting for the timed refresh.
 *   POST /api/revalidate   header: x-revalidate-key: <REVALIDATE_SECRET>
 */
function keyOk(req: NextRequest, expected: string): boolean {
  const a = Buffer.from(req.headers.get("x-revalidate-key") ?? "");
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) return NextResponse.json({ error: "REVALIDATE_SECRET is not set on the store" }, { status: 503 });
  if (!keyOk(req, expected)) return NextResponse.json({ error: "Invalid key" }, { status: 401 });

  // Drop the cached catalog and every page built from it (home, categories, products, sitemap)
  revalidateTag("catalog");
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
