// WisdomUp — All Products page: one product grid (4 / 3 / 2 per row; 1-or-2 toggle on phones), Filters panel,
// sort dropdown and URL filters (?dept=…&cat=…&filter=…&price=…&conn=…&feat=…&sort=…). Data: js/catalog.js.
(function () {
  const { D, $, esc, CATS, DEPTS, typeLabel, slug, url, scrollToEl, setActiveCat } = WU;

  /* ---------- Filter dimensions (all derived from catalogue fields) ---------- */
  const FILTERS = {
    new: { label: 'New for 2026', test: p => p.tabs.includes('new') },
    best: { label: 'Best sellers', test: p => p.tabs.includes('best') },
  };
  const PRICES = {
    u1: { label: 'Under Rs.1,000', test: WU.budget.u1 }, // Rs.1–1,000 (bands in common.js)
    u2: { label: 'Under Rs.2,000', test: WU.budget.u2 }, // Rs.1,001–2,000
    u5: { label: 'Under Rs.5,000', test: WU.budget.u5 }, // Rs.2,001–5,000
    m3: { label: 'Rs.1,000 – 2,999', test: p => p.price >= 1000 && p.price < 3000 },
    m10: { label: 'Rs.3,000 – 9,999', test: p => p.price >= 3000 && p.price < 10000 },
    p10: { label: 'Rs.10,000 & above', test: p => p.price >= 10000 },
  };
  const CONNS = ['USB-C', 'Lightning', 'Micro-USB', '3.5mm', 'HDMI'];
  const FEATS = {
    fast: 'Fast charging', wireless: 'Wireless charging', anc: 'Active noise cancelling',
    magnetic: 'Magnetic', lights: 'Lights / RGB', water: 'Water resistant',
  };
  const SORTS = { featured: 'Featured', new: 'Newest first', best: 'Best selling', low: 'Price, low to high', high: 'Price, high to low', az: 'Alphabetically, A-Z', za: 'Alphabetically, Z-A' };
  // Listing header copy: per department (types reuse their department's line)
  const DEPT_COPY = {
    audio: 'Wireless and open-ear earbuds, neckbands, handsfree, headphones, speakers and wireless mics — tuned for clear calls and full bass.',
    charging: 'Wall chargers with cables, power banks, wireless and car chargers and power strips — fast, protected charging for every device.',
    cables: 'Fast-charging USB-C, Lightning and Micro-USB cables, AUX and HDMI cables, OTG adapters and Bluetooth receivers.',
    car: 'Magnetic and clamp car phone holders, car chargers, wireless car mounts and Bluetooth FM transmitters for every drive.',
    stands: 'Desk, laptop and tablet stands, bike and motorbike mounts and Bluetooth selfie sticks.',
    computer: 'Wired and wireless keyboard and mouse sets, wireless mice and wrist-rest mouse pads.',
    storage: 'microSD memory cards, USB 3.0 flash drives and card readers for phones, cameras and laptops.',
    care: 'Electric shavers and cordless hair clippers with long-lasting batteries and USB-C charging.',
  };
  const ALL_COPY = 'Every WisdomUp product sold in Pakistan — earbuds and headphones, speakers, chargers and power banks, cables and adapters, car and desk accessories, computer gear, storage and grooming — with brand warranty and nationwide delivery.';
  const deptOf = t => DEPTS.find(d => d.types.includes(t));

  /* ---------- State (from the URL; old links keep working) ---------- */
  const params = new URLSearchParams(location.search);
  const list = k => (params.get(k) || '').split(',').filter(Boolean);
  const state = {
    filter: FILTERS[params.get('filter')] ? params.get('filter') : null,
    dept: DEPTS.some(d => d.id === params.get('dept')) ? params.get('dept') : null,
    cat: CATS.includes(params.get('cat')) ? params.get('cat') : null,
    price: PRICES[params.get('price')] ? params.get('price') : null,
    conns: list('conn').filter(k => CONNS.includes(k)),
    feats: list('feat').filter(k => FEATS[k]),
    sort: SORTS[params.get('sort')] ? params.get('sort') : 'featured',
  };
  // A category link (#cat-earbuds) filters the grid
  const catFromHash = () => CATS.find(c => '#' + slug(c) === location.hash) || null;
  if (catFromHash()) { state.cat = catFromHash(); state.dept = null; }
  const PAGE = 24;
  let shown = PAGE;

  WU.initChrome();
  $('pbanner-sub').textContent = `${D.products.length} products · earbuds, chargers, cables, speakers & more`;
  const bannerPicks = ['yx-28', 'ts-11anc', 'cdb-18'].map(D.byId).filter(Boolean);
  $('pbanner-art').innerHTML = bannerPicks.map((p, i) => `<span class="pbanner__a pbanner__a--${i + 1} pbanner__a--photo" style="background: ${WU.photoBg(p)};"><img src="${p.thumb}" alt="" style="${WU.photoFit(p)}"></span>`).join('');

  /* ---------- Matching + sorting ---------- */
  const inScope = (p, st) => st.cat ? p.type === st.cat : st.dept ? DEPTS.find(d => d.id === st.dept).types.includes(p.type) : true;
  const matches = (p, st) => (!st.filter || FILTERS[st.filter].test(p))
    && inScope(p, st)
    && (!st.price || PRICES[st.price].test(p))
    && (!st.conns.length || st.conns.some(k => p.connectors.includes(k)))
    && (!st.feats.length || st.feats.some(k => p.features.includes(k)));
  const matching = st => D.products.filter(p => matches(p, st));
  const idx = p => D.products.indexOf(p);
  const SORTERS = {
    featured: (a, b) => idx(a) - idx(b),
    new: (a, b) => (b.year || 0) - (a.year || 0) || idx(a) - idx(b),
    best: (a, b) => (b.tabs.includes('best') - a.tabs.includes('best')) || (b.tabs.includes('new') - a.tabs.includes('new')) || idx(a) - idx(b),
    az: (a, b) => a.title.localeCompare(b.title, 'en', { numeric: true }),
    za: (a, b) => b.title.localeCompare(a.title, 'en', { numeric: true }),
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
  };
  const order = (items, s) => items.slice().sort(SORTERS[s] || SORTERS.featured).sort((a, b) => (a.soldOut ? 1 : 0) - (b.soldOut ? 1 : 0));
  const activeCount = st => (st.filter ? 1 : 0) + (st.cat || st.dept ? 1 : 0) + (st.price ? 1 : 0) + st.conns.length + st.feats.length;
  function syncUrl() {
    const p = new URLSearchParams();
    if (state.dept) p.set('dept', state.dept);
    if (state.cat) p.set('cat', state.cat);
    if (state.filter) p.set('filter', state.filter);
    if (state.price) p.set('price', state.price);
    if (state.conns.length) p.set('conn', state.conns.join(','));
    if (state.feats.length) p.set('feat', state.feats.join(','));
    if (state.sort !== 'featured') p.set('sort', state.sort);
    history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
  }
  const scopeLabel = st => st.cat ? typeLabel(st.cat) : st.dept ? DEPTS.find(d => d.id === st.dept).label : null;

  /* ---------- Render ---------- */
  const SEP = '<svg class="mcrumbs__sep" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 5.5 15.5 12 9 18.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  let all = [];
  function paintGrid() {
    const slice = all.slice(0, shown);
    $('mgrid').innerHTML = slice.length ? slice.map(p => WU.productCard(p)).join('')
      : `<div class="empty"><h2>No products match yet</h2><p>Try removing a filter.</p><a class="btn-pill" href="${url.products}">See all products</a></div>`;
    const left = all.length - slice.length;
    $('mgrid-more').hidden = left <= 0;
    $('mgrid-shown').textContent = `Showing ${slice.length} of ${all.length}`;
    $('show-more').textContent = `Show ${Math.min(PAGE, left)} more`;
    WU.paintWish();
  }
  /* ---------- Buying guide under the grid: the category's copy, common questions and related categories.
     One short paragraph shows; the rest opens with "Read more" (never hidden from people — only folded). ---------- */
  let guideKey = null;
  function paintGuide(key, entry, fill, d) {
    if (!$('seo-guide') || key === guideKey) return;
    guideKey = key;
    $('seo-h').textContent = entry.guide || entry.h1 || entry.name;
    $('seo-lead').textContent = fill(entry.intro[0]);
    $('seo-rest').innerHTML = entry.intro.slice(1).map(t => `<p>${esc(fill(t))}</p>`).join('');
    const faqs = (entry.faqs || []).map(([q, a]) => [fill(q), fill(a)]);
    $('seo-faq-h').hidden = !faqs.length;
    $('seo-faq-wrap').innerHTML = '<div class="panel-list" id="seo-faq"></div>'; // fresh node each time: no stacked click handlers
    if (faqs.length) WU.mountAccordion($('seo-faq'), faqs, { idPrefix: 'seofaq', ldReset: true });
    // Related categories: links between sibling categories help people and search engines find the whole range
    const K = window.WU_SEO || {}, nm = t => ((K.types || {})[t] || {}).name || typeLabel(t);
    const links = state.cat && d ? d.types.filter(t => t !== state.cat && CATS.includes(t)).map(t => [nm(t), url.cat(t)]).concat([[`All ${d.label}`, url.dept(d.id)]])
      : state.dept && d ? d.types.filter(t => CATS.includes(t)).map(t => [nm(t), url.cat(t)])
      : DEPTS.map(x => [((K.depts || {})[x.id] || {}).name || x.label, url.dept(x.id)]);
    $('seo-links').innerHTML = links.map(([t, h]) => `<a href="${h}">${esc(t)}</a>`).join('');
  }
  if ($('seo-guide-toggle')) $('seo-guide-toggle').addEventListener('click', e => {
    const b = e.currentTarget, more = $('seo-more-wrap'), open = more.hidden;
    more.hidden = !open;
    b.setAttribute('aria-expanded', open);
    b.querySelector('.seo__toggle-t').textContent = open ? 'Read less' : 'Read more';
  });
  function render() {
    all = order(matching(state), state.sort);
    shown = PAGE;
    paintGrid();
    const total = all.length;
    const labels = [state.filter && FILTERS[state.filter].label, state.price && PRICES[state.price].label, ...state.conns, ...state.feats.map(k => FEATS[k])].filter(Boolean);
    const n = activeCount(state);
    $('fbtn-n').hidden = !n;
    $('fbtn-n').textContent = n;
    $('mbar-info').innerHTML = `<b>${total}</b> ${total === 1 ? 'item' : 'items'}`;
    const scope = scopeLabel(state);
    const d = state.cat ? deptOf(state.cat) : state.dept ? DEPTS.find(x => x.id === state.dept) : null;
    // ---- SEO: this view describes itself to Google — title, H1, description, canonical address, structured data.
    //      The wording lives in js/seo-content.js; counts and prices are filled in from the live catalogue. ----
    const K = window.WU_SEO || {};
    const pure = !state.cat && !state.dept && !!state.filter && !state.price && !state.conns.length && !state.feats.length; // a plain New / Best sellers page
    const entry = (state.cat ? (K.types || {})[state.cat] : state.dept ? (K.depts || {})[state.dept] : pure ? (K.filters || {})[state.filter] : K.all) || { name: scope || 'All Products', intro: [d ? DEPT_COPY[d.id] : ALL_COPY], faqs: [] };
    const scopeItems = D.products.filter(p => inScope(p, state) && (!pure || FILTERS[state.filter].test(p)));
    const prices = scopeItems.map(p => p.price);
    const fill = t => String(t || '').replace(/\{n\}/g, scopeItems.length).replace(/\{min\}/g, prices.length ? D.rs(Math.min(...prices)) : '').replace(/\{max\}/g, prices.length ? D.rs(Math.max(...prices)) : '').replace(/\{year\}/g, WU.YEAR);
    const h1 = entry.h1 || (state.cat ? `${entry.name} Price in Pakistan` : `${entry.name} in Pakistan`);
    const path = state.cat ? url.cat(state.cat) : state.dept ? url.dept(state.dept) : pure ? url.filter(state.filter) : url.products;
    if ($('mtitle').textContent !== h1) { $('mtitle').textContent = h1; WU.revealWords($('mtitle')); } // only when it changes (never on a re-sort)
    $('mdesc-t').textContent = fill(entry.intro[0]);
    WU.seo({
      title: entry.title ? fill(entry.title) : state.cat ? `${entry.name} Price in Pakistan ${WU.YEAR} | WisdomUp` : `${entry.name} in Pakistan — Prices ${WU.YEAR} | WisdomUp`,
      description: fill(entry.intro[0]),
      path, // extra filters and sorting keep the category's own address as the canonical one
      image: all[0] && all[0].src,
      ld: [
        WU.ldCrumbs([['Home', url.home], ['All Products', url.products]].concat(d && state.cat ? [[d.label, url.dept(d.id)]] : []).concat(path !== url.products ? [[entry.name, path]] : [])),
        { '@context': 'https://schema.org', '@type': 'ItemList', name: h1, numberOfItems: all.length, itemListElement: all.slice(0, PAGE).map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, url: WU.abs(url.product(p.id)) })) },
      ],
    });
    paintGuide(path, entry, fill, d);
    // Breadcrumb: All Products › Department › Type · filters
    const crumbs = [];
    if (d && state.cat) crumbs.push(`<a href="${url.dept(d.id)}">${esc(d.label)}</a>`);
    const tail = [scope, ...labels].filter(Boolean);
    $('mcrumbs-tail').innerHTML = tail.length
      ? `<a href="${url.products}">All Products</a>${SEP}${crumbs.map(c => c + SEP).join('')}<b aria-current="page">${esc(tail.length > 2 ? tail.slice(0, 2).join(' · ') + ' +' + (tail.length - 2) : tail.join(' · '))}</b>`
      : '<b aria-current="page">All Products</b>';
    const pill = (id, text, on) => { $(id).querySelector('span').textContent = text; $(id).classList.toggle('is-set', on); };
    pill('pill-cat', scope || 'Category', !!scope);
    pill('pill-show', state.filter ? FILTERS[state.filter].label : 'Show', !!state.filter);
    pill('pill-sort', state.price ? PRICES[state.price].label : 'Price', !!state.price);
    $('msort-label').textContent = SORTS[state.sort];
    $('msort-btn').setAttribute('aria-label', 'Sort by: ' + SORTS[state.sort]); // the word "Sort" is not shown (compact), but it is still announced
    syncFloat();
    markPillScroll();
    paintSortList();
    spy();
  }
  $('show-more').addEventListener('click', () => {
    const first = shown;
    shown += PAGE;
    paintGrid();
    const next = $('mgrid').children[first];
    if (next) { const a = next.querySelector('.wpc__title a'); if (a) a.focus({ preventScroll: true }); }
  });

  // Floating twin of the filter capsule (#mfloat): copies of the chips that pass clicks to the real ones.
  // Copies carry no ids / ARIA and never take focus — keyboard and screen-reader users use the real chips.
  const mfloat = $('mfloat');
  const syncFloat = () => {
    mfloat.querySelector('.mbar__pills').innerHTML = [...document.querySelectorAll('#mbar .fbtn')].map(b => {
      const c = b.cloneNode(true);
      c.dataset.proxy = b.id;
      ['id', 'aria-controls', 'aria-expanded', 'aria-haspopup', 'data-open'].forEach(k => c.removeAttribute(k));
      c.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
      c.tabIndex = -1;
      return c.outerHTML;
    }).join('');
  };
  mfloat.addEventListener('mousedown', e => e.preventDefault()); // a click must not move focus onto a copy
  mfloat.addEventListener('click', e => { const b = e.target.closest('[data-proxy]'); if (b) $(b.dataset.proxy).click(); });
  // Flag a chip row that is wider than its capsule, so its ends can fade
  const markPillScroll = () => document.querySelectorAll('.mbar__pills').forEach(p => p.classList.toggle('is-scroll', p.scrollWidth > p.clientWidth + 1));
  window.addEventListener('resize', markPillScroll);

  /* ---------- Site nav: highlight the filtered category once scrolled ---------- */
  const spy = () => setActiveCat(window.scrollY > 200 ? state.cat : null);
  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('wu-nav', e => $('mbar').classList.toggle('is-up', e.detail.hidden));
  window.addEventListener('hashchange', () => {
    if (catFromHash()) { state.cat = catFromHash(); state.dept = null; syncUrl(); render(); scrollToEl($('mbar'), 0); }
  });

  /* ---------- Sort dropdown (popover with ✓ on the active option) ---------- */
  const sortBtn = $('msort-btn'), sortList = $('msort-list');
  function paintSortList() {
    if (!sortList.children.length) sortList.innerHTML = Object.entries(SORTS).map(([k, l], i) => `<li class="msort__opt" role="option" id="so-${k}" data-sort="${k}" aria-selected="false" style="--i: ${i};"><span>${esc(l)}</span></li>`).join('');
    sortList.querySelectorAll('.msort__opt').forEach(o => o.setAttribute('aria-selected', String(o.dataset.sort === state.sort)));
  }
  let sortActive = 0;
  const sortOpts = () => [...sortList.querySelectorAll('.msort__opt')];
  const markActive = i => { const o = sortOpts(); sortActive = (i + o.length) % o.length; o.forEach((x, k) => x.classList.toggle('is-active', k === sortActive)); sortList.setAttribute('aria-activedescendant', o[sortActive].id); o[sortActive].scrollIntoView({ block: 'nearest', inline: 'nearest' }); };
  // Bugatti-style morph (2026-10-06, measured on bugatti.store/collections/tech, rebuilt in our code): the panel opens
  // exactly over the button (--sb-w / --sb-h) and its clip-path grows to the full panel in 500ms on the hover curve;
  // "Sort Featured" fades out, "SORT BY" fades in, the dot becomes a round ×, the options fade in 50ms apart.
  const sortPanel = $('msort-panel');
  const sortOpen = () => !sortPanel.hidden && sortPanel.classList.contains('is-open');
  let sortClosing = 0;
  function openSort() {
    clearTimeout(sortClosing);
    const r = sortBtn.getBoundingClientRect();
    $('msort-now').textContent = SORTS[state.sort];
    sortPanel.classList.add('is-setup'); // no transitions while it is measured and placed, so the morph starts exactly on the button
    sortPanel.style.right = '0px';
    sortPanel.hidden = false;
    // anchored to the button's top-right like bugatti.store; where that would leave the screen (phones: the 1/2 toggle sits
    // to the right) the panel slides right just enough to keep a 12px margin, and the morph starts from the button's spot
    const vwid = document.documentElement.clientWidth, pw = sortPanel.offsetWidth, g = 12;
    const shift = Math.max(0, Math.min(g - (r.right - pw), vwid - g - r.right));
    sortPanel.style.right = (-shift) + 'px';
    sortPanel.style.setProperty('--sb-w', r.width + 'px');
    sortPanel.style.setProperty('--sb-h', r.height + 'px');
    sortPanel.style.setProperty('--sb-r', shift + 'px');
    sortPanel.style.setProperty('--sb-l', Math.max(0, pw - shift - r.width) + 'px');
    void sortPanel.querySelector('.msort__sheet').offsetWidth; // commit the closed shape before transitions come back
    sortPanel.classList.remove('is-setup');
    requestAnimationFrame(() => requestAnimationFrame(() => sortPanel.classList.add('is-open')));
    sortBtn.setAttribute('aria-expanded', 'true');
    sortList.focus({ preventScroll: true });
    markActive(Object.keys(SORTS).indexOf(state.sort));
  }
  function closeSort(focusBtn, after) {
    if (sortPanel.hidden) { if (after) after(); return; }
    sortPanel.classList.remove('is-open');
    sortBtn.setAttribute('aria-expanded', 'false');
    const done = () => { sortPanel.hidden = true; if (after) after(); };
    if (WU.reduced()) done(); else sortClosing = setTimeout(done, 560);
    if (focusBtn) sortBtn.focus({ preventScroll: true });
  }
  // Picking an option (2026-10-07, "it snaps and has a delay"): the cheap parts change at once — the underline moves, the
  // button takes the new label and the panel's closed shape is re-measured to the NEW button, so the morph folds straight
  // into it (it used to fold into the old, narrower button and then snap wider). The heavy part — re-sorting and repainting
  // the grid — waits until the fold has finished, so nothing blocks the animation; the cards then glide in (staggerCards).
  function pickSort(k) {
    if (k === state.sort) return closeSort(true);
    state.sort = k;
    syncUrl();
    paintSortList();
    $('msort-label').textContent = $('msort-now').textContent = SORTS[k];
    sortBtn.setAttribute('aria-label', 'Sort by: ' + SORTS[k]);
    const r = sortBtn.getBoundingClientRect(), pw = sortPanel.offsetWidth, shift = parseFloat(sortPanel.style.getPropertyValue('--sb-r')) || 0;
    sortPanel.style.setProperty('--sb-w', r.width + 'px');
    sortPanel.style.setProperty('--sb-h', r.height + 'px');
    sortPanel.style.setProperty('--sb-l', Math.max(0, pw - shift - r.width) + 'px');
    $('mgrid').classList.add('is-sorting');
    closeSort(true, () => {
      render();
      $('mgrid').classList.remove('is-sorting');
      WU.staggerCards($('mgrid'));
    });
  }
  sortBtn.addEventListener('click', () => (sortOpen() ? closeSort() : openSort()));
  $('msort-x').addEventListener('click', () => closeSort(true));
  sortList.addEventListener('click', e => { const o = e.target.closest('[data-sort]'); if (o) pickSort(o.dataset.sort); });
  sortList.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); markActive(sortActive + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); markActive(sortActive - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickSort(sortOpts()[sortActive].dataset.sort); }
    else if (e.key === 'Escape' || e.key === 'Tab') closeSort(e.key === 'Escape');
  });
  sortPanel.addEventListener('keydown', e => { if (e.key === 'Escape') closeSort(true); });
  document.addEventListener('click', e => { if (!sortPanel.hidden && !e.target.closest('#msort')) closeSort(); });

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

  /* ---------- Filter panel (slides in from the left; accordion sections) ---------- */
  const drawer = $('fdrawer'), scrim = $('fscrim'), openBtn = $('open-filters');
  let draft = null;
  const copyState = st => ({ ...st, conns: st.conns.slice(), feats: st.feats.slice() });
  const opt = (type, name, value, label, checked, count, extra = '') =>
    `<label class="fopt${count === 0 && !checked ? ' is-empty' : ''}"><input type="${type}" name="${name}" value="${value}"${checked ? ' checked' : ''}><i aria-hidden="true"></i>${extra}<span>${esc(label)}</span>${count != null ? `<small>${count}</small>` : ''}</label>`;
  // Facet counts: how many products you'd get if this option were chosen, keeping every other choice.
  const countWith = patch => matching({ ...draft, ...patch }).length;
  function paintDrawer() {
    $('f-show').innerHTML = opt('radio', 'f-show', '', 'All products', !draft.filter, countWith({ filter: null }))
      + Object.entries(FILTERS).map(([k, f]) => opt('radio', 'f-show', k, f.label, draft.filter === k, countWith({ filter: k }))).join('');
    // Category: departments with their types indented beneath (one choice)
    $('f-cats').innerHTML = opt('radio', 'f-cat', '', 'All categories', !draft.cat && !draft.dept, countWith({ cat: null, dept: null }))
      + DEPTS.map(d => `<div class="fopt-group">${opt('radio', 'f-cat', 'd:' + d.id, 'All ' + d.label.toLowerCase(), draft.dept === d.id && !draft.cat, countWith({ dept: d.id, cat: null }))}`
        + d.types.filter(t => CATS.includes(t)).map(t => opt('radio', 'f-cat', 't:' + t, typeLabel(t), draft.cat === t && draft.catDept === d.id, countWith({ cat: t, dept: null }))).join('') + '</div>').join('');
    $('f-price').innerHTML = opt('radio', 'f-price', '', 'Any price', !draft.price, countWith({ price: null }))
      + Object.entries(PRICES).map(([k, pr]) => opt('radio', 'f-price', k, pr.label, draft.price === k, countWith({ price: k }))).join('');
    $('f-conn').innerHTML = CONNS.map(k => opt('checkbox', 'f-conn', k, k === 'Lightning' ? 'Lightning (iPhone)' : k, draft.conns.includes(k), countWith({ conns: [k] }))).join('');
    $('f-feat').innerHTML = Object.entries(FEATS).map(([k, l]) => opt('checkbox', 'f-feat', k, l, draft.feats.includes(k), countWith({ feats: [k] }))).join('');
    $('f-sort').innerHTML = Object.entries(SORTS).map(([k, l]) => opt('radio', 'f-sort', k, l, draft.sort === k)).join('');
    // Current choice shown on each row, like "On sale" or "2 selected"
    const val = (id, t) => { $(id + '-v').textContent = t || ''; };
    val('fsec-show', draft.filter && FILTERS[draft.filter].label);
    val('fsec-cat', scopeLabel(draft));
    val('fsec-price', draft.price && PRICES[draft.price].label);
    val('fsec-conn', draft.conns.length ? (draft.conns.length === 1 ? draft.conns[0] : draft.conns.length + ' selected') : '');
    val('fsec-feat', draft.feats.length ? (draft.feats.length === 1 ? FEATS[draft.feats[0]] : draft.feats.length + ' selected') : '');
    val('fsec-sort', draft.sort !== 'featured' && SORTS[draft.sort]);
    const n = matching(draft).length;
    $('apply-filters').textContent = n ? `Show ${n} ${n === 1 ? 'result' : 'results'}` : 'No results';
    $('apply-filters').disabled = !n;
    $('clear-filters').hidden = !activeCount(draft) && draft.sort === 'featured';
  }
  const setSection = (sec, open) => { const h = sec.querySelector('.facc__h'); const was = h.getAttribute('aria-expanded') === 'true'; h.setAttribute('aria-expanded', open); if (was !== open) WU.slide(sec.querySelector('.facc__p'), open); else sec.querySelector('.facc__p').hidden = !open; };
  drawer.addEventListener('click', e => {
    const h = e.target.closest('.facc__h');
    if (h) setSection(h.closest('.facc'), h.getAttribute('aria-expanded') !== 'true');
  });
  let lastFocus = null;
  function openDrawer(section) {
    draft = copyState(state);
    draft.catDept = state.cat ? (deptOf(state.cat) || {}).id : null;
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
    if (WU.reduced()) done(); else setTimeout(done, 850);
  }
  openBtn.addEventListener('click', () => openDrawer());
  document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => openDrawer(b.dataset.open)));
  $('close-filters').addEventListener('click', () => closeDrawer());
  scrim.addEventListener('click', () => closeDrawer());
  drawer.addEventListener('change', e => {
    const { name, value, checked } = e.target;
    if (name === 'f-show') draft.filter = value || null;
    if (name === 'f-cat') {
      draft.dept = value.startsWith('d:') ? value.slice(2) : null;
      draft.cat = value.startsWith('t:') ? value.slice(2) : null;
      // A type can sit in two departments (e.g. car chargers): remember which row was ticked
      draft.catDept = draft.cat ? e.target.closest('.fopt-group').querySelector('input').value.slice(2) : null;
    }
    if (name === 'f-price') draft.price = value || null;
    if (name === 'f-sort') draft.sort = value;
    if (name === 'f-conn') draft.conns = checked ? draft.conns.concat(value) : draft.conns.filter(k => k !== value);
    if (name === 'f-feat') draft.feats = checked ? draft.feats.concat(value) : draft.feats.filter(k => k !== value);
    paintDrawer();
    const again = drawer.querySelector(`input[name="${name}"][value="${value}"]`);
    if (again) again.focus();
  });
  $('clear-filters').addEventListener('click', () => { draft = { filter: null, dept: null, cat: null, catDept: null, price: null, conns: [], feats: [], sort: 'featured' }; paintDrawer(); });
  $('apply-filters').addEventListener('click', () => {
    Object.assign(state, copyState(draft));
    history.replaceState(null, '', location.pathname + location.search);
    syncUrl(); render();
    closeDrawer(() => { scrollToEl($('mbar'), 0); openBtn.focus({ preventScroll: true }); });
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
  // Wider screens: swipe the panel left to close — only for a clearly sideways swipe. Vertical scrolling, and swipes
  // that start on a sideways-scrolling row (tiles, chips), never move the panel.
  let sx = null, sy = null, dx = 0, axis = null;
  const scrollsX = el => { for (let n = el; n && n !== drawer; n = n.parentElement) if (n.scrollWidth > n.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(n).overflowX)) return true; return false; };
  drawer.addEventListener('touchstart', e => { if (innerWidth < 640) { sx = null; return; } sx = e.touches[0].clientX; sy = e.touches[0].clientY; dx = 0; axis = scrollsX(e.target) ? 'y' : null; }, { passive: true });
  // Phones: the filter panel is a bottom sheet (same system as the menu) — drag it down to close
  WU.sheetDrag(drawer, () => closeDrawer(), { scroller: () => drawer.querySelector('.fdrawer__body'), head: '.fdrawer__head' });
  drawer.addEventListener('touchmove', e => {
    if (sx == null || axis === 'y') return;
    const mx = e.touches[0].clientX - sx, my = e.touches[0].clientY - sy;
    if (!axis) { if (Math.abs(mx) < 10 && Math.abs(my) < 10) return; axis = Math.abs(mx) > Math.abs(my) * 1.5 ? 'x' : 'y'; if (axis === 'y') return; }
    dx = Math.min(0, mx);
    drawer.classList.add('is-dragging'); drawer.style.transform = `translateX(${dx}px)`;
  }, { passive: true });
  drawer.addEventListener('touchend', () => { drawer.classList.remove('is-dragging'); if (axis === 'x' && dx < -70) closeDrawer(); else drawer.style.transform = ''; sx = null; axis = null; dx = 0; });
  drawer.addEventListener('touchcancel', () => { drawer.classList.remove('is-dragging'); drawer.style.transform = ''; sx = null; axis = null; dx = 0; });

  render();
  if (catFromHash()) setTimeout(() => scrollToEl($('mbar'), 0), 80);
})();
