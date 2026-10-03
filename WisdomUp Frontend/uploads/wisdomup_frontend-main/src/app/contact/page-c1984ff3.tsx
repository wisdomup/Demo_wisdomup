import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle, Phone, Clock } from 'lucide-react';

import { AppShell } from '@/components/layout/AppShell';
import { JsonLd } from '@/components/common/JsonLd';
import { Prose, ProseSection } from '@/components/common/Prose';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';
import { breadcrumbJsonLd, localBusinessJsonLd } from '@/lib/jsonLd';
import { createMetadata } from '@/lib/seo';
import { CONTACT, whatsappHref } from '@/lib/site-config';

const description =
  'Talk to WisdomUp about an order, a warranty claim or a bulk enquiry — by WhatsApp, phone or email.';

export const metadata: Metadata = createMetadata({
  title: 'Contact Us',
  description,
  path: '/contact',
});

const CHANNELS = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: CONTACT.phoneDisplay,
    href: whatsappHref(),
    note: 'Fastest route. Order updates, stock checks and returns.',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: CONTACT.phoneDisplay,
    href: `tel:${CONTACT.phoneE164}`,
    note: 'Call us during support hours.',
  },
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    note: 'Best for warranty claims and anything needing attachments.',
  },
] as const;

/**
 * DEV-007 / DEV-008 / DEV-010.
 *
 * The site had no contact route at all, and the contact details it did show
 * disagreed with each other across footers. Everything here reads from CONTACT
 * in lib/site-config, and the LocalBusiness JSON-LD below is generated from the
 * same constant — so the page, the footer, the WhatsApp widget and the
 * structured data cannot drift apart again.
 */
export default function ContactPage() {
  return (
    <AppShell>
      <JsonLd
        data={[
          localBusinessJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Contact Us', path: '/contact' },
          ]),
        ]}
      />

      <PageHeader title="Contact Us" subtitle={description} />

      <PageShell className="pb-(--space-section) md:pb-(--space-section-lg)">
        <div className="mb-(--space-section) grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHANNELS.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              className="hover-lift group rounded-lg border border-border bg-surface-2 p-(--space-card-lg) transition-colors duration-(--duration-instant) ease-out hover:border-border-accent"
            >
              <channel.icon aria-hidden="true" className="size-5 text-primary" />
              <p className="mt-4 text-(length:--text-micro) font-semibold uppercase tracking-(--tracking-eyebrow) text-muted-foreground">
                {channel.label}
              </p>
              <p className="mt-1 text-(length:--text-h3) font-semibold text-foreground">
                {channel.value}
              </p>
              <p className="mt-2 text-(length:--text-caption) text-muted-foreground">
                {channel.note}
              </p>
            </a>
          ))}
        </div>

        <div className="mb-(--space-section) flex items-center gap-2 text-(length:--text-caption) text-muted-foreground">
          <Clock aria-hidden="true" className="size-4 text-primary" />
          <span>Support hours: {CONTACT.hours}</span>
        </div>

        <Prose>
          <ProseSection title="Where we are">
            <p>
              WisdomUp operates from {CONTACT.address.addressLocality},{' '}
              {CONTACT.address.addressRegion}, Pakistan, and ships nationwide. We are an
              online retailer and do not currently run a walk-in showroom, so orders,
              returns and warranty claims are all handled through the channels above.
            </p>
          </ProseSection>

          <ProseSection title="What to include">
            <p>
              To get an answer in one reply rather than three, please include:
            </p>
            <ul>
              <li>Your order number, if the question is about an existing order.</li>
              <li>The product name or model.</li>
              <li>For a fault or a damaged delivery, photographs or a short video.</li>
            </ul>
          </ProseSection>

          <ProseSection title="Buying in volume">
            <p>
              For quantity pricing and corporate gifting, see{' '}
              <Link href="/corporate">corporate orders</Link>, or go straight to the{' '}
              <Link href="/bulk-order">bulk order form</Link> — it captures what we need to
              quote and reaches the same team. Distribution outside Pakistan runs through{' '}
              <Link href="/lightspeed">international &amp; export</Link>.
            </p>
          </ProseSection>

          <ProseSection title="Partnerships">
            <p>
              Creators and reviewers should start at the{' '}
              <Link href="/creators">Content Creators Program</Link>. If you want to stock
              WisdomUp in your shop, <Link href="/where-to-buy">Where to Buy</Link> explains
              how. To earn on people you refer, see the{' '}
              <Link href="/referral">Referral Program</Link>.
            </p>
          </ProseSection>

          <ProseSection title="Before you write">
            <p>
              Many questions are already answered in the{' '}
              <Link href="/help">Help Centre</Link>,{' '}
              <Link href="/shipping">Shipping Policy</Link>,{' '}
              <Link href="/refund">Exchange &amp; Refund Policy</Link>,{' '}
              <Link href="/warranty">Warranty Policy</Link> and the{' '}
              <Link href="/manual">product manuals</Link>. You can check where a parcel is
              from the <Link href="/track">Order Tracker</Link> without contacting us at all.
            </p>
          </ProseSection>
        </Prose>
      </PageShell>
    </AppShell>
  );
}
