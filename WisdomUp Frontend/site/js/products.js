// WisdomUp — All Products page: category rails + jump bar (desktop) / product grid + Filters panel (phones),
// scroll-spy, sorting and URL filters (?filter=…&cat=…&price=…&color=…&feat=…&sort=…).
(function () {
  const { D, $, esc, CATS, slug, url, mountRail, mountHero, scrollToEl, setActiveCat, colorsOf } = WU;

  /* ---------- Filter dimensions ---------- */
  const FILTERS = {
    new: { label: 'New arrivals', test: p => p.tabs.includes('new') },
    best: { label: 'Best sellers', test: p => p.tabs.includes('best') },
    top: { label: 'Top rated', test: p => p.rating >= 5 },
    sale: { label: 'On sale', test: p => !!p.was && p.was > p.price },
  };
  const PRICES = {
    u3: { label: 'Under Rs.3,000', test: p => p.price < 3000 },
    m6: { label: 'Rs.3,000 – 5,999', test: p => p.price >= 3000 && p.price < 6000 },
    m10: { label: 'Rs.6,000 – 9,999', test: p => p.price >= 6000 && p.price < 10000 },
    p10: { label: 'Rs.10,000 & above', test: p => p.price >= 10000 },
  };
  const hours = p => { const m = p.meta.match(/(\d+)\+?\s*Hrs/i); return m ? +m[1] : 0; };
  const FEATS = {
    anc: { label: 'Active noise cancelling', test: p => /\bANC\b/i.test(p.meta) },
    enc: { label: 'ENC call mics', test: p => /\bENC\b/i.test(p.meta) },
    water: { label: 'Water resistant (IPX)', test: p => /IPX\d/i.test(p.meta) },
    battery: { label: '30+ hours battery', test: p => hours(p) >= 30 },
    fast: { label: 'Fast charging', test: p => /fast|\bPD\b/i.test(p.meta) },
    wireless: { label: 'Wireless / magnetic charging', test: p => /15W Wireless|Magnetic \||Wireless Charging/i.test(p.meta) },
    rgb: { label: 'RGB lights', test: p => /RGB/i.test(p.meta) },
  };
  const colorNames = p => colorsOf(p).map(c => c.name);
  const COLORS = [...new Set(D.products.flatMap(colorNames))].map(name => ({ name, key: name.toLowerCase().replace(/\s+/g, '-'), hex: D.products.map(colorsOf).flat().find(c => c.name === name).hex }));
  const SORTS = {
    featured: 'Featured', relevant: 'Most relevant', best: 'Best selling', az: 'Alphabetically, A-Z', za: 'Alphabetically, Z-A',
    low: 'Price, low to high', high: 'Price, high to low', old: 'Date, old to new', new: 'Date, new to old', off: 'Biggest discount',
  };
  // Phone listing header copy per view (title + one-line blurb, expandable)
  const COPY = {
    all: ['Shop all products', 'Every WisdomUp product in one place — open-ear and true wireless earbuds, ENC neckbands, the Thunder Pro party speaker, MKF creator mics and fast wireless and car chargers, all backed by brand warranty and delivered across Pakistan.'],
    new: ['Shop new arrivals', 'The latest WisdomUp launches, from the OS-4 and OS-5 open-ear earbuds to the TS-10 with ANC and the MKF creator mics — fresh stock, ready to ship.'],
    best: ['Shop best sellers', 'The earbuds, speakers and chargers our customers in 50+ countries buy most — tested favourites with warranty and 30-day money-back cover.'],
    top: ['Shop top-rated tech', 'Five-star rated WisdomUp products, picked by real buyers for sound, battery life and build quality.'],
    sale: ['Shop tech on sale', 'Earbuds, speakers and more at reduced prices — while stock lasts, with the same warranty and nationwide delivery.'],
    u3: ['Shop tech under Rs.3,000', 'Wireless earbuds, neckbands and car chargers under Rs.3,000 — budget-friendly tech that still comes with WisdomUp warranty and support.'],
  };

  /* ---------- State (from the URL) ---------- */
  const params = new URLSearchParams(location.search);
  const list = k => (params.get(k) || '').split(',').filter(Boolean);
  const state = {
    filter: FILTERS[params.get('filter')] ? params.get('filter') : null,
    cat: CATS.find(c => c.toLowerCase() === (params.get('cat') || '').toLowerCase()) || null,
    price: PRICES[params.get('price')] ? params.get('price') : null,
    colors: list('color').filter(k => COLORS.some(c => c.key === k)),
    feats: list('feat').filter(k => FEATS[k]),
    sort: SORTS[params.get('sort')] ? params.get('sort') : 'featured',
  };
  if (params.get('filter') === 'under3000') state.price = 'u3'; // old home-page chip link
  const PHONE = matchMedia('(max-width: 639px)');
  // On phones the listing is one grid, so a category link (#cat-earbuds) filters it instead of jumping to a rail.
  const catFromHash = () => CATS.find(c => '#' + slug(c) === location.hash) || null;
  if (PHONE.matches && !state.cat && catFromHash()) state.cat = catFromHash();
  const sortSel = $('sort');
  sortSel.value = state.sort;

  WU.initChrome();
  mountHero($('hero'));
  $('pbanner-sub').textContent = `${D.products.length} products · earbuds, speakers, mics & chargers`;
  $('pbanner-art').innerHTML = ['speaker', 'buds', 'bank-ice'].map((a, i) => `<span class="pbanner__a pbanner__a--${i + 1}">${art(a)}</span>`).join('');

  /* ---------- Matching + sorting ---------- */
  const matches = (p, st) => (!st.filter || FILTERS[st.filter].test(p))
    && (!st.cat || p.cat === st.cat)
    && (!st.price || PRICES[st.price].test(p))
    && (!st.colors.length || colorNames(p).some(n => st.colors.includes(COLORS.find(c => c.name === n).key)))
    && (!st.feats.length || st.feats.some(k => FEATS[k].test(p)));
  const matching = st => D.products.filter(p => matches(p, st));
  const discount = p => p.was ? (p.was - p.price) / p.was : 0;
  // No launch dates in the catalogue: "Newly launched" / new-tab items count as newest, then catalogue order.
  const idx = p => D.products.indexOf(p);
  const age = p => ((p.ribbon === 'Newly launched' || p.tabs.includes('new')) ? 0 : 1000) + idx(p);
  const relevance = p => (p.tabs.includes('best') ? 2 : 0) + (p.tabs.includes('new') ? 1 : 0) + (p.rating >= 5 ? 1 : 0);
  const SORTERS = {
    featured: (a, b) => idx(a) - idx(b),
    relevant: (a, b) => relevance(b) - relevance(a) || idx(a) - idx(b),
    best: (a, b) => (b.tabs.includes('best') - a.tabs.includes('best')) || ((b.rating || 0) - (a.rating || 0)) || idx(a) - idx(b),
    az: (a, b) => a.title.localeCompare(b.title),
    za: (a, b) => b.title.localeCompare(a.title),
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
    old: (a, b) => age(b) - age(a),
    new: (a, b) => age(a) - age(b),
    off: (a, b) => discount(b) - discount(a),
  };
  const order = (items, s) => items.slice().sort(SORTERS[s] || SORTERS.featured).sort((a, b) => (a.soldOut ? 1 : 0) - (b.soldOut ? 1 : 0)); // stable: sold-out items sink
  const activeCount = st => (st.filter ? 1 : 0) + (st.cat ? 1 : 0) + (st.price ? 1 : 0) + st.colors.length + st.feats.length;
  function syncUrl() {
    const p = new URLSearchParams();
    if (state.filter) p.set('filter', state.filter);
    if (state.cat) p.set('cat', state.cat.toLowerCase());
    if (state.price) p.set('price', state.price);
    if (state.colors.length) p.set('color', state.colors.join(','));
    if (state.feats.length) p.set('feat', state.feats.join(','));
    if (state.sort !== 'featured') p.set('sort', state.sort);
    history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : '') + location.hash);
  }

  /* ---------- Render ---------- */
  let groups = [];
  const SEP = '<svg class="mcrumbs__sep" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 5.5 15.5 12 9 18.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function render() {
    const pool = matching(state);
    groups = CATS.map(c => ({ cat: c, items: order(pool.filter(p => p.cat === c), state.sort) })).filter(g => g.items.length);
    const total = pool.length;

    // Desktop: category rails
    $('groups').innerHTML = groups.length ? groups.map(g => `<section class="pgroup" id="${slug(g.cat)}" aria-labelledby="${slug(g.cat)}-h"><div class="pg-rail"></div></section>`).join('')
      : `<div class="empty"><h2>No products match this filter yet</h2><p>New launches land every month. Browse the full range in the meantime.</p><a class="btn-pill" href="${url.products}">See all products</a></div>`;
    groups.forEach(g => {
      const host = document.querySelector('#' + slug(g.cat) + ' .pg-rail');
      mountRail(host, { title: g.cat, items: g.items, allHref: null, id: slug(g.cat) + '-h' });
      host.querySelector('.shop-rail__title').insertAdjacentHTML('beforeend', `<span class="pgroup__count">${g.items.length} ${g.items.length === 1 ? 'product' : 'products'}</span>`);
    });
    $('jump-chips').innerHTML = groups.map(g => `<a class="chip" href="#${slug(g.cat)}" data-cat="${g.cat}">${esc(g.cat)}<span class="jumpbar__chip-n">${g.items.length}</span></a>`).join('');
    const labels = [state.filter && FILTERS[state.filter].label, state.price && PRICES[state.price].label, ...state.colors.map(k => COLORS.find(c => c.key === k).name), ...state.feats.map(k => FEATS[k].label)].filter(Boolean);
    const fb = $('filterbar');
    fb.hidden = !labels.length;
    if (labels.length) fb.innerHTML = `<span>Showing <b>${esc(labels.join(', '))}</b> · ${total} ${total === 1 ? 'product' : 'products'}</span><a href="${url.products}" data-clear aria-label="Clear filters">${icon('chev-l', 14)} Clear filters</a>`;

    // Phones: every matching product in one grid, sorted across categories
    const all = order(pool, state.sort);
    $('mgrid').innerHTML = all.length ? all.map(p => WU.productCard(p)).join('')
      : `<div class="empty"><h2>No products match yet</h2><p>Try removing a filter.</p><a class="btn-pill" href="${url.products}">See all products</a></div>`;

    const n = activeCount(state);
    $('fbtn-n').hidden = !n;
    $('fbtn-n').textContent = n;
    $('mbar-info').textContent = `${total} ${total === 1 ? 'item' : 'items'}`;
    const key = state.filter || (state.price === 'u3' && !state.cat ? 'u3' : 'all');
    $('mtitle').textContent = state.cat ? `Shop ${state.cat.toLowerCase()}` : COPY[key][0];
    $('mdesc-t').textContent = COPY[key][1];
    const tail = [state.cat, ...labels].filter(Boolean);
    $('mcrumbs-tail').innerHTML = tail.length
      ? `<a href="${url.products}">All Products</a>${SEP}<b aria-current="page">${esc(tail.length > 2 ? tail.slice(0, 2).join(' · ') + ' +' + (tail.length - 2) : tail.join(' · '))}</b>`
      : '<b aria-current="page">All Products</b>';
    const pill = (id, text, on) => { $(id).querySelector('span').textContent = text; $(id).classList.toggle('is-set', on); };
    pill('pill-cat', state.cat || 'Category', !!state.cat);
    pill('pill-show', state.filter ? FILTERS[state.filter].label : 'Show', !!state.filter);
    pill('pill-sort', state.price ? PRICES[state.price].label : 'Price', !!state.price);
    $('msort-label').textContent = SORTS[state.sort];
    paintSortList();
    spy();
  }

  /* ---------- Scroll-spy: highlight the category in view (jump bar + site nav) ---------- */
  const stickyBar = () => [$('jumpbar'), $('mbar')].find(el => el.offsetParent !== null);
  function spy() {
    const bar = stickyBar() ? stickyBar().getBoundingClientRect().bottom : 0;
    let cur = groups[0] ? groups[0].cat : null;
    const line = Math.max(bar + 80, innerHeight * .35);
    groups.forEach(g => { const el = $(slug(g.cat)); if (el && el.getBoundingClientRect().top < line) cur = g.cat; });
    $('jump-chips').querySelectorAll('.chip').forEach(c => {
      const on = c.dataset.cat === cur;
      c.setAttribute('aria-current', on);
      if (on && c.offsetParent) {
        const box = c.parentElement, r = c.getBoundingClientRect(), b = box.getBoundingClientRect();
        if (r.left < b.left || r.right > b.right) box.scrollTo({ left: c.offsetLeft - 8, behavior: 'smooth' });
      }
    });
    setActiveCat(window.scrollY > 200 ? (PHONE.matches ? state.cat : cur) : null);
  }
  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('wu-nav', e => { $('jumpbar').classList.toggle('is-up', e.detail.hidden); $('mbar').classList.toggle('is-up', e.detail.hidden); });
  $('jumpbar').addEventListener('transitionend', spy); // re-check once the bar finishes sliding

  /* ---------- Desktop jump bar + sort ---------- */
  $('jump-chips').addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    history.replaceState(null, '', a.getAttribute('href'));
    scrollToEl($(a.getAttribute('href').slice(1)));
  });
  window.addEventListener('hashchange', () => {
    if (PHONE.matches && catFromHash()) { state.cat = catFromHash(); syncUrl(); render(); scrollToEl($('mbar'), 0); return; }
    scrollToEl($(location.hash.slice(1)));
  });
  sortSel.addEventListener('change', () => { state.sort = sortSel.value; syncUrl(); render(); });
  document.addEventListener('click', e => {
    const c = e.target.closest('#filterbar [data-clear]');
    if (!c) return;
    e.preventDefault();
    Object.assign(state, { filter: null, price: null, colors: [], feats: [] });
    syncUrl(); render();
  });

  /* ---------- Phone sort dropdown (popover with ✓ on the active option) ---------- */
  const sortBtn = $('msort-btn'), sortList = $('msort-list');
  function paintSortList() {
    sortList.innerHTML = Object.entries(SORTS).map(([k, l]) => `<li class="msort__opt" role="option" id="so-${k}" data-sort="${k}" aria-selected="${k === state.sort}">${esc(l)}</li>`).join('');
  }
  let sortActive = 0;
  const sortOpts = () => [...sortList.querySelectorAll('.msort__opt')];
  const markActive = i => { const o = sortOpts(); sortActive = (i + o.length) % o.length; o.forEach((x, k) => x.classList.toggle('is-active', k === sortActive)); sortList.setAttribute('aria-activedescendant', o[sortActive].id); o[sortActive].scrollIntoView({ block: 'nearest' }); };
  function openSort() { sortList.hidden = false; sortBtn.setAttribute('aria-expanded', 'true'); sortList.focus(); markActive(Object.keys(SORTS).indexOf(state.sort)); }
  function closeSort(focusBtn) { sortList.hidden = true; sortBtn.setAttribute('aria-expanded', 'false'); if (focusBtn) sortBtn.focus(); }
  function pickSort(k) { state.sort = k; sortSel.value = k; syncUrl(); render(); closeSort(true); }
  sortBtn.addEventListener('click', () => (sortList.hidden ? openSort() : closeSort()));
  sortList.addEventListener('click', e => { const o = e.target.closest('[data-sort]'); if (o) pickSort(o.dataset.sort); });
  sortList.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); markActive(sortActive + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); markActive(sortActive - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickSort(sortOpts()[sortActive].dataset.sort); }
    else if (e.key === 'Escape' || e.key === 'Tab') closeSort(e.key === 'Escape');
  });
  document.addEventListener('click', e => { if (!sortList.hidden && !e.target.closest('#msort')) closeSort(); });

  /* ---------- Products per row (1 or 2), remembered ---------- */
  const setCols = n => {
    $('mgrid').classList.toggle('mgrid--1', n === 1);
    $('mgrid').classList.toggle('mgrid--2', n === 2);
    document.querySelectorAll('.mview__b').forEach(b => b.setAttribute('aria-pressed', +b.dataset.cols === n));
    WU.store.set('wu-cols', n);
  };
  document.querySelectorAll('.mview__b').forEach(b => b.addEventListener('click', () => setCols(+b.dataset.cols)));
  setCols(WU.store.get('wu-cols', 2) === 1 ? 1 : 2);
  $('mdesc-more').addEventListener('click', e => {
    const open = $('mdesc').classList.toggle('is-open');
    e.currentTarget.textContent = open ? 'read less' : 'read more';
    e.currentTarget.setAttribute('aria-expanded', open);
  });

  /* ---------- Phone filter panel (slides in from the left; accordion sections) ---------- */
  const drawer = $('fdrawer'), scrim = $('fscrim'), openBtn = $('open-filters');
  let draft = null;
  const copyState = st => ({ ...st, colors: st.colors.slice(), feats: st.feats.slice() });
  const opt = (type, name, value, label, checked, count, extra = '') =>
    `<label class="fopt${count === 0 && !checked ? ' is-empty' : ''}"><input type="${type}" name="${name}" value="${value}"${checked ? ' checked' : ''}><i aria-hidden="true"></i>${extra}<span>${esc(label)}</span>${count != null ? `<small>${count}</small>` : ''}</label>`;
  // Facet counts: how many products you'd get if this option were chosen, keeping every other choice.
  const countWith = patch => matching({ ...draft, ...patch }).length;
  function paintDrawer() {
    $('f-show').innerHTML = opt('radio', 'f-show', '', 'All products', !draft.filter, countWith({ filter: null }))
      + Object.entries(FILTERS).map(([k, f]) => opt('radio', 'f-show', k, f.label, draft.filter === k, countWith({ filter: k }))).join('');
    $('f-cats').innerHTML = opt('radio', 'f-cat', '', 'All categories', !draft.cat, countWith({ cat: null }))
      + CATS.map(c => opt('radio', 'f-cat', c, c, draft.cat === c, countWith({ cat: c }))).join('');
    $('f-price').innerHTML = opt('radio', 'f-price', '', 'Any price', !draft.price, countWith({ price: null }))
      + Object.entries(PRICES).map(([k, pr]) => opt('radio', 'f-price', k, pr.label, draft.price === k, countWith({ price: k }))).join('');
    $('f-color').innerHTML = COLORS.map(c => opt('checkbox', 'f-color', c.key, c.name, draft.colors.includes(c.key), countWith({ colors: [c.key] }), `<span class="fopt__sw" style="background: ${c.hex};"></span>`)).join('');
    $('f-feat').innerHTML = Object.entries(FEATS).map(([k, f]) => opt('checkbox', 'f-feat', k, f.label, draft.feats.includes(k), countWith({ feats: [k] }))).join('');
    $('f-sort').innerHTML = Object.entries(SORTS).map(([k, l]) => opt('radio', 'f-sort', k, l, draft.sort === k)).join('');
    // Current choice shown on each row, like "On sale" or "2 selected"
    const val = (id, t) => { $(id + '-v').textContent = t || ''; };
    val('fsec-show', draft.filter && FILTERS[draft.filter].label);
    val('fsec-cat', draft.cat);
    val('fsec-price', draft.price && PRICES[draft.price].label);
    val('fsec-color', draft.colors.length ? (draft.colors.length === 1 ? COLORS.find(c => c.key === draft.colors[0]).name : draft.colors.length + ' selected') : '');
    val('fsec-feat', draft.feats.length ? (draft.feats.length === 1 ? FEATS[draft.feats[0]].label : draft.feats.length + ' selected') : '');
    val('fsec-sort', draft.sort !== 'featured' && SORTS[draft.sort]);
    const n = matching(draft).length;
    $('apply-filters').textContent = n ? `Show ${n} ${n === 1 ? 'result' : 'results'}` : 'No results';
    $('apply-filters').disabled = !n;
    $('clear-filters').hidden = !activeCount(draft) && draft.sort === 'featured';
  }
  const setSection = (sec, open) => { const h = sec.querySelector('.facc__h'); h.setAttribute('aria-expanded', open); sec.querySelector('.facc__p').hidden = !open; };
  drawer.addEventListener('click', e => {
    const h = e.target.closest('.facc__h');
    if (h) setSection(h.closest('.facc'), h.getAttribute('aria-expanded') !== 'true');
  });
  let lastFocus = null;
  function openDrawer(section) {
    draft = copyState(state);
    paintDrawer();
    drawer.querySelectorAll('.facc').forEach(s => setSection(s, s.id === section));
    lastFocus = document.activeElement;
    drawer.hidden = scrim.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    openBtn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => { drawer.classList.add('is-open'); scrim.classList.add('is-open'); });
    setTimeout(() => {
      const sec = typeof section === 'string' && $(section);
      if (sec) { const body = sec.parentElement; body.scrollTop = sec.offsetTop - body.offsetTop - 4; sec.querySelector('.facc__h').focus(); }
      else $('close-filters').focus();
    }, 60);
  }
  function closeDrawer(after) {
    drawer.classList.remove('is-open'); scrim.classList.remove('is-open');
    openBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    const done = () => { drawer.hidden = scrim.hidden = true; drawer.style.transform = ''; if (after) after(); else if (lastFocus) lastFocus.focus(); };
    if (WU.reduced()) done(); else setTimeout(done, 360);
  }
  openBtn.addEventListener('click', () => openDrawer());
  document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => openDrawer(b.dataset.open)));
  $('close-filters').addEventListener('click', () => closeDrawer());
  scrim.addEventListener('click', () => closeDrawer());
  drawer.addEventListener('change', e => {
    const { name, value, checked } = e.target;
    if (name === 'f-show') draft.filter = value || null;
    if (name === 'f-cat') draft.cat = value || null;
    if (name === 'f-price') draft.price = value || null;
    if (name === 'f-sort') draft.sort = value;
    if (name === 'f-color') draft.colors = checked ? draft.colors.concat(value) : draft.colors.filter(k => k !== value);
    if (name === 'f-feat') draft.feats = checked ? draft.feats.concat(value) : draft.feats.filter(k => k !== value);
    paintDrawer();
    const again = drawer.querySelector(`input[name="${name}"][value="${value}"]`);
    if (again) again.focus();
  });
  $('clear-filters').addEventListener('click', () => { draft = { filter: null, cat: null, price: null, colors: [], feats: [], sort: 'featured' }; paintDrawer(); });
  $('apply-filters').addEventListener('click', () => {
    Object.assign(state, copyState(draft));
    sortSel.value = state.sort;
    history.replaceState(null, '', location.pathname + location.search);
    syncUrl(); render();
    closeDrawer(() => { scrollToEl($('mbar'), 0); openBtn.focus(); });
  });
  // Keyboard: Escape closes, Tab stays inside the panel
  drawer.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDrawer(); return; }
    if (e.key !== 'Tab') return;
    const f = [...drawer.querySelectorAll('button:not([disabled]), input')].filter(x => !x.closest('[hidden]') && (x.type !== 'radio' || x.checked));
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  // Touch: swipe the panel left to close it
  let sx = null, dx = 0;
  drawer.addEventListener('touchstart', e => { sx = e.touches[0].clientX; dx = 0; }, { passive: true });
  drawer.addEventListener('touchmove', e => {
    if (sx == null) return;
    dx = Math.min(0, e.touches[0].clientX - sx);
    if (dx < -6) { drawer.classList.add('is-dragging'); drawer.style.transform = `translateX(${dx}px)`; }
  }, { passive: true });
  drawer.addEventListener('touchend', () => {
    drawer.classList.remove('is-dragging');
    if (dx < -70) closeDrawer(); else drawer.style.transform = '';
    sx = null;
  });
  window.addEventListener('resize', () => { if (!drawer.hidden && innerWidth >= 640) closeDrawer(); });

  render();
  if (location.hash) setTimeout(() => scrollToEl(PHONE.matches ? $('mbar') : $(location.hash.slice(1)), PHONE.matches ? 0 : 20), 80);
})();
