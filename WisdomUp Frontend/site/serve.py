"""Local dev server for the WisdomUp static site — same as `python3 -m http.server`, but with caching
disabled so every edit shows up on a normal refresh.

Run from anywhere:  python3 site/serve.py   →  http://127.0.0.1:8765/site/index.html
"""
import functools
import http.server
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # serve the project folder (site/ lives inside it)
PORT = 8765


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()


if __name__ == "__main__":
    handler = functools.partial(NoCacheHandler, directory=ROOT)
    with http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler) as httpd:
        print(f"Serving {ROOT} at http://127.0.0.1:{PORT}/site/index.html")
        httpd.serve_forever()
