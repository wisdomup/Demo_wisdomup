"""Tighten the design system to higgsfield.ai's scale (2026-10-16, "match the spacing, text font sizes and corners … same as
higgsfield.ai … use minimum variations of things, the website is a mess").

Measured on higgsfield.ai (home, 2026-10-16): text 12/16, 14/20, 16/24 (Inter) and headings 24/28, 28/32, 44/46 (Space Grotesk 700);
corners 6–8px on small parts, 12px on cards and media, 16px on large cards, capsules on chips; gaps 4 / 8 / 12 / 20 / 32; sections
64px apart (40px on phones). The audit of 2026-10-14 found 45 text sizes, 14 card corners and every gap in between on our site.

This script rewrites the stylesheets in site/css so every value lands on ONE scale:
  font sizes   → 12 14 16 20 24 28 44 (sizes above 52px are display numbers and stay); a clamp() keeps its vw but its ends snap
  corners      → 8 12 16 24 (≤4px and capsules / circles stay)
  gaps         → 4 8 12 16 20 24 32 40 48 64
  padding      → 4 8 12 16 20 24 32 40 48 64 (0–3px stays)
Heights, widths, line heights, borders and custom properties (--chip-pad …) are NOT touched, so control sizes keep their rules.

usage:  python3 tools/tighten.py          (dry run: what would change, per value)
        python3 tools/tighten.py --write  (rewrite the files)
"""
import os
import re
import sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS = os.path.join(ROOT, 'site', 'css')
FILES = ['home.css', 'pages.css', 'info.css', 'controls.css', 'night.css', 'night-home.css', 'creators.css', 'affiliate.css',
         'corporate.css', 'ds/styles/components.css', 'ds/tokens/spacing.css', 'ds/tokens/typography.css']

# COMPACT scale (2026-10-16, second pass — "decrease the number of variations, match the higgsfield spacing and corners … compact"):
# higgsfield's own steps and nothing between them. H3-size text (18–21px) drops to 16 like their 16px/700 H3s.
FONT = [12, 14, 16, 24, 28, 44]
RAD = [8, 12, 16]
GAP = [4, 8, 12, 16, 24, 32, 48]


def near(v, scale):
    return min(scale, key=lambda s: (abs(s - v), -s))


def snap_font(v):
    if v > 52:
        return v                      # display numbers (hero counts, big stats)
    if v <= 13:
        return 12 if v < 13 else 14   # 9–12 → 12, 13 → 14
    if v <= 21:
        return 14 if v < 15 else 16   # 14 → 14, 15–21 → 16 (higgsfield's H3s are 14 / 16)
    return near(v, FONT)


def snap_rad(v):
    if v <= 4 or v >= 60:
        return v                      # hairline corners, capsules (999px …)
    return 16 if v >= 14 else near(v, RAD)   # everything big is 16 — higgsfield's largest card corner


def snap_gap(v):
    if v < 4 or v > 64:
        return v                      # hairline nudges, and the big offsets that clear the nav / place hero copy
    return min(GAP, key=lambda s: (abs(s - v), s))   # ties round DOWN (20 → 16, 40 → 32, 56 → 48): compact


PX = re.compile(r'(?<![\w.-])(\d+(?:\.\d+)?)px')
stats = {k: Counter() for k in ('font', 'radius', 'gap', 'padding')}


CLAMP = re.compile(r'clamp\(\s*(\d+(?:\.\d+)?)px\s*,\s*(\d+(?:\.\d+)?)vw\s*,\s*(\d+(?:\.\d+)?)px\s*\)')


def settle_clamps(text, kind):
    """A scaling size clamp(min, Xvw, max) reaches its (snapped) max by 1024px wide, so every desktop shows the exact scale step
    and only tablets sit in between."""
    def r(m):
        lo, hi = float(m.group(1)), float(m.group(3))
        vw = round(hi / 1024 * 100, 2)
        if abs(vw - float(m.group(2))) > .01:
            stats[kind][f'clamp→{hi:g}@1024'] += 1
        return f'clamp({lo:g}px, {vw:g}vw, {hi:g}px)'
    return CLAMP.sub(r, text)


def sub_px(text, fn, kind):
    def r(m):
        v = float(m.group(1))
        n = fn(v)
        if n != v:
            stats[kind][f'{m.group(1)}→{n:g}'] += 1
        return f'{n:g}px'
    return PX.sub(r, text)


DECL = re.compile(r'(?<![\w-])(font-size|font|border(?:-(?:top|bottom)-(?:left|right))?-radius|gap|row-gap|column-gap|padding(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?)(\s*:\s*)([^;{}]+)')
FONT_SIZE = re.compile(r'(clamp\([^()]*\)|min\([^()]*\)|max\([^()]*\)|\d+(?:\.\d+)?px)')


def fix_decl(m):
    prop, sep, val = m.group(1), m.group(2), m.group(3)
    if 'var(' in val and not FONT_SIZE.search(val.replace('var(', '')):
        return m.group(0)
    if prop == 'font':
        mm = FONT_SIZE.search(val)              # the first size token is the font size (a /line-height comes after it)
        if not mm:
            return m.group(0)
        tok = mm.group(1)
        new = settle_clamps(sub_px(tok, snap_font, 'font'), 'font')
        return prop + sep + val[:mm.start()] + new + val[mm.end():]
    if prop == 'font-size':
        return prop + sep + settle_clamps(sub_px(val, snap_font, 'font'), 'font')
    if prop.startswith('border') and prop.endswith('radius'):
        return prop + sep + settle_clamps(sub_px(val, snap_rad, 'radius'), 'radius')
    if prop in ('gap', 'row-gap', 'column-gap'):
        return prop + sep + sub_px(val, snap_gap, 'gap')
    if prop.startswith('padding'):
        if 'env(' in val:                       # safe-area sums: snap the plain px parts only
            return prop + sep + sub_px(val, snap_gap, 'padding')
        return prop + sep + sub_px(val, snap_gap, 'padding')
    return m.group(0)


def main(write):
    changed = 0
    for f in FILES:
        p = os.path.join(CSS, f)
        src = open(p).read()
        # never touch custom-property definitions (--x: …) — DECL needs the property name itself, so "--chip-pad:" does not match
        out = DECL.sub(fix_decl, src)
        if out != src:
            changed += 1
            if write:
                open(p, 'w').write(out)
    for k, c in stats.items():
        print(f'{k}: {sum(c.values())} values', ', '.join(f'{a} ×{n}' for a, n in c.most_common(30)))
    print(('rewrote' if write else 'would rewrite'), changed, 'files')


if __name__ == '__main__':
    main('--write' in sys.argv)
