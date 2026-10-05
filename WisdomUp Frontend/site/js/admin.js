// WisdomUp — order admin (admin.html). Reads and updates orders through /api/orders with the X-Admin-Key header.
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const rs = n => 'Rs.' + Number(n || 0).toLocaleString('en-PK');
  const SHOP = window.WU_SHOP;
  const LABEL = { new: 'New', confirmed: 'Confirmed', paid: 'Paid', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };
  let key = sessionStorage.getItem('wu-admin-key') || '', orders = [], filter = 'all', toastT;
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
      $('adm-login').hidden = true; $('adm-main').hidden = false; $('adm-refresh').hidden = $('adm-out').hidden = false;
      paint();
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
    const list = orders.filter(o => (filter === 'all' || o.status === filter) && (!q || [o.number, o.customer.name, o.customer.phone, o.address.city, o.address.area].join(' ').toLowerCase().includes(q)));
    $('adm-list').innerHTML = list.length ? list.map(o => {
      const wa = 'https://wa.me/92' + o.customer.phone.slice(1) + '?text=' + encodeURIComponent(`Assalam o Alaikum ${o.customer.name.split(' ')[0]}, this is WisdomUp about your order ${o.number} (${rs(o.totals.total)}).`);
      return `<article class="adm__order adm__order--${o.status}">
        <header><b>${esc(o.number)}</b><span class="adm__pill adm__pill--${o.status}">${esc(LABEL[o.status] || o.status)}</span><time>${esc(new Date(o.createdAt).toLocaleString('en-PK', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }))}</time></header>
        <div class="adm__cols">
          <div><h3>Customer</h3><p>${esc(o.customer.name)}<br><a href="tel:${esc(o.customer.phone)}">${esc(o.customer.phone)}</a> · <a href="${wa}" target="_blank" rel="noopener">WhatsApp</a>${o.customer.email ? `<br>${esc(o.customer.email)}` : ''}</p>
            <h3>Address</h3><p>${esc(o.address.line)}<br>${esc(o.address.area)}, ${esc(o.address.city)}${o.address.notes ? `<br><i>${esc(o.address.notes)}</i>` : ''}</p></div>
          <div><h3>Items</h3><ul>${o.items.map(l => `<li><b>${l.qty} ×</b> ${esc(l.sku)} — ${esc(l.title)}${Object.keys(l.attrs || {}).length ? ` <small>(${esc(Object.values(l.attrs).join(', '))})</small>` : ''} <span>${esc(rs(l.total))}</span></li>`).join('')}</ul>
            <p class="adm__tot">${esc((SHOP.delivery[o.delivery] || {}).label || o.delivery)} ${o.totals.delivery ? rs(o.totals.delivery) : '(free)'}${o.totals.giftWrap ? ' · Gift wrap ' + rs(o.totals.giftWrap) : ''} · <b>Total ${esc(rs(o.totals.total))}</b> · ${esc((SHOP.payments[o.payment] || {}).label || o.payment)}</p></div>
          <div><h3>Status</h3><select data-num="${esc(o.number)}" aria-label="Status for ${esc(o.number)}">${SHOP.statuses.map(s => `<option value="${s}"${s === o.status ? ' selected' : ''}>${LABEL[s]}</option>`).join('')}</select>
            <ol class="adm__hist">${(o.history || []).slice().reverse().map(h => `<li>${esc(LABEL[h.status] || h.status)} · ${esc(new Date(h.at).toLocaleString('en-PK', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }))}${h.note ? ` — ${esc(h.note)}` : ''}</li>`).join('')}</ol></div>
        </div>
      </article>`;
    }).join('') : '<p class="adm__none">No orders match.</p>';
  }
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
