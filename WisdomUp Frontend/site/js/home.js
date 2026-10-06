// WisdomUp — Home (HomeEditorial) page. Shared chrome, cards, rails and hero come from common.js.
(function () {
  const { D, $, esc, reduced, vw, code, url, add, btnBuy, mountRail, mountHero, mountAccordion, SLIDE_T } = WU;

  // Studio photo (catalogue thumb) framed on a background sampled from the photo
  const WIDE = 'object-fit: cover; object-position: 50% 50%;'; // landscape frames show the whole packshot
  const photo = (p, cls = '', big = false, fit) => p ? `<span class="ph ${cls}" style="background: ${WU.photoBg(p)};"><img src="${big ? p.src : p.thumb}" alt="" loading="lazy" style="${fit || WU.photoFit(p)}"></span>` : '';
  const P = id => D.byId(id);
  // Quick chips → a department, a product type or a filter on the All Products page (photo = representative product)
  const CHIPS = [ // exactly 10, in this order and with these labels (user's list, 2026-10-06)
    ['New Arrival', 'ts-12', url.filter('new')], ['Best Seller', 'ts-4', url.filter('best')], ['Under Rs.1,000', 'sjx-57', url.products + '?price=u1'],
    ['Earbud', 'ts-11anc', url.cat('earbuds')], ['Headphone', 'tde-18', url.cat('headphones')], ['Speaker', 'yx-28', url.cat('speakers')],
    ['Powerbank', 'cdb-18', url.cat('power-banks')], ['Charger', 'ocd-28', url.cat('wall-chargers')], ['Cable', 'sjx-49', url.cat('charging-cables')],
    ['Shaver', 'txd-01', url.cat('shavers')],
  ];
  // Series spotlight: the TS true wireless family
  const SERIES = ['ts-11anc', 'ts-12', 'ts-13', 'ts-11', 'ts-10'].filter(P);
  const PROMOS = [
    { id: 'cj-46', kicker: '3-in-1 wireless charger', chips: ['15W phone', 'Earbuds + watch'], bg: 'linear-gradient(120deg,#1c2a44,#0a0f1a)' },
    { id: 'cdb-18', kicker: 'Magnetic power bank', chips: ['10,000mAh', '15W wireless'], bg: 'linear-gradient(120deg,#1b1b1b,#050505)' },
    { id: 'cc-16', kicker: 'Fast car charger', chips: ['33W PD', 'USB + USB-C'], bg: 'linear-gradient(120deg,#4a2a18,#a4582a)' },
    { id: 'ocd-28', kicker: 'Wall charger + cable', chips: ['20W', 'EU or UK plug'], bg: 'linear-gradient(120deg,#0f2d2a,#050a0a)' },
    { id: 'sjx-59', kicker: 'Laptop-ready cable', chips: ['240W', 'USB-C to USB-C'], bg: 'linear-gradient(120deg,#22304a,#0b0f18)' },
    { id: 'tde-18', kicker: 'ANC headphones', chips: ['ANC', '40 hrs'], bg: 'linear-gradient(120deg,#3a0f12,#0d0505)' },
    { id: 'mkf-02', kicker: 'Creator wireless mic', chips: ['2.4GHz', '<20ms latency'], bg: 'linear-gradient(120deg,#2a2622,#0d0c0b)' },
    { id: 'yx-31', kicker: 'Party speaker', chips: ['220W', 'LED lights'], bg: 'linear-gradient(120deg,#2a1640,#120a24)' },
    { id: 'lfj-09', kicker: 'Grooming kit', chips: ['Clipper + shaver', 'Charging base'], bg: 'linear-gradient(120deg,#33401c,#0d1206)' },
  ].filter(t => P(t.id));
  const LOOP = [
    { id: 'ts-11anc', kicker: 'Noise cancelling · TS-11ANC', title: 'Silence, on demand.', sub: 'Active noise cancelling and Bluetooth 6.0 in a pocket-sized case.', tag: 'Earbuds', bg: 'linear-gradient(120deg,#22304a,#0b0f18)' },
    { id: 'yx-28', kicker: 'Party speaker · YX-28', title: 'Bring the venue home.', sub: '150W, an RGB light show and an 18,000mAh battery.', tag: 'Speakers', bg: 'linear-gradient(120deg,#2a1640,#120a24)' },
    { id: 'os-6', kicker: 'Open-ear · OS-6', title: 'Hear the city. Keep the music.', sub: 'Open-ear comfort with Bluetooth 6.0.', tag: 'Earbuds', bg: 'linear-gradient(120deg,#3a0f12,#0d0505)' },
    { id: 'cdb-18', kicker: 'Magnetic power bank · CDB-18', title: 'Snap on. Power up.', sub: '15W magnetic wireless charging with a built-in watch charger.', tag: 'Power Banks', bg: 'linear-gradient(120deg,#1c2a44,#0a0f1a)' },
    { id: 'txd-01', kicker: 'Electric shaver · TXD-01', title: 'A closer, cleaner shave.', sub: 'Five stainless steel blades and 100+ minutes per charge.', tag: 'Grooming', bg: 'linear-gradient(120deg,#2a2622,#0d0c0b)' },
  ].filter(s => P(s.id)).map(s => ({ ...s, ctaLabel: `Shop ${P(s.id).code} · ${P(s.id).priceText}` }));
  const TAG_SVG = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M1 2.2V7.4c0 .4.2.8.5 1.1l6.9 6.9a1.5 1.5 0 0 0 2.1 0l4.9-4.9a1.5 1.5 0 0 0 0-2.1L8.5 1.5A1.6 1.6 0 0 0 7.4 1H2.2C1.5 1 1 1.5 1 2.2Zm3.5 1.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"></path></svg>';

  WU.initChrome();

  /* ---------- Quick-filter chips (marquee on narrow non-touch; swipe carousel on touch) ---------- */
  const TOUCH = matchMedia('(hover: none) and (pointer: coarse)');
  let chipsDoubled = null;
  function renderChips() {
    const dbl = vw() < 640 && !TOUCH.matches;
    if (dbl === chipsDoubled) return;
    chipsDoubled = dbl;
    const list = dbl ? CHIPS.concat(CHIPS) : CHIPS;
    $('quick-chips').innerHTML = list.map(([label, id, href], i) => `
      <a class="chip" href="${href}"${dbl && i >= CHIPS.length ? ' tabindex="-1" aria-hidden="true"' : ''}>
        <span class="quick__in"><span class="quick__art quick__art--photo">${photo(P(id))}</span><span>${esc(label)}</span></span>
      </a>`).join('');
  }
  renderChips();
  window.addEventListener('resize', renderChips);

  /* ---------- Lifestyle hero ---------- */
  mountHero($('hero'));

  /* ---------- Editorial loop carousels (infinite, 3× slide copies) ---------- */
  const LN = LOOP.length;
  // Three copies of the carousel down the page; each starts on a different slide so they never show the same product at once
  const loops = [['car1', 0], ['car2', 2], ['car3', 4]].map(([k, start]) => {
    const root = $(k);
    const st = { i: LN + start % LN, play: true };
    root.innerHTML = `
      <div class="loop__track">
        ${[0, 1, 2].flatMap(c => LOOP.map(s => `
          <article class="loop__slide" style="background: ${s.bg};"${c !== 1 ? ' aria-hidden="true"' : ''}>
            <div class="loop__shade"></div>
            <div class="loop__copy">
              <div class="loop__kicker">${esc(s.kicker)}</div>
              <h3 class="loop__title">${esc(s.title)}</h3>
              <p class="loop__sub">${esc(s.sub)}</p>
              <a class="loop__cta" href="${url.product(s.id)}"${c !== 1 ? ' tabindex="-1"' : ''}>${esc(s.ctaLabel)}</a>
            </div>
            <div class="loop__art" aria-hidden="true">${photo(P(s.id), 'loop__ph', true)}</div>
            <span class="loop__tag">${TAG_SVG}${esc(s.tag)}</span>
          </article>`)).join('')}
      </div>
      <div class="loop__ctrls">
        <button type="button" class="loop__btn" data-go="-1" aria-label="Previous slide"><svg width="40%" height="40%" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="7.5,2.5 4,6 7.5,9.5"></polyline></svg></button>
        <button type="button" class="loop__btn loop__btn--play" data-toggle aria-label="Pause slideshow"></button>
        <button type="button" class="loop__btn" data-go="1" aria-label="Next slide"><svg width="40%" height="40%" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="4.5,2.5 8,6 4.5,9.5"></polyline></svg></button>
      </div>`;
    const track = root.querySelector('.loop__track'), toggle = root.querySelector('[data-toggle]');
    const paint = anim => {
      const two = vw() >= 768, W = two ? 'min(41.8vw, 840px)' : '84vw', G = 'clamp(16px, 1.7vw, 44px)';
      root.style.setProperty('--loop-w', W);
      track.style.transition = anim ? SLIDE_T : 'none';
      track.style.transform = `translateX(calc(50% - ${W}${two ? ' - ' + G + ' / 2' : ' / 2'} - ${st.i} * (${W} + ${G})))`;
    };
    const paintToggle = () => {
      toggle.setAttribute('aria-label', st.play ? 'Pause slideshow' : 'Play slideshow');
      toggle.innerHTML = st.play
        ? '<svg width="40%" height="40%" viewBox="0 0 12 12" fill="currentColor"><rect x="2.3" y="1.5" width="2.8" height="9" rx=".7"></rect><rect x="6.9" y="1.5" width="2.8" height="9" rx=".7"></rect></svg>'
        : '<svg width="40%" height="40%" viewBox="0 0 12 12" fill="currentColor"><polygon points="3.5,1.5 10.5,6 3.5,10.5"></polygon></svg>';
    };
    const go = d => { st.i += d; paint(true); };
    track.addEventListener('transitionend', e => {
      if (e.target !== track) return;
      if (st.i < LN || st.i >= 2 * LN) { st.i = ((st.i % LN) + LN) % LN + LN; paint(false); }
    });
    root.addEventListener('click', e => {
      const t = e.target;
      if (t.closest('[data-go]')) go(+t.closest('[data-go]').dataset.go);
      else if (t.closest('[data-toggle]')) { st.play = !st.play; paintToggle(); }
    });
    // Touch: swipe left/right to change slide (phones have no arrow buttons)
    let sx = null;
    root.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); sx = null; });
    paint(false);
    paintToggle();
    return { st, go, paint };
  });
  setInterval(() => {
    if (document.hidden || reduced()) return;
    loops.forEach(l => { if (l.st.play) l.go(1); });
  }, 5000);
  let lastW = vw();
  window.addEventListener('resize', () => { if (vw() !== lastW) { lastW = vw(); loops.forEach(l => l.paint(false)); } });

  /* ---------- Feature carousel: big photo cards, one centred with the neighbours peeking; prev/next + swipe, no autoplay.
     Every line below is a catalogue fact (specs in catalog.js). ---------- */
  // Optional 4th item = a video file (mp4/webm, under site/video/) — it fills the card, plays muted on loop, and the
  // product photo is the poster. Example: ['ts-11anc', 'Active noise cancelling', '…', 'video/ts-11anc.mp4']
  const FEATS = [
    ['ts-11anc', 'Active noise cancelling', 'TS-11ANC earbuds: ANC and Bluetooth 6.0 in a pocket-sized case.'],
    ['os-6', 'Open-ear comfort', 'OS-6 open-ear earbuds — hear traffic and people around you while you listen.'],
    ['cdb-18', 'Magnetic wireless charging', 'CDB-18: a 10,000mAh power bank with 15W magnetic wireless charging.'],
    ['ocd-28', '20W fast charging', 'OCD-28: a 20W USB-C + USB-A wall charger with the cable included.'],
    ['yx-28', 'Party-sized sound', 'YX-28: a 150W party speaker with RGB lights.'],
    ['mkf-02', 'Creator-ready audio', 'MKF-02 clip-on wireless mic: 2.4GHz link, under 20ms latency.'],
  ].filter(f => P(f[0]));
  const feat = $('feat'), ftrack = $('feat-track');
  if (feat && FEATS.length) {
    const FN = FEATS.length, fst = { i: FN };
    ftrack.innerHTML = [0, 1, 2].flatMap(c => FEATS.map(([id, t, sub, video]) => { const p = P(id); return `
      <a class="feat__slide${video ? ' feat__slide--video' : ''}" href="${url.product(id)}" style="background: ${WU.photoBg(p)};"${c !== 1 ? ' tabindex="-1" aria-hidden="true"' : ''}>
        ${video
          ? `<video class="feat__video" src="${video}" poster="${p.src}" muted loop playsinline preload="metadata" aria-hidden="true"></video>`
          : `<span class="feat__ph"><img src="${p.src}" alt="" loading="lazy"></span>`}
        <span class="feat__copy"><span class="feat__t">${esc(t)}</span><span class="feat__s">${esc(sub)}</span></span>
      </a>`; })).join('');
    // Videos play only while on screen (and never for people who ask for reduced motion — they see the poster)
    if (!reduced() && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }), { threshold: .2 });
      ftrack.querySelectorAll('.feat__video').forEach(v => io.observe(v));
    }
    const fpaint = anim => {
      const W = getComputedStyle(feat).getPropertyValue('--feat-w').trim(), G = getComputedStyle(feat).getPropertyValue('--feat-g').trim();
      ftrack.style.transition = anim ? SLIDE_T : 'none';
      ftrack.style.transform = `translateX(calc(50% - (${W}) / 2 - ${fst.i} * ((${W}) + ${G})))`;
    };
    const fgo = d => { fst.i += d; fpaint(true); };
    ftrack.addEventListener('transitionend', e => { if (e.target === ftrack && (fst.i < FN || fst.i >= 2 * FN)) { fst.i = ((fst.i % FN) + FN) % FN + FN; fpaint(false); } });
    feat.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) fgo(+b.dataset.go); });
    let fsx = null;
    feat.addEventListener('touchstart', e => { fsx = e.touches[0].clientX; }, { passive: true });
    feat.addEventListener('touchend', e => { if (fsx == null) return; const dx = e.changedTouches[0].clientX - fsx; if (Math.abs(dx) > 40) fgo(dx < 0 ? 1 : -1); fsx = null; });
    window.addEventListener('resize', () => fpaint(false));
    fpaint(false);
  }

  /* ---------- Shop rails ---------- */
  // New for 2026: one per product type first (variety), then the rest
  const fresh = D.products.filter(p => p.tabs.includes('new'));
  const firstOfType = fresh.filter((p, i) => fresh.findIndex(x => x.type === p.type) === i);
  mountRail($('rail-new'), { title: 'New for 2026', items: firstOfType.concat(fresh.filter(p => !firstOfType.includes(p))).slice(0, 16), allHref: url.filter('new') });
  // Best sellers, topped up with everyday essentials (chargers, cables, power banks) so the rail is never thin
  const best = D.products.filter(p => p.tabs.includes('best'));
  const essentials = ['ocd-28', 'sjx-49', 'cdb-17', 'cc-14', 'cj-47', 'ej-ly7', 'tde-18', 'sjx-15'].map(P).filter(Boolean);
  mountRail($('rail-best'), { title: 'Best Sellers & Essentials', items: best.concat(essentials.filter(p => !best.includes(p))), allHref: url.filter('best') });
  // Budget rails: one product per type first so the row shows the range (not 16 handsfree), then the rest, cheapest first
  const byPrice = (a, b) => a.price - b.price;
  const variety = list => { const first = list.filter((p, i) => list.findIndex(x => x.type === p.type) === i); return first.concat(list.filter(p => !first.includes(p))); };
  // Each tab shows ONLY its own band (2026-10-06): Rs.1–1,000 / Rs.1,001–2,000 / Rs.2,001–5,000 — see WU.budget in common.js
  const under1 = variety(D.products.filter(WU.budget.u1).sort(byPrice));
  const under2 = variety(D.products.filter(WU.budget.u2).sort(byPrice));
  const under5 = variety(D.products.filter(WU.budget.u5).sort(byPrice));
  // Shop by Budget: ONE rail with tabs (requested 2026-10-06; replaced the separate Under Rs.1,000 / Under Rs.2,000 rails)
  mountRail($('rail-budget'), { title: 'Shop by Budget', tabsLabel: 'Budget', tabs: [
    { label: 'Under Rs.1,000', items: under1.slice(0, 16), allHref: url.products + '?price=u1' },
    { label: 'Under Rs.2,000', items: under2.slice(0, 16), allHref: url.products + '?price=u2' },
    { label: 'Under Rs.5,000', items: under5.slice(0, 16), allHref: url.products + '?price=u5' },
  ] });

  /* ---------- Creator mics + Live countdown ---------- */
  document.querySelector('.duo__art').innerHTML = photo(P('mkf-01'), 'duo__ph', true, WIDE);
  $('mics').innerHTML = ['mkf-02', 'mkf-01'].filter(P).map(id => {
    const p = D.byId(id);
    return `<a class="mic" href="${url.product(id)}"><span class="mic__code">${esc(code(p))}</span><span class="mic__meta">${esc(p.meta)}</span><span class="mic__price">${esc(p.priceText)}</span></a>`;
  }).join('');

  const pad = n => String(n).padStart(2, '0');
  function nextShowMs() {
    const d = new Date(), t = new Date(d);
    t.setHours(20, 0, 0, 0);
    let addDays = (5 - d.getDay() + 7) % 7;
    if (addDays === 0 && d >= t) addDays = 7;
    t.setDate(t.getDate() + addDays);
    return t - d;
  }
  function tick() {
    const ms = nextShowMs();
    $('countdown').innerHTML = [
      [pad(Math.floor(ms / 864e5)), 'Days'], [pad(Math.floor(ms / 36e5) % 24), 'Hrs'],
      [pad(Math.floor(ms / 6e4) % 60), 'Min'], [pad(Math.floor(ms / 1e3) % 60), 'Sec'],
    ].map(([v, l]) => `<div class="countdown__cell"><span class="countdown__v">${v}</span><span class="countdown__l">${l}</span></div>`).join('');
  }
  tick();
  setInterval(tick, 1000);
  $('remind').addEventListener('click', e => { e.currentTarget.textContent = 'Reminder set'; });

  /* ---------- Promo carousel ---------- */
  (function promos() {
    const n = PROMOS.length, track = $('promo-track'), band = $('promos');
    let idx = n, hover = false;
    track.innerHTML = [0, 1, 2].flatMap(c => PROMOS.map(t => `
      <div class="promo-band__item"${c !== 1 ? ' aria-hidden="true"' : ''}>
        <a class="promo" href="${url.product(t.id)}" style="background: ${t.bg};"${c !== 1 ? ' tabindex="-1"' : ''}>
          <div class="promo__inner">
            <span class="promo__kicker"><span>${esc(t.kicker)}</span></span>
            <div class="promo__name">${esc(P(t.id).code)}</div>
            <div class="promo__chips">${t.chips.map(ch => `<span class="promo__chip">${esc(ch)}</span>`).join('')}</div>
          </div>
          ${photo(P(t.id), 'promo__img promo__ph')}
        </a>
      </div>`)).join('');
    $('promo-dots').innerHTML = `<div class="dots on-light-dots" role="tablist" aria-label="Slides" style="position: static;">${PROMOS.map((_, i) => `<button type="button" class="dot" role="tab" aria-label="Slide ${i + 1}"></button>`).join('')}</div>`;
    const dots = $('promo-dots').querySelectorAll('.dot');
    const promoW = () => { const w = vw(), per = w < 640 ? 1 : w < 1024 ? 2 : 3; return per === 1 ? '100%' : `calc((100% - ${(per - 1) * 20}px) / ${per})`; };
    const paint = anim => {
      const W = promoW();
      band.style.setProperty('--promo-w', W);
      track.style.transition = anim ? SLIDE_T : 'none';
      track.style.transform = `translateX(calc(${-idx} * (${W} + 20px)))`;
      const a = idx % n;
      dots.forEach((d, i) => d.setAttribute('aria-selected', i === a));
    };
    track.addEventListener('transitionend', e => {
      if (e.target !== track) return;
      if (idx < n || idx >= 2 * n) { idx = ((idx % n) + n) % n + n; paint(false); }
    });
    $('promo-dots').addEventListener('click', e => {
      const d = e.target.closest('.dot');
      if (!d) return;
      const i = [...dots].indexOf(d), cur = idx % n;
      let delta = i - cur;
      if (delta > n / 2) delta -= n;
      if (delta < -n / 2) delta += n;
      idx += delta;
      paint(true);
    });
    band.addEventListener('mouseenter', () => { hover = true; });
    band.addEventListener('mouseleave', () => { hover = false; });
    setInterval(() => { if (!hover && !reduced()) { idx++; paint(true); } }, 6000);
    window.addEventListener('resize', () => paint(false));
    paint(false);
  })();

  /* ---------- Series spotlight ---------- */
  (function series() {
    let sel = 0;
    $('series-chips').innerHTML = SERIES.map((id, i) => `<button type="button" class="chip" data-i="${i}" aria-pressed="${i === sel}">${esc(code(D.byId(id)))}</button>`).join('');
    const sart = () => { $('series-art').innerHTML = '<div>' + photo(P(SERIES[sel]), 'series__ph', true, WIDE) + '</div>'; };
    const paint = () => {
      const p = D.byId(SERIES[sel]);
      $('series-code').textContent = code(p);
      $('series-title').innerHTML = `<a href="${url.product(p.id)}">${esc(p.title)}</a>`;
      $('series-meta').textContent = p.meta;
      $('series-now').textContent = p.priceText;
      $('series-was').textContent = p.wasText || '';
      $('series-off').textContent = p.off || '';
      $('series-btns').innerHTML = btnBuy('Buy Now', url.product(p.id)) + '<button type="button" class="btn-cart"><span class="plus">+</span>Add to cart</button>';
      $('series-chips').querySelectorAll('.chip').forEach((c, i) => c.setAttribute('aria-pressed', i === sel));
      sart();
    };
    $('series-chips').addEventListener('click', e => { const c = e.target.closest('[data-i]'); if (c) { sel = +c.dataset.i; paint(); } });
    $('series-btns').addEventListener('click', e => { if (e.target.closest('.btn-cart')) add(SERIES[sel]); });
    paint();
  })();

  /* ---------- FAQ ---------- */
  mountAccordion($('faq-list'), D.faqs, { idPrefix: 'faq' });
})();
