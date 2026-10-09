#!/usr/bin/env python3
"""WisdomUp pre-render — run from the project folder:  python3 tools/build_pages.py

Why: every product, category, department, blog post (and the home, All Products and blog pages) is drawn by
JavaScript. Google runs scripts late and not always; Bing, WhatsApp, Facebook and most other crawlers never do.
Before this build, all 301 product addresses sent the same empty page ("WisdomUp Product", no H1, no canonical)
and every category sent All Products' title with a canonical pointing at /products.html.

What it does: loads each page from the local server in headless Chrome, lets our own scripts build it, and saves
the finished result as plain HTML in site/_pre/ — the real <title>, description, canonical, Open Graph tags and
structured data in the head, and the real content (H1, price, specs, product lists, FAQ, nav and footer links)
in the body. The same scripts still run on top in the browser, so visitors see no difference.
vercel.json (and site/serve.py locally) send each address to its pre-rendered file, so URLs never change:
  product.html?id=X      → site/_pre/p/X.html          products.html?cat=T   → site/_pre/c/T.html
  products.html?dept=D   → site/_pre/d/D.html          products.html?filter=F → site/_pre/f/F.html
  article.html?p=S       → site/_pre/a/S.html          products.html, blog.html, / → site/_pre/….html

It also copies site/404.html to the project root as 404.html (Vercel's "page not found" page).
Needs: the local server running (python3 site/serve.py) and Google Chrome.
Re-run after changing the catalogue, page templates, page scripts or SEO copy — the pages it saves are a snapshot.
"""
import concurrent.futures as cf
import json
import os
import re
import select
import shutil
import signal
import subprocess
import sys
import tempfile
import time
import urllib.request
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'site')
PRE = os.path.join(SITE, '_pre')
SERVER = 'http://127.0.0.1:8765/site/'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
START, END = '<!-- SEO:start (written by tools/build_seo.py — edit that file, not this block) -->', '<!-- SEO:end -->'
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}


def read_js_json(path):
    text = open(os.path.join(ROOT, path), encoding='utf-8').read()
    text = re.sub(r'^.*?window\.\w+\s*=\s*', '', text, count=1, flags=re.S).rstrip().rstrip(';')
    return json.loads(text)


def targets():
    cat = read_js_json('site/js/catalog.js')
    posts = re.findall(r"slug:\s*'([^']+)'", open(os.path.join(SITE, 'js', 'posts.js'), encoding='utf-8').read())
    live_types = []
    for d in cat['departments']:
        for t in d['types']:
            if t not in live_types and any(p['type'] == t for p in cat['products']):
                live_types.append(t)
    out = [('index.html', '', 'index.html'), ('products.html', '', 'products.html'), ('blog.html', '', 'blog.html')]
    out += [('products.html', f'filter={f}', f'f/{f}.html') for f in ('new', 'best')]
    out += [('products.html', f'dept={d["id"]}', f'd/{d["id"]}.html') for d in cat['departments']]
    out += [('products.html', f'cat={t}', f'c/{t}.html') for t in live_types]
    out += [('article.html', f'p={s}', f'a/{s}.html') for s in posts]
    out += [('product.html', f'id={p["id"]}', f'p/{p["id"]}.html') for p in cat['products']]
    return out


class TopLevel(HTMLParser):
    """Finds the top-level elements of an HTML fragment (start/end offsets, tag, attributes)."""
    def __init__(self, src):
        super().__init__(convert_charrefs=False)
        self.src, self.depth, self.nodes, self.cur = src, 0, [], None
        self.lines = [0] + [m.end() for m in re.finditer('\n', src)]
        self.feed(src)
        self.close()

    def _off(self):
        line, col = self.getpos()
        return self.lines[line - 1] + col

    def handle_starttag(self, tag, attrs):
        if self.depth == 0:
            start = self._off()
            if tag in VOID:
                self.nodes.append((start, self.src.index('>', start) + 1, tag, dict(attrs)))
                return
            self.cur = (start, tag, dict(attrs))
        if tag not in VOID:
            self.depth += 1

    def handle_startendtag(self, tag, attrs):
        if self.depth == 0:
            start = self._off()
            self.nodes.append((start, self.src.index('>', start) + 1, tag, dict(attrs)))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        self.depth -= 1
        if self.depth == 0 and self.cur:
            end = self.src.index('>', self._off()) + 1
            self.nodes.append((self.cur[0], end, self.cur[1], self.cur[2]))
            self.cur = None


def sig(tag, attrs):
    return (tag, attrs.get('id') or '', (attrs.get('class') or '').split(' ')[0])


def body_inner(doc):
    m = re.search(r'<body[^>]*>(.*)</body>', doc, re.S)
    return m.group(1) if m else ''


