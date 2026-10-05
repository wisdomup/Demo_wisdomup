"""Build the WisdomUp retail catalogue from the supplier quote sheets.

    python3 tools/build_catalog.py            # from the WisdomUp Frontend folder

Reads the two .xlsx quote sheets (Chinese, RMB, trade data), keeps what is sold in
Pakistan, translates names/specs into English, prices in PKR (RMB × 4 × 45), groups
variants (connector, plug, capacity, length) into one product, extracts and resizes
the photos, and writes site/js/catalog.js. Carton/weight/barcode data is never output.
"""
import json
import os
import re
import struct
import subprocess
import sys
import tempfile
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from read_sheets import read_sheet  # noqa: E402
from catalog_rules import (  # noqa: E402
    DEPARTMENTS, TYPES, NAME_TYPE, CODE_TYPE, SKIP_NAMES, CABLE_SUFFIX, SET_CABLE, CABLE_ORDER, SET_CABLE_ORDER,
    LENGTH_FAMILIES, T, pkr, uk_to_eu,
)

ROOT = os.path.dirname(HERE)                      # WisdomUp Frontend
SHEETS = os.path.dirname(ROOT)                    # folder holding the .xlsx files
SITE = os.path.join(ROOT, 'site')
IMG_BIG, IMG_SMALL = os.path.join(SITE, 'img', 'p'), os.path.join(SITE, 'img', 'p', 's')
SOURCES = [('new', '智慧至上2026年新款报价表2026.5.31.xlsx'), ('main', '智慧至上报价表 2026.05.31.xlsx')]
CJK = re.compile(r'[　-〿㐀-鿿＀-￯]')

slug = lambda s: re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


# ---------- Spec parsing (Chinese/English free text → English fields) ----------
def norm(t):
    t = t.replace('：', ':').replace('，', ',').replace('（', '(').replace('）', ')').replace('～', '~')
    return re.sub(r'[ \t]+', ' ', t)


def grab(pat, t, g=1):
    m = re.search(pat, t, re.I)
    return m.group(g).strip() if m else None


def hours(v):
    if not v:
        return None
    v = v.replace(' ', '').replace('-', '–')
    return f'{v} hour' if v == '1' else f'{v} hours'


