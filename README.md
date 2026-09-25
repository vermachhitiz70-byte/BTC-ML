# BTC ML AI — Next.js storefront

Pixel-perfect migration of the BTCMLAI.com storefront to Next.js (App Router).

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build
npm start -- -p 3000
```

## Structure

- `app/` — 12 routes (`/`, `/shop`, `/premium`, `/blog`, `/gallery`,
  `/about`, `/contact`, `/faqs`, `/privacy-policy`, `/refund-policy`,
  `/terms-condition`, `/shipping-policy`)
- `public/assets/` — CSS, JS, images, fonts (unchanged legacy theme)
- `app/api/products/route.js` — catalogue API (Turso, seed fallback)
- `lib/turso.js` — Turso client (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`)
- `lib/seed.js` — fallback catalogue used when Turso is not configured
- `schema.sql` — Turso tables (`products`, `blog_posts`, `messages`, `orders`)

## Go live (GitHub + Turso + Vercel)

1. **Turso** — https://turso.tech → create database `btcmlai` →
   run `schema.sql` → create auth token. Copy URL + token.
2. **Seed products**:
   ```sql
   INSERT INTO products (slug,name,new_price,old_price,image,sort_order)
   VALUES ('buystop-sellstop-20','BUYSTOP SELLSTOP 2.0',2999,5999,
     '/assets/images/products/product-6a9bc06c1f6b3.png',1);
   ```
   (repeat per product, or ask dev to bulk-seed from `lib/seed.js`)
3. **GitHub** — create empty repo `btcmlai`, then:
   ```bash
   git remote add origin https://github.com/<you>/btcmlai.git
   git push -u origin main
   ```
4. **Vercel** — vercel.com → Add New Project → import the repo →
   set env vars `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` → Deploy.
   Then add custom domain `btcmlai.com` (Vercel gives DNS records).

## Roadmap

- Phase 1: Turso-driven catalogue/blog rendering (replace static cards)
- Phase 2: Auth + cart + checkout + contact form → `messages`/`orders`
- Phase 3: `/admin` panel (products, orders, content)
