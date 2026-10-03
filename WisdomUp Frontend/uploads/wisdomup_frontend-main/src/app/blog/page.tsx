import type { Metadata } from 'next';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';

import { AppShell } from '@/components/layout/AppShell';
import { JsonLd } from '@/components/common/JsonLd';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';
import { breadcrumbJsonLd } from '@/lib/jsonLd';
import { getDeploymentMarket } from '@/lib/market';
import { formatPostDate, getPosts, postDate } from '@/lib/posts';
import { createMetadata } from '@/lib/seo';
import { getImageUrl } from '@/lib/utils';

const description =
  'Buying guides, setup help and product news from WisdomUp — how to choose earbuds, power banks, chargers and smart watches in Pakistan.';

export const metadata: Metadata = createMetadata({
  title: 'Blog',
  description,
  path: '/blog',
});

export const revalidate = 600;

/**
 * DEV-005. /blog was linked from the footer of every page and returned 404 —
 * a site-wide broken link firing on 100% of pageviews, and the reason it could
 * not simply be built is that Payload had no model for a post. It has one now
 * (`posts`), so this is a real index rather than a placeholder.
 *
 * The legacy shop.wisdomup.pk storefront's published posts still need importing
 * (DEV-003, infrastructure work outside this change). Until they are, this
 * renders an honest empty state at 200 rather than a 404.
 */
export default async function BlogIndexPage() {
  const market = getDeploymentMarket();
  const posts = await getPosts(market);

  return (
    <AppShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ])}
      />

      <PageHeader title="Blog" subtitle={description} />

      <PageShell className="pb-(--space-section) md:pb-(--space-section-lg)">
        {posts.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="No posts published yet"
            description="Guides and product news will appear here as soon as they are published."
            action={
              <Button variant="primary" size="cta" render={<Link href="/products" />}>
                Browse products
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="hover-lift group flex flex-col overflow-hidden rounded-lg border border-border bg-card/40 transition-colors duration-(--duration-instant) ease-out hover:border-border-accent"
              >
                <Link href={`/blog/${post.slug}`} className="relative block aspect-16/9 overflow-hidden bg-surface-2">
                  <ImageWithFallback
                    src={getImageUrl(post.coverImage, 'card')}
                    fallbackSrc="/images/logo.png"
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    // Only the first row is above the fold; the rest lazy-load.
                    priority={index < 3}
                    className="image-zoom object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col p-(--space-card)">
                  <time
                    dateTime={postDate(post)}
                    className="text-(length:--text-micro) uppercase tracking-(--tracking-eyebrow) text-muted-foreground"
                  >
                    {formatPostDate(post)}
                  </time>

                  <h2 className="mt-3 text-(length:--text-h3) font-semibold leading-snug text-foreground">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition-colors duration-(--duration-instant) ease-out group-hover:text-primary"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {post.excerpt && (
                    <p className="mt-3 flex-1 text-(length:--text-caption) leading-(--leading-body) text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}

                  <span className="mt-4 text-(length:--text-caption) font-medium text-primary">
                    Read more →
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </PageShell>
    </AppShell>
  );
}
