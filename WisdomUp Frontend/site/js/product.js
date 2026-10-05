// WisdomUp — Product detail page (product.html?id=…&sku=…). Everything comes from the catalogue (js/catalog.js):
// photo, variants (plug / cable / connector / capacity / length), specs and highlights. No invented ratings.
(function () {
  const { D, $, esc, url, add, toast, mountRail, mountAccordion, scrollToEl, colorsOf, photoBg, DEPTS, typeLabel } = WU;
  const q = new URLSearchParams(location.search);
  const p = D.byId(q.get('id')) || D.products.find(x => (x.skus || []).includes(q.get('id')));

  if (!p) {
    WU.initChrome();
    document.title = 'Product not found | WisdomUp';
    $('pd').innerHTML = `<div class="empty"><h1 class="grad-h">Product not found</h1><p>That product may have moved. Browse the full range instead.</p><a class="btn-pill" href="${url.products}">See all products</a></div>`;
    return;
  }
  WU.initChrome({ active: p.type });

  /* ---------- Content (per department) ---------- */
  const dept = DEPTS.find(d => d.types.includes(p.type)) || DEPTS[0];
  const HEADLINES = {
    audio: ['Your sound.', 'All day long.'], charging: ['Power up.', 'Keep moving.'], cables: ['Built to bend.', 'Made to last.'],
    car: ['Eyes on the road.', 'Phone in reach.'], stands: ['Hands free.', 'Angle just right.'], computer: ['Work faster.', 'Play longer.'],
    storage: ['Room for', 'everything.'], care: ['Look sharp.', 'Every day.'],
  };
  const LEDE = {
    audio: 'Pairs quickly with Android and iPhone, with clear calls and full, punchy sound.',
    charging: 'Built-in protection against short circuits, over-voltage and overheating keeps your devices safe while they charge.',
    cables: 'Reinforced joints and tested connectors for everyday plugging in and out.',
    car: 'Made for Pakistani roads — holds firm over bumps and works in any 12–24V car.',
    stands: 'Stable, adjustable and easy to set up at your desk, on the bike or on the go.',
    computer: 'Plug-and-play with Windows and macOS — no drivers needed.',
    storage: 'Plug-and-play storage for phones, cameras, laptops and car stereos.',
    care: 'Rechargeable, cordless and easy to clean, for a quick routine at home or away.',
  };
  const FAQ = {
    audio: [['Will it work with my phone?', 'Yes — it pairs with Android, iPhone, Windows and macOS. Open your Bluetooth settings and select the WisdomUp model name.']],
    charging: [['Is it safe for my phone?', 'Yes. WisdomUp chargers include protection against short circuits, over-voltage and overheating, and only deliver the power your phone asks for.'],
      ['Which plug should I choose?', 'Most sockets in Pakistan take the EU 2-pin round plug. Choose UK 3-pin for square-pin sockets.']],
    cables: [['Which connector do I need?', 'USB-C for most new Android phones and iPhone 15 or later; Lightning for iPhone 5 to iPhone 14; Micro-USB for older Android phones and accessories.']],
    car: [['Will it fit my car?', 'Yes — it works in any car with a 12–24V socket or a standard dashboard or air vent.']],
    stands: [['Will it hold my phone?', 'Yes — it fits standard phones in or out of a slim case.']],
    computer: [['Do I need drivers?', 'No — it is plug-and-play on Windows and macOS.']],
    storage: [['Which capacity should I choose?', 'Choose 32GB or more for phones and dash cams; 64GB or more for 4K video and large file transfers.']],
    care: [['How long does a charge last?', 'See the runtime in the specs above. Charge it fully before first use.']],
  };
  const parts = p.meta.split('|').map(s => s.trim()).filter(Boolean);
  const head = HEADLINES[dept.id];
  const DESC = `${p.title}${p.highlights.length ? ' — ' + p.highlights.slice(0, 3).join(', ').replace(/^./, c => c.toLowerCase()) : ''}. ${LEDE[dept.id]}`;
  const STAT_BG = [
    { cls: 'pd-stat--dark', bg: 'radial-gradient(90% 120% at 70% 40%, #3a3531 0%, #151312 60%, #0d0c0b 100%)', fg: '#fff' },
    { cls: '', bg: 'linear-gradient(135deg, #E9F3FC 0%, #9FC7EE 100%)', fg: '#1c2a44' },
    { cls: 'pd-stat--light', bg: '#fff', fg: '#464646' },
    { cls: 'pd-stat--dark', bg: 'linear-gradient(160deg, #2a1640 0%, #120a24 70%)', fg: '#fff' },
  ];
  const STATS = p.specs.filter(([k]) => !/Colours|Design|Type|Charging port|Interface|Plugs|Input/.test(k)).slice(0, 3)
    .map(([k, v]) => ({ v, t: k, s: '' }))
    .concat([{ v: 'Warranty', t: 'Brand cover', s: 'Manufacturing defects covered — see the warranty policy.' }]);
  const FAQS = (FAQ[dept.id] || []).concat([
    ['How long does delivery take?', 'Standard delivery takes 3–5 working days anywhere in Pakistan; express arrives in 1–2. Orders above Rs.40,000 ship free.'],
    ['Can I pay cash on delivery?', 'Yes — pay by Cash on Delivery, JazzCash, EasyPaisa or bank transfer.'],
    ['Can I return it?', 'Yes — every order has a 7-day money-back guarantee if the product is in its original condition and packaging.'],
  ]);

  /* ---------- Variants ---------- */
  const V = p.variants.length ? p.variants : [{ sku: p.code, attrs: {}, price: p.price, priceText: WU.D.rs(p.price), img: p.src, thumb: p.thumb, bg: p.bg, ar: p.ar }];
  let cur = Math.max(0, V.findIndex(v => v.sku === q.get('sku')));
  const AXIS_HINT = { Plug: 'EU 2-pin fits most sockets in Pakistan', Cable: 'Cable included in the box' };
  const values = a => V.map(v => v.attrs[a]).filter((x, i, arr) => x && arr.indexOf(x) === i);
  // When one option changes, keep the other choices if that combination exists
  const pick = (axis, val) => {
    const want = { ...V[cur].attrs, [axis]: val };
    const i = V.findIndex(v => Object.keys(want).every(k => v.attrs[k] === want[k]));
    return i >= 0 ? i : V.findIndex(v => v.attrs[axis] === val);
  };
  const available = (axis, val) => V.some(v => v.attrs[axis] === val && p.axes.every(k => k === axis || v.attrs[k] === V[cur].attrs[k]));
  const images = V.map(v => v.img).filter((x, i, a) => x && a.indexOf(x) === i);

  document.querySelector('meta[name="description"]').setAttribute('content', `${p.title}: ${parts.join(', ')}. ${p.priceText} in Pakistan with Cash on Delivery, warranty and nationwide delivery from WisdomUp.`);
  document.title = `${p.title} — Price in Pakistan | WisdomUp`;
  // Structured data for search results (price in PKR, availability)
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.title, sku: V[cur].sku, brand: { '@type': 'Brand', name: 'WisdomUp' },
    image: images.map(i => new URL(i, location.href).href), description: DESC, category: p.cat,
    offers: V.length > 1
      ? { '@type': 'AggregateOffer', priceCurrency: 'PKR', lowPrice: Math.min(...V.map(v => v.price)), highPrice: Math.max(...V.map(v => v.price)), offerCount: V.length, availability: 'https://schema.org/InStock' }
      : { '@type': 'Offer', priceCurrency: 'PKR', price: V[0].price, availability: 'https://schema.org/InStock' },
  });
  document.head.append(ld);

  /* ---------- Markup ---------- */
  const colours = colorsOf(p);
  $('pd').innerHTML = `
    <nav class="crumbs" aria-label="Breadcrumb"><a href="${url.home}">Home</a><span aria-hidden="true">›</span><a href="${url.dept(dept.id)}">${esc(dept.label)}</a><span aria-hidden="true">›</span><a href="${url.cat(p.type)}">${esc(typeLabel(p.type))}</a><span aria-hidden="true">›</span><span aria-current="page">${esc(p.code)}</span></nav>

    <section class="pdp2" aria-label="Product">
      <div class="pdp2__gallery">
        <div class="pdp2__stage pdp2__stage--photo" id="stage" style="background: ${photoBg(V[cur])};">
          <img class="is-pack" id="stage-img" src="${V[cur].img || p.src}" alt="${esc(p.title)}">
          ${p.ribbon ? `<span class="badge-grad pdp2__badge">${esc(p.ribbon)}</span>` : ''}
          ${images.length > 1 ? `<button type="button" class="pdp2__chev pdp2__chev--prev" data-img="-1" aria-label="Previous image">${icon('chev-l', 22)}</button>
          <button type="button" class="pdp2__chev pdp2__chev--next" data-img="1" aria-label="Next image">${icon('chev-r', 22)}</button>` : ''}
        </div>
        ${images.length > 1 ? `<div class="thumbs" id="thumbs">${images.map((im, i) => `<button type="button" class="thumb" data-i="${i}" aria-current="${im === V[cur].img}" aria-label="Photo ${i + 1}"><img src="${im.replace('img/p/', 'img/p/s/')}" alt="" style="width: 100%; height: 100%; object-fit: cover; object-position: 6% 50%; border-radius: inherit;"></button>`).join('')}</div>` : ''}
      </div>

      <div class="pdp2__info">
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="pdp2__kicker"><a href="${url.cat(p.type)}">${esc(typeLabel(p.type))}</a><span>Model <b id="pd-sku">${esc(V[cur].sku)}</b></span><span id="pd-rate"></span></div>
          <h1 class="pdp2__title">${esc(p.title)}</h1>
          <p class="pdp2__desc">${esc(DESC)}</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div class="pdp2__price"><span class="pdp2__now" id="pd-price">${esc(V[cur].priceText)}</span></div>
          <span class="pdp2__stock">Inclusive of all taxes · ${p.soldOut ? '<b style="color: #B42318;">Sold out</b> — back soon' : '<b>In stock</b>, ships in 24 hours'}</span>
        </div>
        ${p.axes.length || colours.length > 1 ? '<div class="pdp2__rule"></div>' : ''}
        ${p.axes.map(a => `<div class="pdp2__opt" data-axis="${esc(a)}">
          <div class="pdp2__label">${esc(a)}: <span data-cur>${esc(V[cur].attrs[a])}</span>${AXIS_HINT[a] ? `<small>${esc(AXIS_HINT[a])}</small>` : ''}</div>
          <div class="opt-chips" role="radiogroup" aria-label="${esc(a)}">${values(a).map(val => `<button type="button" class="opt-chip" role="radio" data-val="${esc(val)}" aria-checked="${V[cur].attrs[a] === val}">${esc(val)}</button>`).join('')}</div>
        </div>`).join('')}
        ${colours.length > 1 ? `<div class="pdp2__opt"><div class="pdp2__label">Colours: <span>${esc(colours.map(c => c.name).join(', '))}</span><small>Tell us your colour on WhatsApp after ordering</small></div>
          <div class="sw-dots">${colours.map(c => `<i title="${esc(c.name)}" style="background: ${c.hex};"></i>`).join('')}</div></div>` : ''}
        <div class="buybox" id="buybox">
          <div class="qty" role="group" aria-label="Quantity"><button type="button" data-q="-1" aria-label="Decrease quantity">−</button><output id="qty" aria-live="polite">1</output><button type="button" data-q="1" aria-label="Increase quantity">+</button></div>
          <button type="button" class="btn-cart" data-add${p.soldOut ? ' disabled' : ''}><span class="plus">+</span>${p.soldOut ? 'Sold out' : 'Add to cart'}</button>
          ${WU.wishBtn(p, 'pdp2__wish')}
        </div>
        <button type="button" class="btn-buy" data-buy${p.soldOut ? ' disabled' : ''}>${icon('cart', 30)}Buy Now</button>
        <label class="gift" style="cursor: pointer;"><input type="checkbox" id="gift" style="accent-color: var(--focus); width: 18px; height: 18px;"><span>Add gift wrapping @ <b>${esc(WU.D.rs(WU.SHOP.giftWrap))}</b></span></label>
        <div class="offer"><div class="offer__head">Free shipping on this order<span>%</span></div><div class="offer__body"><span id="offer-text"></span><a href="${url.shipping}" style="white-space: nowrap; margin-left: 12px;">Details ›</a></div></div>
        <div class="assure">
          <a class="assure__i" href="${url.shipping}">${icon('truck', 28)}<b>Fast delivery</b><span>3–5 working days</span></a>
          <a class="assure__i" href="${url.warranty}">${icon('medal', 28)}<b>Warranty</b><span>Brand warranty</span></a>
          <a class="assure__i" href="${url.returns}">${icon('shield', 28)}<b>Easy returns</b><span>7-day money-back</span></a>
        </div>
        ${p.highlights.length ? `<div class="highlights"><div class="eyebrow" style="display: block;">Key highlights</div>${p.highlights.map(t => `<div><i></i><span><strong>${esc(t)}</strong></span></div>`).join('')}</div>` : ''}
        <div class="pays"><span style="padding: 0; background: none; color: var(--muted); font-weight: 500;">Secure checkout</span>${['Cash on Delivery', 'JazzCash', 'EasyPaisa', 'Bank transfer'].map(m => `<span>${m}</span>`).join('')}</div>
      </div>
    </section>

    <div class="pdtabs" id="pdtabs" data-sticky-offset data-priority-bar><nav class="pdtabs__in" aria-label="Product sections">
      ${[['pd-overview', 'Overview'], ['pd-specs', 'Specs'], ['pd-reviews', 'Reviews'], ['pd-faqs', 'FAQs']].map(([h, l], i) => `<a class="chip" href="#${h}" data-jump aria-current="${i === 0}">${l}</a>`).join('')}
    </nav></div>

    <section class="overview pdsec" id="pd-overview" aria-labelledby="ov-h">
      <div class="overview__head"><h2 id="ov-h">${esc(head[0])} <b>${esc(head[1])}</b></h2><p>${esc(LEDE[dept.id] + ' Backed by WisdomUp brand warranty and support across Pakistan.')}</p></div>
      <div class="stats">${STATS.map((s, i) => { const b = STAT_BG[i % 4]; return `<div class="pd-stat ${b.cls}" style="background: ${b.bg}; color: ${b.fg};"><span class="pd-stat__v">${esc(s.v)}</span><div style="display: flex; flex-direction: column; gap: 6px;"><span class="pd-stat__t">${esc(s.t)}</span>${s.s ? `<span class="pd-stat__s">${esc(s.s)}</span>` : ''}</div></div>`; }).join('')}</div>
    </section>

    <section class="split pdsec" id="pd-specs" aria-labelledby="sp-h">
      <h2 class="grad-h" id="sp-h">Tech specs</h2>
      <div class="panel-list" id="spec-list"></div>
    </section>

    <section class="split pdsec" id="pd-reviews" aria-labelledby="rv-h">
      <h2 class="grad-h" id="rv-h">Reviews</h2>
      <div class="rv" id="rv"></div>
    </section>

    <section class="split pdsec" id="pd-faqs" aria-labelledby="fq-h">
      <h2 class="grad-h" id="fq-h">FAQs</h2>
      <div><div class="panel-list" id="pd-faq-list"></div><p class="meta-line" style="margin: 14px 0 0;">More answers in the <a href="${url.help}">Help Center</a> · <a href="${url.manuals}">e-Manuals</a></p></div>
    </section>

    <div class="rail-wrap" id="related"></div>

    <div class="buybar" id="buybar" aria-hidden="true">
      <div class="buybar__art" style="background: ${photoBg(p)};"><img id="bb-img" src="${V[cur].thumb || p.thumb}" alt="" style="width: 100%; height: 100%; object-fit: cover; object-position: 6% 50%;"></div>
      <div class="buybar__txt"><span class="buybar__t">${esc(p.code)} <small>${esc(typeLabel(p.type))}</small></span><span class="buybar__p"><b id="bb-price">${esc(V[cur].priceText)}</b></span></div>
      <button type="button" class="btn-buy" data-add tabindex="-1"${p.soldOut ? ' disabled' : ''}>${icon('cart', 24)}${p.soldOut ? 'Sold out' : 'Add to cart'}</button>
    </div>`;

  /* ---------- Variant selection: price, model, photo, specs and URL follow the choice ---------- */
  const paintSpecs = () => {
    const rows = [['Model', V[cur].sku], ['Category', typeLabel(p.type)], ...Object.entries(V[cur].attrs), ...p.specs, ['Warranty', 'WisdomUp brand warranty']];
    $('spec-list').innerHTML = rows.map(([k, v]) => `<div class="specs-row"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('');
  };
  let qty = 1;
  const paintOffer = () => {
    const left = 40000 - V[cur].price * qty;
    $('offer-text').textContent = left > 0
      ? `Orders above Rs.40,000 ship free nationwide. Add ${WU.D.rs(left)} more to qualify.`
      : 'Great news — this order qualifies for free nationwide shipping.';
  };
  function showImage(src) {
    if (!src) return;
    const v = V.find(x => x.img === src) || V[cur];
    $('stage').style.background = photoBg(v);
    $('stage-img').src = src;
    document.querySelectorAll('#thumbs .thumb').forEach((t, i) => t.setAttribute('aria-current', images[i] === src));
  }
  function setVariant(i, push = true) {
    if (i < 0 || (i === cur && push)) return;
    cur = i;
    const v = V[cur];
    $('pd-sku').textContent = v.sku;
    $('pd-price').textContent = v.priceText;
    $('bb-price').textContent = v.priceText;
    if (v.thumb) $('bb-img').src = v.thumb;
    document.querySelectorAll('.pdp2__opt[data-axis]').forEach(box => {
      const a = box.dataset.axis;
      box.querySelector('[data-cur]').textContent = v.attrs[a];
      box.querySelectorAll('.opt-chip').forEach(c => {
        c.setAttribute('aria-checked', c.dataset.val === v.attrs[a]);
        c.classList.toggle('is-na', !available(a, c.dataset.val));
      });
    });
    showImage(v.img);
    paintSpecs();
    paintOffer();
    if (push && V.length > 1) history.replaceState(null, '', `${location.pathname}?id=${encodeURIComponent(p.id)}&sku=${encodeURIComponent(v.sku)}${location.hash}`);
  }
  document.querySelectorAll('.pdp2__opt[data-axis]').forEach(box => box.addEventListener('click', e => {
    const c = e.target.closest('.opt-chip');
    if (c) setVariant(pick(box.dataset.axis, c.dataset.val));
  }));
  const goImage = i => {
    const vi = V.findIndex(v => v.img === images[i]);
    if (vi >= 0) setVariant(vi); else showImage(images[i]);
  };
  $('stage').addEventListener('click', e => {
    const b = e.target.closest('[data-img]');
    if (b) goImage((images.indexOf($('stage-img').getAttribute('src')) + +b.dataset.img + images.length) % images.length);
  });
  // Touch: swipe the photo left/right (phones have no arrow buttons)
  let gx = null;
  $('stage').addEventListener('touchstart', e => { gx = e.touches[0].clientX; }, { passive: true });
  $('stage').addEventListener('touchend', e => {
    if (gx == null || images.length < 2) return;
    const dx = e.changedTouches[0].clientX - gx;
    if (Math.abs(dx) > 40) goImage((images.indexOf($('stage-img').getAttribute('src')) + (dx < 0 ? 1 : -1) + images.length) % images.length);
    gx = null;
  });
  if ($('thumbs')) $('thumbs').addEventListener('click', e => {
    const b = e.target.closest('.thumb');
    if (b) goImage(+b.dataset.i);
  });
  setVariant(cur, false);

  /* ---------- Quantity, buy ---------- */
  $('buybox').addEventListener('click', e => {
    const b = e.target.closest('[data-q]');
    if (!b) return;
    qty = Math.min(10, Math.max(1, qty + +b.dataset.q));
    $('qty').textContent = qty;
    paintOffer();
  });
  document.addEventListener('click', e => {
    // Add to cart: the chosen option (plug / cable / capacity…) and quantity; the cart panel opens to confirm
    if (e.target.closest('[data-add]') && !p.soldOut) add(p.id, qty, V[cur].sku, { open: true });
    // Buy Now: add and go straight to checkout
    if (e.target.closest('[data-buy]') && !p.soldOut) { add(p.id, qty, V[cur].sku); location.href = 'checkout.html'; }
  });
  $('gift').checked = WU.cart.gift();
  $('gift').addEventListener('change', e => { WU.cart.setGift(e.target.checked); toast(e.target.checked ? `Gift wrapping added (${WU.D.rs(WU.SHOP.giftWrap)})` : 'Gift wrapping removed'); });

  /* ---------- Reviews (real ones only; stored on this device until the shared review database is connected) ---------- */
  const R = WU.reviews, stars = WU.starsSvg;
  let rvSort = 'new', rvStar = 0, rvForm = false, rvPick = 0;
  const SORTERS = { new: (a, b) => b.createdAt.localeCompare(a.createdAt), high: (a, b) => b.rating - a.rating, low: (a, b) => a.rating - b.rating, helpful: (a, b) => b.helpful - a.helpful };
  const contact = WU.store.get('wu-ck-contact', {}) || {};
  function paintReviews() {
    const sum = R.summary(p.id), list = R.list(p.id).filter(r => !rvStar || r.rating === rvStar).sort(SORTERS[rvSort]);
    $('pd-rate').innerHTML = sum.count ? `<a class="pdp2__rate" href="#pd-reviews" data-jump>${stars(sum.avg, 15)}<b>${sum.avg.toFixed(1)}</b> · ${sum.count} review${sum.count > 1 ? 's' : ''}</a>` : '';
    $('rv').innerHTML = `
      <div class="rv__sum">
        ${sum.count ? `<div class="rv__avg"><b>${sum.avg.toFixed(1)}</b><span class="rv__stars">${stars(sum.avg, 20)}</span><small>Based on ${sum.count} review${sum.count > 1 ? 's' : ''}</small></div>
          <div class="rv__dist">${sum.dist.map((n, i) => { const st = 5 - i; return `<button type="button" class="rv__bar" data-star="${st}" aria-pressed="${rvStar === st}" ${n ? '' : 'disabled'}><span>${st}★</span><i style="--w: ${sum.count ? Math.round(n / sum.count * 100) : 0}%;"></i><small>${n}</small></button>`; }).join('')}</div>`
        : `<div class="rv__avg rv__avg--none"><b>No reviews yet</b><small>Bought ${esc(p.code)}? Be the first to tell other shoppers how it works for you.</small></div>`}
        <button type="button" class="btn-pill rv__write" data-rv-write aria-expanded="${rvForm}">Write a review</button>
      </div>
      <form class="rv__form" id="rv-form" novalidate ${rvForm ? '' : 'hidden'}>
        <fieldset class="rv__pick"><legend>Your rating<i>*</i></legend>
          <div class="rv__stars-in" role="radiogroup" aria-label="Rating">${[1, 2, 3, 4, 5].map(i => `<button type="button" role="radio" aria-checked="${rvPick === i}" aria-label="${i} star${i > 1 ? 's' : ''}" data-pick="${i}" class="${i <= rvPick ? 'is-on' : ''}"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"/></svg></button>`).join('')}<span class="rv__pick-l">${['Tap to rate', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'][rvPick]}</span></div>
        </fieldset>
        <div class="ck__grid">
          <div class="field ck__wide"><label for="rv-title">Headline</label><input id="rv-title" name="title" maxlength="80" placeholder="Sum it up in a few words"></div>
          <div class="field ck__wide"><label for="rv-text">Your review<i>*</i></label><textarea id="rv-text" name="text" maxlength="1000" rows="4" placeholder="What did you like? How is the sound, battery or build?"></textarea></div>
          <div class="field"><label for="rv-name">Name<i>*</i></label><input id="rv-name" name="name" maxlength="40" autocomplete="given-name" value="${esc((contact.name || '').split(' ')[0])}"></div>
          <div class="field"><label for="rv-city">City</label><input id="rv-city" name="city" maxlength="40" autocomplete="address-level2" value="${esc(contact.city || '')}"></div>
        </div>
        ${R.verified(p.id) ? '<p class="rv__note rv__note--ok">You ordered this product — your review will show a <b>Verified buyer</b> badge.</p>' : ''}
        <div class="rv__actions"><button type="submit" class="btn-navy">Post review</button><button type="button" class="btn-outline" data-rv-cancel>Cancel</button></div>
        <p class="rv__note">Reviews are saved on this device for now. Reviews from every shopper will appear here once our review system goes live.</p>
      </form>
      ${sum.count > 1 ? `<div class="rv__tools"><span>${rvStar ? `Showing ${rvStar}★ reviews · <button type="button" class="link-arrow" data-star="0">Show all</button>` : `${sum.count} reviews`}</span>
        <label class="rv__sort">Sort <select id="rv-sort">${[['new', 'Newest'], ['high', 'Highest rating'], ['low', 'Lowest rating'], ['helpful', 'Most helpful']].map(([k, l]) => `<option value="${k}"${k === rvSort ? ' selected' : ''}>${l}</option>`).join('')}</select></label></div>` : ''}
      <div class="rv__list">${list.map(r => `
        <article class="rv__item">
          <header><span class="rv__stars" aria-label="${r.rating} out of 5">${stars(r.rating, 16)}</span>${r.title ? `<b>${esc(r.title)}</b>` : ''}</header>
          <p>${esc(r.text)}</p>
          <footer><span>${esc(r.name)}${r.city ? ', ' + esc(r.city) : ''} · ${esc(new Date(r.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }))}${r.verified ? ' · <i class="rv__ver">Verified buyer</i>' : ''}${r.sku && r.sku !== p.code ? ` · ${esc(r.sku)}` : ''}</span>
            <button type="button" class="rv__help" data-help="${esc(r.id)}">Helpful${r.helpful ? ` (${r.helpful})` : ''}</button></footer>
        </article>`).join('')}</div>`;
  }
  $('rv').addEventListener('click', e => {
    const t = e.target;
    if (t.closest('[data-rv-write]')) { rvForm = !rvForm; paintReviews(); if (rvForm) setTimeout(() => $('rv-form').querySelector('[data-pick]').focus(), 30); return; }
    if (t.closest('[data-rv-cancel]')) { rvForm = false; rvPick = 0; paintReviews(); return; }
    const pick = t.closest('[data-pick]');
    if (pick) { rvPick = +pick.dataset.pick; const keep = new FormData($('rv-form')); paintReviews(); ['title', 'text', 'name', 'city'].forEach(k => { $('rv-form').elements[k].value = keep.get(k) || ''; }); $('rv-form').querySelector(`[data-pick="${rvPick}"]`).focus(); return; }
    const st = t.closest('[data-star]');
    if (st && !st.disabled) { rvStar = +st.dataset.star === rvStar ? 0 : +st.dataset.star; paintReviews(); return; }
    const h = t.closest('[data-help]');
    if (h) { if (R.helpful(p.id, h.dataset.help)) paintReviews(); else toast('You already marked this review helpful'); }
  });
  $('rv').addEventListener('change', e => { if (e.target.id === 'rv-sort') { rvSort = e.target.value; paintReviews(); } });
  $('rv').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, v = n => f.elements[n].value.trim();
    const errs = [];
    if (!rvPick) errs.push(['pick', 'Choose a star rating.']);
    if (v('text').length < 20) errs.push(['text', 'Please write at least 20 characters.']);
    if (v('name').length < 2) errs.push(['name', 'Enter your name.']);
    f.querySelectorAll('.field__err').forEach(x => x.remove());
    f.querySelectorAll('.is-bad').forEach(x => x.classList.remove('is-bad'));
    if (errs.length) {
      errs.forEach(([k, m]) => { const box = k === 'pick' ? f.querySelector('.rv__pick') : f.elements[k].closest('.field'); box.classList.add('is-bad'); box.insertAdjacentHTML('beforeend', `<span class="field__err">${esc(m)}</span>`); });
      (errs[0][0] === 'pick' ? f.querySelector('[data-pick]') : f.elements[errs[0][0]]).focus();
      return;
    }
    R.add(p.id, { rating: rvPick, title: v('title'), text: v('text'), name: v('name'), city: v('city'), sku: V[cur].sku });
    rvForm = false; rvPick = 0; rvStar = 0; rvSort = 'new';
    paintReviews();
    toast('Thanks — your review is posted');
  });
  paintReviews();

  /* ---------- Tabs, accordion, related ---------- */
  mountAccordion($('pd-faq-list'), FAQS, { idPrefix: 'pdfaq' });
  const sameType = D.products.filter(x => x.type === p.type && x.id !== p.id && !x.soldOut);
  const sameDept = D.products.filter(x => dept.types.includes(x.type) && x.type !== p.type && !x.soldOut);
  mountRail($('related'), {
    title: 'You may also like',
    items: sameType.slice(0, 8).concat(sameType.length < 4 ? sameDept.slice(0, 8 - sameType.length) : []),
    allHref: url.cat(p.type), allLabel: 'Shop ' + typeLabel(p.type).toLowerCase(),
  });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-jump]');
    if (!a) return;
    e.preventDefault();
    scrollToEl($(a.getAttribute('href').slice(1)));
  });
  const SECS = ['pd-overview', 'pd-specs', 'pd-reviews', 'pd-faqs'];
  function onScroll() {
    let curSec = SECS[0];
    SECS.forEach(s => { if ($(s).getBoundingClientRect().top < 260) curSec = s; });
    $('pdtabs').querySelectorAll('.chip').forEach(c => c.setAttribute('aria-current', c.getAttribute('href') === '#' + curSec));
    const show = $('buybox').getBoundingClientRect().bottom < 0 && $('footer').getBoundingClientRect().top > innerHeight;
    $('buybar').classList.toggle('is-on', show);
    $('buybar').setAttribute('aria-hidden', !show);
    $('buybar').querySelector('button').tabIndex = show ? 0 : -1;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('wu-nav', e => $('pdtabs').classList.toggle('is-up', e.detail.hidden));
  onScroll();
})();
