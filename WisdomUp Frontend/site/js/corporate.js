// WisdomUp — the landing-page engine shared by the corporate page (corporate.html, 2026-10-14: higgsfield.ai/enterprise's layout rebuilt
// in our design; see the note in corporate.css) and the bulk page (bulk-order.html, 2026-10-14, "make the bulk page inspired by the
// corporate page"). Everything is read from the page's own markup; a page can hand its own card row in `window.CP_CARDS` (bulk.js).
// Facts only: the counts and every product, photo and price come from catalog.js (+ the shop.js sale through wu-data).
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
    const own = Array.isArray(window.CP_CARDS) && window.CP_CARDS.length, real = !own && CLIENTS.length > 0;
    if (real) { $('cp-clients-tag').textContent = 'Corporate clients'; $('cp-clients-h').textContent = 'Companies already gifting with WisdomUp'; }
    const cards = (own ? window.CP_CARDS : real ? CLIENTS : SECTORS).map(c => {
      const p = c.pid && byId(c.pid);
      if (!own && !real && !p) return '';
      const line = c.line || (p ? `${p.title} · ${p.priceText}` : '');
      const href = c.href || (p ? url.product(p.id) : '#quote');
      return `<a class="cp-cl" role="listitem" href="${href}"${c.type ? ` data-type="${esc(c.type)}"` : ''} draggable="false"><img src="${c.img}" alt="" loading="lazy" draggable="false" style="object-position: ${c.at || '50% 50%'};"><span class="cp-cl__name">${esc(c.name)}${c.sub ? `<small>${esc(c.sub)}</small>` : ''}</span><span class="cp-cl__txt"><h3>${esc(c.title)}</h3><span>${esc(line)}</span></span></a>`;
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
  const form = document.querySelector('form.cp-form');
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
      const retail = panel.dataset.cap === 'retail'; // the bulk page: shop prices, partner pricing comes with the quote
      $('cp-range-t').textContent = all.length ? `${all.length} ${label.toLowerCase()} · ${retail ? 'retail from' : 'from'} ${D.rs(min)}` : label;
      const link = $('cp-range-all');
      link.href = it.getAttribute('href'); link.textContent = `Shop all ${label.toLowerCase()} ›`;
      if (focus) it.focus();
    };
    // PINNED (2026-10-14, "add the kinetic effect when I scroll, this sticks until the last section, very smooth"): on screens ≥1024 wide
    // and ≥640 tall the section is tall and its stage sticky (CSS .is-pin); the scroll position becomes a smoothed position f in
    // [0, n−1] (a damped follow, so a flick of the wheel glides) — names brighten / nudge with it continuously, the rail fills, and the
    // panel swaps when f passes a half-way point. Every range gets an equal share of the scroll. Elsewhere: hover / tap / keys as before.
    const sec = $('cp-range'), rail = sec.querySelector('.cp-range__rail'), n = items.length;
    let pinned = false, f = 0, ft = 0, raf = 0, last = 0;
    const pinOk = () => !reduced && innerWidth >= 1024 && innerHeight >= 640;
    const span = () => Math.max(1, sec.offsetHeight - innerHeight);
    const posFor = i => sec.getBoundingClientRect().top + scrollY + ((i + .5) / n) * span();
    const aim = () => { const p = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / span())); ft = Math.min(n - 1, Math.max(0, p * n - .5)); };
    const paint = () => {
      items.forEach((x, i) => { const d = Math.min(1, Math.abs(i - f)); x.style.setProperty('--a', (.32 + .68 * (1 - d)).toFixed(3)); x.style.setProperty('--k', (1 - d).toFixed(3)); });
      if (rail) rail.style.setProperty('--p', (n > 1 ? f / (n - 1) : 1).toFixed(4));
      const i = Math.round(f);
      if (i !== at) choose(i);
    };
    const tick = t => {
      raf = 0;
      const dt = last ? Math.min(.05, (t - last) / 1000) : 1 / 60; last = t;
      f += (ft - f) * (1 - Math.exp(-dt * 8));
      if (Math.abs(ft - f) < .0015) f = ft;
      paint();
      if (f !== ft) raf = requestAnimationFrame(tick); else last = 0;
    };
    const kick = () => { if (!pinned) return; aim(); if (!raf) raf = requestAnimationFrame(tick); };
    const layout = () => {
      const on = pinOk();
      if (on !== pinned) {
        pinned = on;
        sec.classList.toggle('is-pin', on);
        sec.style.setProperty('--cp-n', n);
        if (!on) items.forEach(x => { x.style.removeProperty('--a'); x.style.removeProperty('--k'); });
      }
      if (pinned) { aim(); f = ft; paint(); }
    };
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', layout);
    const goTo = (i, focus) => {
      if (pinned) { scrollTo({ top: posFor(i), behavior: reduced ? 'auto' : 'smooth' }); if (focus) items[i].focus({ preventScroll: true }); }
      else choose(i, focus);
    };
    items.forEach((it, i) => {
      it.addEventListener('click', e => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); goTo(i); });
      if (fine) it.addEventListener('pointerenter', () => { if (!pinned) choose(i); });
    });
    list.addEventListener('keydown', e => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (d == null) return;
      e.preventDefault(); goTo(Math.min(n - 1, Math.max(0, at + d)), true);
    });
    choose(0);
    layout();
  }

  /* ---------- INTRO: the full-screen stage pinned until the card row arrives (CSS .cp-intro). The scroll through the section
     (0 → 1) is smoothed the same way and drives, with transforms and opacity only: photo A zooms 1 → 1.08 and fades out from .3 to
     .56, photo B fades in over the same stretch while easing from 1.1 to 1; the headline + count lift 8svh and fade by .3; the
     second message rises from 6svh and fades in from .4 to .66 (its button is clickable only once it shows). ---------- */
  const intro = $('cp-intro');
  if (intro && !reduced) {
    const A = intro.querySelector('.cp-intro__media--a'), B = intro.querySelector('.cp-intro__media--b');
    const ca = intro.querySelector('.cp-intro__a'), cb = intro.querySelector('.cp-intro__b'), cue = intro.querySelector('.cp-intro__cue');
    const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const ramp = (x, a, b) => clamp((x - a) / (b - a));
    const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    let q = 0, qt = 0, raf2 = 0, last2 = 0;
    const aim = () => { const span = Math.max(1, intro.offsetHeight - innerHeight); qt = clamp(-intro.getBoundingClientRect().top / span); };
    const paint = () => {
      const fa = ease(ramp(q, .3, .56)), ta = ease(ramp(q, 0, .3)), tb = ease(ramp(q, .4, .66));
      A.style.transform = `scale(${(1 + .08 * q).toFixed(4)})`; A.style.opacity = (1 - fa).toFixed(3);
      B.style.transform = `scale(${(1.1 - .1 * ease(ramp(q, .3, 1))).toFixed(4)})`; B.style.opacity = fa.toFixed(3);
      ca.style.transform = `translateY(${(-8 * ta).toFixed(3)}svh)`; ca.style.opacity = (1 - ta).toFixed(3);
      cb.style.transform = `translateY(${(6 * (1 - tb)).toFixed(3)}svh)`; cb.style.opacity = tb.toFixed(3);
      cb.classList.toggle('is-live', tb > .6); ca.style.pointerEvents = ta > .4 ? 'none' : '';
      if (cue) cue.style.opacity = (1 - ramp(q, 0, .12)).toFixed(3);
    };
    const tick = t => {
      raf2 = 0;
      const dt = last2 ? Math.min(.05, (t - last2) / 1000) : 1 / 60; last2 = t;
      q += (qt - q) * (1 - Math.exp(-dt * 9));
      if (Math.abs(qt - q) < .0008) q = qt;
      paint();
      if (q !== qt) raf2 = requestAnimationFrame(tick); else last2 = 0;
    };
    addEventListener('scroll', () => { aim(); if (!raf2) raf2 = requestAnimationFrame(tick); }, { passive: true });
    addEventListener('resize', () => { aim(); q = qt; paint(); });
    aim(); q = qt; paint();
  }

  /* ---------- floating "Request a quote" (higgsfield's fixed "Contact Sales"): shown once the intro has passed, hidden over the dark
     range stage and from the contact band down ---------- */
  const flo = $('cp-float'), contact = document.querySelector('.cp-contact');
  if (flo && contact) {
    const btn = flo.querySelector('a');
    const place = () => {
      const past = intro ? intro.getBoundingClientRect().bottom < innerHeight * .5 : scrollY > innerHeight;
      const rg = $('cp-range'), r = rg && rg.getBoundingClientRect(); // not over the dark range stage (higgsfield's button stays off their dark sections)
      const on = past && contact.getBoundingClientRect().top > innerHeight - 40 && !(r && r.top < innerHeight - 80 && r.bottom > 80);
      flo.classList.toggle('is-on', on); btn.tabIndex = on ? 0 : -1;
    };
    addEventListener('scroll', place, { passive: true }); addEventListener('resize', place); place();
  }
})();
