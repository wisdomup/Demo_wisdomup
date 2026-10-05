// WisdomUp — Bulk Order page: partner inquiry form (validation + success state), categories, steps, FAQs.
(function () {
  const { D, $, esc, url, mountAccordion } = WU;
  WU.initChrome();

  const TYPES = ['Distributor', 'Wholesaler', 'Retailer', 'Corporate buyer'];
  const INTERESTS = ['Earbuds', 'Neckbands', 'Speakers', 'Microphones', 'Chargers'];
  const VOLUMES = ['50–200 units', '200–1,000', '1,000–5,000', '5,000+'];

  $('perks').innerHTML = [
    ['grid', 'Wide product range', 'Earbuds, neckbands, speakers, creator mics and charging.'],
    ['medal', 'Brand-ready supply', 'Trusted WisdomUp branding on fast-moving accessories.'],
    ['truck', 'Local fulfilment', 'Pakistan-ready stock flow from our Karachi warehouse.'],
    ['shield', 'Warranty support', 'Warranty-backed products with a dedicated partner contact.'],
  ].map(([ic, t, s]) => `<div class="perk"><span class="perk__ic">${icon(ic, 26)}</span><b>${t}</b><span>${s}</span></div>`).join('');

  const chips = (id, list, pressed) => { $(id).innerHTML = list.map((l, i) => `<button type="button" class="chip" aria-pressed="${pressed(l, i)}" data-v="${esc(l)}">${esc(l)}</button>`).join(''); };
  chips('types', TYPES, (l, i) => i === 0);
  chips('interests', INTERESTS, l => l === 'Earbuds');
  chips('volumes', VOLUMES, (l, i) => i === 0);
  document.querySelectorAll('.bk-chips').forEach(box => box.addEventListener('click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    if (box.hasAttribute('data-single')) box.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b));
    else b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true');
  }));
  const picked = id => [...$(id).querySelectorAll('[aria-pressed="true"]')].map(b => b.dataset.v);

  /* ---------- Form ---------- */
  const form = $('bulk-form'), hint = $('bk-hint');
  const REQ = { name: v => v.trim(), phone: v => v.replace(/\D/g, '').length >= 10, email: v => /^\S+@\S+\.\S+$/.test(v.trim()), city: v => v.trim() };
  form.addEventListener('input', e => { const f = e.target.closest('.field'); if (f) f.classList.remove('is-bad'); hint.classList.remove('is-err'); hint.textContent = 'Inquiries go straight to our bulk desk.'; });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = Object.keys(REQ).filter(k => !REQ[k](form.elements[k].value));
    Object.keys(REQ).forEach(k => {
      form.elements[k].closest('.field').classList.toggle('is-bad', bad.includes(k));
      form.elements[k].setAttribute('aria-invalid', bad.includes(k));
    });
    if (bad.length) {
      hint.classList.add('is-err');
      hint.textContent = 'Please fill in name, a WhatsApp number, a valid email and city.';
      form.elements[bad[0]].focus();
      return;
    }
    const interests = picked('interests');
    $('bk-first').textContent = (form.elements.name.value.trim().split(' ')[0] || 'there') + '.';
    $('bk-done-text').textContent = `Our bulk desk will message you on WhatsApp at ${form.elements.phone.value.trim()} within one working day with ${picked('types')[0].toLowerCase()} pricing for ${interests.length ? interests.join(', ').toLowerCase() : 'the full range'} (${picked('volumes')[0]} a month).`;
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

  /* ---------- Categories, steps, FAQs ---------- */
  // Departments, each shown with a representative product photo
  $('bk-cats').innerHTML = WU.DEPTS.map(d => {
    const items = D.products.filter(p => d.types.includes(p.type));
    const p = items.find(x => x.thumb && x.tabs.includes('new')) || items[0];
    return p ? `<a class="cat" href="${url.dept(d.id)}"><span class="cat__ring" style="background: ${WU.photoBg(p)};"><img src="${p.thumb}" alt="" style="width: 100%; height: 100%; border-radius: 50%; ${WU.photoFit(p)}"></span>${esc(d.label)}</a>` : '';
  }).join('');
  $('steps').innerHTML = [
    ['Tell us about your business', 'Share your type, city and the products you want to carry.'],
    ['Get partner pricing', 'We reply on WhatsApp within one working day with a tailored quote.'],
    ['Receive your stock', 'Confirm the order and we dispatch from Karachi in 2–3 working days.'],
  ].map(([t, s], i) => `<div class="step"><span class="step__n">STEP ${String(i + 1).padStart(2, '0')}</span><b>${t}</b><span>${s}</span></div>`).join('');
  mountAccordion($('bulk-faq'), [
    ['What is the minimum order quantity?', 'Bulk pricing starts at 50 units across any mix of products. Distributor terms start at higher volumes — tell us your estimate and we\'ll match the right tier.'],
    ['Can you add our company branding?', 'Yes, for corporate orders we offer custom packaging and engraving on selected models. Lead time depends on quantity.'],
    ['How fast can you deliver?', 'In-stock orders dispatch from Karachi within 2–3 working days and reach most cities in Pakistan within a week.'],
    ['Do bulk orders carry the same warranty?', 'Every unit carries the standard WisdomUp warranty, and partners get a dedicated contact for claims.'],
  ], { idPrefix: 'bfaq' });
})();
