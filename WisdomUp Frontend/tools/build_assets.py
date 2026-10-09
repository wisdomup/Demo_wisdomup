# -*- coding: utf-8 -*-
"""Version stamps for CSS and JS (2026-10-10, from the audit: "CSS, JS and images are served with max-age=0, so repeat visitors
re-check every file on each visit").

Every <link href="css/….css"> and <script src="js/….js"> in site/*.html, the pre-rendered pages (site/_pre/**) and the root
404.html gets ?v=<first 8 hex of the file's md5>. vercel.json caches /css/* and /js/* for a year ONLY when ?v= is present, so a
changed file gets a new address the moment this script runs and nobody keeps an old copy.

RUN IT before every push (tools/build_pages.py also runs it at the end). `python3 tools/build_assets.py --check` exits 1 when
any page still points at an old version — the push procedure runs that check.
"""
import glob
import hashlib
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'site')
REF = re.compile(r'(?P<attr>href|src)="(?P<path>(?:css|js)/[^"?#]+\.(?:css|js))(?:\?v=[0-9a-f]+)?"')


def stamp(path, cache={}):
    if path not in cache:
        full = os.path.join(SITE, path)
        cache[path] = hashlib.md5(open(full, 'rb').read()).hexdigest()[:8] if os.path.exists(full) else None
    return cache[path]


def pages():
    yield from sorted(glob.glob(os.path.join(SITE, '*.html')))
    yield from sorted(glob.glob(os.path.join(SITE, '_pre', '**', '*.html'), recursive=True))
    root404 = os.path.join(ROOT, '404.html')
    if os.path.exists(root404):
        yield root404


def main(check=False):
    changed, stale, missing = 0, [], set()
    for f in pages():
        s = io.open(f, encoding='utf-8').read()

        def sub(m):
            v = stamp(m.group('path'))
            if not v:
                missing.add(m.group('path'))
                return m.group(0)
            return f'{m.group("attr")}="{m.group("path")}?v={v}"'
        out = REF.sub(sub, s)
        if out != s:
            if check:
                stale.append(os.path.relpath(f, ROOT))
            else:
                io.open(f, 'w', encoding='utf-8').write(out)
                changed += 1
    if missing:
        print('referenced but missing:', ', '.join(sorted(missing)))
    if check:
        if stale:
            print(f'{len(stale)} page(s) point at old CSS/JS versions — run python3 tools/build_assets.py', *stale[:8], sep='\n  ')
            sys.exit(1)
        print('CSS/JS versions are current.')
    else:
        print(f'Version stamps: {changed} page(s) updated.')


if __name__ == '__main__':
    main(check='--check' in sys.argv)
