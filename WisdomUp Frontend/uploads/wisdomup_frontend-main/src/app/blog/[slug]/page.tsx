import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AppShell } from '@/components/layout/AppShell';
import { JsonLd } from '@/components/common/JsonLd';
import { RichText, richTextToPlainText } from '@/components/common/RichText';
import { ProductGridCard } from '@/app/products/components/ProductGridCard';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { PageShell } from '@/components/ui/page-shell';
import { breadcrumbJsonLd } from '@/lib/jsonLd';
import { getDeploymentMarket, getServerMarket } from '@/lib/market';
import { formatPostDate, getPost, getPosts, postDate } from '@/lib/posts';
import { absoluteUrl, createMetadata, siteUrl } from '@/lib/seo';
import { SITE_NAME } from '@/lib/constants';
import { getImageUrl } from '@/lib/utils';
import type { Product } from '@/types';

type BlogPostProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts(getDeploymentMarket());
  return posts.filter((post) => post.slug).map((post) => ({ slug: post.slug }));
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

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return createMetadata({
      title: 'Post not found',
      description: 'This article is not available.',
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  const cover = getImageUrl(post.coverImage, 'large');

  return createMetadata({
    title: post.seo?.metaTitle?.trim() || post.title,
    description:
      post.seo?.metaDescription?.trim() ||
      post.excerpt?.trim() ||
      richTextToPlainText(post.content, 155) ||
      `${post.title} — from the WisdomUp blog.`,
    path: `/blog/${slug}`,
    ...(cover !== '/images/placeholder.png' ? { image: cover } : {}),
    noIndex: Boolean(post.seo?.noIndex),
  });
}

/**
 * DEV-005 / DEV-010.
 *
 * One indexable URL per article, with Article structured data whose
 * `datePublished` comes from the post's own `publishedAt` — so a post migrated
 * from the legacy storefront keeps its original date rather than appearing to
 * have been written on import day (DEV-003).
 */
export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  // Request-derived, matching the root layout and the rest of the tree.
  const market = await getServerMarket();

  const post = await getPost(slug, market);
  if (!post) notFound();

  const cover = getImageUrl(post.coverImage, 'large');
  const hasCover = cover !== '/images/placeholder.png';

  // Only fully-populated relationships can be rendered as cards; depth=2 gives
  // us objects, but a document that lost its relation comes back as an id.
  const relatedProducts = (post.relatedProducts ?? []).filter(
    (entry): entry is Product => typeof entry === 'object' && entry !== null
  );

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: postDate(post),
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: post.author?.trim() || SITE_NAME },
    publisher: { '@id': `${siteUrl.origin}/#organization` },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    ...(hasCover ? { image: [absoluteUrl(cover)] } : {}),
    ...(post.excerpt?.trim() ? { description: post.excerpt.trim() } : {}),
  };

  return (
    <AppShell>
      <JsonLd
        data={[
          articleJsonLd,
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <PageShell className="pt-4 pb-2">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: post.title },
          ]}
        />
      </PageShell>

      <PageShell as="article" className="pb-(--space-section) md:pb-(--space-section-lg)">
        <header className="mx-auto max-w-3xl pt-6 md:pt-10">
          <time
            dateTime={postDate(post)}
            className="text-(length:--text-micro) uppercase tracking-(--tracking-eyebrow) text-primary"
          >
            {formatPostDate(post)}
          </time>

          <h1 className="mt-4 font-heading font-(--weight-heading) text-(length:--text-h1) leading-(--leading-heading) tracking-(--tracking-heading) text-balance">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-(length:--text-body) leading-(--leading-body) text-muted-foreground text-pretty">
              {post.excerpt}
            </p>
          )}

          {post.author?.trim() && (
            <p className="mt-4 text-(length:--text-caption) text-muted-foreground">
              By {post.author.trim()}
            </p>
          )}
        </header>

        {hasCover && (
          <div className="relative mx-auto mt-10 aspect-16/9 max-w-4xl overflow-hidden rounded-lg border border-border bg-surface-2">
            <ImageWithFallback
              src={cover}
              fallbackSrc="/images/logo.png"
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
              className="object-cover"
            />
          </div>
        )}

        <div className="mx-auto mt-10 max-w-3xl">
          <RichText content={post.content} />
        </div>
      </PageShell>

      {relatedProducts.length > 0 && (
        <section className="section-rhythm border-t border-border">
          <PageShell>
            <h2 className="mb-(--space-block) font-heading font-(--weight-heading) text-(length:--text-h2) leading-(--leading-heading)">
              Products in this article
            </h2>
            {/* The crawl path from an article to something buyable. Without it a
                blog post is a leaf node that passes nothing on. */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {relatedProducts.map((product) => (
                <ProductGridCard key={product.id} product={product} />
              ))}
            </div>
          </PageShell>
        </section>
      )}

      <PageShell className="pb-(--space-section)">
        <Link
          href="/blog"
          className="text-(length:--text-caption) font-medium text-primary underline underline-offset-4"
        >
          ← All posts
        </Link>
      </PageShell>
    </AppShell>
  );
}
