'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useLogoutMutation, useUpdateProfileMutation } from '@/store/api/authApi';
import { logout, setUser } from '@/store/slices/authSlice';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Loader2, Pencil, X, Check } from 'lucide-react';

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

function AccountContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saveError, setSaveError] = useState('');

  const handleEditStart = () => {
    setName(user?.name ?? '');
    setPhone(user?.phone ?? '');
    setSaveError('');
    setEditing(true);
  };

  const handleEditCancel = () => {
    setEditing(false);
    setSaveError('');
  };

  const handleSave = async () => {
    if (!user) return;
    setSaveError('');
    try {
      const result = await updateProfile({ id: user.id, name: name.trim(), phone: phone.trim() }).unwrap();
      dispatch(setUser(result.doc));
      setEditing(false);
    } catch {
      setSaveError('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Logout even if API call fails
    }
    dispatch(logout());
    router.push('/');
  };

  if (!user) return null;

  const addresses = user.addresses ?? [];
  const extraAddresses = addresses.length - 3;

  return (
    <>
      <PageHeader
        title="My Account"
        actions={
          <Button type="button" variant="outline" className="press" onClick={handleLogout}>
            Sign Out
          </Button>
        }
      />

      <PageShell className="pb-(--space-section) md:pb-(--space-section-lg)">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <aside>
            <AccountNav current="/account" />
          </aside>

          <div className="space-y-6 md:col-span-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                {!editing && (
                  <Button type="button" variant="ghost" size="sm" className="press" onClick={handleEditStart}>
                    <Pencil aria-hidden="true" className="mr-1" /> Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {editing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field name="name" label="Name">
                        {(field) => (
                          <Input
                            {...field}
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                          />
                        )}
                      </Field>
                      <Field name="phone" label="Phone">
                        {(field) => (
                          <Input
                            {...field}
                            type="tel"
                            autoComplete="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+92 300 0000000"
                          />
                        )}
                      </Field>
                      <Field name="email" label="Email">
                        {(field) => (
                          <Input
                            {...field}
                            type="email"
                            spellCheck={false}
                            value={user.email}
                            disabled
                            readOnly
                          />
                        )}
                      </Field>
                      <Field name="role" label="Role">
                        {(field) => (
                          <Input {...field} value={user.role} disabled readOnly className="capitalize" />
                        )}
                      </Field>
                    </div>
                    {saveError && (
                      <p role="alert" className="text-(length:--text-caption) text-destructive">
                        {saveError}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button type="button" className="press" onClick={handleSave} disabled={isSaving} size="sm">
                        {isSaving ? (
                          <Loader2 aria-hidden="true" className="mr-1 animate-spin" />
                        ) : (
                          <Check aria-hidden="true" className="mr-1" />
                        )}
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="press"
                        onClick={handleEditCancel}
                        disabled={isSaving}
                      >
                        <X aria-hidden="true" className="mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-(length:--text-caption) text-muted-foreground">Name</dt>
                      <dd className="font-medium">{user.name}</dd>
                    </div>
                    <div>
                      <dt className="text-(length:--text-caption) text-muted-foreground">Email</dt>
                      <dd className="font-medium">{user.email}</dd>
                    </div>
                    <div>
                      <dt className="text-(length:--text-caption) text-muted-foreground">Phone</dt>
                      <dd className="font-medium">
                        {user.phone || <span className="text-muted-foreground">Not set</span>}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-(length:--text-caption) text-muted-foreground">Role</dt>
                      <dd className="font-medium capitalize">{user.role}</dd>
                    </div>
                    <div>
                      <dt className="text-(length:--text-caption) text-muted-foreground">Member Since</dt>
                      <dd className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </dd>
                    </div>
                  </dl>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Saved Addresses</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="press"
                  render={<Link href="/account/addresses" />}
                >
                  Manage
                </Button>
              </CardHeader>
              <CardContent>
                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.slice(0, 3).map((address, index) => (
                      <div key={address.id || index}>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-(length:--text-caption) font-medium">{address.label}</span>
                          {address.isDefault && (
                            <Badge variant="outline" className="border-primary/40 text-primary">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-(length:--text-caption) text-muted-foreground">
                          {address.fullName} &middot; {address.phone}
                        </p>
                        <p className="text-(length:--text-caption) text-muted-foreground">
                          {address.address}, {address.city}, {address.state} {address.postalCode}
                        </p>
                        {index < Math.min(addresses.length, 3) - 1 && <Separator className="mt-3" />}
                      </div>
                    ))}
                    {extraAddresses > 0 && (
                      <p className="text-(length:--text-caption) text-muted-foreground">
                        +{extraAddresses} more address{extraAddresses > 1 ? 'es' : ''} -{' '}
                        <Link href="/account/addresses" className="link-underline text-foreground">
                          view all
                        </Link>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-(length:--text-caption) text-muted-foreground">
                    No addresses saved yet.{' '}
                    <Link href="/account/addresses" className="link-underline text-foreground">
                      Add one
                    </Link>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageShell>
    </>
  );
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <AccountContent />
      </AppShell>
    </ProtectedRoute>
  );
}
