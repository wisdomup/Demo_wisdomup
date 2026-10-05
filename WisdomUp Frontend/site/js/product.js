// WisdomUp — Product detail page (product.html?id=…). OS-4 uses the design's copy; other products derive
// equivalent content from their catalogue data (meta, price, category, colours).
(function () {
  const { D, $, esc, code, url, add, toast, mountRail, mountAccordion, scrollToEl, colorsOf, ratingOf, reviewsOf } = WU;
  const id = new URLSearchParams(location.search).get('id') || 'os4';
  const p = D.byId(id);

  if (!p) {
    WU.initChrome();
    document.title = 'Product not found | WisdomUp';
    $('pd').innerHTML = `<div class="empty"><h1 class="grad-h">Product not found</h1><p>That product may have moved. Browse the full range instead.</p><a class="btn-pill" href="${url.products}">See all products</a></div>`;
    return;
  }
  WU.initChrome({ active: p.cat });

  /* ---------- Content ---------- */
  const parts = p.meta.split('|').map(s => s.trim()).filter(Boolean);
  const premium = p.price >= 9000;
  const HEADLINES = {
    os4: ['Hear the city.', 'Keep the music.'], ts10: ['Silence,', 'on demand.'], thunder: ['Turn any room', 'into the venue.'],
    mkf02: ['Sound like', 'the studio.'], cj45: ['Three devices.', 'One pad.'],
    Earbuds: ['Your sound.', 'All day long.'], Neckbands: ['Hands free.', 'Sound on.'], Speakers: ['Bring the', 'party with you.'],
    Microphones: ['Clean audio,', 'straight from your phone.'], Chargers: ['Power up.', 'Keep moving.'],
  };
  const LEDE = {
    Earbuds: 'Tuned for clear calls and rich bass, with quick pairing for Android and iPhone and a pocket-sized charging case.',
    Neckbands: 'Magnetic buds that clip together when you are not listening, all-day battery and a lightweight band you forget you are wearing.',
    Speakers: 'Room-filling sound, a light show that moves with the beat and a build that shrugs off splashes at the pool or on the roof.',
    Microphones: 'Clip-on wireless mics that plug straight into your phone, with live noise reduction for reels, vlogs and live streams.',
    Chargers: 'Fast, safe charging with built-in protection against over-voltage and overheating — at your desk, by the bed or on the road.',
  };
  const DESC = id === 'os4'
    ? 'Open-ear design for the gym and the commute, with full situational awareness. A 14.2mm driver delivers rich bass; 50mAh buds and a 400mAh case give you 40+ hours.'
    : `${p.title} — ${parts.join(', ')}. ${LEDE[p.cat]}`;
  const OVERVIEW = id === 'os4'
    ? 'OS-4 hooks over the ear and sits just outside it — nothing sealing your ear canal, nothing blocking traffic, trainers or teammates. RGB lights on the case pulse to the beat.'
    : LEDE[p.cat] + ' Backed by WisdomUp warranty and support in 50+ countries.';
  const STAT_BG = [
    { cls: 'pd-stat--dark', bg: 'radial-gradient(90% 120% at 70% 40%, #3a3531 0%, #151312 60%, #0d0c0b 100%)', fg: '#fff' },
    { cls: '', bg: 'linear-gradient(135deg, #E9F3FC 0%, #9FC7EE 100%)', fg: '#1c2a44' },
    { cls: 'pd-stat--light', bg: '#fff', fg: '#464646' },
    { cls: 'pd-stat--dark', bg: 'linear-gradient(160deg, #2a1640 0%, #120a24 70%)', fg: '#fff' },
  ];
  const statFrom = s => { const m = s.match(/^([\d.+]+\s?(?:W|m|Hrs?|mm)?)\s+(.+)$/i); return m && m[2] ? { v: m[1].trim(), t: m[2] } : { v: s.split(' ')[0], t: s.split(' ').slice(1).join(' ') || 'Built in' }; };
  const STATS = id === 'os4'
    ? [{ v: '40+', t: 'Hours of play', s: '50mAh buds plus a 400mAh case.' }, { v: 'IPX7', t: 'Waterproof', s: 'Built for sweat, rain and the gym.' }, { v: '14.2', t: 'mm driver', s: 'Rich bass from an open-ear design.' }, { v: 'BT 5.3', t: 'Stable link', s: 'Quick pairing, 10m range.' }]
    : parts.slice(0, 3).map(statFrom).map(x => ({ ...x, s: 'Tested on every unit before it ships.' })).concat([{ v: premium ? '2 yr' : '6 mo', t: 'Brand warranty', s: 'Manufacturing defects and hardware failures covered.' }]);
  const HIGHLIGHTS = id === 'os4'
    ? [['40+ hours battery', 'non-stop music across two full days'], ['RGB lights', 'case lighting syncs to the beat'], ['IPX7 waterproof', 'rain, sweat and splash proof'], ['Bluetooth 5.3', '10m range, low-latency connection']]
    : parts.map(t => [t, /hrs|hours/i.test(t) ? 'real-world battery, measured at 50% volume' : /anc|enc|noise/i.test(t) ? 'clearer calls and focus in noisy places' : /ipx/i.test(t) ? 'sweat, rain and splash resistant' : /w\b|charg|pd/i.test(t) ? 'fast, protected charging' : 'built into every unit']).concat([['Works everywhere', p.cat === 'Chargers' ? 'Qi phones, earbuds and Type-C devices' : 'Android and iPhone, Windows and macOS']]);
  const SPECS = id === 'os4'
    ? [['Model', 'OS-4'], ['Design', 'Open-ear, over-ear hook'], ['Bluetooth version', '5.3'], ['Profiles', 'A2DP, AVRCP, HFP, HSP'], ['Compatibility', 'Android and iOS'], ['Wireless range', '10 metres'], ['Driver size', '14.2mm'], ['Battery', '50mAh buds · 400mAh case'], ['Water resistance', 'IPX7'], ['Warranty', '6 months brand warranty']]
    : [['Model', code(p)], ['Category', p.cat], ['Key features', parts.join(' · ')], ['Compatibility', p.cat === 'Chargers' ? 'Qi-enabled phones, earbuds and watches; USB-C / USB-A devices' : 'Android, iOS, Windows and macOS'], ['Colours', colorsOf(p).map(c => c.name).join(', ')], ['Warranty', premium ? 'Up to 2 years brand warranty' : '6 months brand warranty'], ['In the box', p.cat === 'Chargers' ? code(p) + ', charging cable, user manual' : code(p) + ', charging cable, user manual, warranty card']];
  const FAQS = id === 'os4' ? [
    ['How do I pair OS-4?', 'Open the case — the buds enter pairing mode automatically. Select "WisdomUp OS-4" in your phone\'s Bluetooth settings. After the first time, they reconnect as soon as you open the case.'],
    ['Will they stay on during workouts?', 'Yes. The flexible ear hook holds the buds in place through running and gym sessions, and the IPX7 rating covers sweat and rain.'],
    ['Can people around me hear my music?', 'At moderate volume, very little. The open-ear driver aims sound into your ear; at maximum volume some sound will escape in quiet rooms.'],
    ['What does the warranty cover?', 'Manufacturing defects and hardware failures. Contact support with your order number and we\'ll arrange a repair or replacement.'],
  ] : [
    p.cat === 'Chargers' ? ['Will it work with my phone?', `${code(p)} works with any Qi-enabled phone and with USB-C / USB-A devices. Built-in protection stops over-voltage and overheating.`] : [`How do I pair ${code(p)}?`, `Turn it on and select "WisdomUp ${code(p)}" in your phone's Bluetooth settings. After the first time it reconnects automatically.`],
    ['How long does delivery take?', 'Standard delivery takes 3–5 working days anywhere in Pakistan; express arrives in 1–2. Orders above Rs.40,000 ship free.'],
    ['Can I return it?', 'Yes — every order has a 30-day money-back guarantee if the product is in its original condition and packaging.'],
    ['What does the warranty cover?', `${premium ? 'Up to 2 years' : '6 months'} of cover for manufacturing defects and hardware failures. Contact support with your order number and we'll repair or replace it.`],
  ];
  const head = HEADLINES[id] || HEADLINES[p.cat];
  const colors = colorsOf(p);
  const views = (p.src ? [{ src: p.src, label: p.title + ' lifestyle photo' }] : []).concat([
    { tf: 'none', label: 'front' }, { tf: 'scaleX(-1)', label: 'side' }, { tf: 'rotate(-8deg) scale(1.04)', label: 'angled' }, { tf: 'scale(1.22)', label: 'close-up' },
  ]);

  document.title = `${p.title} — Price in Pakistan | WisdomUp`;
  document.querySelector('meta[name="description"]').setAttribute('content', `${p.title}: ${parts.join(', ')}. ${p.priceText} in Pakistan with COD, warranty and fast delivery from WisdomUp.`);

  /* ---------- Markup ---------- */
  const viewMarkup = v => v.src ? `<img class="is-photo" src="${v.src}" alt="${esc(v.label)}">` : art(p.art, { alt: p.title + ' ' + v.label, style: `transform: ${v.tf};` });
  $('pd').innerHTML = `
    <nav class="crumbs" aria-label="Breadcrumb"><a href="${url.home}">Home</a><span aria-hidden="true">›</span><a href="${url.products}">All Products</a><span aria-hidden="true">›</span><a href="${url.cat(p.cat)}">${esc(p.cat)}</a><span aria-hidden="true">›</span><span aria-current="page">${esc(p.title)}</span></nav>

    <section class="pdp2" aria-label="Product">
      <div class="pdp2__gallery">
        <div class="pdp2__stage" id="stage">
          ${viewMarkup(views[0])}
          ${p.ribbon || p.soldOut ? `<span class="badge-grad pdp2__badge">${esc(p.soldOut ? 'Sold out' : p.ribbon)}</span>` : ''}
          <button type="button" class="pdp2__chev pdp2__chev--prev" data-img="-1" aria-label="Previous image">${icon('chev-l', 22)}</button>
          <button type="button" class="pdp2__chev pdp2__chev--next" data-img="1" aria-label="Next image">${icon('chev-r', 22)}</button>
        </div>
        <div class="thumbs" id="thumbs">${views.map((v, i) => `<button type="button" class="thumb" aria-current="${i === 0}" aria-label="View ${i + 1}: ${esc(v.label)}">${v.src ? `<img src="${v.src}" alt="" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">` : art(p.art, { alt: '', style: `width: 78%; height: 78%; transform: ${v.tf};` })}</button>`).join('')}</div>
      </div>

      <div class="pdp2__info">
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="pdp2__rate"><span class="stars" style="color: var(--star); -webkit-text-stroke: 0;" aria-hidden="true">★★★★★</span><span>${ratingOf(p)} · <a href="#pd-reviews" data-jump>${reviewsOf(p)} reviews</a></span></div>
          <h1 class="pdp2__title">${esc(p.title)}</h1>
          <p class="pdp2__desc">${esc(DESC)}</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div class="pdp2__price"><span class="pdp2__now">${esc(p.priceText)}</span>${p.wasText ? `<span class="pdp2__was">${esc(p.wasText)}</span>` : ''}${p.off ? `<span class="pdp2__off">${esc(p.off)}</span>` : ''}</div>
          <span class="pdp2__stock">Inclusive of all taxes · ${p.soldOut ? '<b style="color: #B42318;">Sold out</b> — back soon' : '<b>In stock</b>, ships in 24 hours'}</span>
        </div>
        <div class="pdp2__rule"></div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="pdp2__label">Colour: <span id="color-name">${esc(colors[0].name)}</span></div>
          <div class="sw-tiles" role="radiogroup" aria-label="Colour" id="swatches">${colors.map((c, i) => `<button type="button" class="sw-tile" role="radio" aria-checked="${i === 0}" aria-label="${esc(c.name)}" data-i="${i}">${art(p.art, { alt: '', style: 'width: 74%; height: 74%;' })}<i style="background: ${c.hex};"></i></button>`).join('')}</div>
        </div>
        <div class="buybox" id="buybox">
          <div class="qty" role="group" aria-label="Quantity"><button type="button" data-q="-1" aria-label="Decrease quantity">−</button><output id="qty" aria-live="polite">1</output><button type="button" data-q="1" aria-label="Increase quantity">+</button></div>
          <button type="button" class="btn-cart" data-add${p.soldOut ? ' disabled style="opacity: .45; cursor: not-allowed;"' : ''}><span class="plus">+</span>${p.soldOut ? 'Sold out' : 'Add to cart'}</button>
        </div>
        <button type="button" class="btn-buy" data-buy${p.soldOut ? ' disabled style="opacity: .45; cursor: not-allowed; filter: none;"' : ''}>${icon('cart', 30)}Buy Now</button>
        <label class="gift" style="cursor: pointer;"><input type="checkbox" id="gift" style="accent-color: var(--focus); width: 18px; height: 18px;"><span>Add gift wrapping @ <b>Rs.149</b></span></label>
        <div class="offer"><div class="offer__head">Free shipping on this order<span>%</span></div><div class="offer__body"><span id="offer-text"></span><a href="${url.shipping}" style="white-space: nowrap; margin-left: 12px;">Details ›</a></div></div>
        <div class="assure">
          <a class="assure__i" href="${url.shipping}">${icon('truck', 28)}<b>Fast delivery</b><span>3–5 working days</span></a>
          <a class="assure__i" href="${url.warranty}">${icon('medal', 28)}<b>Warranty</b><span>${premium ? 'Up to 2 years' : '6 months'}</span></a>
          <a class="assure__i" href="${url.returns}">${icon('shield', 28)}<b>Easy returns</b><span>30-day money-back</span></a>
        </div>
        <div class="highlights"><div class="eyebrow" style="display: block;">Key highlights</div>${HIGHLIGHTS.map(([t, s]) => `<div><i></i><span><strong>${esc(t)}</strong> — ${esc(s)}</span></div>`).join('')}</div>
        <div class="pays"><span style="padding: 0; background: none; color: var(--muted); font-weight: 500;">Secure checkout</span>${['VISA', 'MasterCard', 'JazzCash', 'EasyPaisa', 'COD'].map(m => `<span>${m}</span>`).join('')}</div>
      </div>
    </section>

    <div class="pdtabs" id="pdtabs" data-sticky-offset><nav class="pdtabs__in" aria-label="Product sections">
      ${[['pd-overview', 'Overview'], ['pd-specs', 'Specs'], ['pd-reviews', 'Reviews'], ['pd-faqs', 'FAQs']].map(([h, l], i) => `<a class="chip" href="#${h}" data-jump aria-current="${i === 0}">${l}</a>`).join('')}
    </nav></div>

    <section class="overview pdsec" id="pd-overview" aria-labelledby="ov-h">
      <div class="overview__head"><h2 id="ov-h">${esc(head[0])} <b>${esc(head[1])}</b></h2><p>${esc(OVERVIEW)}</p></div>
      <div class="stats">${STATS.map((s, i) => { const b = STAT_BG[i % 4]; return `<div class="pd-stat ${b.cls}" style="background: ${b.bg}; color: ${b.fg};"><span class="pd-stat__v">${esc(s.v)}</span><div style="display: flex; flex-direction: column; gap: 6px;"><span class="pd-stat__t">${esc(s.t)}</span><span class="pd-stat__s">${esc(s.s)}</span></div></div>`; }).join('')}</div>
    </section>

    <section class="split pdsec" id="pd-specs" aria-labelledby="sp-h">
      <h2 class="grad-h" id="sp-h">Tech specs</h2>
      <div class="panel-list">${SPECS.map(([k, v]) => `<div class="specs-row"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('')}</div>
    </section>

    <section class="split pdsec" id="pd-reviews" aria-labelledby="rv-h">
      <h2 class="grad-h" id="rv-h">Reviews</h2>
      <div class="panel-list reviews-box">
        <span class="stars" style="color: var(--star); -webkit-text-stroke: 0;" aria-label="Rated ${ratingOf(p)} of 5">★★★★★</span>
        <h3>${ratingOf(p)} out of 5 · ${reviewsOf(p)} reviews</h3>
        <p>Bought ${esc(code(p))}? Tell other shoppers how it fits and sounds.</p>
        <button type="button" class="btn-pill" data-review>Write a review</button>
      </div>
    </section>

    <section class="split pdsec" id="pd-faqs" aria-labelledby="fq-h">
      <h2 class="grad-h" id="fq-h">FAQs</h2>
      <div><div class="panel-list" id="pd-faq-list"></div><p class="meta-line" style="margin: 14px 0 0;">More answers in the <a href="${url.help}">Help Center</a> · <a href="${url.manuals}">e-Manuals</a></p></div>
    </section>

    <div class="rail-wrap" id="related"></div>

    <div class="buybar" id="buybar" aria-hidden="true">
      <div class="buybar__art">${art(p.art, { alt: '' })}</div>
      <div class="buybar__txt"><span class="buybar__t">${esc(p.title)}</span><span class="buybar__p"><b>${esc(p.priceText)}</b>${p.wasText ? `<s>${esc(p.wasText)}</s>` : ''}</span></div>
      <button type="button" class="btn-buy" data-add tabindex="-1"${p.soldOut ? ' disabled' : ''}>${icon('cart', 24)}${p.soldOut ? 'Sold out' : 'Add to cart'}</button>
    </div>`;

  /* ---------- Gallery ---------- */
  let img = 0;
  const thumbs = [...$('thumbs').children];
  const showImg = i => {
    img = (i + views.length) % views.length;
    const stage = $('stage'), old = stage.querySelector('svg, img');
    old.insertAdjacentHTML('beforebegin', viewMarkup(views[img]));
    old.remove();
    thumbs.forEach((t, k) => t.setAttribute('aria-current', k === img));
  };
  $('stage').addEventListener('click', e => { const b = e.target.closest('[data-img]'); if (b) showImg(img + +b.dataset.img); });
  $('thumbs').addEventListener('click', e => { const b = e.target.closest('.thumb'); if (b) showImg(thumbs.indexOf(b)); });

  /* ---------- Colour, quantity, buy ---------- */
  $('swatches').addEventListener('click', e => {
    const b = e.target.closest('.sw-tile');
    if (!b) return;
    $('swatches').querySelectorAll('.sw-tile').forEach(x => x.setAttribute('aria-checked', x === b));
    $('color-name').textContent = colors[+b.dataset.i].name;
  });
  let qty = 1;
  const paintOffer = () => {
    const left = 40000 - p.price * qty;
    $('offer-text').textContent = left > 0
      ? `Orders above Rs.40,000 ship free nationwide. Add ${WU.D.rs(left)} more to qualify.`
      : 'Great news — this order qualifies for free nationwide shipping.';
  };
  $('buybox').addEventListener('click', e => {
    const q = e.target.closest('[data-q]');
    if (!q) return;
    qty = Math.min(10, Math.max(1, qty + +q.dataset.q));
    $('qty').textContent = qty;
    paintOffer();
  });
  paintOffer();
  document.addEventListener('click', e => {
    if (e.target.closest('[data-add]')) add(p.id, qty);
    if (e.target.closest('[data-buy]')) { add(p.id, qty); setTimeout(() => toast('Checkout is coming soon — your bag is saved'), 1600); }
    if (e.target.closest('[data-review]')) toast('Reviews open soon — thanks for buying WisdomUp');
  });
  $('gift').addEventListener('change', e => toast(e.target.checked ? 'Gift wrapping added (Rs.149)' : 'Gift wrapping removed'));

  /* ---------- Tabs, accordion, related ---------- */
  mountAccordion($('pd-faq-list'), FAQS, { idPrefix: 'pdfaq' });
  const related = D.products.filter(x => x.cat === p.cat && x.id !== p.id && !x.soldOut);
  mountRail($('related'), {
    title: 'You may also like',
    items: (related.length >= 3 ? related : related.concat(D.products.filter(x => x.tabs.includes('best') && x.id !== p.id && !related.includes(x)))).slice(0, 8),
    allHref: url.cat(p.cat), allLabel: 'Shop ' + p.cat.toLowerCase(),
  });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-jump]');
    if (!a) return;
    e.preventDefault();
    scrollToEl($(a.getAttribute('href').slice(1)));
  });
  const SECS = ['pd-overview', 'pd-specs', 'pd-reviews', 'pd-faqs'];
  function onScroll() {
    let cur = SECS[0];
    SECS.forEach(s => { if ($(s).getBoundingClientRect().top < 260) cur = s; });
    $('pdtabs').querySelectorAll('.chip').forEach(c => c.setAttribute('aria-current', c.getAttribute('href') === '#' + cur));
    const show = $('buybox').getBoundingClientRect().bottom < 0 && $('footer').getBoundingClientRect().top > innerHeight;
    $('buybar').classList.toggle('is-on', show);
    $('buybar').setAttribute('aria-hidden', !show);
    $('buybar').querySelector('button').tabIndex = show ? 0 : -1;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('wu-nav', e => $('pdtabs').classList.toggle('is-up', e.detail.hidden));
  onScroll();
})();
