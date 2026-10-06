"""WisdomUp orders API — one Python file that runs as a Vercel serverless function (/api/orders) and
inside the local dev server (site/serve.py), so the same rules are tested locally and used live.

  POST  /api/orders                      place an order  (prices are recomputed here from the catalogue)
  GET   /api/orders?number=WU-…&phone=…  track an order  (phone must match; returns no address)
  GET   /api/orders?admin=1              list orders     (header X-Admin-Key)
  PATCH /api/orders                      update status   (header X-Admin-Key, body {number, status, note})

Storage: Upstash Redis over its REST API (env KV_REST_API_URL + KV_REST_API_TOKEN, or UPSTASH_REDIS_REST_URL +
UPSTASH_REDIS_REST_TOKEN) — no packages needed. Locally, without those, orders are JSON files in .data/orders/.
Admin access: env ADMIN_KEY (locally defaults to "local-admin").
"""
import json
import os
import re
import urllib.request
from datetime import datetime, timezone, timedelta
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # WisdomUp Frontend
PKT = timezone(timedelta(hours=5))
ON_VERCEL = bool(os.environ.get('VERCEL'))


def _read_js_json(rel):
    """site/js/*.js files hold `window.X = {json};` — parse the JSON part."""
    s = open(os.path.join(ROOT, rel), encoding='utf-8').read()
    m = re.search(r'window\.\w+\s*=\s*', s)
    return json.loads(s[m.end():].strip().rstrip(';'))


_CACHE = {}


# Sale (shop.js "sale") — the SAME rules and rounding as site/js/wu-data.js, so the browser and the server agree on every price.
def sale_pct(p, shop):
    sale = shop.get('sale') or {}
    if not sale.get('on'):
        return 0
    for r in sale.get('rules') or []:
        if (p.get('type') in (r.get('types') or [])) or (p.get('id') in (r.get('ids') or [])) or (r.get('tab') and r.get('tab') in (p.get('tabs') or [])):
            return int(r.get('pct') or 0)
    return 0


