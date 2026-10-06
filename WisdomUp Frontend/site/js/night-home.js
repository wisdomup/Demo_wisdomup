// WisdomUp — NIGHT home page. Its own layout, separate from the day page (which is wrapped in #day-home and hidden
// while night is on). Built once, the first time night is switched on. Patterns from higgsfield.ai (2026-10-06):
// hero tile trio → promise strip → promo card + department tiles → dense grid (New) → showpiece panel (TS series) →
// dense grid (Best sellers) → glow panel (creator mics) → budget segmented control + grid → fanned bulk panel →
// chip cloud → FAQ → (shared red footer). Every product fact comes from js/catalog.js.
(function () {
  const { D, $, esc, url, add, isNight, wishBtn, paintWish, photoBg, photoFit, mountAccordion, DEPTS, CATS, typeLabel } = WU;
  const host = $('night-home'), day = $('day-home');
  if (!host || !day) return;
  const P = id => D.byId(id);
  const rs = D.rs;
  const K = window.WU_SEO || {};
  const byPrice = (a, b) => a.price - b.price;
  // One product per type first (so a row shows the range), then the rest
  const variety = list => { const first = list.filter((p, i) => list.findIndex(x => x.type === p.type) === i); return first.concat(list.filter(p => !first.includes(p))); };
  const img = (p, big) => `<img src="${big ? p.src : p.thumb}" alt="" loading="lazy" style="width: 100%; height: 100%; ${photoFit(p)}">`;

  /* ---------- pieces ---------- */
  const head = (h, sub, href, label = 'View all', center = false) => `
    <header class="nh-head${center ? ' nh-head--center' : ''}">
      <div><h2 class="nh-h">${esc(h)}</h2>${sub ? `<p class="nh-sub">${esc(sub)}</p>` : ''}</div>
      ${href ? `<a class="nh-btn" href="${href}">${esc(label)} ↗</a>` : ''}
    </header>`;
  const tile = p => `
    <article class="nh-tile${p.soldOut ? ' nh-tile--out' : ''}">
      <a class="nh-tile__img" href="${url.product(p.id)}" style="background: ${photoBg(p)};" aria-label="${esc(p.title)}">${img(p)}
        ${p.soldOut ? '<span class="nh-tag nh-tag--grey nh-tile__tag">Sold out</span>' : p.ribbon ? `<span class="nh-tag nh-tile__tag">${esc(p.ribbon)}</span>` : ''}
      </a>
      ${wishBtn(p, 'nh-tile__wish')}
      ${p.soldOut ? '' : `<button type="button" class="nh-tile__add" data-nh-add="${p.id}" aria-label="Add ${esc(p.title)} to cart">${icon('cart', 16)}</button>`}
      <a class="nh-tile__cap" href="${url.product(p.id)}"><b class="nh-tile__p">${esc(p.priceText)}</b><span class="nh-tile__n">${esc(p.title)}</span></a>
    </article>`;
  const grid = (items, id) => `<div class="nh-grid"${id ? ` id="${id}"` : ''}>${items.map(tile).join('')}</div>`;

  /* ---------- data ---------- */
  const TRIO = [['ts-11anc', 'New'], ['yx-28', ''], ['cdb-18', '']].map(([id, tag]) => [P(id), tag]).filter(x => x[0]);
  const fresh = variety(D.products.filter(p => p.tabs.includes('new')));
  const best = D.products.filter(p => p.tabs.includes('best'));
  const essentials = ['ocd-28', 'sjx-49', 'cdb-17', 'cc-14', 'cj-47', 'ej-ly7', 'tde-18', 'sjx-15', 'yx-28', 'mkf-02', 'cj-46', 'txd-01'].map(P).filter(Boolean);
  const bestRow = best.concat(essentials.filter(p => !best.includes(p)));
  const SERIES = ['ts-11anc', 'ts-12', 'ts-13', 'ts-11', 'ts-10'].map(P).filter(Boolean);
  const MICS = ['mkf-02', 'mkf-01'].map(P).filter(Boolean);
  const FAN = ['cj-47', 'sjx-49', 'ts-4', 'ocd-28', 'cdb-17', 'cc-14', 'ej-ly7'].map(P).filter(Boolean);
  const BANDS = [['u1', 'Under Rs.1,000', p => p.price < 1000], ['u2', 'Under Rs.2,000', p => p.price < 2000], ['u5', 'Under Rs.5,000', p => p.price < 5000]];
  const deptInfo = d => {
    const ps = D.products.filter(p => d.types.includes(p.type));
    const rep = ['audio:ts-11anc', 'charging:cdb-18', 'cables:sjx-59', 'car:cj-47', 'stands:cj-06', 'computer:jp-03', 'storage:usb-01', 'care:txd-01'].map(s => s.split(':')).find(([k]) => k === d.id);
    return { ps, rep: (rep && P(rep[1])) || ps[0], name: (K.depts && K.depts[d.id] && K.depts[d.id].name) || d.label };
  };

  /* ---------- showpiece state ---------- */
  let showIdx = 0;
  const showCopy = p => `
    <span class="nh-tag">${esc(p.ribbon || 'TS series')}</span>
    <h2 class="nh-show__h">${esc(p.code)}</h2>
    <p class="nh-show__t">${esc(p.title)}</p>
    <p class="nh-show__meta">${esc(p.meta)}</p>
    <p class="nh-show__price">${esc(p.priceText)}</p>
    <div class="nh-show__btns">${p.soldOut ? '<span class="nh-btn nh-btn--ghost nh-btn--lg" aria-disabled="true">Sold out</span>' : `<button type="button" class="nh-btn nh-btn--primary" data-nh-add="${p.id}" data-open>${icon('cart', 20)} Add to cart</button>`}<a class="nh-btn nh-btn--ghost nh-btn--lg" href="${url.product(p.id)}">Details</a></div>`;
  const showMedia = p => `<div class="nh-show__media" style="background: ${photoBg(p)};">${img(p, true)}</div>`;
  const paintShow = () => {
    const p = SERIES[showIdx];
    $('nh-show-copy').innerHTML = showCopy(p);
    $('nh-show-media').outerHTML = showMedia(p).replace('class="nh-show__media"', 'class="nh-show__media" id="nh-show-media"');
    host.querySelectorAll('[data-nh-pick]').forEach((b, i) => b.setAttribute('aria-pressed', i === showIdx));
  };

  /* ---------- budget state ---------- */
  let band = 0;
  const bandItems = () => variety(D.products.filter(BANDS[band][2]).sort(byPrice)).slice(0, 12);
  const paintBand = () => {
    $('nh-budget-grid').outerHTML = grid(bandItems(), 'nh-budget-grid');
    $('nh-budget-all').href = url.products + '?price=' + BANDS[band][0];
    host.querySelectorAll('[data-nh-band]').forEach((b, i) => b.setAttribute('aria-pressed', i === band));
    paintWish();
  };

  /* ---------- build ---------- */
  function build() {
    host.innerHTML = `
    <div class="nav-spacer"></div>
    <div class="nh">
      <section class="nh-top" aria-label="Featured">
        <div class="nh-trio">${TRIO.map(([p, tag]) => `
          <a class="nh-trio__item" href="${url.product(p.id)}">
            <div class="nh-trio__media" style="background: ${photoBg(p)};">${img(p, true)}${tag ? `<span class="nh-tag">${esc(tag)}</span>` : ''}</div>
            <h3 class="nh-trio__t">${esc(p.title)}</h3><p class="nh-trio__s">${esc(p.meta)} · ${esc(p.priceText)}</p>
          </a>`).join('')}
        </div>
      </section>
      <section class="nh-stripwrap" aria-label="Our promises">
        <div class="nh-strip">${[['truck', 'Delivery to every city in Pakistan', url.shipping], ['smile', '7-day money-back guarantee', url.returns], ['medal', 'WisdomUp brand warranty', url.warranty], ['shield', 'Cash on Delivery · JazzCash · EasyPaisa', url.help]].map(([ic, t, h]) => `<a href="${h}">${icon(ic, 22)}<span>${esc(t)}</span></a>`).join('')}</div>
      </section>
      <section aria-label="Shop by department">
        <div class="nh-promo">
          <a class="nh-live" href="${url.live}">
            <span class="nh-tag nh-live__tag">Live shopping</span>
            <h2 class="nh-live__h">WisdomUp Live</h2>
            <p class="nh-live__p">Watch products demoed live and add them to your cart mid-stream at live-only prices.</p>
            <div class="nh-live__row"><span class="nh-btn nh-btn--primary">Watch the show</span><span class="nh-live__when">Fridays · 8 PM PKT</span></div>
          </a>
          <div class="nh-feats">${DEPTS.map(d => { const { ps, rep, name } = deptInfo(d); if (!ps.length) return ''; const min = Math.min(...ps.map(p => p.price)); return `
            <a class="nh-feat" href="${url.dept(d.id)}">
              <span class="nh-feat__ic" style="background: ${rep ? photoBg(rep) : ''};">${rep ? img(rep) : ''}</span>
              <span class="nh-feat__t">${esc(name)}</span>
              <span class="nh-feat__s">${ps.length} products · from ${esc(rs(min))}</span>
            </a>`; }).join('')}</div>
        </div>
      </section>
      <section aria-labelledby="nh-new-h">
        ${head('New for 2026', `${fresh.length} new launches — the latest Bluetooth 6.0 earbuds, neckbands, party speakers and fast chargers.`, url.filter('new'))}
        ${grid(fresh.slice(0, 12))}
        <div class="nh-more"><a class="nh-btn nh-btn--ghost" href="${url.filter('new')}">View all ${fresh.length} new products ↗</a></div>
      </section>
      ${SERIES.length ? `
      <section aria-label="TS true wireless series">
        <div class="nh-show">
          <div class="nh-show__copy" id="nh-show-copy">${showCopy(SERIES[0])}</div>
          ${showMedia(SERIES[0]).replace('class="nh-show__media"', 'class="nh-show__media" id="nh-show-media"')}
          <div class="nh-show__thumbs" role="tablist" aria-label="Models">${SERIES.map((p, i) => `<button type="button" class="nh-show__thumb" data-nh-pick="${i}" aria-pressed="${i === 0}" style="background: ${photoBg(p)};">${img(p)}<span>${esc(p.code)}</span></button>`).join('')}</div>
        </div>
      </section>` : ''}
      <section aria-labelledby="nh-best-h">
        ${head('Best sellers & essentials', 'What customers buy most, plus the chargers, cables and power banks everyone needs.', url.filter('best'))}
        ${grid(bestRow.slice(0, 12))}
      </section>
      ${MICS.length ? `
      <section aria-label="Creator microphones">
        <div class="nh-glow">
          <span class="nh-tag">Creator tools</span>
          <h2 class="nh-glow__h">Clean audio, straight from your phone</h2>
          <p class="nh-glow__p">Clip-on wireless microphones with a 2.4GHz link, under 20ms latency and 360° pickup — plug the receiver into your phone and record.</p>
          <a class="nh-btn nh-btn--primary" href="${url.cat('microphones')}">Shop wireless mics</a>
          ${MICS.map((p, i) => `<a class="nh-glow__card nh-glow__card--${i ? 'b' : 'a'}" href="${url.product(p.id)}"><img src="${p.thumb}" alt="" style="background: ${photoBg(p)};"><span>${esc(p.code)}<small>${esc(p.priceText)}</small></span></a>`).join('')}
        </div>
      </section>` : ''}
      <section aria-labelledby="nh-budget-h">
        ${head('Shop by budget', 'Real prices, every product with warranty and Cash on Delivery.', null)}
        <div class="nh-seg" role="group" aria-label="Budget" style="margin: -8px 0 16px;">${BANDS.map(([k, label], i) => `<button type="button" data-nh-band="${i}" aria-pressed="${i === 0}">${esc(label)}</button>`).join('')}</div>
        ${grid(bandItems(), 'nh-budget-grid')}
        <div class="nh-more"><a class="nh-btn nh-btn--ghost" id="nh-budget-all" href="${url.products}?price=u1">View all ↗</a></div>
      </section>
      <section aria-label="Bulk orders">
        <div class="nh-fan">
          <span class="nh-tag">Bulk desk</span>
          <h2 class="nh-fan__h">Wholesale, at scale</h2>
          <p class="nh-fan__p">300+ products for distributors, wholesalers, retailers and corporate buyers — Pakistan-ready stock, local fulfilment, warranty-backed.</p>
          <div class="nh-fan__row">${FAN.map(p => `<a class="nh-fan__tile" href="${url.product(p.id)}" style="background: ${photoBg(p)};" aria-label="${esc(p.title)}">${img(p)}</a>`).join('')}</div>
          <div class="nh-show__btns"><a class="nh-btn nh-btn--primary" href="${url.bulk}">Order in bulk</a><a class="nh-btn nh-btn--ghost nh-btn--lg" href="${url.corporate}">Corporate gifts</a></div>
        </div>
      </section>
      <section aria-labelledby="nh-explore-h">
        ${head('Explore the range', 'Every department and product type.', null, '', true)}
        <div class="nh-chips">${DEPTS.map(d => `<a class="nh-chip nh-chip--dept" href="${url.dept(d.id)}">${esc(deptInfo(d).name)}</a>`).join('')}${CATS.map(t => `<a class="nh-chip" href="${url.cat(t)}">${esc((K.types && K.types[t] && K.types[t].name) || typeLabel(t))}</a>`).join('')}</div>
      </section>
      <section aria-labelledby="nh-faq-h" class="nh-faq">
        ${head('Frequently asked', 'Orders, shipping and warranty.', url.help, 'Help Center', true)}
        <div class="panel-list faq__list" id="nh-faq"></div>
      </section>
    </div>`;
    if (D.faqs && D.faqs.length) mountAccordion($('nh-faq'), D.faqs, { idPrefix: 'nhfaq' });
    paintWish();
    host.addEventListener('click', e => {
      const addBtn = e.target.closest('[data-nh-add]');
      if (addBtn) { e.preventDefault(); add(addBtn.dataset.nhAdd, 1, undefined, { open: addBtn.hasAttribute('data-open') }); return; }
      const pick = e.target.closest('[data-nh-pick]');
      if (pick) { showIdx = +pick.dataset.nhPick; paintShow(); return; }
      const b = e.target.closest('[data-nh-band]');
      if (b) { band = +b.dataset.nhBand; paintBand(); }
    });
  }

  /* ---------- switch ---------- */
  function apply() {
    const night = isNight();
    day.hidden = night;
    host.hidden = !night;
    if (night && !host.dataset.built) { build(); host.dataset.built = '1'; }
    requestAnimationFrame(() => { window.dispatchEvent(new Event('resize')); WU.placeNav(); });
  }
  window.addEventListener('wu-theme', apply);
  apply();
})();
