import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Order Details',
  description: 'View WisdomUp order details, payment status, and delivery progress.',
  path: '/account/orders',
  noIndex: true,
});

export default function OrderDetailsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
