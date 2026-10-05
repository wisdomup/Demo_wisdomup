// WisdomUp — shared site chrome and components (used by every page).
// Exposes window.WU: routes, cart, utility bar, nav, search, product card, rails, hero, accordions, trust, footer.
(function () {
  const D = window.WU_STORE;
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vw = () => window.innerWidth;
  const code = p => p.title.split(' ')[0];
  const EASE = 'cubic-bezier(.2,.7,.2,1)';

  /* ---------- Routes ---------- */
  const CATS = ['Earbuds', 'Neckbands', 'Speakers', 'Microphones', 'Chargers'];
  const slug = c => 'cat-' + c.toLowerCase();
  const url = {
    home: 'index.html',
    live: 'live.html',
    products: 'products.html',
    cat: c => 'products.html#' + slug(c),
    filter: f => 'products.html?filter=' + f,
    product: id => 'product.html?id=' + encodeURIComponent(id),
    bulk: 'bulk-order.html',
    corporate: 'corporate.html',
    creators: 'creators.html',
    about: 'about.html',
    where: 'where-to-buy.html',
    blog: 'blog.html',
    article: slug => 'article.html#' + slug,
    help: 'help.html',
    track: 'track.html',
    returns: 'returns.html',
    warranty: 'warranty.html',
    shipping: 'shipping.html',
    express: 'shipping.html#express',
    manuals: 'manuals.html',
  };
  // Nav categories without their own collection fall back to the closest one (or the full catalogue).
  const NAV_MAP = { 'Power Banks': 'Chargers', Cables: 'Chargers', 'USB Cables': 'Chargers', Handsfree: 'Neckbands', Headphones: 'Neckbands' };
  const catHref = label => CATS.includes(label) ? url.cat(label) : NAV_MAP[label] ? url.cat(NAV_MAP[label]) : url.products;
  const LINKS = {
    'All Items': url.products, 'Audio & Sound': url.cat('Earbuds'), Powerbanks: url.cat('Chargers'), 'Charging Devices': url.cat('Chargers'),
    'Car Electronics': url.cat('Chargers'), 'Smart Life Devices': url.products, 'Creator Tools': url.cat('Microphones'),
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
  const NAV_CATS = [
    { label: 'Earbuds', d: 'M7.6 2.6a1.9 1.9 0 1 1 0 3.8a1.9 1.9 0 1 1 0-3.8zM7 5.5h1.3v4.3H7zM16.4 2.6a1.9 1.9 0 1 1 0 3.8a1.9 1.9 0 1 1 0-3.8zM15.7 5.5H17v4.3h-1.3zM3.5 11h17v4.5a6 6 0 0 1-6 6h-5a6 6 0 0 1-6-6zM11 15.6a1 1 0 1 0 2 0a1 1 0 1 0-2 0z', s: '', w: 2.2 },
    { label: 'Headphones', d: 'M5 13h2a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 7 21H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zM5.1 15.1h1.4v3.8H5.1zM17 13h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 17 13zM17.5 15.1h1.4v3.8h-1.4z', s: 'M4 15v-3a8 8 0 0 1 16 0v3', w: 2.4 },
    { label: 'Speakers', d: 'M8 2.5h8a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zM9.4 8a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0-5.2 0zM10.9 8a1.1 1.1 0 1 0 2.2 0a1.1 1.1 0 1 0-2.2 0zM9 15.5a3 3 0 1 0 6 0a3 3 0 1 0-6 0zM10.8 15.5a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0z', s: 'M3.6 8.6L2.2 7.8M3.6 12H2M3.6 15.4l-1.4.8M20.4 8.6l1.4-.8M20.4 12H22M20.4 15.4l1.4.8', w: 1.4 },
    { label: 'Neckbands', d: 'M8 2.7a1.9 1.9 0 1 1 0 3.8a1.9 1.9 0 1 1 0-3.8zM7.3 6h1.4l.4 3.2H7.5zM16 2.7a1.9 1.9 0 1 1 0 3.8a1.9 1.9 0 1 1 0-3.8zM15.3 6h1.4l-.2 3.2h-1.6zM2.2 13.2Q5 17.2 10.6 19.7Q16.6 21.6 20.3 15.6A1.3 1.3 0 0 0 18.1 14.4Q15.8 18.4 11.4 17.3Q7 15 4.2 11.8A1.3 1.3 0 0 0 2.2 13.2Z', s: 'M8.3 9.2c.3 2.6.1 4-.9 5.6M15.7 9.2c.4 3 .5 5.6.3 8.4', w: 1.1 },
    { label: 'Handsfree', d: 'M8 5.8a2.4 2.4 0 1 1 0 4.8a2.4 2.4 0 1 1 0-4.8zM16 3.4a2.4 2.4 0 1 1 0 4.8a2.4 2.4 0 1 1 0-4.8z', s: 'M8 10.6V22M16 8.2V22', w: 1.6 },
    { label: 'Smart Watches', d: 'M9 6h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3zM8.8 5.4l.7-3h5l.7 3zM8.8 18.6l.7 3h5l.7-3zM18.6 10h1v2.6h-1z', s: '', w: 2.2 },
    { label: 'Power Banks', d: 'M8 2h8a2.5 2.5 0 0 1 2.5 2.5v15A2.5 2.5 0 0 1 16 22H8a2.5 2.5 0 0 1-2.5-2.5v-15A2.5 2.5 0 0 1 8 2zM13 5.5l-3.3 5h2.6l-1.3 4l3.3-5h-2.6zM8.5 17.6h7v1.4h-7z', s: '', w: 2.2 },
    { label: 'Chargers', d: 'M7 9h10a1.5 1.5 0 0 1 1.5 1.5V20a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9.5A1.5 1.5 0 0 1 7 9zM12.8 12l-2.6 4h2l-1 3.2l2.6-4h-2zM9 2.5h1.4V9H9zM13.6 2.5H15V9h-1.4z', s: '', w: 2.2 },
    { label: 'Cables', d: 'M15 4h4.5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H15zM20.5 4.8h2v1.4h-2zM4.5 17H9v3H4.5a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1zM1.5 17.8h2v1.4h-2z', s: 'M15 5.5H7a3.2 3.2 0 0 0 0 6.4h10a3.2 3.2 0 0 1 0 6.4H9', w: 2 },
    { label: 'Microphones', d: 'M12 2a3.2 3.2 0 0 1 3.2 3.2v6.1a3.2 3.2 0 0 1-6.4 0V5.2A3.2 3.2 0 0 1 12 2z', s: 'M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v4M8.5 21.5h7', w: 2 },
    { label: 'Smart Home', d: 'M12 1.5a10.5 10.5 0 1 1 0 21a10.5 10.5 0 1 1 0-21zM12 2.9a9.1 9.1 0 1 0 0 18.2a9.1 9.1 0 1 0 0-18.2zM12 3.9a8.1 8.1 0 1 1 0 16.2a8.1 8.1 0 1 1 0-16.2zM12 15a1.4 1.4 0 1 0 0 2.8a1.4 1.4 0 1 0 0-2.8z', s: '', w: 2.2 },
    { label: 'USB Cables', d: 'M8 1.5h5v5H8zM9.3 2.8h.9v.9h-.9zM10.8 2.8h.9v.9h-.9zM7.5 6.5h6v3h-6z', s: 'M10.5 9.5v8a2.5 2.5 0 0 0 5 0V12a2.5 2.5 0 0 1 5 0v10', w: 1.8 },
  ];
  const navSvg = (d, s, w, size) => `<svg viewBox="0 0 24 24" aria-hidden="true" style="width: ${size}px; height: ${size}px;"><path d="${d}" fill="#fff" fill-rule="evenodd"></path><path d="${s}" fill="none" stroke="#fff" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
  const P_GRID = 'M5.5 3.5h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zM15.5 3.5h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zM5.5 13.5h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zM15.5 13.5h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z';
  const P_SEARCH = 'M11 4.5a6.5 6.5 0 1 1 0 13a6.5 6.5 0 1 1 0-13zM16 16l4.5 4.5';
  const P_USER = 'M12 2.5a4.3 4.3 0 1 1 0 8.6a4.3 4.3 0 1 1 0-8.6zM3.5 21.5a8.5 8.5 0 0 1 17 0z';
  const P_BAG = 'M5.2 8h13.6a1 1 0 0 1 1 1.1l-1 11a1.6 1.6 0 0 1-1.6 1.4H6.8a1.6 1.6 0 0 1-1.6-1.4l-1-11A1 1 0 0 1 5.2 8z';
  const P_HANDLE = 'M8.8 8V6.5a3.2 3.2 0 0 1 6.4 0V8';
  const STAR_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" fill="#E2A92C"></path></svg>';
  const btnBuy = (label, href) => href
    ? `<a class="btn-buy" href="${href}">${icon('cart', 30)}${esc(label)}</a>`
    : `<button type="button" class="btn-buy">${icon('cart', 30)}${esc(label)}</button>`;

  /* ---------- Cart (count persists across pages) + toast ---------- */
  const store = {
    get: (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
  };
  let bag = store.get('wu-bag', 0), toastT;
  function toast(msg) {
    const t = $('toast');
    if (!t) return;
    t.innerHTML = icon('bag', 18) + '<span>' + esc(msg) + '</span>';
    t.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(() => { t.hidden = true; }, 2400);
  }
  function add(id, n = 1) {
    const p = D.byId(id);
    if (!p || p.soldOut) return;
    bag += n;
    store.set('wu-bag', bag);
    paintBadge();
    toast((n > 1 ? n + ' × ' : '') + p.title + ' added to cart');
  }

  /* ---------- Utility bar ---------- */
  function renderUtility() {
    const el = $('utility');
    if (!el) return;
    el.innerHTML = D.utility.map(l => { const h = linkFor(l.label); return `<a href="${h}"${l.tone ? ` class="${l.tone}"` : ''}${isHere(h) ? ' aria-current="page"' : ''}>${esc(l.label)}</a>`; }).join('');
  }

  /* ---------- Site nav ---------- */
  const nav = $('site-nav');
  const NAV_INSET = 12, NAV_START = 64;
  let navMode = '', navHidden = false, lastY = window.scrollY, activeCat = null;
  const logoImgs = h => `<span class="site-nav__logo" style="height: ${h}px;"><img src="img/wu-logo.png" alt="WisdomUp"><img src="img/wu-logo-white.png" alt="" aria-hidden="true"></span>`;
  const DARK = '.hero, .pbanner, .loop__slide, .duo__card, .promo, .footer, .pd-stat--dark, .bulk-steps';
  function renderNav(force) {
    if (!nav) return;
    const w = vw(), wide = w >= 640;
    const count = w >= 1560 ? 12 : w >= 1420 ? 10 : w >= 1240 ? 8 : w >= 1080 ? 6 : w >= 940 ? 4 : 0;
    const gap = w >= 1360 ? 13 : 5;
    const mode = wide ? 'w' + count + '-' + gap : 'n';
    if (mode === navMode && !force) return;
    navMode = mode;
    Object.assign(nav.style, wide
      ? { left: 'calc(var(--gutter, 28px) + 20px)', right: 'calc(var(--gutter, 28px) + 20px)', height: '70px', padding: '0 10px 0 34px', gap: '34px' }
      : { left: 'calc(var(--gutter, 16px) + 10px)', right: 'calc(var(--gutter, 16px) + 10px)', height: '43px', padding: '0 4px', gap: '0px' });
    if (wide) {
      nav.innerHTML = `
        <a href="${url.home}" aria-label="WisdomUp home" style="display: flex; align-items: center; flex: none;">${logoImgs(43)}</a>
        <nav class="site-nav__cats" aria-label="Categories" style="gap: ${gap}px;">
          ${NAV_CATS.slice(0, count).map(c => `<a class="navbtn navbtn--cat" href="${catHref(c.label)}" aria-label="${c.label}"${activeCat === c.label ? ' aria-current="true" aria-expanded="true"' : ''}>${navSvg(c.d, c.s, c.w, 31)}<span>${c.label}</span></a>`).join('')}
        </nav>
        <div class="site-nav__tools">
          <a class="navbtn navbtn--all" href="${url.products}" style="padding: 0 21px 0 13px; margin-right: 5px;">${navSvg(P_GRID, '', 2.2, 29)}<span>Shop All</span></a>
          <button type="button" class="navbtn navbtn--util" data-act="search" aria-label="Search">${navSvg('', P_SEARCH, 2.2, 29)}</button>
          <button type="button" class="navbtn navbtn--util" data-act="account" aria-label="Account">${navSvg(P_USER, '', 2.2, 29)}</button>
          <button type="button" class="navbtn navbtn--util" data-act="bag" aria-label="Cart" style="position: relative;">${navSvg(P_BAG, P_HANDLE, 2.2, 29)}<b class="site-nav__badge" hidden></b></button>
        </div>`;
    } else {
      nav.innerHTML = `
        <div class="site-nav__narrow">
          <a class="site-nav__icon" href="${url.products}" aria-label="Shop all products" style="justify-self: start;"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M4 6.5h16M4 12h16M4 17.5h16"></path></svg></a>
          <a href="${url.home}" aria-label="WisdomUp home" style="display: flex; align-items: center; justify-content: center;">${logoImgs(26)}</a>
          <div style="justify-self: end; display: flex; align-items: center; gap: 2px;">
            <button type="button" class="site-nav__icon" data-act="search" aria-label="Search"><svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${P_SEARCH}"></path></svg></button>
            <button type="button" class="site-nav__icon" data-act="bag" aria-label="Cart"><svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${P_BAG}${P_HANDLE}"></path></svg><b class="site-nav__badge" hidden></b></button>
          </div>
        </div>`;
    }
    paintBadge();
  }
  function setActiveCat(label) {
    if (label === activeCat) return;
    activeCat = label;
    if (!nav) return;
    nav.querySelectorAll('.navbtn--cat').forEach(a => {
      const on = a.getAttribute('aria-label') === label;
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
    const b = nav && nav.querySelector('.site-nav__badge');
    if (!b) return;
    b.hidden = bag <= 0;
    b.textContent = bag;
  }
  function placeNav() {
    if (!nav) return;
    const y = window.scrollY, d = y - lastY, was = navHidden;
    if (y < 120) navHidden = false;
    else if (d > 6) navHidden = true;
    else if (d < -6) navHidden = false;
    if (Math.abs(d) > 6 || y < 120) lastY = y;
    // Pages with a hero tuck the nav 12px inside it; other pages park it under the utility bar.
    const anchor = [...document.querySelectorAll('[data-nav-anchor]')].find(el => el.offsetParent !== null); // first visible anchor
    let top;
    if (vw() < 640) top = anchor ? Math.max(10, anchor.getBoundingClientRect().top + 10) : 10;
    else top = Math.max(16, (anchor ? anchor.getBoundingClientRect().top + y + NAV_INSET : NAV_START) - y);
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
      ['Shipping Policy', url.shipping, 'shipping delivery express courier free cod cash on delivery time days'],
      ['Exchange & Refund Policy', url.returns, 'return refund exchange money back 30-day guarantee'],
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
      const res = (q ? D.products.filter(p => (p.title + ' ' + p.meta + ' ' + p.cat).toLowerCase().includes(q)) : D.products.filter(p => p.tabs.includes('best'))).slice(0, 8);
      label.textContent = q ? (res.length ? res.length + ' result' + (res.length > 1 ? 's' : '') : 'No matches — try “earbuds” or “charger”') : 'Popular right now';
      grid.innerHTML = res.map((p, i) => `
        <a class="ccard" href="${url.product(p.id)}">
          <div class="ccard__media" style="background: ${BG[i % BG.length]};">${art(p.art, { alt: p.title, style: 'width: 100%; height: 100%;' })}${p.ribbon || p.cat ? `<div class="ccard__tag"><span>${esc(p.ribbon || p.cat)}</span></div>` : ''}</div>
          <div class="ccard__body"><div class="ccard__title">${esc(code(p))}</div><p class="ccard__meta">${esc(p.meta)}</p></div>
          <div class="ccard__foot"><span class="ccard__price">${esc(p.priceText)}</span>${p.wasText ? `<s class="ccard__was">${esc(p.wasText)}</s>` : ''}</div>
        </a>`).join('');
    };
    const open = () => { host.hidden = false; document.documentElement.style.overflow = 'hidden'; paint(); setTimeout(() => input.focus(), 30); };
    const close = () => { host.hidden = true; document.documentElement.style.overflow = ''; };
    input.addEventListener('input', paint);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { const a = grid.querySelector('a') || pagesEl.querySelector('a'); if (a) location.href = a.href; } });
    host.addEventListener('click', e => { if (e.target === host || e.target.closest('.search__close')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !host.hidden) close(); });
    return { open, close };
  }

  /* ---------- WUProductCard (designed at 430px, scales with cqw) ---------- */
  const COLOR_NAMES = { '#1b1b1b': 'Midnight Black', '#f2f2f2': 'Arctic White', '#ede6da': 'Sand Beige', '#c9a24a': 'Gold', '#5c3fa8': 'Royal Purple' };
  const colorsOf = p => (p.colors && p.colors.length ? p.colors : ['#1b1b1b'])
    .map((c, i) => typeof c === 'string' ? { name: COLOR_NAMES[c.toLowerCase()] || 'Colour ' + (i + 1), hex: c } : c);
  const seedOf = p => [...p.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const ratingOf = p => { const rt = p.rating, s = seedOf(p); return typeof rt === 'number' ? (rt >= 5 ? rt - (s % 4) * 0.1 : rt).toFixed(1) : '4.6'; };
  const reviewsOf = p => 24 + (seedOf(p) * 37) % 260;
  const etaFor = (seed, off) => {
    if (off) return '';
    const d = new Date(); d.setDate(d.getDate() + 2 + (seed % 2));
    return 'Get it as early as ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  function productCard(p, opts = {}) {
    const seed = seedOf(p), off = !!p.soldOut, href = url.product(p.id);
    const badge = off ? 'Sold out' : (opts.badge !== undefined ? opts.badge : p.ribbon);
    const usePhoto = !!p.src && !p.src2;
    const media = usePhoto
      ? `<img class="wpc__photo" src="${p.src}" alt="${esc(p.title)}" loading="lazy">`
      : `<div class="wpc__art wpc__art--main">${art(p.art, { src: p.src, alt: p.title })}</div>
         <div class="wpc__art wpc__art--alt"${p.src2 ? ' style="transform: none;"' : ''}>${art(p.art, { src: p.src2 || p.src, alt: '' })}</div>`;
    return `
      <div class="wpc${off ? ' wpc--off' : ''}" data-pid="${p.id}">
        <article class="wpc__card">
          <a class="wpc__media" href="${href}" tabindex="-1" aria-hidden="true">
            ${media}
            ${badge ? `<span class="wpc__badge">${esc(badge)}</span>` : ''}
          </a>
          <div class="wpc__body">
            <div class="wpc__row">
              <span class="wpc__price">${esc(p.priceText)}</span>
              <span class="wpc__rating" style="visibility: ${p.rating === 0 ? 'hidden' : 'visible'};">${STAR_SVG}<span>${ratingOf(p)}</span><small>(${reviewsOf(p)})</small></span>
            </div>
            <h3 class="wpc__title"><a href="${href}">${esc(p.title)}</a></h3>
            <div class="wpc__eta">${etaFor(seed, off)}</div>
            <div class="wpc__row wpc__foot">
              <div class="wpc__swatches" role="radiogroup" aria-label="Colour">
                ${colorsOf(p).map((c, i) => `<button type="button" class="wpc__swatch" role="radio" aria-label="${esc(c.name)}" aria-checked="${i === 0}" style="background: ${c.hex}; --sw: ${c.hex};"></button>`).join('')}
              </div>
              <button type="button" class="wpc__cta"${off ? ' disabled' : ''}><span class="wpc__cta-ic">${icon('cart', 16)}</span><span class="wpc__cta-t">${off ? 'Sold out' : 'Add to cart'}</span></button>
            </div>
          </div>
        </article>
      </div>`;
  }
  document.addEventListener('click', e => {
    const sw = e.target.closest('.wpc__swatch');
    if (sw) { sw.parentElement.querySelectorAll('.wpc__swatch').forEach(x => x.setAttribute('aria-checked', x === sw)); return; }
    const cta = e.target.closest('.wpc__cta');
    if (!cta || cta.disabled) return;
    add(cta.closest('.wpc').dataset.pid);
    const t = cta.querySelector('.wpc__cta-t');
    t.textContent = 'Added';
    clearTimeout(cta._t);
    cta._t = setTimeout(() => { t.textContent = 'Add to cart'; }, 1400);
  });

  /* ---------- Shop rail (aqua band; card counts locked by wu-rail.css) ---------- */
  function mountRail(root, { title, items, allHref = url.products, allLabel = 'Shop all', headingTag = 'h2', id } = {}) {
    root.classList.add('shop-rail');
    root.innerHTML = `
      <div class="shop-rail__head">
        <${headingTag} class="sec-title shop-rail__title"${id ? ` id="${id}"` : ''}>${esc(title)}</${headingTag}>
        <div class="shop-rail__ctrls">
          ${allHref ? `<a href="${allHref}" class="shop-rail__all">${esc(allLabel)}</a>` : ''}
          <button type="button" class="shop-rail__step" data-step="-1" aria-label="Previous products">${icon('chev-l', 18)}</button>
          <button type="button" class="shop-rail__step" data-step="1" aria-label="Next products">${icon('chev-r', 18)}</button>
        </div>
      </div>
      <div class="wu-rail">${items.map(p => productCard(p)).join('')}</div>`;
    const track = root.querySelector('.wu-rail');
    const [prev, next] = root.querySelectorAll('.shop-rail__step');
    const sync = () => {
      prev.toggleAttribute('data-dim', track.scrollLeft < 4);
      next.toggleAttribute('data-dim', track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
    };
    root.addEventListener('click', e => {
      const s = e.target.closest('[data-step]');
      if (!s) return;
      const card = track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 20 : 300;
      track.scrollBy({ left: +s.dataset.step * card * Math.max(1, Math.floor(track.clientWidth / card) - 1) });
    });
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
    return track;
  }

  /* ---------- Lifestyle hero (crossfade) ---------- */
  const HERO_POS = { 'hero-os4': '50% 0%' };
  function mountHero(el, slides = D.lifestyle) {
    if (!el) return;
    const n = slides.length;
    let i = 0, hover = false;
    el.innerHTML = slides.map((s, k) => `
      <div class="hero__slide${k === 0 ? ' is-on' : ''}" aria-roledescription="slide" aria-label="${k + 1} of ${n}">
        ${s.src ? `<img class="hero__img" src="${s.src}" alt="${esc(s.hint)}"${HERO_POS[s.slotId] ? ` style="object-position: ${HERO_POS[s.slotId]};"` : ''}${k ? ' loading="lazy"' : ''}>` : ''}
        <div class="hero__scrim"></div>
        <div class="hero__copy">
          <div class="eyebrow eyebrow--warm">${esc(s.kicker)}</div>
          <div class="hero__name">${esc(s.name)}</div>
          <div class="hero__line">${esc(s.line)}</div>
          <div class="hero__cta">${btnBuy(s.ctaLabel, url.product(s.pid))}</div>
        </div>
      </div>`).join('') + `
      <button type="button" class="hero__arrow hero__arrow--prev" aria-label="Previous slide"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path stroke-width="1.6" d="M14.5 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
      <button type="button" class="hero__arrow hero__arrow--next" aria-label="Next slide"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path stroke-width="1.6" d="M9.5 6l6 6-6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
      <div class="hero__dots"><div class="dots" role="tablist" aria-label="Slides" style="position: static;">
        ${slides.map((_, k) => `<button type="button" class="dot" role="tab" aria-label="Slide ${k + 1}" aria-selected="${k === 0}"></button>`).join('')}
      </div></div>`;
    const slideEls = el.querySelectorAll('.hero__slide'), dots = el.querySelectorAll('.dot');
    const go = v => {
      i = (v + n) % n;
      slideEls.forEach((s, k) => s.classList.toggle('is-on', k === i));
      dots.forEach((d, k) => d.setAttribute('aria-selected', k === i));
    };
    el.addEventListener('click', e => {
      const t = e.target;
      if (t.closest('.hero__arrow--prev')) go(i - 1);
      else if (t.closest('.hero__arrow--next')) go(i + 1);
      else if (t.closest('.dot')) go([...dots].indexOf(t.closest('.dot')));
    });
    el.addEventListener('mouseenter', () => { hover = true; });
    el.addEventListener('mouseleave', () => { hover = false; });
    if (!reduced()) setInterval(() => { if (!hover) go(i + 1); }, 5000);
  }

  /* ---------- Accordion (FAQ pattern: one open at a time) ---------- */
  function mountAccordion(listEl, items, { first = 0, idPrefix = 'acc' } = {}) {
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
        b.setAttribute('aria-expanded', on);
        b.nextElementSibling.hidden = !on;
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
    el.innerHTML = `
      <footer class="footer">
        ${D.footer.map((c, i) => `<div class="ft__group"><h4><button type="button" class="ft__q" aria-expanded="false" aria-controls="ft-g${i}"><span>${esc(c.title)}</span><span class="ft__chev">${icon('chev-r', 18)}</span></button></h4><div class="ft__links" id="ft-g${i}">${c.links.map(l => { const h = linkFor(l); return `<a href="${h}"${isHere(h) ? ' aria-current="page"' : ''}>${esc(l)}</a>`; }).join('')}</div></div>`).join('')}
        <div>
          <a href="${url.home}" aria-label="WisdomUp home"><img src="img/wu-logo-white.png" alt="Wisdomup" style="height: 40px; display: block; margin-bottom: 20px;"></a>
          <p style="margin: 0 0 12px; font: 400 13px var(--font);"><a class="ft__help" href="${url.help}">We're here to help ›</a></p>
          <p style="margin: 0 0 12px; font: 400 13px var(--font); color: var(--navy-link);">support@wisdomup.pk · +92 327 9800153</p>
          <p class="footer__nl-msg" style="margin: 22px 0 12px; font: 400 13px var(--font);">New launches and live-only deals, straight to your inbox.</p>
          <form class="newsletter"><input type="email" placeholder="Email address" aria-label="Email address"><button aria-label="Subscribe" type="submit">${icon('arrow', 18)}</button></form>
        </div>
      </footer>
      <div class="subfooter"><span>Copyright © 2026 WisdomUp. All rights reserved.</span><span>Visa · MasterCard · JazzCash · EasyPaisa · COD</span></div>`;
    el.addEventListener('click', e => { const a = e.target.closest('.footer a[href="#"]'); if (a) e.preventDefault(); });
    // Link groups collapse into a one-open-at-a-time accordion (same behaviour as the FAQ) when the footer stacks.
    const FT_ACC = matchMedia('(max-width: 767px)');
    const groups = [...el.querySelectorAll('.ft__group')];
    const setGroup = open => groups.forEach(g => {
      const on = !FT_ACC.matches || g === open;
      g.querySelector('.ft__q').setAttribute('aria-expanded', on);
      g.querySelector('.ft__q').tabIndex = FT_ACC.matches ? 0 : -1;
      g.querySelector('.ft__links').hidden = !on;
    });
    groups.forEach(g => g.querySelector('.ft__q').addEventListener('click', () => {
      if (!FT_ACC.matches) return;
      setGroup(g.querySelector('.ft__q').getAttribute('aria-expanded') === 'true' ? null : g);
    }));
    const current = groups.find(g => g.querySelector('[aria-current="page"]')) || null; // open the group for this page
    FT_ACC.addEventListener('change', () => setGroup(current));
    setGroup(current);
    el.querySelector('.newsletter').addEventListener('submit', e => {
      e.preventDefault();
      if (e.currentTarget.querySelector('input').value) el.querySelector('.footer__nl-msg').textContent = 'Thanks — you’re on the list.';
    });
  }

  /* ---------- Smooth in-page scrolling that clears the fixed nav + any sticky bar ---------- */
  function scrollToEl(el, extra = 20) {
    if (!el) return;
    // Scrolling down hides the nav (sticky bars slide up to 16px); scrolling up reveals it again.
    const mobile = vw() < 640;
    const target = el.getBoundingClientRect().top + window.scrollY;
    const down = target > window.scrollY;
    const sticky = [...document.querySelectorAll('[data-sticky-offset]')].find(x => x.offsetParent !== null); // visible sticky bar only
    const topEdge = down ? (mobile ? 10 : 16) : (mobile ? 63 : 96);
    const stickyH = sticky ? sticky.getBoundingClientRect().height + 12 : 0;
    window.scrollTo({ top: target - topEdge - stickyH - extra, behavior: reduced() ? 'auto' : 'smooth' });
  }


  /* ---------- Init chrome on every page ---------- */
  let search;
  function initChrome({ active = null } = {}) {
    activeCat = active;
    renderUtility();
    renderNav(true);
    renderTrust();
    renderFooter();
    wireSeo();
    search = mountSearch();
    if (nav) nav.addEventListener('click', e => {
      const a = e.target.closest('[data-act]');
      if (!a) return;
      if (a.dataset.act === 'search') search.open();
      if (a.dataset.act === 'bag') toast(bag ? bag + (bag === 1 ? ' item' : ' items') + ' in your bag · checkout coming soon' : 'Your bag is empty');
      if (a.dataset.act === 'account') toast('Accounts are coming soon');
    });
    window.addEventListener('resize', () => { renderNav(); placeNav(); });
    window.addEventListener('scroll', placeNav, { passive: true });
    placeNav();
  }

  window.WU = {
    D, $, esc, reduced, vw, code, EASE, SLIDE_T: 'transform 640ms ' + EASE,
    CATS, slug, url, catHref, linkFor,
    icons: { STAR_SVG }, btnBuy,
    store, add, toast,
    productCard, colorsOf, ratingOf, reviewsOf, seedOf, mountRail, mountHero, mountAccordion,
    initChrome, placeNav, setActiveCat, navOffset, scrollToEl,
    openSearch: () => search && search.open(),
  };
})();
