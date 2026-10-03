import { Suspense } from 'react';

import { AppShell } from '@/components/layout/AppShell';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';
import { Skeleton } from '@/components/ui/skeleton';

/** CheckoutForm reads the resume/success query params, so it needs a boundary. */
function CheckoutFallback() {
  return (
    <div role="status" aria-label="Loading your checkout" className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="h-96 w-full rounded-lg lg:col-span-2" />
      <Skeleton className="h-96 w-full rounded-lg" />
      <span className="sr-only">Loading your checkout…</span>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <AppShell>
      <PageHeader title="Checkout" />

      <PageShell className="pb-(--space-section) md:pb-(--space-section-lg)">
        <Suspense fallback={<CheckoutFallback />}>
          <CheckoutForm />
        </Suspense>
      </PageShell>
    </AppShell>
  );
}
