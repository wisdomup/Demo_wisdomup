// WisdomUp — behaviour for the info pages (About, Corporate, Creators, Live, Where to Buy, Blog, Article, Help,
// Track, Policies, Manuals). Wires itself from data attributes, so each page only needs markup.
(function () {
  const { D, $, esc, url, toast, scrollToEl } = WU;
  WU.initChrome();

  /* ---------- Icons (data-icon="truck") ---------- */
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon, +(el.dataset.size || 24)); });

  /* ---------- Product art + product rails ---------- */
  document.querySelectorAll('[data-art]').forEach(el => {
    el.innerHTML = el.dataset.art.split(',').map(a => `<span>${art(a.trim(), { alt: '' })}</span>`).join('');
  });
  document.querySelectorAll('[data-rail]').forEach(el => {
    const ids = el.dataset.rail.split(',').map(s => s.trim());
    // 'new' / 'best' pick one product per type first (variety), capped at 16 cards
    const tagged = ids[0] === 'new' || ids[0] === 'best' ? D.products.filter(p => p.tabs.includes(ids[0])) : null;
    const items = tagged ? tagged.filter((p, i) => tagged.findIndex(x => x.type === p.type) === i).concat(tagged).filter((p, i, a) => a.indexOf(p) === i).slice(0, 16)
      : ids.map(id => D.byId(id)).filter(Boolean);
    WU.mountRail(el, { title: el.dataset.title || 'Shop the range', items, allHref: el.dataset.all || url.products, allLabel: el.dataset.allLabel || 'Shop all' });
  });

  /* ---------- Wishlist page: saved products (newest first) as a rail, or an empty state ---------- */
  const wl = $('wish-list');
  if (wl) {
    const paintList = () => {
      const items = WU.wishList().reverse().map(id => D.byId(id)).filter(Boolean);
      $('wish-count').textContent = items.length ? `${items.length} saved ${items.length === 1 ? 'item' : 'items'}.` : '';
      if (!items.length) {
        wl.innerHTML = `<div class="empty wish-empty"><span class="wish-empty__ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30"><path d="M12 20.2l-1.3-1.2C6.1 14.9 3.2 12.3 3.2 9a4.6 4.6 0 0 1 4.7-4.7c1.6 0 3.1.7 4.1 1.9a5.4 5.4 0 0 1 4.1-1.9A4.6 4.6 0 0 1 20.8 9c0 3.3-2.9 5.9-7.5 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg></span><h2>Your wishlist is empty</h2><p>Tap the heart on any product to save it here.</p><a class="btn-pill" href="${url.products}">Shop all products</a></div>`;
        return;
      }
      wl.innerHTML = '<div class="rail-wrap"><section id="wish-rail"></section></div>';
      WU.mountRail($('wish-rail'), { title: 'Your wishlist', items, allHref: url.products, allLabel: 'Keep shopping' });
    };
    paintList();
    window.addEventListener('wu-wish', paintList);
  }

  /* ---------- Static FAQ lists: one open at a time ---------- */
  document.querySelectorAll('[data-accordion]').forEach(list => {
    list.addEventListener('click', e => {
      const q = e.target.closest('.faq__q, .manual__q');
      if (!q || !list.contains(q)) return;
      const open = q.getAttribute('aria-expanded') !== 'true';
      list.querySelectorAll('.faq__q, .manual__q').forEach(b => {
        const on = b === q && open;
        b.setAttribute('aria-expanded', on);
        document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
      });
    });
  });

  /* ---------- Inquiry forms (Corporate, Creators, Help contact) ---------- */
  document.querySelectorAll('form[data-inquiry]').forEach(form => {
    const fill = form.querySelector('[data-fill]'), done = form.querySelector('[data-done]'), hint = form.querySelector('[data-hint]');
    const hintText = hint ? hint.textContent : '';
    form.querySelectorAll('.bk-chips').forEach(box => box.addEventListener('click', e => {
      const b = e.target.closest('.chip');
      if (!b) return;
      if (box.hasAttribute('data-single')) box.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b));
      else b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true');
    }));
    const valid = el => {
      const v = el.value.trim();
      if (el.required && !v) return false;
      if (v && el.type === 'email') return /^\S+@\S+\.\S+$/.test(v);
      if (v && el.type === 'tel') return v.replace(/\D/g, '').length >= 10;
      return true;
    };
    form.addEventListener('input', e => {
      const f = e.target.closest('.field');
      if (f) f.classList.remove('is-bad');
      if (hint) { hint.classList.remove('is-err'); hint.textContent = hintText; }
    });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const fields = [...form.querySelectorAll('input, textarea')].filter(el => el.name && el.name !== 'website');
      const bad = fields.filter(el => !valid(el));
      fields.forEach(el => { el.closest('.field')?.classList.toggle('is-bad', bad.includes(el)); el.setAttribute('aria-invalid', bad.includes(el)); });
      if (bad.length) {
        if (hint) { hint.classList.add('is-err'); hint.textContent = form.dataset.error || 'Please complete the highlighted fields.'; }
        bad[0].focus();
        return;
      }
      const v = n => (form.elements[n] ? form.elements[n].value.trim() : '');
      const picked = name => [...form.querySelectorAll(`.bk-chips[data-name="${name}"] [aria-pressed="true"]`)].map(b => b.textContent.trim());
      // Join picked chips as "a, b and c"; groups marked data-proper keep their capitals (brand names)
      const list = name => {
        const box = form.querySelector(`.bk-chips[data-name="${name}"]`), p = picked(name).map(t => box && box.hasAttribute('data-proper') ? t : t.toLowerCase());
        return p.length > 1 ? p.slice(0, -1).join(', ') + ' and ' + p[p.length - 1] : (p[0] || '');
      };
      const text = (form.dataset.success || '').replace(/\{(\w+)\}/g, (_, k) => k === 'first' ? (v('name').split(' ')[0] || 'there') : k in form.elements ? v(k) : list(k));
      // Send to the shop's enquiry inbox; without it (the demo) hand over to WhatsApp with everything filled in (2026-10-10, the audit)
      const go = form.querySelector('[type="submit"]'), title = form.dataset.leadTitle || 'Website enquiry';
      const data = {};
      fields.forEach(el => { data[el.name] = el.value.trim(); });
      form.querySelectorAll('.bk-chips[data-name]').forEach(box => { data[box.dataset.name] = picked(box.dataset.name).join(', '); });
      data.website = form.elements.website ? form.elements.website.value : '';
      go.disabled = true; go.classList.add('is-loading');
      const r = await WU.lead.send(form.dataset.lead || 'help', data);
      go.disabled = false; go.classList.remove('is-loading');
      if (r.field && form.elements[r.field]) {
        form.elements[r.field].closest('.field')?.classList.add('is-bad');
        if (hint) { hint.classList.add('is-err'); hint.textContent = r.error; }
        form.elements[r.field].focus();
        return;
      }
      const labelOf = name => { const el = form.elements[name], lab = el && el.id && form.querySelector(`label[for="${el.id}"]`); const legend = form.querySelector(`.bk-chips[data-name="${name}"]`)?.closest('fieldset')?.querySelector('legend'); return ((lab || legend || {}).textContent || name).replace('*', '').trim(); };
      const wa = WU.lead.wa(WU.lead.text(title, Object.keys(data).filter(k => k !== 'website').map(k => [labelOf(k), data[k]])));
      const first = v('name').split(' ')[0] || 'there';
      const badge = done.querySelector('.badge-grad');
      if (!badge.dataset.ok) badge.dataset.ok = badge.textContent;
      badge.textContent = r.ok ? badge.dataset.ok : 'One last step';
      done.querySelector('h2').innerHTML = `${r.ok ? 'Thanks' : 'Almost done'}, <b data-first>${esc(first)}.</b>`;
      done.querySelector('[data-msg]').textContent = r.ok ? text : 'Tap Send on WhatsApp — the message opens with everything you wrote filled in, and we reply within one working day.';
      let link = done.querySelector('[data-wa]');
      if (!link) { link = document.createElement('a'); link.className = 'btn-buy bk-wa'; link.target = '_blank'; link.rel = 'noopener'; link.dataset.wa = ''; link.innerHTML = (WU.wa ? WU.wa.svg : '') + '<span>Send on WhatsApp</span>'; done.querySelector('[data-reset]').before(link); }
      link.hidden = r.ok; link.href = wa;
      fill.hidden = true; done.hidden = false;
      WU.px('Lead', { content_name: title }); // pixel: an enquiry (no personal details are sent)
      scrollToEl(form, 0);
    });
    done.querySelector('[data-reset]').addEventListener('click', () => {
      form.reset(); done.hidden = true; fill.hidden = false;
      form.querySelector('input[name]').focus();
    });
  });

  /* ---------- Policy pages: contents highlight the section in view ---------- */
  const toc = document.querySelector('.toc');
  if (toc) {
    const links = [...toc.querySelectorAll('a[href^="#"]')], secs = links.map(a => $(a.getAttribute('href').slice(1))).filter(Boolean);
    const spy = () => {
      let cur = secs[0];
      secs.forEach(s => { if (s.getBoundingClientRect().top < 160) cur = s; });
      links.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + cur.id));
    };
    toc.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      history.replaceState(null, '', a.getAttribute('href'));
      scrollToEl($(a.getAttribute('href').slice(1)));
    });
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }
  // Deep links like shipping.html#express land below the fixed nav
  if (location.hash && /^#[\w-]+$/.test(location.hash)) setTimeout(() => { const t = $(location.hash.slice(1)); if (t) scrollToEl(t); }, 120);

  /* ---------- Help center search ---------- */
  const hs = $('help-search');
  if (hs) {
    const items = [...document.querySelectorAll('#help-faqs .faq__item')], none = $('help-none'), count = $('help-count');
    const run = () => {
      const q = hs.value.trim().toLowerCase();
      let n = 0;
      items.forEach(it => { const on = !q || it.textContent.toLowerCase().includes(q); it.hidden = !on; if (on) n++; });
      document.querySelectorAll('#help-faqs .hgroup').forEach(g => { g.hidden = !g.querySelector('.faq__item:not([hidden])'); });
      none.hidden = n > 0;
      count.textContent = q ? `${n} ${n === 1 ? 'answer' : 'answers'} for “${hs.value.trim()}”` : '';
      if (q && n === 1) { const only = items.find(it => !it.hidden).querySelector('.faq__q'); if (only.getAttribute('aria-expanded') !== 'true') only.click(); }
    };
    hs.addEventListener('input', run);
    document.querySelectorAll('[data-help-q]').forEach(b => b.addEventListener('click', () => { hs.value = b.dataset.helpQ; run(); hs.focus(); }));
  }

  /* ---------- Order tracker: live status from /api/orders (order number + the phone used to order) ---------- */
  const tf = $('track-form');
  if (tf) {
    const res = $('track-result');
    const STEPS = [['new', 'Order placed'], ['confirmed', 'Confirmed by our team'], ['paid', 'Payment received'], ['shipped', 'Handed to the courier'], ['delivered', 'Delivered']];
    const when = iso => new Date(iso).toLocaleString('en-PK', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
    const phoneNorm = v => { let d = String(v || '').replace(/\D/g, ''); if (d.startsWith('0092')) d = d.slice(4); else if (d.startsWith('92')) d = d.slice(2); if (d.startsWith('0')) d = d.slice(1); return /^3\d{9}$/.test(d) ? '0' + d : null; };
    const shop = window.WU_SHOP || { payments: {}, delivery: {} };
    function render(o) {
      const steps = STEPS.filter(([k]) => k !== 'paid' || o.payment !== 'cod');
      const reached = Object.fromEntries((o.history || []).map(h => [h.status, h.at]));
      const order = steps.map(([k]) => k), at = order.indexOf(o.status);
      const cancelled = o.status === 'cancelled';
      res.innerHTML = `<div class="track__head"><b>${esc(o.number)}</b><span class="badge-soft${cancelled ? ' badge-soft--bad' : ''}">${cancelled ? 'Cancelled' : esc((STEPS.find(([k]) => k === o.status) || [, o.status])[1])}</span></div>
        ${cancelled ? '<p style="margin: 0; font: 400 15px/1.6 var(--font); color: #3D4656;">This order was cancelled. If you didn\'t ask for this, please contact support.</p>' : `<ol class="timeline">${steps.map(([k, t], i) => `<li class="${i < at ? 'is-done' : i === at ? 'is-now' : ''}"><i aria-hidden="true"></i><div><b>${t}</b><span>${reached[k] ? when(reached[k]) : i === steps.length - 1 ? 'Expected in ' + esc((shop.delivery[o.delivery] || {}).eta || '3–5 working days') : 'Waiting'}</span></div></li>`).join('')}</ol>`}
        <div class="kv"><b>Items</b><span>${o.items.map(l => `${esc(l.title)}${Object.keys(l.attrs || {}).length ? ' (' + esc(Object.values(l.attrs).join(', ')) + ')' : ''} × ${l.qty}`).join('<br>')}</span><b>Ship to</b><span>${esc(o.city)}</span>${o.totals.discount ? `<b>Creator code</b><span>${esc(o.ref || '')} · −${esc(WU.D.rs(o.totals.discount))}</span>` : ''}<b>Total</b><span>${esc(WU.D.rs(o.totals.total))} · ${esc((shop.payments[o.payment] || {}).label || o.payment)}</span></div>`;
    }
    tf.addEventListener('submit', async e => {
      e.preventDefault();
      const no = tf.elements.order.value.trim().toUpperCase().replace(/\s+/g, ''), phone = phoneNorm(tf.elements.phone.value);
      tf.elements.order.closest('.field').classList.toggle('is-bad', !/^WU-\d{5,}$/.test(no));
      tf.elements.phone.closest('.field').classList.toggle('is-bad', !phone);
      if (!/^WU-\d{5,}$/.test(no)) { tf.elements.order.focus(); return; }
      if (!phone) { tf.elements.phone.focus(); return; }
      res.hidden = false;
      res.innerHTML = '<p class="meta-line">Looking up your order…</p>';
      try {
        const r = await fetch(`/api/orders?number=${encodeURIComponent(no)}&phone=${encodeURIComponent(phone)}`);
        const data = await r.json().catch(() => ({}));
        if (r.ok && data.ok) render(data.order);
        else res.innerHTML = `<div class="track__head"><b>${esc(no)}</b><span class="badge-soft">Not found</span></div>
          <p style="margin: 0; font: 400 15px/1.6 var(--font); color: #3D4656;">${esc(data.error || 'We could not look up orders right now.')} Check the number on your confirmation page, or contact support and we'll find it for you.</p>
          <div class="policy__links"><a href="${url.help}">Contact support</a><a href="${url.shipping}">Delivery times</a></div>`;
      } catch (err) {
        res.innerHTML = '<p style="margin: 0; font: 400 15px/1.6 var(--font); color: #3D4656;">We could not reach the order system. Please try again in a moment.</p>';
      }
      scrollToEl(res, 0);
    });
    // Recent orders placed on this device: one tap to track
    const recent = (WU.store.get('wu-orders', []) || []).slice(0, 3);
    if ($('track-recent') && recent.length) $('track-recent').innerHTML = 'Recent: ' + recent.map(o => `<button type="button" class="link-arrow" data-track="${esc(o.number)}" data-phone="${esc(o.customer.phone)}">${esc(o.number)}</button>`).join(' ');
    tf.addEventListener('click', e => { const b = e.target.closest('[data-track]'); if (b) { tf.elements.order.value = b.dataset.track; tf.elements.phone.value = b.dataset.phone; tf.requestSubmit(); } });
    const q = new URLSearchParams(location.search);
    if (q.get('n')) { tf.elements.order.value = q.get('n'); if (q.get('p')) { tf.elements.phone.value = q.get('p'); tf.requestSubmit(); } }
  }

  /* ---------- Live: countdown to Friday 8 PM PKT + reminder ---------- */
  const cd = document.querySelector('[data-countdown]');
  if (cd) {
    // Friday 8 PM Pakistan time whatever the visitor's clock zone (WU.live); the date is shown as it falls in Pakistan
    const tick = () => { cd.innerHTML = WU.live.parts().map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join(''); };
    tick(); setInterval(tick, 1000);
    const nd = $('live-next');
    if (nd) nd.textContent = new Date(WU.live.next()).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'Asia/Karachi' }) + ' · 8 PM PKT';
  }
  document.querySelectorAll('[data-remind]').forEach(b => b.addEventListener('click', WU.live.remind)); // a calendar event with an alert

  /* ---------- Blog index + article ---------- */
  const POSTS = window.WU_POSTS || [];
  const postCard = (p, lead) => `
    <a class="post${lead ? ' post--lead' : ''}" href="${url.article(p.slug)}">
      <div class="post__media" style="background: ${p.bg};">${art(p.art, { alt: '' })}<span class="post__cat">${esc(p.cat)}</span></div>
      <div class="post__body"><span class="meta-line">${esc(p.date)} · ${p.mins} min read</span><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><span class="tile__go">Read article ›</span></div>
    </a>`;
  // Blog index (2026-10-07, insta360.com/blog's format in our design language): the blog bar's category chips filter the grid
  // (real addresses blog.html?cat=…; the plain blog stays canonical), the featured carousel shows every post centred with its
  // neighbours peeking (WU.mountGlide), and the grid lists the posts — cover (the post's backdrop + its first product's photo),
  // category, title, summary, date. Facts only: everything comes from js/posts.js and catalog.js.
  const bl = $('blog-list');
  if (bl) {
    const catSlug = c => String(c).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const CATS_B = [...new Set(POSTS.map(p => p.cat))];
    const photoOf = p => ((p.products || []).map(id => D.byId(id)).find(Boolean) || {}).src || '';
    const ph = (p, cls) => `<span class="${cls}"><img src="${photoOf(p)}" alt="" loading="lazy" draggable="false"></span>`;
    // featured carousel
    const btrack = $('bban-track'), NB = POSTS.length;
    if (btrack && NB) {
      btrack.innerHTML = [0, 1, 2].flatMap(c => POSTS.map(p => `
        <a class="bban__card" href="${url.article(p.slug)}" draggable="false" style="background: ${p.bg};"${c !== 1 ? ' tabindex="-1" aria-hidden="true"' : ''}>${ph(p, 'bban__ph')}<span class="bban__t">${esc(p.title)}</span></a>`)).join('');
      $('bban-dots').innerHTML = `<div class="dots on-light-dots" role="tablist" aria-label="Featured articles" style="position: static;">${POSTS.map((p, k) => `<button type="button" class="dot" role="tab" aria-label="Article ${k + 1} of ${NB}: ${esc(p.title)}"></button>`).join('')}</div>`;
      WU.mountGlide({ root: $('blog-banner'), track: btrack, dots: [...$('bban-dots').querySelectorAll('.dot')], n: NB, align: 'center' });
    } else if ($('blog-banner')) $('blog-banner').hidden = true;
    // category chips + grid
    const tabs = $('blog-tabs');
    tabs.innerHTML = [['', 'All'], ...CATS_B.map(c => [catSlug(c), c])].map(([k, l]) => `<a class="chip" href="${k ? url.blog + '?cat=' + k : url.blog}" data-cat="${k}">${esc(l)}</a>`).join('');
    const card = p => `
      <article class="bcard">
        <a class="bcard__cover" href="${url.article(p.slug)}" tabindex="-1" aria-hidden="true" style="background: ${p.bg};">${ph(p, 'bcard__ph')}</a>
        <div class="bcard__info">
          <a class="bcard__cat" href="${url.blog}?cat=${catSlug(p.cat)}" data-cat="${catSlug(p.cat)}">${esc(p.cat)}</a>
          <h3 class="bcard__t"><a href="${url.article(p.slug)}">${esc(p.title)}</a></h3>
          <p class="bcard__d">${esc(p.excerpt)}</p>
        </div>
        <div class="bcard__date">${esc(p.date)} · ${p.mins} min read</div>
      </article>`;
    const render = (cat, swap) => {
      if (cat && !CATS_B.some(c => catSlug(c) === cat)) cat = '';
      tabs.querySelectorAll('.chip').forEach(a => a.setAttribute('aria-current', String(a.dataset.cat === cat)));
      $('bsec-h').textContent = cat ? CATS_B.find(c => catSlug(c) === cat) : 'Latest articles';
      $('bsec-all').hidden = !cat;
      bl.innerHTML = (cat ? POSTS.filter(p => catSlug(p.cat) === cat) : POSTS).map(card).join('');
      if (swap) { WU.revealWords($('bsec-h')); WU.staggerCards(bl); }
    };
    // chips, the "All articles" link and the category on each card switch the grid in place (the address follows)
    document.addEventListener('click', e => {
      const a = e.target.closest('#blog-tabs .chip, .bcard__cat, #bsec-all');
      if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button > 0) return;
      e.preventDefault();
      const cat = a.dataset.cat || '';
      const to = cat ? url.blog + '?cat=' + cat : url.blog;
      history[(new URLSearchParams(location.search).get('cat') || '') === cat ? 'replaceState' : 'pushState']({ cat }, '', to); // no duplicate entries
      render(cat, true);
      if (!a.closest('#blog-tabs')) scrollToEl($('bsec-h').closest('.bsec'));
    });
    window.addEventListener('popstate', () => render(new URLSearchParams(location.search).get('cat') || '', true));
    render(new URLSearchParams(location.search).get('cat') || '', false);
  }
  const ar = $('article');
  if (ar) {
    const slug = new URLSearchParams(location.search).get('p') || location.hash.slice(1); // ?p=slug (old #slug links still work)
    const p = POSTS.find(x => x.slug === slug) || POSTS[0];
    const cover = (p.products || []).map(id => (D.byId(id) || {}).src).filter(Boolean)[0];
    WU.seo({
      title: (p.seoTitle || p.title) + ' | WisdomUp Blog', description: p.excerpt, path: url.article(p.slug), type: 'article', image: cover,
      ld: [
        { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.excerpt, articleSection: p.cat, mainEntityOfPage: WU.abs(url.article(p.slug)),
          ...(cover ? { image: WU.abs(cover) } : {}), ...(p.iso ? { datePublished: p.iso, dateModified: p.updated || p.iso } : {}), inLanguage: 'en-PK',
          author: { '@type': 'Organization', name: 'WisdomUp', url: WU.abs(url.home) }, publisher: { '@type': 'Organization', name: 'WisdomUp', logo: { '@type': 'ImageObject', url: WU.abs('img/wu-logo.png') } } },
        WU.ldCrumbs([['Home', url.home], ['Blog', url.blog], [p.title, url.article(p.slug)]]),
      ],
    });
    $('crumb-title').textContent = p.title;
    // Live facts in a post (2026-10-07, SEO guides): {price:id} = today's price from the catalogue + sale, and
    // <div data-list="type[,type]" data-max data-min data-match="Spec=value" data-specs="Spec,Spec" data-limit></div> = every
    // matching model, cheapest first, with its real specs and today's price — so a guide never quotes a stale price.
    const body = p.body.replace(/\{price:([a-z0-9-]+)\}/g, (m, id) => (D.byId(id) || {}).priceText || m);
    ar.innerHTML = `
      <header class="article__head"><span class="eyebrow">${esc(p.cat)}</span><h1>${esc(p.title)}</h1><span class="meta-line">${esc(p.date)} · ${p.mins} min read · WisdomUp team</span></header>
      <div class="article__hero" style="background: ${p.bg};" aria-hidden="true">${art(p.art, { alt: '' })}</div>
      <div class="prose">${body}</div>`;
    const spec = (x, k) => ((x.specs || []).find(s => s[0] === k) || [])[1];
    ar.querySelectorAll('[data-list]').forEach(el => {
      const types = el.dataset.list.split(','), max = +el.dataset.max || Infinity, min = +el.dataset.min || 0;
      const [mk, mv] = (el.dataset.match || '').split('=');
      const show = (el.dataset.specs || '').split(',').filter(Boolean);
      const all = D.products.filter(x => types.includes(x.type) && x.price >= min && x.price <= max && (!mk || spec(x, mk) === mv)).sort((a, b) => a.price - b.price);
      const list = el.dataset.limit ? all.slice(0, +el.dataset.limit) : all;
      if (!list.length) { el.remove(); return; }
      el.className = 'kv kv--list';
      el.innerHTML = list.map(x => `<b><a href="${url.product(x.id)}">${esc(x.title)}</a></b><span>${esc([...(show.length ? show.map(k => spec(x, k) && k + ': ' + spec(x, k)) : [x.meta]).filter(Boolean), x.priceText + (x.wasText ? ' (was ' + x.wasText + ')' : '')].join(' · '))}</span>`).join('')
        + (all.length > list.length ? `<b class="kv__more"><a href="${url.cat(types[0])}">See all ${esc(((window.WU_CATALOG.types || {})[types[0]] || {}).label || 'products')} ›</a></b><span>${all.length - list.length} more${mk ? ' with ' + esc(mv) : ''}</span>` : '');
    });
    const more = POSTS.filter(x => x.slug !== p.slug);
    $('more-posts').innerHTML = more.map(x => postCard(x)).join('');
    const rail = $('article-rail');
    if (rail && p.products) WU.mountRail(rail, { title: 'Products in this article', items: p.products.map(id => D.byId(id)).filter(Boolean), allHref: url.products });
    window.addEventListener('hashchange', () => location.reload());
  }
})();
