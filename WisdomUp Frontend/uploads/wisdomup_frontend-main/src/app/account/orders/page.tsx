'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { useGetMyOrdersQuery } from '@/store/api/ordersApi';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/ui/status-badge';
import { Package, ArrowRight } from 'lucide-react';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, DELIVERY_STATUS_LABELS } from '@/lib/constants';

/** Same footprint as an order row, so the list does not jump when it lands. */
function OrdersSkeleton() {
  return (
    <div role="status" aria-label="Loading orders" className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-border bg-card p-(--space-card)">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading orders…</span>
    </div>
  );
}

function OrdersContent() {
  const { token } = useAppSelector((state) => state.auth);
  const { data, isLoading, error, refetch } = useGetMyOrdersQuery({ limit: 20 }, { skip: !token });

  if (isLoading) {
    return <OrdersSkeleton />;
  }

  if (error || !data) {
    return <ErrorState title="Failed to load orders" onRetry={() => refetch()} />;
  }

  if (data.docs.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="When you place an order, it will appear here."
        action={
          <Button
            variant="primary"
            size="cta"
            className="press"
            render={<Link href="/products" />}
          >
            Browse Products
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {data.docs.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="group block rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Card className="hover-lift">
            <CardContent>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">{order.orderNumber}</p>
                    <StatusBadge
                      status={order.status}
                      label={ORDER_STATUS_LABELS[order.status] || order.status}
                    />
                  </div>
                  <p className="text-(length:--text-caption) text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <StatusBadge
                      status={order.paymentStatus}
                      label={PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
                    />
                    {order.deliveryStatus && (
                      <StatusBadge
                        status={order.deliveryStatus}
                        label={DELIVERY_STATUS_LABELS[order.deliveryStatus] || order.deliveryStatus}
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">Rs. {order.total.toLocaleString()}</p>
                    <p className="text-(length:--text-micro) text-muted-foreground">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-(length:--text-micro) capitalize text-muted-foreground">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                    </p>
                  </div>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-5 text-muted-foreground transition-transform duration-(--duration-base) ease-out group-hover:translate-x-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <PageHeader
          title="My Orders"
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Account', href: '/account' },
                { label: 'Orders' },
              ]}
            />
          }
        />

        <PageShell className="pb-(--space-section) md:pb-(--space-section-lg)">
          <OrdersContent />
        </PageShell>
      </AppShell>
    </ProtectedRoute>
  );
}
