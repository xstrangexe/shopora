# SHOPORA storefront notes

What this fork changes on top of OpenStore DZ, and what to keep in mind when
editing it.

## Ordering: express form, no cart

- Every product page carries the order form (`express-order-form.tsx`): name,
  phone, wilaya, commune, home or office, optional address, quantity. No account,
  no email, no online payment.
- "أطلب الآن" buttons (under the price, the sticky phone bar, product cards)
  only scroll to the form or open the product page. Nothing creates a cart.
- The order is written by the existing `place_order()` RPC, which prices it from
  the catalogue, checks stock, validates the Algerian phone, applies the
  delivery fee and the per-phone limits. The browser total is a preview only.
- A ref blocks double submission; the button is disabled while saving. On
  failure the buyer stays on the form with a Darija message and can retry. On
  success they land on `/order/<token>?placed=1`.
- When a product has several phone models, none is pre-selected: the buyer must
  pick one before ordering (`variant-options.ts`).
- Address is optional, as on the old YouCan shop. When empty, commune + wilaya
  are sent, because the database requires at least 5 characters.
- The cart code and `/checkout` remain only so an old saved cart still works.
  They are not linked from the storefront.

## Pixel events (Meta / TikTok)

| Moment | Meta | TikTok |
|---|---|---|
| Any storefront page | PageView | page |
| Product page opened | ViewContent | ViewContent |
| First field touched in the order form | InitiateCheckout | InitiateCheckout |
| Order saved by the database | Purchase (eventID = order token) | CompletePayment (event_id = order token) |

"Purchase" means a cash-on-delivery order was placed, not delivered or paid.
No AddToCart is sent: there is no cart. No server-side (Conversions API)
events are sent yet; the event IDs are ready for deduplication if they are added.

## Settings

| Variable | Where | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` | Vercel + `.env` | Database (publishable key only) |
| `VITE_SITE_URL` | Vercel + `.env` | Canonical and share-preview links; set to the main address |
| `NITRO_PRESET=cloudflare_module` | only when building the Cloudflare backup | Build target |

No database migration is needed for these changes.

## SEO

- `/sitemap.xml` is generated per request from published products, categories
  and information pages; `robots.txt` points to it.
- Product pages set a title with the price, description, `og:image` (first
  photo), `og:url` and a canonical link to `VITE_SITE_URL`.
- Product URLs are unchanged (`/product/<slug>`), so existing ad links work.
