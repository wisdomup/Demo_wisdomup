// WisdomUp — NIGHT home page. Its own layout, separate from the day page (which is wrapped in #day-home and hidden
// while night is on). Built once, the first time night is switched on. Patterns from higgsfield.ai (2026-10-06):
// (shared hero banner from the day page) → promise strip → promo card + department tiles → dense grid (New) → showpiece panel (TS series) →
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
  const head = (h, sub, href, label = 'View all', center = false, id = '') => `
    <header class="nh-head${center ? ' nh-head--center' : ''}">
      <div><h2 class="nh-h"${id ? ` id="${id}"` : ''}>${esc(h)}</h2>${sub ? `<p class="nh-sub">${esc(sub)}</p>` : ''}</div>
      ${href ? `<a class="nh-btn" href="${href}">${esc(label)} ↗</a>` : ''}
    </header>`;
  const tile = p => `
    <article class="nh-tile${p.soldOut ? ' nh-tile--out' : ''}">
      <a class="nh-tile__img" href="${url.product(p.id)}" style="background: ${photoBg(p)};" aria-label="${esc(p.title)}">${img(p)}
        ${p.soldOut ? '<span class="nh-tag nh-tag--grey nh-tile__tag">Sold out</span>' : p.ribbon ? `<span class="nh-tag nh-tile__tag">${esc(p.ribbon)}</span>` : ''}
      </a>
      ${wishBtn(p, 'nh-tile__wish')}
      ${p.soldOut ? '' : `<button type="button" class="nh-tile__add" data-nh-add="${p.id}" aria-label="Add ${esc(p.title)} to cart">${icon('cart', 16)}</button>`}
      <a class="nh-tile__cap" href="${url.product(p.id)}"><b class="nh-tile__p">${esc(p.priceText)}${p.wasText ? ` <s class="nh-tile__was">${esc(p.wasText)}</s>` : ''}</b><span class="nh-tile__n">${esc(p.title)}</span></a>
    </article>`;
  const grid = (items, id) => `<div class="nh-grid"${id ? ` id="${id}"` : ''}>${items.map(tile).join('')}</div>`;

  /* ---------- Live card (redesigned 2026-10-07, "this part looks ugly … make it beautiful"): a stage-lit black panel — badge +
     schedule, the title and the Live page's own line, a countdown to the next show (Friday 8 PM PKT, worked out in Pakistan
     time whatever the visitor's clock says) and a sound-wave strip that moves (still for reduced motion). Facts from live.html. ---------- */
  const PKT = 5 * 36e5;
  const nextShow = () => {
    const now = Date.now(), p = new Date(now + PKT); // p's UTC fields = the time in Pakistan
    let t = Date.UTC(p.getUTCFullYear(), p.getUTCMonth(), p.getUTCDate(), 20) - PKT + ((5 - p.getUTCDay() + 7) % 7) * 864e5;
    if (t <= now) t += 7 * 864e5;
    return t - now;
  };
  const liveCells = () => {
    const ms = nextShow(), pad = n => String(n).padStart(2, '0');
    return [[Math.floor(ms / 864e5), 'Days'], [Math.floor(ms / 36e5) % 24, 'Hours'], [Math.floor(ms / 6e4) % 60, 'Min'], [Math.floor(ms / 1e3) % 60, 'Sec']]
      .map(([v, l]) => `<span class="nh-live__cell"><b>${pad(v)}</b><small>${l}</small></span>`).join('');
  };
  // 56 bars under a soft arch; each one breathes at its own pace (fixed numbers, so every visit looks the same)
  const EQ = Array.from({ length: 56 }, (_, i) => {
    const h = Math.round(22 + 70 * Math.sin(Math.PI * (i + .5) / 56) * (.55 + .45 * Math.abs(Math.sin(i * 1.7))));
    return `<i style="height: ${h}%; --dur: ${(0.9 + ((i * 37) % 9) / 10).toFixed(1)}s; --del: -${(((i * 53) % 17) / 10).toFixed(1)}s;"></i>`;
  }).join('');

  /* ---------- data ---------- */
  const fresh = variety(D.products.filter(p => p.tabs.includes('new')));
  const best = D.products.filter(p => p.tabs.includes('best'));
  const essentials = ['ocd-28', 'sjx-49', 'cdb-17', 'cc-14', 'cj-47', 'ej-ly7', 'tde-18', 'sjx-15', 'yx-28', 'mkf-02', 'cj-46', 'txd-01'].map(P).filter(Boolean);
  const bestRow = best.concat(essentials.filter(p => !best.includes(p)));
  const SERIES = ['ts-11anc', 'ts-12', 'ts-13', 'ts-11', 'ts-10'].map(P).filter(Boolean);
  const MICS = ['mkf-02', 'mkf-01'].map(P).filter(Boolean);
  // the bulk panel's coverflow (a working carousel since 2026-10-07): 11 real products; 7 show on wide screens, 5 on phones, the rest wait out of sight
  const FAN = ['cj-47', 'sjx-49', 'ts-4', 'ocd-28', 'cdb-17', 'cc-14', 'ej-ly7', 'cj-46', 'sjx-57', 'ts-2', 'ocd-26'].map(P).filter(Boolean);
  const BANDS = [['u1', 'Under Rs.1,000', WU.budget.u1], ['u2', 'Under Rs.2,000', WU.budget.u2], ['u5', 'Under Rs.5,000', WU.budget.u5]]; // non-overlapping bands from common.js
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
  const bandAll = () => `View all ${D.products.filter(BANDS[band][2]).length} ${esc(BANDS[band][1].replace(/^Under/, 'under'))} ↗`;
  const paintBand = () => {
    $('nh-budget-grid').outerHTML = grid(bandItems(), 'nh-budget-grid');
    WU.staggerCards($('nh-budget-grid'));
    $('nh-budget-all').href = url.products + '?price=' + BANDS[band][0];
    $('nh-budget-all').innerHTML = bandAll();
    host.querySelector('.nh-seg').style.setProperty('--i', band);
    host.querySelectorAll('[data-nh-band]').forEach((b, i) => b.setAttribute('aria-pressed', i === band));
    paintWish();
  };

  /* ---------- build ---------- */
  function build() {
    host.innerHTML = `
    <div class="nh">
      <section class="nh-stripwrap" aria-label="Our promises">
        <div class="nh-strip">${[['truck', 'Delivery to every city in Pakistan', url.shipping], ['smile', '7-day money-back guarantee', url.returns], ['medal', 'WisdomUp brand warranty', url.warranty], ['shield', 'Cash on Delivery · JazzCash · EasyPaisa', url.help]].map(([ic, t, h]) => `<a href="${h}">${icon(ic, 22)}<span>${esc(t)}</span></a>`).join('')}</div>
      </section>
      <section aria-label="Shop by department">
        <div class="nh-promo">
          <div class="nh-live" role="group" aria-labelledby="nh-live-h">
            <div class="nh-live__eq" aria-hidden="true">${EQ}</div>
            <div class="nh-live__top"><span class="nh-live__badge"><i></i>Live shopping</span><span class="nh-live__when">Every Friday · 8 PM PKT</span></div>
            <div class="nh-live__body">
              <div class="nh-live__copy">
                <h2 class="nh-live__h" id="nh-live-h">WisdomUp Live</h2>
                <p class="nh-live__p">Watch it demoed. Add it to cart mid-stream — live-only prices on whatever the host is holding.</p>
              </div>
              <div class="nh-live__clock">
                <span class="nh-live__k" id="nh-live-k">Next show in</span>
                <div class="nh-live__cells" id="nh-live-cd" role="timer" aria-labelledby="nh-live-k">${liveCells()}</div>
              </div>
              <div class="nh-live__row"><a class="nh-btn nh-btn--primary" href="${url.live}">Watch the show</a><a class="nh-btn nh-btn--ghost nh-btn--lg" href="${url.filter('new')}">Shop new arrivals</a></div>
            </div>
          </div>
          <div class="nh-feats">${DEPTS.map(d => { const { ps, rep, name } = deptInfo(d); if (!ps.length) return ''; const min = Math.min(...ps.map(p => p.price)); return `
            <a class="nh-feat" href="${url.dept(d.id)}">
              <span class="nh-feat__ic" style="background: ${rep ? photoBg(rep) : ''};">${rep ? img(rep) : ''}</span>
              <span class="nh-feat__t">${esc(name)}</span>
              <span class="nh-feat__s">${ps.length} products · from ${esc(rs(min))}</span>
            </a>`; }).join('')}</div>
        </div>
      </section>
      <section aria-labelledby="nh-new-h">
        ${head('New for 2026', `${fresh.length} new launches — the latest Bluetooth 6.0 earbuds, neckbands, party speakers and fast chargers.`, url.filter('new'), 'View all', false, 'nh-new-h')}
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
        ${head('Best sellers & essentials', 'What customers buy most, plus the chargers, cables and power banks everyone needs.', url.filter('best'), 'View all', false, 'nh-best-h')}
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
      <section class="nh-budget" aria-labelledby="nh-budget-h">
        <header class="nh-head nh-head--budget">
          <div class="nh-head__t"><h2 class="nh-h" id="nh-budget-h">Shop by budget</h2><p class="nh-sub">Real prices, every product with warranty and Cash on Delivery.</p></div>
          <div class="nh-seg" role="group" aria-label="Budget" style="--i: 0;"><span class="nh-seg__thumb" aria-hidden="true"></span>${BANDS.map(([k, label], i) => { const [w, ...v] = label.split(' '); return `<button type="button" data-nh-band="${i}" aria-pressed="${i === 0}" aria-label="${esc(label)}"><span class="nh-seg__k">${esc(w)}</span><span class="nh-seg__v">${esc(v.join(' '))}</span></button>`; }).join('')}</div>
        </header>
        ${grid(bandItems(), 'nh-budget-grid')}
        <div class="nh-more"><a class="nh-btn nh-btn--ghost" id="nh-budget-all" href="${url.products}?price=u1">${bandAll()}</a></div>
      </section>
      <section aria-label="Bulk orders">
        <div class="nh-fan">
          <span class="nh-tag">Bulk desk</span>
          <h2 class="nh-fan__h">Wholesale, at scale</h2>
          <p class="nh-fan__p">300+ products for distributors, wholesalers, retailers and corporate buyers — Pakistan-ready stock, local fulfilment, warranty-backed.</p>
          <div class="nh-fan__row" id="nh-fan" role="group" aria-roledescription="carousel" aria-label="Bulk range">${FAN.map(p => `<a class="nh-fan__tile" href="${url.product(p.id)}" style="background: ${photoBg(p)};" aria-label="${esc(p.title)}" draggable="false">${img(p)}</a>`).join('')}</div>
          <div class="nh-show__btns"><a class="nh-btn nh-btn--primary" href="${url.bulk}">Order in bulk</a><a class="nh-btn nh-btn--ghost nh-btn--lg" href="${url.corporate}">Corporate gifts</a></div>
        </div>
      </section>
      <section aria-labelledby="nh-explore-h">
        ${head('Explore the range', 'Every department and product type.', null, '', true, 'nh-explore-h')}
        <div class="nh-chips">${DEPTS.map(d => `<a class="nh-chip nh-chip--dept" href="${url.dept(d.id)}">${esc(deptInfo(d).name)}</a>`).join('')}${CATS.map(t => `<a class="nh-chip" href="${url.cat(t)}">${esc((K.types && K.types[t] && K.types[t].name) || typeLabel(t))}</a>`).join('')}</div>
      </section>
      <section aria-labelledby="nh-faq-h" class="nh-faq">
        ${head('Frequently asked', 'Orders, shipping and warranty.', url.help, 'Help Center', true, 'nh-faq-h')}
        <div class="panel-list faq__list" id="nh-faq"></div>
      </section>
    </div>`;
    if (D.faqs && D.faqs.length) mountAccordion($('nh-faq'), D.faqs, { idPrefix: 'nhfaq' });
    mountFan($('nh-fan'));
    setInterval(() => { const el = $('nh-live-cd'); if (el && !host.hidden) el.innerHTML = liveCells(); }, 1000);
    paintWish();
    host.addEventListener('click', e => {
      const addBtn = e.target.closest('[data-nh-add]');
      if (addBtn) {
        e.preventDefault();
        const pr = P(addBtn.dataset.nhAdd);
        if (pr && pr.variants && pr.variants.length > 1) WU.quickAdd(pr.id, addBtn); // options → the quick options panel
        else add(addBtn.dataset.nhAdd, 1, undefined, { open: addBtn.hasAttribute('data-open') });
        return;
      }
      const pick = e.target.closest('[data-nh-pick]');
      if (pick) { showIdx = +pick.dataset.nhPick; paintShow(); return; }
      const b = e.target.closest('[data-nh-band]');
      if (b && +b.dataset.nhBand !== band) { band = +b.dataset.nhBand; paintBand(); }
    });
  }

  /* ---------- Bulk panel coverflow (2026-10-07, "the scroll doesn't work / carousel"): the fan used to be seven frozen tiles. Now the
     tiles glide round a lit centre (the old angles: ±9° / ±20° / ±30°, scale 1.1 → .96 → .9 → .84, faint at the ends), 1000ms on the
     reveal curve; it follows a mouse/finger drag (snaps to the nearest tile, a flick moves one more), a side tile clicked comes to the
     centre (the centre one opens its product), ← → keys step, it loops, and it moves on every 4s — paused on hover, off screen, in a
     hidden tab and for reduced motion. ---------- */
  function mountFan(row) {
    if (!row) return;
    const tiles = [...row.children], N = tiles.length;
    if (N < 2) return;
    const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
    const S = [1.1, .96, .9, .84, .78], R = [0, 9, 20, 30, 36], O = [1, 1, .75, .55, 0]; // scale, rotateY, opacity at |d| = 0…4
    const lerp = (arr, a) => { const i = Math.min(arr.length - 2, Math.floor(a)), t = Math.min(1, a - i); return arr[i] + (arr[i + 1] - arr[i]) * t; };
    let pos = Math.min(3, N - 1), timer = 0, hover = false, seen = false, drag = null, moved = false, last = [];
    const maxVis = () => (window.innerWidth < 768 ? 2 : 3);
    const paint = (animate) => {
      const w = tiles[0].offsetWidth, gap = 12, vis = maxVis();
      // centre-to-centre distance of neighbours shrinks with their scale (so the gaps stay even)
      const X = [0]; for (let i = 1; i <= 5; i++) X[i] = X[i - 1] + w * (S[i - 1] + S[i]) / 2 + gap;
      tiles.forEach((t, k) => {
        let d = k - pos; d = ((d % N) + N + N / 2) % N - N / 2;       // wrapped offset from the centre, −N/2…N/2
        const a = Math.min(4, Math.abs(d)), sign = d < 0 ? -1 : 1;
        const x = sign * lerp(X, a), sc = lerp(S, a), ry = -sign * lerp(R, a);
        const op = a > vis + .5 ? 0 : a > vis ? lerp(O, a) * (vis + .5 - a) * 2 : lerp(O, a);
        const jump = last[k] !== undefined && Math.abs(last[k] - d) > N / 2; // wrapped round the back: never slide across the front
        t.style.transition = (!animate || jump || reduced()) ? 'none' : '';
        t.style.transform = `translateX(${x.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        t.style.opacity = op.toFixed(3);
        t.style.zIndex = String(10 - Math.round(a));
        t.style.pointerEvents = op < .05 ? 'none' : '';
        const centre = Math.round(a * 100) === 0;
        t.classList.toggle('is-center', centre);
        t.tabIndex = centre ? 0 : -1;
        t.setAttribute('aria-hidden', String(op < .05));
        last[k] = d;
      });
    };
    const go = (to, animate = true) => { pos = ((Math.round(to) % N) + N) % N; paint(animate); restart(); };
    const restart = () => { clearTimeout(timer); if (!reduced() && !hover && seen && !document.hidden && !drag) timer = setTimeout(() => go(pos + 1), 4000); };
    // drag / swipe: the row follows the pointer, then snaps
    row.addEventListener('pointerdown', e => { if (e.button !== 0) return; drag = { x: e.clientX, t: performance.now(), start: pos, id: e.pointerId }; moved = false; clearTimeout(timer); });
    row.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!moved && Math.abs(dx) < 6) return;
      if (!moved) { moved = true; row.classList.add('is-drag'); try { row.setPointerCapture(drag.id); } catch (err) { /* released */ } }
      const step = tiles[0].offsetWidth + 12;
      pos = drag.start - dx / step; paint(false);
    });
    const release = e => {
      if (!drag) return;
      const d = drag; drag = null; row.classList.remove('is-drag');
      if (!moved) return restart();
      const dx = (e && e.clientX != null ? e.clientX : d.x) - d.x, v = dx / Math.max(1, performance.now() - d.t);
      const flick = Math.abs(v) > .5 ? -Math.sign(v) * .5 : 0;           // a quick flick carries on one more tile
      go(pos + flick);
    };
    row.addEventListener('pointerup', release);
    row.addEventListener('pointercancel', release);
    // a click right after a drag never opens a tile; a side tile glides to the centre instead of opening
    row.addEventListener('click', e => {
      const t = e.target.closest('.nh-fan__tile'); if (!t) return;
      if (moved) { e.preventDefault(); moved = false; return; }
      if (!t.classList.contains('is-center')) { e.preventDefault(); const k = tiles.indexOf(t); let d = k - pos; d = ((d % N) + N + N / 2) % N - N / 2; go(pos + d); }
    });
    row.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault(); go(pos + (e.key === 'ArrowRight' ? 1 : -1));
      requestAnimationFrame(() => { const c = row.querySelector('.is-center'); if (c) c.focus({ preventScroll: true }); });
    });
    row.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hover = true; clearTimeout(timer); } });
    row.addEventListener('pointerleave', () => { hover = false; restart(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { seen = es[0].isIntersecting; restart(); }, { threshold: .4 }).observe(row);
    document.addEventListener('visibilitychange', restart);
    window.addEventListener('resize', () => paint(false));
    paint(false);
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
