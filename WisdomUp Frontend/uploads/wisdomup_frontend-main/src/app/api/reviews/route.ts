import { NextRequest, NextResponse } from 'next/server';

const ADMIN_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_PUBLIC_SERVER_URL || 'https://admin.wisdomup.co';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Proxy to admin API
    const response = await fetch(`${ADMIN_API_URL}/api/public/reviews`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { success: false, message: error.message || 'Failed to create review' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, review: data.review }, { status: 201 });
  } catch (error) {
    console.error('Review proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