def sale_price(price, pct):
    if not pct or not price:
        return price
    step = 10 if price < 1000 else 50
    s = -(-(price * (100 - pct)) // (100 * step)) * step  # ceil to the step, integer maths
    return s if s < price else price


def catalog():
    if 'skus' not in _CACHE:
        cat = _read_js_json('site/js/catalog.js')
        shop = _read_js_json('site/js/shop.js')
        skus = {}
        for p in cat['products']:
            pct = sale_pct(p, shop)
            variants = p['variants'] or [{'sku': p['code'], 'attrs': {}, 'price': p['price']}]
            for v in variants:
                skus[v['sku']] = {'id': p['id'], 'title': p['title'], 'attrs': v['attrs'], 'price': sale_price(v['price'], pct), 'soldOut': bool(p.get('soldOut'))}
        _CACHE.update(skus=skus, shop=shop)
    return _CACHE['skus'], _CACHE['shop']


# ---------- Validation ----------
class Bad(Exception):
    def __init__(self, msg, field=None, status=400):
        super().__init__(msg)
        self.field, self.status = field, status


def phone_norm(s):
    d = re.sub(r'\D', '', s or '')
    if d.startswith('0092'):
        d = d[4:]
    elif d.startswith('92'):
        d = d[2:]
    if d.startswith('0'):
        d = d[1:]
    return '0' + d if re.fullmatch(r'3\d{9}', d) else None


def text(v, field, maxlen, required=True, minlen=1):
    v = re.sub(r'\s+', ' ', str(v or '')).strip()
    if required and len(v) < minlen:
        raise Bad('Please fill in this field.', field)
    if len(v) > maxlen:
        raise Bad(f'Please keep this under {maxlen} characters.', field)
    return v


def price_order(items, delivery, gift_wrap):
    """Recompute every price from the catalogue — never trust totals sent by the browser."""
    skus, shop = catalog()
    if not isinstance(items, list) or not items:
        raise Bad('Your cart is empty.')
    if len(items) > 30:
        raise Bad('Too many different items in one order.')
    lines, seen = [], {}
    for it in items:
        sku = str((it or {}).get('sku', ''))
        info = skus.get(sku)
        if not info:
            raise Bad(f'A product in your cart is no longer available ({sku}).')
        if info['soldOut']:
            raise Bad(f"{info['title']} is sold out.")
        qty = int((it or {}).get('qty', 0))
        if qty < 1 or qty > shop['maxQty']:
            raise Bad(f"Quantity for {info['title']} must be 1–{shop['maxQty']}.")
        seen[sku] = seen.get(sku, 0) + qty
    for sku, qty in seen.items():
        info = skus[sku]
        lines.append({'sku': sku, 'id': info['id'], 'title': info['title'], 'attrs': info['attrs'], 'qty': qty, 'price': info['price'], 'total': info['price'] * qty})
    subtotal = sum(l['total'] for l in lines)
    opt = shop['delivery'].get(delivery)
    if not opt:
        raise Bad('Choose a delivery option.', 'delivery')
    fee = 0 if (opt['freeOver'] and subtotal >= shop['freeDeliveryFrom']) else opt['fee']
    gift = shop['giftWrap'] if gift_wrap else 0
    return lines, {'subtotal': subtotal, 'delivery': fee, 'giftWrap': gift, 'total': subtotal + fee + gift}


def build_order(body):
    skus, shop = catalog()
    if body.get('website'):  # honeypot field: real visitors never fill it
        raise Bad('Could not place this order.')
    c, a = body.get('customer') or {}, body.get('address') or {}
    phone = phone_norm(c.get('phone'))
    if not phone:
        raise Bad('Enter a Pakistani mobile number, e.g. 0300 1234567.', 'phone')
    email = text(c.get('email'), 'email', 120, required=False)
    if email and not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', email):
        raise Bad('Enter a valid email address.', 'email')
    customer = {'name': text(c.get('name'), 'name', 80, minlen=2), 'phone': phone, 'email': email}
    address = {
        'city': text(a.get('city'), 'city', 60, minlen=2), 'area': text(a.get('area'), 'area', 80, minlen=2),
        'line': text(a.get('line'), 'line', 200, minlen=5), 'notes': text(a.get('notes'), 'notes', 300, required=False),
    }
    payment = body.get('payment')
    if payment not in shop['payments']:
        raise Bad('Choose a payment method.', 'payment')
    lines, totals = price_order(body.get('items'), body.get('delivery'), bool(body.get('giftWrap')))
    return {
        'status': 'new', 'createdAt': datetime.now(PKT).isoformat(timespec='seconds'),
        'customer': customer, 'address': address, 'delivery': body.get('delivery'), 'payment': payment,
        'items': lines, 'totals': totals, 'history': [{'status': 'new', 'at': datetime.now(PKT).isoformat(timespec='seconds')}],
    }


def public_view(o, full=False):
    """What a customer may see when tracking (no street address or email)."""
    v = {k: o[k] for k in ('number', 'status', 'createdAt', 'delivery', 'payment', 'items', 'totals', 'history')}
    v['city'] = o['address']['city']
    v['name'] = o['customer']['name'].split(' ')[0]
    return o if full else v


# ---------- Storage ----------
class RedisStore:
    def __init__(self, url, token):
        self.url, self.token = url.rstrip('/'), token

    def cmd(self, *args):
        req = urllib.request.Request(self.url, data=json.dumps(list(args)).encode(), method='POST',
                                     headers={'Authorization': 'Bearer ' + self.token, 'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=8) as r:
            out = json.loads(r.read())
        if 'error' in out:
            raise RuntimeError(out['error'])
        return out.get('result')

    def next_number(self):
        return 'WU-' + str(10000 + int(self.cmd('INCR', 'wu:order:seq')))

    def save(self, o, new=False):
        self.cmd('SET', 'wu:order:' + o['number'], json.dumps(o, ensure_ascii=False))
        if new:
            self.cmd('LPUSH', 'wu:orders', o['number'])

    def get(self, number):
        raw = self.cmd('GET', 'wu:order:' + number)
        return json.loads(raw) if raw else None

    def recent(self, n=200):
        nums = self.cmd('LRANGE', 'wu:orders', 0, n - 1) or []
        if not nums:
            return []
        raws = self.cmd('MGET', *['wu:order:' + x for x in nums]) or []
        return [json.loads(r) for r in raws if r]


class FileStore:
    """Local development only: one JSON file per order in WisdomUp Frontend/.data/orders/."""
    def __init__(self):
        self.dir = os.path.join(ROOT, '.data', 'orders')
        os.makedirs(self.dir, exist_ok=True)

    def next_number(self):
        p = os.path.join(self.dir, '_seq')
        n = int(open(p).read()) + 1 if os.path.exists(p) else 1
        open(p, 'w').write(str(n))
        return 'WU-' + str(10000 + n)

    def save(self, o, new=False):
        json.dump(o, open(os.path.join(self.dir, o['number'] + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    def get(self, number):
        p = os.path.join(self.dir, re.sub(r'[^A-Z0-9-]', '', number) + '.json')
        return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else None

    def recent(self, n=200):
        files = sorted((f for f in os.listdir(self.dir) if f.endswith('.json')), key=lambda f: int(re.sub(r'\D', '', f)), reverse=True)
        return [json.load(open(os.path.join(self.dir, f), encoding='utf-8')) for f in files[:n]]


def store():
    url = os.environ.get('KV_REST_API_URL') or os.environ.get('UPSTASH_REDIS_REST_URL')
    token = os.environ.get('KV_REST_API_TOKEN') or os.environ.get('UPSTASH_REDIS_REST_TOKEN')
    if url and token:
        return RedisStore(url, token)
    if ON_VERCEL:
        raise Bad('Online ordering is being set up — please order on WhatsApp for now.', status=503)
    return FileStore()


def admin_ok(headers):
    key = os.environ.get('ADMIN_KEY') or ('' if ON_VERCEL else 'local-admin')
    given = headers.get('X-Admin-Key') or headers.get('x-admin-key') or ''
    return bool(key) and len(given) == len(key) and all(a == b for a, b in zip(given, key))


# ---------- Request handling (shared by Vercel and the local server) ----------
def handle(method, query, headers, body_bytes):
    """Return (status, payload dict)."""
    try:
        q = {k: v[0] for k, v in parse_qs(query).items()}
        if method == 'POST':
            body = json.loads(body_bytes or b'{}')
            order = build_order(body)
            st = store()
            order['number'] = st.next_number()
            st.save(order, new=True)
            return 201, {'ok': True, 'order': public_view(order)}
        if method == 'GET' and q.get('admin'):
            if not admin_ok(headers):
                raise Bad('Wrong admin key.', status=403)
            return 200, {'ok': True, 'orders': store().recent(int(q.get('limit', 200)))}
        if method == 'GET':
            number, phone = (q.get('number') or '').strip().upper(), phone_norm(q.get('phone'))
            if not re.fullmatch(r'WU-\d{5,}', number) or not phone:
                raise Bad('Enter your order number (like WU-10001) and the mobile number you ordered with.')
            o = store().get(number)
            if not o or o['customer']['phone'] != phone:
                raise Bad('We could not find an order with that number and phone.', status=404)
            return 200, {'ok': True, 'order': public_view(o)}
        if method == 'PATCH':
            if not admin_ok(headers):
                raise Bad('Wrong admin key.', status=403)
            body = json.loads(body_bytes or b'{}')
            _, shop = catalog()
            st = store()
            o = st.get(str(body.get('number', '')).upper())
            if not o:
                raise Bad('Order not found.', status=404)
            if body.get('status') not in shop['statuses']:
                raise Bad('Unknown status.')
            o['status'] = body['status']
            o['history'].append({'status': o['status'], 'at': datetime.now(PKT).isoformat(timespec='seconds'), 'note': text(body.get('note'), 'note', 200, required=False)})
            st.save(o)
            return 200, {'ok': True, 'order': o}
        return 405, {'ok': False, 'error': 'Method not allowed.'}
    except Bad as e:
        return e.status, {'ok': False, 'error': str(e), 'field': e.field}
    except (ValueError, TypeError):
        return 400, {'ok': False, 'error': 'Could not read the order. Please try again.'}
    except Exception:  # storage/network trouble: never leak internals
        return 502, {'ok': False, 'error': 'We could not save your order right now. Please try again or order on WhatsApp.'}


class handler(BaseHTTPRequestHandler):  # Vercel entry point
    def _go(self, method):
        n = int(self.headers.get('Content-Length') or 0)
        status, payload = handle(method, urlparse(self.path).query, self.headers, self.rfile.read(n) if n else b'')
        out = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(out)))
        self.end_headers()
        self.wfile.write(out)

    def do_GET(self):
        self._go('GET')

    def do_POST(self):
        self._go('POST')

    def do_PATCH(self):
        self._go('PATCH')
