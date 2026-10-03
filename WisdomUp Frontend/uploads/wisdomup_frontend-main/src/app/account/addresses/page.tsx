'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useUpdateAddressesMutation } from '@/store/api/authApi';
import { setUser } from '@/store/slices/authSlice';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/choice';
import { EmptyState } from '@/components/ui/empty-state';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';
import { cn } from '@/lib/utils';
import type { Address } from '@/types';
import { Loader2, MapPin, Plus, Pencil, Trash2, Star } from 'lucide-react';

const EMPTY_ADDRESS: Omit<Address, 'id'> = {
  label: '',
  fullName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Pakistan',
  isDefault: false,
};

const ACCOUNT_NAV = [
  { href: '/account', label: 'Profile' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/addresses', label: 'Addresses' },
  { href: '/wishlist', label: 'Wishlist' },
];

/** Shared by every account route; `current` is the one that is already open. */
function AccountNav({ current }: { current: string }) {
  return (
    <nav aria-label="Account" className="flex flex-col gap-1">
      {ACCOUNT_NAV.map((item) => {
        const isCurrent = item.href === current;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isCurrent ? 'page' : undefined}
            className={cn(
              'rounded-md px-3 py-2 text-(length:--text-caption) transition-colors duration-(--duration-instant) ease-out',
              isCurrent
                ? 'bg-surface-3 font-medium text-foreground'
                : 'text-muted-foreground hover:bg-surface-3 hover:text-foreground'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AddressForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial: Partial<Address>;
  onSave: (addr: Omit<Address, 'id'>) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<Omit<Address, 'id'>>({
    ...EMPTY_ADDRESS,
    ...initial,
  });

  const set = (field: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field name="label" label="Label" required>
          {(field) => (
            <Input
              {...field}
              value={form.label}
              onChange={(e) => set('label', e.target.value)}
              placeholder="e.g. Home, Office"
            />
          )}
        </Field>

        <Field name="fullName" label="Full Name" required>
          {(field) => (
            <Input
              {...field}
              autoComplete="name"
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              placeholder="Recipient full name"
            />
          )}
        </Field>

        <Field name="phone" label="Phone" required>
          {(field) => (
            <Input
              {...field}
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="+92 300 0000000"
            />
          )}
        </Field>

        <Field name="country" label="Country">
          {(field) => (
            <Input
              {...field}
              autoComplete="country-name"
              value={form.country}
              onChange={(e) => set('country', e.target.value)}
              placeholder="Pakistan"
            />
          )}
        </Field>

        <Field name="address" label="Street Address" required className="sm:col-span-2">
          {(field) => (
            <Input
              {...field}
              autoComplete="street-address"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="House #, Street, Area"
            />
          )}
        </Field>

        <Field name="city" label="City" required>
          {(field) => (
            <Input
              {...field}
              autoComplete="address-level2"
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
              placeholder="Lahore"
            />
          )}
        </Field>

        <Field name="state" label="Province / State" required>
          {(field) => (
            <Input
              {...field}
              autoComplete="address-level1"
              value={form.state}
              onChange={(e) => set('state', e.target.value)}
              placeholder="Punjab"
            />
          )}
        </Field>

        <Field name="postalCode" label="Postal Code" required>
          {(field) => (
            <Input
              {...field}
              autoComplete="postal-code"
              value={form.postalCode}
              onChange={(e) => set('postalCode', e.target.value)}
              placeholder="54000"
            />
          )}
        </Field>

        <div className="flex items-center sm:pt-6">
          <Checkbox
            name="isDefault"
            checked={form.isDefault}
            onChange={(e) => set('isDefault', e.target.checked)}
            label="Set as default address"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="press" disabled={isSaving} size="sm">
          {isSaving && <Loader2 aria-hidden="true" className="mr-1 animate-spin" />}
          Save Address
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="press"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function AddressesContent() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [updateAddresses, { isLoading: isSaving }] = useUpdateAddressesMutation();

  const [showAdd, setShowAdd] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  if (!user) return null;

  const addresses = user.addresses ?? [];

  const persist = async (next: Address[]) => {
    setError('');
    try {
      const result = await updateAddresses({ id: user.id, addresses: next }).unwrap();
      dispatch(setUser(result.doc));
    } catch {
      setError('Failed to save. Please try again.');
    }
  };

  const handleAdd = async (addr: Omit<Address, 'id'>) => {
    const next = [...addresses];
    if (addr.isDefault) {
      next.forEach((a) => (a.isDefault = false));
    }
    next.push(addr as Address);
    await persist(next);
    if (!error) setShowAdd(false);
  };

  const handleEdit = async (index: number, addr: Omit<Address, 'id'>) => {
    const next = addresses.map((a, i) => {
      if (addr.isDefault) a = { ...a, isDefault: false };
      if (i === index) return { ...a, ...addr };
      return a;
    });
    await persist(next);
    if (!error) setEditingIndex(null);
  };

  const handleDelete = async (index: number) => {
    const next = addresses.filter((_, i) => i !== index);
    // If deleted was default, make first remaining default
    if (addresses[index].isDefault && next.length > 0) {
      next[0].isDefault = true;
    }
    await persist(next);
  };

  const handleSetDefault = async (index: number) => {
    const next = addresses.map((a, i) => ({ ...a, isDefault: i === index }));
    await persist(next);
  };

  return (
    <>
      <PageHeader
        title="Saved Addresses"
        breadcrumb={
          <Breadcrumb
            items={[
              { label: 'Account', href: '/account' },
              { label: 'Addresses' },
            ]}
          />
        }
      />

      <PageShell className="pb-(--space-section) md:pb-(--space-section-lg)">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <aside>
            <AccountNav current="/account/addresses" />
          </aside>

          <div className="space-y-4 md:col-span-3">
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/15 px-3 py-2 text-(length:--text-caption) text-destructive"
              >
                {error}
              </p>
            )}

            {addresses.map((address, index) => (
              <Card key={address.id || index}>
                <CardContent>
                  {editingIndex === index ? (
                    <>
                      <p className="mb-3 font-medium">Edit Address</p>
                      <AddressForm
                        initial={address}
                        onSave={(addr) => handleEdit(index, addr)}
                        onCancel={() => setEditingIndex(null)}
                        isSaving={isSaving}
                      />
                    </>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-(length:--text-caption) font-semibold">
                            {address.label}
                          </span>
                          {address.isDefault && (
                            <Badge variant="outline" className="border-primary/40 text-primary">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-(length:--text-caption)">{address.fullName}</p>
                        <p className="text-(length:--text-caption) text-muted-foreground">
                          {address.phone}
                        </p>
                        <p className="text-(length:--text-caption) text-muted-foreground">
                          {address.address}, {address.city}, {address.state} {address.postalCode},{' '}
                          {address.country}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {!address.isDefault && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="press"
                            aria-label={`Set ${address.label} as default address`}
                            onClick={() => handleSetDefault(index)}
                            disabled={isSaving}
                          >
                            <Star aria-hidden="true" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="press"
                          aria-label={`Edit ${address.label}`}
                          onClick={() => {
                            setShowAdd(false);
                            setEditingIndex(index);
                          }}
                          disabled={isSaving}
                        >
                          <Pencil aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${address.label}`}
                          onClick={() => handleDelete(index)}
                          disabled={isSaving}
                          className="press text-destructive hover:text-destructive"
                        >
                          <Trash2 aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {showAdd ? (
              <Card>
                <CardHeader>
                  <CardTitle>New Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <AddressForm
                    initial={{ ...EMPTY_ADDRESS, isDefault: addresses.length === 0 }}
                    onSave={handleAdd}
                    onCancel={() => setShowAdd(false)}
                    isSaving={isSaving}
                  />
                </CardContent>
              </Card>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="press w-full"
                onClick={() => {
                  setEditingIndex(null);
                  setShowAdd(true);
                }}
                disabled={isSaving}
              >
                <Plus aria-hidden="true" className="mr-2" /> Add New Address
              </Button>
            )}

            {addresses.length === 0 && !showAdd && (
              <EmptyState
                icon={MapPin}
                title="No saved addresses yet"
                description="Add one to speed up checkout."
              />
            )}
          </div>
        </div>
      </PageShell>
    </>
  );
}

export default function AddressesPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <AddressesContent />
      </AppShell>
    </ProtectedRoute>
  );
}
