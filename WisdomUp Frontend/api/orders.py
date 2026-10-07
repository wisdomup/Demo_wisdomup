"""WisdomUp orders API — one Python file that runs as a Vercel serverless function (/api/orders) and
inside the local dev server (site/serve.py), so the same rules are tested locally and used live.

  POST  /api/orders                      place an order  (prices are recomputed here from the catalogue)
  GET   /api/orders?number=WU-…&phone=…  track an order  (phone must match; returns no address)
  GET   /api/orders?admin=1              list orders     (header X-Admin-Key)
  PATCH /api/orders                      update status   (header X-Admin-Key, body {number, status, note})

Creators program (affiliate / referral) — same function, chosen by ?cr=… (one deploy unit, one store, one set of rules):
  POST  ?cr=join     sign up: returns the creator's code and a private dashboard key (only its hash is stored)
  POST  ?cr=avail    is a code free? {code} → {available, suggestion}
  POST  ?cr=code     check a shopper's creator code {code, click} → {code, name, discountPct}; click counts a link visit
  POST  ?cr=me       the creator dashboard {code, key} → profile, clicks, orders, commission, tier, payouts
  POST  ?cr=payout   the creator saves payout details {code, key, method, title, number}
  GET   ?cr=admin    every creator with their numbers (header X-Admin-Key)
  PATCH ?cr=admin    {code, status | rate | payout:{amount, note} | resetKey} (header X-Admin-Key)
An order may carry `ref` (a creator code): the server checks it is active and not the buyer's own, takes the follower
discount (shop.js creators.discountPct) off the items and stamps the order. Commission is never stored — it is worked out
from the orders (cr_stats), so marking an order delivered or cancelled in admin moves it between pending / approved / void.

Storage: Upstash Redis over its REST API (env KV_REST_API_URL + KV_REST_API_TOKEN, or UPSTASH_REDIS_REST_URL +
UPSTASH_REDIS_REST_TOKEN) — no packages needed. Locally, without those, orders are JSON files in .data/orders/.
Admin access: env ADMIN_KEY (locally defaults to "local-admin").
"""
import hashlib
import hmac
import json
import os
import re
import secrets
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


def pct_of(n, pct):
    """Whole rupees, half up — the same maths as the site: Math.floor((n * pct + 50) / 100)."""
    return (int(n) * int(pct) + 50) // 100


def price_order(items, delivery, gift_wrap, discount_pct=0):
    """Recompute every price from the catalogue — never trust totals sent by the browser. discount_pct = a creator code's
    follower discount, taken off the items only; free delivery is judged on the items before it (the site does the same)."""
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
    discount = pct_of(subtotal, discount_pct) if discount_pct else 0
    return lines, {'subtotal': subtotal, 'discount': discount, 'delivery': fee, 'giftWrap': gift, 'total': subtotal - discount + fee + gift}


def build_order(body, st):
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
    creator = creator_for_order(body.get('ref'), phone, st)
    pct = int(cr_cfg().get('discountPct') or 0) if creator else 0
    lines, totals = price_order(body.get('items'), body.get('delivery'), bool(body.get('giftWrap')), pct)
    order = {
        'status': 'new', 'createdAt': datetime.now(PKT).isoformat(timespec='seconds'),
        'customer': customer, 'address': address, 'delivery': body.get('delivery'), 'payment': payment,
        'items': lines, 'totals': totals, 'history': [{'status': 'new', 'at': datetime.now(PKT).isoformat(timespec='seconds')}],
    }
    if creator:
        order['ref'] = {'code': creator['code'], 'discountPct': pct}
    return order


def public_view(o, full=False):
    """What a customer may see when tracking (no street address or email)."""
    v = {k: o[k] for k in ('number', 'status', 'createdAt', 'delivery', 'payment', 'items', 'totals', 'history')}
    v['city'] = o['address']['city']
    v['name'] = o['customer']['name'].split(' ')[0]
    v['ref'] = (o.get('ref') or {}).get('code')
    return o if full else v


# ---------- Creators program ----------
CODE_RE = re.compile(r'[A-Z0-9]{3,12}')
RESERVED = {'WISDOMUP', 'WISDOM', 'ADMIN', 'TEST', 'SALE', 'FREE', 'DISCOUNT', 'OFFICIAL', 'SUPPORT', 'HELP', 'NULL', 'NONE', 'ORDER', 'SHOP'}
CR_STATUSES = ('active', 'paused', 'pending')


def cr_cfg():
    return catalog()[1].get('creators') or {}


def code_norm(s):
    c = re.sub(r'[^A-Za-z0-9]', '', str(s or '')).upper()
    return c if CODE_RE.fullmatch(c) else None


