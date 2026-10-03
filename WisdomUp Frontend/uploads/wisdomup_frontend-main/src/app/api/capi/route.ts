import { createHash } from 'node:crypto';

/**
 * Meta Conversions API relay.
 *
 * DEV-015 asks for "Meta Pixel + Conversions API". The pixel alone loses every
 * conversion a content blocker or an ITP-restricted browser drops, which in
 * this market is a large share of them; CAPI reports the same event
 * server-to-server so Meta can deduplicate the two by `event_id`.
 *
 * Inert without META_CAPI_ACCESS_TOKEN and NEXT_PUBLIC_META_PIXEL_ID — it
 * returns 204 and forwards nothing, so a deployment without the credentials
 * behaves exactly as it did before rather than erroring on every event.
 *
 * The access token is a server secret and must never carry the NEXT_PUBLIC_
 * prefix, or it ships to the browser.
 */

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE;
const GRAPH_VERSION = 'v21.0';

type IncomingEvent = {
  event_name: string;
  event_id: string;
  event_source_url?: string;
  /** Optional, and hashed before it leaves this process. */
  email?: string;
  phone?: string;
  custom_data?: Record<string, unknown>;
};

/** Meta requires user identifiers as lowercase, trimmed, SHA-256 hex. */
function hash(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

/** Digits only, country code included, before hashing. */
function hashPhone(value: string): string {
  return createHash('sha256').update(value.replace(/\D/g, '')).digest('hex');
}

export async function POST(request: Request) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return new Response(null, { status: 204 });
  }

  let body: IncomingEvent;
  try {
    body = (await request.json()) as IncomingEvent;
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body?.event_name || !body?.event_id) {
    // event_id is not optional: without it Meta cannot deduplicate this against
    // the browser pixel's copy, and every conversion is counted twice.
    return Response.json(
      { error: 'event_name and event_id are required.' },
      { status: 400 }
    );
  }

  const forwardedFor = request.headers.get('x-forwarded-for');

  const payload = {
    data: [
      {
        event_name: body.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.event_id,
        event_source_url: body.event_source_url,
        action_source: 'website',
        user_data: {
          ...(body.email ? { em: [hash(body.email)] } : {}),
          ...(body.phone ? { ph: [hashPhone(body.phone)] } : {}),
          client_ip_address: forwardedFor?.split(',')[0]?.trim(),
          client_user_agent: request.headers.get('user-agent') ?? undefined,
        },
        custom_data: body.custom_data ?? {},
      },
    ],
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      // Never surface Meta's response to the browser: it echoes back the
      // request, and the access token is in the URL.
      console.error('[capi] Meta rejected the event', response.status);
      return Response.json({ ok: false }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('[capi] forward failed', error);
    return Response.json({ ok: false }, { status: 502 });
  }
}