def parse(t, code):
    t = norm(t)
    s = {}
    s['bt'] = grab(r'(?:蓝牙(?:版本|规格)?|bluetooth(?:\s*version)?|BT版本|BT version)[^\n\d]{0,24}?(\d\.\d)', t)
    pm = re.search(r'(?:使用时间|播放时间|播放时长|工作时间|play(?:able)?\s*time)[^\d\n]{0,26}?(\d+(?:\.\d+)?(?:\s*[-–]\s*\d+(?:\.\d+)?)?)\s*(?:个)?\s*(小时|hours?|h\b|H\b|分钟|min)', t, re.I)
    if pm:
        s['play'] = (pm.group(1).replace(' ', '') + ' minutes') if pm.group(2) in ('分钟', 'min') else hours(pm.group(1))
    s['standby'] = hours(grab(r'(?:待机时间|standby time)[^\d\n]{0,20}?(\d+)\s*(?:个)?\s*(?:小时|hours?|h\b|H\b)', t))
    cm = re.search(r'(?:充电时间|充电时长|charging time)[^\d\n<≤]{0,20}?([<≤]?)\s*(\d+(?:\.\d+)?(?:\s*[-–]\s*\d+(?:\.\d+)?)?)\s*(?:个)?\s*(小时|hours?|h\b|H\b)', t, re.I)
    if cm:
        s['charge'] = ('Under ' if cm.group(1) else '') + hours(cm.group(2))
    s['bud_batt'] = grab(r'耳机电池[^\d\n]{0,6}(\d+)\s*m?ah', t) or grab(r'电池\s*:\s*(\d+)\s*\+\s*\d+\s*m?ah', t)
    s['case_batt'] = grab(r'(?:充电仓电池|充电盒电池)[^\d\n]{0,6}(\d+)\s*m?ah', t) or grab(r'电池\s*:\s*\d+\s*\+\s*(\d+)\s*m?ah', t)
    bm = re.search(r'(?:电池容量|电池规格/battery|电池|battery capacity|headphone battery|battery|容量)[^\d\n]{0,30}?(\d[\d,]*)\s*(?:mAh|mah|MAH|MA\b|毫安|Ma\b)\s*(\*\s*\d+)?', t, re.I)
    if bm:
        mult = bm.group(2).replace('*', '').strip() if bm.group(2) else None
        val = int(bm.group(1).replace(',', ''))
        s['battery'] = f'{mult} × {val:,}mAh' if mult and mult != '1' else f'{val:,}mAh'
    s['driver'] = grab(r'(?:喇叭(?:尺寸|规格)?|扬声器(?:直径|尺寸)?|speakers?(?:\s*size)?|喇叭规格/speaker)[^\d\n]{0,16}?(\d+(?:\.\d+)?)\s*(?:mm|毫米)', t)
    rm = re.search(r'(?:蓝牙距离|传输距离|传输范围|连接距离|connection distance|transmission (?:range|distance)|bluetooth transmission distance|距离)[^\d\n]{0,30}?(\d+(?:\s*[-–]\s*\d+)?)\s*(?:米|m\b|M\b|M-)', t, re.I)
    if rm:
        s['range'] = rm.group(1).replace(' ', '').replace('-', '–') + 'm'
    wm = re.findall(r'(?:最大功率|额定功率|输出功率|功率|power)[^\d\n]{0,14}?(\d+(?:\.\d+)?)\s*W\b', t, re.I)
    if wm:
        s['watts'] = max(float(x) for x in wm)
    s['ipx'] = grab(r'(IPX\d)', t)
    pl = grab(r'(?:插头|plug|接口|jack插头|插孔)\s*:?\s*(3\.5\s*mm|type-?c|lightning)', t)
    if pl:
        s['plug'] = '3.5mm' if pl.lower().startswith('3.5') else 'USB-C' if 'c' in pl.lower() and 'light' not in pl.lower() else 'Lightning'
    sv = grab(r'(?:灵敏度|音量|sensitivity)\s*:?\s*(\d+)\s*(?:±|\+|士)?\s*3?\s*(?:dB|db)', t)
    if sv:
        s['sens'] = sv + ' dB'
    fm = re.search(r'(?:频率(?:范围|响应)?|frequency(?: response)?)\s*:?\s*(\d+)\s*(?:hz|赫兹)?\s*[-–~]\s*(\d+[,\d]*)\s*(k?hz|赫兹)', t, re.I)
    if fm:
        hi = fm.group(2).replace(',', '')
        hi = f'{int(hi) // 1000}kHz' if fm.group(3).lower() in ('hz', '赫兹') and int(hi) >= 1000 else hi + 'kHz'
        s['freq'] = f'{fm.group(1)}Hz–{hi}'
    lm = re.search(r'(?:线长(?:度)?|长度|cable length|length)\s*:?\s*(?:about|大约)?\s*(\d+(?:\.\d+)?)\s*(cm|厘米|m\b|M\b|米)', t, re.I)
    if lm:
        v, u = float(lm.group(1)), lm.group(2).lower()
        s['length'] = f'{v / 100:g}m' if u in ('cm', '厘米') else f'{v:g}m'
    s['imp'] = grab(r'(?:阻抗|impedance)\s*:?\s*(\d+)\s*(?:Ω|欧)', t)
    im = re.search(r'(?:输入(?:电压)?|input)[^\d\n]{0,14}?(AC|DC)?\s*(\d+)\s*[-~]\s*(\d+)\s*V', t, re.I)
    if im:
        s['input'] = f"{(im.group(1) or ('DC' if int(im.group(3)) <= 36 else 'AC')).upper()} {im.group(2)}–{im.group(3)}V"
    s['rpm'] = grab(r'(\d{4,5})\s*(?:±\s*10%)?\s*(?:rpm|RMP|转)', t)
    s['speed'] = grab(r'(\d+)\s*MB/S', t)
    s['dpi'] = grab(r'DPI\s*:?\s*([\d-]+)', t)
    s['anc'] = 'ANC' in code.upper() or bool(re.search(r'\bANC\b|主动降噪|ANC降噪', t))
    s['magnetic'] = '磁' in t
    s['lights'] = bool(re.search(r'RGB|LED|灯', t))
    s['display'] = bool(re.search(r'数显|显示屏|屏幕显示|display', t, re.I))
    s['fast'] = bool(re.search(r'\bPD|QC|快充|闪充|fast', t, re.I))
    s['color'] = [c for c, words in COLOURS if any(w in t for w in words)]
    return {k: v for k, v in s.items() if v not in (None, False, [], '')}


