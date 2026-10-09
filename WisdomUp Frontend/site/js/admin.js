// WisdomUp — order admin (admin.html). Reads and updates orders through /api/orders with the X-Admin-Key header.
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const rs = n => 'Rs.' + Number(n || 0).toLocaleString('en-PK');
  const SHOP = window.WU_SHOP;
  const LABEL = { new: 'New', confirmed: 'Confirmed', paid: 'Paid', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };
  let key = sessionStorage.getItem('wu-admin-key') || '', orders = [], filter = 'all', toastT;
  let creators = [], program = {}, cfilter = 'all', view = ['#creators', '#leads', '#reviews'].includes(location.hash) ? location.hash.slice(1) : 'orders', crError = '';
  let leads = [], leadKinds = {}, lfilter = 'new', lError = '', rvPending = [], rvRecent = [], rError = '';
  const VIEWS = { orders: 'Orders', leads: 'Leads', reviews: 'Reviews', creators: 'Creators' };
  const CLABEL = { active: 'Active', paused: 'Paused', pending: 'Pending' };
  const PAYL = { jazzcash: 'JazzCash', easypaisa: 'EasyPaisa', bank: 'Bank' };
  const day = iso => new Date(iso).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
  const toast = m => { const t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2200); };

  async function api(method, body, query = '') {
    const r = await fetch('/api/orders' + query, { method, headers: { 'Content-Type': 'application/json', 'X-Admin-Key': key }, body: body ? JSON.stringify(body) : undefined });
    const data = await r.json().catch(() => ({ ok: false, error: 'The order system did not respond.' }));
    if (!r.ok || !data.ok) throw new Error(data.error || 'Request failed.');
    return data;
  }
  async function load() {
    try {
      orders = (await api('GET', null, '?admin=1')).orders;
      sessionStorage.setItem('wu-admin-key', key);
      $('adm-login').hidden = true; $('adm-main').hidden = false; $('adm-refresh').hidden = $('adm-out').hidden = false; $('adm-views').hidden = false;
      try { const d = await api('GET', null, '?cr=admin'); creators = d.creators; program = d.program; crError = ''; } catch (e) { creators = []; crError = e.message; }
      try { const d = await api('GET', null, '?lead=admin'); leads = d.leads; leadKinds = d.kinds || {}; lError = ''; } catch (e) { leads = []; lError = e.message; }
      try { const d = await api('GET', null, '?rv=admin'); rvPending = d.pending; rvRecent = d.recent; rError = ''; } catch (e) { rvPending = rvRecent = []; rError = e.message; }
      paint(); paintCreators(); paintLeads(); paintReviews(); showView(view);
    } catch (e) {
      $('adm-err').hidden = false; $('adm-err').textContent = e.message;
      $('adm-login').hidden = false; $('adm-main').hidden = true;
    }
  }
  function paint() {
    const live = orders.filter(o => o.status !== 'cancelled');
    $('adm-stats').innerHTML = [
      ['Orders', orders.length], ['To confirm', orders.filter(o => o.status === 'new').length],
      ['To ship', orders.filter(o => ['confirmed', 'paid'].includes(o.status)).length], ['Revenue (not cancelled)', rs(live.reduce((n, o) => n + o.totals.total, 0))],
    ].map(([t, v]) => `<div class="adm__stat"><span>${esc(t)}</span><b>${esc(v)}</b></div>`).join('');
    $('adm-filter').innerHTML = ['all', ...SHOP.statuses].map(s => `<a href="#" data-f="${s}"${s === filter ? ' aria-current="true"' : ''}>${s === 'all' ? 'All' : LABEL[s]} <small>${s === 'all' ? orders.length : orders.filter(o => o.status === s).length}</small></a>`).join('');
    const q = $('adm-q').value.trim().toLowerCase();
    const list = orders.filter(o => (filter === 'all' || o.status === filter) && (!q || [o.number, o.customer.name, o.customer.phone, o.address.city, o.address.area, (o.ref || {}).code || ''].join(' ').toLowerCase().includes(q)));
    $('adm-list').innerHTML = list.length ? list.map(o => {
      const wa = 'https://wa.me/92' + o.customer.phone.slice(1) + '?text=' + encodeURIComponent(`Assalam o Alaikum ${o.customer.name.split(' ')[0]}, this is WisdomUp about your order ${o.number} (${rs(o.totals.total)}).`);
      return `<article class="adm__order adm__order--${o.status}">
        <header><b>${esc(o.number)}</b><span class="adm__pill adm__pill--${o.status}">${esc(LABEL[o.status] || o.status)}</span><time>${esc(new Date(o.createdAt).toLocaleString('en-PK', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }))}</time></header>
        <div class="adm__cols">
          <div><h3>Customer</h3><p>${esc(o.customer.name)}<br><a href="tel:${esc(o.customer.phone)}">${esc(o.customer.phone)}</a> · <a href="${wa}" target="_blank" rel="noopener">WhatsApp</a>${o.customer.email ? `<br>${esc(o.customer.email)}` : ''}</p>
            <h3>Address</h3><p>${esc(o.address.line)}<br>${esc(o.address.area)}, ${esc(o.address.city)}${o.address.notes ? `<br><i>${esc(o.address.notes)}</i>` : ''}</p></div>
          <div><h3>Items</h3><ul>${o.items.map(l => `<li><b>${l.qty} ×</b> ${esc(l.sku)} — ${esc(l.title)}${Object.keys(l.attrs || {}).length ? ` <small>(${esc(Object.values(l.attrs).join(', '))})</small>` : ''} <span>${esc(rs(l.total))}</span></li>`).join('')}</ul>
            <p class="adm__tot">${esc((SHOP.delivery[o.delivery] || {}).label || o.delivery)} ${o.totals.delivery ? rs(o.totals.delivery) : '(free)'}${o.totals.giftWrap ? ' · Gift wrap ' + rs(o.totals.giftWrap) : ''}${o.ref ? ` · <span class="adm__ref">Creator ${esc(o.ref.code)} −${esc(rs(o.totals.discount))}</span>` : ''} · <b>Total ${esc(rs(o.totals.total))}</b> · ${esc((SHOP.payments[o.payment] || {}).label || o.payment)}</p></div>
          <div><h3>Status</h3><select data-num="${esc(o.number)}" aria-label="Status for ${esc(o.number)}">${SHOP.statuses.map(s => `<option value="${s}"${s === o.status ? ' selected' : ''}>${LABEL[s]}</option>`).join('')}</select>
            <ol class="adm__hist">${(o.history || []).slice().reverse().map(h => `<li>${esc(LABEL[h.status] || h.status)} · ${esc(new Date(h.at).toLocaleString('en-PK', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }))}${h.note ? ` — ${esc(h.note)}` : ''}</li>`).join('')}</ol></div>
        </div>
      </article>`;
    }).join('') : '<p class="adm__none">No orders match.</p>';
  }
  /* ---------- Creators (the creators program, 2026-10-08): numbers per creator, pause / custom rate / payouts / new key ---------- */
  function showView(v) {
    view = v;
    Object.keys(VIEWS).forEach(k => { $('adm-' + k).hidden = v !== k; });
    $('adm-title').textContent = VIEWS[v];
    document.title = VIEWS[v] + ' · WisdomUp Admin';
    $('adm-views').querySelectorAll('[data-view]').forEach(a => a.setAttribute('aria-current', a.dataset.view === v));
    if (location.hash !== '#' + v) history.replaceState(null, '', '#' + v);
  }
  function paintCreators() {
    const sum = k => creators.reduce((n, c) => n + (c.stats[k] || 0), 0);
    $('adm-cstats').innerHTML = [
      ['Creators', `${creators.filter(c => c.status === 'active').length} active / ${creators.length}`], ['Link visits · 30 days', sum('clicks30').toLocaleString('en-PK')],
      ['Orders from creators', sum('orders')], ['Creator sales', rs(sum('sales'))], ['Commission pending', rs(sum('pending'))], ['Owed now (approved − paid)', rs(sum('balance'))],
    ].map(([t, v]) => `<div class="adm__stat"><span>${esc(t)}</span><b>${esc(v)}</b></div>`).join('');
    $('adm-prog').innerHTML = crError ? `<b>${esc(crError)}</b>` : program.tiers ? `Followers get <b>${program.discountPct}%</b> off · commission ${program.tiers.map(t => `<b>${esc(t.name)} ${t.pct}%</b>${t.from ? ' from ' + esc(rs(t.from)) + '/month' : ''}`).join(' · ')} · approved ${program.returnDays} days after delivery · payouts from ${esc(rs(program.minPayout))}${program.demo ? ' · <i>demo numbers in shop.js — confirm before launch</i>' : ''}` : '';
    $('adm-cfilter').innerHTML = ['all', 'active', 'paused', 'pending'].map(s => `<a href="#" data-cf="${s}"${s === cfilter ? ' aria-current="true"' : ''}>${s === 'all' ? 'All' : CLABEL[s]} <small>${s === 'all' ? creators.length : creators.filter(c => c.status === s).length}</small></a>`).join('');
    const q = $('adm-cq').value.trim().toLowerCase();
    const list = creators.filter(c => (cfilter === 'all' || c.status === cfilter) && (!q || [c.code, c.name, c.phone, c.handle, c.email].join(' ').toLowerCase().includes(q)));
    $('adm-clist').innerHTML = list.length ? list.map(c => {
      const s = c.stats, p = c.payout || {};
      const wa = 'https://wa.me/92' + c.phone.slice(1) + '?text=' + encodeURIComponent(`Assalam o Alaikum ${c.name.split(' ')[0]}, this is WisdomUp about your creator code ${c.code}.`);
      const handle = /^https?:\/\//i.test(c.handle) ? c.handle : 'https://' + c.handle;
      return `<article class="adm__order adm__cr adm__cr--${c.status}" data-code="${esc(c.code)}">
        <header><b>${esc(c.code)}</b><span class="adm__pill adm__pill--${c.status === 'active' ? 'delivered' : c.status === 'paused' ? 'cancelled' : 'new'}">${esc(CLABEL[c.status] || c.status)}</span><span class="adm__crname">${esc(c.name)}</span><time>Joined ${esc(day(c.joinedAt))}</time></header>
        <div class="adm__cols">
          <div><h3>Contact</h3><p><a href="tel:${esc(c.phone)}">${esc(c.phone)}</a> · <a href="${wa}" target="_blank" rel="noopener">WhatsApp</a>${c.email ? `<br>${esc(c.email)}` : ''}<br><a href="${esc(handle)}" target="_blank" rel="noopener nofollow">${esc(c.handle)}</a><br>${esc(c.platform)} · ${esc(c.audience)}${c.note ? `<br><i>${esc(c.note)}</i>` : ''}</p>
            <h3>Payout details</h3><p>${p.method ? `${esc(PAYL[p.method] || p.method)} · ${esc(p.title || '—')} · ${esc(p.number || '—')}` : '<i>Not added yet</i>'}</p></div>
          <div><h3>Numbers</h3>
            <dl class="adm__nums"><div><dt>Visits 30d / all</dt><dd>${s.clicks30} / ${s.clicks}</dd></div><div><dt>Orders</dt><dd>${s.orders}</dd></div><div><dt>Sales</dt><dd>${esc(rs(s.sales))}</dd></div><div><dt>This month</dt><dd>${esc(rs(s.month.sales))} · ${c.rate ? 'custom ' + c.rate : esc(s.month.tier.name) + ' ' + s.month.tier.pct}%</dd></div><div><dt>Pending</dt><dd>${esc(rs(s.pending))}</dd></div><div><dt>Approved</dt><dd>${esc(rs(s.approved))}</dd></div><div><dt>Paid</dt><dd>${esc(rs(s.paid))}</dd></div><div class="adm__owed"><dt>Owed now</dt><dd>${esc(rs(s.balance))}</dd></div></dl>
            ${(c.payouts || []).length ? `<ol class="adm__hist">${c.payouts.slice().reverse().map(x => `<li>Paid ${esc(rs(x.amount))} · ${esc(day(x.at))}${x.method ? ' · ' + esc(PAYL[x.method] || x.method) : ''}${x.note ? ' — ' + esc(x.note) : ''}</li>`).join('')}</ol>` : ''}</div>
          <div><h3>Status</h3><select data-cstatus aria-label="Status for ${esc(c.code)}">${['active', 'paused', 'pending'].map(v => `<option value="${v}"${v === c.status ? ' selected' : ''}>${CLABEL[v]}</option>`).join('')}</select>
            <h3 class="adm__gap">Custom rate</h3><div class="adm__rate"><input type="number" min="1" max="40" step="1" inputmode="numeric" placeholder="Tiers" value="${c.rate || ''}" aria-label="Custom commission % for ${esc(c.code)} (empty = tiers)"><button type="button" class="btn-outline" data-crate>Save</button></div>
            <div class="adm__cracts"><button type="button" class="btn-navy" data-cpay${s.balance > 0 ? '' : ' disabled'}>Record payout</button><button type="button" class="btn-outline" data-ckey>New key</button></div>
            <div class="adm__newkey" hidden></div></div>
        </div>
      </article>`;
    }).join('') : `<p class="adm__none">${creators.length ? 'No creators match.' : 'No creators yet — share creators.html.'}</p>`;
  }
  /* ---------- Leads (2026-10-10): the bulk / corporate / help / newsletter forms ---------- */
  const LFIELD = { name: 'Name', company: 'Company', type: 'I am a', phone: 'Phone', email: 'Email', city: 'City', store: 'Business', interests: 'Interested in', volume: 'Monthly quantity', qty: 'Quantity', products: 'Products', topic: 'Topic', order: 'Order', note: 'Note', message: 'Message' };
  function paintLeads() {
    const open = leads.filter(l => l.status === 'new');
    $('adm-lstats').innerHTML = [['Waiting for a reply', open.length], ...Object.entries(leadKinds).map(([k, t]) => [t, leads.filter(l => l.kind === k).length])]
      .map(([t, v]) => `<div class="adm__stat"><span>${esc(t)}</span><b>${esc(v)}</b></div>`).join('');
    $('adm-lfilter').innerHTML = [['new', 'To reply'], ['done', 'Done'], ['all', 'All']].map(([k, t]) => `<a href="#" data-lf="${k}"${k === lfilter ? ' aria-current="true"' : ''}>${t} <small>${k === 'all' ? leads.length : leads.filter(l => l.status === k).length}</small></a>`).join('');
    const q = $('adm-lq').value.trim().toLowerCase();
    const list = leads.filter(l => (lfilter === 'all' || l.status === lfilter) && (!q || JSON.stringify(l.fields).toLowerCase().includes(q)));
    $('adm-llist').innerHTML = lError ? `<p class="adm__none">${esc(lError)}</p>` : list.length ? list.map(l => {
      const f = l.fields || {}, ph = (f.phone || '').replace(/\D/g, '');
      const wa = ph.length >= 10 ? 'https://wa.me/' + (ph.startsWith('0') ? '92' + ph.slice(1) : ph) + '?text=' + encodeURIComponent(`Assalam o Alaikum ${(f.name || '').split(' ')[0]}, this is WisdomUp about your ${(leadKinds[l.kind] || 'enquiry').toLowerCase()}.`) : '';
      return `<article class="adm__order adm__lead adm__order--${l.status === 'new' ? 'new' : 'delivered'}" data-lid="${esc(l.id)}">
        <header><b>${esc(leadKinds[l.kind] || l.kind)}</b><span class="adm__pill adm__pill--${l.status === 'new' ? 'new' : 'delivered'}">${l.status === 'new' ? 'To reply' : 'Done'}</span><span class="adm__crname">${esc(f.name || f.email || '')}</span><time>${esc(new Date(l.createdAt).toLocaleString('en-PK', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }))}</time></header>
        <div class="adm__cols">
          <div><h3>Contact</h3><p>${f.phone ? `<a href="tel:${esc(f.phone)}">${esc(f.phone)}</a>${wa ? ` · <a href="${wa}" target="_blank" rel="noopener">WhatsApp</a>` : ''}<br>` : ''}${f.email ? `<a href="mailto:${esc(f.email)}">${esc(f.email)}</a><br>` : ''}${esc([f.city, f.company || f.store].filter(Boolean).join(' · '))}</p></div>
          <div><h3>Details</h3><dl class="adm__nums">${Object.entries(f).filter(([k, v]) => v && !['name', 'phone', 'email', 'city', 'company', 'store'].includes(k)).map(([k, v]) => `<div><dt>${esc(LFIELD[k] || k)}</dt><dd>${esc(v)}</dd></div>`).join('') || '<div><dt>—</dt><dd></dd></div>'}</dl>${l.page ? `<p class="adm__muted">From ${esc(l.page)}</p>` : ''}</div>
          <div><h3>Status</h3><div class="adm__cracts"><button type="button" class="${l.status === 'new' ? 'btn-navy' : 'btn-outline'}" data-ldone>${l.status === 'new' ? 'Mark done' : 'Back to reply'}</button></div></div>
        </div>
      </article>`;
    }).join('') : `<p class="adm__none">${leads.length ? 'Nothing here.' : 'No enquiries yet.'}</p>`;
  }
  $('adm-lfilter').addEventListener('click', e => { const a = e.target.closest('[data-lf]'); if (!a) return; e.preventDefault(); lfilter = a.dataset.lf; paintLeads(); });
  $('adm-lq').addEventListener('input', paintLeads);
  $('adm-llist').addEventListener('click', async e => {
    const b = e.target.closest('[data-ldone]'); if (!b) return;
    const id = b.closest('[data-lid]').dataset.lid, l = leads.find(x => x.id === id);
    try { const d = await api('PATCH', { id, status: l.status === 'new' ? 'done' : 'new' }, '?lead=admin'); leads = leads.map(x => (x.id === id ? d.lead : x)); paintLeads(); toast(d.lead.status === 'done' ? 'Marked done' : 'Back in To reply'); }
    catch (err) { toast(err.message); }
  });

  /* ---------- Reviews (2026-10-10): approve before they appear ---------- */
  const stars = n => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
  const rvCard = (r, pending) => `<article class="adm__order adm__rv" data-rid="${esc(r.id)}">
      <header><b>${esc(r.pid)}</b><span class="adm__pill adm__pill--${pending ? 'new' : 'delivered'}">${pending ? 'Waiting' : 'Live'}</span><span class="adm__stars" aria-label="${r.rating} out of 5">${stars(r.rating)}</span><span class="adm__crname">${esc(r.name)}${r.city ? ', ' + esc(r.city) : ''}${r.verified ? ' · Verified buyer' : ''}</span><time>${esc(day(r.createdAt))}</time></header>
      <div class="adm__rvbody">${r.title ? `<b>${esc(r.title)}</b>` : ''}<p>${esc(r.text)}</p><p class="adm__muted">${esc(r.sku || '')} · <a href="product.html?id=${encodeURIComponent(r.pid)}" target="_blank" rel="noopener">Open product</a></p></div>
      <div class="adm__cracts">${pending ? '<button type="button" class="btn-navy" data-rv="approve">Approve</button>' : ''}<button type="button" class="btn-outline" data-rv="reject">${pending ? 'Reject' : 'Remove'}</button></div>
    </article>`;
  function paintReviews() {
    $('adm-rstats').innerHTML = [['Waiting for approval', rvPending.length], ['Live (latest)', rvRecent.length]].map(([t, v]) => `<div class="adm__stat"><span>${esc(t)}</span><b>${esc(v)}</b></div>`).join('');
    $('adm-rlist').innerHTML = rError ? `<p class="adm__none">${esc(rError)}</p>`
      : (rvPending.length ? `<h2 class="adm__h2">Waiting</h2>${rvPending.map(r => rvCard(r, true)).join('')}` : '<p class="adm__none">No reviews waiting.</p>')
        + (rvRecent.length ? `<h2 class="adm__h2">Live</h2>${rvRecent.map(r => rvCard(r, false)).join('')}` : '');
  }
  $('adm-rlist').addEventListener('click', async e => {
    const b = e.target.closest('[data-rv]'); if (!b) return;
    const id = b.closest('[data-rid]').dataset.rid, action = b.dataset.rv;
    if (action === 'reject' && !confirm('Remove this review for good?')) return;
    try {
      await api('PATCH', { id, action }, '?rv=admin');
      const d = await api('GET', null, '?rv=admin'); rvPending = d.pending; rvRecent = d.recent; paintReviews();
      toast(action === 'approve' ? 'Approved — it is on the product page' : 'Review removed');
    } catch (err) { toast(err.message); }
  });

  async function crPatch(body, okMsg) {
    try { const d = await api('PATCH', body, '?cr=admin'); toast(okMsg); await load(); return d; }
    catch (err) { toast(err.message); return null; }
  }
  $('adm-views').addEventListener('click', e => { const a = e.target.closest('[data-view]'); if (!a) return; e.preventDefault(); showView(a.dataset.view); });
  $('adm-cq').addEventListener('input', paintCreators);
  $('adm-cfilter').addEventListener('click', e => { const a = e.target.closest('[data-cf]'); if (!a) return; e.preventDefault(); cfilter = a.dataset.cf; paintCreators(); });
  $('adm-clist').addEventListener('change', e => {
    const sel = e.target.closest('[data-cstatus]'); if (!sel) return;
    const code = sel.closest('[data-code]').dataset.code;
    crPatch({ code, status: sel.value }, `${code} → ${CLABEL[sel.value]}`);
  });
  $('adm-clist').addEventListener('click', async e => {
    const card = e.target.closest('[data-code]'); if (!card) return;
    const code = card.dataset.code, c = creators.find(x => x.code === code);
    if (e.target.closest('[data-crate]')) { const v = card.querySelector('.adm__rate input').value.trim(); crPatch({ code, rate: v ? Number(v) : null }, v ? `${code}: custom rate ${v}%` : `${code}: back on the tiers`); }
    if (e.target.closest('[data-cpay]')) {
      const amt = prompt(`Payout to ${code} (${(c.payout || {}).method ? PAYL[c.payout.method] + ' ' + c.payout.number : 'no payout details yet'}). Amount in rupees — owed now: ${rs(c.stats.balance)}`, String(c.stats.balance));
      if (amt == null) return;
      const note = prompt('Note (optional, e.g. the transaction ID)') || '';
      crPatch({ code, payout: { amount: Math.round(Number(String(amt).replace(/[^\d.]/g, ''))), note } }, `Payout recorded for ${code}`);
    }
    if (e.target.closest('[data-ckey]')) {
      if (!confirm(`Make a new private key for ${code}? The old key stops working at once.`)) return;
      try {
        const d = await api('PATCH', { code, resetKey: true }, '?cr=admin');
        const box = card.querySelector('.adm__newkey'), msg = `Your new WisdomUp creator key for ${code} is: ${d.key}\nSign in at the creator dashboard with your code and this key.`;
        box.hidden = false;
        box.innerHTML = `New key: <code>${esc(d.key)}</code> <a href="https://wa.me/92${c.phone.slice(1)}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">Send on WhatsApp</a> <small>Shown once.</small>`;
      } catch (err) { toast(err.message); }
    }
  });

  $('adm-login').addEventListener('submit', e => { e.preventDefault(); key = $('adm-key').value.trim(); $('adm-err').hidden = true; load(); });
  $('adm-refresh').addEventListener('click', () => load().then(() => toast('Orders refreshed')));
  $('adm-out').addEventListener('click', () => { sessionStorage.removeItem('wu-admin-key'); location.reload(); });
  $('adm-q').addEventListener('input', paint);
  $('adm-filter').addEventListener('click', e => { const a = e.target.closest('[data-f]'); if (!a) return; e.preventDefault(); filter = a.dataset.f; paint(); });
  $('adm-list').addEventListener('change', async e => {
    const sel = e.target.closest('select[data-num]');
    if (!sel) return;
    const note = sel.value === 'cancelled' ? (prompt('Reason for cancelling (optional)') || '') : '';
    try {
      const { order } = await api('PATCH', { number: sel.dataset.num, status: sel.value, note });
      orders = orders.map(o => (o.number === order.number ? order : o));
      paint();
      toast(`${order.number} → ${LABEL[order.status]}`);
    } catch (err) { toast(err.message); load(); }
  });
  if (key) load();
})();
