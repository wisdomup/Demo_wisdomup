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
    const items = ids[0] === 'new' || ids[0] === 'best' ? D.products.filter(p => p.tabs.includes(ids[0])) : ids.map(id => D.byId(id)).filter(Boolean);
    WU.mountRail(el, { title: el.dataset.title || 'Shop the range', items, allHref: el.dataset.all || url.products, allLabel: el.dataset.allLabel || 'Shop all' });
  });

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
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fields = [...form.querySelectorAll('input, textarea')].filter(el => el.name);
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
      done.querySelector('[data-first]').textContent = (v('name').split(' ')[0] || 'there') + '.';
      done.querySelector('[data-msg]').textContent = text;
      fill.hidden = true; done.hidden = false;
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

  /* ---------- Order tracker (preview: real tracking connects to the order system at launch) ---------- */
  const tf = $('track-form');
  if (tf) {
    const res = $('track-result');
    const SAMPLE = 'WU-10245';
    tf.addEventListener('submit', e => {
      e.preventDefault();
      const no = tf.elements.order.value.trim().toUpperCase().replace(/\s+/g, ''), phone = tf.elements.phone.value.replace(/\D/g, '');
      const field = tf.elements.order.closest('.field');
      field.classList.toggle('is-bad', !no);
      if (!no) { tf.elements.order.focus(); return; }
      res.hidden = false;
      if (no !== SAMPLE) {
        res.innerHTML = `<div class="track__head"><b>${esc(no)}</b><span class="badge-soft">Not found</span></div>
          <p style="margin: 0; font: 400 15px/1.6 var(--font); color: #3D4656;">We couldn't find an order with that number${phone ? ' and phone number' : ''}. Check the number in your confirmation SMS or email (it looks like <b>WU-10245</b>), or contact support and we'll look it up for you.</p>
          <div class="policy__links"><a href="${url.help}">Contact support</a><a href="${url.shipping}">Delivery times</a></div>`;
        return;
      }
      const d = n => { const x = new Date(); x.setDate(x.getDate() + n); return x.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); };
      const steps = [['Order confirmed', d(-2) + ' · Cash on Delivery', 'done'], ['Packed at our Karachi warehouse', d(-1), 'done'], ['Handed to courier', d(-1) + ' · Standard delivery', 'done'], ['Out for delivery', 'Expected ' + d(1), 'now'], ['Delivered', 'Pay the rider in cash or by card', '']];
      res.innerHTML = `<div class="track__head"><b>${SAMPLE}</b><span class="badge-soft">Sample order</span></div>
        <p class="meta-line" style="margin: -8px 0 0;">This is a preview of how tracking will look. Live order tracking connects to our order system at launch.</p>
        <ol class="timeline">${steps.map(([t, s, st]) => `<li class="${st ? 'is-' + st : ''}"><i aria-hidden="true"></i><div><b>${t}</b><span>${s}</span></div></li>`).join('')}</ol>
        <div class="kv"><b>Items</b><span>OS-4 Open Stereo Earbuds × 1</span><b>Ship to</b><span>Lahore, Punjab</span><b>Total</b><span>Rs.6,000 · Cash on Delivery</span></div>`;
      scrollToEl(res, 0);
    });
    document.querySelectorAll('[data-sample-order]').forEach(b => b.addEventListener('click', () => { tf.elements.order.value = SAMPLE; tf.requestSubmit(); }));
  }

  /* ---------- Live: countdown to Friday 8 PM PKT + reminder ---------- */
  const cd = document.querySelector('[data-countdown]');
  if (cd) {
    const pad = n => String(n).padStart(2, '0');
    const nextShow = () => { const n = new Date(), t = new Date(n); t.setHours(20, 0, 0, 0); let a = (5 - n.getDay() + 7) % 7; if (a === 0 && n >= t) a = 7; t.setDate(t.getDate() + a); return t; };
    const tick = () => {
      const ms = nextShow() - new Date();
      cd.innerHTML = [[pad(Math.floor(ms / 864e5)), 'Days'], [pad(Math.floor(ms / 36e5) % 24), 'Hrs'], [pad(Math.floor(ms / 6e4) % 60), 'Min'], [pad(Math.floor(ms / 1e3) % 60), 'Sec']]
        .map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('');
    };
    tick(); setInterval(tick, 1000);
    const nd = $('live-next');
    if (nd) nd.textContent = nextShow().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + ' · 8 PM PKT';
  }
  document.querySelectorAll('[data-remind]').forEach(b => b.addEventListener('click', () => {
    b.textContent = 'Reminder set';
    b.setAttribute('aria-pressed', 'true');
    toast('We’ll remind you before Friday’s show');
  }));

  /* ---------- Blog index + article ---------- */
  const POSTS = window.WU_POSTS || [];
  const postCard = (p, lead) => `
    <a class="post${lead ? ' post--lead' : ''}" href="${url.article(p.slug)}">
      <div class="post__media" style="background: ${p.bg};">${art(p.art, { alt: '' })}<span class="post__cat">${esc(p.cat)}</span></div>
      <div class="post__body"><span class="meta-line">${esc(p.date)} · ${p.mins} min read</span><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><span class="tile__go">Read article ›</span></div>
    </a>`;
  const bl = $('blog-list');
  if (bl) bl.innerHTML = POSTS.map((p, i) => postCard(p, i === 0)).join('');
  const ar = $('article');
  if (ar) {
    const slug = location.hash.slice(1);
    const p = POSTS.find(x => x.slug === slug) || POSTS[0];
    document.title = p.title + ' | WisdomUp Blog';
    document.querySelector('meta[name="description"]').setAttribute('content', p.excerpt);
    $('crumb-title').textContent = p.title;
    ar.innerHTML = `
      <header class="article__head"><span class="eyebrow">${esc(p.cat)}</span><h1>${esc(p.title)}</h1><span class="meta-line">${esc(p.date)} · ${p.mins} min read · WisdomUp team</span></header>
      <div class="article__hero" style="background: ${p.bg};" aria-hidden="true">${art(p.art, { alt: '' })}</div>
      <div class="prose">${p.body}</div>`;
    const more = POSTS.filter(x => x.slug !== p.slug);
    $('more-posts').innerHTML = more.map(x => postCard(x)).join('');
    const rail = $('article-rail');
    if (rail && p.products) WU.mountRail(rail, { title: 'Products in this article', items: p.products.map(id => D.byId(id)).filter(Boolean), allHref: url.products });
    window.addEventListener('hashchange', () => location.reload());
  }
})();
