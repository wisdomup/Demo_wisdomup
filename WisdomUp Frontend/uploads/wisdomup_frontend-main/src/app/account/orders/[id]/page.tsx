'use client';

import { Suspense, use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { trackPurchase } from '@/lib/analytics';
import { useAppSelector } from '@/store/hooks';
import { useGetOrderByIdQuery } from '@/store/api/ordersApi';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageShell } from '@/components/ui/page-shell';
import { Skeleton } from '@/components/ui/skeleton';
import { PackageX } from 'lucide-react';
import { DeliveryStatusCard } from '@/components/account/orders/DeliveryStatusCard';
import { OrderDetailsHeader } from '@/components/account/orders/OrderDetailsHeader';
import { OrderItemsCard } from '@/components/account/orders/OrderItemsCard';
import { PaymentCard } from '@/components/account/orders/PaymentCard';
import { PaymentSuccessAlert } from '@/components/account/orders/PaymentSuccessAlert';
import { ShippingAddressCard } from '@/components/account/orders/ShippingAddressCard';

/** Mirrors the two-column detail layout so nothing reflows when the order lands. */
function OrderDetailSkeleton() {
  return (
    <div role="status" aria-label="Loading order" className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-80 w-full rounded-lg lg:col-span-2" />
        <div className="space-y-6">
          <Skeleton className="h-44 w-full rounded-lg" />
          <Skeleton className="h-44 w-full rounded-lg" />
        </div>
      </div>
      <span className="sr-only">Loading order…</span>
    </div>
  );
}

function OrderDetailContent({ orderId }: { orderId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const { token } = useAppSelector((state) => state.auth);
  const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId, { skip: !token });

  /**
   * DEV-015. `purchase` was only fired from the checkout form's Cash on Delivery
   * branch. Card, JazzCash and EasyPaisa orders leave the site for the payment
   * gateway and come back here, so every one of them completed unmeasured —
   * which is every order the ad platforms could actually optimise against.
   *
   * Keyed in sessionStorage so a refresh of this page does not re-report the
   * same order as a second conversion.
   */
  const isPaid = order?.paymentStatus === 'paid';
  useEffect(() => {
    if (!isSuccess || !order || !isPaid) return;

    const key = `wisdomup_purchase_reported:${order.id}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, '1');
    } catch {
      // Storage blocked: report once for this page view rather than not at all.
    }

    trackPurchase({
      transaction_id: order.orderNumber ?? order.id,
      value: order.total,
      currency: 'PKR',
      shipping: order.shipping,
      items: (order.items ?? []).map((item) => ({
        item_id:
          typeof item.product === 'string' ? item.product : (item.product?.id ?? item.name),
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }, [isSuccess, isPaid, order]);

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (error || !order) {
    return (
      <div role="alert">
        <EmptyState
          icon={PackageX}
          title="Order not found"
          action={
            <Button
              variant="primary"
              size="cta"
              className="press"
              render={<Link href="/account/orders" />}
            >
              Back to Orders
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isSuccess && order.paymentStatus === 'paid' && <PaymentSuccessAlert />}

      <OrderDetailsHeader order={order} onBack={() => router.push('/account/orders')} />

      <DeliveryStatusCard
        deliveryStatus={order.deliveryStatus || 'pending'}
        estimatedDelivery={order.estimatedDelivery}
        deliveredAt={order.deliveredAt}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <OrderItemsCard order={order} />

        <div className="space-y-6">
          <PaymentCard order={order} />
          <ShippingAddressCard order={order} />
        </div>
      </div>

      <p className="text-center text-(length:--text-caption) text-muted-foreground">
        Need help with this order?{' '}
        {/* Was href="#", which goes nowhere and scrolls the page to the top. */}
        <Link href="/contact" className="link-underline text-foreground">
          Contact support
        </Link>
      </p>
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <ProtectedRoute>
      <AppShell>
        <PageShell className="pt-8 pb-(--space-section) md:pt-12 md:pb-(--space-section-lg)">
          <Suspense fallback={<OrderDetailSkeleton />}>
            <OrderDetailContent orderId={id} />
          </Suspense>
        </PageShell>
      </AppShell>
    </ProtectedRoute>
  );
}
