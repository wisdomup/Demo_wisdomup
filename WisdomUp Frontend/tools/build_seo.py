#!/usr/bin/env python3
"""WisdomUp SEO build — run from the project folder:  python3 tools/build_seo.py

What it does (safe to re-run any time; it only rewrites its own block in each page):
  1. Writes the search / social tags into the <head> of every page in site/ between
     <!-- SEO:start --> and <!-- SEO:end -->: title, description, robots, canonical link,
     Open Graph + Twitter preview tags and structured data (JSON-LD).
  2. Writes site/sitemap.xml — every page, department, category, product and blog post.
  3. Writes site/robots.txt.

The live address comes from "siteUrl" in site/js/shop.js. Change it there and re-run this script.
Pages built from the catalogue (a category, a product, a blog post) refine their own tags in the
browser with WU.seo() (site/js/common.js); the copy for categories lives in site/js/seo-content.js.

Rules: titles ~60 characters, descriptions ~155, one H1 per page, facts only (no ratings, discounts
or claims the catalogue cannot back up). Keyword choices are explained in SEO-REPORT.md.
"""
import datetime
import html
import hashlib
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'site')
YEAR = datetime.date.today().year
TODAY = datetime.date.today().isoformat()


def read_js_json(path):
    """site/js/*.js data files are `window.X = {json};`"""
    text = open(os.path.join(ROOT, path), encoding='utf-8').read()
    text = re.sub(r'^.*?window\.\w+\s*=\s*', '', text, count=1, flags=re.S).rstrip().rstrip(';')
    return json.loads(text)


SHOP = read_js_json('site/js/shop.js')
CATALOG = read_js_json('site/js/catalog.js')
BASE = SHOP.get('siteUrl', '').rstrip('/') + '/'
if not BASE.startswith('http'):
    sys.exit('Set "siteUrl" in site/js/shop.js first, e.g. "https://wisdomup.pk/".')

