# HAYDER PERFUMES — Luxury Web Store

A complete mobile-first static web store. No backend or paid subscription is required for the shopping bag and WhatsApp ordering. The existing approved HAYDER final packaging is used in the hero and all product cards.

## Files

- `index.html` — page layout, navigation, hero, shop, reviews, story, footer, cart
- `styles.css` — luxury black / royal gold / white responsive design
- `app.js` — interactive search, shopping bag, quantities, automatic totals, WhatsApp checkout
- **`config.js` — prices, products, WhatsApp number, Instagram / TikTok, sample reviews**
- `assets/` — approved packaging images and crown favicon

## EDIT PRICES — important

Open `config.js`, locate each perfume entry, and change:

```javascript
price: 2499, oldPrice: 3499,
```

Each perfume can have a different price. The site automatically calculates the discount percentage, cart totals, and WhatsApp message amount. The 2499/3499 prices are **placeholders until you confirm the real price**.

## EDIT WHATSAPP NUMBER

In `config.js`, replace `whatsapp: '923373764975'` with the HAYDER business WhatsApp number (country code included, no `+` or spaces). The current number was found on the earlier HAYDER store and should be confirmed before launch.

## REVIEWS AND LONGEVITY — before real orders

Customer names, cities, written testimonials, images and 5.0 / 120+ review numbers are preview-only examples and **must not be presented as verified**. The site labels them as `DEMO` / `SAMPLE` until you provide genuine reviews. To add authentic reviews and customer-approved photos, update `reviews` and `reviewCount` in `config.js` and set `reviewsAreVerified: true` and `showVerifiedRatings: true` only when substantiated.

Delivery and longevity statements provided in the design brief should be verified with actual delivery service and fragrance testing. The site marks delivery as estimated, and longevity as variable.

Instagram and TikTok are not linked yet. Add your real accounts as full `https://...` URLs in `config.js`.

## DEPLOY TO RENDER (EXISTING STATIC SITE)

1. Extract the ZIP. Keep `index.html`, `styles.css`, `app.js`, `config.js` and `assets/` together in the root of your GitHub repository.
2. Commit / upload these files to the branch connected to the Render site (typically `main`).
3. In Render Static Site settings, set **Build Command** to `echo Ready` and **Publish Directory** to `.` (root). If the site already uses a root static publish path, leave it as is.
4. Trigger deploy if auto-deploy is disabled. Otherwise the GitHub commit triggers deployment automatically.
5. Refresh the website after the deploy is Live. Check the mobile menu, search, cart, image assets and WhatsApp link.

### Test locally

In this folder run `python -m http.server 8000` and open `http://localhost:8000`. The site uses no framework or install process.

### Checkout limitations

The site creates a WhatsApp order inquiry, **not a paid checkout**. No payment, customer database, delivery tracking, or online card transaction is processed by the static website. Payment methods in the footer are listed as options to be confirmed with the seller.
