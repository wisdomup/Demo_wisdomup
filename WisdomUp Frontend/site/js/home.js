// WisdomUp — Home (HomeEditorial) page. Shared chrome, cards, rails and hero come from common.js.
(function () {
  const { D, $, esc, reduced, vw, code, url, add, btnBuy, mountRail, mountHero, mountAccordion, SLIDE_T } = WU;

  // Quick chips → the matching collection or filter on the All Products page.
  const CHIPS = [
    ['Under Rs.3,000', 'buds', url.filter('under3000')], ['New Arrivals', 'buds', url.filter('new')], ['Best Sellers', 'speaker', url.filter('best')],
    ['Top Rated', 'phones', url.filter('top')], ['Earbuds', 'buds', url.cat('Earbuds')], ['Speakers', 'speaker', url.cat('Speakers')],
    ['Neckbands', 'phones', url.cat('Neckbands')], ['Microphones', 'speaker', url.cat('Microphones')], ['Chargers', 'bank-ice', url.cat('Chargers')],
    ['On Sale', 'bank', url.filter('sale')],
  ];
  const SERIES = ['os1', 'os2', 'os3', 'os4', 'os5'];
  const PROMOS = [
    { id: 'cj45', kicker: '15W wireless charger', name: 'CJ-45', chips: ['3-in-1', '15W'], art: 'bank-ice', bg: 'linear-gradient(120deg,#1c2a44,#0a0f1a)' },
    { id: 'cj44', kicker: 'Magnetic wireless charger', name: 'CJ-44', chips: ['Magnetic', 'Foldable'], art: 'bank', bg: 'linear-gradient(120deg,#1b1b1b,#050505)' },
    { id: 'cc16', kicker: 'Dual smart car charger', name: 'CC-16', chips: ['PD fast', 'Dual port'], art: 'bank', bg: 'linear-gradient(120deg,#4a2a18,#a4582a)' },
    { id: 'cc14', kicker: 'USB + Type-C car charger', name: 'CC-14', chips: ['38W total', 'Dual output'], art: 'bank', bg: 'linear-gradient(120deg,#0f2d2a,#050a0a)' },
    { id: 'os4', kicker: 'Open stereo earbuds', name: 'OS-4', chips: ['40+ hrs', 'IPX7'], art: 'buds', bg: 'linear-gradient(120deg,#3a0f12,#0d0505)' },
    { id: 'ts10', kicker: 'True wireless earbuds', name: 'TS-10', chips: ['ANC', '30 hrs'], art: 'buds', bg: 'linear-gradient(120deg,#22304a,#0b0f18)' },
    { id: 'mkf02', kicker: 'Creator wireless mic', name: 'MKF-02', chips: ['Dual mic', 'Noise reduction'], art: 'speaker', bg: 'linear-gradient(120deg,#2a2622,#0d0c0b)' },
    { id: 'thunder', kicker: 'Party speaker', name: 'THUNDER', chips: ['RGB LED', 'IPX6'], art: 'speaker', bg: 'linear-gradient(120deg,#2a1640,#120a24)' },
    { id: 'aip33', kicker: 'Wireless neckband', name: 'AIPLUS 33', chips: ['ENC', '45 hrs'], art: 'phones', bg: 'linear-gradient(120deg,#33401c,#0d1206)' },
  ];
  const LOOP = [
    { id: 'os4', kicker: 'Open Stereo · OS-4', title: 'Hear the city. Keep the music.', sub: 'Open-ear comfort with 40+ hours of play.', ctaLabel: 'Shop OS-4 now', tag: 'Earbuds', bg: 'linear-gradient(120deg,#3a0f12,#0d0505)' },
    { id: 'ts10', kicker: 'True Wireless · TS-10', title: 'Silence, on demand.', sub: 'Active noise cancelling, 30 hours in your pocket.', ctaLabel: 'Shop TS-10 now', tag: 'Earbuds', bg: 'linear-gradient(120deg,#22304a,#0b0f18)' },
    { id: 'thunder', kicker: 'Party Speaker · Thunder', title: 'Turn any room into the venue.', sub: 'RGB light show, IPX6 and bass that carries.', ctaLabel: 'Shop Thunder now', tag: 'Speakers', bg: 'linear-gradient(120deg,#2a1640,#120a24)' },
    { id: 'mkf02', kicker: 'Creator Mic · MKF-02', title: 'Sound like the studio.', sub: 'Dual wireless mics with live noise reduction.', ctaLabel: 'Shop MKF-02 now', tag: 'Microphones', bg: 'linear-gradient(120deg,#2a2622,#0d0c0b)' },
    { id: 'cj45', kicker: 'Wireless Charger · CJ-45', title: 'Three devices. One pad.', sub: '15W fast charging for phone, buds and watch.', ctaLabel: 'Shop CJ-45 now', tag: 'Chargers', bg: 'linear-gradient(120deg,#1c2a44,#0a0f1a)' },
  ];
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
    $('quick-chips').innerHTML = list.map(([label, a, href], i) => `
      <a class="chip" href="${href}"${dbl && i >= CHIPS.length ? ' tabindex="-1" aria-hidden="true"' : ''}>
        <span class="quick__in"><span class="quick__art"><span>${art(a)}</span></span><span>${esc(label)}</span></span>
      </a>`).join('');
  }
  renderChips();
  window.addEventListener('resize', renderChips);

  /* ---------- Lifestyle hero ---------- */
  mountHero($('hero'));

  /* ---------- Editorial loop carousels (infinite, 3× slide copies) ---------- */
  const LN = LOOP.length;
  const loops = ['car1', 'car2'].map(k => {
    const root = $(k);
    const st = { i: LN, play: true };
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
            <div class="loop__art" aria-hidden="true">${art((D.byId(s.id) || {}).art)}</div>
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

  /* ---------- Shop rails ---------- */
  mountRail($('rail-new'), { title: 'New Arrivals', items: D.products.filter(p => p.tabs.includes('new')), allHref: url.filter('new') });
  mountRail($('rail-best'), { title: 'Best Sellers', items: D.products.filter(p => p.tabs.includes('best')), allHref: url.filter('best') });

  /* ---------- Creator mics + Live countdown ---------- */
  document.querySelector('.duo__art').innerHTML = art('speaker');
  $('mics').innerHTML = ['mkf02', 'mkf01'].map(id => {
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
            <div class="promo__name">${esc(t.name)}</div>
            <div class="promo__chips">${t.chips.map(ch => `<span class="promo__chip">${esc(ch)}</span>`).join('')}</div>
          </div>
          ${art(t.art, { alt: t.name, cls: 'promo__img' })}
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
      dots.forEach((d, i) => { d.setAttribute('aria-selected', i === a); d.style.background = i === a ? '' : 'var(--dot-idle-light)'; });
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
    let sel = 3;
    $('series-chips').innerHTML = SERIES.map((id, i) => `<button type="button" class="chip" data-i="${i}" aria-pressed="${i === sel}">${esc(code(D.byId(id)))}</button>`).join('');
    $('series-art').innerHTML = '<div>' + art('buds') + '</div>';
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
    };
    $('series-chips').addEventListener('click', e => { const c = e.target.closest('[data-i]'); if (c) { sel = +c.dataset.i; paint(); } });
    $('series-btns').addEventListener('click', e => { if (e.target.closest('.btn-cart')) add(SERIES[sel]); });
    paint();
  })();

  /* ---------- FAQ ---------- */
  mountAccordion($('faq-list'), D.faqs, { idPrefix: 'faq' });
})();
