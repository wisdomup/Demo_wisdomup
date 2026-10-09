// WisdomUp — Checkout (checkout.html) and order confirmation (order.html).
// Orders are placed with POST /api/orders (api/orders.py), which recomputes every price from the catalogue.
(function () {
  const { D, $, esc, url, SHOP, cart, store, photoBg, photoFit } = WU;
  WU.initChrome();
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon, +(el.dataset.size || 24)); });
  document.addEventListener('click', e => { if (e.target.closest('[data-open-cart]')) cart.open(e.target.closest('[data-open-cart]')); });
  const rs = D.rs;
  const ORDERS = 'wu-orders', CONTACT = 'wu-ck-contact';
  // Same rule as the server: Pakistani mobile → 03XXXXXXXXX
  const phoneNorm = s => {
    let d = String(s || '').replace(/\D/g, '');
    if (d.startsWith('0092')) d = d.slice(4); else if (d.startsWith('92')) d = d.slice(2);
    if (d.startsWith('0')) d = d.slice(1);
    return /^3\d{9}$/.test(d) ? '0' + d : null;
  };
  const prettyPhone = p => p ? p.slice(0, 4) + ' ' + p.slice(4) : '';
  const attrText = attrs => Object.values(attrs || {}).join(' · ');
  const waLink = text => `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`;

  if ($('ck-form')) checkout();
  if ($('ord')) confirmation();

  /* ====================== Checkout ====================== */
  function checkout() {
    const form = $('ck-form');
    let delivery = 'standard', payment = 'cod', busy = false;
    // Pixel: someone with a cart reached checkout
    if (cart.count()) WU.px('InitiateCheckout', { content_ids: cart.lines().map(l => l.sku), contents: cart.lines().map(l => ({ id: l.sku, quantity: l.qty, item_price: l.price })), content_type: 'product', num_items: cart.count(), value: cart.totals().subtotal, currency: 'PKR' });

    const deliveryFee = key => { const t = cart.totals(key); return t.delivery; };
    function paintOptions() {
      $('ck-delivery').innerHTML = Object.entries(SHOP.delivery).map(([k, o]) => {
        const fee = deliveryFee(k);
        return `<label class="ckopt"><input type="radio" name="delivery" value="${k}"${k === delivery ? ' checked' : ''}><span class="ckopt__dot" aria-hidden="true"></span>
          <span class="ckopt__t"><b>${esc(o.label)}</b><small>${esc(o.eta)}${o.freeOver ? ` · free over ${esc(rs(SHOP.freeDeliveryFrom))}` : ''}</small></span>
          <b class="ckopt__p">${fee ? esc(rs(fee)) : 'Free'}</b></label>`;
      }).join('');
      $('ck-payment').innerHTML = Object.entries(SHOP.payments).map(([k, o]) => `
        <label class="ckopt"><input type="radio" name="payment" value="${k}"${k === payment ? ' checked' : ''}><span class="ckopt__dot" aria-hidden="true"></span>
          <span class="ckopt__t"><b>${esc(o.label)}</b><small>${esc(o.note)}</small></span></label>`).join('');
    }
    function paintSummary() {
      const lines = cart.lines();
      $('ck').hidden = !lines.length;
      $('ck-empty').hidden = !!lines.length;
      if (!lines.length) return;
      const t = cart.totals(delivery);
      $('ck-lines').innerHTML = lines.map(l => `
        <div class="ckline">
          <span class="ckline__img" style="background: ${photoBg(l.v.bg ? l.v : l.p)};"><img src="${l.v.thumb || l.p.thumb}" alt="" style="${photoFit(l.v.ar ? l.v : l.p)}"><b>${l.qty}</b></span>
          <span class="ckline__t">${esc(l.p.title)}${attrText(l.attrs) ? `<small>${esc(attrText(l.attrs))}</small>` : ''}</span>
          <span class="ckline__p">${esc(rs(l.total))}</span>
        </div>`).join('');
      $('ck-gift').checked = cart.gift();
      $('ck-gift-p').textContent = rs(SHOP.giftWrap);
      paintRef();
      $('ck-tot').innerHTML = `
        <div><dt>Subtotal</dt><dd>${esc(rs(t.subtotal))}</dd></div>
        ${t.discount ? `<div class="ck__disc"><dt>Creator code ${esc(t.ref)} · ${WU.ref.get().pct}% off</dt><dd>−${esc(rs(t.discount))}</dd></div>` : ''}
        <div><dt>Delivery</dt><dd>${t.delivery ? esc(rs(t.delivery)) : 'Free'}</dd></div>
        ${t.giftWrap ? `<div><dt>Gift wrapping</dt><dd>${esc(rs(t.giftWrap))}</dd></div>` : ''}
        <div class="ck__total"><dt>Total</dt><dd>${esc(rs(t.total))}</dd></div>`;
      const label = busy ? 'Placing order…' : `Place order · ${rs(t.total)}`;
      $('ck-place').textContent = label;
      $('ck-place-form').textContent = label;
      const n = cart.count();
      $('ck-sumcount').textContent = `· ${n} item${n === 1 ? '' : 's'}`;
      $('ck-sumtotal').textContent = rs(t.total);
      paintOptions();
    }
    // Narrow screens (the summary sits above the form): the summary is folded to one line — items and the total — until tapped
    const sumToggle = $('ck-sumtoggle'), sumBody = $('ck-sumbody');
    const narrow = matchMedia('(max-width: 1023px)');
    const foldSummary = () => { if (narrow.matches) { sumBody.hidden = sumToggle.getAttribute('aria-expanded') !== 'true'; } else { sumBody.hidden = false; } };
    sumToggle.addEventListener('click', () => { const open = sumToggle.getAttribute('aria-expanded') !== 'true'; sumToggle.setAttribute('aria-expanded', open); WU.slide(sumBody, open); });
    narrow.addEventListener('change', foldSummary);
    foldSummary();
    /* ---------- Creator code (the creators program): the code from a creator's link, or one typed here. Checked with the
       server before it shows a discount; the order server checks it again. ---------- */
    let refOpen = false, refErr = '', refBusy = false;
    function paintRef() {
      const box = $('ck-ref'), r = WU.ref.get();
      if (!box || !(SHOP.creators || {}).on) return;
      if (r) {
        box.innerHTML = `<div class="ck__refon"><span class="ck__refcode">${WU.ref.TAG}<b>${esc(r.code)}</b></span><span class="ck__reft">${r.pct ? `${esc(r.name || 'Creator')}’s code · <b>${r.pct}% off</b> your items` : 'Creator code · checking…'}</span><button type="button" class="ck__refx" data-ref-x>Remove</button></div>${refErr ? `<p class="ck__referr" role="alert">${esc(refErr)}</p>` : ''}`;
        return;
      }
      box.innerHTML = refOpen
        ? `<div class="ck__refform"><label class="visually-hidden" for="ck-ref-in">Creator code</label><input id="ck-ref-in" class="ck__refin" placeholder="Creator code, e.g. SARA" autocomplete="off" autocapitalize="characters" maxlength="16" enterkeyhint="done"><button type="button" class="btn-outline ck__refgo" data-ref-go${refBusy ? ' disabled' : ''}>${refBusy ? 'Checking…' : 'Apply'}</button></div>${refErr ? `<p class="ck__referr" role="alert">${esc(refErr)}</p>` : ''}`
        : `<button type="button" class="ck__refopen" data-ref-open>${WU.ref.TAG}<span>Have a creator code?</span></button>`;
    }
    async function useCode(raw) {
      refBusy = true; refErr = ''; paintRef();
      try { await WU.ref.apply(raw); refOpen = false; }
      catch (err) { refErr = err.status === 404 ? 'That creator code is not active.' : err.message; }
      finally { refBusy = false; paintSummary(); const i = $('ck-ref-in'); if (i && refErr) { i.value = String(raw || ''); i.focus(); } }
    }
    $('ck-ref').addEventListener('click', e => {
      if (e.target.closest('[data-ref-open]')) { refOpen = true; refErr = ''; paintRef(); $('ck-ref-in').focus(); }
      if (e.target.closest('[data-ref-go]')) useCode($('ck-ref-in').value);
      if (e.target.closest('[data-ref-x]')) { refErr = ''; refOpen = false; WU.ref.clear(); }
    });
    $('ck-ref').addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'ck-ref-in') { e.preventDefault(); useCode(e.target.value); } });
    // A kept code is checked again on arrival (it may have been paused, or saved while the server could not be reached)
    const kept = WU.ref.get();
    if (kept) WU.ref.apply(kept.code, { quiet: true }).catch(err => {
      if (err.status === 404 || err.own) { WU.ref.clear(); refErr = err.own ? err.message : `The creator code ${kept.code} is no longer active, so it was removed.`; refOpen = true; paintSummary(); }
    });

    form.addEventListener('change', e => {
      if (e.target.name === 'delivery') delivery = e.target.value;
      if (e.target.name === 'payment') payment = e.target.value;
      if (e.target.name === 'delivery' || e.target.name === 'payment') paintSummary();
    });
    $('ck-gift').addEventListener('change', e => cart.setGift(e.target.checked));
    window.addEventListener('wu-cart', paintSummary);

    // Returning customers: contact and address are remembered on this device only
    const saved = store.get(CONTACT, null);
    if (saved) ['name', 'phone', 'email', 'city', 'area', 'line'].forEach(k => { if (saved[k] && form.elements[k]) form.elements[k].value = saved[k]; });
    // the order note written in the cart drawer (wu-cart-note) fills the delivery notes, unless something is already typed
    const cartNote = store.get('wu-cart-note', '');
    if (cartNote && form.elements.notes && !form.elements.notes.value) form.elements.notes.value = cartNote;

    /* ---------- Validation (mirrors the server) ---------- */
    const RULES = {
      name: v => v.trim().length >= 2 || 'Enter your full name.',
      phone: v => !!phoneNorm(v) || 'Enter a Pakistani mobile number, e.g. 0300 1234567.',
      email: v => !v.trim() || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()) || 'Enter a valid email address.',
      city: v => v.trim().length >= 2 || 'Enter your city.',
      area: v => v.trim().length >= 2 || 'Enter your area or locality.',
      line: v => v.trim().length >= 5 || 'Enter your house / street address.',
    };
    function mark(name, msg) {
      const el = form.elements[name];
      const f = el && el.closest && el.closest('.field');
      if (!f) { if (msg) showError(msg); return; }
      f.classList.toggle('is-bad', !!msg);
      el.setAttribute('aria-invalid', !!msg);
      let m = f.querySelector('.field__err');
      if (msg && !m) { m = document.createElement('span'); m.className = 'field__err'; m.id = el.id + '-err'; f.append(m); el.setAttribute('aria-describedby', m.id); }
      if (m) { m.textContent = msg || ''; m.hidden = !msg; }
    }
    form.addEventListener('blur', e => {
      const r = RULES[e.target.name];
      if (r && e.target.value) { const ok = r(e.target.value); mark(e.target.name, ok === true ? '' : ok); }
      if (e.target.name === 'phone' && phoneNorm(e.target.value)) e.target.value = prettyPhone(phoneNorm(e.target.value));
    }, true);
    form.addEventListener('input', e => { if (e.target.closest('.field.is-bad')) { const ok = RULES[e.target.name] && RULES[e.target.name](e.target.value); if (ok === true) mark(e.target.name, ''); } });

    function showError(msg, withWhatsApp) {
      const box = $('ck-err');
      box.hidden = false;
      box.innerHTML = `<b>${esc(msg)}</b>${withWhatsApp ? `<a class="btn-navy" href="${waLink(orderText())}" target="_blank" rel="noopener">Order on WhatsApp instead</a>` : ''}`;
      WU.scrollToEl(box);
    }
    function orderText() {
      const t = cart.totals(delivery), v = n => (form.elements[n].value || '').trim();
      return [`New order from wisdomup website`, ...cart.lines().map(l => `• ${l.qty} × ${l.v.sku} ${l.p.title}${attrText(l.attrs) ? ' (' + attrText(l.attrs) + ')' : ''} — ${rs(l.total)}`),
        `Delivery: ${SHOP.delivery[delivery].label} · Payment: ${SHOP.payments[payment].label}${cart.gift() ? ' · Gift wrap' : ''}`,
        ...(WU.ref.get() ? [`Creator code: ${WU.ref.get().code}${t.discount ? ` (−${rs(t.discount)})` : ' (please check)'}`] : []), `Total: ${rs(t.total)}`,
        `Name: ${v('name')} · Phone: ${v('phone')}`, `Address: ${[v('line'), v('area'), v('city')].filter(Boolean).join(', ')}`].join('\n');
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (busy) return;
      $('ck-err').hidden = true;
      let first = null;
      Object.entries(RULES).forEach(([k, r]) => { const ok = r(form.elements[k].value); mark(k, ok === true ? '' : ok); if (ok !== true && !first) first = form.elements[k]; });
      if (first) { first.focus(); return; }
      const v = n => form.elements[n].value.trim();
      const body = {
        customer: { name: v('name'), phone: phoneNorm(v('phone')), email: v('email') },
        address: { city: v('city'), area: v('area'), line: v('line'), notes: v('notes') },
        delivery, payment, giftWrap: cart.gift(), website: form.elements.website.value,
        items: cart.lines().map(l => ({ sku: l.sku, qty: l.qty })),
        ref: WU.ref.get() ? WU.ref.get().code : undefined,
      };
      busy = true; paintSummary();
      document.querySelectorAll('.ck__place').forEach(b => { b.disabled = true; });
      try {
        const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const data = await res.json().catch(() => ({ ok: false }));
        if (!res.ok || !data.ok) {
          if (data.field === 'ref') { refErr = data.error; paintRef(); WU.scrollToEl($('ck-ref')); }
          else if (data.field) { mark(data.field, data.error); const el = form.elements[data.field]; if (el && el.focus) el.focus(); }
          else showError(data.error || 'We could not place your order online right now.', res.status >= 500 || res.status === 404 || res.status === 405 || !data.error);
          return;
        }
        // Keep a copy on this device (with the address) for the confirmation page and "verified buyer" reviews
        store.set(ORDERS, [{ ...data.order, customer: body.customer, address: body.address }].concat(store.get(ORDERS, [])).slice(0, 20));
        store.set(CONTACT, { ...body.customer, ...body.address, notes: '' });
        store.set('wu-cart-note', ''); // the note went with this order
        cart.clear();
        location.href = 'order.html?n=' + encodeURIComponent(data.order.number);
      } catch (err) {
        showError('We could not reach our order system. Check your connection, or order on WhatsApp.', true);
      } finally {
        busy = false;
        document.querySelectorAll('.ck__place').forEach(b => { b.disabled = false; });
        if (cart.count()) paintSummary();
      }
    });
    paintSummary();
  }

  /* ====================== Confirmation ====================== */
  function confirmation() {
    const n = new URLSearchParams(location.search).get('n') || '';
    const o = (store.get(ORDERS, []) || []).find(x => x.number === n);
    if (!o) {
      $('ord').innerHTML = `<div class="empty"><h1 class="grad-h">Order ${esc(n || '')}</h1><p>We couldn't find this order on this device. Track it with your order number and phone.</p><a class="btn-pill" href="track.html${n ? '?n=' + encodeURIComponent(n) : ''}">Track your order</a></div>`;
      return;
    }
    document.title = `Order ${o.number} confirmed | WisdomUp`;
    // Pixel: a purchase, sent once per order (a refresh of this page must not count it twice). No customer details are sent.
    const sent = store.get('wu-px-orders', []);
    if (!sent.includes(o.number)) {
      WU.px('Purchase', { content_ids: o.items.map(l => l.sku), contents: o.items.map(l => ({ id: l.sku, quantity: l.qty, item_price: l.price })), content_type: 'product', num_items: o.items.reduce((n, l) => n + l.qty, 0), value: o.totals.total, currency: 'PKR' }, { eventID: o.number });
      store.set('wu-px-orders', sent.concat(o.number).slice(-30));
    }
    const pay = SHOP.payments[o.payment] || { label: o.payment };
    const transfer = o.payment !== 'cod';
    const account = pay.accountNumber ? `<div class="kv"><b>Account title</b><span>${esc(pay.accountTitle)}</span><b>${o.payment === 'bank' ? 'IBAN' : 'Account number'}</b><span>${esc(pay.accountNumber || pay.iban)}</span>${pay.bank ? `<b>Bank</b><span>${esc(pay.bank)}</span>` : ''}<b>Amount</b><span>${esc(rs(o.totals.total))}</span><b>Reference</b><span>${esc(o.number)}</span></div>`
      : o.payment === 'bank' && pay.iban ? `<div class="kv"><b>Bank</b><span>${esc(pay.bank)}</span><b>Account title</b><span>${esc(pay.accountTitle)}</span><b>IBAN</b><span>${esc(pay.iban)}</span><b>Amount</b><span>${esc(rs(o.totals.total))}</span><b>Reference</b><span>${esc(o.number)}</span></div>`
      : `<p>We'll send our ${esc(pay.label)} details on WhatsApp when we confirm your order. Use <b>${esc(o.number)}</b> as the payment reference.</p>`;
    const eta = (SHOP.delivery[o.delivery] || {}).eta || '';
    $('ord').innerHTML = `
      <section class="ord__hero">
        <span class="ord__tick" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <div><div class="eyebrow">Order placed</div><h1>Thank you, ${esc(o.customer.name.split(' ')[0])}!</h1>
        <p>Your order <b>${esc(o.number)}</b> is in. We'll call or WhatsApp <b>${esc(prettyPhone(o.customer.phone))}</b> to confirm it, then dispatch within 24 hours.</p></div>
      </section>
      <div class="ord__grid">
        <div class="ord__col">
          <section class="ord__card"><h2>What happens next</h2>
            <ol class="ord__steps"><li><b>We confirm</b><span>A quick call or WhatsApp to check your order and address.</span></li>
            ${transfer ? `<li><b>You pay by ${esc(pay.label)}</b><span>Send the total and share your receipt on WhatsApp.</span></li>` : ''}
            <li><b>We dispatch</b><span>Packed and handed to the courier within 24 hours.</span></li>
            <li><b>Delivered</b><span>${esc(eta)}${o.payment === 'cod' ? ` — pay ${esc(rs(o.totals.total))} in cash to the rider.` : '.'}</span></li></ol>
          </section>
          <section class="ord__card"><h2>Payment · ${esc(pay.label)}</h2>
            ${transfer ? account + `<a class="btn-navy" href="${waLink(`Payment receipt for order ${o.number} (${rs(o.totals.total)})`)}" target="_blank" rel="noopener">Send receipt on WhatsApp</a>` : `<p>Pay <b>${esc(rs(o.totals.total))}</b> in cash when your order arrives. Please keep the exact amount ready.</p>`}
          </section>
          <section class="ord__card"><h2>Delivery to</h2>
            <p>${esc(o.customer.name)}<br>${esc(o.address.line)}<br>${esc(o.address.area)}, ${esc(o.address.city)}<br>${esc(prettyPhone(o.customer.phone))}</p>
            <p class="ord__muted">${esc((SHOP.delivery[o.delivery] || {}).label || '')} · ${esc(eta)}</p>
          </section>
        </div>
        <section class="ord__card ord__sum"><h2>Order ${esc(o.number)}</h2>
          ${o.items.map(l => { const info = cart.skuInfo(l.sku) || {}; const p = info.p, v = info.v || {}; return `<div class="ckline">${p ? `<span class="ckline__img" style="background: ${photoBg(v.bg ? v : p)};"><img src="${v.thumb || p.thumb}" alt="" style="${photoFit(v.ar ? v : p)}"><b>${l.qty}</b></span>` : ''}<span class="ckline__t">${esc(l.title)}${attrText(l.attrs) ? `<small>${esc(attrText(l.attrs))}</small>` : ''}</span><span class="ckline__p">${esc(rs(l.total))}</span></div>`; }).join('')}
          <dl class="ck__tot"><div><dt>Subtotal</dt><dd>${esc(rs(o.totals.subtotal))}</dd></div>${o.totals.discount ? `<div class="ck__disc"><dt>Creator code ${esc(o.ref || '')}</dt><dd>−${esc(rs(o.totals.discount))}</dd></div>` : ''}<div><dt>Delivery</dt><dd>${o.totals.delivery ? esc(rs(o.totals.delivery)) : 'Free'}</dd></div>${o.totals.giftWrap ? `<div><dt>Gift wrapping</dt><dd>${esc(rs(o.totals.giftWrap))}</dd></div>` : ''}<div class="ck__total"><dt>Total</dt><dd>${esc(rs(o.totals.total))}</dd></div></dl>
          <div class="ord__actions"><a class="btn-buy" href="track.html?n=${encodeURIComponent(o.number)}&p=${encodeURIComponent(o.customer.phone)}">Track this order</a><a class="btn-outline" href="${url.products}">Continue shopping</a><button type="button" class="btn-outline" onclick="window.print()">Print receipt</button></div>
        </section>
      </div>`;
  }
})();
