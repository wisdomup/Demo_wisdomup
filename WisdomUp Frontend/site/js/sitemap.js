// WisdomUp — Sitemap page (2026-10-17, "sitemap fix that too"): the footer's Sitemap link opened the raw sitemap.xml, which is for
// search engines. This page lists the site for people, drawn from the live catalogue (departments → product types with their
// counts), posts.js (the guides) and the site's own pages, so a new type, department or post appears here by itself.
(function () {
  const { D, $, esc, url, DEPTS, CATS, typeLabel } = WU;
  const box = $('smap');
  if (!box) return;
  // MOMAX LAYOUT (2026-10-17, "adjust the layout on sitemap as momax.net" — momax.net/pages/site-map measured at 1440): a plain
  // page — the big title, then "Products" over a three-column bulleted grid, then a big "Shop by" heading over three columns of
  // small-headed lists, then a last row of three such lists (theirs Collections · About · Support)
  const count = t => D.products.filter(p => p.type === t).length;
  const list = (links, cls = '') => `<ul class="smap__list ${cls}">${links.map(([t, h, n]) => `<li><a href="${h}">${esc(t)}</a>${n ? ` <small>(${n})</small>` : ''}</li>`).join('')}</ul>`;
  const group = (title, links) => `<section class="smap__group"><h3>${esc(title)}</h3>${list(links)}</section>`;
  const live = DEPTS.filter(d => d.types.some(t => CATS.includes(t)));

  const products = `<section class="smap__block"><h3 class="smap__sub">Products</h3>${list(live.map(d => [d.label, url.dept(d.id)]).concat([['All products »', url.products]]), 'smap__list--grid')}</section>`;
  const shopBy = `<section class="smap__block"><h2 class="smap__h">Shop by</h2><div class="smap__cols">${
    group('Trending', [['New arrivals', url.filter('new')], ['Best sellers', url.filter('best')], ['Under Rs.1,000', url.products + '?price=u1'], ['Under Rs.2,000', url.products + '?price=u2'], ['Under Rs.5,000', url.products + '?price=u5']])
  }${live.map(d => group(d.label, d.types.filter(t => CATS.includes(t)).map(t => [typeLabel(t), url.cat(t), count(t)]))).join('')}</div></section>`;
  const posts = (window.WU_POSTS || []);
  const last = `<section class="smap__block"><div class="smap__cols">${
    group('Programs', [['Bulk orders', url.bulk], ['Corporate gifts', url.corporate], ['Creators Program', url.creators], ['Affiliate Program', url.affiliate], ['Creator dashboard', 'creator-dashboard.html'], ['Live Shopping', url.live], ['Where to buy', url.where]])
  }${group('About', [['About us', url.about], ['Blog', url.blog]].concat(posts.map(p => [p.seoTitle || p.title, url.article(p.slug)])))
  }${group('Support', [['Help Center', url.help], ['Track your order', url.track], ['Shipping', url.shipping], ['Returns & refunds', url.returns], ['Warranty', url.warranty], ['e-Manuals', url.manuals], ['Terms of Service', url.terms], ['Privacy Policy', url.privacy], ['Cookie preferences', '#cookie-preferences']])
  }</div></section>`;

  box.innerHTML = products + shopBy + last;
  box.addEventListener('click', e => {
    const ck = e.target.closest('a[href="#cookie-preferences"]');
    if (ck && WU.consent) { e.preventDefault(); WU.consent.open('manage'); }
  });
  WU.seo({
    title: 'Sitemap | WisdomUp', path: 'sitemap.html',
    description: `Every WisdomUp page in one place: ${D.products.length} products across ${DEPTS.length} departments, buying guides, help and policies.`,
  });
})();
