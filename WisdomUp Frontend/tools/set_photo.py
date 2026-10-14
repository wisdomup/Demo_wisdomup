"""Replace a product's photo with a supplied image (2026-10-13, "replace on the product links of TS-2 and TS-3").

usage:  python3 tools/set_photo.py SKU IMAGE      (SKU as in site/img/p, e.g. ts-2; IMAGE = jpg / png / webp)
        python3 tools/set_photo.py --reedge        (re-measure the edge colour of every photo set by this tool)
        python3 tools/set_photo.py SKU IMAGE N    (N = 2, 3 … an EXTRA gallery photo for the product page: SKU-N.jpg;
                                                  build_catalog.py lists them as p.photos, product.js shows them after the
                                                  product's own photo with thumbnails and arrows)
Writes site/img/p/SKU.jpg (1000px, like build_catalog.py's photo()), site/img/p/s/SKU.jpg (480px) and SKU.json (edge / centre
colours, size, and `v` = the file's md5[:8]) — build_catalog.py reads that cache instead of the supplier sheet's photo, and puts
`?v=` on the paths so browsers that cached the old photo (img/* is cached a week) fetch the new one. Then run
python3 tools/build_catalog.py, tools/build_assets.py and tools/build_pages.py. A studio cut-out on white (edge colour ≈ white)
is shown whole (object-fit: contain, common.js photoFit) instead of the packshot crop.
"""
import hashlib
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from build_catalog import IMG_BIG, IMG_SMALL, bmp_px, hexc, grab  # noqa: E402


def border_edge(big):
    """The photo's edge colour = the average of its whole border (all four sides of a 60×60 sample). It fills the letterbox
    bands around a contained studio photo, so it must match where the bands meet the photo; the old six-point sample (corners +
    the middle of the top and bottom rows of a 9×9 copy) caught the product's own shadow and came out grey (#E8E8E8 on a white
    CJ-46 photo), which showed as grey bands above and below it (2026-10-14)."""
    with tempfile.TemporaryDirectory() as tmp:
        bmp = os.path.join(tmp, 'e.bmp')
        subprocess.run(['sips', '-s', 'format', 'bmp', '-z', '60', '60', big, '--out', bmp], check=True, capture_output=True)
        px, w, h = bmp_px(bmp)
        ring = [px(x, 0) for x in range(w)] + [px(x, h - 1) for x in range(w)] + [px(0, y) for y in range(1, h - 1)] + [px(w - 1, y) for y in range(1, h - 1)]
    return hexc([sum(c[i] for c in ring) / len(ring) for i in range(3)])


def reedge():
    for name in sorted(os.listdir(IMG_BIG)):
        if not name.endswith('.json'):
            continue
        mp = os.path.join(IMG_BIG, name); info = json.load(open(mp))
        if not info.get('v'):
            continue  # a supplier packshot, not set by this tool
        old, info['edge'] = info['edge'], border_edge(os.path.join(IMG_BIG, name[:-5] + '.jpg'))
        json.dump(info, open(mp, 'w'))
        print(f'{name[:-5]:12} {old} → {info["edge"]}')


def main(sku, image, n=None):
    if n:
        assert n.isdigit() and int(n) >= 2, 'the extra photo number must be 2 or more (1 is the product photo itself)'
        sku = f'{sku}-{int(n)}'
    big, small, meta_path = os.path.join(IMG_BIG, sku + '.jpg'), os.path.join(IMG_SMALL, sku + '.jpg'), os.path.join(IMG_BIG, sku + '.json')
    run = lambda *a: subprocess.run(['sips', *a], check=True, capture_output=True)
    run('-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', '1000', image, '--out', big)
    run('-s', 'format', 'jpeg', '-s', 'formatOptions', '70', '-Z', '480', image, '--out', small)
    with tempfile.TemporaryDirectory() as tmp:
        bmp = os.path.join(tmp, 'p.bmp')
        run('-s', 'format', 'bmp', '-z', '9', '9', big, '--out', bmp)
        px, w, h = bmp_px(bmp)
        mid = [px(x, y) for x, y in ((1, h // 2), (w // 2, h // 3), (w - 2, h // 2))]
    avg = lambda cs: [sum(c[i] for c in cs) / len(cs) for i in range(3)]
    dims = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', big], capture_output=True, text=True).stdout
    info = {'edge': border_edge(big), 'mid': hexc(avg(mid)), 'w': int(grab(r'pixelWidth: (\d+)', dims)), 'h': int(grab(r'pixelHeight: (\d+)', dims)),
            'v': hashlib.md5(open(big, 'rb').read()).hexdigest()[:8]}
    json.dump(info, open(meta_path, 'w'))
    print(sku, info, f'{os.path.getsize(big) // 1024} KB + {os.path.getsize(small) // 1024} KB')


if __name__ == '__main__':
    if sys.argv[1:] == ['--reedge']:
        reedge()
    elif len(sys.argv) not in (3, 4):
        sys.exit(__doc__)
    else:
        main(*sys.argv[1:])