def key_hash(key):
    return hashlib.sha256(('wu-creator:' + str(key)).encode()).hexdigest()


def tier_for(sales, cfg):
    """(current tier, next tier or None) for a month's sales."""
    tiers = sorted(cfg.get('tiers') or [{'name': 'Starter', 'from': 0, 'pct': 8}], key=lambda t: t['from'])
    cur = tiers[0]
    for t in tiers:
        if sales >= t['from']:
            cur = t
    return cur, next((t for t in tiers if t['from'] > sales), None)


def creator_for_order(raw, phone, st):
    """The creator behind an order's code, or None. A code that is not active, or is the buyer's own, stops the order with a
    message on the code field (the checkout checks the code first, so this is a last line)."""
    cfg = cr_cfg()
    if not raw or not cfg.get('on'):
        return None
    code = code_norm(raw)
    c = st.cr_get(code) if code else None
    if not c or c.get('status') != 'active':
        raise Bad('This creator code is not active. Remove it to place your order.', 'ref')
    if c.get('phone') == phone:
        raise Bad('That is your own creator code — it is for your followers, so it can’t be used on your own orders.', 'ref')
    return c


def net_value(o):
    """What commission is paid on: the items after the creator discount (no delivery, no gift wrap)."""
    t = o.get('totals') or {}
    return int(t.get('subtotal', 0)) - int(t.get('discount', 0))


def delivered_at(o):
    for h in reversed(o.get('history') or []):
        if h.get('status') == 'delivered':
            return h.get('at')
    return None


def cr_stats(c, orders, clicks, now=None):
    """Everything the dashboard (and admin) shows, worked out from the creator's orders and click counts."""
    cfg = cr_cfg()
    now = now or datetime.now(PKT)
    rdays = int(cfg.get('returnDays') or 7)
    mine = [o for o in orders if (o.get('ref') or {}).get('code') == c['code']]
    month_sales = {}
    for o in mine:
        if o['status'] != 'cancelled':
            month_sales[o['createdAt'][:7]] = month_sales.get(o['createdAt'][:7], 0) + net_value(o)
    rows, sums, top = [], {'pending': 0, 'approved': 0, 'void': 0}, {}
    for o in sorted(mine, key=lambda x: x['createdAt'], reverse=True):
        base, m = net_value(o), o['createdAt'][:7]
        rate = int(c.get('rate') or tier_for(month_sales.get(m, 0), cfg)[0]['pct'])
        until = None
        if o['status'] == 'cancelled':
            state, amt = 'void', 0
        else:
            amt = pct_of(base, rate)
            d = delivered_at(o) if o['status'] == 'delivered' else None
            until = datetime.fromisoformat(d) + timedelta(days=rdays) if d else None
            state = 'approved' if until and now >= until else 'pending'
            for l in o['items']:
                t = top.setdefault(l['id'], {'id': l['id'], 'title': l['title'], 'qty': 0})
                t['qty'] += l['qty']
        sums[state] += amt
        rows.append({'at': o['createdAt'], 'status': o['status'], 'items': [{'id': l['id'], 'title': l['title'], 'qty': l['qty']} for l in o['items']],
                     'value': base, 'rate': rate, 'commission': amt, 'state': state, 'until': until.isoformat(timespec='seconds') if until and state == 'pending' else None})
    paid = sum(int(p.get('amount', 0)) for p in c.get('payouts') or [])
    today = now.date()
    days = [(today - timedelta(days=i)).isoformat() for i in range(29, -1, -1)]
    per_day = {}
    for o in mine:
        if o['status'] != 'cancelled':
            per_day[o['createdAt'][:10]] = per_day.get(o['createdAt'][:10], 0) + 1
    cur_m = now.strftime('%Y-%m')
    tier, nxt = tier_for(month_sales.get(cur_m, 0), cfg)
    live = [r for r in rows if r['state'] != 'void']
    return {
        'clicks': sum(clicks.values()), 'clicks30': sum(clicks.get(d, 0) for d in days),
        'orders': len(live), 'sales': sum(r['value'] for r in live),
        'pending': sums['pending'], 'approved': sums['approved'], 'void': sums['void'], 'paid': paid, 'balance': sums['approved'] - paid,
        'month': {'key': cur_m, 'sales': month_sales.get(cur_m, 0), 'tier': tier, 'next': nxt, 'rate': int(c.get('rate') or tier['pct'])},
        'series': [{'day': d, 'clicks': clicks.get(d, 0), 'orders': per_day.get(d, 0)} for d in days],
        'rows': rows[:60], 'top': sorted(top.values(), key=lambda t: -t['qty'])[:5],
    }


