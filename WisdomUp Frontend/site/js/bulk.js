// WisdomUp — Bulk Order page (bulk-order.html). Rebuilt 2026-10-14 on the corporate page's landing engine ("make the bulk page inspired
// by the corporate page"): js/corporate.js (loaded after this file) runs the pinned intro, the card row, the tabs, the pinned range, the
// two form steps and the floating button from the page's markup. This file adds the bulk desk's own parts: the "Who we supply" cards
// (window.CP_CARDS), the chips, the partner inquiry's send — the same data and WhatsApp handover as before — and a direct WhatsApp link.
// info.js has already started the site chrome (WU.initChrome) and wires the FAQ list.
(function () {
  const { $, esc } = WU;

  /* ---------- "Who we supply": the partner types (facts from the bulk desk's FAQ and dispatch promise) ---------- */
  window.CP_CARDS = [
    { name: 'Distributors', img: 'img/hero/cdb-18-tall.webp', at: '50% 45%', title: 'Supply your city', line: 'Distributor terms start at higher volumes — tell us your estimate.', href: '#quote', type: 'Distributor' },
    { name: 'Wholesalers', img: 'img/hero/os-6-tall.webp', at: '50% 42%', title: 'Stock that moves', line: 'Bulk pricing from 50 units, across any mix of products.', href: '#quote', type: 'Wholesaler' },
    { name: 'Retailers & shops', img: 'img/hero/txd-01-tall.webp', at: '50% 45%', title: 'Fill your shelves', line: 'In-stock orders dispatch from Karachi in 2–3 working days.', href: '#quote', type: 'Retailer' },
    { name: 'Corporate buyers', img: 'img/hero/ts-11anc-tall.webp', at: '50% 45%', title: 'Gifts with your branding', line: 'Custom packaging and engraving — see Corporate Orders.', href: 'corporate.html' }
  ];
  // a partner card fills "I'm a" before the visitor reaches the form
  document.addEventListener('click', e => {
    const c = e.target.closest && e.target.closest('#cp-clients .cp-cl[data-type]');
    if (c && $('f-type')) $('f-type').value = c.dataset.type;
  });
  const direct = $('bk-wa-direct');
  if (direct) direct.href = WU.lead.wa('Hi WisdomUp bulk desk, I would like partner pricing.');

  /* ---------- Chips (interests: several; monthly quantity: one) ---------- */
  document.querySelectorAll('#bulk-form .bk-chips').forEach(box => box.addEventListener('click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    if (box.hasAttribute('data-single')) box.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b));
    else b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true');
  }));
  const picked = id => [...$(id).querySelectorAll('[aria-pressed="true"]')].map(b => b.dataset.v);

  /* ---------- The send (step 2's "Send inquiry"; step 1 is checked by the engine before it lets the visitor on) ---------- */
  const form = $('bulk-form'), hint = $('bk-hint');
  if (!form) return;
  const REQ = { name: v => v.trim(), phone: v => v.replace(/\D/g, '').length >= 10, email: v => /^\S+@\S+\.\S+$/.test(v.trim()), city: v => v.trim() };
  form.addEventListener('input', e => { const f = e.target.closest('.field'); if (f) f.classList.remove('is-bad'); hint.classList.remove('is-err'); hint.textContent = ''; });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const bad = Object.keys(REQ).filter(k => !REQ[k](form.elements[k].value));
    Object.keys(REQ).forEach(k => {
      form.elements[k].closest('.field').classList.toggle('is-bad', bad.includes(k));
      form.elements[k].setAttribute('aria-invalid', bad.includes(k));
    });
    if (bad.length) { form.elements[bad[0]].focus(); return; } // the engine brings step 1 back to show it
    const interests = picked('interests'), v = n => form.elements[n].value.trim(), type = form.elements.type.value, volume = picked('volumes')[0] || '';
    // Send to the shop's enquiry inbox; without it (the demo) hand over to WhatsApp with everything filled in (2026-10-10, the audit)
    const go = form.querySelector('[type="submit"]');
    go.disabled = true; go.classList.add('is-loading');
    const fields = { name: v('name'), phone: v('phone'), email: v('email'), city: v('city'), store: v('store'), note: v('note'), type, interests: interests.join(', '), volume, website: form.elements.website ? form.elements.website.value : '' };
    const r = await WU.lead.send('bulk', fields);
    go.disabled = false; go.classList.remove('is-loading');
    if (r.field && form.elements[r.field]) { form.elements[r.field].closest('.field').classList.add('is-bad'); hint.classList.add('is-err'); hint.textContent = r.error; form.elements[r.field].focus(); return; }
    const first = v('name').split(' ')[0] || 'there', what = `${type.toLowerCase()} pricing for ${interests.length ? interests.join(', ').toLowerCase() : 'the full range'}${volume ? ` (${volume} a month)` : ''}`;
    const wa = WU.lead.wa(WU.lead.text('Bulk order inquiry', [['Name', fields.name], ['I am a', fields.type], ['WhatsApp', fields.phone], ['Email', fields.email], ['City', fields.city], ['Business', fields.store], ['Interested in', fields.interests], ['Monthly quantity', fields.volume], ['Note', fields.note]]));
    $('bk-done').querySelector('.badge-grad').textContent = r.ok ? 'Inquiry received' : 'One last step';
    $('bk-done').querySelector('h2').innerHTML = `${r.ok ? 'Thanks' : 'Almost done'}, <b id="bk-first">${esc(first)}.</b>`;
    $('bk-done-text').textContent = r.ok
      ? `Our bulk desk will message you on WhatsApp at ${fields.phone} within one working day with ${what}.`
      : `Tap Send on WhatsApp — the message opens with your inquiry filled in. Our bulk desk replies within one working day with ${what}.`;
    const link = $('bk-wa');
    if (!link.innerHTML) link.innerHTML = (WU.wa ? WU.wa.svg : '') + '<span>Send on WhatsApp</span>';
    link.hidden = r.ok; link.href = wa;
    $('bk-fill').hidden = true;
    $('bk-done').hidden = false;
    WU.px('Lead', { content_name: 'Bulk order inquiry' }); // pixel: a wholesale lead (no personal details are sent)
    WU.scrollToEl(form, 0);
  });
  $('bk-reset').addEventListener('click', () => {
    form.reset();
    $('bk-done').hidden = true;
    $('bk-fill').hidden = false;
    form.elements.name.focus();
  });
})();
