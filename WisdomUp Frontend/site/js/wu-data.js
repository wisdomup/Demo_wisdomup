// Shared WisdomUp storefront data. Products come from js/catalog.js (generated from the supplier quote
// sheets by tools/build_catalog.py); this file adds prices as text and the site's own content.
window.WU_STORE = (function () {
  const C = window.WU_CATALOG;
  const rs = n => n == null ? null : 'Rs.' + n.toLocaleString('en-PK');
  const products = C.products;
  // Sale (shop.js "sale", 2026-10-06): the regular catalogue price becomes `was` and the sale price becomes `price` — the
  // number every page, filter, cart and the order server (api/orders.py, same rules + rounding) use. Off = no change.
  const SALE = (window.WU_SHOP && window.WU_SHOP.sale) || {};
  const salePct = p => { if (!SALE.on) return 0; for (const r of SALE.rules || []) if ((r.types && r.types.includes(p.type)) || (r.ids && r.ids.includes(p.id)) || (r.tab && p.tabs.includes(r.tab))) return r.pct || 0; return 0; };
  const salePrice = (price, pct) => { if (!pct || !price) return price; const step = price < 1000 ? 10 : 50; const s = Math.ceil(price * (100 - pct) / (100 * step)) * step; return s < price ? s : price; };
  const deal = (o, pct) => { const was = o.price; o.price = salePrice(was, pct); o.was = o.price < was ? was : null; o.wasText = o.was ? rs(o.was) : null; o.off = o.was ? Math.round((o.was - o.price) / o.was * 100) : null; };
  products.forEach(p => {
    const pct = salePct(p);
    p.variants.forEach(v => { deal(v, pct); v.priceText = rs(v.price); });
    deal(p, pct);
    p.priceText = rs(p.price); // no "From" anywhere (2026-10-06, user: remove the word on every product card); products with options show their lowest price
    p.rating = null;
  });
  const byId = id => products.find(p => p.id === id);
  // Hero slides: flagship products with studio photos (copy pulls live price/specs from the catalogue)
  const HERO = [
    ['ts-11anc', 'New · Noise-cancelling earbuds', 'Silence, on demand.'],
    ['yx-28', 'Party speaker · RGB light show', 'Bring the venue home.'],
    ['os-6', 'New · Open-ear earbuds', 'Hear the city. Keep the music.'],
    ['cdb-18', 'Magnetic wireless power bank', 'Snap on. Power up.'],
    ['txd-01', 'New · Personal care', 'A closer, cleaner shave.'],
  ].map(([pid, kicker, line]) => ({ pid, p: byId(pid), kicker, line })).filter(h => h.p)
    .map(h => ({ slotId: 'hero-' + h.pid, pid: h.pid, kicker: h.kicker, name: h.p.code, line: h.line, sub: h.p.meta, ctaLabel: 'Shop now · ' + h.p.priceText, src: h.p.src, bg: h.p.bg, pack: true, hint: h.p.title }));
  return {
    rs,
    products,
    byId,
    depts: C.departments,
    types: C.types,
    typeLabel: t => (C.types[t] || {}).label || t,
    utility: [{ label: 'Live Shopping', tone: 'gold' }, { label: 'Bulk Order' }, { label: 'Corporate Order' }, { label: 'Express Delivery' }, { label: 'Order Tracker' }, { label: 'Help Center' }],
    trust: [{ icon: 'truck', label: 'Fast, free shipping\nover {FREE_FROM}' }, { icon: 'smile', label: '7-day money-back\nguarantee' }, { icon: 'medal', label: 'Hassle-free\nwarranty' }, { icon: 'shield', label: 'Lifetime customer\nsupport' }],
    faqs: [
      ['What is your return policy?', 'We offer a 7-day return policy from the date of delivery.\nProducts must be in original condition and packaging.\nTo start a return, contact support with your order details.'],
      ['How long does shipping take?', 'Standard shipping takes 3–5 working days within Pakistan.\nExpress delivery arrives in 1–2 working days.\nOrders above {FREE_FROM} ship free.'],
      ['Do your products come with a warranty?', 'Every WisdomUp product has at least a 6-month warranty.\nPremium products carry up to 2 years.\nWarranty covers manufacturing defects and hardware failures.'],
      ['Are your earbuds compatible with iOS and Android?', 'Yes — all Bluetooth earbuds and headphones pair with iOS, Android, Windows, macOS and other Bluetooth devices.'],
      ['What payment methods do you accept?', 'Cash on Delivery, JazzCash, EasyPaisa and bank transfer. For JazzCash, EasyPaisa and bank transfer, send the total to our account and share the receipt on WhatsApp.'],
    ],
    footer: [
      { title: 'Products', links: ['All Items', 'Audio', 'Charging', 'Cables & Adapters', 'Car Accessories', 'Computer', 'Personal Care'] },
      { title: 'Explore', links: ['Bulk Order', 'Corporate Order', 'Content Creators Program', 'Live Shopping', 'About Us', 'Where to Buy', 'Blog'] },
      { title: 'Support', links: ['Smart Help Center', 'Order Tracker', 'Exchange & Refund Policy', 'Warranty Policy', 'Shipping Policy', 'Download e-Manual'] },
    ],
    contact: { phone: '+92 327 9800153', email: 'support@wisdomup.pk', hours: 'Mon–Sun, 10 AM – 6 PM' },
    lifestyle: HERO,
    media: ['radial-gradient(80% 90% at 50% 40%,#e0523a,#8c1c10)', 'radial-gradient(80% 90% at 50% 40%,#5372c9,#101d4a)', 'radial-gradient(80% 90% at 50% 40%,#3f8f86,#0d2a27)', 'radial-gradient(80% 90% at 50% 40%,#6b5a48,#1d1712)'],
  };
})();
