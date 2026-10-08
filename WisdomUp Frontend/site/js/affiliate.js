// WisdomUp — the affiliate landing page (affiliate.html, 2026-10-09: the layout of lovense.com/sextoys/affiliate rebuilt in our
// design: banner → 3 easy steps + a walk-through of one order → why your audience will love it → how we help → join).
// Facts only: products, prices, the follower discount and every rate come from catalog.js / shop.js (creators.js fills the
// data-cr numbers); "Join now" goes to the real sign-up form on creators.html.
(function () {
  const { D, $, esc, url, SHOP, photoBg, photoFit, DEPTS, reduced } = WU;
  const CR = SHOP.creators || {};
  if (!$('afx') || !CR.on) return;
  const rs = D.rs, pctOf = WU.ref.pctOf;
  const tiers = (CR.tiers || []).slice().sort((a, b) => a.from - b.from);
  const host = (() => { try { return new URL(SHOP.siteUrl).host; } catch (e) { return 'wisdomup.pk'; } })();

  // Shop facts in the copy
  document.querySelectorAll('[data-shop]').forEach(el => {
    const v = { free: rs(SHOP.freeDeliveryFrom), eta: SHOP.delivery && SHOP.delivery.standard && SHOP.delivery.standard.eta }[el.dataset.shop];
    if (v) el.textContent = v;
  });

  // One product per type: a best seller or new launch when there is one, the higher price first (the creators page's picks rule)
  const live = D.products.filter(p => !p.soldOut && p.thumb);
  const tagged = p => p.tabs.includes('best') || p.tabs.includes('new');
  const pickOf = (type, max = 25000, skip = []) => {
    const of = live.filter(p => p.type === type && p.price <= max && !skip.includes(p.id));
    const pool = of.some(tagged) ? of.filter(tagged) : of;
    return pool.sort((a, b) => b.price - a.price)[0];
  };
  const picks = (types, max) => types.map(t => pickOf(t, max)).filter(Boolean);
  const frame = (p, cls = '') => `<span class="af-photo ${cls}" style="background: ${photoBg(p)};"><img src="${p.thumb}" alt="" loading="lazy" style="${photoFit(p)}"></span>`;

  /* ---------- 1. Banner: framed product photos either side of the headline (a row above it on phones) ---------- */
  const art = picks(['headphones', 'earbuds', 'speakers', 'power-banks', 'microphones', 'shavers']);
  $('afb-art').innerHTML = art.slice(0, 6).map((p, i) => frame(p, 'afb__ph afb__ph--' + (i + 1))).join('');

  /* ---------- 2. The walk-through: one real product, the real discount and the starting rate ---------- */
  const P = pickOf('earbuds', 15000) || pickOf('headphones', 15000) || live[0];
  const T0 = tiers[0] || { name: 'Starter', pct: 8 };
  const off = pctOf(P.price, CR.discountPct || 0), pay = P.price - off, earn = pctOf(pay, T0.pct);
  const CODE = 'YOURCODE';
  const STEPS = [
    { t: 'Your follower taps your link', s: `It opens the product with your code already applied.` },
    { t: `They save ${CR.discountPct}% at checkout`, s: `${rs(P.price)} becomes ${rs(pay)}, paid Cash on Delivery.` },
    { t: 'The order is delivered', s: `Your commission is approved ${CR.returnDays} days after delivery.` },
    { t: `You earn ${rs(earn)}`, s: `${T0.pct}% of ${rs(pay)} at the ${T0.name} rate, paid monthly.` },
  ];
  const ICON_OK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const SCENES = [
    `<div class="afx__sc afx__sc--link">
      <span class="afx__url" style="--i:0"><svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg><span>${esc(host)}/product.html?id=${esc(P.id)}&amp;<b>ref=${CODE}</b></span></span>
      <span class="afx__card" style="--i:1">${frame(P, 'afx__ph')}<span class="afx__ct"><span class="afx__name">${esc(P.title)}</span><span class="afx__price">${esc(rs(P.price))}</span><span class="afx__tag">Code ${CODE} · ${CR.discountPct}% off</span></span></span>
    </div>`,
    `<div class="afx__sc afx__sc--pay">
      <span class="afx__bill">
        <span class="afx__row" style="--i:0"><span>Item</span><span>${esc(rs(P.price))}</span></span>
        <span class="afx__row afx__row--off" style="--i:1"><span><span class="afx__code">${CODE}</span> ${CR.discountPct}% creator discount</span><span>−${esc(rs(off))}</span></span>
        <span class="afx__row afx__row--total" style="--i:2"><span>Your follower pays</span><b>${esc(rs(pay))}</b></span>
        <span class="afx__cod" style="--i:3">Cash on Delivery</span>
      </span>
    </div>`,
    `<div class="afx__sc afx__sc--ship">
      <span class="afx__track" style="--i:0">${['Placed', 'Shipped', 'Delivered'].map((s, i) => `<span class="afx__node" style="--k:${i}"><i>${ICON_OK}</i>${s}</span>`).join('')}</span>
      <span class="afx__parcel" style="--i:1">${frame(P, 'afx__ph afx__ph--s')}<span><b>Delivered</b><span>Approved after ${CR.returnDays} days</span></span></span>
    </div>`,
    `<div class="afx__sc afx__sc--earn">
      <span class="afx__label" style="--i:0">Your commission</span>
      <b class="afx__big" style="--i:1">${esc(rs(earn))}</b>
      <span class="afx__math" style="--i:2">${T0.pct}% of ${esc(rs(pay))} · ${esc(T0.name)} rate</span>
      <span class="afx__chips" style="--i:3"><span>Paid monthly</span><span>JazzCash · EasyPaisa · bank</span></span>
    </div>`,
  ];
  const stage = $('afx-stage'), list = $('afx-list'), box = $('afx'), play = $('afx-play');
  stage.innerHTML = SCENES.join('');
  list.innerHTML = STEPS.map((s, i) => `<li><button type="button" class="afx__step" data-i="${i}" data-no-fill><span class="afx__n">${i + 1}</span><span class="afx__t">${esc(s.t)}</span><span class="afx__s">${esc(s.s)}</span><span class="afx__bar"><i></i></span></button></li>`).join('');
  const steps = [...list.querySelectorAll('.afx__step')], scenes = [...stage.children];
  let cur = -1, userPaused = reduced(), onScreen = false, hover = false;
  function go(i) {
    cur = (i + steps.length) % steps.length;
    steps.forEach((b, k) => { b.toggleAttribute('aria-current', k === cur); if (k === cur) b.setAttribute('aria-current', 'step'); });
    scenes.forEach((s, k) => s.classList.toggle('is-on', k === cur));
    const bar = steps[cur].querySelector('.afx__bar i');
    bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; // restart the timeline bar
  }
  const paint = () => {
    const paused = userPaused || !onScreen || hover || document.hidden;
    box.classList.toggle('is-paused', paused);
    box.classList.toggle('is-stopped', userPaused);
    play.setAttribute('aria-label', userPaused ? 'Play the walk-through' : 'Pause the walk-through');
  };
  // The bar under the current step is the clock: when it fills, the next scene comes (pausing freezes the bar)
  list.addEventListener('animationend', e => { if (e.target.matches('.afx__bar i')) go(cur + 1); });
  list.addEventListener('click', e => { const b = e.target.closest('.afx__step'); if (b) go(+b.dataset.i); });
  play.addEventListener('click', () => { userPaused = !userPaused; paint(); });
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    stage.addEventListener('pointerenter', () => { hover = true; paint(); });
    stage.addEventListener('pointerleave', () => { hover = false; paint(); });
  }
  document.addEventListener('visibilitychange', paint);
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { onScreen = es[0].isIntersecting; paint(); }, { threshold: .35 }).observe(box);
  else onScreen = true;
  go(0); paint();

  /* ---------- 3. Why your audience will love WisdomUp: the real range and its lowest price ---------- */
  const trio = picks(['earbuds', 'speakers', 'power-banks']);
  $('afw-range').innerHTML = trio.map((p, i) => frame(p, 'afw__ph afw__ph--' + (i + 1))).join('');
  const depts = DEPTS.filter(d => live.some(p => d.types.includes(p.type))).length;
  const min = Math.min(...live.map(p => p.price));
  $('afw-range-p').innerHTML = `${live.length} products across ${depts} ranges — earbuds, headphones, speakers, power banks, chargers and cables — from ${esc(rs(min))}, and your followers’ <span data-cr="discount">${CR.discountPct}</span>% comes on top of sale prices.`;

  /* ---------- 4. How WisdomUp can help you: the dashboard's own tools, drawn small ---------- */
  $('afm-link').textContent = `${host}/?ref=${CODE}`;
  const two = live.filter(p => p.type === 'earbuds').sort((a, b) => (tagged(b) - tagged(a)) || b.price - a.price).slice(0, 2);
  $('afm-rows').innerHTML = two.map(p => `<span class="afm__item">${frame(p, 'afm__ph')}<span class="afm__it"><span>${esc(p.title)}</span><b>${esc(rs(p.price))}</b></span><span class="afm__btn afm__btn--ink">Copy link</span></span>`).join('');
  // A drawing of the 30-day chart, not data: no numbers, just the dashboard's shape (visits red, orders ink — two rows, never a dual axis)
  const wave = (n, k, lo) => Array.from({ length: n }, (_, i) => Math.max(lo, Math.round(50 + 34 * Math.sin(i * k) + 16 * Math.sin(i * k * 2.7 + 1))));
  $('afm-visits').innerHTML = wave(30, .43, 12).map(h => `<i style="--h:${h}%"></i>`).join('');
  $('afm-orders').innerHTML = wave(30, .43, 0).map((h, i) => `<i style="--h:${i % 3 === 1 ? 0 : Math.round(h * .55)}%"></i>`).join('');
  if (tiers[0]) $('afm-t1').textContent = `${tiers[0].name} ${tiers[0].pct}%`;
  if (tiers[1]) $('afm-t2').textContent = `${tiers[1].name} ${tiers[1].pct}%`;
})();