# ---------------------------------------------------------------------------------------------
# One entry per page: path on the live site ('' = home), title, description, breadcrumb name.
# index=False keeps private / per-visitor pages out of Google. dynamic=True means the page fills
# in its own canonical in the browser (it shows a different product / post per address).
# ---------------------------------------------------------------------------------------------
PAGES = {
    'index.html': dict(path='', crumb='Home',
        title='WisdomUp Pakistan — Earbuds, Power Banks, Chargers & Speakers',
        desc='Shop WisdomUp wireless earbuds, power banks, fast chargers, cables, handsfree and Bluetooth speakers in Pakistan. Cash on Delivery, 7-day returns, warranty.'),
    'products.html': dict(path='products.html', crumb='All Products', own_ld=True,
        title=f'Mobile Accessories Online in Pakistan — Prices {YEAR} | WisdomUp',
        desc='Shop every WisdomUp product in Pakistan: earbuds, neckbands, handsfree, headphones, speakers, chargers, power banks, cables and car holders. Cash on Delivery.'),
    'product.html': dict(path='product.html', crumb='Product', dynamic=True,
        title='WisdomUp Product — Price in Pakistan | WisdomUp',
        desc='WisdomUp product price in Pakistan, full specifications, warranty and delivery. Cash on Delivery nationwide with a 7-day money-back guarantee.'),
    'about.html': dict(path='about.html', crumb='About Us',
        title='About WisdomUp — Mobile Accessories Brand in 50+ Countries',
        desc='WisdomUp makes wireless earbuds, speakers, creator mics, chargers and power banks sold in 50+ countries — now with local stock, warranty and support in Pakistan.'),
    'blog.html': dict(path='blog.html', crumb='Blog',
        title='WisdomUp Blog — Earbuds, Charging & Creator Guides',
        desc='Buying guides from WisdomUp: earbuds under Rs.5,000, which handsfree fits your phone, power bank charges, car Bluetooth, shavers vs trimmers.'),
    'article.html': dict(path='article.html', crumb='Article', dynamic=True,
        title='WisdomUp Blog — Guides & How-tos',
        desc='Guides, how-tos and buying advice from the WisdomUp team.'),
    'bulk-order.html': dict(path='bulk-order.html', crumb='Bulk Order',
        title='Mobile Accessories Wholesale in Pakistan — Bulk Prices | WisdomUp',
        desc='Become a WisdomUp distributor, wholesaler or retailer in Pakistan. Wholesale prices on earbuds, handsfree, chargers, cables and power banks, with local stock.'),
    'corporate.html': dict(path='corporate.html', crumb='Corporate Orders',
        title='Corporate Gifts in Pakistan — Branded Tech Gifts | WisdomUp',
        desc='Corporate gifts in Pakistan: WisdomUp earbuds, speakers, power banks and chargers for employees and clients, with volume pricing and custom packaging.'),
    'creators.html': dict(path='creators.html', crumb='Creators Program',
        title='Creator Affiliate Program Pakistan — Earn up to 12% | WisdomUp',
        desc='Join the WisdomUp creator affiliate program free: your own code and link, 5% off for followers and 8–12% commission paid monthly to JazzCash or EasyPaisa.'),
    'affiliate.html': dict(path='affiliate.html', crumb='Affiliate Program',
        title='Affiliate Program — Share and Earn up to 12% | WisdomUp',
        desc='Become a WisdomUp affiliate in 3 easy steps: join free, share your link or code, and earn up to 12% on every delivered order — your followers save 5%.'),
    'privacy.html': dict(path='privacy.html', crumb='Privacy Policy',
        title='Privacy Policy | WisdomUp',
        desc='How WisdomUp handles your details: what we collect when you order, enquire or review, what stays in your browser, cookies and ad tags, and your choices.'),
    'terms.html': dict(path='terms.html', crumb='Terms of Service',
        title='Terms of Service | WisdomUp',
        desc='WisdomUp terms in plain words: orders and confirmation, prices in PKR, Cash on Delivery and transfers, delivery, 7-day returns, creator codes and reviews.'),
    'help.html': dict(path='help.html', crumb='Help Center',
        title='Help Center — Delivery, Returns, Warranty & Pairing | WisdomUp',
        desc='WisdomUp support: delivery times, Cash on Delivery, returns, warranty claims, pairing earbuds and payments — plus how to reach us on phone, WhatsApp and email.'),
    'live.html': dict(path='live.html', crumb='Live Shopping',
        title='WisdomUp Live — Live Shopping Deals Every Friday 8 PM',
        desc='Watch WisdomUp earbuds, speakers and chargers demoed live every Friday at 8 PM PKT and add them to your cart mid-stream at live-only prices.'),
    'manuals.html': dict(path='manuals.html', crumb='e-Manuals',
        title='e-Manuals — How to Pair & Use WisdomUp Earbuds, Mics & Chargers',
        desc='Quick-start guides for WisdomUp earbuds, neckbands, speakers, wireless mics and chargers: how to pair, charge, reset and care for your product.'),
    'returns.html': dict(path='returns.html', crumb='Exchange & Refund Policy',
        title='7-Day Money-Back Guarantee — Exchange & Refund Policy | WisdomUp',
        desc="WisdomUp's 7-day money-back guarantee in Pakistan: how to return or exchange a product, what condition it must be in, and how refunds are paid."),
    'shipping.html': dict(path='shipping.html', crumb='Shipping Policy',
        title='Shipping & Delivery in Pakistan — Cash on Delivery | WisdomUp',
        desc='WisdomUp delivers to every city in Pakistan: standard delivery in 3–5 working days, express in 1–2, free shipping above Rs.10,000 and Cash on Delivery.'),
    'track.html': dict(path='track.html', crumb='Order Tracker',
        title='Track Your Order — WisdomUp Order Tracker',
        desc='Track your WisdomUp order with your order number and phone number, and see delivery times across Pakistan.'),
    'warranty.html': dict(path='warranty.html', crumb='Warranty Policy',
        title='Warranty Policy — WisdomUp Brand Warranty in Pakistan',
        desc="Every WisdomUp product carries at least a 6-month brand warranty, up to 2 years on premium models. See what's covered and how to make a claim in Pakistan."),
    'where-to-buy.html': dict(path='where-to-buy.html', crumb='Where to Buy',
        title='Where to Buy WisdomUp in Pakistan — Online & Retailers',
        desc='Buy WisdomUp online with nationwide delivery and Cash on Delivery, find authorised retailers in Pakistan, or become a stockist.'),
    # Private / per-visitor pages: kept out of search results
    'checkout.html': dict(path='checkout.html', crumb='Checkout', index=False, title='Checkout | WisdomUp',
        desc='Complete your WisdomUp order — Cash on Delivery, JazzCash, EasyPaisa or bank transfer, delivered across Pakistan.'),
    'order.html': dict(path='order.html', crumb='Order', index=False, title='Order Confirmed | WisdomUp', desc='Your WisdomUp order confirmation.'),
    'creator-dashboard.html': dict(path='creator-dashboard.html', crumb='Creator Dashboard', index=False, title='Creator Dashboard | WisdomUp',
        desc='Your WisdomUp creator link, visits, orders, commission and payouts.'),
    'wishlist.html': dict(path='wishlist.html', crumb='Wishlist', index=False, title='Your Wishlist | WisdomUp', desc='Products you saved on WisdomUp.'),
    'admin.html': dict(path='admin.html', crumb='Admin', index=False, nofollow=True, title='Orders · WisdomUp Admin', desc=''),
    '404.html': dict(path='404.html', crumb='Page not found', index=False, title='Page Not Found | WisdomUp',
        desc='This WisdomUp page has moved or no longer exists. Shop earbuds, chargers, power banks and more.'),
}

