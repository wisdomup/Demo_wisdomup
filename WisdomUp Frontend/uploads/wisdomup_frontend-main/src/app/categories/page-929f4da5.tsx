import type { Metadata } from 'next';
import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';

import { AppShell } from '@/components/layout/AppShell';
import { JsonLd } from '@/components/common/JsonLd';
import { CategoryCard } from '@/components/landing/CategoryCard';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageShell } from '@/components/ui/page-shell';
import { getCategories } from '@/lib/catalog';
import { breadcrumbJsonLd } from '@/lib/jsonLd';
import { absoluteUrl, createMetadata } from '@/lib/seo';
import { resolveMediaUrl } from '@/lib/sectionStyle';

const description =
  'Every WisdomUp product category in one place — earbuds, headphones, speakers, smart watches, power banks, chargers and cables, all shipping across Pakistan.';

export const metadata: Metadata = createMetadata({
  title: 'Shop by Category',
  description,
  path: '/categories',
});

export const revalidate = 3600;

const FALLBACK_IMAGE = '/images/hero-slide-web.png';

/**
 * The category index.
 *
 * This route existed but rendered the words "Categories will be loaded from the
 * API…" — an unfinished stub that returned 200, carried metadata and was
 * therefore indexable, while being reachable from nowhere on the site. A crawl
 * from the homepage found zero inbound links to it.
 *
 * It is worth finishing rather than deleting: DEV-011 replaced query-param
 * taxonomy with a route per category, and those routes need a hub that links to
 * all of them from one place. Every category route now gets an internal link
 * from here, from the header's Shop By menu and from the footer.
 */
export default async function CategoriesPage() {
  const categories = await getCategories();

  // Sub-categories are reached from their parent, so the index lists the top
  // level only — otherwise the hub dilutes the very links it exists to pass on.
  const topLevel = categories.filter((category) => !category.parent && category.slug);

  return (
    <AppShell>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Shop by Category', path: '/categories' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'WisdomUp product categories',
            numberOfItems: topLevel.length,
            itemListElement: topLevel.map((category, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: category.name,
              url: absoluteUrl(`/${category.slug}`),
            })),
          },
        ]}
      />

      <PageShell className="pt-4 pb-2">
        <Breadcrumb
          items={[{ label: 'Home', href: '/' }, { label: 'Shop by Category' }]}
        />
      </PageShell>

      <PageShell as="section" className="py-6 md:py-10">
        <h1 className="font-heading font-(--weight-heading) text-(length:--text-h1) leading-(--leading-heading) text-balance">
          Shop by Category
        </h1>
        <p className="mt-3 max-w-3xl text-(length:--text-body) leading-(--leading-body) text-muted-foreground text-pretty">
          {description}
        </p>
      </PageShell>

      <PageShell className="pb-(--space-section) md:pb-(--space-section-lg)">
        {topLevel.length === 0 ? (
          <EmptyState
            icon={LayoutGrid}
            title="No categories published yet"
            description="Categories appear here as soon as they are published in the catalogue."
            action={
              <Button variant="primary" size="cta" render={<Link href="/products" />}>
                Browse all products
              </Button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {topLevel.map((category) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  image={resolveMediaUrl(category.image as never) ?? FALLBACK_IMAGE}
                  href={`/${category.slug}`}
                />
              ))}
            </div>

            <p className="mt-(--space-block) text-(length:--text-body) text-muted-foreground">
              Looking for something specific?{' '}
              <Link href="/products" className="text-primary underline underline-offset-2">
                Browse the full catalogue
              </Link>{' '}
              or{' '}
              <Link href="/help" className="text-primary underline underline-offset-2">
                ask us
              </Link>
              .
            </p>
          </>
        )}
      </PageShell>
    </AppShell>
  );
}
