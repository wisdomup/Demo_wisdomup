import { NextResponse } from 'next/server';
import { PAYLOAD_API_URL } from '@/lib/constants';

const buyerTypes = new Set([
  'distributor',
  'wholesaler',
  'retailer',
  'online-store',
  'corporate-buyer',
  'other',
]);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
  }

  const payload = {
    fullName: clean(body.fullName),
    whatsappNumber: clean(body.whatsappNumber),
    email: clean(body.email).toLowerCase(),
    city: clean(body.city),
    websiteOrStoreLink: clean(body.websiteOrStoreLink),
    buyerType: clean(body.buyerType),
  };

  if (
    !payload.fullName ||
    !payload.whatsappNumber ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) ||
    !payload.city ||
    !payload.websiteOrStoreLink ||
    !buyerTypes.has(payload.buyerType)
  ) {
    return NextResponse.json({ message: 'Please complete all fields correctly.' }, { status: 400 });
  }

  const response = await fetch(`${PAYLOAD_API_URL}/bulk-order-inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, 500) : '';
}
