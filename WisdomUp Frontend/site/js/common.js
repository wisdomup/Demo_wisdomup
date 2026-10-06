// WisdomUp — shared site chrome and components (used by every page).
// Exposes window.WU: routes, cart, utility bar, nav, search, product card, rails, hero, accordions, trust, footer.
(function () {
  const D = window.WU_STORE;
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vw = () => window.innerWidth;
  const code = p => p.code || p.title.split(' ')[0];
  const EASE = 'cubic-bezier(.2,.7,.2,1)';

  /* ---------- Routes ---------- */
  // Product types (e.g. 'earbuds') grouped into departments (e.g. 'audio') — both come from the catalogue.
  const DEPTS = D.depts;
  const CATS = DEPTS.flatMap(d => d.types).filter((t, i, a) => a.indexOf(t) === i && D.products.some(p => p.type === t));
  const typeLabel = D.typeLabel;
  const slug = c => 'cat-' + c;
  const url = {
    home: 'index.html',
    live: 'live.html',
    products: 'products.html',
    cat: c => 'products.html?cat=' + c, // a real address per category, so Google can index each one (old #cat-… links still work)
    dept: d => 'products.html?dept=' + d,
    filter: f => 'products.html?filter=' + f,
    product: id => 'product.html?id=' + encodeURIComponent(id),
    bulk: 'bulk-order.html',
    corporate: 'corporate.html',
    creators: 'creators.html',
    about: 'about.html',
    where: 'where-to-buy.html',
    blog: 'blog.html',
    article: slug => 'article.html?p=' + slug, // a real address per post (old #slug links still work)
    help: 'help.html',
    track: 'track.html',
    returns: 'returns.html',
    warranty: 'warranty.html',
    shipping: 'shipping.html',
    express: 'shipping.html#express',
    manuals: 'manuals.html',
    wishlist: 'wishlist.html',
  };
  const catHref = t => CATS.includes(t) ? url.cat(t) : DEPTS.some(d => d.id === t) ? url.dept(t) : url.products;
  const LINKS = {
    'All Items': url.products, Audio: url.dept('audio'), Charging: url.dept('charging'), 'Cables & Adapters': url.dept('cables'),
    'Car Accessories': url.dept('car'), Computer: url.dept('computer'), 'Personal Care': url.dept('care'),
    'Bulk Order': url.bulk, 'Corporate Order': url.corporate, 'Content Creators Program': url.creators, 'Live Shopping': url.live,
    'About Us': url.about, 'Where to Buy': url.where, Blog: url.blog,
    'Smart Help Center': url.help, 'Help Center': url.help, 'Order Tracker': url.track, 'Express Delivery': url.express,
    'Exchange & Refund Policy': url.returns, 'Warranty Policy': url.warranty, 'Shipping Policy': url.shipping, 'Download e-Manual': url.manuals,
  };
  const linkFor = label => LINKS[label] || url.help; // every footer/utility label has a page; unknown labels fall back to Help
  // Marks the footer/utility link for the page you're on (aria-current) so people can see where they are.
  const here = () => location.pathname.split('/').pop() || 'index.html';
  const isHere = href => href.split('#')[0].split('?')[0] === here() && !href.includes('#');

  /* ---------- Shared icon paths ---------- */
  // Desktop nav icons: product types (or a whole department for Car / Computer / Grooming / Storage)
  const NAV_CATS = [
    { label: 'Earbuds', type: 'earbuds', d: 'M7.6 2.6a1.9 1.9 0 1 1 0 3.8a1.9 1.9 0 1 1 0-3.8zM7 5.5h1.3v4.3H7zM16.4 2.6a1.9 1.9 0 1 1 0 3.8a1.9 1.9 0 1 1 0-3.8zM15.7 5.5H17v4.3h-1.3zM3.5 11h17v4.5a6 6 0 0 1-6 6h-5a6 6 0 0 1-6-6zM11 15.6a1 1 0 1 0 2 0a1 1 0 1 0-2 0z', s: '', w: 2.2 },
    { label: 'Headphones', type: 'headphones', d: 'M5 13h2a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 7 21H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zM5.1 15.1h1.4v3.8H5.1zM17 13h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 17 13zM17.5 15.1h1.4v3.8h-1.4z', s: 'M4 15v-3a8 8 0 0 1 16 0v3', w: 2.4 },
    { label: 'Speakers', type: 'speakers', d: 'M8 2.5h8a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zM9.4 8a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0-5.2 0zM10.9 8a1.1 1.1 0 1 0 2.2 0a1.1 1.1 0 1 0-2.2 0zM9 15.5a3 3 0 1 0 6 0a3 3 0 1 0-6 0zM10.8 15.5a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0z', s: 'M3.6 8.6L2.2 7.8M3.6 12H2M3.6 15.4l-1.4.8M20.4 8.6l1.4-.8M20.4 12H22M20.4 15.4l1.4.8', w: 1.4 },
    { label: 'Neckbands', type: 'neckbands', d: 'M8 2.7a1.9 1.9 0 1 1 0 3.8a1.9 1.9 0 1 1 0-3.8zM7.3 6h1.4l.4 3.2H7.5zM16 2.7a1.9 1.9 0 1 1 0 3.8a1.9 1.9 0 1 1 0-3.8zM15.3 6h1.4l-.2 3.2h-1.6zM2.2 13.2Q5 17.2 10.6 19.7Q16.6 21.6 20.3 15.6A1.3 1.3 0 0 0 18.1 14.4Q15.8 18.4 11.4 17.3Q7 15 4.2 11.8A1.3 1.3 0 0 0 2.2 13.2Z', s: 'M8.3 9.2c.3 2.6.1 4-.9 5.6M15.7 9.2c.4 3 .5 5.6.3 8.4', w: 1.1 },
    { label: 'Handsfree', type: 'handsfree', d: 'M8 5.8a2.4 2.4 0 1 1 0 4.8a2.4 2.4 0 1 1 0-4.8zM16 3.4a2.4 2.4 0 1 1 0 4.8a2.4 2.4 0 1 1 0-4.8z', s: 'M8 10.6V22M16 8.2V22', w: 1.6 },
    { label: 'Chargers', type: 'wall-chargers', d: 'M7 9h10a1.5 1.5 0 0 1 1.5 1.5V20a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9.5A1.5 1.5 0 0 1 7 9zM12.8 12l-2.6 4h2l-1 3.2l2.6-4h-2zM9 2.5h1.4V9H9zM13.6 2.5H15V9h-1.4z', s: '', w: 2.2 },
    { label: 'Power Banks', type: 'power-banks', d: 'M8 2h8a2.5 2.5 0 0 1 2.5 2.5v15A2.5 2.5 0 0 1 16 22H8a2.5 2.5 0 0 1-2.5-2.5v-15A2.5 2.5 0 0 1 8 2zM13 5.5l-3.3 5h2.6l-1.3 4l3.3-5h-2.6zM8.5 17.6h7v1.4h-7z', s: '', w: 2.2 },
    { label: 'Cables', type: 'charging-cables', d: 'M15 4h4.5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H15zM20.5 4.8h2v1.4h-2zM4.5 17H9v3H4.5a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1zM1.5 17.8h2v1.4h-2z', s: 'M15 5.5H7a3.2 3.2 0 0 0 0 6.4h10a3.2 3.2 0 0 1 0 6.4H9', w: 2 },
    { label: 'Car', type: 'car', d: 'M9 3.5h6a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H9A1.5 1.5 0 0 1 7.5 15V5A1.5 1.5 0 0 1 9 3.5zM9 5v10h6V5z', s: 'M5 7.5v5M19 7.5v5M12 16.5V21M8.5 21h7', w: 2 },
    { label: 'Microphones', type: 'microphones', d: 'M12 2a3.2 3.2 0 0 1 3.2 3.2v6.1a3.2 3.2 0 0 1-6.4 0V5.2A3.2 3.2 0 0 1 12 2z', s: 'M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v4M8.5 21.5h7', w: 2 },
    { label: 'Computer', type: 'computer', d: 'M3 7h18a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 21 18H3a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 3 7zM3 8.5v8h18v-8z', s: 'M5.5 11h1M9 11h1M12.5 11h1M16 11h2.5M7 14.5h10', w: 1.8 },
    { label: 'Grooming', type: 'care', d: 'M8 2.5h8a1 1 0 0 1 1 1v3H7v-3a1 1 0 0 1 1-1zM7.6 8h8.8l-.9 12a1.6 1.6 0 0 1-1.6 1.5h-3.8a1.6 1.6 0 0 1-1.6-1.5zM11.2 11h1.6v3.6h-1.6z', s: '', w: 2 },
    { label: 'Storage', type: 'storage', d: 'M8 2.5h7.5l3.5 3.5v14a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5zM9.2 5.2v3.2h1.3V5.2zM11.6 5.2v3.2h1.3V5.2zM14 5.2v3.2h1.3V5.2z', s: '', w: 2 },
  ];

  const navSvg = (d, s, w, size) => `<svg viewBox="0 0 24 24" aria-hidden="true" style="width: ${size}px; height: ${size}px;"><path d="${d}" fill="#fff" fill-rule="evenodd"></path><path d="${s}" fill="none" stroke="#fff" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
  const P_GRID = 'M5.5 3.5h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zM15.5 3.5h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zM5.5 13.5h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zM15.5 13.5h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z';
  const P_SEARCH = 'M11 4.5a6.5 6.5 0 1 1 0 13a6.5 6.5 0 1 1 0-13zM16 16l4.5 4.5';
  const P_USER = 'M12 2.5a4.3 4.3 0 1 1 0 8.6a4.3 4.3 0 1 1 0-8.6zM3.5 21.5a8.5 8.5 0 0 1 17 0z';
  const P_BAG = 'M5.2 8h13.6a1 1 0 0 1 1 1.1l-1 11a1.6 1.6 0 0 1-1.6 1.4H6.8a1.6 1.6 0 0 1-1.6-1.4l-1-11A1 1 0 0 1 5.2 8z';
  const P_HANDLE = 'M8.8 8V6.5a3.2 3.2 0 0 1 6.4 0V8';
  const P_HEART = 'M12 20.2l-1.3-1.2C6.1 14.9 3.2 12.3 3.2 9a4.6 4.6 0 0 1 4.7-4.7c1.6 0 3.1.7 4.1 1.9a5.4 5.4 0 0 1 4.1-1.9A4.6 4.6 0 0 1 20.8 9c0 3.3-2.9 5.9-7.5 10z';
  const STAR_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" fill="#E2A92C"></path></svg>';
  // no reviews yet: an outline star and 0.0 (decided 2026-10-06) — honest, never a made-up score
  const STAR_OUTLINE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" fill="none" stroke="#E2A92C" stroke-width="1.8" stroke-linejoin="round"></path></svg>';
  const btnBuy = (label, href) => href
    ? `<a class="btn-buy" href="${href}">${icon('cart', 30)}${esc(label)}</a>`
    : `<button type="button" class="btn-buy">${icon('cart', 30)}${esc(label)}</button>`;

  /* ---------- Cart (count persists across pages) + toast ---------- */
  const store = {
    get: (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
  };
  let toastT;
  function toast(msg, svg) {
    const t = $('toast');
    if (!t) return;
    t.innerHTML = (svg || icon('bag', 18)) + '<span>' + esc(msg) + '</span>';
    t.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(() => { t.hidden = true; }, 2400);
  }
  /* ---------- Cart: line items (sku + qty) kept on this device. Prices always come from the catalogue,
     and the order server recomputes them again, so a stale or edited cart can never change what is charged. ---------- */
  // Shop-by-budget bands (changed 2026-10-06): NON-overlapping — u1 = Rs.1–1,000, u2 = Rs.1,001–2,000, u5 = Rs.2,001–5,000.
  // The site keeps the "Under Rs.…" labels; the listing (?price=u1/u2/u5), the day rail tabs and the night segment all read these.
  const BUDGET = { u1: p => p.price >= 1 && p.price <= 1000, u2: p => p.price > 1000 && p.price <= 2000, u5: p => p.price > 2000 && p.price <= 5000 };
  const SHOP = window.WU_SHOP || { freeDeliveryFrom: 20000, maxQty: 10, giftWrap: 490, delivery: { standard: { fee: 250, freeOver: true } } };
  // Copy that quotes the free-delivery threshold ({FREE_FROM} in wu-data.js) always follows shop.js
  const FREE_FROM = D.rs(SHOP.freeDeliveryFrom);
  const fillFree = t => typeof t === 'string' ? t.replace(/\{FREE_FROM\}/g, FREE_FROM) : t;
  (D.trust || []).forEach(t => { t.label = fillFree(t.label); });
  if (Array.isArray(D.faqs)) D.faqs = D.faqs.map(f => Array.isArray(f) ? f.map(fillFree) : f);
  /* ---------- SEO: one place sets the tab title, description, canonical link, social preview and structured data.
     Static pages get these tags in their HTML from tools/build_seo.py; pages built from the catalogue (a category,
     a product, a blog post) call WU.seo() to describe themselves. Addresses always use the live domain (SHOP.siteUrl),
     so the demo and local copies point search engines at the real site. ---------- */
  const SITE = String(SHOP.siteUrl || location.origin + '/').replace(/\/?$/, '/');
  const abs = path => new URL(path || '', SITE).href;
  const YEAR = new Date().getFullYear();
  const clip = (t, n) => { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length <= n ? t : t.slice(0, t.lastIndexOf(' ', n - 1)).replace(/[\s,;:—–-]+$/, '') + '…'; };
  function seo({ title, description, path, image, type = 'website', noindex = false, ld, extra = {} } = {}) {
    const head = document.head;
    const tag = (sel, make, attr, val) => { let el = head.querySelector(sel); if (!el) { el = make(); head.append(el); } el.setAttribute(attr, val); };
    const meta = (key, val, prop) => tag(`meta[${prop ? 'property' : 'name'}="${key}"]`, () => { const m = document.createElement('meta'); m.setAttribute(prop ? 'property' : 'name', key); return m; }, 'content', val);
    if (title) document.title = title;
    if (description) meta('description', clip(description, 160));
    meta('robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    if (path !== undefined) {
      tag('link[rel="canonical"]', () => { const l = document.createElement('link'); l.rel = 'canonical'; return l; }, 'href', abs(path));
      meta('og:url', abs(path), true);
    }
    meta('og:type', type, true);
    meta('og:site_name', 'WisdomUp', true);
    meta('og:locale', 'en_PK', true);
    if (title) { meta('og:title', title.replace(/\s*\|\s*WisdomUp.*$/, ''), true); meta('twitter:title', title.replace(/\s*\|\s*WisdomUp.*$/, '')); }
    if (description) { meta('og:description', clip(description, 200), true); meta('twitter:description', clip(description, 200)); }
    const img = abs(image || 'img/og-default.jpg');
    meta('og:image', img, true);
    meta('twitter:image', img);
    meta('twitter:card', 'summary_large_image');
    Object.entries(extra).forEach(([k, v]) => meta(k, String(v), true));
    if (ld) {
      head.querySelectorAll('script[data-seo-ld]').forEach(n => n.remove());
      [].concat(ld).filter(Boolean).forEach(o => { const sc = document.createElement('script'); sc.type = 'application/ld+json'; sc.dataset.seoLd = ''; sc.textContent = JSON.stringify(o); head.append(sc); });
    }
  }
  // Structured-data helpers (schema.org)
  const ldCrumbs = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })) });
  const ldFaq = items => items && items.length ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: String(a).replace(/\n/g, ' ') } })) } : null;

  /* ---------- Meta (Facebook) Pixel. Off until SHOP.facebookPixelId holds your Pixel ID (digits only, in shop.js).
     Sends the standard shop events: PageView, ViewContent, Search, AddToCart, AddToWishlist, InitiateCheckout,
     Purchase and Lead — with product ids (sku), value and currency, so ads and catalogue matching work. ---------- */
  const PIXEL_ID = /^\d{8,20}$/.test(String(SHOP.facebookPixelId || '').trim()) ? String(SHOP.facebookPixelId).trim() : '';
  // Cookie choices (2026-10-06): the Pixel is the site's only non-essential item, so it loads ONLY after the visitor allows
  // marketing cookies in the cookie popup (localStorage wu-consent = { v: 1, marketing, at }).
  const CONSENT_KEY = 'wu-consent';
  const consentGet = () => { try { const c = JSON.parse(localStorage.getItem(CONSENT_KEY)); return c && c.v === 1 ? c : null; } catch (e) { return null; } };
  const marketingOK = () => !!(consentGet() || {}).marketing;
  function loadPixel() {
    if (!PIXEL_ID || !marketingOK()) return;
    if (window.fbq) { window.fbq('consent', 'grant'); return; }
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }
  loadPixel();
  const px = (event, data, opts) => { if (PIXEL_ID && window.fbq && marketingOK()) window.fbq('track', event, data || {}, opts); };
  const pxItem = (p, sku, qty = 1) => { const v = (skuIndex[sku] || {}).v || {}; const price = v.price || p.price; return { content_ids: [sku || p.code], content_name: p.title, content_category: p.cat, content_type: 'product', contents: [{ id: sku || p.code, quantity: qty, item_price: price }], value: price * qty, currency: 'PKR' }; };
  const skuIndex = {};
  D.products.forEach(p => (p.variants.length ? p.variants : [{ sku: p.code, attrs: {}, price: p.price, thumb: p.thumb, bg: p.bg, ar: p.ar }])
    .forEach(v => { skuIndex[v.sku] = { p, v }; }));
  const defaultSku = p => (p.variants.length ? p.variants[0].sku : p.code);
  let cart = store.get('wu-cart', []).filter(l => skuIndex[l.sku] && l.qty > 0);
  let giftWrap = !!store.get('wu-gift', false);
  const cartCount = () => cart.reduce((n, l) => n + l.qty, 0);
  const cartLines = () => cart.map(l => {
    const { p, v } = skuIndex[l.sku];
    return { sku: l.sku, qty: l.qty, p, v, attrs: v.attrs || {}, price: v.price, total: v.price * l.qty };
  });
  // Totals for a delivery option; free standard delivery from SHOP.freeDeliveryFrom
  function cartTotals(delivery = 'standard') {
    const subtotal = cartLines().reduce((n, l) => n + l.total, 0);
    const opt = (SHOP.delivery || {})[delivery] || { fee: 0, freeOver: true };
    const fee = !cart.length ? 0 : opt.freeOver && subtotal >= SHOP.freeDeliveryFrom ? 0 : opt.fee;
    const gift = giftWrap && cart.length ? SHOP.giftWrap : 0;
    return { subtotal, delivery: fee, giftWrap: gift, total: subtotal + fee + gift };
  }
  function saveCart() {
    store.set('wu-cart', cart);
    store.set('wu-gift', giftWrap);
    paintBadge();
    window.dispatchEvent(new CustomEvent('wu-cart'));
  }
  function add(id, n = 1, sku, opts = {}) {
    const p = D.byId(id);
    if (!p || p.soldOut) return;
    sku = skuIndex[sku] ? sku : defaultSku(p);
    const line = cart.find(l => l.sku === sku);
    if (line) line.qty = Math.min(SHOP.maxQty, line.qty + n);
    else cart.push({ sku, qty: Math.min(SHOP.maxQty, n) });
    saveCart();
    px('AddToCart', pxItem(p, sku, n));
    const attrs = Object.values(skuIndex[sku].v.attrs || {});
    toast(`${n > 1 ? n + ' × ' : ''}${p.code}${attrs.length ? ' (' + attrs.join(', ') + ')' : ''} added to cart`);
    if (opts.open && cartUI) cartUI.open();
  }
  const setQty = (sku, q) => {
    const line = cart.find(l => l.sku === sku);
    if (!line) return;
    line.qty = Math.max(0, Math.min(SHOP.maxQty, q));
    cart = cart.filter(l => l.qty > 0);
    saveCart();
  };
  const setGift = on => { giftWrap = !!on; saveCart(); };
  const clearCart = () => { cart = []; giftWrap = false; saveCart(); };
  let cartUI = null;

  /* ---------- Reviews: written by shoppers, stored on this device until a shared review database is connected.
     No invented ratings anywhere: stars only appear when a product has real reviews. ---------- */
  const REV_KEY = 'wu-reviews', HELP_KEY = 'wu-helpful';
  const revAll = () => store.get(REV_KEY, {}) || {};
  const reviews = {
    list: pid => (revAll()[pid] || []).slice(),
    summary(pid) {
      const l = reviews.list(pid), dist = [0, 0, 0, 0, 0];
      l.forEach(r => { dist[5 - r.rating] += 1; });
      return { count: l.length, avg: l.length ? l.reduce((n, r) => n + r.rating, 0) / l.length : 0, dist };
    },
    // Verified buyer: this product is in an order placed from this device
    verified: pid => (store.get('wu-orders', []) || []).some(o => (o.items || []).some(i => i.id === pid)),
    add(pid, r) {
      const all = revAll();
      const rev = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), rating: Math.max(1, Math.min(5, r.rating | 0)), title: r.title, text: r.text, name: r.name, city: r.city, sku: r.sku, verified: reviews.verified(pid), helpful: 0, createdAt: new Date().toISOString() };
      all[pid] = [rev].concat(all[pid] || []);
      store.set(REV_KEY, all);
      window.dispatchEvent(new CustomEvent('wu-reviews', { detail: { pid } }));
      return rev;
    },
    helpful(pid, id) {
      const done = store.get(HELP_KEY, []);
      if (done.includes(id)) return false;
      const all = revAll(), r = (all[pid] || []).find(x => x.id === id);
      if (!r) return false;
      r.helpful += 1;
      store.set(REV_KEY, all);
      store.set(HELP_KEY, done.concat(id));
      return true;
    },
  };
  const starsSvg = (val, size = 16) => [1, 2, 3, 4, 5].map(i => {
    const fill = Math.max(0, Math.min(1, val - i + 1));
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"><defs><linearGradient id="sg${i}-${Math.round(fill * 100)}"><stop offset="${fill * 100}%" stop-color="#E2A92C"/><stop offset="${fill * 100}%" stop-color="#D9DCE1"/></linearGradient></defs><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" fill="url(#sg${i}-${Math.round(fill * 100)})"/></svg>`;
  }).join('');

  /* ---------- Wishlist (saved product ids persist across pages; every [data-wish] heart stays in sync) ---------- */
  const heartSvg = (size, filled) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"><path d="${P_HEART}" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;
  let wish = store.get('wu-wish', []).filter(id => D.byId(id));
  const wished = id => wish.includes(id);
  const wishBtn = (p, cls) => `<button type="button" class="${cls}" data-wish="${p.id}" aria-pressed="${wished(p.id)}" aria-label="Save ${esc(p.title)} to wishlist">${heartSvg(20)}</button>`;
  function paintWish() {
    document.querySelectorAll('[data-wish]').forEach(b => {
      const on = wished(b.dataset.wish), p = D.byId(b.dataset.wish);
      b.setAttribute('aria-pressed', on);
      if (p) b.setAttribute('aria-label', (on ? 'Remove ' + p.title + ' from' : 'Save ' + p.title + ' to') + ' wishlist');
    });
    document.querySelectorAll('.site-nav__wbadge').forEach(b => { b.hidden = !wish.length; b.textContent = wish.length; });
  }
  function toggleWish(id) {
    const p = D.byId(id);
    if (!p) return;
    const on = !wished(id);
    wish = on ? wish.concat(id) : wish.filter(x => x !== id);
    store.set('wu-wish', wish);
    if (on) px('AddToWishlist', pxItem(p, defaultSku(p)));
    paintWish();
    toast(on ? 'Saved to your wishlist' : 'Removed from your wishlist', heartSvg(18, on));
    window.dispatchEvent(new CustomEvent('wu-wish', { detail: { id, on } }));
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-wish]');
    if (!b) return;
    e.preventDefault();
    toggleWish(b.dataset.wish);
  });
  // Another tab changed the list
  window.addEventListener('storage', e => { if (e.key === 'wu-wish') { wish = store.get('wu-wish', []).filter(id => D.byId(id)); paintWish(); window.dispatchEvent(new CustomEvent('wu-wish', { detail: {} })); } });

  /* ---------- Utility bar ---------- */
  function renderUtility() {
    const el = $('utility');
    if (!el) return;
    el.innerHTML = D.utility.map(l => { const h = linkFor(l.label); return `<a href="${h}"${l.tone ? ` class="${l.tone}"` : ''}${isHere(h) ? ' aria-current="page"' : ''}>${esc(l.label)}</a>`; }).join('');
  }

  /* ---------- Site nav ---------- */
  const nav = $('site-nav');
  // Slim nav (Ronin-style proportions): 56px pill = 40px row + 8px padding, 22px inside the hero on desktop
  const NAV_INSET = 22, NAV_START = 64;
  let navMode = '', navHidden = false, lastY = window.scrollY, activeCat = null;
  // A nav icon is "on" for its own type, or for any type inside the department it stands for
  const navOn = t => !!activeCat && (t === activeCat || (DEPTS.find(d => d.id === t) || { types: [] }).types.includes(activeCat));
  // Day / night theme (the new look lives in css/night.css). Remembered on this device; applied before paint by a head script.
  const SUN = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20.5 14.4A8.5 8.5 0 0 1 9.6 3.5a8.5 8.5 0 1 0 10.9 10.9z"/></svg>';
  const isNight = () => document.documentElement.getAttribute('data-theme') === 'night';
  const paintThemeBtns = () => document.querySelectorAll('[data-act="theme"]').forEach(b => { b.innerHTML = isNight() ? SUN : MOON; b.setAttribute('aria-label', isNight() ? 'Switch to day mode' : 'Switch to night mode'); b.title = b.getAttribute('aria-label'); });
  function toggleTheme() {
    const night = !isNight();
    if (night) document.documentElement.setAttribute('data-theme', 'night'); else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('wu-theme', night ? 'night' : 'day'); } catch (e) { /* private mode: the choice just isn't remembered */ }
    paintThemeBtns();
    window.dispatchEvent(new CustomEvent('wu-theme', { detail: { night } }));
  }
  document.addEventListener('click', e => { if (e.target.closest('[data-act="theme"]')) toggleTheme(); });
  const themeBtn = cls => `<button type="button" class="${cls}" data-act="theme" aria-label="Switch to night mode">${MOON}</button>`;
  const logoImgs = h => `<span class="site-nav__logo" style="height: ${h}px;"><img src="img/wu-logo.png" alt="WisdomUp"><img src="img/wu-logo-white.png" alt="" aria-hidden="true"></span>`;
  const DARK = '.hero, .pbanner, .loop__slide, .duo__card, .promo, .footer, .pd-stat--dark, .bulk-steps';
  function renderNav(force) {
    if (!nav) return;
    const w = vw(), wide = w >= 640;
    // Category icons that fit beside the logo and tools (each ~46px + 4px gap)
    const count = w >= 1240 ? NAV_CATS.length : w >= 1120 ? 11 : w >= 1000 ? 9 : w >= 880 ? 6 : w >= 760 ? 4 : 0;
    const gap = 4;
    const mode = wide ? 'w' + count + '-' + gap : 'n';
    if (mode === navMode && !force) return;
    navMode = mode;
    Object.assign(nav.style, wide
      ? { left: 'calc(var(--gutter, 28px) + 20px)', right: 'calc(var(--gutter, 28px) + 20px)', height: '56px', padding: '0 22px 0 28px', gap: '11px' }
      : { left: 'calc(var(--gutter, 16px) + 10px)', right: 'calc(var(--gutter, 16px) + 10px)', height: '43px', padding: '0 4px', gap: '0px' });
    if (wide) {
      nav.innerHTML = `
        <a href="${url.home}" aria-label="WisdomUp home" style="display: flex; align-items: center; flex: none;">${logoImgs(30)}</a>
        <nav class="site-nav__cats" aria-label="Categories" style="gap: ${gap}px;">
          ${NAV_CATS.slice(0, count).map(c => `<a class="navbtn navbtn--cat" href="${catHref(c.type)}" aria-label="${c.label}" data-type="${c.type}"${navOn(c.type) ? ' aria-current="true" aria-expanded="true"' : ''}>${navSvg(c.d, c.s, c.w, 24)}<span>${c.label}</span></a>`).join('')}
        </nav>
        <div class="site-nav__tools">
          <a class="navbtn navbtn--all" href="${url.products}" style="padding: 0 16px 0 11px; margin-right: 6px;">${navSvg(P_GRID, '', 2.2, 22)}<span>Shop All</span></a>
          ${themeBtn('navbtn navbtn--util')}
          <button type="button" class="navbtn navbtn--util" data-act="search" aria-label="Search">${navSvg('', P_SEARCH, 2.2, 22)}</button>
          <button type="button" class="navbtn navbtn--util" data-act="account" aria-label="Account">${navSvg(P_USER, '', 2.2, 22)}</button>
          <a class="navbtn navbtn--util" href="${url.wishlist}" aria-label="Wishlist" style="position: relative;"${here() === url.wishlist ? ' aria-current="true"' : ''}>${navSvg('', P_HEART, 2.2, 22)}<b class="site-nav__badge site-nav__wbadge" hidden></b></a>
          <button type="button" class="navbtn navbtn--util" data-act="bag" aria-label="Cart" style="position: relative;">${navSvg(P_BAG, P_HANDLE, 2.2, 22)}<b class="site-nav__badge" hidden></b></button>
        </div>`;
    } else {
      nav.innerHTML = `
        <div class="site-nav__narrow">
          <button type="button" class="site-nav__icon" data-act="menu" aria-label="Menu" aria-haspopup="dialog" aria-controls="mnav" aria-expanded="false" style="justify-self: start;"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M4 6.5h16M4 12h16M4 17.5h16"></path></svg></button>
          <a href="${url.home}" aria-label="WisdomUp home" style="display: flex; align-items: center; justify-content: center;">${logoImgs(26)}</a>
          <div style="justify-self: end; display: flex; align-items: center; gap: 2px;">
            <button type="button" class="site-nav__icon" data-act="search" aria-label="Search"><svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${P_SEARCH}"></path></svg></button>
            <a class="site-nav__icon" href="${url.wishlist}" aria-label="Wishlist" style="position: relative;"><svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" fill="none" stroke="#fff" stroke-width="2.1" stroke-linejoin="round"><path d="${P_HEART}"></path></svg><b class="site-nav__badge site-nav__wbadge" hidden></b></a>
            <button type="button" class="site-nav__icon" data-act="bag" aria-label="Cart"><svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${P_BAG}${P_HANDLE}"></path></svg><b class="site-nav__badge" hidden></b></button>
          </div>
        </div>`;
    }
    paintBadge();
    paintWish();
    paintThemeBtns();
    mountNavEdge();
  }
  // Edge light: one rainbow arc glides clockwise round a pill's 1px edge (the nav, and the stuck filter capsule). Speed, length and colours are copied from
  // the "Memory Updated" card on clickup.com/lp/brain — a conic gradient spun once every 4s whose lit arc covers ~40% of
  // the border (short orange head, then magenta, blue, and a fade-out tail). Their card is nearly square, so a plain
  // conic gradient works there; our bar is long and thin, so the same colours are placed by distance along the edge
  // (the gradient's angles are recomputed each frame) — the light keeps one steady speed instead of racing at the ends.
  const EDGE_LAP = 4000; // ms per lap on average (ClickUp: 4s linear infinite)
  // Speed only: the light moves like a spring being drawn forward — it stretches ahead, eases, stretches again — and
  // it NEVER runs backwards or bounces. A steady drift carries 35% of the pace; the other 65% arrives as a soft pull
  // every 2s, smoothed twice (a low-pass, then a critically damped spring — both can only move forward), so the speed
  // swells to ~1.9x the average and relaxes to ~0.4x with no jolt at either end. Average: still one lap per 4s.
  // Colours, arc length and the 1px line are untouched.
  const EDGE_PULL = 2000, EDGE_SHARE = .65; // ms between pulls; share of the pace that comes from the pulls
  const EDGE_FREQ = 4, EDGE_SOFT = 5;       // spring frequency (rad/s, critically damped); low-pass rate (1/s)
  const EDGE_STOPS = [   // [share of the edge behind the head, r, g, b, alpha] — ClickUp's conic stops as fractions of a turn
    [0, 237, 95, 0, .09], [.035, 237, 95, 0, 1], [.168, 255, 2, 240, 1], [.3004, 0, 145, 255, 1], [.3993, 0, 145, 255, 0], [1, 237, 95, 0, .09],
  ];
  const edgeColor = u => {
    let i = 1;
    while (i < EDGE_STOPS.length - 1 && u > EDGE_STOPS[i][0]) i++;
    const A = EDGE_STOPS[i - 1], B = EDGE_STOPS[i], t = (u - A[0]) / (B[0] - A[0]), a = A[4] + (B[4] - A[4]) * t;
    const ch = k => a > 0 ? Math.round((A[k] * A[4] + (B[k] * B[4] - A[k] * A[4]) * t) / a) : B[k]; // premultiplied, like CSS
    return `rgba(${ch(1)},${ch(2)},${ch(3)},${a.toFixed(3)})`;
  };
  // Every pill that carries the light: host element → { el: its .wu-edge ring, on: () => should it glow now }
  const edges = new Map();
  function addEdge(host, on) {
    if (!host || reduced()) return;
    let el = [...host.children].find(c => c.classList.contains('wu-edge'));
    if (!el) { host.insertAdjacentHTML('beforeend', '<span class="wu-edge" aria-hidden="true"></span>'); el = host.lastElementChild; }
    edges.set(host, { el, on });
  }
  const mountNavEdge = () => addEdge(nav, () => !navHidden);
  function runEdges() {
    if (reduced()) return;
    const SAMPLES = 96;
    // Point on the pill outline at distance d, clockwise from the left end of the top edge
    const at = (d, h, line, arc) => {
      const r = h / 2;
      if (d < line) return [r + d, 0];
      if (d < line + arc) { const t = (d - line) / r; return [r + line + r * Math.sin(t), r - r * Math.cos(t)]; }
      if (d < 2 * line + arc) return [r + line - (d - line - arc), h];
      const t = (d - 2 * line - arc) / r;
      return [r - r * Math.sin(t), r + r * Math.cos(t)];
    };
    const paint = (el, w, h, lap) => {
        const line = Math.max(0, w - h), arc = Math.PI * h / 2, total = 2 * line + 2 * arc;
        const wrap = q => (q % total + total) % total;
        const head = lap * total; // head's distance, clockwise from the top centre
        const qs = EDGE_STOPS.map(st => wrap(head - st[0] * total)); // exact colour points…
        for (let i = 0; i < SAMPLES; i++) qs.push(i * total / SAMPLES); // …plus even samples so angles follow the outline
        qs.sort((a, b) => a - b);
        let prev = 0;
        const stops = qs.map((q, i) => {
          const [x, y] = at(wrap(q + line / 2), h, line, arc);
          let deg = i ? Math.atan2(x - w / 2, h / 2 - y) * 180 / Math.PI : 0; // the first point is the top centre = 0deg
          if (deg < 0) deg += 360;
          // Angles must never run backwards: a rounding error at the top-centre seam would otherwise put a stop at
          // 360deg/0deg out of order and CSS would collapse the whole ring to one colour.
          if (deg < prev) deg = prev - deg > 180 ? 360 : prev;
          prev = deg;
          return `${edgeColor(wrap(head - q) / total)} ${deg.toFixed(2)}deg`;
        });
        stops.push(`${edgeColor(head / total)} 360deg`);
        el.style.backgroundImage = `conic-gradient(from 0deg at 50% 50%, ${stops.join(',')})`;
    };
    let pos = 0, vel = 0, soft = 0, last = 0; // head position (laps), speed (laps/s), smoothed target (laps)
    const goal = now => { // where the pull wants the head: a steady drift plus a step every EDGE_PULL
      const perMs = 1 / EDGE_LAP;
      return now * perMs * (1 - EDGE_SHARE) + Math.floor(now / EDGE_PULL) * EDGE_PULL * perMs * EDGE_SHARE;
    };
    const step = now => {
      const target = goal(now), dt = (now - last) / 1000;
      last = now;
      if (!(dt > 0) || dt > .25) { pos = soft = target; vel = 0; } // first frame / tab was in the background: no catching up
      else for (let rem = dt; rem > 0; rem -= .004) {              // small fixed steps keep it stable at any frame rate
        const h = Math.min(rem, .004);
        soft += (target - soft) * Math.min(1, EDGE_SOFT * h);
        vel += (-EDGE_FREQ * EDGE_FREQ * (pos - soft) - 2 * EDGE_FREQ * vel) * h; // damping ratio 1: no overshoot, ever
        pos += vel * h;
      }
      const lap = (pos % 1 + 1) % 1;
      edges.forEach(({ el, on }, host) => {
        if (!host.isConnected || !el.isConnected) { edges.delete(host); return; }
        if (!on()) return;
        const w = host.offsetWidth, h = host.offsetHeight;
        if (w && h) paint(el, w, h, lap);
      });
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function setActiveCat(label) {
    if (label === activeCat) return;
    activeCat = label;
    if (!nav) return;
    nav.querySelectorAll('.navbtn--cat').forEach(a => {
      const on = navOn(a.dataset.type);
      a.toggleAttribute('aria-current', on);
      a.setAttribute('aria-expanded', on);
    });
  }
  function toneNav() {
    const logo = nav && nav.querySelector('.site-nav__logo');
    if (!logo) return;
    // Sample at the nav's resting spot (ignores the hide/show translate mid-transition).
    const r = logo.getBoundingClientRect(), n = nav.getBoundingClientRect();
    const y = parseFloat(nav.style.top) + (r.top - n.top) + r.height / 2;
    const under = document.elementsFromPoint(r.left + r.width / 2, y).find(e => !nav.contains(e));
    nav.classList.toggle('on-dark', !!(under && under.closest(DARK)));
    if (!nav.classList.contains('is-toned')) requestAnimationFrame(() => nav.classList.add('is-toned'));
  }
  function paintBadge() {
    const b = nav && nav.querySelector('[data-act="bag"] .site-nav__badge');
    if (!b) return;
    const n = cartCount();
    b.hidden = n <= 0;
    b.textContent = n;
  }
  /* ---------- Priority bar rule: only one fixed bar on screen ----------
     A page's own sticky bar (data-priority-bar: All Products filters, product section tabs) outranks the nav.
     While that bar is stuck at the top, the nav stays hidden even when scrolling up; the nav returns only once
     the bar is back in its normal place with room for the nav above it. Pages without one keep the usual
     hide-on-scroll-down / show-on-scroll-up nav. A zero-height marker before the bar gives its natural position. */
  let pBar = null, pMark = null, held = false;
  function priorityBar() {
    if (!pBar || !pBar.isConnected) {
      pBar = document.querySelector('[data-priority-bar]');
      pMark = null;
    }
    if (!pBar || pBar.offsetParent === null) return null;
    if (!pMark) {
      pMark = document.createElement('div');
      pMark.setAttribute('aria-hidden', 'true');
      pMark.style.cssText = 'height: 0; margin: 0; padding: 0;';
      pBar.before(pMark);
    }
    return pBar;
  }
  // Where the bar would sit if it were not stuck (viewport px), and where it sits when stuck
  const barNatural = () => pMark.getBoundingClientRect().top + (parseFloat(getComputedStyle(pBar).marginTop) || 0);
  const barStuckTop = () => parseFloat(getComputedStyle(pBar).top) || 0;

  function placeNav() {
    if (!nav) return;
    const y = window.scrollY, d = y - lastY, was = navHidden;
    // Pages with a hero tuck the nav 12px inside it; other pages park it under the utility bar.
    const anchor = [...document.querySelectorAll('[data-nav-anchor]')].find(el => el.offsetParent !== null); // first visible anchor
    let top;
    if (vw() < 640) top = anchor ? Math.max(10, anchor.getBoundingClientRect().top + 10) : 10;
    else top = Math.max(16, (anchor ? anchor.getBoundingClientRect().top + y + NAV_INSET : NAV_START) - y);
    if (y < 120) navHidden = false;
    else if (d > 6) navHidden = true;
    else if (d < -6) navHidden = false;
    if (Math.abs(d) > 6 || y < 120) lastY = y;
    // Priority bar: hold the nav back until there is room for it above the bar (nav bottom + 6px gap)
    const pb = priorityBar();
    held = !!pb && barNatural() < top + nav.offsetHeight + 6;
    if (pb) {
      // .is-stuck = the bar has left its place. Sticky bars (product tabs): pinned at the top. In-flow bars (All Products
      // filters): scrolled completely out of view plus a little more — their floating twin then drops in; the two
      // thresholds stop it flickering when you hover around that point.
      const nat = barNatural(), was = pb.classList.contains('is-stuck');
      pb.classList.toggle('is-stuck', getComputedStyle(pb).position === 'sticky' ? nat < barStuckTop() - .5 : nat + pb.offsetHeight < (was ? -24 : -48));
    }
    if (held) navHidden = true;
    if (toTop) toTop.classList.toggle('is-on', y > innerHeight * .8); // back-to-top on every page once you're a screen down
    nav.style.top = top + 'px';
    nav.style.transform = navHidden ? 'translateY(calc(-100% - 40px))' : 'none';
    toneNav();
    if (was !== navHidden) window.dispatchEvent(new CustomEvent('wu-nav', { detail: { hidden: navHidden } }));
  }
  const navOffset = () => {
    if (!nav) return 0;
    const r = nav.getBoundingClientRect();
    return navHidden ? 0 : Math.max(0, r.bottom);
  };

  /* ---------- Search overlay ---------- */
  // The search box types its own hint ("Search earbuds, …") with a blinking caret when it opens
  let hintTimer = 0;
  function stopHint() { clearInterval(hintTimer); hintTimer = 0; }
  function typeHint(input) {
    stopHint();
    if (reduced() || input.value) return;
    const full = input.dataset.hint || (input.dataset.hint = input.placeholder);
    let i = 0, blink = 0;
    input.placeholder = '';
    hintTimer = setInterval(() => {
      if (input.value) { input.placeholder = full; stopHint(); return; }
      if (i <= full.length) input.placeholder = full.slice(0, i++) + '|';
      else if (blink < 48) input.placeholder = full + (Math.floor(blink++ / 8) % 2 ? '\u00a0' : '|');
      else { input.placeholder = full; stopHint(); }
    }, 45);
  }
  function mountSearch() {
    const host = document.createElement('div');
    host.className = 'scrim';
    host.hidden = true;
    host.innerHTML = `
      <div class="search" role="dialog" aria-modal="true" aria-label="Search products">
        <label class="search__field">${icon('search', 22)}<input type="search" placeholder="Search earbuds, speakers, chargers…" aria-label="Search products"><button type="button" class="search__close" aria-label="Close search">×</button></label>
        <div class="search__pages" hidden></div>
        <div class="search__label"><b></b></div>
        <div class="search__grid"></div>
      </div>`;
    document.body.appendChild(host);
    const input = host.querySelector('input'), grid = host.querySelector('.search__grid'), label = host.querySelector('.search__label b'), pagesEl = host.querySelector('.search__pages');
    // Help and company pages are searchable too ("warranty", "return", "track", "bulk"…)
    const PAGES = [
      ['Wishlist', url.wishlist, 'wishlist saved favourites favorites hearts liked save for later'],
      ['Shipping Policy', url.shipping, 'shipping delivery express courier free cod cash on delivery time days'],
      ['Exchange & Refund Policy', url.returns, 'return refund exchange money back 7-day guarantee'],
      ['Warranty Policy', url.warranty, 'warranty repair replacement claim defect guarantee'],
      ['Order Tracker', url.track, 'track tracking order status where parcel'],
      ['Help Center', url.help, 'help support contact faq question phone email'],
      ['e-Manuals', url.manuals, 'manual pair pairing guide setup reset instructions'],
      ['Bulk Orders', url.bulk, 'bulk wholesale distributor retailer reseller stockist'],
      ['Corporate Orders', url.corporate, 'corporate company gift gifts employee client branding logo'],
      ['Content Creators Program', url.creators, 'creator influencer youtube tiktok instagram affiliate commission'],
      ['WisdomUp Live', url.live, 'live show stream friday deals'],
      ['About WisdomUp', url.about, 'about company brand story countries'],
      ['Where to Buy', url.where, 'where buy store retailer shop near me international'],
      ['Blog', url.blog, 'blog guide tips how to article'],
    ];
    const BG = D.media;
    const paint = () => {
      const q = input.value.trim().toLowerCase();
      const pages = q.length > 1 ? PAGES.filter(([t, , k]) => (t + ' ' + k).toLowerCase().split(/\s+/).some(w => w.startsWith(q) || q.split(/\s+/).some(x => x.length > 2 && w.startsWith(x)))).slice(0, 4) : [];
      pagesEl.hidden = !pages.length;
      pagesEl.innerHTML = pages.map(([t, h]) => `<a href="${h}">${esc(t)} ›</a>`).join('');
      const words = q.split(/\s+/).filter(Boolean);
      const hay = p => p._s || (p._s = [p.title, p.meta, p.cat, (p.skus || []).join(' '), (p.connectors || []).join(' '), DEPTS.filter(d => d.types.includes(p.type)).map(d => d.label).join(' '), (p.highlights || []).join(' ')].join(' ').toLowerCase());
      // Rank: words in the product name and category count most, then specs/highlights
      const score = p => words.reduce((n, w) => n + (p.title.toLowerCase().includes(w) ? 3 : 0) + (p.cat.toLowerCase().includes(w) ? 4 : 0), 0);
      const hits = q ? D.products.filter(p => words.every(w => hay(p).includes(w))).sort((a, b) => score(b) - score(a)) : D.products.filter(p => p.tabs.includes('best') || p.tabs.includes('new'));
      const res = hits.slice(0, 8);
      label.textContent = q ? (hits.length ? (hits.length > res.length ? `Top ${res.length} of ${hits.length} results` : hits.length + ' result' + (hits.length > 1 ? 's' : '')) : 'No matches — try “earbuds”, “charger” or “cable”') : 'Popular right now';
      grid.innerHTML = res.map((p, i) => `
        <a class="ccard" href="${url.product(p.id)}">
          <div class="ccard__media" style="background: ${p.thumb ? photoBg(p) : BG[i % BG.length]};">${p.thumb ? `<img src="${p.thumb}" alt="${esc(p.title)}" loading="lazy" style="width: 100%; height: 100%; ${photoFit(p)}">` : art(p.art, { alt: p.title, style: 'width: 100%; height: 100%;' })}${p.ribbon || p.cat ? `<div class="ccard__tag"><span>${esc(p.ribbon || p.cat)}</span></div>` : ''}</div>
          <div class="ccard__body"><div class="ccard__title">${esc(code(p))}</div><p class="ccard__meta">${esc(p.meta)}</p></div>
          <div class="ccard__foot"><span class="ccard__price">${esc(p.priceText)}</span>${p.wasText ? `<s class="ccard__was">${esc(p.wasText)}</s>` : ''}</div>
        </a>`).join('');
    };
    host.classList.add('is-anim');
    let closing = 0;
    const open = () => { clearTimeout(closing); host.hidden = false; document.documentElement.style.overflow = 'hidden'; paint(); requestAnimationFrame(() => host.classList.add('is-open')); setTimeout(() => input.focus(), 30); typeHint(input); };
    const close = () => { host.classList.remove('is-open'); document.documentElement.style.overflow = ''; stopHint(); const done = () => { host.hidden = true; }; if (reduced()) done(); else closing = setTimeout(done, 850); };
    input.addEventListener('input', paint);
    let sentQ = ''; // tell the pixel what was searched, once per finished query
    input.addEventListener('change', () => { const q = input.value.trim(); if (q.length > 1 && q !== sentQ) { sentQ = q; px('Search', { search_string: q }); } });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { const a = grid.querySelector('a') || pagesEl.querySelector('a'); if (a) location.href = a.href; } });
    host.addEventListener('click', e => { if (e.target === host || e.target.closest('.search__close')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !host.hidden) close(); });
    sheetDrag(host.querySelector('.search'), close, { scroller: () => host.querySelector('.search'), head: '.search__field' });
    return { open, close };
  }

  /* ---------- WUProductCard (designed at 430px, scales with cqw) ---------- */
  // Colours only when the supplier sheet lists them (no invented swatches)
  const colorsOf = p => (p.colors || []).map((c, i) => typeof c === 'string' ? { name: 'Colour ' + (i + 1), hex: c } : c);
  // Studio photo on a background sampled from the photo itself, so landscape packshots blend into portrait frames
  const photoBg = p => p.bg ? `radial-gradient(110% 80% at 50% 45%, ${p.bg[0]} 0%, ${p.bg[1]} 100%)` : '#F8F9FA';
  // Packshots show the product on the left and its box on the right: frame the product, unless the shot is very wide
  const photoFit = p => (p.ar || 1) >= 2.1 ? 'object-fit: contain;' : 'object-fit: cover; object-position: 6% 50%;';
  const seedOf = p => [...p.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const ratingOf = p => { const rt = p.rating, s = seedOf(p); return typeof rt === 'number' ? (rt >= 5 ? rt - (s % 4) * 0.1 : rt).toFixed(1) : '4.6'; };
  const reviewsOf = p => 24 + (seedOf(p) * 37) % 260;
  const etaFor = (seed, off) => {
    if (off) return '';
    const d = new Date(); d.setDate(d.getDate() + 2 + (seed % 2));
    return 'Get it as early as ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  // Card spec trio (2026-10-06, inspired by login.com.pk's cards): up to three SHORT real specs from catalog.js, most useful first
  const SPEC_ORDER = ['Max output', 'Output power', 'Fast charging', 'Capacity', 'Playtime', 'Battery', 'Runtime', 'Bluetooth', 'Driver', 'Range', 'Cable length', 'Length', 'Water resistance', 'Case battery', 'Earbud battery', 'Ports', 'Wireless output', 'Output', 'DPI', 'Resolution', 'Latency', 'Motor speed', 'Standby', 'Charging time'];
  const SPEC_LABEL = { 'Output power': 'Output', 'Fast charging': 'Fast charge', 'Cable length': 'Length', 'Water resistance': 'Water', 'Case battery': 'Case', 'Earbud battery': 'Earbud', 'Wireless output': 'Wireless', 'Charging time': 'Charge time', 'Motor speed': 'Motor' };
  const specTrio = p => {
    const out = [];
    for (const k of SPEC_ORDER) {
      const hit = (p.specs || []).find(([kk]) => kk === k);
      if (!hit) continue;
      const v = String(hit[1]).trim();
      if (v.length > 11) continue; // long values don't fit a trio cell — the full spec list is on the product page
      out.push([v, SPEC_LABEL[k] || k]);
      if (out.length === 3) break;
    }
    return out;
  };
  // "SJX-49 Fast Charging Cable" → name "Fast Charging Cable" + model "SJX-49" (every catalogue title starts with its code)
  const cardName = p => (p.title.toUpperCase().startsWith(p.code.toUpperCase()) ? p.title.slice(p.code.length).replace(/^[\s\-–—|:·]+/, '') : '') || p.title;
  function productCard(p, opts = {}) {
    const seed = seedOf(p), off = !!p.soldOut, href = url.product(p.id);
    const badge = opts.badge !== undefined ? opts.badge : p.ribbon;
    const opts_n = p.variants ? p.variants.length : 0, colours = colorsOf(p);
    const media = p.thumb
      ? `<img class="wpc__photo" src="${p.thumb}" alt="${esc(p.title)}" loading="lazy" style="${photoFit(p)}">`
      : `<div class="wpc__art wpc__art--main">${art(p.art, { alt: p.title })}</div>`;
    return `
      <div class="wpc${off ? ' wpc--off' : ''}" data-pid="${p.id}">
        <article class="wpc__card">
          <a class="wpc__media" href="${href}" tabindex="-1" aria-hidden="true" style="background: ${photoBg(p)};">
            ${media}
            ${badge ? `<span class="wpc__badge">${esc(badge)}</span>` : ''}
          </a>
          ${wishBtn(p, 'wpc__wish')}
          <div class="wpc__body">
            <div class="wpc__head">
              <h3 class="wpc__title"><a href="${href}" aria-label="${esc(p.title)}">${esc(cardName(p))}</a></h3>
              <div class="wpc__model"><span class="wpc__code">${esc(p.code)}</span><i aria-hidden="true"></i><span class="wpc__cat">${esc(p.cat)}</span>${(() => { const rv = reviews.summary(p.id); return rv.count ? `<span class="wpc__rating" aria-label="Rated ${rv.avg.toFixed(1)} out of 5 from ${rv.count} review${rv.count > 1 ? 's' : ''}">${STAR_SVG}<span>${rv.avg.toFixed(1)}</span><small>(${rv.count})</small></span>` : `<span class="wpc__rating wpc__rating--none" aria-label="No reviews yet">${STAR_OUTLINE}<span>0.0</span></span>`; })()}</div>
            </div>
            ${colours.length > 1 ? `<div class="wpc__swatches" role="radiogroup" aria-label="Colour">${colours.map((c, i) => `<button type="button" class="wpc__swatch" role="radio" aria-label="${esc(c.name)}" aria-checked="${i === 0}" style="background: ${c.hex}; --sw: ${c.hex};"></button>`).join('')}</div>` : ''}
            ${(() => { // real options on the card (Shokz-style): the first option type as chips; else the spec trio
              const axis = p.axes && p.axes[0], vals = axis ? [...new Set(p.variants.map(v => v.attrs[axis]).filter(Boolean))] : [];
              if (vals.length > 1) return `<div class="wpc__opt"><span class="wpc__optlabel">${esc(axis)}</span><div class="wpc__optchips" role="radiogroup" aria-label="${esc(axis)}">${vals.slice(0, 3).map(val => `<button type="button" class="wpc__optchip" role="radio" aria-checked="false" data-axis="${esc(axis)}" data-val="${esc(val)}">${esc(val)}</button>`).join('')}${vals.length > 3 ? `<span class="wpc__optmore">+${vals.length - 3}</span>` : ''}</div><span class="wpc__opts">${opts_n} options</span></div>`;
              const trio = specTrio(p);
              return trio.length ? `<dl class="wpc__specs">${trio.map(([v, k]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : '';
            })()}
            <div class="wpc__prices"><span class="wpc__price">${esc(p.priceText.replace(/^From\s+/, ''))}</span>${p.wasText ? `<s class="wpc__was" aria-label="Regular price ${esc(p.wasText)}">${esc(p.wasText)}</s>` : ''}${p.off ? `<span class="wpc__off">−${p.off}%</span>` : ''}</div>
            <div class="wpc__foot">
              ${opts_n
                ? `<a class="wpc__cta" href="${href}"${off ? ' aria-disabled="true"' : ''}><span class="wpc__cta-t">${off ? 'Sold out' : 'Choose'}</span><span class="wpc__cta-ic">${icon('chev-r', 16)}</span></a>`
                : `<button type="button" class="wpc__cta"${off ? ' disabled aria-disabled="true"' : ''}><span class="wpc__cta-ic">${icon('cart', 16)}</span><span class="wpc__cta-t">${off ? 'Sold out' : 'Add to cart'}</span></button>`}
            </div>
          </div>
        </article>
      </div>`;
  }
  document.addEventListener('click', e => {
    const choose = e.target.closest('a.wpc__cta');
    if (choose && !(e.metaKey || e.ctrlKey || e.shiftKey || e.button)) {
      const pid = choose.closest('.wpc') && choose.closest('.wpc').dataset.pid, prod = D.byId(pid);
      if (prod && !prod.soldOut && prod.variants && prod.variants.length > 1 && qaddUI) { e.preventDefault(); qaddUI.open(prod, choose, choose.closest('.wpc').dataset.sku); }
      return;
    }
    const oc = e.target.closest('.wpc__optchip');
    if (oc) {
      const card = oc.closest('.wpc'), prod = D.byId(card.dataset.pid);
      const v = prod && prod.variants.find(x => x.attrs[oc.dataset.axis] === oc.dataset.val);
      if (!v) return;
      oc.parentElement.querySelectorAll('.wpc__optchip').forEach(x => x.setAttribute('aria-checked', x === oc));
      card.dataset.sku = v.sku;
      const pr = card.querySelector('.wpc__prices');
      pr.innerHTML = `<span class="wpc__price">${esc(v.priceText)}</span>${v.wasText ? `<s class="wpc__was" aria-label="Regular price ${esc(v.wasText)}">${esc(v.wasText)}</s>` : ''}${v.off ? `<span class="wpc__off">−${v.off}%</span>` : ''}`;
      const ph = card.querySelector('.wpc__photo'); if (ph && (v.thumb || v.img)) ph.src = v.thumb || v.img;
      return;
    }
    const sw = e.target.closest('.wpc__swatch');
    if (sw) { sw.parentElement.querySelectorAll('.wpc__swatch').forEach(x => x.setAttribute('aria-checked', x === sw)); return; }
    const cta = e.target.closest('button.wpc__cta');
    if (!cta || cta.disabled) return;
    add(cta.closest('.wpc').dataset.pid);
    const t = cta.querySelector('.wpc__cta-t');
    t.textContent = 'Added';
    clearTimeout(cta._t);
    cta._t = setTimeout(() => { t.textContent = 'Add to cart'; }, 1400);
  });

  /* ---------- Shop rail (aqua band; card counts locked by wu-rail.css) ---------- */
  function mountRail(root, { title, items, tabs, tabsLabel = 'Choose a range', allHref = url.products, allLabel = 'Shop all', headingTag = 'h2', id } = {}) {
    // tabs: [{ label, items, allHref }] — one section with a chip row under the heading and one locked rail track per tab
    // (home "Shop by Budget", 2026-10-06). Without `tabs` it is the plain rail.
    const panes = tabs && tabs.length ? tabs : [{ items, allHref }];
    let cur = 0;
    root.classList.add('shop-rail');
    root.classList.toggle('shop-rail--tabs', !!tabs);
    root.innerHTML = `
      <div class="shop-rail__head">
        <${headingTag} class="sec-title shop-rail__title"${id ? ` id="${id}"` : ''}>${esc(title)}</${headingTag}>
        <div class="shop-rail__ctrls">
          ${panes[0].allHref ? `<a href="${panes[0].allHref}" class="shop-rail__all">${esc(allLabel)}</a>` : ''}
          <button type="button" class="shop-rail__step" data-step="-1" aria-label="Previous products">${icon('chev-l', 18)}</button>
          <button type="button" class="shop-rail__step" data-step="1" aria-label="Next products">${icon('chev-r', 18)}</button>
        </div>
      </div>
      ${tabs ? `<div class="shop-rail__tabs" role="tablist" aria-label="${esc(tabsLabel)}">${tabs.map((t, i) => `<button type="button" role="tab" class="chip" data-tab="${i}" aria-selected="${i === 0}">${esc(t.label)}</button>`).join('')}</div>` : ''}
      ${panes.map((t, i) => `<div class="wu-rail"${tabs ? ` role="tabpanel" aria-label="${esc(t.label)}"` : ''}${i ? ' hidden' : ''}>${(t.items || []).map(p => productCard(p)).join('')}</div>`).join('')}`;
    const tracks = [...root.querySelectorAll('.wu-rail')];
    const [prev, next] = root.querySelectorAll('.shop-rail__step');
    const all = root.querySelector('.shop-rail__all');
    const track = () => tracks[cur];
    const sync = () => {
      const t = track();
      prev.toggleAttribute('data-dim', t.scrollLeft < 4);
      next.toggleAttribute('data-dim', t.scrollLeft + t.clientWidth >= t.scrollWidth - 4);
    };
    const show = i => {
      if (i === cur || !panes[i]) return;
      const from = tracks[cur], to = tracks[i];
      cur = i;
      root.querySelectorAll('.shop-rail__tabs [data-tab]').forEach((c, k) => c.setAttribute('aria-selected', k === i));
      if (all && panes[i].allHref) all.href = panes[i].allHref;
      const swap = () => {
        tracks.forEach((t, k) => { t.hidden = k !== i; });
        to.scrollLeft = 0; sync();
        if (!reduced() && to.animate) to.animate([{ opacity: 0, transform: 'translateY(2rem)' }, { opacity: 1, transform: 'none' }], { duration: 150, easing: 'ease-out' });
        staggerCards(to);
      };
      if (reduced() || !from.animate) { swap(); return; }
      const a = from.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(2rem)' }], { duration: 150, easing: 'ease-in', fill: 'forwards' });
      a.onfinish = () => { a.cancel(); swap(); };
    };
    root.addEventListener('click', e => {
      const tab = e.target.closest('.shop-rail__tabs [data-tab]'); // only the tab chips (the rail sections carry their own data-tab)
      if (tab) { show(+tab.dataset.tab); return; }
      const s = e.target.closest('[data-step]');
      if (!s) return;
      const t = track();
      const card = t.firstElementChild ? t.firstElementChild.getBoundingClientRect().width + 20 : 300;
      t.scrollBy({ left: +s.dataset.step * card * Math.max(1, Math.floor(t.clientWidth / card) - 1) });
    });
    tracks.forEach(t => t.addEventListener('scroll', () => { if (t === track()) sync(); }, { passive: true }));
    window.addEventListener('resize', sync);
    sync();
    return track();
  }

  /* ---------- Lifestyle hero (crossfade) ---------- */
  const HERO_POS = { 'hero-os4': '50% 0%' };
  function mountHero(el, slides = D.lifestyle) {
    // Hero slideshow — bugatti.store behaviour (measured 2026-10-06), our own code:
    // · slides GLIDE sideways (1000ms expo-out), wrap around, follow a mouse/finger drag (release past 15% or a flick to change)
    // · every incoming image zooms out 1.3 → 1 over 1300ms
    // · the copy lives in its own layer: old words rise out (−90%, 1s), and 500ms + 30ms per word later the new words rise in
    //   from below, 250ms + 30ms apart (the name and the button move as whole units)
    // · autoplay every 6s, paused while hovered, restarted after any interaction; reduced motion = instant swaps
    if (!el) return;
    const n = slides.length;
    const E = 'cubic-bezier(.16,1,.3,1)';
    let i = 0, hover = false, busy = null, timer = 0, wordTimer = 0, drag = null, dragged = false;
    const words = t => esc(t).split(/\s+/).filter(Boolean).map(w => `<span class="hw"><span class="hw__i">${w}</span></span>`).join(' ');
    el.innerHTML = slides.map((s, k) => `
      <div class="hero__slide${s.pack ? ' hero__slide--pack' : ''}${k === 0 ? ' is-on' : ''}" aria-roledescription="slide" aria-label="${k + 1} of ${n}"${k ? ' aria-hidden="true"' : ''}>
        ${s.pack && s.src ? `<a class="hero__pack" href="${url.product(s.pid)}" tabindex="-1" aria-hidden="true" draggable="false" style="background: radial-gradient(110% 80% at 50% 45%, ${s.bg[0]}, ${s.bg[1]});"><img src="${s.src}" alt="" draggable="false"${k ? ' loading="lazy"' : ''}></a>`
          : s.src ? `<img class="hero__img" src="${s.src}" alt="${esc(s.hint)}" draggable="false"${HERO_POS[s.slotId] ? ` style="object-position: ${HERO_POS[s.slotId]};"` : ''}${k ? ' loading="lazy"' : ''}>` : ''}
        <div class="hero__scrim"></div>
      </div>`).join('') + `
      <div class="hero__words">${slides.map((s, k) => `
        <div class="hero__copy${s.pack ? ' hero__copy--pack' : ''}" aria-current="${k === 0}"${k ? ' aria-hidden="true"' : ''}>
          <div class="eyebrow eyebrow--warm">${words(s.kicker)}</div>
          <div class="hw hw--block"><div class="hero__name hw__i">${esc(s.name)}</div></div>
          <div class="hero__line">${words(s.line)}</div>
          ${s.sub ? `<div class="hero__sub">${words(s.sub)}</div>` : ''}
          <div class="hero__cta hw__i hw__i--cta">${btnBuy(s.ctaLabel, url.product(s.pid))}</div>
        </div>`).join('')}
      </div>
      <div class="hero__bar">
        <button type="button" class="hero__arrow hero__arrow--prev" aria-label="Previous slide"><svg viewBox="0 0 37 24" aria-hidden="true"><path d="M10 5L3 12M3 12L10 19M3 12H33.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div class="hero__dots"><div class="dots" role="tablist" aria-label="Slides" style="position: static;">
          ${slides.map((_, k) => `<button type="button" class="dot" role="tab" aria-label="Slide ${k + 1}" aria-selected="${k === 0}"></button>`).join('')}
        </div></div>
        <button type="button" class="hero__arrow hero__arrow--next" aria-label="Next slide"><svg viewBox="0 0 37 24" aria-hidden="true"><path d="M26.5 5L33.5 12M33.5 12L26.5 19M33.5 12H3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </div>`;
    const slideEls = [...el.querySelectorAll('.hero__slide')], copies = [...el.querySelectorAll('.hero__copy')], dots = el.querySelectorAll('.dot');
    const units = c => [...c.querySelectorAll('.hw__i')];
    const setCur = (c, on) => {
      c.setAttribute('aria-current', on);
      if (on) c.removeAttribute('aria-hidden'); else c.setAttribute('aria-hidden', 'true');
      c.querySelectorAll('a, button').forEach(x => { x.tabIndex = on ? 0 : -1; });
    };
    copies.forEach((c, k) => setCur(c, k === 0));
    const stopAnims = c => c.querySelectorAll('.hw__i').forEach(x => x.getAnimations().forEach(a => a.cancel()));
    const wordsIn = c => {
      if (reduced() || !c.animate) return;
      c.querySelectorAll('.hw').forEach(w => w.classList.remove('is-open'));
      const u = units(c);
      u.forEach((x, k) => {
        const cta = x.classList.contains('hw__i--cta');
        x.animate([{ opacity: 0, transform: cta ? 'translateY(2rem)' : 'translateY(90%)' }, { opacity: 1, transform: 'none' }],
          { duration: cta ? 1500 : 1000, delay: 250 + k * 30, easing: E, fill: 'backwards' });
      });
      setTimeout(() => c.querySelectorAll('.hw').forEach(w => w.classList.add('is-open')), 1250 + u.length * 30);
    };
    const wordsOut = c => {
      if (reduced() || !c.animate) return 0;
      c.querySelectorAll('.hw').forEach(w => w.classList.remove('is-open'));
      const u = units(c);
      u.forEach((x, k) => {
        const cta = x.classList.contains('hw__i--cta');
        x.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: cta ? 'translateY(-2rem)' : 'translateY(-90%)' }],
          { duration: 1000, delay: 250 + k * 30, easing: E, fill: 'forwards' });
      });
      return 500 + 30 * u.length;
    };
    const swapWords = (from, to) => {
      clearTimeout(wordTimer);
      copies.forEach(c => { if (c !== from) { stopAnims(c); setCur(c, false); } });
      const done = () => { stopAnims(from); setCur(from, false); setCur(to, true); wordsIn(to); };
      const wait = wordsOut(from);
      if (wait) wordTimer = setTimeout(done, wait); else done();
    };
    const zoom = slide => {
      const m = slide.querySelector('.hero__img, .hero__pack img');
      if (m && !reduced() && m.animate) m.animate([{ transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 1300, easing: E });
    };
    // from/to positions in % of the hero width (a drag hands over where the finger left them)
    const glide = (from, to, dir, offset = 0) => {
      to.classList.add('is-on'); from.classList.add('is-on', 'is-out');
      const o = { duration: 1000, easing: E, fill: 'forwards' };
      const a = to.animate([{ transform: `translateX(${dir * 100 + offset}%)` }, { transform: 'translateX(0)' }], o);
      const b = from.animate([{ transform: `translateX(${offset}%)` }, { transform: `translateX(${-dir * 100}%)` }], o);
      const end = () => { from.classList.remove('is-on', 'is-out'); a.cancel(); b.cancel(); busy = null; };
      b.onfinish = end;
      return { finish: () => { a.finish(); b.finish(); } };
    };
    const go = (v, { dir, offset = 0 } = {}) => {
      const next = ((v % n) + n) % n;
      if (next === i) return;
      if (busy) busy.finish();
      dir = dir || (v > i ? 1 : -1);
      const from = slideEls[i], to = slideEls[next];
      swapWords(copies[i], copies[next]);
      i = next;
      dots.forEach((d, k) => d.setAttribute('aria-selected', k === i));
      slideEls.forEach((s, k) => { if (k === i) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true'); });
      if (reduced() || !to.animate) { from.classList.remove('is-on'); to.classList.add('is-on'); }
      else { busy = glide(from, to, dir, offset); zoom(to); }
      play();
    };
    // Autoplay: every 6s, paused while hovered or dragged, restarted after any interaction
    const play = () => {
      clearTimeout(timer);
      if (reduced() || n < 2) return;
      timer = setTimeout(() => { if (!hover && !drag && !document.hidden) go(i + 1, { dir: 1 }); else play(); }, 6000);
    };
    setTimeout(() => wordsIn(copies[0]), 150);
    zoom(slideEls[0]);
    play();
    el.addEventListener('click', e => {
      if (dragged) { e.preventDefault(); e.stopPropagation(); return; }
      const t = e.target;
      if (t.closest('.hero__arrow--prev')) go(i - 1, { dir: -1 });
      else if (t.closest('.hero__arrow--next')) go(i + 1, { dir: 1 });
      else if (t.closest('.dot')) { const k = [...dots].indexOf(t.closest('.dot')); go(k, { dir: k > i ? 1 : -1 }); }
    }, true);
    // Drag (mouse and touch): the slide follows the pointer; past 15% of the width or a quick flick it changes, otherwise it springs back
    el.addEventListener('pointerdown', e => {
      if ((e.pointerType === 'mouse' && e.button !== 0) || e.target.closest('.hero__arrow, .dot, .hero__cta') || n < 2) return;
      if (busy) busy.finish();
      drag = { x: e.clientX, y: e.clientY, t: performance.now(), dx: 0, on: false, id: e.pointerId, w: el.clientWidth, nb: null };
      dragged = false;
    });
    window.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.on) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) > Math.abs(dx)) { drag = null; return; } // a vertical swipe scrolls the page
        drag.on = true; el.classList.add('is-dragging');
      }
      drag.dx = dx;
      const dir = dx < 0 ? 1 : -1, nb = slideEls[(i + dir + n) % n];
      if (drag.nb && drag.nb !== nb) { drag.nb.classList.remove('is-on'); drag.nb.style.transform = ''; }
      drag.nb = nb; nb.classList.add('is-on');
      slideEls[i].style.transform = `translateX(${dx}px)`;
      nb.style.transform = `translateX(calc(${dir * 100}% + ${dx}px))`;
    }, { passive: true });
    const release = e => {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      const d = drag; drag = null;
      if (!d.on) return;
      dragged = true; setTimeout(() => { dragged = false; }, 0);
      el.classList.remove('is-dragging');
      const pct = d.dx / d.w * 100, dir = d.dx < 0 ? 1 : -1;
      const fast = Math.abs(d.dx) > 40 && performance.now() - d.t < 300;
      slideEls[i].style.transform = ''; if (d.nb) d.nb.style.transform = '';
      if (Math.abs(pct) > 15 || fast) { if (d.nb) d.nb.classList.remove('is-on'); go(i + dir, { dir, offset: pct }); return; }
      const o = { duration: 600, easing: E };
      slideEls[i].animate([{ transform: `translateX(${pct}%)` }, { transform: 'translateX(0)' }], o);
      if (d.nb) { const nb = d.nb; const a = nb.animate([{ transform: `translateX(${dir * 100 + pct}%)` }, { transform: `translateX(${dir * 100}%)` }], o); a.onfinish = () => { if (nb !== slideEls[i]) nb.classList.remove('is-on'); }; }
      play();
    };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    el.addEventListener('mouseenter', () => { hover = true; });
    el.addEventListener('mouseleave', () => { hover = false; play(); });
  }


  /* ---------- Accordion (FAQ pattern: one open at a time) ---------- */
  const faqSeen = [];
  // FAQ lists written straight into a page's HTML ([data-faq-ld]) get the same structured data
  function faqFromPage() {
    const items = [...document.querySelectorAll('[data-faq-ld] .faq__item')].map(it => [(it.querySelector('.faq__q span') || {}).textContent, (it.querySelector('.faq__a') || {}).textContent]).filter(x => x[0] && x[1]).map(x => x.map(t => t.replace(/\s+/g, ' ').trim()));
    if (!items.length || [...document.querySelectorAll('script[type="application/ld+json"]')].some(n => n.textContent.includes('"FAQPage"'))) return;
    const sc = document.createElement('script'); sc.type = 'application/ld+json'; sc.dataset.faqLd = ''; sc.textContent = JSON.stringify(ldFaq(items)); document.head.append(sc);
  }
  function mountAccordion(listEl, items, { first = -1, idPrefix = 'acc', ldReset = false } = {}) {
    if (ldReset) faqSeen.length = 0; // a page that swaps its FAQ (the listing's buying guide) starts its FAQ data afresh
    // Structured data so Google can show these questions under the search result (one FAQPage per page)
    if (items.length && ![...document.querySelectorAll('script[type="application/ld+json"]:not([data-faq-ld])')].some(n => n.textContent.includes('"FAQPage"'))) {
      items.forEach(it => { if (!faqSeen.some(x => x[0] === it[0])) faqSeen.push(it); });
      document.head.querySelectorAll('script[data-faq-ld]').forEach(n => n.remove());
      const sc = document.createElement('script'); sc.type = 'application/ld+json'; sc.dataset.faqLd = ''; sc.textContent = JSON.stringify(ldFaq(faqSeen)); document.head.append(sc);
    }
    listEl.innerHTML = items.map(([q, a], i) => `
      <div class="faq__item">
        <button type="button" class="faq__q" aria-expanded="${i === first}" aria-controls="${idPrefix}-a${i}"><span>${esc(q)}</span><span class="faq__chev">${icon('chev-r', 18)}</span></button>
        <div class="faq__a" id="${idPrefix}-a${i}"${i === first ? '' : ' hidden'}>${String(a).split('\n').map(l => `<span>${esc(l)}</span>`).join('')}</div>
      </div>`).join('');
    listEl.addEventListener('click', e => {
      const q = e.target.closest('.faq__q');
      if (!q) return;
      const open = q.getAttribute('aria-expanded') !== 'true';
      listEl.querySelectorAll('.faq__q').forEach(b => {
        const on = b === q && open;
        if ((b.getAttribute('aria-expanded') === 'true') === on) return;
        b.setAttribute('aria-expanded', on);
        slide(b.nextElementSibling, on);
      });
    });
  }

  /* ---------- Trust bar ---------- */
  function renderTrust() {
    const el = $('trust');
    // Each promise links to the page that explains it (shipping, returns, warranty, support)
    const TRUST_LINKS = { truck: url.shipping, smile: url.returns, medal: url.warranty, shield: url.help };
    if (el) el.innerHTML = `<section class="trust" aria-label="Why shop with us"><div class="trust__title">Why WisdomUp</div><div class="trust__items">${D.trust.map(it => `<a class="trust__item" href="${TRUST_LINKS[it.icon] || url.help}">${icon(it.icon, 36)}<span style="white-space: pre-line;">${esc(it.label)}</span></a>`).join('')}</div></section>`;
  }

  /* ---------- SEO read more ---------- */
  function wireSeo() {
    const t = $('seo-toggle'), more = $('seo-more');
    if (!t || !more) return;
    t.addEventListener('click', () => {
      const open = more.classList.toggle('is-open');
      more.inert = !open;
      t.setAttribute('aria-expanded', open);
      t.querySelector('.seo__toggle-t').textContent = open ? 'Read less' : 'Read more';
    });
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const el = $('footer');
    if (!el) return;
    // Full-bleed, square footer that the page lifts off as you reach the end (the block is fixed under the page and
    // revealed through the wrap). Four groups — Products / Explore / Support / Contact — columns on desktop, accordion on phones.
    const contact = { title: 'Contact', links: [['We’re here to help ›', url.help], ['support@wisdomup.pk', 'mailto:support@wisdomup.pk'], ['+92 327 9800153', 'tel:+923279800153'], ['Cookie preferences', '#cookie-preferences']] };
    const groups = D.footer.map(c => ({ title: c.title, links: c.links.map(l => Array.isArray(l) ? l : [String(l), linkFor(String(l))]) })).concat(contact);
    el.innerHTML = `
      <div class="footer-fixed">
        <footer class="footer">
          <div class="footer__top">
            <a class="footer__brand" href="${url.home}" aria-label="WisdomUp home"><img src="img/wu-logo.png" alt="WisdomUp"><img src="img/wu-logo-white.png" alt="" aria-hidden="true"></a>
            <div class="footer__nl">
              <p class="footer__nl-msg">New launches and live-only deals, straight to your inbox.</p>
              <form class="newsletter"><input type="email" placeholder="Email address" aria-label="Email address"><button aria-label="Subscribe" type="submit">${icon('arrow', 18)}</button></form>
            </div>
          </div>
          <div class="footer__grid">
            ${groups.map((c, i) => `<div class="ft__group"><h4><button type="button" class="ft__q" aria-expanded="false" aria-controls="ft-g${i}"><span>${esc(c.title)}</span><span class="ft__chev">${icon('chev-r', 18)}</span></button></h4><div class="ft__links" id="ft-g${i}" hidden>${c.links.map(([t, h]) => `<a href="${h}"${here() === h ? ' aria-current="page"' : ''}>${esc(t)}</a>`).join('')}</div></div>`).join('')}
          </div>
        </footer>
        <div class="subfooter"><span>Copyright © ${YEAR} WisdomUp. All rights reserved.</span><span>Cash on Delivery · JazzCash · EasyPaisa · Bank transfer</span></div>
      </div>`;
    el.addEventListener('click', e => {
      const a = e.target.closest('.footer a[href="#"]'); if (a) e.preventDefault();
      const ck = e.target.closest('a[href="#cookie-preferences"]'); if (ck) { e.preventDefault(); if (consentUI) consentUI.open('manage'); }
    });
    // Link groups collapse into a one-open-at-a-time accordion (same behaviour as the FAQ) when the footer stacks.
    const FT_ACC = matchMedia('(max-width: 767px)');
    const groupEls = [...el.querySelectorAll('.ft__group')];
    const setGroup = open => groupEls.forEach(g => {
      const on = !FT_ACC.matches || g === open;
      g.querySelector('.ft__q').setAttribute('aria-expanded', on);
      g.querySelector('.ft__q').tabIndex = FT_ACC.matches ? 0 : -1;
      if (FT_ACC.matches) slide(g.querySelector('.ft__links'), on); else g.querySelector('.ft__links').hidden = !on;
    });
    groupEls.forEach(g => g.querySelector('.ft__q').addEventListener('click', () => {
      if (!FT_ACC.matches) return;
      const opening = g.querySelector('.ft__q').getAttribute('aria-expanded') !== 'true';
      setGroup(opening ? g : null);
      if (opening) setTimeout(() => showGroup(g), 280); // once the 250ms fold-out has its height
    }));
    // An opened group grows DOWNWARD (the footer is in the flow): if its links end below the screen, glide just far
    // enough to show them — never so far that the group's own header leaves the top.
    const showGroup = g => {
      const r = g.getBoundingClientRect(), vh = innerHeight, room = 16;
      const need = r.bottom + room - vh;
      if (need <= 0) return;
      window.scrollBy({ top: Math.min(need, Math.max(0, r.top - 96)), behavior: reduced() ? 'auto' : 'smooth' });
    };
    const current = groupEls.find(g => g.querySelector('[aria-current="page"]')) || null; // open the group for this page
    FT_ACC.addEventListener('change', () => setGroup(current));
    setGroup(current);
    el.querySelector('.newsletter').addEventListener('submit', e => {
      e.preventDefault();
      if (e.currentTarget.querySelector('input').value) el.querySelector('.footer__nl-msg').textContent = 'Thanks — you’re on the list.';
    });
    // The reveal (reworked 2026-10-06 — the old version pinned the footer to the screen bottom, so an opened accordion
    // group grew UPWARD and pushed the logo/newsletter/headers under the page): the footer stays IN the flow and is only
    // TRANSLATED while the wrap enters the screen, as if pinned to the bottom — y = (vh − R) − wrapTop, R = min(footer
    // height, vh) — and sits at y = 0 once revealed, so it grows downward like any accordion. Works at any height (a
    // footer taller than the screen reveals its top R px first). Clipped by the wrap; off for reduced motion.
    const fixed = el.querySelector('.footer-fixed');
    const canReveal = () => !reduced() && window.CSS && CSS.supports('clip-path', 'inset(0)');
    // Where the browser can run scroll-driven CSS animations (Chrome/Android 115+, Safari 26+) the same y is drawn by the
    // compositor (view timeline on the wrap, range "entry 0 → entry R", R in --ft-r) — no scroll script, no lag. Else JS.
    const sda = !!(window.CSS && CSS.supports('animation-timeline: view()') && CSS.supports('animation-range: entry 0px entry 10px'));
    el.classList.toggle('is-sda', sda);
    let raf = 0, lastY = null, lastR = null;
    // the page's bottom padding would leave a strip under the subfooter: pull the page end up to the wrap (sizes only)
    const fitGap = () => {
      el.style.marginBottom = '';
      const gap = Math.max(0, document.documentElement.scrollHeight - (el.offsetTop + el.offsetHeight));
      if (gap && gap < 120) el.style.marginBottom = (-gap) + 'px';
    };
    const place = () => {
      raf = 0;
      const on = canReveal();
      el.classList.toggle('is-reveal', on);
      if (!on) { if (lastY !== null) { fixed.style.transform = ''; lastY = null; } return; }
      // R = the CLOSED footer's height: an opened group must not change the reveal, or its growth would push the footer up
      const open = FT_ACC.matches ? groupEls.reduce((n, g) => { const l = g.querySelector('.ft__links'); return n + (l.hidden ? 0 : l.offsetHeight); }, 0) : 0;
      const vh = innerHeight, top = el.getBoundingClientRect().top, R = Math.round(Math.min(fixed.offsetHeight - open, vh));
      if (sda) { if (R !== lastR) { el.style.setProperty('--ft-r', R + 'px'); lastR = R; } return; }
      const y = Math.round(Math.max(-R, Math.min(0, (vh - R) - top)));
      if (y !== lastY) { fixed.style.transform = y ? `translate3d(0, ${y}px, 0)` : ''; lastY = y; }
    };
    const req = () => { if (!raf) raf = requestAnimationFrame(place); };
    const resized = () => { fitGap(); req(); };
    if (!sda) addEventListener('scroll', req, { passive: true });
    addEventListener('resize', resized);
    addEventListener('load', resized);
    if ('ResizeObserver' in window) new ResizeObserver(resized).observe(fixed);
    fitGap(); place();
  }

  /* ---------- Smooth in-page scrolling that clears the fixed nav + any sticky bar ---------- */
  function scrollToEl(el, extra = 20) {
    if (!el) return;
    // With a priority bar, anything at or below it lands under the stuck bar (the nav is hidden there)
    if (priorityBar()) {
      const natural = barNatural() + window.scrollY, stuck = barStuckTop();
      if (el === pBar) { window.scrollTo({ top: natural - (stuck || 12), behavior: reduced() ? 'auto' : 'smooth' }); return; } // in-flow bars land 12px below the top
      const t = el.getBoundingClientRect().top + window.scrollY;
      if (t >= natural) { window.scrollTo({ top: t - stuck - pBar.offsetHeight - extra, behavior: reduced() ? 'auto' : 'smooth' }); return; }
    }
    // Scrolling down hides the nav (sticky bars slide up to 16px); scrolling up reveals it again.
    const mobile = vw() < 640;
    const target = el.getBoundingClientRect().top + window.scrollY;
    const down = target > window.scrollY;
    const sticky = [...document.querySelectorAll('[data-sticky-offset]')].find(x => x.offsetParent !== null); // visible sticky bar only
    const topEdge = down ? (mobile ? 10 : 16) : (mobile ? 63 : 82);
    const stickyH = sticky ? sticky.getBoundingClientRect().height + 12 : 0;
    window.scrollTo({ top: target - topEdge - stickyH - extra, behavior: reduced() ? 'auto' : 'smooth' });
  }


  /* ---------- Init chrome on every page ---------- */
  let search, toTop = null;
  // Back to top: the way back to the nav (search, cart, menu) while a priority bar holds it back
  function mountToTop() {
    toTop = document.createElement('button');
    toTop.type = 'button';
    toTop.className = 'totop';
    toTop.setAttribute('aria-label', 'Back to top');
    toTop.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 19V5.5M5.5 12 12 5.5 18.5 12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
      toTop.blur();
    });
    document.body.append(toTop);
    // When the copyright band is on screen the button rides above it instead of covering it
    let raf = 0;
    const lift = () => {
      raf = 0;
      const sub = document.querySelector('.subfooter');
      const over = sub ? Math.max(0, Math.round(innerHeight - sub.getBoundingClientRect().top)) : 0;
      toTop.style.setProperty('--totop-lift', over + 'px');
    };
    const soon = () => { if (!raf) raf = requestAnimationFrame(lift); };
    window.addEventListener('scroll', soon, { passive: true });
    window.addEventListener('resize', soon);
    lift();
  }
  let menu;
  /* ---------- Motion: quiet scroll reveal (text rises 8px and un-blurs; blocks rise and fade; siblings stagger) ---------- */
  const RV_TEXT = 'h1, h2, h3, .sec-title, .eyebrow, .ihero__lede, .overview__head p, .seo__head p, .mdesc, .pbanner__copy, p, .prose li, blockquote'; // 2026-10-06: every paragraph and sub-heading too (bugatti.store)
  const RV_BLOCK = '.wpc, .tile, .post, .stat, .pd-stat, .ck__sec, .ord__card, .rv__sum, .rv__item, .faq__item, .seo__card, .duo__card, '
    + '.promo-band, .loop, .series, .bulk, .pp, .trust__item, .step, .manual, .panel-list, .cta-band, .ck__sumcard, .mgrid__more, .empty, .ord__hero, .track__form, .iform, .bk-form';
  const RV_SKIP = '#site-nav, .mnav, .cartd, .fdrawer, .search, .ckc, .hero, .buybar, .toast, .wu-util, .quick, .visually-hidden, .seo__more, .footer-wrap, label';
  let revealer = null;
  // ---------- Motion engine (MOTION-REPORT.md, approved 2026-10-06): reveals, grid staggers, scroll-driven curtain/clip, liquid fills, magnets ----------
  const FILL_SEL = '.btn-pill, .btn-buy, .btn-navy, .btn-outline, .btn-cart, .shop-rail__all, .loop__cta, .pp__cta, .seo__toggle, .fdrawer__apply, .ck__place, .cartd__go, .mnav__foot a, .nh-btn, .totop, .quick .chip, .wpc__cta, .ckc__btn, .msort__btn';
  const MAG_SEL = '.loop__btn, .feat__btn, .shop-rail__step, .hero__arrow, .pdp2__chev, .wpc__wish, .pdp2__wish, .totop, .mnav__x, .cartd__x, .fdrawer__x, .mnav__theme, .nh-tile__add, .mnav__back';
  const X_SEL = '.mnav__x, .cartd__x, .fdrawer__x';
  const SD_CLIP = '.promo, .bulk, .duo__card, .cta-band, .quote-band, .pp__card, .nh-show, .nh-glow, .nh-live, .feat__slide';
  const GRID_SEL = '.wu-rail > *, .mgrid > *, .nh-grid > *';
  const ZOOM_SEL = '.promo img, .feat__slide img, .feat__slide video, .pp__card img';
  const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
  const phone = () => matchMedia('(max-width: 639px)').matches;

  // Every word of a heading becomes its own span so the line pours in (30ms per word); markup like <b> and <a> is kept
  function splitWords(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = []; let n;
    while ((n = walker.nextNode())) if (n.textContent.trim()) nodes.push(n);
    let i = 0;
    nodes.forEach(t => {
      const frag = document.createDocumentFragment();
      t.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(part); return; }
        const m = document.createElement('span'); m.className = 'wu-wm'; // the mask: the word rises from behind the line
        const w = document.createElement('span'); w.className = 'wu-w'; w.textContent = part; w.style.setProperty('--rv-d', (250 + i++ * 30) + 'ms');
        m.append(w); frag.append(m);
      });
      t.replaceWith(frag);
    });
    return i;
  }

  // Phone sheets (< 640px): every slide-in panel (menu, filters, cart, search) is a bottom sheet that drags down to close —
  // from its header/handle, or from its list once that list is scrolled to the top (bugatti.store gesture, 2026-10-06).
  function sheetDrag(panel, close, { scroller, head } = {}) {
    if (!panel) return;
    let sy = null, sx = 0, dy = 0, axis = null, armed = false;
    panel.addEventListener('touchstart', e => {
      if (vw() >= 640) { sy = null; return; }
      sy = e.touches[0].clientY; sx = e.touches[0].clientX; dy = 0; axis = null;
      const sc = scroller && scroller();
      armed = !!(head && e.target.closest(head)) || !sc || !sc.contains(e.target) || sc.scrollTop <= 0;
    }, { passive: true });
    panel.addEventListener('touchmove', e => {
      if (sy == null || !armed || axis === 'none') return;
      const my = e.touches[0].clientY - sy, mx = e.touches[0].clientX - sx;
      if (!axis) { if (Math.abs(my) < 10 && Math.abs(mx) < 10) return; axis = my > Math.abs(mx) * 1.5 ? 'y' : 'none'; if (axis === 'none') return; }
      dy = Math.max(0, my);
      panel.classList.add('is-dragging');
      panel.style.transform = `translate3d(0, ${dy}px, 0)`;
    }, { passive: true });
    const end = () => {
      if (sy == null) return;
      const go = axis === 'y' && dy > Math.max(90, panel.offsetHeight * .15);
      panel.classList.remove('is-dragging');
      panel.style.transform = ''; // the CSS transition carries it on from the finger's position
      if (go) close();
      sy = null; axis = null; dy = 0;
    };
    panel.addEventListener('touchend', end);
    panel.addEventListener('touchcancel', end);
  }

  // A heading whose text is written after load (the All Products title) pours in the same way
  function revealWords(el) {
    if (!el || reduced() || !document.documentElement.classList.contains('wu-motion')) return;
    el.setAttribute('data-rv', 'words'); el.classList.remove('is-in');
    splitWords(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
  }

  // Accordion panels: height 250ms ease while the content fades and rises 10px (150ms, overlapping 100ms); close reverses
  function slide(panel, open) {
    if (!panel) return;
    if (panel.getAnimations) panel.getAnimations().forEach(a => a.cancel());
    if (reduced() || !panel.animate) { panel.hidden = !open; return; }
    const cs = () => getComputedStyle(panel);
    if (open) {
      panel.hidden = false;
      if (cs().display === 'none') return;
      const h = panel.scrollHeight, pt = cs().paddingTop, pb = cs().paddingBottom;
      panel.classList.add('wu-slide');
      const a = panel.animate([{ height: '0px', paddingTop: '0px', paddingBottom: '0px' }, { height: h + 'px', paddingTop: pt, paddingBottom: pb }], { duration: 250, easing: 'ease' });
      panel.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 150, delay: 100, fill: 'backwards', easing: 'ease-out' });
      a.onfinish = a.oncancel = () => panel.classList.remove('wu-slide');
    } else {
      if (panel.hidden) return;
      if (cs().display === 'none') { panel.hidden = true; return; }
      const h = panel.offsetHeight, pt = cs().paddingTop, pb = cs().paddingBottom;
      panel.classList.add('wu-slide');
      panel.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards', easing: 'ease-out' });
      const a = panel.animate([{ height: h + 'px', paddingTop: pt, paddingBottom: pb }, { height: '0px', paddingTop: '0px', paddingBottom: '0px' }], { duration: 250, easing: 'ease' });
      a.onfinish = () => { panel.hidden = true; panel.classList.remove('wu-slide'); panel.getAnimations().forEach(x => x.cancel()); };
      a.oncancel = () => panel.classList.remove('wu-slide');
    }
  }

  // Grid items enter 50px lower and fade in, 500ms ease, 100ms apart (phones 30px / 300ms / 50ms) — used when a tab swaps its cards
  function staggerCards(container) {
    if (!container) return;
    const items = [...container.children];
    items.forEach(el => el.classList.add('is-in'));
    if (reduced() || !container.animate) return;
    const H = innerHeight, W = innerWidth;
    const d = phone() ? 30 : 50, t = phone() ? 300 : 500, gap = phone() ? 50 : 100;
    let k = 0;
    items.forEach(el => {
      const b = el.getBoundingClientRect();
      if (b.top > H || b.bottom < 0 || b.left > W || b.right < 0) return;
      el.animate([{ opacity: 0, transform: `translateY(${d}px)` }, { opacity: 1, transform: 'none' }], { duration: t, delay: k++ * gap, easing: 'ease', fill: 'backwards' });
    });
  }

  function initMotion() {
    if (reduced() || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('wu-motion');
    const isFine = fine();
    revealer = new IntersectionObserver(entries => {
      const byParent = new Map();
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const list = byParent.get(e.target.parentElement) || [];
        list.push(e.target);
        byParent.set(e.target.parentElement, list);
      });
      byParent.forEach(list => list.forEach((el, i) => {
        if (el.dataset.rv === 'grid') el.style.setProperty('--rv-d', Math.min(i, 12) * (phone() ? 50 : 100) + 'ms');
        el.classList.add('is-in');
        revealer.unobserve(el);
      }));
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    const kindOf = el => {
      if (el.matches(ZOOM_SEL)) return 'zoom';
      if (el.matches(GRID_SEL)) return 'grid';
      if (el.matches('h1, h2, .sec-title')) {
        const cs = getComputedStyle(el);
        if (el.querySelector('img, svg, button, input')) return 'up-large';
        if (cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text') {
          // a gradient that is really one colour (the heading token since the 2026-10-06 colour scheme) can split: paint it flat
          const stops = (cs.backgroundImage.match(/rgba?\([^)]+\)/g) || []);
          if (stops.length && stops.every(c => c === stops[0])) { el.classList.add('wu-flat'); return 'words'; }
          return 'up-large'; // a real multi-colour gradient (gold names) moves as one piece
        }
        return 'words';
      }
      return 'up';
    };
    const mark = root => {
      if (!root.querySelectorAll) return;
      const add = el => {
        // once per element; never inside fixed chrome; never inside something that already reveals (no double fades); banners open by scroll instead
        if (el.hasAttribute('data-rv') || el.closest(RV_SKIP) || (el.parentElement && el.parentElement.closest('[data-rv]')) || el.matches(SD_CLIP)) return;
        const kind = kindOf(el);
        if (kind === 'zoom' && getComputedStyle(el.parentElement).overflow !== 'hidden') { el.setAttribute('data-rv', 'up'); revealer.observe(el); return; }
        if (kind === 'words') splitWords(el);
        el.setAttribute('data-rv', kind);
        revealer.observe(el);
      };
      const pick = sel => { if (root.matches && root.matches(sel)) add(root); root.querySelectorAll(sel).forEach(add); };
      pick(ZOOM_SEL);
      pick(GRID_SEL);
      pick(RV_BLOCK + ', .nh-tile, .nh-feat, .nh-strip a, .nh-chips');
      pick(RV_TEXT + ', .nh-h, .nh-sub');
      // liquid fills and magnets (pointer devices only)
      if (isFine) {
        const q = sel => [...(root.matches && root.matches(sel) ? [root] : []), ...root.querySelectorAll(sel)];
        q(FILL_SEL).forEach(b => { if (!b.closest('#site-nav') && b.querySelector('svg, img') === null || b.matches('.btn-buy, .btn-cart, .btn-pill, .btn-navy, .btn-outline, .shop-rail__all, .seo__toggle, .pp__cta, .mnav__foot a, .nh-btn, .loop__cta, .fdrawer__apply, .ck__place, .cartd__go, .totop, .quick .chip, .wpc__cta, .ckc__btn, .msort__btn')) b.classList.add('wu-fill'); });
        q(MAG_SEL).forEach(b => { b.classList.add('wu-mag'); if (b.matches(X_SEL)) b.classList.add('is-x'); });
      }
      collect(root);
    };
    // Scroll-driven pieces: the footer slides into place under a lifting curtain; banners open from a clipped centre
    const sd = [];
    const collect = root => {
      if (!root.querySelectorAll) return;
      [...(root.matches && root.matches(SD_CLIP) ? [root] : []), ...root.querySelectorAll(SD_CLIP)].forEach(el => {
        if (el.dataset.sd || el.closest(RV_SKIP)) return;
        el.dataset.sd = 'clip';
        el.style.setProperty('--sd-r', (parseFloat(getComputedStyle(el).borderTopLeftRadius) || 24) + 'px');
        sd.push(el);
      });
      const f = document.querySelector('.footer-wrap');
      if (f && !f.dataset.sd) { f.dataset.sd = 'footer'; sd.push(f); }
    };
    const drive = () => {
      const vh = innerHeight;
      sd.forEach(el => {
        if (!el.isConnected) return;
        const b = el.getBoundingClientRect();
        if (el.dataset.sd === 'footer') {
          const p = Math.max(0, Math.min(1, (vh - b.top) / Math.max(1, Math.min(b.height, vh) * .9)));
          el.style.setProperty('--sd-p', p.toFixed(3));
          return;
        }
        const p = Math.max(0, Math.min(1, (vh - b.top) / Math.max(1, Math.min(b.height, vh * .6))));
        if (p >= 1) { if (el.classList.contains('is-clipping')) { el.classList.remove('is-clipping'); el.style.removeProperty('--sd-q'); } return; }
        el.classList.add('is-clipping');
        el.style.setProperty('--sd-q', (1 - p).toFixed(3));
      });
    };
    mark(document.body);
    // Safety net: also reveal by position on scroll/resize, so content can never stay invisible
    // (e.g. embedded previews where the browser doesn't report visibility)
    let tick = 0;
    const sweep = () => {
      tick = 0;
      const H = innerHeight, W = innerWidth;
      document.querySelectorAll('[data-rv]:not(.is-in)').forEach(el => {
        const b = el.getBoundingClientRect();
        if (b.top < H && b.left < W && b.right > 0) { el.classList.add('is-in'); revealer.unobserve(el); } // in view or already scrolled past
      });
      drive();
    };
    const soon = () => { if (!tick) tick = requestAnimationFrame(sweep); };
    window.addEventListener('scroll', soon, { passive: true });
    window.addEventListener('resize', soon);
    document.addEventListener('scroll', soon, { passive: true, capture: true }); // horizontal rails
    requestAnimationFrame(() => requestAnimationFrame(sweep));
    setTimeout(sweep, 900);
    // Content rendered later (filters, "Show more", reviews, rails) reveals the same way
    let queued = [];
    new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) queued.push(n); }));
      if (queued.length) requestAnimationFrame(() => { const q = queued; queued = []; q.forEach(n => n.isConnected && mark(n)); setTimeout(sweep, 700); });
    }).observe(document.body, { childList: true, subtree: true });
    if (!isFine) return;
    // EVERY button gets the liquid fill (2026-10-06, both themes, every page): besides the named classes above, any button or
    // link is checked the first time the pointer enters it — a capsule/circle with its own fill or edge, or a small button
    // sitting inside such a capsule (chips in the filter capsule, product tabs, qty − / +, the newsletter arrow, segments).
    // Lazy, so drawers, menus and popups that were hidden at load are covered. Never: the nav (its tools have no hover by
    // rule), switches, slider dots, swatches, thumbnails. Colours are worked out on every enter from what the button sits on.
    const AUTO_SEL = 'button, a, [role="button"], [role="tab"], summary';
    const AUTO_SKIP = '#site-nav, .site-nav, .mfloat, [role="switch"], .dot, .dots, .wpc__swatch, .thumb, .nh-show__thumb, .hero__bar, [data-no-fill]';
    const rgbOf = s => (String(s).match(/[\d.]+/g) || []).map(Number);
    const lumOf = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
    const solid = s => { const v = rgbOf(s); return v.length >= 3 && (v.length < 4 || v[3] > .5) ? v.slice(0, 3) : null; };
    const surfaced = cs => { const bg = rgbOf(cs.backgroundColor), bd = rgbOf(cs.borderTopColor);
      return (bg.length >= 3 && (bg.length < 4 || bg[3] > .04)) || /gradient/.test(cs.backgroundImage) || (parseFloat(cs.borderTopWidth) > 0 && (bd.length < 4 || bd[3] > .04)) || /inset/.test(cs.boxShadow); };
    const backdrop = el => { for (let e = el; e && e !== document.documentElement; e = e.parentElement) { const c = getComputedStyle(e); const v = solid(c.backgroundColor); if (v) return v; const g = /gradient/.test(c.backgroundImage) && c.backgroundImage.match(/rgba?\([^)]+\)/); if (g && solid(g[0])) return solid(g[0]); } return isNight() ? [15, 17, 19] : [255, 255, 255]; };
    const fillChecked = new WeakSet();
    const autoMark = b => {
      if (!b.matches(AUTO_SEL) || b.closest(AUTO_SKIP) || b.disabled) return;
      const r = b.getBoundingClientRect();
      if (r.height < 20 || r.height > 72 || r.width < 20) return;
      const cs = getComputedStyle(b);
      const round = parseFloat(cs.borderTopLeftRadius) >= r.height / 2 - 1, own = surfaced(cs);
      let inCapsule = false;
      if (!(round && own)) for (let p = b.parentElement, i = 0; p && i < 3; p = p.parentElement, i++) {
        const pr = p.getBoundingClientRect(), pc = getComputedStyle(p);
        if (pr.height >= r.height && pr.height <= 90 && parseFloat(pc.borderTopLeftRadius) >= pr.height / 2 - 1 && surfaced(pc)) { inCapsule = true; break; }
      }
      if (!(round && own) && !inCapsule) return;
      for (const k of b.children) { const kr = k.getBoundingClientRect(); if (kr.width && (kr.left < r.left - 1 || kr.right > r.right + 1 || kr.top < r.top - 1 || kr.bottom > r.bottom + 1)) return; } // never clip a badge
      if (cs.position !== 'static') b.style.position = cs.position; // keep absolute/fixed buttons where they are
      if (!round) b.style.borderRadius = '999px';                   // an inner square button fills as a circle
      const hasOwn = cs.transitionDuration.split(',').some(d => parseFloat(d) > 0); // keep the button's own transitions, add the colour swap
      b.style.transition = (hasOwn ? cs.transition + ', ' : '') + 'color 500ms cubic-bezier(.3,1,.3,1) 100ms';
      b.dataset.fillAuto = '';
      b.classList.add('wu-fill');
    };
    const autoColours = b => {
      const cs = getComputedStyle(b), own = solid(cs.backgroundColor), under = backdrop(b.parentElement), bg = own || under;
      const chroma = Math.max(...bg) - Math.min(...bg);
      if (lumOf(bg) < .45) { // dark or coloured: white rises, text keeps the button's colour (or ink); a ring keeps its edge on a light page
        b.style.setProperty('--fill', '#fff');
        b.style.setProperty('--fill-text', own && chroma > 60 ? `rgb(${bg.join(',')})` : '#0B0B0B');
        b.style.setProperty('--fill-ring', own && lumOf(under) > .6 ? `rgb(${bg.join(',')})` : 'transparent');
      } else { b.style.setProperty('--fill', '#0B0B0B'); b.style.setProperty('--fill-text', '#fff'); b.style.setProperty('--fill-ring', 'transparent'); }
    };
    // Liquid fill: on enter the circle starts below (+76%) and rises to 0; on leave it carries on upward (−76%)
    document.addEventListener('pointerenter', e => {
      const b = e.target;
      if (!(b instanceof Element) || e.pointerType === 'touch') return;
      if (!b.classList.contains('wu-fill') && !fillChecked.has(b)) { fillChecked.add(b); autoMark(b); }
      if (b.classList.contains('wu-fill') && b.hasAttribute('data-fill-auto')) autoColours(b);
      if (b.classList.contains('wu-fill')) {
        b.classList.add('wu-fill--snap'); b.style.setProperty('--fill-y', '76%');
        void b.offsetWidth;
        b.classList.remove('wu-fill--snap'); b.style.setProperty('--fill-y', '0%');
      }
    }, true);
    document.addEventListener('pointerleave', e => {
      const b = e.target;
      if (!(b instanceof Element) || e.pointerType === 'touch') return;
      if (b.classList.contains('wu-fill')) b.style.setProperty('--fill-y', '-76%');
      if (b === magEl) { magReset(); magEl = null; }
    }, true);
    // Magnet: the icon follows the pointer by (offset − ½) × strength (10px) and springs back on leave
    let magEl = null;
    const magReset = () => { if (!magEl) return; magEl.style.setProperty('--mag-t', '900ms'); magEl.style.setProperty('--mx', '0px'); magEl.style.setProperty('--my', '0px'); };
    document.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      const m = e.target.closest && e.target.closest('.wu-mag');
      if (m !== magEl) { magReset(); magEl = m; if (m) m.style.setProperty('--mag-t', '400ms'); }
      if (!m) return;
      const r = m.getBoundingClientRect(), k = +(m.dataset.magnet || 10);
      m.style.setProperty('--mx', (((e.clientX - r.left) / r.width - .5) * k).toFixed(1) + 'px');
      m.style.setProperty('--my', (((e.clientY - r.top) / r.height - .5) * k).toFixed(1) + 'px');
    }, { passive: true });
  }

  function initChrome({ active = null } = {}) {
    activeCat = active;
    renderUtility();
    renderNav(true);
    renderTrust();
    renderFooter();
    wireSeo();
    search = mountSearch();
    menu = mountMenu();
    paintThemeBtns(); // the menu panel's day/night button
    cartUI = mountCart();
    qaddUI = mountQuickAdd();
    consentUI = mountConsent();
    initMotion();
    mountToTop();
    runEdges();
    faqFromPage();
    // A floating capsule ([data-edge], e.g. the All Products filters' twin) glows only while its bar is away
    document.querySelectorAll('[data-edge]').forEach(cap => addEdge(cap, () => !!pBar && pBar.classList.contains('is-stuck')));
    if (nav) nav.addEventListener('click', e => {
      const a = e.target.closest('[data-act]');
      if (!a) return;
      if (a.dataset.act === 'search') search.open();
      if (a.dataset.act === 'menu') menu.open(a);
      if (a.dataset.act === 'bag') cartUI.open(a);
      if (a.dataset.act === 'account') toast('Accounts are coming soon');
    });
    window.addEventListener('resize', () => { renderNav(); placeNav(); });
    window.addEventListener('scroll', placeNav, { passive: true });
    placeNav();
  }

  /* ---------- Cart panel: slides in from the right (the menu owns the left) ---------- */
  function mountCart() {
    const el = document.createElement('div');
    el.innerHTML = `
      <div class="cartd-scrim" hidden></div>
      <aside class="cartd" id="cartd" role="dialog" aria-modal="true" aria-labelledby="cartd-h" hidden>
        <header class="cartd__head">
          <h2 id="cartd-h">Your cart <span id="cartd-n"></span></h2>
          <button type="button" class="cartd__x mnav__x" aria-label="Close cart"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg></button>
        </header>
        <div class="cartd__ship" id="cartd-ship"></div>
        <div class="cartd__body" id="cartd-body"></div>
        <footer class="cartd__foot" id="cartd-foot">
          <label class="cartd__gift"><input type="checkbox" id="cartd-gift"><span>Add gift wrapping</span><b>${esc(D.rs(SHOP.giftWrap))}</b></label>
          <div class="cartd__row"><span>Subtotal</span><b id="cartd-sub"></b></div>
          <p class="cartd__note">Delivery and payment are chosen at checkout · Cash on Delivery available</p>
          <a class="btn-buy cartd__go" href="checkout.html" id="cartd-go">Checkout</a>
        </footer>
      </aside>`;
    document.body.append(...el.children);
    const drawer = $('cartd'), scrim = drawer.previousElementSibling;
    let opener = null;
    const qtyBtns = l => `<div class="qty qty--s" role="group" aria-label="Quantity for ${esc(l.p.code)}"><button type="button" data-q="-1" data-sku="${esc(l.sku)}" aria-label="Decrease">−</button><output>${l.qty}</output><button type="button" data-q="1" data-sku="${esc(l.sku)}" aria-label="Increase"${l.qty >= SHOP.maxQty ? ' disabled' : ''}>+</button></div>`;
    function paint() {
      const lines = cartLines(), t = cartTotals('standard'), n = cartCount();
      $('cartd-n').textContent = n ? `(${n})` : '';
      const left = SHOP.freeDeliveryFrom - t.subtotal;
      $('cartd-ship').innerHTML = !lines.length ? '' : left > 0
        ? `<p>Add <b>${esc(D.rs(left))}</b> more for free standard delivery</p><i style="--pct: ${Math.min(100, Math.round(t.subtotal / SHOP.freeDeliveryFrom * 100))}%;"></i>`
        : '<p><b>Free standard delivery</b> unlocked</p><i style="--pct: 100%;"></i>';
      $('cartd-body').innerHTML = lines.length ? lines.map(l => `
        <div class="cline">
          <a class="cline__img" href="${url.product(l.p.id)}${l.p.variants.length ? '&sku=' + encodeURIComponent(l.sku) : ''}" style="background: ${photoBg(l.v.bg ? l.v : l.p)};"><img src="${l.v.thumb || l.p.thumb}" alt="" style="${photoFit(l.v.ar ? l.v : l.p)}"></a>
          <div class="cline__info">
            <a class="cline__t" href="${url.product(l.p.id)}">${esc(l.p.title)}</a>
            ${Object.keys(l.attrs).length ? `<span class="cline__a">${esc(Object.values(l.attrs).join(' · '))}</span>` : ''}
            <span class="cline__p">${esc(D.rs(l.price))}${l.qty > 1 ? ` <small>× ${l.qty} = ${esc(D.rs(l.total))}</small>` : ''}</span>
            <div class="cline__row">${qtyBtns(l)}<button type="button" class="cline__rm" data-rm="${esc(l.sku)}">Remove</button></div>
          </div>
        </div>`).join('')
        : `<div class="cartd__empty">${icon('bag', 28)}<b>Your cart is empty</b><p>Earbuds, chargers, cables and more — delivered across Pakistan.</p><a class="btn-pill" href="${url.products}">Shop all products</a></div>`;
      $('cartd-foot').hidden = !lines.length;
      $('cartd-gift').checked = giftWrap;
      $('cartd-sub').textContent = D.rs(t.subtotal + t.giftWrap);
      $('cartd-go').textContent = `Checkout · ${D.rs(t.subtotal + t.giftWrap)}`;
    }
    function open(btn) {
      opener = btn || document.activeElement;
      paint();
      drawer.hidden = scrim.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      requestAnimationFrame(() => { drawer.classList.add('is-open'); scrim.classList.add('is-open'); });
      setTimeout(() => drawer.querySelector('.cartd__x').focus(), 60);
    }
    function close() {
      drawer.classList.remove('is-open'); scrim.classList.remove('is-open');
      document.documentElement.style.overflow = '';
      const done = () => { drawer.hidden = scrim.hidden = true; if (opener && opener.isConnected) opener.focus(); };
      if (reduced()) done(); else setTimeout(done, 850);
    }
    drawer.addEventListener('click', e => {
      if (e.target.closest('.cartd__x')) return close();
      const q = e.target.closest('[data-q]');
      if (q) { const l = cart.find(x => x.sku === q.dataset.sku); if (l) setQty(l.sku, l.qty + +q.dataset.q); return; }
      const rm = e.target.closest('[data-rm]');
      if (rm) { setQty(rm.dataset.rm, 0); toast('Removed from cart'); }
    });
    $('cartd-gift').addEventListener('change', e => setGift(e.target.checked));
    scrim.addEventListener('click', close);
    sheetDrag(drawer, close, { scroller: () => $('cartd-body'), head: '.cartd__head' });
    drawer.addEventListener('keydown', e => {
      if (e.key === 'Escape') return close();
      if (e.key !== 'Tab') return;
      const f = [...drawer.querySelectorAll('a[href], button:not([disabled]), input')].filter(x => x.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    window.addEventListener('wu-cart', () => { if (!drawer.hidden) paint(); });
    return { open, close, paint };
  }

  /* ---------- Menu drawer (burger, narrow nav): slides in from the left like the Filters panel.
     Built from the catalogue, so new categories and products appear without editing this. ---------- */
  // ---------- Quick options panel (2026-10-06): "Choose" on a product card with options opens this instead of leaving the
  // page. Same shell and motion as the cart/menu (right drawer ≥640px, bottom sheet + drag on phones, 600/800/500ms) and the
  // menu's block glide; pick Plug / Cable / Connector / Capacity / Length, set a quantity, add to cart (the cart then opens).
  function mountQuickAdd() {
    const AXIS_HINT = { Plug: 'EU 2-pin fits most sockets in Pakistan', Cable: 'Cable included in the box' };
    const el = document.createElement('div');
    el.innerHTML = `
      <div class="cartd-scrim qadd-scrim" hidden></div>
      <aside class="cartd qadd" id="qadd" role="dialog" aria-modal="true" aria-labelledby="qadd-h" hidden>
        <header class="cartd__head">
          <h2 id="qadd-h">Choose options</h2>
          <button type="button" class="cartd__x mnav__x qadd__x" aria-label="Close options"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>
        </header>
        <div class="cartd__body qadd__body" id="qadd-body"></div>
        <footer class="cartd__foot qadd__foot">
          <div class="qty qty--s" role="group" aria-label="Quantity"><button type="button" data-q="-1" aria-label="Fewer">−</button><output id="qadd-qty">1</output><button type="button" data-q="1" aria-label="More">+</button></div>
          <button type="button" class="btn-buy qadd__go" id="qadd-go">Add to cart</button>
        </footer>
      </aside>`;
    document.body.append(...el.children);
    const panel = $('qadd'), scrim = panel.previousElementSibling, body = $('qadd-body');
    let p = null, V = [], cur = 0, qty = 1, opener = null, hideT = 0, glides = [];
    const values = a => V.map(v => v.attrs[a]).filter((x, i, arr) => x && arr.indexOf(x) === i);
    const pick = (axis, val) => {
      const want = { ...V[cur].attrs, [axis]: val };
      const i = V.findIndex(v => Object.keys(want).every(k => v.attrs[k] === want[k]));
      return i >= 0 ? i : V.findIndex(v => v.attrs[axis] === val);
    };
    const available = (axis, val) => V.some(v => v.attrs[axis] === val && p.axes.every(k => k === axis || v.attrs[k] === V[cur].attrs[k]));
    const paint = () => {
      const v = V[cur];
      $('qadd-img').src = v.img || p.src;
      $('qadd-img').style.objectFit = ((v.ar || p.ar || 1) >= 2.1) ? 'contain' : 'cover'; // as on the card: wide shots fit, the rest fill
      $('qadd-media').style.background = photoBg(v.bg ? v : p);
      $('qadd-sku').textContent = v.sku;
      $('qadd-price').textContent = v.priceText || D.rs(v.price);
      $('qadd-was').textContent = v.wasText || '';
      $('qadd-off').textContent = v.off ? v.off + '% off' : '';
      body.querySelectorAll('.qadd__opt').forEach(box => {
        const a = box.dataset.axis;
        box.querySelector('[data-cur]').textContent = v.attrs[a];
        box.querySelectorAll('.opt-chip').forEach(c => { c.setAttribute('aria-checked', c.dataset.val === v.attrs[a]); c.classList.toggle('is-na', !available(a, c.dataset.val)); });
      });
      $('qadd-qty').textContent = qty;
      panel.querySelector('[data-q="-1"]').disabled = qty <= 1;
      panel.querySelector('[data-q="1"]').disabled = qty >= (SHOP.maxQty || 10);
      $('qadd-go').textContent = `Add to cart · ${D.rs(v.price * qty)}`;
    };
    function open(prod, btn, sku) {
      p = prod; V = p.variants && p.variants.length ? p.variants : [{ sku: p.code, attrs: {}, price: p.price, was: p.was, wasText: p.wasText, off: p.off, img: p.src, thumb: p.thumb, bg: p.bg }];
      cur = Math.max(0, V.findIndex(v => v.sku === sku)); qty = 1; opener = btn || document.activeElement; // the card's chosen option, if any
      body.innerHTML = `
        <div class="qadd__media" id="qadd-media"><img id="qadd-img" src="" alt="${esc(p.title)}"></div>
        <div class="qadd__info">
          <div class="qadd__kicker">${esc(typeLabel(p.type))} · Model <b id="qadd-sku"></b></div>
          <h3 class="qadd__title"><a href="${url.product(p.id)}">${esc(p.title)}</a></h3>
          <div class="qadd__prices"><span class="qadd__price" id="qadd-price"></span><s class="qadd__was" id="qadd-was"></s><span class="qadd__off" id="qadd-off"></span></div>
        </div>
        ${(p.axes || []).map(a => `<div class="qadd__opt" data-axis="${esc(a)}">
          <div class="qadd__label">${esc(a)}: <span data-cur></span>${AXIS_HINT[a] ? `<small>${esc(AXIS_HINT[a])}</small>` : ''}</div>
          <div class="opt-chips" role="radiogroup" aria-label="${esc(a)}">${values(a).map(val => `<button type="button" class="opt-chip" role="radio" data-val="${esc(val)}">${esc(val)}</button>`).join('')}</div>
        </div>`).join('')}
        <a class="qadd__more" href="${url.product(p.id)}">View full details ${icon('chev-r', 16)}</a>`;
      paint();
      clearTimeout(hideT);
      panel.hidden = scrim.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      requestAnimationFrame(() => { panel.classList.add('is-open'); scrim.classList.add('is-open'); glide(); });
      setTimeout(() => panel.querySelector('.qadd__x').focus(), 60);
    }
    // the menu's block glide: each block slides in from −20px, 600ms, 100ms apart
    const glide = () => {
      glides.forEach(a => a.cancel()); glides = [];
      if (reduced() || !body.animate) return;
      [...body.children, panel.querySelector('.qadd__foot')].forEach((b, i) => glides.push(b.animate([{ transform: 'translateX(-20px)' }, { transform: 'translateX(0)' }],
        { duration: 600, delay: Math.min(i * 100, 700), easing: 'cubic-bezier(.075,.82,.165,1)', fill: 'backwards' })));
    };
    function close(after) {
      panel.classList.remove('is-open'); scrim.classList.remove('is-open');
      document.documentElement.style.overflow = '';
      const done = () => { panel.hidden = scrim.hidden = true; panel.style.transform = ''; if (typeof after === 'function') after(); else if (opener && opener.isConnected) opener.focus({ preventScroll: true }); };
      if (reduced()) done(); else hideT = setTimeout(done, 850);
    }
    panel.addEventListener('click', e => {
      if (e.target.closest('.qadd__x')) return close();
      const c = e.target.closest('.opt-chip');
      if (c) { const i = pick(c.closest('.qadd__opt').dataset.axis, c.dataset.val); if (i >= 0) { cur = i; paint(); } return; }
      const q = e.target.closest('[data-q]');
      if (q) { qty = Math.max(1, Math.min(SHOP.maxQty || 10, qty + +q.dataset.q)); paint(); return; }
      if (e.target.closest('#qadd-go') && p) {
        const id = p.id, n = qty, sku = V[cur].sku;
        close(() => {});
        setTimeout(() => add(id, n, sku, { open: true }), reduced() ? 0 : 300); // the options sheet leaves, then the cart arrives
      }
    });
    scrim.addEventListener('click', () => close());
    panel.addEventListener('keydown', e => {
      if (e.key === 'Escape') return close();
      if (e.key !== 'Tab') return;
      const f = [...panel.querySelectorAll('a[href], button:not([disabled])')].filter(x => x.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    sheetDrag(panel, () => close(), { scroller: () => body, head: '.cartd__head' });
    return { open, close };
  }
  let qaddUI = null;

  // ---------- Cookie choices (2026-10-06, layout copied from formula1.com's consent popup) ----------
  // Layer 1 (notice): logo, uppercase heading, the facts, a hairline, two red capsules (Essential only / Accept all) and an
  // outlined "Manage settings". Layer 2 (manage): left heading, the two red capsules, one row per category (switch +
  // chevron that folds out the details), "Go back" / "Save choices". Centred modal ≥640px, bottom sheet on phones; no
  // close ×, no scrim or drag dismissal — a choice is required. Everything said here must stay true: the shop's own
  // storage is local (cart, wishlist, orders, reviews, checkout details, theme, grid view); the ONLY cookies are the
  // Meta Pixel's, and it loads only with marketing allowed. The footer's "Cookie preferences" opens layer 2 again.
  function mountConsent() {
    const LOGO = '<div class="ckc__logo"><img src="img/wu-logo.png" alt="WisdomUp"><img src="img/wu-logo-white.png" alt="" aria-hidden="true"></div>';
    const CATS = [
      { id: 'essential', name: 'Essential', always: true, desc: 'Your cart, wishlist, orders placed from this device, reviews you wrote, saved checkout details and display choices (day or night, grid view). Kept in this browser only and never shared with advertisers. The shop cannot work without it, so it is always on.' },
      { id: 'marketing', name: 'Marketing', desc: 'Meta Pixel (Facebook and Instagram). It records page views, searches, add-to-cart and purchases — the product, price and quantity, never your name, phone number or address — so we can measure our ads and show them to people who have visited the shop. It sets Meta cookies in this browser.' },
    ];
    const el = document.createElement('div');
    el.className = 'ckc'; el.id = 'ckc'; el.hidden = true;
    el.innerHTML = `
      <div class="ckc__scrim"></div>
      <section class="ckc__box" role="dialog" aria-modal="true" aria-labelledby="ckc-h1" tabindex="-1">
        <div class="ckc__layer" data-layer="notice">
          <div class="ckc__scroll">
            ${LOGO}
            <h2 class="ckc__h" id="ckc-h1">Your cookie choices on this site</h2>
            <div class="ckc__text">
              <p>WisdomUp keeps your cart, wishlist, orders and saved checkout details in this browser. That storage is <b>essential</b> — the shop needs it to work — so it can’t be switched off.</p>
              <p>With your permission we also use <b>marketing cookies</b> from Meta to:</p>
              <ul><li>Measure which Facebook and Instagram ads bring visits and orders.</li><li>Show our ads to people who have visited the shop.</li></ul>
              <p>Select ‘Accept all’ to allow marketing cookies, or ‘Essential only’ to keep them off. To decide category by category, select ‘Manage settings’. You can change your choice at any time from ‘Cookie preferences’ at the foot of every page.</p>
            </div>
          </div>
          <div class="ckc__acts">
            <button type="button" class="ckc__btn ckc__btn--red" data-ck="essential">Essential only</button>
            <button type="button" class="ckc__btn ckc__btn--red" data-ck="all">Accept all</button>
            <button type="button" class="ckc__btn ckc__btn--line ckc__btn--wide" data-ck="manage">Manage settings</button>
          </div>
        </div>
        <div class="ckc__layer" data-layer="manage" hidden>
          <div class="ckc__scroll">
            ${LOGO}
            <h2 class="ckc__h ckc__h--left" id="ckc-h2">Manage your choices</h2>
            <div class="ckc__text"><p>Switch marketing cookies on or off below, then select ‘Save choices’. Essential storage stays on because the cart, wishlist and checkout depend on it. Open a category to see exactly what it does.</p></div>
            <div class="ckc__quick">
              <button type="button" class="ckc__btn ckc__btn--red" data-ck="essential">Essential only</button>
              <button type="button" class="ckc__btn ckc__btn--red" data-ck="all">Accept all</button>
            </div>
            <ul class="ckc__cats">${CATS.map(c => `
              <li class="ckc__cat">
                <div class="ckc__row">
                  <span class="ckc__name" id="ckc-n-${c.id}">${c.name}</span>
                  ${c.always ? '<span class="ckc__always">Always on</span>' : `<button type="button" class="ckc__switch" role="switch" aria-checked="false" aria-labelledby="ckc-n-${c.id}" data-cat="${c.id}"><i></i></button>`}
                  <button type="button" class="ckc__more" aria-expanded="false" aria-controls="ckc-d-${c.id}" aria-label="About ${c.name.toLowerCase()} cookies">${icon('chev-r', 18)}</button>
                </div>
                <div class="ckc__desc" id="ckc-d-${c.id}" hidden><p>${c.desc}</p></div>
              </li>`).join('')}
            </ul>
          </div>
          <div class="ckc__acts ckc__acts--foot">
            <button type="button" class="ckc__btn ckc__btn--line" data-ck="back">Go back</button>
            <button type="button" class="ckc__btn ckc__btn--line" data-ck="save">Save choices</button>
          </div>
        </div>
      </section>`;
    document.body.append(el);
    const box = el.querySelector('.ckc__box'), sw = el.querySelector('.ckc__switch');
    const layers = { notice: el.querySelector('[data-layer="notice"]'), manage: el.querySelector('[data-layer="manage"]') };
    let layer = 'notice', hideT = 0, opener = null, anims = [];
    const setSwitch = on => sw.setAttribute('aria-checked', on);
    // the blocks of a layer rise in one after another (the menu's glide curve, 100ms apart)
    const glide = (root, from = 'translate3d(0, 16px, 0)') => {
      anims.forEach(a => a.cancel()); anims = [];
      if (reduced() || !root.animate) return;
      const blocks = [...root.querySelector('.ckc__scroll').children, root.querySelector('.ckc__acts')];
      blocks.forEach((b, i) => anims.push(b.animate([{ opacity: 0, transform: from }, { opacity: 1, transform: 'none' }],
        { duration: 600, delay: Math.min(i * 100, 700), easing: 'cubic-bezier(.075,.82,.165,1)', fill: 'backwards' })));
    };
    const show = name => {
      const prev = layers[layer], next = layers[name];
      layer = name;
      box.setAttribute('aria-labelledby', name === 'notice' ? 'ckc-h1' : 'ckc-h2');
      if (prev !== next) {
        prev.hidden = true; next.hidden = false;
        next.querySelector('.ckc__scroll').scrollTop = 0;
        glide(next, name === 'manage' ? 'translate3d(30px, 0, 0)' : 'translate3d(-30px, 0, 0)');
      }
      box.focus({ preventScroll: true }); // the dialog itself, not a button — so no focus ring appears on a button nobody tabbed to
    };
    function open(name = 'notice') {
      clearTimeout(hideT);
      opener = document.activeElement;
      setSwitch(marketingOK());
      layers.notice.hidden = name !== 'notice'; layers.manage.hidden = name !== 'manage'; layer = name;
      box.setAttribute('aria-labelledby', name === 'notice' ? 'ckc-h1' : 'ckc-h2');
      el.querySelectorAll('.ckc__more').forEach(b => { b.setAttribute('aria-expanded', 'false'); $(b.getAttribute('aria-controls')).hidden = true; });
      el.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('is-open'); glide(layers[name]); }));
      setTimeout(() => box.focus({ preventScroll: true }), 80); // focus the dialog (announced by screen readers); Tab reaches the buttons
    }
    function close() {
      el.classList.remove('is-open');
      document.documentElement.style.overflow = '';
      const done = () => { el.hidden = true; if (opener && opener.isConnected && opener !== document.body) opener.focus({ preventScroll: true }); };
      if (reduced()) done(); else hideT = setTimeout(done, 850);
    }
    const save = marketing => {
      const was = marketingOK();
      try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ v: 1, marketing: !!marketing, at: new Date().toISOString() })); } catch (e) {}
      if (marketing) loadPixel();
      else if (was && window.fbq) window.fbq('consent', 'revoke');
      close();
      toast(marketing ? 'Cookie choices saved — marketing cookies on' : 'Cookie choices saved — essential only');
    };
    el.addEventListener('click', e => {
      const more = e.target.closest('.ckc__more');
      if (more) { const on = more.getAttribute('aria-expanded') !== 'true'; more.setAttribute('aria-expanded', on); slide($(more.getAttribute('aria-controls')), on); return; }
      if (e.target.closest('.ckc__switch')) { setSwitch(sw.getAttribute('aria-checked') !== 'true'); return; }
      const b = e.target.closest('[data-ck]');
      if (!b) return;
      const k = b.dataset.ck;
      if (k === 'all') save(true);
      else if (k === 'essential') save(false);
      else if (k === 'save') save(sw.getAttribute('aria-checked') === 'true');
      else if (k === 'manage') show('manage');
      else if (k === 'back') { if (consentGet() && layer === 'manage' && opener && opener.closest && opener.closest('.footer')) close(); else show('notice'); }
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'Escape' && layer === 'manage') { e.preventDefault(); el.querySelector('[data-ck="back"]').click(); return; }
      if (e.key !== 'Tab') return;
      const f = [...layers[layer].querySelectorAll('button')].filter(x => x.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (document.activeElement === box) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    if (!consentGet()) setTimeout(() => open('notice'), 700); // first visit: ask once the page has painted
    return { open, close, get: consentGet };
  }
  let consentUI = null;
  const quickAdd = (id, btn) => { const p = D.byId(id); if (!p || p.soldOut) return false; if (!(p.variants && p.variants.length > 1) || !qaddUI) { add(id); return true; } qaddUI.open(p, btn); return true; };

  function mountMenu() {
    const chev = '<svg class="mnav__chev" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5.5 9l6.5 6.5L18.5 9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const arrow = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 5.5 15.5 12 9 18.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const STAND = { d: 'M8.5 2.5h7a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 13V4a1.5 1.5 0 0 1 1.5-1.5zM8.5 4v9h7V4z', s: 'M12 14.5v4.5M7 21h10', w: 2 };
    const DEPT_ICON = { audio: 'Earbuds', charging: 'Chargers', cables: 'Cables', car: 'Car', computer: 'Computer', storage: 'Storage', care: 'Grooming' };
    const DEPT_SHORT = { cables: 'Cables', car: 'Car', stands: 'Stands', care: 'Grooming' };
    const deptIcon = id => { const n = id === 'stands' ? STAND : NAV_CATS.find(x => x.label === DEPT_ICON[id]); return n ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${n.d}" fill="currentColor" fill-rule="evenodd"/><path d="${n.s}" fill="none" stroke="currentColor" stroke-width="${n.w}" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''; };
    const inType = t => D.products.filter(p => p.type === t);
    const depts = DEPTS.map(d => ({ ...d, types: d.types.filter(t => inType(t).length) })).filter(d => d.types.length);
    // Representative product: newest with a photo
    const rep = list => list.find(p => p.thumb && p.tabs.includes('new')) || list.find(p => p.thumb) || list[0];
    const lead = D.byId('ts-11anc') || D.products.find(p => p.src && p.tabs.includes('new'));
    const thumb = p => p ? `<span class="mnav__thumb" style="background: ${photoBg(p)};">${p.thumb ? `<img src="${p.thumb}" alt="" loading="lazy" style="${photoFit(p)}">` : art(p.art, { alt: '' })}</span>` : '';
    const quick = [['New for 2026', url.filter('new')], ['Best sellers', url.filter('best')], ['Under Rs.1,000', url.products + '?price=u1'], ['Fast charging', url.products + '?feat=fast']];
    const groups = [
      ['For business', [['Corporate gifts', url.corporate], ['Bulk & wholesale', url.bulk], ['Content creators', url.creators], ['WisdomUp Live', url.live]]],
      ['Support', [['Help Center', url.help], ['Track your order', url.track], ['Shipping', url.shipping], ['Returns & refunds', url.returns], ['Warranty', url.warranty]]],
    ];
    const el = document.createElement('div');
    el.innerHTML = `
      <div class="mnav-scrim" hidden></div>
      <aside class="mnav" id="mnav" role="dialog" aria-modal="true" aria-label="Menu" hidden>
        <header class="mnav__head">
          <a href="${url.home}" class="mnav__logo" aria-label="WisdomUp home"><img src="img/wu-logo.png" alt="WisdomUp"></a>
          <div class="mnav__tools">${themeBtn('mnav__theme')}<button type="button" class="mnav__x" aria-label="Close menu"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg></button></div>
        </header>
        <div class="mnav__body">
          ${lead ? `<a class="mnav__promo" href="${url.product(lead.id)}">
            <span class="mnav__promo-copy"><span class="mnav__eyebrow">${esc(lead.ribbon || 'Featured')}</span><b>${esc(lead.code)} ${esc(lead.cat)}</b><span class="mnav__promo-price">${esc(lead.priceText)}</span><span class="mnav__promo-cta">Shop now ${arrow}</span></span>
            <span class="mnav__promo-art" style="background: ${photoBg(lead)};">${lead.src ? `<img src="${lead.thumb || lead.src}" alt="" loading="lazy" style="${photoFit(lead)}">` : art(lead.art, { alt: '' })}</span>
          </a>` : ''}
          <nav class="mnav__tiles" aria-label="Shop by category">
            ${depts.map(d => `<a class="mnav__tile" href="${url.dept(d.id)}"><span class="mnav__tile-art">${thumb(rep(d.types.flatMap(inType)))}</span><span class="mnav__tile-t">${esc(DEPT_SHORT[d.id] || d.label)}</span></a>`).join('')}
            <a class="mnav__tile mnav__tile--all" href="${url.products}"><span class="mnav__tile-art"><span class="mnav__thumb">${navSvg(P_GRID, '', 2.2, 30)}</span></span><span class="mnav__tile-t">Shop all</span></a>
          </nav>
          <div class="mnav__quick">${quick.map(([t, h]) => `<a class="mnav__chip" href="${h}">${esc(t)}</a>`).join('')}</div>
          <div class="mnav__cats">
            ${depts.map((d, i) => `<div class="mnav__acc">
              <h3 class="mnav__acc-t"><button type="button" class="mnav__acc-h" aria-expanded="false" aria-controls="mnav-c${i}"><span class="mnav__ic">${deptIcon(d.id)}</span><span>${esc(d.label)}</span>${chev}</button></h3>
              <div class="mnav__acc-p" id="mnav-c${i}" hidden>
                ${d.types.map(t => `<a class="mnav__prod" href="${url.cat(t)}">${thumb(rep(inType(t)))}<span><b>${esc(typeLabel(t))}</b><small>From ${esc(D.rs(Math.min(...inType(t).map(p => p.price))))}</small></span></a>`).join('')}
                <a class="mnav__all" href="${url.dept(d.id)}">Shop all ${esc(d.label.toLowerCase())} ${arrow}</a>
              </div>
            </div>`).join('')}
          </div>
          ${groups.map(([h, links]) => `<div class="mnav__group"><div class="mnav__label">${esc(h)}</div>${links.map(([t, href]) => `<a href="${href}"${here() === href ? ' aria-current="page"' : ''}>${esc(t)}</a>`).join('')}</div>`).join('')}
        </div>
        <footer class="mnav__foot">
          <a href="${url.wishlist}">${heartSvg(18)}Wishlist<b class="mnav__n" data-wcount hidden></b></a>
          <a href="${url.where}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="2"/></svg>Where to buy</a>
        </footer>
      </aside>`;
    document.body.append(...el.children);
    const drawer = $('mnav'), scrim = drawer.previousElementSibling;
    let opener = null, sx = null, dx = 0;
    const setAcc = (h, open) => { const was = h.getAttribute('aria-expanded') === 'true'; h.setAttribute('aria-expanded', open); if (was !== open) slide($(h.getAttribute('aria-controls')), open); else $(h.getAttribute('aria-controls')).hidden = !open; };
    // NIGHT: the bugatti.store menu motion (measured 2026-10-06) — the blocks stagger in (translateX −20px → 0, 600ms
    // easeOutCirc, 100ms apart) and a department row pushes a sub-level in from the right while the list slides −30%.
    const body = drawer.querySelector('.mnav__body');
    let blockAnims = [];
    const blocks = () => [...body.children].flatMap(c => c.classList.contains('mnav__cats') ? [...c.children] : [c]);
    const staggerIn = () => {
      blockAnims.forEach(a => a.cancel()); blockAnims = [];
      if (reduced() || !body.animate) return;
      blockAnims = blocks().map((b, i) => b.animate([{ transform: 'translateX(-20px)' }, { transform: 'translateX(0)' }],
        { duration: 600, delay: Math.min(i * 100, 700), easing: 'cubic-bezier(.075,.82,.165,1)', fill: 'backwards' }));
    };
    const unpush = instant => {
      const s = drawer.querySelector('.mnav__sub');
      body.classList.remove('is-pushed'); body.inert = false;
      if (!s) return;
      drawer.querySelectorAll('.mnav__acc-h').forEach(x => x.setAttribute('aria-expanded', 'false'));
      s.classList.remove('is-in');
      if (instant || reduced()) s.remove(); else setTimeout(() => s.remove(), 520);
    };
    const push = h => {
      blockAnims.forEach(a => a.finish()); blockAnims = [];
      unpush(true);
      const label = h.textContent.trim();
      const s = document.createElement('div');
      s.className = 'mnav__sub'; s.setAttribute('role', 'group'); s.setAttribute('aria-label', label);
      s.innerHTML = `<button type="button" class="mnav__back" aria-label="Back to menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5.5 8.5 12 15 18.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${esc(label)}</span></button><div class="mnav__sub-body">${$(h.getAttribute('aria-controls')).innerHTML}</div>`;
      s.style.top = drawer.querySelector('.mnav__head').offsetHeight + 'px';
      s.style.bottom = drawer.querySelector('.mnav__foot').offsetHeight + 'px';
      drawer.append(s);
      h.setAttribute('aria-expanded', 'true');
      body.inert = true;
      requestAnimationFrame(() => { s.classList.add('is-in'); body.classList.add('is-pushed'); });
      setTimeout(() => s.querySelector('.mnav__back').focus({ preventScroll: true }), 60);
    };
    window.addEventListener('wu-theme', () => { unpush(true); blockAnims.forEach(a => a.cancel()); blockAnims = []; drawer.querySelectorAll('.mnav__acc-h').forEach(x => setAcc(x, false)); });
    function open(btn) {
      opener = btn || document.activeElement;
      const n = drawer.querySelector('[data-wcount]'), w = wish.length;
      n.hidden = !w; n.textContent = w;
      drawer.hidden = scrim.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      if (btn) btn.setAttribute('aria-expanded', 'true');
      unpush(true);
      requestAnimationFrame(() => { drawer.classList.add('is-open'); scrim.classList.add('is-open'); staggerIn(); });
      setTimeout(() => drawer.querySelector('.mnav__x').focus(), 60);
    }
    function close() {
      drawer.classList.remove('is-open'); scrim.classList.remove('is-open');
      document.documentElement.style.overflow = '';
      if (opener && opener.setAttribute) opener.setAttribute('aria-expanded', 'false');
      const done = () => { drawer.hidden = scrim.hidden = true; drawer.style.transform = ''; unpush(true); if (opener && opener.isConnected) opener.focus(); };
      if (reduced()) done(); else setTimeout(done, 850);
    }
    drawer.addEventListener('click', e => {
      if (e.target.closest('.mnav__x')) return close();
      if (e.target.closest('.mnav__theme')) return; // theme toggle handled globally; keep the panel open
      if (e.target.closest('.mnav__back')) {
        const h = drawer.querySelector('.mnav__acc-h[aria-expanded="true"]');
        unpush(); if (h) setTimeout(() => h.focus({ preventScroll: true }), 0);
        return;
      }
      const h = e.target.closest('.mnav__acc-h');
      if (h) {
        if (h.getAttribute('aria-expanded') === 'true') unpush(); else push(h); // departments push a sub-level (both themes)
        return;
      }
      // Same-page category links (#cat-…) only change the hash: close so the page can react
      const a = e.target.closest('a');
      if (a && a.pathname === location.pathname) close();
    });
    scrim.addEventListener('click', close);
    drawer.addEventListener('keydown', e => {
      if (e.key === 'Escape') return close();
      if (e.key !== 'Tab') return;
      const f = [...drawer.querySelectorAll('a[href], button')].filter(x => x.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    // Swipe to close — the left drawer swipes left; the phone sheet (bugatti.store style, both themes) drags down, but only
    // from the header or when the list is already scrolled to the top. Vertical scrolling and swipes that start on a
    // sideways-scrolling row (tiles, chips) never move the panel.
    let sy = null, axis = null, dy = 0, fromHead = false, atTop = true;
    const sheet = () => vw() < 640; // phones: the bottom sheet in both themes
    const scrollsX = el => { for (let n = el; n && n !== drawer; n = n.parentElement) if (n.scrollWidth > n.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(n).overflowX)) return true; return false; };
    drawer.addEventListener('touchstart', e => {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; dx = 0; dy = 0;
      axis = scrollsX(e.target) ? 'scroll' : null;
      fromHead = !!e.target.closest('.mnav__head'); atTop = !body.contains(e.target) || body.scrollTop <= 0;
    }, { passive: true });
    drawer.addEventListener('touchmove', e => {
      if (sx == null || axis === 'scroll') return;
      const mx = e.touches[0].clientX - sx, my = e.touches[0].clientY - sy;
      if (!axis) {
        if (Math.abs(mx) < 10 && Math.abs(my) < 10) return;
        if (sheet()) axis = my > Math.abs(mx) * 1.5 && (fromHead || atTop) ? 'y' : 'scroll';
        else axis = Math.abs(mx) > Math.abs(my) * 1.5 ? 'x' : 'scroll';
        if (axis === 'scroll') return;
      }
      if (axis === 'x') { dx = Math.min(0, mx); drawer.style.transform = `translateX(${dx}px)`; }
      else { dy = Math.max(0, my); drawer.style.transform = `translateY(${dy}px)`; }
      drawer.classList.add('is-dragging');
    }, { passive: true });
    const endDrag = () => {
      drawer.classList.remove('is-dragging');
      const go = (axis === 'x' && dx < -70) || (axis === 'y' && dy > Math.max(90, drawer.offsetHeight * .15));
      drawer.style.transform = ''; // the transition carries it on from the finger's position
      if (go) close();
      sx = null; axis = null; dx = 0; dy = 0;
    };
    drawer.addEventListener('touchend', endDrag);
    drawer.addEventListener('touchcancel', () => { drawer.classList.remove('is-dragging'); drawer.style.transform = ''; sx = null; axis = null; dx = 0; dy = 0; });
    window.addEventListener('resize', () => { if (!drawer.hidden && vw() >= 640 && !document.querySelector('[data-act="menu"]')?.offsetParent) close(); });
    return { open, close };
  }

  window.WU = {
    D, $, esc, reduced, vw, code, EASE, SLIDE_T: 'transform 640ms ' + EASE,
    CATS, slug, url, catHref, linkFor,
    icons: { STAR_SVG }, btnBuy,
    store, add, toast, reviews, starsSvg, cart: { lines: cartLines, count: cartCount, totals: cartTotals, setQty, clear: clearCart, setGift, gift: () => giftWrap, open: b => cartUI && cartUI.open(b), skuInfo: sku => skuIndex[sku] }, SHOP, wished, toggleWish, wishBtn, paintWish, wishList: () => wish.slice(),
    productCard, colorsOf, photoBg, photoFit, ratingOf, reviewsOf, seedOf, mountRail, mountHero, mountAccordion, DEPTS, typeLabel,
    initChrome, placeNav, setActiveCat, navOffset, scrollToEl,
    openSearch: () => search && search.open(),
    toggleTheme, isNight, slide, staggerCards, revealWords, sheetDrag, quickAdd, budget: BUDGET, STAR_OUTLINE,
    consent: { open: n => consentUI && consentUI.open(n), get: consentGet },
    seo, abs, clip, ldCrumbs, ldFaq, px, pxItem, YEAR, SITE,
  };
})();
