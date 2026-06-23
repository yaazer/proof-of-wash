# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server on :8080
npm run build      # production build
npm run lint       # ESLint
npm run type-check # tsc --noEmit (no test suite exists)
```

No test framework is configured. Use `npm run type-check` to validate types before committing.

## Architecture

**Proof of Wash** is a Next.js 16 App Router e-commerce site selling artisan laundry detergent. It accepts two payment methods: Square (card) and BTCPay Server (Bitcoin).

### Data layer

Products live entirely in [`src/data/products.ts`](src/data/products.ts) as a static array — there is no database. Prices are stored in **cents** (integers). `priceDisplay` is a pre-formatted string kept in sync manually. The `Product` and `ProductVariant` types are in [`src/types/index.ts`](src/types/index.ts).

### Cart

Cart state is managed by a Zustand store in [`src/lib/cart.ts`](src/lib/cart.ts), persisted to `localStorage` under the key `pow-cart`. Cart items are keyed by `productId::variantId` (or just `productId` if no variant). Shipping is free above $50; otherwise $7.99 flat.

### Checkout & payments

The checkout page ([`src/app/checkout/page.tsx`](src/app/checkout/page.tsx)) collects contact info and routes to one of two payment flows:

- **Square** — [`src/components/checkout/SquarePaymentForm.tsx`](src/components/checkout/SquarePaymentForm.tsx) loads the Square Web Payments SDK client-side and tokenizes the card. The token is sent to [`/api/square/create-payment`](src/app/api/square/create-payment/route.ts), which calls Square's Payments API server-side.
- **BTCPay** — [`src/components/checkout/BTCPayButton.tsx`](src/components/checkout/BTCPayButton.tsx) calls [`/api/btcpay/create-invoice`](src/app/api/btcpay/create-invoice/route.ts), which creates an invoice on a self-hosted BTCPay Server instance and redirects the user to the BTCPay checkout URL. Webhook confirmations arrive at [`/api/btcpay/webhook`](src/app/api/btcpay/webhook/route.ts).

### Environment variables

Copy `.env.example` → `.env.local`. Square uses sandbox credentials when `NODE_ENV !== 'production'`. BTCPay variables are all required at runtime; the API routes return 500 with a clear message if they're missing.

### Fonts & styling

Two Google Fonts: `Inter` (body, `--font-inter`) and `Playfair Display` (headings/accent, `--font-playfair`). Tailwind CSS with a custom config in [`tailwind.config.js`](tailwind.config.js).

### Admin panel

`/admin` is a password-protected control panel. Auth is a simple cookie (`pow-admin`) checked in `src/middleware.ts` against the `ADMIN_SECRET` env var. Login at `/admin/login`; logout via DELETE to `/api/admin/auth`.

Admin pages live in `src/app/admin/` (separate from the `(store)` route group, so they render without the storefront Header/Footer). Product CRUD API routes are under `src/app/api/admin/products/`.

Product data is stored in `src/data/products.json` and read/written via `src/lib/productsDb.ts` (Node.js `fs` — server-only). This means admin edits take effect immediately without a rebuild, but the setup **only works on a server with a writable filesystem** (not Vercel's edge/serverless by default).

### Path alias

`@/` maps to `src/` (configured in `tsconfig.json`).