def cr_public(c):
    """The creator's own view of their record (never the key hash)."""
    return {k: c.get(k) for k in ('code', 'name', 'handle', 'platform', 'audience', 'status', 'joinedAt', 'rate', 'payout', 'payouts')}


def cr_suggest(st, base):
    base = (code_norm(base) or 'WU')[:9]
    for _ in range(12):
        cand = f'{base}{secrets.randbelow(90) + 10}'
        if cand not in RESERVED and not st.cr_get(cand):
            return cand
    return None


def cr_join(body, st):
    cfg = cr_cfg()
    if not cfg.get('on'):
        raise Bad('The creators program is closed right now.', status=403)
    if body.get('website'):  # honeypot
        raise Bad('Could not send your application.')
    name = text(body.get('name'), 'name', 80, minlen=2)
    phone = phone_norm(body.get('phone'))
    if not phone:
        raise Bad('Enter a Pakistani mobile number, e.g. 0300 1234567.', 'phone')
    email = text(body.get('email'), 'email', 120, required=False)
    if email and not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', email):
        raise Bad('Enter a valid email address.', 'email')
    handle = text(body.get('handle'), 'handle', 200, minlen=3)
    platform, audience = body.get('platform'), body.get('audience')
    if platform not in (cfg.get('platforms') or []):
        raise Bad('Choose where you post.', 'platform')
    if audience not in (cfg.get('audiences') or []):
        raise Bad('Choose your audience size.', 'audience')
    method = body.get('method') or ''
    if method and method not in (cfg.get('payouts') or []):
        raise Bad('Choose how you want to be paid.', 'method')
    payout = {'method': method, 'title': text(body.get('title'), 'title', 80, required=False), 'number': text(body.get('number'), 'number', 40, required=False)}
    if not body.get('agree'):
        raise Bad('Please accept the program terms.', 'agree')
    if st.cr_phone(phone):
        raise Bad('This WhatsApp number already has a creator account. Open your dashboard, or message us on WhatsApp to get a new key.', 'phone', status=409)
    if body.get('code'):
        code = code_norm(body.get('code'))
        if not code:
            raise Bad('Use 3–12 letters or numbers, e.g. SARA or ALI22.', 'code')
        if code in RESERVED:
            raise Bad('That code is reserved — please choose another.', 'code')
        candidates = [code]
    else:
        first = re.sub(r'[^A-Z]', '', name.split(' ')[0].upper())[:9]
        candidates = ([first] if len(first) >= 3 and first not in RESERVED else []) + [cr_suggest(st, first or 'WU')]
    key = secrets.token_urlsafe(12)
    now = datetime.now(PKT).isoformat(timespec='seconds')
    status = 'active' if cfg.get('autoApprove') else 'pending'
    c = {'code': None, 'name': name, 'phone': phone, 'email': email, 'handle': handle, 'platform': platform, 'audience': audience,
         'note': text(body.get('note'), 'note', 300, required=False), 'status': status, 'joinedAt': now, 'keyHash': key_hash(key),
         'rate': None, 'payout': payout, 'payouts': [], 'history': [{'status': status, 'at': now}]}
    for cand in filter(None, candidates):
        c['code'] = cand
        if st.cr_create(c):
            break
    else:
        want = next(iter(filter(None, candidates)), 'That code')
        tip = cr_suggest(st, want if want != 'That code' else 'WU')
        raise Bad(f'{want} is taken.' + (f' Try {tip}.' if tip else ' Please choose another code.'), 'code', status=409)
    if not st.cr_phone_claim(phone, c['code']):  # two sign-ups with one number at the same moment
        st.cr_delete(c['code'])
        raise Bad('This WhatsApp number already has a creator account.', 'phone', status=409)
    return c, key


def cr_auth(body, st):
    code, key = code_norm(body.get('code')), str(body.get('key') or '').strip()
    c = st.cr_get(code) if code else None
    if not c or not key or not hmac.compare_digest(c.get('keyHash', ''), key_hash(key)):
        raise Bad('That code and key don’t match. Check both, or message us on WhatsApp for a new key.', status=403)
    return c


def cr_dashboard(c, st):
    return {**cr_public(c), 'discountPct': int(cr_cfg().get('discountPct') or 0), 'stats': cr_stats(c, st.cr_orders(c['code']), st.cr_clicks(c['code']))}


