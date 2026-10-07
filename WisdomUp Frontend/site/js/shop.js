// WisdomUp shop settings — read by the website (cart, checkout) AND by the order server (api/orders.py),
// so prices, fees and payment options can never disagree. Keep this file valid JSON after the "=".
// siteUrl = the live address (used for canonical links, the sitemap and social previews; re-run tools/build_seo.py after
// changing it). facebookPixelId = your Meta Pixel ID (digits only); leave "" to keep the pixel switched off.
// social = full https:// links to your pages (footer icons after WhatsApp); an icon stays visible but unlinked until its link is filled.
window.WU_SHOP = {
  "currency": "PKR",
  "siteUrl": "https://wisdomup.pk/",
  "facebookPixelId": "",
  "freeDeliveryFrom": 20000,
  "delivery": {
    "standard": { "label": "Standard delivery", "eta": "3–5 working days", "fee": 250, "freeOver": true },
    "express": { "label": "Express delivery", "eta": "1–2 working days", "fee": 450, "freeOver": false }
  },
  "sale": {
    "on": true,
    "demo": true,
    "note": "DEMO sale (2026-10-06): the struck price is the regular catalogue price; the sale price is what the cart, checkout and order server charge. Rules: first match wins (types = product type ids, ids = product ids, tab = new/best). Sale prices round UP to Rs.10 under Rs.1,000 and Rs.50 above. Set on to false to end the sale.",
    "rules": [
      { "types": ["headphones"], "pct": 20 },
      { "types": ["earbuds", "neckbands", "power-banks"], "pct": 15 },
      { "types": ["speakers", "charging-cables", "wall-chargers"], "pct": 10 }
    ]
  },
  "creators": {
    "on": true,
    "demo": true,
    "note": "DEMO creator (affiliate) program (2026-10-08) — confirm the numbers before launch. A creator's link (?ref=CODE on any page) or code typed at checkout gives the buyer discountPct off the items (after the sale; delivery and gift wrap excluded). The creator earns the tier's pct of that discounted item value on every DELIVERED order once returnDays have passed since delivery; the tier is set by the creator's sales (all orders not cancelled) in the calendar month the order was placed and applies to every order of that month. A link counts for linkDays (the last creator link clicked wins). Payouts monthly once the balance reaches minPayout. autoApprove true = new creators get a working code at once (admin can pause anyone); false = codes start as pending until approved in admin.",
    "discountPct": 5,
    "linkDays": 30,
    "returnDays": 7,
    "minPayout": 1000,
    "autoApprove": true,
    "demoMode": true,
    "demoNote": "demoMode true = while the shop's database is not connected (the demo site: /api/orders answers 503), the program runs in each visitor's own browser — sign-up, codes, the cart discount and the dashboard, with demo tools that simulate visits, orders, delivery and payouts. It is never used once the database answers. Set false for the live shop.",
    "tiers": [
      { "name": "Starter", "from": 0, "pct": 8 },
      { "name": "Pro", "from": 50000, "pct": 10 },
      { "name": "Elite", "from": 150000, "pct": 12 }
    ],
    "platforms": ["Instagram", "TikTok", "YouTube", "Facebook", "Other"],
    "audiences": ["Under 10K", "10K–50K", "50K–250K", "250K+"],
    "payouts": ["jazzcash", "easypaisa", "bank"]
  },
  "giftWrap": 490,
  "maxQty": 10,
  "payments": {
    "cod": { "label": "Cash on Delivery", "note": "Pay the rider in cash when your order arrives." },
    "jazzcash": { "label": "JazzCash", "note": "Send the total to our JazzCash account, then share the receipt on WhatsApp.", "accountTitle": "", "accountNumber": "" },
    "easypaisa": { "label": "EasyPaisa", "note": "Send the total to our EasyPaisa account, then share the receipt on WhatsApp.", "accountTitle": "", "accountNumber": "" },
    "bank": { "label": "Bank transfer", "note": "Transfer the total to our bank account, then share the receipt on WhatsApp.", "bank": "", "accountTitle": "", "iban": "" }
  },
  "whatsapp": "923279800153",
  "social": { "instagram": "", "youtube": "", "facebook": "", "x": "" },
  "statuses": ["new", "confirmed", "paid", "shipped", "delivered", "cancelled"]
};
