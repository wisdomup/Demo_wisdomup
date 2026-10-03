import type { NextConfig } from "next";

const PAYLOAD_HOSTNAME = (process.env.NEXT_PUBLIC_PAYLOAD_PUBLIC_SERVER_URL || '')
  .replace(/^https?:\/\//, '')
  .replace(/\/.*$/, '')
  .split(':')[0] || 'admin.wisdomup.co';

const nextConfig: NextConfig = {
  images: {
    /**
     * DEV-013. Images were being requested at w=3840 — 4K assets shipped to
     * mobile users on Pakistani 3G/4G. AVIF first (~20% smaller than WebP) with
     * WebP as the fallback, and the two 4K device widths dropped entirely so the
     * optimiser cannot emit them however wrong a `sizes` prop is.
     *
     * `qualities` is required from Next 16 on; 60 is the ceiling used for large
     * hero art, 75 stays the default for product photography.
     */
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    qualities: [60, 75],

    /**
     * Next 16 refuses to optimise an upstream that resolves to a private IP —
     * an SSRF guard, and a sensible default. In dev the Payload media host IS
     * a private IP (localhost:3001), so every CMS image failed the check and
     * silently fell back to the placeholders in /public, which made seeded
     * content look broken while hiding that the real image never loaded.
     *
     * Scoped to development on purpose. In production Payload is a public
     * hostname and this flag would be a live SSRF hole into the deploy's own
     * network, so it must never ship enabled.
     */
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
    remotePatterns: [
      // Production Payload CMS
      {
        protocol: 'https',
        hostname: 'admin.wisdomup.co',
        pathname: '/**',
      },
      // Dynamic production hostname from env (covers any custom domain)
      ...(PAYLOAD_HOSTNAME !== 'admin.wisdomup.co'
        ? [{ protocol: 'https' as const, hostname: PAYLOAD_HOSTNAME, pathname: '/**' }]
        : []),
      // Local dev — http
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      // Local dev — https (when Payload is started with a self-signed cert)
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      // 127.0.0.1 variants
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '127.0.0.1',
        port: '3001',
        pathname: '/**',
      },
    ],
  },

  /**
   * Path-preserving permanent redirects for URLs that have moved.
   *
   * Domain-level redirects (.co -> .pk, host and protocol normalisation, and
   * the legacy shop.wisdomup.pk storefront) are deliberately NOT here: they
   * belong at the CDN/hosting edge where they cost no compute.
   */
  async redirects() {
    return [
      // DEV-018: the category slug shipped misspelled. Payload holds the
      // corrected slug; this keeps the old URL's signals.
      {
        source: '/selfi-stick',
        destination: '/selfie-stick',
        permanent: true,
      },
      {
        source: '/products/selfi-stick',
        destination: '/products/selfie-stick',
        permanent: true,
      },
      /**
       * The homepage is the landing page with slug "home", and `/p/[slug]`
       * renders any landing page — so `/p/home` served byte-identical content to
       * `/`, both indexable and both self-canonical. That is duplicate content
       * inside one domain, the same defect DEV-002 describes across two.
       */
      {
        source: '/p/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
