import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackageSearch } from 'lucide-react';

import { AppShell } from '@/components/layout/AppShell';
import { JsonLd } from '@/components/common/JsonLd';
import { ProductGridCard } from '@/app/products/components/ProductGridCard';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageShell } from '@/components/ui/page-shell';
import { getCategories, getCategory, getProductsByCategorySlug } from '@/lib/catalog';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/jsonLd';
import { getServerMarket } from '@/lib/market';
import { createMetadata, descriptionFor, titleFor } from '@/lib/seo';

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string; availability?: string; price?: string }>;
};

/**
 * A clean, static route per commercial category.
 *
 * DEV-011: categories were addressed as comma-delimited query strings —
 * `/products?category=speaker%2Cheadphone%2Cearbuds%2Caudio-%26-sound`.
 * Multi-value filters generate a combinatorial URL space that wastes crawl
 * budget and duplicates content at scale; they carry no keyword weight, make
 * poor ad landing pages, and cannot be shared. One route per category replaces
 * them. Query params survive only for filtering *within* a category, and those
 * permutations are marked noindex in `generateMetadata` below.
 *
 * Static segments win over this one in the App Router, so /about, /products and
 * every other real route are unaffected. A slug that is not a category 404s.
 */
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories
    .filter((category) => category.slug)
    .map((category) => ({ category: category.slug }));
}

/**
 * Request-rendered, deliberately.
 *
 * The root layout resolves the storefront from the request's host header, so
 * nothing below it can be prerendered. Next normally discovers that by
 * attempting a prerender of the params above and bailing out to dynamic — but
 * when `generateStaticParams` returns an empty list there is nothing to
 * attempt, the route stays classified static, and every on-demand render then
 * throws DYNAMIC_SERVER_USAGE and 500s. An empty list is what a market with no
 * published documents returns, and what a CMS outage during the build returns
 * for any market.
 *
 * Declaring the route dynamic states that outright instead of leaning on the
 * bail-out. The reads behind it are still cached and revalidated, so this costs
 * a render, not a round trip. Drop it if the root layout ever moves to
 * `getDeploymentMarket`.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const { sort, availability, price } = await searchParams;
  const category = await getCategory(slug);

  if (!category) {
    return createMetadata({
      title: 'Category not found',
      description: 'This category is not available.',
      path: `/${slug}`,
      noIndex: true,
    });
  }

  const isFiltered = Boolean(sort || availability || price);

  return createMetadata({
    title: titleFor.category(category.name),
    description: category.description?.trim() || descriptionFor.category(category.name),
    path: `/${slug}`,
    // Sorted and filtered permutations stay crawlable but out of the index, so
    // only the clean category URL competes.
    noIndex: isFiltered ? 'follow' : false,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  // Request-derived, matching the root layout, /products and the client tree.
  // Deployment-derived market came from NEXT_PUBLIC_SITE_URL, so a .pk
  // deployment carrying a .co value asked for `marketScope=global` and rendered
  // every category with an empty product grid.
  const market = await getServerMarket();

  const category = await getCategory(slug);
  if (!category) notFound();

  const products = await getProductsByCategorySlug(slug, market);

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'All Products', path: '/products' },
    { name: category.name, path: `/${slug}` },
  ];

  return (
    <AppShell>
      <JsonLd
        data={[
          breadcrumbJsonLd(breadcrumbs),
          itemListJsonLd(products, `${category.name} in Pakistan`),
        ]}
      />

      <PageShell className="pt-4 pb-2">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'All Products', href: '/products' },
            { label: category.name },
          ]}
        />
      </PageShell>

      <PageShell as="section" className="py-6 md:py-10">
        <h1 className="font-heading font-(--weight-heading) text-(length:--text-h1) leading-(--leading-heading) text-balance">
          {category.name} in Pakistan
        </h1>

        {/*
          Each category needs its own copy to rank — a grid under a bare heading
          is thin content. Editors write it in Payload's category `description`;
          the fallback below states what the page actually offers rather than
          padding it out with filler.
        */}
        <p className="mt-3 max-w-3xl text-(length:--text-body) leading-(--leading-body) text-muted-foreground text-pretty">
          {category.description?.trim() ||
            `Browse the WisdomUp ${category.name.toLowerCase()} range, in stock and shipping across Pakistan. ` +
              `Every order ships with an official warranty, Cash on Delivery is available nationwide, and prices are shown in PKR including tax. ` +
              `Delivery is 3–5 working days as standard, with express options in major cities.`}
        </p>
      </PageShell>

      <PageShell className="pb-(--space-section)">
        {products.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title={`No ${category.name.toLowerCase()} in stock right now`}
            description="New stock lands here as soon as it is published."
            action={
              <Button variant="primary" size="cta" render={<Link href="/products" />}>
                Browse all products
              </Button>
            }
          />
        ) : (
          <>
            <p className="mb-(--space-block) text-(length:--text-caption) text-muted-foreground">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {products.map((product) => (
                <ProductGridCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </PageShell>
    </AppShell>
  );
}