COLOURS = [  # name, words
    ('Black', ['黑色']), ('White', ['白色']), ('Grey', ['灰色']), ('Gunmetal', ['锖色', '枪色']), ('Beige', ['米色']),
    ('Apricot', ['杏色']), ('Green', ['绿色']), ('Purple', ['紫色']), ('Blue', ['蓝色']),
]
COLOUR_HEX = {'Black': '#1b1b1b', 'White': '#F2F2F2', 'Grey': '#8A8D91', 'Gunmetal': '#55595E', 'Beige': '#E6DAC3',
              'Apricot': '#E8C6A0', 'Green': '#3C6E47', 'Purple': '#6B4FA0', 'Blue': '#2F5DA8'}


def cable_bits(t):
    t = norm(t)
    w = re.findall(r'(\d+)\s*W', t)
    a = grab(r'(\d(?:\.\d)?)\s*A\b', t)
    mat = []
    if '尼龙' in t or '编织' in t:
        mat.append('Braided nylon')
    if 'TPE' in t:
        mat.append('TPE')
    if 'PVC' in t:
        mat.append('PVC')
    if '硅胶' in t:
        mat.append('Silicone')
    if '锌合金' in t:
        mat.append('Zinc alloy plugs')
    ln = grab(r'(\d+(?:\.\d+)?)\s*米', t)
    extra = []
    if '一拖三' in t:
        extra.append('3-in-1')
    if '侧面带灯' in t:
        extra.append('LED indicator')
    if '数显' in t:
        extra.append('Digital power display')
    return {'w': max(map(int, w)) if w else None, 'a': a, 'mat': mat, 'len': f'{float(ln):g}m' if ln else None, 'extra': extra}


# ---------- Rows → variants ----------
def type_of(r):
    return CODE_TYPE.get(r['code']) or NAME_TYPE.get(r['name'])


def variant_info(r):
    """Return (family_code, axes dict) for a sheet row."""
    c = r['code'].strip()
    m = re.match(r'(SJX-\d+)([A-Z]*)$', c)
    if m:
        suf, base = m.group(2), m.group(1)
        conn = CABLE_SUFFIX.get(suf)
        if not conn:
            sp = norm(r['specs'])
            conn = {'C-C': 'USB-C to USB-C', 'C-L': 'USB-C to Lightning', 'A-C': 'USB-A to USB-C', 'A-L': 'USB-A to Lightning'}.get(grab(r'\b([AC]-[CL])\b', sp) or '')
        return base, ({'Connector': conn} if conn else {})
    m = re.match(r'([OY])CD-(\d+)([A-Z]*)$', c)
    if m:
        n = int(m.group(2))
        eu = n if m.group(1) == 'O' else uk_to_eu(n)
        return f'OCD-{eu}', {'Plug': 'EU 2-pin' if m.group(1) == 'O' else 'UK 3-pin', 'Cable': SET_CABLE.get(m.group(3))}
    m = re.match(r'(USB-\d+)\s*(\d+)G$', c)
    if m:
        return m.group(1), {'Capacity': m.group(2) + 'GB'}
    m = re.match(r'TF(\d+)G$', c)
    if m:
        return 'TF', {'Capacity': m.group(1) + 'GB'}
    if c in LENGTH_FAMILIES or c in LENGTH_FAMILIES.values():
        ln = grab(r'长度\s*[:：]\s*(\d+)\s*m', r['specs'])
        return LENGTH_FAMILIES.get(c, c), {'Length': (ln or '') + 'm'}
    return c, {}


CHARGER_TITLE = {
    21: ('10W USB Wall Charger', '10W', 'USB-A'), 22: ('12W Dual USB Wall Charger', '12W', '2 × USB-A'),
    23: ('18W QC 3.0 Wall Charger', '18W', 'USB-A'), 24: ('20W PD USB-C Wall Charger', '20W', 'USB-C'),
    25: ('20W PD + 18W QC Dual Wall Charger', '20W', 'USB-C + USB-A'), 26: ('12W USB Wall Charger', '12W', 'USB-A'),
    27: ('12W Dual USB Wall Charger', '12W', '2 × USB-A'), 28: ('20W USB + USB-C Wall Charger', '20W', 'USB-C + USB-A'),
    29: ('20W Fast USB Wall Charger', '20W', 'USB-A'), 30: ('20W PD USB-C Wall Charger', '20W', 'USB-C'),
    31: ('20W USB + USB-C Wall Charger', '20W', 'USB-C + USB-A'), 32: ('20W Fast USB Wall Charger', '20W', 'USB-A'),
    33: ('20W PD USB-C Wall Charger', '20W', 'USB-C'),
}
HEAD_TITLE = {1: CHARGER_TITLE[21], 2: CHARGER_TITLE[22], 3: CHARGER_TITLE[23], 4: CHARGER_TITLE[24], 5: CHARGER_TITLE[25]}