OG_IMAGE = 'img/og-default.jpg'
START, END = '<!-- SEO:start (written by tools/build_seo.py — edit that file, not this block) -->', '<!-- SEO:end -->'


def esc(text):
    return html.escape(text, quote=True)


def ld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + '</script>'


def head_block(name, page):
    url = BASE + page['path']
    index = page.get('index', True)
    robots = 'index, follow, max-image-preview:large' if index else ('noindex, nofollow' if page.get('nofollow') else 'noindex, follow')
    og_title = re.sub(r'\s*\|\s*WisdomUp.*$', '', page['title'])
    lines = [START, f'<title>{esc(page["title"])}</title>']
    if page['desc']:
        lines.append(f'<meta name="description" content="{esc(page["desc"])}">')
    lines.append(f'<meta name="robots" content="{robots}">')
    # Open the connection to the font servers early (the fonts are the slowest thing on a first visit)
    lines += ['<link rel="preconnect" href="https://fonts.googleapis.com">', '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>']
    if index and not page.get('dynamic'):
        lines.append(f'<link rel="canonical" href="{esc(url)}">')
    if index:
        lines += [
            '<meta property="og:site_name" content="WisdomUp">',
            '<meta property="og:locale" content="en_PK">',
            '<meta property="og:type" content="website">',
            f'<meta property="og:title" content="{esc(og_title)}">',
            f'<meta property="og:description" content="{esc(page["desc"])}">',
            f'<meta property="og:url" content="{esc(url)}">',
            f'<meta property="og:image" content="{esc(BASE + OG_IMAGE)}">',
            '<meta name="twitter:card" content="summary_large_image">',
            f'<meta name="twitter:title" content="{esc(og_title)}">',
            f'<meta name="twitter:description" content="{esc(page["desc"])}">',
            f'<meta name="twitter:image" content="{esc(BASE + OG_IMAGE)}">',
        ]
        if name == 'index.html':
            lines.append(ld({'@context': 'https://schema.org', '@type': 'WebSite', 'name': 'WisdomUp', 'alternateName': 'WisdomUp Pakistan', 'url': BASE, 'inLanguage': 'en-PK'}))
        elif not page.get('dynamic') and not page.get('own_ld'):  # own_ld: the page writes its own structured data in the browser
            lines.append(ld({'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE},
                {'@type': 'ListItem', 'position': 2, 'name': page['crumb'], 'item': url}]}))
    lines.append(END)
    return '\n'.join(lines)


def write_head(name, page):
    path = os.path.join(SITE, name)
    src = open(path, encoding='utf-8').read()
    out = re.sub(re.escape(START) + r'.*?' + re.escape(END) + r'\n?', '', src, flags=re.S)       # our previous block
    out = re.sub(r'<!-- SEO:start.*?<!-- SEO:end -->\n?', '', out, flags=re.S)                    # (older marker wording)
    out = re.sub(r'[ \t]*<title>.*?</title>\n?', '', out, count=1, flags=re.S)                    # hand-written tags it replaces
    out = re.sub(r'[ \t]*<meta name="description"[^>]*>\n?', '', out)
    out = re.sub(r'[ \t]*<meta name="robots"[^>]*>\n?', '', out)
    anchor = re.search(r'<meta name="viewport"[^>]*>\n', out)
    if not anchor:
        sys.exit(f'{name}: no <meta name="viewport"> to anchor the SEO block to')
    out = out[:anchor.end()] + head_block(name, page) + '\n' + out[anchor.end():]
    if out != src:
        open(path, 'w', encoding='utf-8').write(out)
    return out != src


