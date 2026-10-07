// WisdomUp — the creators program (2026-10-08). creators.html: the program's numbers (from shop.js "creators"), tier cards,
// earnings calculator, popular picks with the commission each earns, and the REAL join form. creator-dashboard.html: the
// creator's own link, numbers, tier progress, 30-day activity, product link builder, captions, orders and payouts.
// Everything goes through /api/orders?cr=… (api/orders.py) — the server owns codes, discounts and commission.
(function () {
  const { D, $, esc, url, toast, SHOP, photoBg, photoFit } = WU;
  const R = WU.ref, CR = SHOP.creators || {};
  if (!CR.on) return;
  const rs = D.rs;
  const tiers = (CR.tiers || []).slice().sort((a, b) => a.from - b.from);
  const tierFor = sales => tiers.reduce((cur, t) => (sales >= t.from ? t : cur), tiers[0]);
  const PAY = { jazzcash: ['JazzCash', 'JazzCash number'], easypaisa: ['EasyPaisa', 'EasyPaisa number'], bank: ['Bank transfer', 'IBAN'] };
  const waLink = text => `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`;
  const phoneNorm = s => {
    let d = String(s || '').replace(/\D/g, '');
    if (d.startsWith('0092')) d = d.slice(4); else if (d.startsWith('92')) d = d.slice(2);
    if (d.startsWith('0')) d = d.slice(1);
    return /^3\d{9}$/.test(d) ? '0' + d : null;
  };
  // Links open the shop this page runs on (the live site, the demo or a local copy), with the code added
  const linkFor = (code, path = './') => { const u = new URL(path, location.href); u.searchParams.set('ref', code); return u.href; };
  const pretty = href => href.replace(/^https?:\/\//, '');
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) { const t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.append(t); t.select(); try { document.execCommand('copy'); } catch (x) { /* nothing more to try */ } t.remove(); }
    toast('Copied', R.TAG);
  }
  function share(text, href) {
    if (navigator.share) { navigator.share({ title: 'WisdomUp', text, url: href }).catch(() => {}); return; }
    window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + href), '_blank', 'noopener');
  }

  /* ---------- Program numbers on the page come from shop.js, so the copy can never disagree with what the server pays ---------- */
  const facts = {
    discount: CR.discountPct, linkDays: CR.linkDays, returnDays: CR.returnDays, minPayout: rs(CR.minPayout),
    minPct: tiers[0] && tiers[0].pct, maxPct: tiers.length && tiers[tiers.length - 1].pct, maxPctLabel: tiers.length && tiers[tiers.length - 1].pct + '%',
    tier2From: tiers[1] && rs(tiers[1].from), tier2Pct: tiers[1] && tiers[1].pct, tier3From: tiers[2] && rs(tiers[2].from),
  };
  document.querySelectorAll('[data-cr]').forEach(el => { const v = facts[el.dataset.cr]; if (v != null && v !== false) el.textContent = v; });

  if ($('cr-tiers')) programPage();
  if ($('crd')) dashboard();

  /* ============================== creators.html ============================== */
  function programPage() {
    // Tier cards
    $('cr-tiers').innerHTML = tiers.map((t, i) => `
      <article class="cr-tier${i === tiers.length - 1 ? ' cr-tier--top' : ''}">
        <span class="cr-tier__name">${esc(t.name)}</span>
        <b class="cr-tier__pct">${t.pct}<small>%</small></b>
        <span class="cr-tier__from">${t.from ? `In a month your sales pass ${esc(rs(t.from))}` : 'From your very first order'}</span>
      </article>`).join('');

    // Calculator: orders × average order, after the follower discount → the month's tier → commission
    const o = $('cr-orders'), v = $('cr-aov');
    const prices = D.products.filter(p => !p.soldOut).map(p => p.price).sort((a, b) => a - b);
    const median = prices.length ? prices[Math.floor(prices.length / 2)] : 2500;
    v.value = Math.min(+v.max, Math.max(+v.min, Math.round(median / 100) * 100));
    const paint = () => {
      const n = +o.value, aov = +v.value;
      const gross = n * aov, sales = gross - R.pctOf(gross, CR.discountPct || 0), t = tierFor(sales), earn = R.pctOf(sales, t.pct);
      $('cr-orders-o').textContent = n;
      $('cr-aov-o').textContent = rs(aov);
      $('cr-sales').textContent = rs(sales);
      $('cr-rate').textContent = `${t.name} · ${t.pct}%`;
      $('cr-month').textContent = rs(earn);
      $('cr-year').textContent = rs(earn * 12);
      [o, v].forEach(r => r.style.setProperty('--fill', ((r.value - r.min) / (r.max - r.min) * 100) + '%'));
    };
    o.addEventListener('input', paint); v.addEventListener('input', paint); paint();

    // Picks: one product for each creator-friendly type — a best seller or new launch when there is one, else the range —
    // the higher-priced model under Rs.25,000 first (it earns more per order, and is still an everyday buy); commission at the starting rate
    const PICK_TYPES = ['earbuds', 'headphones', 'speakers', 'microphones', 'neckbands', 'power-banks', 'shavers', 'clippers'];
    const live = D.products.filter(p => !p.soldOut), tagged = p => p.tabs.includes('best') || p.tabs.includes('new');
    const picks = PICK_TYPES.map(t => { const of = live.filter(p => p.type === t && p.price <= 25000); const pool = of.some(tagged) ? of.filter(tagged) : of; return pool.sort((a, b) => b.price - a.price)[0]; }).filter(Boolean).slice(0, 6);
    const earnOn = price => R.pctOf(price - R.pctOf(price, CR.discountPct || 0), tiers[0].pct);
    $('cr-picks').innerHTML = picks.map(p => `
      <a class="cr-pick" href="${url.product(p.id)}">
        <span class="cr-pick__img" style="background: ${photoBg(p)};"><img src="${p.thumb}" alt="" loading="lazy" style="${photoFit(p)}"></span>
        <span class="cr-pick__t">${esc(p.title)}</span>
        <span class="cr-pick__p">${esc(p.priceText)}</span>
        <span class="cr-pick__e">You earn <b>${esc(rs(earnOn(p.price)))}</b> per order</span>
      </a>`).join('');

    // Terms link opens the fold-out
    document.addEventListener('click', e => { if (e.target.closest('[data-terms]')) { $('terms').open = true; } });
    joinForm();
  }

  function joinForm() {
    const form = $('join');
    const chips = (id, list, def) => { $(id).innerHTML = list.map(([k, label]) => `<button type="button" class="chip" data-v="${esc(k)}" aria-pressed="${k === def}">${esc(label)}</button>`).join(''); };
    chips('j-platform', CR.platforms.map(x => [x, x]), CR.platforms[0]);
    chips('j-audience', CR.audiences.map(x => [x, x]), CR.audiences[0]);
    chips('j-method', [['', 'Add later'], ...CR.payouts.map(k => [k, PAY[k][0]])], '');
    const picked = id => { const b = $(id).querySelector('[aria-pressed="true"]'); return b ? b.dataset.v : ''; };
    const paintPay = () => { const m = picked('j-method'); $('j-payfields').hidden = !m; if (m) { $('j-number-l').textContent = PAY[m][1]; $('j-number').placeholder = m === 'bank' ? 'PK00 XXXX 0000 0000 0000 0000' : '0300 1234567'; } };
    form.querySelectorAll('.bk-chips').forEach(box => box.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      box.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b));
      if (box.id === 'j-method') paintPay();
    }));
    paintPay();

    const hint = $('j-hint'), hintText = hint.textContent;
    function mark(name, msg) {
      const el = form.elements[name], f = el && el.closest('.field, .cr-agree');
      if (!f) { hint.classList.toggle('is-err', !!msg); hint.textContent = msg || hintText; return; }
      f.classList.toggle('is-bad', !!msg);
      el.setAttribute('aria-invalid', !!msg);
      let m = f.querySelector('.field__err');
      if (msg && !m) { m = document.createElement('span'); m.className = 'field__err'; m.id = (el.id || name) + '-err'; f.append(m); el.setAttribute('aria-describedby', m.id); }
      if (m) { m.textContent = msg || ''; m.hidden = !msg; }
    }
    const RULES = {
      name: v => v.trim().length >= 2 || 'Enter your full name.',
      phone: v => !!phoneNorm(v) || 'Enter a Pakistani WhatsApp number, e.g. 0300 1234567.',
      email: v => !v.trim() || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()) || 'Enter a valid email address.',
      handle: v => v.trim().length >= 3 || 'Add a link to your channel or profile.',
      code: v => !v.trim() || !!R.norm(v) || 'Use 3–12 letters or numbers, e.g. SARA or ALI22.',
    };
    form.addEventListener('input', e => { if (e.target.closest('.is-bad')) mark(e.target.name, ''); if (hint.classList.contains('is-err')) { hint.classList.remove('is-err'); hint.textContent = hintText; } });

    // Code: suggested from the first name, checked for availability as you type (debounced)
    const codeIn = $('j-code'), codeHint = $('j-code-hint'), codeHintText = codeHint.textContent;
    let codeT = 0, codeSeq = 0;
    form.elements.name.addEventListener('input', () => { const first = (form.elements.name.value.trim().split(/\s+/)[0] || '').replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 9); codeIn.placeholder = first.length >= 3 ? 'e.g. ' + first : 'e.g. SARA'; });
    codeIn.addEventListener('input', () => {
      codeIn.value = codeIn.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 12);
      clearTimeout(codeT); codeHint.textContent = codeHintText; codeHint.className = '';
      const c = R.norm(codeIn.value); if (!c) return;
      const seq = ++codeSeq;
      codeT = setTimeout(() => R.api('avail', { code: c }).then(d => {
        if (seq !== codeSeq) return;
        codeHint.className = d.available ? 'is-ok' : 'is-err';
        codeHint.innerHTML = d.available ? `${esc(c)} is free.` : `${esc(c)} is taken.${d.suggestion ? ` <button type="button" class="cr-suggest" data-code="${esc(d.suggestion)}">Use ${esc(d.suggestion)}</button>` : ''}`;
      }).catch(() => {}), 450);
    });
    codeHint.addEventListener('click', e => { const b = e.target.closest('[data-code]'); if (b) { codeIn.value = b.dataset.code; codeIn.dispatchEvent(new Event('input')); codeIn.focus(); } });

    let busy = false;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (busy) return;
      let first = null;
      Object.entries(RULES).forEach(([k, r]) => { const ok = r(form.elements[k].value); mark(k, ok === true ? '' : ok); if (ok !== true && !first) first = form.elements[k]; });
      if (!$('j-agree').checked) { mark('agree', 'Please accept the program terms.'); first = first || $('j-agree'); } else mark('agree', '');
      if (first) { first.focus(); return; }
      const v = n => form.elements[n].value.trim();
      const body = {
        name: v('name'), phone: phoneNorm(v('phone')), email: v('email'), handle: v('handle'), note: v('note'), code: R.norm(v('code')) || '',
        platform: picked('j-platform'), audience: picked('j-audience'), method: picked('j-method'), title: v('title'), number: v('number'),
        agree: true, website: form.elements.website.value,
      };
      busy = true; $('j-go').disabled = true; $('j-go').textContent = 'Creating your code…';
      try {
        const d = await R.api('join', body);
        R.setMe({ code: d.creator.code, key: d.key, name: d.creator.name.split(' ')[0] });
        if ((R.get() || {}).code === d.creator.code) R.clear(); // never shop with your own code
        WU.px('Lead', { content_name: 'Creator sign-up' });
        welcome(d.creator, d.key);
      } catch (err) {
        if (err.field && form.elements[err.field]) { mark(err.field, err.message); form.elements[err.field].focus(); }
        else if (!err.status || err.status >= 500 || err.status === 404 || err.status === 405) {
          // The program's database is not connected (or the connection failed): never a dead end — apply on WhatsApp
          hint.classList.add('is-err');
          hint.innerHTML = `${esc(err.message)} <a href="${waLink(`Creator application\nName: ${body.name}\nWhatsApp: ${body.phone}\nChannel: ${body.handle} (${body.platform}, ${body.audience})${body.code ? `\nCode I'd like: ${body.code}` : ''}`)}" target="_blank" rel="noopener">Apply on WhatsApp ›</a>`;
        } else mark('', err.message);
      } finally {
        busy = false; $('j-go').disabled = false; $('j-go').textContent = 'Get my creator code';
      }
    });
  }

  function welcome(c, key) {
    const link = linkFor(c.code);
    const live = c.status === 'active';
    const done = $('cr-done');
    done.innerHTML = `
      <span class="cr-done__badge">${live ? 'Your code is live' : 'Application received'}</span>
      <h2>Welcome, <b>${esc(c.name.split(' ')[0])}.</b></h2>
      <p>${live ? `Share your link or code — your followers get ${CR.discountPct}% off and you earn from your first order.` : 'We’ll check your channel and switch your code on within two working days. Your dashboard is ready now.'}</p>
      <div class="cr-done__code"><span>Your code</span><b>${esc(c.code)}</b></div>
      <div class="crd-copyrow"><input class="crd-copyrow__in" id="cr-done-link" readonly value="${esc(pretty(link))}" aria-label="Your creator link"><button type="button" class="btn-outline" data-copy-text="${esc(link)}">Copy link</button></div>
      <div class="cr-done__key">
        <span>Private key — your dashboard password</span>
        <div class="crd-copyrow"><input class="crd-copyrow__in crd-copyrow__in--key" id="cr-done-key" readonly value="${esc(key)}" aria-label="Your private key"><button type="button" class="btn-outline" data-copy-text="${esc(key)}">Copy key</button></div>
        <small>Save it somewhere safe — we only show it once. This device stays signed in.</small>
      </div>
      <div class="cr-done__acts"><a class="btn-buy" href="creator-dashboard.html">Open my dashboard</a><a class="btn-outline" href="https://wa.me/?text=${encodeURIComponent(`Shop WisdomUp with my code ${c.code} for ${CR.discountPct}% off — Cash on Delivery across Pakistan: ${link}`)}" target="_blank" rel="noopener">Share on WhatsApp</a></div>`;
    $('cr-fill').hidden = true; done.hidden = false;
    done.addEventListener('click', e => { const b = e.target.closest('[data-copy-text]'); if (b) copy(b.dataset.copyText); });
    WU.scrollToEl($('join'), 0);
    done.focus({ preventScroll: true });
  }

  /* ============================== creator-dashboard.html ============================== */
  function dashboard() {
    let me = R.me(), data = null, busy = false;
    $('crd-lost').href = waLink('Hello WisdomUp, I need a new key for my creator dashboard. My creator code is: ');
    const STATE = { pending: 'In progress', approved: 'Approved', void: 'Cancelled' };
    const fmtDay = iso => new Date(iso).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });

    function showLogin(msg) {
      $('crd-main').hidden = true; $('crd-login').hidden = false;
      if (me) $('crd-code').value = me.code;
      $('crd-err').hidden = !msg; $('crd-err').textContent = msg || '';
    }
    async function load(code, key, quiet) {
      if (busy) return; busy = true;
      $('crd-go').disabled = true;
      try {
        const d = await R.api('me', { code, key });
        data = d.creator; me = { code: data.code, key, name: data.name.split(' ')[0] }; R.setMe(me);
        $('crd-login').hidden = true; $('crd-main').hidden = false;
        paint();
        if (!quiet) toast('Dashboard updated', R.TAG);
      } catch (err) {
        if (err.status === 403) { R.setMe(null); me = null; showLogin(err.message); }
        else showLogin(err.message || 'We could not reach the creator system. Check your connection and try again.');
      } finally { busy = false; $('crd-go').disabled = false; }
    }
    $('crd-login').addEventListener('submit', e => {
      e.preventDefault();
      const code = R.norm($('crd-code').value), key = $('crd-key').value.trim();
      if (!code || !key) { showLogin('Enter your creator code and private key.'); return; }
      load(code, key, true);
    });
    $('crd-out').addEventListener('click', () => { R.setMe(null); me = null; data = null; $('crd-key').value = ''; showLogin(''); toast('Signed out of the creator dashboard', R.TAG); });
    $('crd-refresh').addEventListener('click', () => me && load(me.code, me.key));
    if (me && me.code && me.key) load(me.code, me.key, true); else showLogin('');

    function paint() {
      const s = data.stats, m = s.month, link = linkFor(data.code);
      document.title = `${data.code} · Creator Dashboard | WisdomUp`;
      $('crd-hi').textContent = `Hi, ${data.name.split(' ')[0]}`;
      const stLabel = { active: 'Active', paused: 'Paused', pending: 'Under review' }[data.status] || data.status;
      $('crd-tags').innerHTML = `<span class="crd-tag crd-tag--code">${R.TAG}${esc(data.code)}</span><span class="crd-tag crd-tag--${esc(data.status)}">${esc(stLabel)}</span><span class="crd-tag">${data.rate ? `Custom rate · ${data.rate}%` : `${esc(m.tier.name)} · ${m.tier.pct}%`}</span>`;
      $('crd-status').hidden = data.status === 'active';
      $('crd-status').innerHTML = data.status === 'pending' ? '<b>Your code is under review.</b> We’ll switch it on within two working days — you can set up your links now.'
        : data.status === 'paused' ? `<b>Your code is paused</b>, so it gives no discount right now. <a href="${waLink(`Hello WisdomUp, my creator code ${data.code} is paused — can you help?`)}" target="_blank" rel="noopener">Message us on WhatsApp</a>.` : '';
      $('crd-link').value = pretty(link); $('crd-link').dataset.href = link;
      $('crd-code-line').innerHTML = `Followers can also type <b>${esc(data.code)}</b> at checkout. Your link counts for ${CR.linkDays} days after each click.`;

      // Numbers
      const tile = (label, value, sub, cls = '') => `<div class="crd-stat${cls}"><span>${esc(label)}</span><b>${esc(value)}</b>${sub ? `<small>${sub}</small>` : ''}</div>`;
      const conv = s.clicks30 ? Math.round((s.series.reduce((n, d) => n + d.orders, 0) / s.clicks30) * 1000) / 10 : 0;
      $('crd-stats').innerHTML = [
        tile('Link visits · 30 days', s.clicks30.toLocaleString('en-PK'), `${s.clicks.toLocaleString('en-PK')} all time`),
        tile('Orders', s.orders.toLocaleString('en-PK'), s.clicks30 ? `${conv}% of visits ordered` : 'Not cancelled'),
        tile('Sales', rs(s.sales), 'Items after the follower discount'),
        tile('Ready to pay', rs(s.balance), s.balance >= CR.minPayout ? 'Paid in the next monthly payout' : `Payouts from ${esc(rs(CR.minPayout))}`, ' crd-stat--hero'),
        tile('Pending', rs(s.pending), `Approved ${CR.returnDays} days after delivery`),
        tile('Paid out', rs(s.paid), (data.payouts || []).length ? `${data.payouts.length} payout${data.payouts.length > 1 ? 's' : ''}` : 'Nothing yet'),
      ].join('');

      // This month and the next tier
      const monthName = new Date(m.key + '-01T00:00:00').toLocaleDateString('en-PK', { month: 'long' });
      const pctTo = m.next ? Math.min(100, Math.round(m.sales / m.next.from * 100)) : 100;
      $('crd-month').innerHTML = `
        <div class="crd-card__head"><h2 id="crd-month-h">${esc(monthName)} so far</h2><span class="crd-fine">${data.rate ? `Your custom rate of ${data.rate}% applies to every order.` : `Rate this month: <b>${m.tier.pct}%</b> on every order`}</span></div>
        <div class="crd-month__row"><b>${esc(rs(m.sales))}</b><span>${m.next && !data.rate ? `${esc(rs(m.next.from - m.sales))} more to reach <b>${esc(m.next.name)} · ${m.next.pct}%</b>` : data.rate ? 'Custom rate' : `Top tier reached — ${m.tier.pct}% on every order`}</span></div>
        ${data.rate ? '' : `<div class="crd-bar" role="progressbar" aria-label="Progress to the next tier" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pctTo}"><i style="--w: ${pctTo}%;"></i></div>
        <div class="crd-tiers">${tiers.map(t => `<span class="${t.name === m.tier.name ? 'is-on' : ''}">${esc(t.name)} ${t.pct}%<small>${t.from ? 'from ' + esc(rs(t.from)) : 'from Rs.0'}</small></span>`).join('')}</div>`}`;

      chart(s.series);
      paintOrders(s.rows);
      paintPayouts();
      paintCaptions(link);
      paintResults();
      $('crd-top').innerHTML = s.top.length ? `<ol class="crd-toplist">${s.top.map(t => `<li><a href="${url.product(t.id)}">${esc(t.title)}</a><b>${t.qty}</b></li>`).join('')}</ol>` : '<p class="crd-fine">Your best sellers show here after your first order.</p>';
    }

    // Activity: two small multiples on one day axis — link visits and orders, each with its own scale (never a dual axis)
    function chart(series) {
      const vMax = Math.max(1, ...series.map(d => d.clicks)), oMax = Math.max(1, ...series.map(d => d.orders));
      const tv = series.reduce((n, d) => n + d.clicks, 0), to = series.reduce((n, d) => n + d.orders, 0);
      $('crd-act-sum').textContent = `${tv.toLocaleString('en-PK')} visit${tv === 1 ? '' : 's'} · ${to} order${to === 1 ? '' : 's'}`;
      const row = (key, max, cls, label) => `
        <div class="crd-chart__row ${cls}">
          <div class="crd-chart__lbl"><span>${label}</span><small>max ${max}</small></div>
          <div class="crd-chart__bars">${series.map(d => `<i style="--h: ${d[key] ? Math.max(4, d[key] / max * 100) : 0}%;"></i>`).join('')}</div>
        </div>`;
      $('crd-chart').innerHTML = `
        <div class="crd-chart__plot" role="img" aria-label="Link visits and orders per day for the last 30 days: ${tv} visits and ${to} orders.">
          ${row('clicks', vMax, 'crd-chart__row--v', 'Link visits')}
          ${row('orders', oMax, 'crd-chart__row--o', 'Orders')}
          <div class="crd-chart__x"><span>${esc(fmtDay(series[0].day))}</span><span>${esc(fmtDay(series[15].day))}</span><span>Today</span></div>
          <div class="crd-chart__hit">${series.map((d, i) => `<span data-i="${i}"></span>`).join('')}</div>
          <div class="crd-chart__tip" hidden></div>
        </div>
        <table class="visually-hidden"><caption>Last 30 days</caption><thead><tr><th>Day</th><th>Link visits</th><th>Orders</th></tr></thead><tbody>${series.map(d => `<tr><td>${esc(d.day)}</td><td>${d.clicks}</td><td>${d.orders}</td></tr>`).join('')}</tbody></table>`;
      const plot = $('crd-chart').querySelector('.crd-chart__plot'), tip = plot.querySelector('.crd-chart__tip'), hit = plot.querySelector('.crd-chart__hit');
      const show = i => {
        const d = series[i]; if (!d) return;
        plot.querySelectorAll('.crd-chart__bars').forEach(b => [...b.children].forEach((x, j) => x.classList.toggle('is-on', j === i)));
        tip.innerHTML = `<b>${esc(i === series.length - 1 ? 'Today' : fmtDay(d.day))}</b><span>${d.clicks} visit${d.clicks === 1 ? '' : 's'}</span><span>${d.orders} order${d.orders === 1 ? '' : 's'}</span>`;
        tip.hidden = false;
        const col = hit.children[i].getBoundingClientRect(), box = plot.getBoundingClientRect();
        const x = col.left - box.left + col.width / 2;
        tip.style.left = Math.min(Math.max(x, 64), box.width - 64) + 'px';
      };
      const hide = () => { tip.hidden = true; plot.querySelectorAll('.crd-chart__bars i.is-on').forEach(x => x.classList.remove('is-on')); };
      hit.addEventListener('pointermove', e => { const s2 = e.target.closest('[data-i]'); if (s2) show(+s2.dataset.i); });
      hit.addEventListener('pointerleave', hide);
    }

    function paintOrders(rows) {
      if (!rows.length) {
        $('crd-orders').innerHTML = `<div class="crd-empty"><b>No orders yet.</b><p>Share your link — every order from it shows up here with its commission.</p></div>`;
        return;
      }
      const label = r => r.state === 'approved' ? 'Approved' : r.state === 'void' ? 'Cancelled' : r.until ? `Return window · until ${fmtDay(r.until)}` : `In progress · ${r.status[0].toUpperCase() + r.status.slice(1)}`;
      $('crd-orders').innerHTML = `<table><thead><tr><th scope="col">Date</th><th scope="col">Products</th><th scope="col" class="num">Order value</th><th scope="col" class="num">Rate</th><th scope="col" class="num">Commission</th><th scope="col">Status</th></tr></thead><tbody>${rows.map(r => `
        <tr class="is-${r.state}"><td data-l="Date">${esc(fmtDay(r.at))}</td><td data-l="Products">${r.items.map(i => `${i.qty > 1 ? i.qty + ' × ' : ''}${esc(i.title)}`).join('<br>')}</td><td data-l="Order value" class="num">${esc(rs(r.value))}</td><td data-l="Rate" class="num">${r.rate}%</td><td data-l="Commission" class="num"><b>${r.state === 'void' ? '—' : esc(rs(r.commission))}</b></td><td data-l="Status"><span class="crd-pill crd-pill--${r.state}">${esc(label(r))}</span></td></tr>`).join('')}</tbody></table>`;
    }

    function paintPayouts() {
      const p = data.payout || {}, list = data.payouts || [];
      $('crd-method').innerHTML = CR.payouts.map(k => `<button type="button" class="chip" data-v="${k}" aria-pressed="${k === p.method}">${esc(PAY[k][0])}</button>`).join('');
      $('crd-ptitle').value = p.title || ''; $('crd-pnum').value = p.number || '';
      $('crd-pnum-l').textContent = p.method ? PAY[p.method][1] : 'Account number';
      $('crd-payouts').innerHTML = list.length ? `<ul class="crd-paylist">${list.slice().reverse().map(x => `<li><b>${esc(rs(x.amount))}</b><span>${esc(fmtDay(x.at))}${x.method ? ' · ' + esc((PAY[x.method] || [x.method])[0]) : ''}${x.note ? ' · ' + esc(x.note) : ''}</span></li>`).join('')}</ul>`
        : `<p class="crd-fine">No payouts yet. We pay monthly once your approved balance reaches ${esc(rs(CR.minPayout))}${p.method ? '' : ' — add your payout details first'}.</p>`;
    }
    $('crd-method').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $('crd-method').querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b)); $('crd-pnum-l').textContent = PAY[b.dataset.v][1]; });
    $('crd-payform').addEventListener('submit', async e => {
      e.preventDefault();
      const b = $('crd-method').querySelector('[aria-pressed="true"]'), err = $('crd-pay-err');
      err.hidden = true;
      try {
        const d = await R.api('payout', { code: me.code, key: me.key, method: b ? b.dataset.v : '', title: $('crd-ptitle').value.trim(), number: $('crd-pnum').value.trim() });
        data = d.creator; paintPayouts(); toast('Payout details saved', R.TAG);
      } catch (x) { err.hidden = false; err.textContent = x.field === 'title' ? 'Enter the name on the account.' : x.field === 'number' ? 'Enter the full account number.' : x.message; }
    });

    // Link builder: search the catalogue, copy a product link with the code
    function paintResults() {
      const q = $('crd-q').value.trim().toLowerCase();
      const words = q.split(/\s+/).filter(Boolean);
      // nothing typed: one best seller or new launch per range (variety), else the matches
      const tagged = D.products.filter(p => !p.soldOut && (p.tabs.includes('best') || p.tabs.includes('new')));
      const list = (words.length ? D.products.filter(p => words.every(w => (p.title + ' ' + p.code + ' ' + p.type).toLowerCase().includes(w)))
        : tagged.filter((p, i) => tagged.findIndex(x => x.type === p.type) === i)).filter(p => !p.soldOut).slice(0, 5);
      $('crd-results').innerHTML = list.length ? list.map(p => { const href = linkFor(data.code, url.product(p.id)); return `
        <div class="crd-res">
          <span class="crd-res__img" style="background: ${photoBg(p)};"><img src="${p.thumb}" alt="" loading="lazy" style="${photoFit(p)}"></span>
          <span class="crd-res__t"><b>${esc(p.title)}</b><small>${esc(p.priceText)} · you earn ~${esc(rs(R.pctOf(p.price - R.pctOf(p.price, CR.discountPct), data.rate || data.stats.month.rate)))}</small></span>
          <button type="button" class="btn-outline crd-res__go" data-copy-href="${esc(href)}" aria-label="Copy link to ${esc(p.title)}">Copy link</button>
        </div>`; }).join('') : '<p class="crd-fine">No products match.</p>';
    }
    $('crd-q').addEventListener('input', paintResults);

    function paintCaptions(link) {
      const d = CR.discountPct, c = data.code;
      const caps = [
        `Use my code ${c} for ${d}% off at WisdomUp — Cash on Delivery anywhere in Pakistan. ${link}`,
        `I’ve been testing WisdomUp gear. Get ${d}% off with my link (7-day money-back, Cash on Delivery): ${link}`,
        `Going live tonight with WisdomUp — order from my link for ${d}% off: ${link} #ad`,
      ];
      $('crd-caps').innerHTML = caps.map(t => `<div class="crd-cap"><p>${esc(t)}</p><button type="button" class="btn-outline" data-copy-text="${esc(t)}">Copy</button></div>`).join('');
    }

    $('crd-main').addEventListener('click', e => {
      const c = e.target.closest('[data-copy]'); if (c) { copy($(c.dataset.copy).dataset.href); return; }
      const sh = e.target.closest('[data-share]'); if (sh) { share(`Shop WisdomUp with my code ${data.code} for ${CR.discountPct}% off`, $(sh.dataset.share).dataset.href); return; }
      const t = e.target.closest('[data-copy-text]'); if (t) { copy(t.dataset.copyText); return; }
      const h = e.target.closest('[data-copy-href]'); if (h) copy(h.dataset.copyHref);
    });
  }
})();