def or_list(xs):
    return xs[0] if len(xs) == 1 else ', '.join(xs[:-1]) + ' or ' + xs[-1]


def describe(fam_code, typ, rows):
    """English title (after the code), card meta, spec table, highlights, feature flags, connectors."""
    r0 = rows[0]
    p = parse(r0['specs'], r0['code'])
    specs, hl, feats, conns = [], [], set(), set()
    title = None
    add = lambda k, v: v and specs.append((k, v))

    if fam_code in T:
        title, hl = T[fam_code][0], list(T[fam_code][1])

    if typ == 'earbuds':
        open_ear = fam_code.startswith('OS')
        title = title or ('Noise-Cancelling Wireless Earbuds' if p.get('anc') else 'Open-Ear Wireless Earbuds' if open_ear else 'True Wireless Earbuds')
        add('Design', 'Open-ear' if open_ear else 'In-ear true wireless')
        add('Bluetooth', p.get('bt'))
        add('Noise control', 'Active noise cancelling (ANC)' if p.get('anc') else None)
        add('Playtime', p.get('play'))
        add('Earbud battery', p.get('bud_batt') and p['bud_batt'] + 'mAh')
        add('Case battery', p.get('case_batt') and p['case_batt'] + 'mAh')
        add('Driver', p.get('driver') and p['driver'] + 'mm')
        add('Charging time', p.get('charge'))
        add('Standby', p.get('standby'))
        add('Charging port', 'USB-C' if re.search(r'C口|type-c', r0['specs'], re.I) else None)
        hl = hl or [x for x in [
            p.get('bt') and f"Bluetooth {p['bt']} for a stable link", p.get('anc') and 'Active noise cancelling',
            p.get('play') and f"{p['play']} of music", p.get('driver') and f"{p['driver']}mm drivers for full bass",
            'USB-C charging case' if re.search(r'C口|type-c', r0['specs'], re.I) else None, open_ear and 'Open-ear fit — hear traffic and people around you'] if x]
        meta = [p.get('bt') and 'BT ' + p['bt'], 'ANC' if p.get('anc') else None, p.get('play'), p.get('driver') and p['driver'] + 'mm drivers']
    elif typ == 'neckbands':
        title = title or 'Wireless Neckband'
        add('Bluetooth', p.get('bt')); add('Playtime', p.get('play')); add('Battery', p.get('battery'))
        add('Driver', p.get('driver') and p['driver'] + 'mm'); add('Range', p.get('range')); add('Charging time', p.get('charge'))
        hl = hl or [x for x in [p.get('play') and f"{p['play']} of play", p.get('bt') and f"Bluetooth {p['bt']}", p.get('range') and f"{p['range']} wireless range", 'Deep bass' if 'bass' in r0['specs'].lower() else None] if x]
        meta = [p.get('bt') and 'BT ' + p['bt'], p.get('play'), p.get('range') and p['range'] + ' range']
    elif typ == 'handsfree':
        plug = p.get('plug') or '3.5mm'
        title = title or f"{'USB-C' if plug == 'USB-C' else plug} Handsfree Earphones"
        conns.add(plug)
        add('Plug', plug); add('Driver', p.get('driver') and p['driver'] + 'mm'); add('Frequency response', p.get('freq'))
        add('Sensitivity', p.get('sens')); add('Impedance', p.get('imp') and p['imp'] + 'Ω'); add('Cable length', p.get('length'))
        hl = hl or [x for x in [f'{plug} plug', p.get('length') and f"{p['length']} cable", p.get('sens') and f"{p['sens']} sensitivity", p.get('driver') and f"{p['driver']}mm drivers"] if x]
        if 'iP15' in r0['specs']:
            hl.append('Works with iPhone 15 and 16')
        meta = [plug, p.get('length') and p['length'] + ' cable', p.get('sens')]
    elif typ == 'headphones':
        wired = '有线' in r0['specs'] or 'Cable length' in r0['specs'] or ('插针' in r0['specs'])
        add('Type', 'Wired' if wired else 'Wireless')
        add('Bluetooth', p.get('bt')); add('Noise control', 'Active noise cancelling (ANC)' if p.get('anc') else None)
        add('Playtime', p.get('play')); add('Battery', p.get('battery')); add('Standby', p.get('standby'))
        add('Driver', p.get('driver') and p['driver'] + 'mm'); add('Range', p.get('range'))
        add('Plug', p.get('plug') or ('3.5mm' if wired else None)); add('Cable length', p.get('length'))
        add('Sensitivity', p.get('sens')); add('Frequency response', p.get('freq'))
        if p.get('plug'):
            conns.add(p['plug'])
        meta = [('Wired' if wired else p.get('bt') and 'BT ' + p['bt']), p.get('play'), p.get('driver') and p['driver'] + 'mm drivers']
    elif typ == 'speakers':
        w = p.get('watts')
        add('Output power', w and f'{w:g}W'); add('Bluetooth', p.get('bt')); add('Playtime', p.get('play'))
        add('Battery', p.get('battery')); add('Charging time', p.get('charge')); add('Range', p.get('range'))
        meta = [w and f'{w:g}W', p.get('bt') and 'BT ' + p['bt'], p.get('play')]
    elif typ == 'microphones':
        rng = grab(r'传输范围\s*[:：]\s*([\d-]+)\s*米', r0['specs'])
        add('Connection', '2.4GHz wireless, auto pairing'); add('Latency', 'Under 20ms'); add('Range', rng and rng.replace('-', '–') + 'm')
        add('Frequency response', '100Hz–10kHz'); add('Signal-to-noise ratio', '58dB'); add('Pickup', '360° omnidirectional')
        meta = ['2.4GHz wireless', rng and rng.replace('-', '–') + 'm range', '<20ms latency']
    elif typ == 'wall-chargers':
        if fam_code.startswith('OCD-'):
            ttl, w, ports = CHARGER_TITLE[int(fam_code[4:])]
            title = ttl + ' with Cable'
            cables = [c for c in SET_CABLE_ORDER if c in {SET_CABLE.get(re.sub(r'^[OY]CD-\d+', '', x['code'].strip())) for x in rows}]
            plugs = sorted({'EU 2-pin' if x['code'].startswith('O') else 'UK 3-pin' for x in rows})
            hl = [f'{w} charging', f'Ports: {ports}', 'Cable included — ' + or_list([c.replace(' (iPhone)', '') for c in cables]), 'Plug: ' + or_list(plugs), 'Short-circuit and over-voltage protection']
        else:
            ttl, w, ports = HEAD_TITLE[int(fam_code[4:])]
            title = ttl.replace(' Wall Charger', ' Charger') + ' (Plug Only)'
            hl = [f'{w} charging', f'Ports: {ports}', 'EU 2-pin plug']
        add('Output', w); add('Ports', ports)
        add('Fast charging', 'PD' if 'PD' in title and 'QC' not in title else 'PD + QC 3.0' if 'PD' in title else 'QC 3.0' if 'QC' in title else None)
        add('Input', 'AC 100–240V')
        feats.add('fast') if int(w[:-1]) >= 18 else None
        meta = [w, ports, 'Cable included' if fam_code.startswith('OCD-') else 'EU plug']
    elif typ == 'charging-cables':
        b = cable_bits(r0['specs'])
        ws = [cable_bits(x['specs'])['w'] for x in rows if cable_bits(x['specs'])['w']]
        top = max(ws) if ws else None
        if '3-in-1' in b['extra']:
            title = '3-in-1 Charging Cable'
        elif len(set(ws)) > 1:
            title = 'Fast Charging Cable'
        else:
            title = f"{top}W Fast Charging Cable" if top else f"{b['a']}A {'Braided ' if 'Braided nylon' in b['mat'] else ''}Charging Cable" if b['a'] else 'Charging Cable'
        one = {CABLE_SUFFIX.get(re.sub(r'^SJX-\d+', '', x['code'].strip())) for x in rows} - {None}
        if len(one) == 1 and len(rows) == 1:
            title = f"{one.pop()} " + title.replace('Charging Cable', 'Cable').replace('Fast Cable', 'Fast Charging Cable')
        if 'LED indicator' in b['extra']:
            title = title.replace('Cable', 'Cable with LED')
        if 'Digital power display' in b['extra']:
            title = title.replace('Cable', 'Cable with Display')
        add('Max output', f'Up to {top}W' if top and len(set(ws)) > 1 else top and f'{top}W' or (b['a'] and b['a'] + 'A'))
        add('Length', b['len']); add('Material', ' + '.join(b['mat']) or None)
        add('Extras', ', '.join(x for x in b['extra'] if x != '3-in-1') or None)
        if top and top >= 20 or b['a'] in ('3', '5'):
            feats.add('fast')
        hl = [x for x in [top and (f'Up to {top}W fast charging' if len(set(ws)) > 1 else f'{top}W fast charging'), b['a'] and not top and f"{b['a']}A charging current",
                          b['len'] and f"{b['len']} long", b['mat'] and ' + '.join(b['mat']), *b['extra']] if x]
        meta = [top and f'{top}W' or b['a'] and b['a'] + 'A', b['len'], b['mat'][0] if b['mat'] else None]
    elif typ in ('memory-cards', 'usb-drives'):
        sp = grab(r'(\d+)\s*MB/S', rows[-1]['specs'])
        title = 'microSD Memory Card' if typ == 'memory-cards' else 'USB 3.0 Flash Drive'
        add('Interface', 'USB 3.0' if typ == 'usb-drives' else 'microSD / TF'); add('Read speed', sp and f'Up to {sp} MB/s')
        hl = ['Choose 4GB to ' + ('128GB' if typ == 'memory-cards' else '64GB'), sp and f'Up to {sp} MB/s', 'Works with phones, cameras and laptops' if typ == 'memory-cards' else 'Plug and play on Windows and macOS']
        hl = [x for x in hl if x]
        meta = ['4GB–128GB' if typ == 'memory-cards' else '4GB–64GB', sp and f'{sp} MB/s']
    else:
        # Hand-written title/highlights (T); add whatever specs the text gives
        add('Bluetooth', p.get('bt')); add('Output power', p.get('watts') and f"{p['watts']:g}W"); add('Battery', p.get('battery'))
        add('Playtime' if typ not in ('shavers', 'clippers') else 'Runtime', p.get('play')); add('Charging time', p.get('charge'))
        add('Range', p.get('range')); add('Water resistance', p.get('ipx')); add('Motor speed', p.get('rpm') and p['rpm'] + ' rpm')
        add('Input', p.get('input')); add('Resolution', grab(r'(4K@30HZ|1080P)', r0['specs']) and grab(r'(4K@30HZ|1080P)', r0['specs']).replace('@30HZ', ' at 30Hz').replace('1080P', '1080p'))
        add('DPI', p.get('dpi') and p['dpi'].replace('-', ' / '))
        meta = hl[:3]

    if typ in ('car-chargers',):
        add('Input', 'DC 12–24V (cars and trucks)')
        if re.search(r'QC|PD|9V', r0['specs']):
            feats.add('fast')
    if typ == 'power-banks':
        cap = grab(r'(\d{4,5})\s*m?A', r0['specs'])
        specs[:] = [x for x in specs if x[0] != 'Battery']
        add('Capacity', cap and f'{int(cap):,}mAh'); add('Fast charging', '22.5W' if '22.5' in r0['specs'] else None)
        if '22.5' in r0['specs']:
            feats.add('fast')
        if '无线' in r0['specs']:
            feats.add('wireless')
        meta = [cap and f'{int(cap):,}mAh', '22.5W fast' if '22.5' in r0['specs'] else None, hl[0] if hl else None]
    if typ == 'wireless-chargers':
        feats.add('wireless'); add('Wireless output', '15W max')
    if typ == 'speakers' or typ == 'headphones':
        meta = meta if any(meta) else hl[:3]
        if not hl:
            hl = [x for x in [p.get('watts') and f"{p['watts']:g}W output", p.get('play') and f"{p['play']} of play", p.get('bt') and f"Bluetooth {p['bt']}"] if x]
    if typ == 'hdmi':
        conns.add('HDMI'); conns.add('USB-C') if 'USB-C' in (title or '') else None
        add('Plugs', 'Gold-plated'); add('Cable diameter', '4.8mm')

    # Shared feature flags + connectors
    blob = (title or '') + ' ' + ' '.join(hl)
    if p.get('anc'):
        feats.add('anc')
    if p.get('ipx'):
        feats.add('water')
    if re.search(r'magnetic', blob, re.I):
        feats.add('magnetic')
    if re.search(r'\bRGB|Lights\b|LED\b|light show|Backlit', blob, re.I):
        feats.add('lights')
    for k, words in (('USB-C', ['USB-C']), ('Lightning', ['Lightning', 'iPhone']), ('Micro-USB', ['Micro-USB']), ('3.5mm', ['3.5mm', 'AUX'])):
        if typ in ('adapters', 'audio-cables', 'card-readers', 'handsfree', 'headphones') and any(w in blob for w in words):
            conns.add(k)
    if p.get('color'):
        add('Colours', ', '.join(p['color']))
    meta = [m for m in meta if m][:3]
    return title, meta, specs, hl[:5], feats, conns, p.get('color', [])