def sitemap():
    # each post: slug, publish date (iso, if set) and its products (the first one's photo goes in the sitemap)
    posts = [(m.group(1), (re.search(r"iso:\s*'([^']+)'", m.group(2)) or [None, None])[1], re.findall(r"'([a-z0-9-]+)'", (re.search(r'products:\s*\[([^\]]*)\]', m.group(2)) or [None, ''])[1]))
             for m in re.finditer(r"slug:\s*'([^']+)'(.*?)body:", open(os.path.join(SITE, 'js', 'posts.js'), encoding='utf-8').read(), re.S)]
    types_live = {p['type'] for p in CATALOG['products']}
    urls = [('', '1.0', 'daily'), ('products.html', '0.9', 'daily'), ('products.html?filter=new', '0.8', 'daily'), ('products.html?filter=best', '0.8', 'weekly')]
    urls += [(f'products.html?dept={d["id"]}', '0.8', 'daily') for d in CATALOG['departments']]
    seen = []
    for d in CATALOG['departments']:
        for t in d['types']:
            if t in types_live and t not in seen:
                seen.append(t)
    # REAL lastmod dates (2026-10-10, from the audit "nearly all show the build date"): a product's date moves only when its own data
    # changes (title, price, specs, photo …), a category's when its products or prices change — fingerprints kept in
    # tools/seo_lastmod.json; static pages use the date their file last changed; posts their own date.
    fp_path = os.path.join(ROOT, 'tools', 'seo_lastmod.json')
    try:
        fps = json.load(open(fp_path, encoding='utf-8'))
    except (FileNotFoundError, ValueError):
        fps = {}
    def dated(key, data):
        h = hashlib.md5(json.dumps(data, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:12]
        old = fps.get(key)
        if not old or old[0] != h:
            fps[key] = [h, TODAY]
        return fps[key][1]
    def file_date(name):
        return datetime.date.fromtimestamp(os.path.getmtime(os.path.join(SITE, name))).isoformat()
    by_type = {}
    for p in CATALOG['products']:
        by_type.setdefault(p['type'], []).append([p['id'], p.get('price'), p.get('was'), p.get('soldOut')])
    urls += [(f'products.html?cat={t}', '0.8', 'daily', [], dated('c:' + t, by_type.get(t, []))) for t in seen]
    urls += [(f'product.html?id={p["id"]}', '0.7', 'weekly', [p['src']] if p.get('src') else [], dated('p:' + p['id'], {k: v for k, v in p.items() if k not in ('bg', 'ar')})) for p in CATALOG['products']]
    urls += [(p['path'], '0.5', 'monthly', [], file_date(n)) for n, p in PAGES.items() if p.get('index', True) and not p.get('dynamic') and n not in ('index.html', 'products.html')]
    json.dump(fps, open(fp_path, 'w', encoding='utf-8'), indent=0, sort_keys=True)
    src = {p['id']: p.get('src') for p in CATALOG['products']}
    for slug, iso, prods in posts:
        urls.append((f'article.html?p={slug}', '0.6', 'monthly', [src[i] for i in prods if src.get(i)][:1], iso))
    lastmod = CATALOG.get('generated', TODAY)

    def entry(u):
        u, pr, freq, imgs, mod = (tuple(u) + ((), None))[:5]
        pics = ''.join(f'<image:image><image:loc>{esc(BASE + i)}</image:loc></image:image>' for i in imgs)
        return f'  <url><loc>{esc(BASE + u)}</loc><lastmod>{mod or lastmod}</lastmod><changefreq>{freq}</changefreq><priority>{pr}</priority>{pics}</url>\n'
    body = ''.join(entry(u) for u in urls)
    open(os.path.join(SITE, 'sitemap.xml'), 'w', encoding='utf-8').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' + body + '</urlset>\n')
    return len(urls)


def robots():
    text = f"""# WisdomUp — written by tools/build_seo.py
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin.html
# Sorted / faceted copies of category pages (their canonical is the plain category address)
Disallow: /*sort=
Disallow: /*price=
Disallow: /*conn=
Disallow: /*feat=
# Browser-drawn copies of pre-built pages (tools/build_pages.py) — same content, same canonical
Disallow: /*__raw=

Sitemap: {BASE}sitemap.xml
"""
    open(os.path.join(SITE, 'robots.txt'), 'w', encoding='utf-8').write(text)


def main():
    missing = [n for n in sorted(os.listdir(SITE)) if n.endswith('.html') and n not in PAGES]
    if missing:
        sys.exit('Add these pages to PAGES in tools/build_seo.py: ' + ', '.join(missing))
    changed = [n for n, p in PAGES.items() if write_head(n, p)]
    n_urls = sitemap()
    robots()
    print(f'Live address: {BASE}')
    print(f'Head tags: {len(PAGES)} pages checked, {len(changed)} updated' + (': ' + ', '.join(changed) if changed else ''))
    print(f'sitemap.xml: {n_urls} addresses · robots.txt written')
    for n, p in PAGES.items():
        if p.get('index', True):
            if len(p['title']) > 65:
                print(f'  note: {n} title is {len(p["title"])} characters (Google shows ~60)')
            if len(p['desc']) > 165:
                print(f'  note: {n} description is {len(p["desc"])} characters (Google shows ~155)')


if __name__ == '__main__':
    main()
