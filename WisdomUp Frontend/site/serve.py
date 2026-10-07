"""Local dev server for the WisdomUp static site — static files with caching disabled, plus the same
/api/orders handler that runs on Vercel (orders are saved to .data/orders/ locally).

Run from anywhere:  python3 site/serve.py   →  http://127.0.0.1:8765/site/index.html
Admin (local):      http://127.0.0.1:8765/site/admin.html  ·  key: local-admin
"""
import functools
import http.server
import importlib.util
import os
import re
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # serve the project folder (site/ lives inside it)
PORT = 8765

_spec = importlib.util.spec_from_file_location('wu_orders', os.path.join(ROOT, 'api', 'orders.py'))
orders = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(orders)


# PRE-RENDERED PAGES (tools/build_pages.py writes them to site/_pre/): the same routing vercel.json does on the live site, so
# what you see locally is what Google gets — product.html?id=x → _pre/p/x.html, products.html?cat= / ?dept= / ?filter= →
# _pre/c|d|f/…, article.html?p= → _pre/a/…, plus products.html, blog.html and the home page. `__raw=1` (used by the build)
# serves the plain template instead. A missing pre-render falls back to the template here (Vercel answers 404 instead).
PRE_RULES = [('product.html', 'id', 'p'), ('products.html', 'cat', 'c'), ('products.html', 'dept', 'd'), ('products.html', 'filter', 'f'), ('article.html', 'p', 'a')]
PRE_PLAIN = {'products.html': 'products.html', 'blog.html': 'blog.html', 'index.html': 'index.html', '': 'index.html'}


def pre_target(path, query):
    m = re.fullmatch(r'/site/([a-z0-9-]*\.html)?', path)
    if not m:
        return None
    page, q = m.group(1) or '', urllib.parse.parse_qs(query)
    if '__raw' in q:
        return None
    for name, key, folder in PRE_RULES:
        v = (q.get(key) or [''])[0]
        if page == name and re.fullmatch(r'[a-z0-9-]+', v):
            f = f'site/_pre/{folder}/{v}.html'
            return '/' + f if os.path.isfile(os.path.join(ROOT, f)) else None
    if page in PRE_PLAIN and os.path.isfile(os.path.join(ROOT, 'site/_pre', PRE_PLAIN[page])):
        return '/site/_pre/' + PRE_PLAIN[page]
    return None


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    def _api(self, method):
        path, _, query = self.path.partition('?')
        if path.rstrip('/') != '/api/orders':
            return False
        n = int(self.headers.get('Content-Length') or 0)
        status, payload = orders.handle(method, query, self.headers, self.rfile.read(n) if n else b'')
        out = orders.json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(out)))
        self.end_headers()
        self.wfile.write(out)
        return True

    def do_GET(self):
        if self._api('GET'):
            return
        path, _, query = self.path.partition('?')
        pre = pre_target(path, query)
        if pre:
            self.path = pre
        super().do_GET()

    def do_POST(self):
        if not self._api('POST'):
            self.send_error(404)

    def do_PATCH(self):
        if not self._api('PATCH'):
            self.send_error(404)


if __name__ == "__main__":
    handler = functools.partial(NoCacheHandler, directory=ROOT)
    with http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler) as httpd:
        print(f"Serving {ROOT} at http://127.0.0.1:{PORT}/site/index.html (orders API at /api/orders)")
        httpd.serve_forever()
