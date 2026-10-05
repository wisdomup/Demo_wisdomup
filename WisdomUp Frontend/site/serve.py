"""Local dev server for the WisdomUp static site — static files with caching disabled, plus the same
/api/orders handler that runs on Vercel (orders are saved to .data/orders/ locally).

Run from anywhere:  python3 site/serve.py   →  http://127.0.0.1:8765/site/index.html
Admin (local):      http://127.0.0.1:8765/site/admin.html  ·  key: local-admin
"""
import functools
import http.server
import importlib.util
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # serve the project folder (site/ lives inside it)
PORT = 8765

_spec = importlib.util.spec_from_file_location('wu_orders', os.path.join(ROOT, 'api', 'orders.py'))
orders = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(orders)


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
        if not self._api('GET'):
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
