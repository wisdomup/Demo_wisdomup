'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingBag, Trash2 } from 'lucide-react';

import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';
import { PriceDisplay } from '@/components/ui/price-display';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from '@/store/api/cartApi';

function CartSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading your cart"
      className="grid grid-cols-1 gap-8 lg:grid-cols-3"
    >
      <div className="flex flex-col gap-4 lg:col-span-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex gap-4 rounded-lg border border-border bg-card p-(--space-card)"
          >
            <Skeleton className="size-20 shrink-0 rounded-lg" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-5 w-1/3" />
            </div>
            <Skeleton className="h-11 w-32 rounded-(--radius-pill)" />
          </div>
        ))}
      </div>
      <Skeleton className="h-72 w-full rounded-lg" />
      <span className="sr-only">Loading your cart…</span>
    </div>
  );
}

function CartContent() {
  const router = useRouter();
  const { data: cart, isLoading } = useGetCartQuery();
  const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : subtotal > 0 ? 200 : 0;
  const total = subtotal + shipping;

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Add some products to get started"
        action={
          <Button variant="primary" size="cta" className="press" onClick={() => router.push('/products')}>
            Browse Products
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <ul className="flex flex-col gap-4 lg:col-span-2">
        {items.map((item) => (
          <li key={item.product}>
            <Card>
              <CardContent className="flex gap-4">
                {item.image && (
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <CardTitle as="h3" className="truncate">
                    {item.name}
                  </CardTitle>
                  {item.variant && (
                    <p className="text-(length:--text-caption) text-muted-foreground">
                      {item.variant}
                    </p>
                  )}
                  <PriceDisplay price={item.price} size="sm" className="mt-1" />
                </div>

                <div className="flex flex-col items-end justify-between gap-3">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${item.name} from cart`}
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeFromCart(item.product)}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>

                  <QuantitySelector
                    value={item.quantity}
                    label={item.name}
                    onChange={(quantity) =>
                      updateCartItem({ productId: item.product, quantity })
                    }
                    className={isUpdating ? 'pointer-events-none opacity-60' : undefined}
                  />
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div>
        <Card className="sticky top-(--header-offset)">
          <CardHeader>
            <CardTitle as="h2">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex justify-between text-(length:--text-caption)">
              <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-(length:--text-caption)">
              <span className="text-muted-foreground">Shipping</span>
              <span className="tabular-nums">
                {shipping === 0 ? (
                  <span className="font-medium text-success">Free</span>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>

            <Separator />

            <div className="flex items-baseline justify-between">
              <span className="font-semibold">Total</span>
              <PriceDisplay price={total} size="sm" />
            </div>

            {subtotal > 0 && subtotal <= 5000 && (
              <p className="text-(length:--text-micro) text-muted-foreground">
                Add {formatPrice(5000 - subtotal)} more for free shipping
              </p>
            )}

            <Button
              variant="primary"
              size="cta"
              className="press w-full"
              onClick={() => router.push('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <AppShell>
      <PageHeader title="Shopping Cart" />

      <PageShell className="pb-(--space-section) md:pb-(--space-section-lg)">
        <CartContent />
      </PageShell>
    </AppShell>
  );
}
