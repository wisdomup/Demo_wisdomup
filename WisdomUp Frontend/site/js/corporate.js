// WisdomUp — the corporate page (corporate.html, 2026-10-14: higgsfield.ai/enterprise's layout rebuilt in our design; see the note in
// corporate.css). Facts only: the counts and every product, photo and price come from catalog.js (+ the shop.js sale through wu-data);
// the quote form and the FAQ are the shared ones in info.js.
(function () {
  const { D, $, esc, url, photoBg, photoFit, DEPTS } = WU;
  if (!$('cp-perks')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

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
