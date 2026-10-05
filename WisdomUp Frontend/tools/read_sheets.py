"""Read the WisdomUp supplier quote sheets (.xlsx) into plain rows.

No third-party packages: an .xlsx is a zip of XML. Each product row keeps its
Excel row number so the photo anchored in column B can be matched to it.
"""
import html
import re
import zipfile


def _col(ref):
    n = 0
    for ch in ref:
        n = n * 26 + ord(ch) - 64
    return n


def read_sheet(path):
    z = zipfile.ZipFile(path)
    names = z.namelist()
    strings = []
    if 'xl/sharedStrings.xml' in names:
        for si in re.findall(r'<si>(.*?)</si>', z.read('xl/sharedStrings.xml').decode(), re.S):
            strings.append(html.unescape(''.join(re.findall(r'<t[^>]*>(.*?)</t>', si, re.S))))
    sheet = z.read('xl/worksheets/sheet1.xml').decode()
    rows = {}
    for rnum, body in re.findall(r'<row r="(\d+)"[^>]*>(.*?)</row>', sheet, re.S):
        cells = {}
        for ref, attrs, inner in re.findall(r'<c r="([A-Z]+)\d+"([^>]*?)(?:/>|>(.*?)</c>)', body, re.S):
            if not inner:
                continue
            v = re.search(r'<v>(.*?)</v>', inner, re.S)
            t = re.search(r't="(\w+)"', attrs)
            if t and t.group(1) == 's' and v:
                val = strings[int(v.group(1))]
            elif t and t.group(1) == 'inlineStr':
                val = html.unescape(''.join(re.findall(r'<t[^>]*>(.*?)</t>', inner, re.S)))
            elif v:
                val = html.unescape(v.group(1))
            else:
                continue
            cells[_col(ref)] = val.strip()
        if cells:
            rows[int(rnum)] = cells

    # Photos: drawing anchors in column B (index 1), one per product row
    photos = {}
    if 'xl/drawings/drawing1.xml' in names:
        rels = dict(re.findall(r'Id="([^"]+)"[^>]*Target="([^"]+)"', z.read('xl/drawings/_rels/drawing1.xml.rels').decode()))
        for _, a in re.findall(r'<xdr:(twoCellAnchor|oneCellAnchor)(.*?)</xdr:\1>', z.read('xl/drawings/drawing1.xml').decode(), re.S):
            fr = re.search(r'<xdr:from><xdr:col>(\d+)</xdr:col>.*?<xdr:row>(\d+)</xdr:row>', a, re.S)
            emb = re.search(r'r:embed="([^"]+)"', a)
            if fr and emb and fr.group(1) == '1':
                photos[int(fr.group(2)) + 1] = 'xl/' + rels[emb.group(1)].replace('../', '')

    # Header row = the one whose first cell is 序号 (No.)
    head_r = next(r for r, c in sorted(rows.items()) if c.get(1) == '序号')
    head = {i: re.sub(r'\s+', '', h) for i, h in rows[head_r].items()}
    find = lambda *keys: next((i for i, h in head.items() if any(k in h for k in keys)), None)
    col = {
        'code': find('产品编号'), 'name': find('产品名称'), 'price': find('单价'),
        'barcode': find('产品条码'), 'specs': find('产品参数'), 'material': find('材质'), 'remark': find('备注'),
    }
    out = []
    for r, c in sorted(rows.items()):
        if r <= head_r or not c.get(1, '').isdigit() or not c.get(col['code']):
            continue
        rec = {k: c.get(i, '') for k, i in col.items() if i}
        rec['row'] = r
        rec['photo'] = photos.get(r)
        out.append(rec)
    return z, out