def render(page, query, tmp):
    """Headless Chrome dump of the page as built by its own scripts (reduced motion, so no reveal/edge-light state).
    Every page gets a FRESH profile folder: Chrome refuses a profile another Chrome (or a killed Chrome's helper processes)
    still holds, which once made every 4th page fail. Chrome runs in its own process group so the whole family is stopped."""
    url = SERVER + page + '?' + '&'.join(filter(None, [query, '__raw=1']))
    work = tempfile.mkdtemp(prefix='prof-', dir=tmp)
    cmd = [CHROME, '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
           '--disable-component-update', '--disable-background-networking', '--disable-sync', '--mute-audio', '--no-pings',
           '--disk-cache-size=1', '--media-cache-size=1', '--disable-gpu-shader-disk-cache', '--disable-breakpad',
           '--disable-features=OptimizationHints,OptimizationGuideModelDownloading,MediaRouter,Translate',
           '--force-prefers-reduced-motion', '--window-size=1280,900', '--virtual-time-budget=6000',
           f'--user-data-dir={work}', '--dump-dom', url]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, start_new_session=True)
    buf, deadline = b'', time.time() + 60
    try:
        while time.time() < deadline:
            r, _, _ = select.select([proc.stdout], [], [], 1)
            if r:
                chunk = os.read(proc.stdout.fileno(), 1 << 16)
                if not chunk:
                    break
                buf += chunk
                if b'</html>' in buf:
                    break
    finally:
        try:
            os.killpg(proc.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
        proc.wait()
        shutil.rmtree(work, ignore_errors=True)
    out = buf.decode('utf-8', 'replace')
    if '</html>' not in out:
        raise RuntimeError(f'no page from Chrome for {page}?{query}')
    return out


SEO_TAG = re.compile(
    r'<title>.*?</title>|<meta (?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+|product:[^"]+)"[^>]*>'
    r'|<link rel="canonical"[^>]*>|<script type="application/ld\+json"[^>]*>.*?</script>', re.S)

# Looping carousels draw 3 copies of their slides so they can glide forever; the 2 hidden copies (aria-hidden) are left out of
# the snapshot (2026-10-08, after a review counted the home slides "3 times"): crawlers then read each slide once, the page is
# lighter, and the page scripts draw the copies again on load (they render these tracks with innerHTML).
CLONE_CLASSES = ('loop__slide', 'news__card', 'promo-band__item', 'feat__slide', 'bban__card')
CLONE_OPEN = re.compile(r'<(article|div|a)\b[^>]*\bclass="(?:%s)\b[^"]*"[^>]*\baria-hidden="true"[^>]*>' % '|'.join(CLONE_CLASSES))


def strip_clones(html):
    out, pos = [], 0
    while True:
        m = CLONE_OPEN.search(html, pos)
        if not m:
            break
        tag, depth, i = m.group(1), 1, m.end()
        tok = re.compile(r'<(/?)%s\b[^>]*>' % tag)
        while depth:
            t = tok.search(html, i)
            if not t:  # unbalanced markup: keep everything as it is
                return html
            depth += -1 if t.group(1) else (0 if t.group(0).endswith('/>') else 1)
            i = t.end()
        out.append(html[pos:m.start()])
        pos = i
    out.append(html[pos:])
    # the tracks' saved scroll position assumed 3 copies: drop it, so the one copy left shows from its first slide until the
    # scripts take over
    return re.sub(r'(<div class="[a-z-]+__track"[^>]*?) style="[^"]*transform[^"]*"', r'\1', ''.join(out))


def build_one(t, tmp):
    page, query, out_rel = t
    template = open(os.path.join(SITE, page), encoding='utf-8').read()
    for attempt in range(3):  # Chrome now and then returns nothing when the machine is busy — try again
        try:
            dump = render(page, query, tmp)
            break
        except RuntimeError:
            if attempt == 2:
                raise
            time.sleep(1 + attempt)
    head = dump.split('</head>', 1)[0]
    if not re.search(re.escape(START) + '.*?' + re.escape(END), template, re.S):
        raise RuntimeError(f'{page}: no SEO block in the template (run tools/build_seo.py)')
    # the tags as the page's scripts left them, minus any the template already carries outside its SEO block (index.html's
    # hand-written Organization/FAQ graph) — those stay where they are
    squash = lambda s: re.sub(r'\s+', '', s)
    rest = squash(re.sub(re.escape(START) + r'.*?' + re.escape(END), '', template, flags=re.S).split('</head>', 1)[0])
    tags = [t for t in SEO_TAG.findall(head) if squash(t) not in rest]
    seo = [START, '<link rel="preconnect" href="https://fonts.googleapis.com">', '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'] + tags + [END]
    out = re.sub(re.escape(START) + r'.*?' + re.escape(END), lambda m: '\n'.join(seo), template, count=1, flags=re.S)
    # body: the rendered content, minus what scripts add at the top level (drawers, menu, search, cookie popup, back-to-top)
    keep = {sig(n[2], n[3]) for n in TopLevel(body_inner(template)).nodes}
    body = body_inner(dump)
    for start, end, tag, attrs in reversed(TopLevel(body).nodes):
        if sig(tag, attrs) not in keep:
            body = body[:start] + body[end:]
    # the site nav is drawn per screen width (desktop pill vs phone bar, with inline sizes): keep the template's empty header
    # so a phone never flashes the desktop nav before the scripts run (the footer carries the same category links)
    nav = re.compile(r'<header[^>]*id="site-nav"[^>]*>.*?</header>', re.S)
    tnav = nav.search(template)
    if tnav:
        body = nav.sub(lambda m: tnav.group(0), body, count=1)
    # the footer's bottom margin is measured on load (fitGap) and differs by a pixel or two between runs — the scripts set it
    # again anyway, so leave it out and a rebuild without real changes leaves the files untouched
    body = re.sub(r'(<div class="footer-wrap[^"]*" id="footer") style="[^"]*"', r'\1', body)
    body = strip_clones(body)
    body = re.sub(r'\n{3,}', '\n\n', body)
    out = re.sub(r'(<body[^>]*>).*(</body>)', lambda m: m.group(1) + body + m.group(2), out, count=1, flags=re.S)
    out = out.replace('<!-- pre-rendered', '<!-- (old) pre-rendered')
    out = out.replace('<head>', '<head>\n<!-- pre-rendered by tools/build_pages.py: edit the template / scripts and re-run it, not this file -->', 1)
    path = os.path.join(PRE, out_rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w', encoding='utf-8').write(out)
    h1 = re.findall(r'<h1[\s>]', body)
    title = re.search(r'<title>(.*?)</title>', out, re.S)
    canon = re.search(r'<link rel="canonical" href="([^"]+)"', out)
    return out_rel, len(h1), title.group(1) if title else '', canon.group(1) if canon else '', len(out)


def write_404():
    """Vercel answers any missing address with /404.html from the project root. It can be shown at any depth, so the copy gets
    <base href="/"> — its styles, scripts and links then start at the site root, which vercel.json maps to site/."""
    src = open(os.path.join(SITE, '404.html'), encoding='utf-8').read()
    out = src.replace('<meta charset="utf-8">\n', '<meta charset="utf-8">\n<base href="/">\n<!-- copied from site/404.html by tools/build_pages.py: edit that file and re-run -->\n', 1)
    open(os.path.join(ROOT, '404.html'), 'w', encoding='utf-8').write(out)


def main():
    write_404()
    if not os.path.exists(CHROME):
        sys.exit('Google Chrome not found at ' + CHROME)
    try:
        urllib.request.urlopen(SERVER + 'index.html', timeout=5)
    except Exception:
        sys.exit('Start the local server first:  python3 site/serve.py')
    todo = targets()
    only = sys.argv[1:]  # optional: build only addresses containing these words, e.g.  python3 tools/build_pages.py id=ts-11anc
    if only:
        todo = [t for t in todo if any(o in (t[0] + '?' + t[1]) for o in only)]
    tmp = tempfile.mkdtemp(prefix='wu-pre-')
    workers = min(4, len(todo)) or 1
    results, problems = [], []
    print(f'Pre-rendering {len(todo)} pages with {workers} Chrome workers…')
    t0 = time.time()
    with cf.ThreadPoolExecutor(workers) as ex:
        futs = {ex.submit(build_one, t, tmp): t for t in todo}
        for f in cf.as_completed(futs):
            t = futs[f]
            try:
                r = f.result()
                results.append(r)
                if r[1] != 1:
                    problems.append(f'{r[0]}: {r[1]} H1 headings')
                if not r[3] and not r[0].startswith('index'):
                    problems.append(f'{r[0]}: no canonical link')
            except Exception as e:  # noqa: BLE001 — report and carry on
                problems.append(f'{t[2]}: {e}')
            if len(results) % 25 == 0:
                print(f'  {len(results)}/{len(todo)}…')
    shutil.rmtree(tmp, ignore_errors=True)
    if not only:  # remove pre-renders of pages that no longer exist
        wanted = {os.path.join(PRE, t[2]) for t in todo}
        for dirpath, _, files in os.walk(PRE):
            for fn in files:
                fp = os.path.join(dirpath, fn)
                if fp not in wanted:
                    os.remove(fp)
    size = sum(r[4] for r in results)
    print(f'Done: {len(results)} pages in {time.time() - t0:.0f}s, {size / 1e6:.1f} MB in site/_pre/')
    # CSS/JS version stamps on every page, the snapshots included (tools/build_assets.py; vercel.json caches stamped files for a year)
    import importlib.util
    spec = importlib.util.spec_from_file_location('build_assets', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'build_assets.py'))
    ba = importlib.util.module_from_spec(spec); spec.loader.exec_module(ba); ba.main()
    for p in problems:
        print('  ! ' + p)
    if problems:
        sys.exit(1)


if __name__ == '__main__':
    main()
