# akod-in

AKOD Food online store (Next.js). Products and categories come from AKOD ECO.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and set `AKOD_ECO_API_URL` (the AKOD ECO app's URL).
3. Start AKOD ECO, then `npm run dev` — the store runs on http://localhost:3002.

Manage products in AKOD ECO → Products. Only active categories and products with
"Show on storefront" on are shown. Prices, photos, sizes (variants) and stock come from there.
