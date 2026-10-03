import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Saved Addresses',
  description: 'Manage saved shipping addresses for your WisdomUp orders.',
  path: '/account/addresses',
  noIndex: true,
});

export default function AddressesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
