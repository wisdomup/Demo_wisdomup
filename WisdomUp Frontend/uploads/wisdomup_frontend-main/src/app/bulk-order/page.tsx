import Image from 'next/image';
import type { Metadata } from 'next';
import { BadgeCheck, Boxes, Headphones, ShieldCheck, Truck } from 'lucide-react';

import { BulkOrderForm } from '@/components/bulk-order/BulkOrderForm';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/badge';
import { PageShell } from '@/components/ui/page-shell';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Bulk Order',
  description: 'Request bulk WisdomUp tech accessories for distribution, wholesale, retail, and corporate buying.',
  path: '/bulk-order',
});

const reasons = [
  { icon: Boxes, title: 'Wide product range', body: 'Earbuds, headphones, speakers, chargers, watches, and power solutions.' },
  { icon: BadgeCheck, title: 'Brand-ready supply', body: 'Trusted WisdomUp branding with fast-moving tech accessories.' },
  { icon: Truck, title: 'Local fulfillment', body: 'Pakistan-ready stock flow and reliable sales support.' },
  { icon: ShieldCheck, title: 'Warranty support', body: 'Warranty-backed products with customer care support.' },
];

export default function BulkOrderPage() {
  return (
    <AppShell>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-slide-web.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          {/* The brand wash and the fade back to the page ground, both derived
              from tokens so a market retune moves the hero with the site. */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,color-mix(in_oklch,var(--primary)_42%,transparent),transparent_36%),linear-gradient(180deg,color-mix(in_oklch,var(--background)_52%,transparent),var(--background)_84%)]" />
        </div>

        <PageShell className="relative grid gap-12 py-(--space-section) md:py-(--space-section-lg) lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-(--radius-pill) border border-border bg-surface-2/60 px-4 py-1.5 text-(length:--text-micro) font-semibold uppercase tracking-(--tracking-eyebrow) text-muted-foreground backdrop-blur">
              <Headphones aria-hidden="true" className="h-3.5 w-3.5 text-primary" /> WisdomUp bulk desk
            </div>

            <h1 className="mt-7 max-w-4xl font-heading font-(--weight-display) text-(length:--text-display) leading-(--leading-display) tracking-(--tracking-display) text-balance">
              Stock premium tech accessories at scale.
            </h1>

            <p className="mt-6 max-w-2xl text-(length:--text-body) leading-(--leading-body) text-muted-foreground text-pretty">
              Become a WisdomUp distributor, wholesaler, retailer, or corporate buyer. Send your details and our team will contact you with bulk pricing and next steps.
            </p>

            <div className="mt-(--space-block) grid gap-3 sm:grid-cols-2">
              {reasons.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-border bg-surface-2/70 p-(--space-card) backdrop-blur"
                >
                  <item.icon aria-hidden="true" className="h-5 w-5 text-primary" />
                  <h2 className="mt-3 text-(length:--text-body) font-semibold">{item.title}</h2>
                  <p className="mt-1 text-(length:--text-caption) leading-(--leading-body) text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 rounded-lg bg-primary/20 blur-3xl"
            />
            <div className="relative overflow-hidden rounded-lg border border-border bg-surface-1/70 p-(--space-card)">
              <div className="mb-4 flex items-center justify-between rounded-lg bg-surface-3 px-4 py-3">
                <Image src="/images/logo.png" alt="WisdomUp" width={96} height={52} className="h-12 w-24 object-contain" />
                <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                  Partner inquiry
                </Badge>
              </div>
              <BulkOrderForm />
            </div>
          </div>
        </PageShell>
      </section>
    </AppShell>
  );
}
