// WisdomUp — the corporate page (corporate.html, 2026-10-14: higgsfield.ai/enterprise's layout rebuilt in our design; see the note in
// corporate.css). Facts only: the counts and every product, photo and price come from catalog.js (+ the shop.js sale through wu-data);
// the quote form and the FAQ are the shared ones in info.js.
(function () {
  const { D, $, esc, url, photoBg, photoFit, DEPTS } = WU;
  if (!$('cp-perks')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- who we gift for: higgsfield's client-card row. FACTS ONLY — no named clients yet, so the cards are the teams we make
     gifts for, each with a real product + price. Real corporate clients go in CLIENTS (only with their permission):
     { name, sub, img, title, line, href } — when there is at least one, they replace the sectors and the heading says so. ---------- */
  const CLIENTS = [];
  const byId = id => D.products.find(p => p.id === id);
  const SECTORS = [
    { name: 'Banks & finance', img: 'img/hero/ts-11anc-tall.webp', at: '50% 45%', pid: 'ts-11anc', title: 'Client gifts that stay on the desk' },
    { name: 'Tech & telecom', img: 'img/hero/os-4-tall.webp', at: '50% 40%', pid: 'os-4', title: 'Open-ear earbuds for long days on calls' },
    { name: 'Schools & universities', img: 'img/p/ts-11-2.jpg', at: '50% 30%', pid: 'ts-11', title: 'Graduation and staff gifts' },
    { name: 'Events & agencies', img: 'img/hero/cdb-18-tall.webp', at: '50% 45%', pid: 'cdb-18', title: 'Giveaways that keep phones charged' },
    { name: 'Healthcare & pharma', img: 'img/hero/tde-18-tall.webp', at: '50% 50%', pid: 'tde-18', title: 'Thank-you gifts for doctors and teams' },
    { name: 'Retail & FMCG', img: 'img/hero/txd-01-tall.webp', at: '50% 45%', pid: 'txd-01', title: 'Grooming sets for staff rewards' }
  ];
  const track = $('cp-clients');
  if (track) {
    const real = CLIENTS.length > 0;
    if (real) { $('cp-clients-tag').textContent = 'Corporate clients'; $('cp-clients-h').textContent = 'Companies already gifting with WisdomUp'; }
    const cards = (real ? CLIENTS : SECTORS).map(c => {
      const p = c.pid && byId(c.pid);
      if (!real && !p) return '';
      const line = real ? c.line : `${p.title} · ${p.priceText}`;
      const href = real ? (c.href || '#quote') : url.product(p.id);
      return `<a class="cp-cl" role="listitem" href="${href}" draggable="false"><img src="${c.img}" alt="" loading="lazy" draggable="false" style="object-position: ${c.at || '50% 50%'};"><span class="cp-cl__name">${esc(c.name)}${c.sub ? `<small>${esc(c.sub)}</small>` : ''}</span><span class="cp-cl__txt"><h3>${esc(c.title)}</h3><span>${esc(line)}</span></span></a>`;
    }).join('');
    track.innerHTML = cards;
    // the progress line under the row: the thumb's width is the share of the row on screen, it moves with the scroll
    const bar = track.parentElement.querySelector('.cp-clients__bar');
    const paint = () => {
      const max = track.scrollWidth - track.clientWidth, w = Math.max(.12, Math.min(1, track.clientWidth / track.scrollWidth));
      bar.style.setProperty('--bw', (w * 100) + '%');
      bar.style.setProperty('--bx', (max > 0 ? (track.scrollLeft / max) * ((1 - w) / w) * 100 : 0) + '%');
      bar.hidden = max <= 2;
    };
    track.addEventListener('scroll', () => requestAnimationFrame(paint), { passive: true });
    new ResizeObserver(paint).observe(track); paint();
    // a mouse can drag the row (touch and trackpads scroll it natively); a drag never opens a card
    if (fine) {
      let x0 = 0, s0 = 0, moved = false, down = false;
      track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button) return; down = true; moved = false; x0 = e.clientX; s0 = track.scrollLeft; });
      window.addEventListener('pointermove', e => {
        if (!down) return;
        const dx = e.clientX - x0;
        if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add('is-drag'); }
        if (moved) track.scrollLeft = s0 - dx;
      });
      window.addEventListener('pointerup', () => {
        if (!down) return; down = false;
        if (moved) {
          // settle on the nearest card, then let the snap take over again
          const step = (track.querySelector('.cp-cl') || {}).offsetWidth + 16 || 1;
          track.classList.remove('is-drag');
          track.scrollTo({ left: Math.round(track.scrollLeft / step) * step, behavior: reduced ? 'auto' : 'smooth' });
        }
      });
      track.addEventListener('click', e => { if (moved) { e.preventDefault(); moved = false; } }, true);
    }
  }

  /* ---------- the quote form in two steps, like higgsfield's: 1 = who you are + the occasion, 2 = products, quantity, date, notes.
     Continue checks step 1 with info.js's rules (required, a real email, a 10-digit phone); the send itself is info.js's. ---------- */
  const form = $('corp-form');
  if (form && form.querySelector('[data-step="2"]')) {
    const steps = [...form.querySelectorAll('[data-step]')], bars = [...form.querySelectorAll('.cp-form__bars i')];
    const back = form.querySelector('[data-back]'), next = form.querySelector('[data-next]'), send = form.querySelector('[data-send]'), label = form.querySelector('[data-step-label]');
    let step = 1;
    const go = (n, focus = true) => {
      step = n;
      steps.forEach(s => { s.hidden = +s.dataset.step !== n; });
      bars.forEach((b, i) => b.classList.toggle('is-on', i < n));
      back.hidden = n === 1; next.hidden = n !== 1; send.hidden = n !== 2;
      if (label) label.textContent = `Step ${n} of 2`;
      if (focus) { const f = form.querySelector(`[data-step="${n}"] input, [data-step="${n}"] select, [data-step="${n}"] .chip`); if (f) f.focus(); }
    };
    const ok = el => {
      const v = el.value.trim();
      if (el.required && !v) return false;
      if (v && el.type === 'email') return /^\S+@\S+\.\S+$/.test(v);
      if (v && el.type === 'tel') return v.replace(/\D/g, '').length >= 10;
      return true;
    };
    const checkStep1 = () => {
      const els = [...form.querySelectorAll('[data-step="1"] input[name]')];
      const bad = els.filter(el => !ok(el));
      els.forEach(el => { el.closest('.field').classList.toggle('is-bad', bad.includes(el)); el.setAttribute('aria-invalid', bad.includes(el)); });
      if (bad.length) bad[0].focus();
      return !bad.length;
    };
    next.addEventListener('click', () => { if (checkStep1()) go(2); });
    back.addEventListener('click', () => go(1));
    // Enter in a step-1 field means Continue, never a send that skips step 2
    form.addEventListener('submit', e => { if (step === 1) { e.preventDefault(); e.stopImmediatePropagation(); if (checkStep1()) go(2); } }, true);
    // a field the server rejects sits on step 1: go back to it
    new MutationObserver(() => { if (step === 2 && form.querySelector('[data-step="1"] .field.is-bad')) go(1, false); }).observe(form, { subtree: true, attributes: true, attributeFilter: ['class'] });
    form.querySelector('[data-reset]').addEventListener('click', () => go(1, false));
    form.addEventListener('input', e => { const f = e.target.closest('.field'); if (f) f.classList.remove('is-bad'); });
    go(1, false);
  }

  /* ---------- live counts in the hero ---------- */
  const fill = { count: D.products.length.toLocaleString('en-PK'), ranges: (DEPTS || []).length };
  document.querySelectorAll('[data-cp]').forEach(el => { if (fill[el.dataset.cp] != null) el.textContent = fill[el.dataset.cp]; });

  /* ---------- perks: segmented tabs; the big word rises letter by letter; the progress line moves on every 6s ---------- */
  const sec = $('cp-perks'), tabs = [...sec.querySelectorAll('[role="tab"]')], panels = tabs.map(t => $(t.getAttribute('aria-controls')));
  const bars = [...sec.querySelectorAll('.cp-prog i')];
  panels.forEach(p => {
    const big = p.querySelector('.cp-big');
    if (big && !big.querySelector('i')) big.innerHTML = [...big.textContent].map((ch, i) => `<i style="--i: ${i}">${ch === ' ' ? '&nbsp;' : esc(ch)}</i>`).join('');
  });
  let cur = 0;
  const show = (i, focus) => {
    cur = (i + tabs.length) % tabs.length;
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === cur); t.tabIndex = k === cur ? 0 : -1; });
    panels.forEach((p, k) => { p.hidden = k !== cur; p.classList.toggle('is-in', k === cur); });
    bars.forEach((b, k) => { b.classList.toggle('is-done', k < cur); b.classList.remove('is-on'); });
    if (!reduced) { void bars[cur].offsetWidth; bars[cur].classList.add('is-on'); } else bars[cur].classList.add('is-on');
    if (focus) tabs[cur].focus();
  };
  tabs.forEach((t, i) => t.addEventListener('click', () => show(i)));
  sec.querySelector('[role="tablist"]').addEventListener('keydown', e => {
    const d = { ArrowRight: 1, ArrowLeft: -1, Home: -cur, End: tabs.length - 1 - cur }[e.key];
    if (d == null) return;
    e.preventDefault(); show(cur + d, true);
  });
  if (!reduced) {
    bars.forEach(b => b.addEventListener('animationend', () => { if (b.classList.contains('is-on')) show(cur + 1); }));
    // pause while the visitor reads it (hover / keyboard focus), while it is off screen and while the tab is hidden
    let hover = false, focusIn = false, seen = false;
    const pause = () => sec.classList.toggle('is-paused', hover || focusIn || !seen || document.hidden);
    sec.addEventListener('pointerenter', () => { hover = true; pause(); });
    sec.addEventListener('pointerleave', () => { hover = false; pause(); });
    sec.addEventListener('focusin', () => { focusIn = true; pause(); });
    sec.addEventListener('focusout', () => { focusIn = false; pause(); });
    document.addEventListener('visibilitychange', pause);
    new IntersectionObserver(([en]) => { seen = en.isIntersecting; pause(); }, { threshold: .35 }).observe(sec);
    pause();
  }
  show(0);

  /* ---------- the range: big names on the left switch the white panel of real products ---------- */
  const list = document.querySelector('.cp-range__list'), panel = $('cp-range-panel');
  if (list && panel) {
    const items = [...list.querySelectorAll('.cp-range__item')];
    const live = D.products.filter(p => !p.soldOut && p.thumb);
    const rank = p => (p.studio ? 0 : 2) + (p.tabs.includes('best') || p.tabs.includes('new') ? 0 : 1);
    const nameOf = p => p.title.replace(new RegExp('^' + p.code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+'), '');
    const tile = (p, i) => `<a class="cp-tile" href="${url.product(p.id)}" style="--i: ${i}"><span class="cp-tile__img" style="background: ${photoBg(p)};"><img src="${p.thumb}" alt="" loading="lazy" style="${photoFit(p)}"></span><small>${esc(p.code)}</small><b>${esc(nameOf(p))}</b><strong>${esc(p.priceText)}${p.wasText ? `<s>${esc(p.wasText)}</s>` : ''}</strong></a>`;
    const pick = type => live.filter(p => p.type === type).sort((a, b) => rank(a) - rank(b) || b.price - a.price);
    let at = -1;
    const choose = (i, focus) => {
      if (i === at) return;
      at = i;
      const it = items[i], type = it.dataset.type, all = pick(type), label = it.textContent.trim();
      items.forEach((x, k) => { x.setAttribute('aria-selected', k === i); x.tabIndex = k === i ? 0 : -1; });
      panel.setAttribute('aria-label', label);
      panel.classList.remove('is-swap'); void panel.offsetWidth;
      panel.innerHTML = all.slice(0, 6).map(tile).join('');
      if (!reduced) panel.classList.add('is-swap');
      const min = all.length ? Math.min(...all.map(p => p.price)) : 0;
      $('cp-range-t').textContent = all.length ? `${all.length} ${label.toLowerCase()} from ${D.rs(min)}` : label;
      const link = $('cp-range-all');
      link.href = it.getAttribute('href'); link.textContent = `Shop all ${label.toLowerCase()} ›`;
      if (focus) it.focus();
    };
    items.forEach((it, i) => {
      it.addEventListener('click', e => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); choose(i); });
      if (fine) it.addEventListener('pointerenter', () => choose(i));
    });
    list.addEventListener('keydown', e => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (d == null) return;
      e.preventDefault(); choose((at + d + items.length) % items.length, true);
    });
    choose(0);
  }
})();
