"""Check tools/listing_specs.json against the owner's listing sheet (2026-10-13).

Every number and code in an added spec (20W, 37Wh, JL6983, CR1632, CE …) must appear in the spec text of at least one of the
sheet rows named in that product's "from"; every "from" model must be a row of the sheet and a model the site sells.
Run it after editing listing_specs.json:  python3 tools/check_listing_specs.py  (exits 1 on a problem).
No third-party packages: the .xlsx is read as a zip of XML.
"""
import html
import json
import os
import re
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHEET = os.path.join(os.path.dirname(ROOT), 'Wisdomup Products Data for listing Claud.xlsx')
SPECS = os.path.join(ROOT, 'tools', 'listing_specs.json')
CATALOG = os.path.join(ROOT, 'site', 'js', 'catalog.js')


def sheet_rows(path):
    z = zipfile.ZipFile(path)
    runs = lambda si: html.unescape(''.join(re.findall(r'<t[^>]*>(.*?)</t>', si, re.S)))
    strings = [runs(si) for si in re.findall(r'<si>(.*?)</si>', z.read('xl/sharedStrings.xml').decode(), re.S)]
    rows = {}
    for rnum, body in re.findall(r'<row r="(\d+)"[^>]*>(.*?)</row>', z.read('xl/worksheets/sheet1.xml').decode(), re.S):
        if int(rnum) < 4:
            continue
        cells = {}
        for col, attrs, inner in re.findall(r'<c r="([A-Z]+)\d+"([^>]*?)(?:/>|>(.*?)</c>)', body, re.S):
            v, t = re.search(r'<v>(.*?)</v>', inner or ''), re.search(r't="(\w+)"', attrs)
            cells[col] = strings[int(v.group(1))] if (t and t.group(1) == 's' and v) else (html.unescape(v.group(1)) if v else '')
        if cells.get('B'):
            rows[cells['B'].strip().upper()] = (cells.get('I', '') + ' ' + cells.get('H', '') + ' ' + cells.get('F', ''))
    return rows


def tokens(value):
    """Numbers and codes that must be traceable to the sheet."""
    out = set(re.findall(r'\d+(?:\.\d+)?', value.replace(',', '')))
    out |= {t for t in re.findall(r'\b(CE|FCC|RoHS|JL\d+|CR\d+|ABS|TPE|PD|QC)\b', value)}
    return out


def main():
    rows = sheet_rows(SHEET)
    spec = json.load(open(SPECS, encoding='utf-8'))
    s = open(CATALOG, encoding='utf-8').read()
    products = {p['id']: p for p in json.loads(s[s.index('{'):s.rindex('}') + 1])['products']}
    problems, added, kept = [], 0, 0
    for pid, entry in spec.items():
        if pid.startswith('_'):
            continue
        p = products.get(pid)
        if not p:
            problems.append(f'{pid}: not a product on the site'); continue
        src = ''
        for m in entry['from']:
            if m.upper() not in rows:
                problems.append(f'{pid}: {m} is not a row of the sheet')
            src += ' ' + rows.get(m.upper(), '')
        flat = re.sub(r'[\s$\\{}]|text', '', src).replace(',', '')
        have = dict((k, v) for k, v in p['specs'])
        for label, value in entry['add']:
            if have.get(label, value) != value:
                kept += 1  # the product's supplier-sheet value wins (build_catalog.py skips this one)
            else:
                added += 1
            for t in tokens(value):
                if t not in src and t not in flat and t.replace('.', '') not in flat:
                    problems.append(f'{pid}: "{label}: {value}" — "{t}" not found in {"/".join(entry["from"])}')
    print(f'{len(spec) - 1} products, {added} listing specs on the site, {kept} not used because the product already has that label')
    for p in problems:
        print('PROBLEM', p)
    sys.exit(1 if problems else 0)


if __name__ == '__main__':
    main()