# ---------- Photos ----------
def bmp_px(path):
    b = open(path, 'rb').read()
    off, w, h, bpp = struct.unpack_from('<I', b, 10)[0], struct.unpack_from('<i', b, 18)[0], struct.unpack_from('<i', b, 22)[0], struct.unpack_from('<H', b, 28)[0]
    step, row = bpp // 8, ((bpp * w + 31) // 32) * 4
    flip = h > 0
    h = abs(h)

    def px(x, y):
        yy = (h - 1 - y) if flip else y
        o = off + yy * row + x * step
        return b[o + 2], b[o + 1], b[o]
    return px, w, h


def hexc(c):
    return '#%02x%02x%02x' % tuple(int(v) for v in c)


def photo(zips, r, sku):
    """Extract, resize (1000px + 480px), sample edge/centre colours. Cached by file name."""
    big, small = os.path.join(IMG_BIG, sku + '.jpg'), os.path.join(IMG_SMALL, sku + '.jpg')
    meta_path = os.path.join(IMG_BIG, sku + '.json')
    if os.path.exists(big) and os.path.exists(small) and os.path.exists(meta_path):
        return json.load(open(meta_path))
    with tempfile.TemporaryDirectory() as tmp:
        src = os.path.join(tmp, 'src.' + r['photo'].rsplit('.', 1)[-1])
        open(src, 'wb').write(zips[r['src']].read(r['photo']))
        run = lambda *a: subprocess.run(['sips', *a], check=True, capture_output=True)
        run('-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', '1000', src, '--out', big)
        run('-s', 'format', 'jpeg', '-s', 'formatOptions', '70', '-Z', '480', src, '--out', small)
        bmp = os.path.join(tmp, 'p.bmp')
        run('-s', 'format', 'bmp', '-z', '9', '9', big, '--out', bmp)
        px, w, h = bmp_px(bmp)
        edge = [px(x, y) for x, y in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1))]
        mid = [px(x, y) for x, y in ((1, h // 2), (w // 2, h // 3), (w - 2, h // 2))]
        avg = lambda cs: [sum(c[i] for c in cs) / len(cs) for i in range(3)]
        dims = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', big], capture_output=True, text=True).stdout
        W, H = int(grab(r'pixelWidth: (\d+)', dims)), int(grab(r'pixelHeight: (\d+)', dims))
    info = {'edge': hexc(avg(edge)), 'mid': hexc(avg(mid)), 'w': W, 'h': H}
    json.dump(info, open(meta_path, 'w'))
    return info


# ---------- Build ----------
def main():
    import zipfile
    os.makedirs(IMG_SMALL, exist_ok=True)
    rows, zips = [], {}
    for tag, fname in SOURCES:
        z, rs = read_sheet(os.path.join(SHEETS, fname))
        zips[tag] = z
        for r in rs:
            r['src'] = tag
        rows += rs

    skipped = {'not for Pakistan': [], 'no price': [], 'no type': []}
    fams = {}
    for r in rows:
        if r['name'] in SKIP_NAMES:
            skipped['not for Pakistan'].append(r['code']); continue
        try:
            float(r['price'])
        except ValueError:
            skipped['no price'].append(r['code']); continue
        typ = type_of(r)
        if not typ:
            skipped['no type'].append(f"{r['code']} ({r['name']})"); continue
        fam, axes = variant_info(r)
        fams.setdefault(fam, {'type': typ, 'rows': []})['rows'].append((r, axes))

    products = []
    for fam, f in fams.items():
        typ, items = f['type'], f['rows']
        # Variant order: plug EU first, then cable/connector preference, capacity/length ascending
        def key(it):
            a = it[1]
            return (
                0 if a.get('Plug', 'EU').startswith('EU') else 1,
                SET_CABLE_ORDER.index(a['Cable']) if a.get('Cable') in SET_CABLE_ORDER else 0,
                CABLE_ORDER.index(a['Connector']) if a.get('Connector') in CABLE_ORDER else 0,
                int(re.sub(r'\D', '', a.get('Capacity', '0')) or 0), float(re.sub(r'[^\d.]', '', a.get('Length', '0')) or 0),
            )
        items.sort(key=key)
        rows_ = [r for r, _ in items]
        title, meta, specs, hl, feats, conns, colours = describe(fam, typ, rows_)
        variants = []
        for r, a in items:
            sku = slug(r['code'])
            img = photo(zips, r, sku) if r['photo'] and not os.environ.get('NOPHOTO') else None
            v = {'sku': r['code'].strip(), 'attrs': {k: v for k, v in a.items() if v}, 'price': pkr(r['price'])}
            if img:
                v.update({'img': f'img/p/{sku}.jpg', 'thumb': f'img/p/s/{sku}.jpg', 'bg': [img['mid'], img['edge']], 'ar': round(img['w'] / img['h'], 3)})
            variants.append(v)
            for val in v['attrs'].values():
                for k in ('USB-C', 'Lightning', 'Micro-USB'):
                    if k in val:
                        conns.add(k)
        axes = []
        for v in variants:
            for k in v['attrs']:
                if k not in axes and len({x['attrs'].get(k) for x in variants}) > 1:
                    axes.append(k)
        prices = [v['price'] for v in variants]
        remarks = ' '.join(r['remark'] for r in rows_)
        tabs = (['new'] if '2026' in remarks else []) + (['best'] if '爆款' in remarks else [])
        lead = next((v for v in variants if v.get('img')), variants[0])
        code = fam if fam != 'TF' else 'TF'
        full = f'{code} {title}'
        tl, noun, artk = TYPES[typ]
        p = {
            'id': slug(fam), 'code': code, 'title': full, 'type': typ, 'cat': tl,
            'price': min(prices), 'from': len(set(prices)) > 1,
            'meta': ' | '.join(meta), 'highlights': hl, 'specs': [list(s) for s in specs],
            'features': sorted(feats), 'connectors': sorted(conns),
            'colors': [{'name': c, 'hex': COLOUR_HEX[c]} for c in colours],
            'tabs': tabs, 'ribbon': 'New' if 'new' in tabs else 'Best seller' if 'best' in tabs else None,
            'year': 2026 if '2026' in remarks else 2025 if '2025' in remarks else None,
            'art': artk, 'src': lead.get('img'), 'thumb': lead.get('thumb'), 'bg': lead.get('bg'), 'ar': lead.get('ar'),
            'axes': axes, 'variants': variants if len(variants) > 1 else [],
            'skus': [v['sku'] for v in variants],
        }
        products.append(p)

    # Order: department order, then type order, newest first, then model number
    t_order = [t for _, _, ts in DEPARTMENTS for t in ts]
    natural = lambda s: [int(x) if x.isdigit() else x for x in re.split(r'(\d+)', s)]
    products.sort(key=lambda p: (t_order.index(p['type']), 0 if 'new' in p['tabs'] else 1 if 'best' in p['tabs'] else 2, natural(p['code'])))

    # Guard: no Chinese text may reach the site
    leaks = [(p['id'], k) for p in products for k, v in p.items() if isinstance(v, (str, list)) and CJK.search(json.dumps(v, ensure_ascii=False))]
    if leaks:
        print('Chinese text left in:', leaks[:20]); sys.exit(1)

    out = {
        'generated': date.today().isoformat(), 'priceRule': 'RMB × 4 × 45',
        'departments': [{'id': d, 'label': l, 'types': ts} for d, l, ts in DEPARTMENTS],
        'types': {k: {'label': v[0], 'noun': v[1]} for k, v in TYPES.items()},
        'products': products,
    }
    js = ('// Generated by tools/build_catalog.py from the supplier quote sheets — edit the rules there, not this file.\n'
          'window.WU_CATALOG = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
    open(os.path.join(SITE, 'js', 'catalog.js'), 'w').write(js)
    n_var = sum(max(1, len(p['variants'])) for p in products)
    print(f"{len(products)} products ({n_var} SKUs) · {len(js) // 1024} KB catalog.js")
    for k, v in skipped.items():
        print(f'skipped ({k}): {len(v)}', v[:12])


if __name__ == '__main__':
    main()
