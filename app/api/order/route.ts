import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const API_URL = (process.env.AKOD_ECO_API_URL ?? "http://localhost:3000").replace(/\/+$/, "");

/**
 * POST /api/order — the cart's order, passed on to AKOD ECO (saved there as an AKOD IN marketplace
 * order). Done on the server so the storefront key never reaches the browser.
 * Body: { items: { id, qty }[], customer: { name, phone, address, landmark, city, district, state, pincode, note } }
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.STOREFRONT_API_KEY) headers["x-storefront-key"] = process.env.STOREFRONT_API_KEY;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) headers["x-customer-ip"] = ip;

  try {
    const res = await fetch(`${API_URL}/api/storefront/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[order] Could not reach AKOD ECO:", error);
    return NextResponse.json({ error: "Could not save the order right now" }, { status: 502 });
  }
}