def creators_api(method, action, headers, body_bytes):
    cfg = cr_cfg()
    body = json.loads(body_bytes or b'{}') if method in ('POST', 'PATCH') else {}
    st = store('The creators program is being set up — please apply on WhatsApp for now.')
    if action == 'join' and method == 'POST':
        c, key = cr_join(body, st)
        return 201, {'ok': True, 'key': key, 'creator': cr_dashboard(c, st)}
    if action == 'avail' and method == 'POST':
        code = code_norm(body.get('code'))
        if not code:
            return 200, {'ok': True, 'available': False, 'reason': 'Use 3–12 letters or numbers.'}
        free = code not in RESERVED and not st.cr_get(code)
        return 200, {'ok': True, 'code': code, 'available': free, 'suggestion': None if free else cr_suggest(st, code)}
    if action == 'code' and method == 'POST':
        code = code_norm(body.get('code'))
        c = st.cr_get(code) if code and cfg.get('on') else None
        if not c or c.get('status') != 'active':
            raise Bad('This creator code is not active.', 'ref', status=404)
        if body.get('click'):
            st.cr_click(code, datetime.now(PKT).date().isoformat())
        return 200, {'ok': True, 'code': code, 'name': c['name'].split(' ')[0], 'discountPct': int(cfg.get('discountPct') or 0)}
    if action == 'me' and method == 'POST':
        return 200, {'ok': True, 'creator': cr_dashboard(cr_auth(body, st), st)}
    if action == 'payout' and method == 'POST':
        c = cr_auth(body, st)
        m = body.get('method') or ''
        if m not in (cfg.get('payouts') or []):
            raise Bad('Choose how you want to be paid.', 'method')
        c['payout'] = {'method': m, 'title': text(body.get('title'), 'title', 80, minlen=2), 'number': text(body.get('number'), 'number', 40, minlen=6)}
        st.cr_save(c)
        return 200, {'ok': True, 'creator': cr_dashboard(c, st)}
    if action == 'admin':
        if not admin_ok(headers):
            raise Bad('Wrong admin key.', status=403)
        if method == 'GET':
            creators, orders = st.cr_all(), st.recent(5000)
            out = []
            for c in creators:
                s = cr_stats(c, orders, st.cr_clicks(c['code']))
                s.pop('series', None)
                out.append({**cr_public(c), 'phone': c['phone'], 'email': c.get('email', ''), 'note': c.get('note', ''), 'history': c.get('history', []), 'stats': s})
            return 200, {'ok': True, 'creators': sorted(out, key=lambda x: x['joinedAt'], reverse=True), 'program': {k: cfg.get(k) for k in ('discountPct', 'tiers', 'minPayout', 'returnDays', 'linkDays', 'demo')}}
        if method == 'PATCH':
            c = st.cr_get(code_norm(body.get('code')) or '')
            if not c:
                raise Bad('Creator not found.', status=404)
            now = datetime.now(PKT).isoformat(timespec='seconds')
            out = {}
            if body.get('status'):
                if body['status'] not in CR_STATUSES:
                    raise Bad('Unknown status.')
                c['status'] = body['status']
                c.setdefault('history', []).append({'status': c['status'], 'at': now})
            if 'rate' in body:
                r = body.get('rate')
                if r in (None, '', 0):
                    c['rate'] = None
                elif isinstance(r, (int, float)) and 1 <= r <= 40:
                    c['rate'] = int(r)
                else:
                    raise Bad('Custom rate must be 1–40%.')
            if body.get('payout'):
                amount = int((body['payout'] or {}).get('amount') or 0)
                bal = cr_stats(c, st.cr_orders(c['code']), {})['balance']
                if amount < 1 or amount > bal:
                    raise Bad(f'Payout must be between Rs.1 and the balance (Rs.{bal:,}).')
                c.setdefault('payouts', []).append({'amount': amount, 'at': now, 'method': (c.get('payout') or {}).get('method', ''), 'note': text(body['payout'].get('note'), 'note', 120, required=False)})
            if body.get('resetKey'):
                key = secrets.token_urlsafe(12)
                c['keyHash'] = key_hash(key)
                out['key'] = key
            st.cr_save(c)
            return 200, {'ok': True, **out}
    return 405, {'ok': False, 'error': 'Method not allowed.'}


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

    # creators: wu:cr:<CODE> record · wu:creators list · wu:cr:phone:<phone> → code · wu:cr:clk:<CODE> hash day → clicks ·
    # wu:cr:ord:<CODE> list of order numbers
    @staticmethod
    def _hash(flat):
        if isinstance(flat, dict):
            return {k: int(v) for k, v in flat.items()}
        flat = flat or []
        return {flat[i]: int(flat[i + 1]) for i in range(0, len(flat) - 1, 2)}

    def cr_get(self, code):
        raw = self.cmd('GET', 'wu:cr:' + code)
        return json.loads(raw) if raw else None

    def cr_create(self, c):
        if not self.cmd('SET', 'wu:cr:' + c['code'], json.dumps(c, ensure_ascii=False), 'NX'):
            return False
        self.cmd('LPUSH', 'wu:creators', c['code'])
        return True

    def cr_save(self, c):
        self.cmd('SET', 'wu:cr:' + c['code'], json.dumps(c, ensure_ascii=False))

    def cr_delete(self, code):
        self.cmd('DEL', 'wu:cr:' + code)
        self.cmd('LREM', 'wu:creators', 0, code)

    def cr_phone(self, phone):
        return self.cmd('GET', 'wu:cr:phone:' + phone)

    def cr_phone_claim(self, phone, code):
        return bool(self.cmd('SET', 'wu:cr:phone:' + phone, code, 'NX'))

    def cr_all(self):
        codes = self.cmd('LRANGE', 'wu:creators', 0, -1) or []
        raws = self.cmd('MGET', *['wu:cr:' + c for c in codes]) if codes else []
        return [json.loads(r) for r in raws or [] if r]

    def cr_click(self, code, day):
        self.cmd('HINCRBY', 'wu:cr:clk:' + code, day, 1)

    def cr_clicks(self, code):
        return self._hash(self.cmd('HGETALL', 'wu:cr:clk:' + code))

    def cr_add_order(self, code, number):
        self.cmd('LPUSH', 'wu:cr:ord:' + code, number)

    def cr_orders(self, code):
        nums = self.cmd('LRANGE', 'wu:cr:ord:' + code, 0, 1999) or []
        raws = self.cmd('MGET', *['wu:order:' + x for x in nums]) if nums else []
        return [json.loads(r) for r in raws or [] if r]


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

    # creators: one JSON file each in .data/creators/, clicks in .data/creators/_clicks.json ({code: {day: n}})
    def _cr(self, code=''):
        d = os.path.join(ROOT, '.data', 'creators')
        os.makedirs(d, exist_ok=True)
        return os.path.join(d, re.sub(r'[^A-Z0-9_]', '', code) + '.json') if code else d

    def cr_get(self, code):
        p = self._cr(code)
        return json.load(open(p, encoding='utf-8')) if code and os.path.exists(p) else None

    def cr_create(self, c):
        if os.path.exists(self._cr(c['code'])):
            return False
        self.cr_save(c)
        return True

    def cr_save(self, c):
        json.dump(c, open(self._cr(c['code']), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    def cr_delete(self, code):
        if os.path.exists(self._cr(code)):
            os.remove(self._cr(code))

    def cr_all(self):
        d = self._cr()
        return [json.load(open(os.path.join(d, f), encoding='utf-8')) for f in sorted(os.listdir(d)) if f.endswith('.json') and not f.startswith('_')]

    def cr_phone(self, phone):
        return next((c['code'] for c in self.cr_all() if c.get('phone') == phone), None)

    def cr_phone_claim(self, phone, code):
        return all(c['code'] == code for c in self.cr_all() if c.get('phone') == phone)

    def _clicks(self, data=None):
        p = os.path.join(self._cr(), '_clicks.json')
        if data is None:
            return json.load(open(p)) if os.path.exists(p) else {}
        json.dump(data, open(p, 'w'))

    def cr_click(self, code, day):
        data = self._clicks()
        data.setdefault(code, {})[day] = data.get(code, {}).get(day, 0) + 1
        self._clicks(data)

    def cr_clicks(self, code):
        return self._clicks().get(code, {})

    def cr_add_order(self, code, number):
        pass  # orders are found by scanning (local only)

    def cr_orders(self, code):
        return [o for o in self.recent(100000) if (o.get('ref') or {}).get('code') == code]


def store(missing='Online ordering is being set up — please order on WhatsApp for now.'):
    url = os.environ.get('KV_REST_API_URL') or os.environ.get('UPSTASH_REDIS_REST_URL')
    token = os.environ.get('KV_REST_API_TOKEN') or os.environ.get('UPSTASH_REDIS_REST_TOKEN')
    if url and token:
        return RedisStore(url, token)
    if ON_VERCEL:
        raise Bad(missing, status=503)
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
        if q.get('cr'):
            return creators_api(method, q['cr'], headers, body_bytes)
        if method == 'POST':
            body = json.loads(body_bytes or b'{}')
            st = store()
            order = build_order(body, st)
            order['number'] = st.next_number()
            st.save(order, new=True)
            if order.get('ref'):
                st.cr_add_order(order['ref']['code'], order['number'])
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
