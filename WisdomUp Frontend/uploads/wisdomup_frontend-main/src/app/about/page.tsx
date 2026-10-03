import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  ArrowUpRight,
  Sparkles,
  Globe2,
  Leaf,
  Network,
  ShieldCheck,
  Lightbulb,
  Award,
  Factory,
  FlaskConical,
} from 'lucide-react';

import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { PageShell } from '@/components/ui/page-shell';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'About WisdomUp',
  description:
    'Learn how WisdomUp builds premium tech accessories with quality, innovation, and local pride.',
  path: '/about',
});

const stats = [
  { value: '2014', label: 'Founded' },
  { value: '12+', label: 'Product lines' },
  { value: '180k', label: 'Customers' },
  { value: '98%', label: '5-star reviews' },
];

const objectives = [
  {
    n: '01',
    title: 'Empower global tech industry',
    body: 'Producing world-class products that showcase Pakistan’s dominance in the tech space.',
  },
  {
    n: '02',
    title: 'Ensure customer satisfaction',
    body: 'Rigorous quality assurance. Every product is reliable, durable and designed to delight.',
  },
  {
    n: '03',
    title: 'Drive purpose-driven business',
    body: 'We build trust by creating lasting value for the customers and communities we serve.',
  },
];

const differentDetail = [
  {
    n: '01',
    title: 'End-to-end ownership',
    body: 'Unlike many brands that outsource production, WisdomUp retains complete control over the product lifecycle.',
    items: [
      {
        t: 'In-house R&D',
        d: 'Dedicated research and development team designing products tailored to customer needs.',
      },
      {
        t: 'Domestic manufacturing',
        d: 'All production and assembly is conducted in-house, ensuring unmatched quality control.',
      },
    ],
    icon: Factory,
  },
  {
    n: '02',
    title: 'Stringent quality assurance',
    body: 'Every product undergoes multiple testing stages before it carries our name.',
    items: [
      { t: 'Material inspection', d: 'Ensuring all materials meet our stringent standards.' },
      { t: 'Assembly testing', d: 'Verifying proper functionality and durability.' },
      { t: 'Appearance testing', d: 'Confirming aesthetics meet our high standards.' },
      {
        t: 'Laboratory testing',
        d: 'Guaranteeing performance benchmarks before reaching the customer.',
      },
    ],
    icon: FlaskConical,
  },
  {
    n: '03',
    title: 'Purpose-driven innovation',
    body: 'Every product we design is created to solve real-world problems while delivering exceptional performance.',
    items: [],
    icon: Lightbulb,
  },
];

const usp = [
  {
    title: 'Domestically designed, globally competitive',
    body: 'Internationally benchmarked products that rival global brands, while maintaining affordability.',
  },
  {
    title: 'Built for quality and trust',
    body: 'Products crafted with durability, performance, and precision engineering.',
  },
  {
    title: 'Affordable excellence',
    body: 'Premium technology accessible to everyone without compromising quality.',
  },
];

const future = [
  {
    icon: Globe2,
    title: 'Expanding global reach',
    body: 'Entering new markets and delivering innovative tech products worldwide.',
  },
  {
    icon: Network,
    title: 'Strengthening domestic ecosystem',
    body: 'Creating opportunities for local talent and businesses to thrive in the tech sector.',
  },
  {
    icon: Leaf,
    title: 'Sustainability and innovation',
    body: 'Redefining responsible engineering with eco-friendly, forward-thinking solutions.',
  },
];

const whyChoose = [
  {
    icon: Award,
    title: 'Unparalleled quality',
    body: 'Products that undergo stringent testing to ensure reliability.',
  },
  {
    icon: Lightbulb,
    title: 'Purpose-driven innovation',
    body: 'A brand that prioritizes real-world impact.',
  },
  {
    icon: ShieldCheck,
    title: 'Pride in domestic excellence',
    body: 'Tech that is designed, developed, and produced in Pakistan.',
  },
];

// Eight sections open the same way, so the eyebrow and the section heading are
// declared once rather than re-typed with a slightly different size each time.
const eyebrow = 'text-(length:--text-micro) uppercase tracking-(--tracking-eyebrow) text-primary';
const sectionHeading =
  'mt-3 font-heading font-(--weight-heading) text-(length:--text-h2) leading-(--leading-heading) tracking-(--tracking-heading) text-balance';

export default function AboutPage() {
  return (
    <AppShell bleed>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-headphones.png"
            alt="A pair of WisdomUp over-ear headphones"
            fill
            priority
            // DEV-013: the LCP element on this route, behind a 30% overlay —
            // there is nothing for the extra quality to show.
            quality={60}
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-0/20 via-background/70 to-background" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_8%,color-mix(in_oklch,var(--primary)_35%,transparent),transparent_42%)]"
        />

        {/* Bleeding under the floating header means this section owns the
            clearance, and it uses the tall offset so the announcement bar can
            never land on the eyebrow. */}
        <PageShell className="relative pt-[calc(var(--space-header-offset-tall)+var(--space-section))] pb-(--space-section) md:pb-(--space-section-lg)">
          <div className="inline-flex items-center gap-2 rounded-(--radius-pill) border border-border bg-card/45 px-4 py-1.5 text-(length:--text-micro) uppercase tracking-(--tracking-eyebrow) text-muted-foreground backdrop-blur">
            <Sparkles aria-hidden="true" className="h-3 w-3 text-primary" /> About WisdomUp
          </div>

          <h1 className="mt-8 max-w-5xl font-heading font-(--weight-display) text-(length:--text-display) leading-(--leading-display) tracking-(--tracking-display) text-balance">
            Innovating tech.
            <br />
            <em className="not-italic text-primary">Inspiring</em>{' '}
            <span className="font-sans text-foreground/75">Pakistan.</span>
          </h1>

          <div className="mt-12 grid gap-10 md:grid-cols-12">
            <p className="text-(length:--text-body) leading-(--leading-body) text-muted-foreground text-pretty md:col-span-7">
              At WisdomUp, we are more than just a tech brand. We are a purpose-driven movement
              placing Pakistan at the forefront of global technology. From humble beginnings to a
              trusted name in tech, WisdomUp stands as a testament to vision, innovation and
              unwavering dedication.
            </p>
            <div className="flex flex-col gap-3 md:col-span-5 md:col-start-8">
              <a
                href="#story"
                className="group inline-flex items-center justify-between rounded-lg border border-border bg-card/65 px-5 py-4 backdrop-blur transition-colors duration-(--duration-instant) ease-out hover:border-border-accent"
              >
                <span className="text-(length:--text-body) font-medium">Read our story</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 text-muted-foreground transition-transform duration-(--duration-fast) ease-out group-hover:rotate-45"
                />
              </a>
              <a
                href="#vision"
                className="group inline-flex items-center justify-between rounded-lg bg-(image:--gradient-primary) px-5 py-4 text-primary-foreground shadow-(--shadow-glow) transition-opacity duration-(--duration-instant) ease-out hover:opacity-95"
              >
                <span className="text-(length:--text-body) font-semibold">Where we are going</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-(--duration-fast) ease-out group-hover:rotate-45"
                />
              </a>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-background/85 p-(--space-card) backdrop-blur sm:p-(--space-card-lg)"
              >
                <div className="font-heading font-(--weight-heading) text-(length:--text-h2) leading-(--leading-display)">
                  {s.value}
                </div>
                <div className="mt-2 text-(length:--text-micro) uppercase tracking-(--tracking-eyebrow) text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </PageShell>
      </section>

      <section id="story" className="section-rhythm relative">
        <PageShell>
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="md:sticky md:top-24">
                <p className={eyebrow}>Our journey</p>
                <h2 className={sectionHeading}>
                  When and why <em className="not-italic text-primary">we started</em>
                </h2>
                <div aria-hidden="true" className="mt-8 h-px w-16 bg-primary" />
                <dl className="mt-8 space-y-2 text-(length:--text-caption) text-muted-foreground">
                  {[
                    ['Founded', '2014'],
                    ['Headquarters', 'Karachi, PK'],
                    ['Team', '120 people'],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between border-b border-border py-2"
                    >
                      <dt>{k}</dt>
                      <dd className="font-medium text-foreground">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="space-y-8 text-(length:--text-body) leading-(--leading-body) text-foreground/85 md:col-span-7">
              <p>
                Founded in 2014, WisdomUp began as a bootstrapped, homegrown business with a
                single clear purpose: deliver high-quality tech products that meet international
                standards while staying rooted in Pakistan.
              </p>
              <p className="text-muted-foreground">
                Our journey was fueled by a simple yet ambitious idea: create products we can
                proudly call our own. By designing and assembling in-house, we ensure unmatched
                quality at every stage. The result is devices that blend intelligent design,
                real value for customers, and a country moving toward becoming a global leader in
                tech.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border">
                  <Image
                    src="/images/products/headphones.png"
                    alt="WisdomUp product craft"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 45vw, 25vw"
                  />
                </div>
                <div className="relative mt-10 aspect-[4/5] overflow-hidden rounded-lg border border-border">
                  <Image
                    src="/images/image-engineered.png"
                    alt="WisdomUp headquarters"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 45vw, 25vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </PageShell>
      </section>

      <section className="section-rhythm relative border-y border-border bg-card/30">
        <PageShell>
          <div className="mb-(--space-block) max-w-2xl">
            <p className={eyebrow}>Our objective</p>
            <h2 className={sectionHeading}>
              Quality meets <em className="not-italic text-primary">purpose</em>
            </h2>
            <p className="mt-4 text-(length:--text-body) leading-(--leading-body) text-muted-foreground">
              At WisdomUp, our objective extends beyond selling tech products. We aim to:
            </p>
          </div>

          {/* These three are copy, not links: the lift, the tint and the arrow
              that used to grow on hover all pointed nowhere. */}
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            {objectives.map((p) => (
              <div key={p.n} className="bg-background p-(--space-card-lg) sm:p-10">
                <div className="font-heading font-(--weight-heading) text-(length:--text-h2) leading-(--leading-display) text-primary/40">
                  {p.n}
                </div>
                <h3 className="mt-6 text-(length:--text-h3) font-semibold">{p.title}</h3>
                <p className="mt-3 text-(length:--text-caption) leading-(--leading-body) text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </PageShell>
      </section>

      <section id="vision" className="section-rhythm relative">
        <PageShell>
          <div className="grid gap-6 md:grid-cols-12 md:grid-rows-2">
            <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-card via-card to-background p-(--space-card-lg) sm:p-12 md:col-span-7 md:row-span-2">
              <p className={eyebrow}>Our vision</p>
              <h2 className={sectionHeading}>
                Empower the globe with{' '}
                <em className="not-italic text-primary">WisdomUp products.</em>
              </h2>
              <p className="mt-8 max-w-xl text-(length:--text-body) leading-(--leading-body) text-muted-foreground">
                WisdomUp envisions a future where Pakistan dominates the global tech industry. We
                aspire to be pioneers, creating a ripple effect that encourages innovation,
                empowers local talent, and showcases Pakistan’s potential on the world stage.
              </p>
              <p className="mt-4 max-w-xl text-(length:--text-body) leading-(--leading-body) text-muted-foreground">
                Our vision goes beyond profit. It is about purpose. By delivering exceptional
                quality, we instill pride in every Pakistani who chooses WisdomUp.
              </p>
              <p className="mt-10 inline-flex items-center gap-2 text-(length:--text-caption) font-medium text-primary">
                <span aria-hidden="true" className="h-px w-8 bg-primary" /> Built for the long arc
              </p>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-(--radius-pill) bg-primary/20 blur-3xl"
              />
            </div>

            <div className="relative overflow-hidden rounded-lg border border-border md:col-span-5">
              <Image
                src="/images/image-engineered.png"
                alt="WisdomUp HQ"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 35vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-(--space-card)">
                <div className="text-(length:--text-micro) uppercase tracking-(--tracking-eyebrow) text-muted-foreground">
                  HQ
                </div>
                <div className="mt-1 font-heading font-(--weight-heading) text-(length:--text-h3)">Karachi, PK</div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card/60 p-(--space-card-lg) md:col-span-5">
              <div className="font-heading font-(--weight-heading) text-(length:--text-h2) leading-(--leading-display) text-primary">
                10+
              </div>
              <p className="mt-2 text-(length:--text-caption) leading-(--leading-body) text-muted-foreground">
                Years engineering devices in-house. Every iteration sharper than the last.
              </p>
            </div>
          </div>
        </PageShell>
      </section>

      <section className="section-rhythm relative border-t border-border">
        <PageShell>
          <div className="mb-(--space-block) max-w-2xl">
            <p className={eyebrow}>The difference</p>
            <h2 className={sectionHeading}>
              What makes WisdomUp <em className="not-italic text-primary">different</em>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {differentDetail.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.n}
                  className="flex flex-col rounded-lg border border-border bg-card/40 p-(--space-card-lg)"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-heading font-(--weight-heading) text-(length:--text-h2) leading-(--leading-display) text-primary">
                      {d.n}
                    </div>
                    <Icon aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="mt-6 text-(length:--text-h3) font-semibold">{d.title}</h3>
                  <p className="mt-3 text-(length:--text-caption) leading-(--leading-body) text-muted-foreground">
                    {d.body}
                  </p>
                  {d.items.length > 0 && (
                    <div className="mt-6 space-y-4 border-t border-border pt-6">
                      {d.items.map((it) => (
                        <div key={it.t}>
                          <div className="text-(length:--text-caption) font-semibold text-foreground">
                            {it.t}
                          </div>
                          <div className="mt-1 text-(length:--text-caption) leading-(--leading-body) text-muted-foreground">
                            {it.d}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </PageShell>
      </section>

      <section className="section-rhythm relative border-t border-border bg-card/20">
        <PageShell>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className={eyebrow}>Why choose us</p>
              <h2 className={sectionHeading}>
                Our unique <em className="not-italic text-primary">selling proposition</em>
              </h2>
            </div>
            <div className="md:col-span-8 md:border-l md:border-border md:pl-12">
              <div className="divide-y divide-border">
                {usp.map((d, i) => (
                  <div key={d.title} className="grid grid-cols-12 gap-6 py-7">
                    <div className="col-span-2 text-(length:--text-caption) tabular-nums text-muted-foreground">
                      0{i + 1}
                    </div>
                    <h3 className="col-span-10 text-(length:--text-h3) font-medium leading-snug sm:col-span-5">
                      {d.title}
                    </h3>
                    <p className="col-span-12 text-(length:--text-caption) leading-(--leading-body) text-muted-foreground sm:col-span-5">
                      {d.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PageShell>
      </section>

      <section className="section-rhythm relative">
        <PageShell>
          <div className="mb-(--space-block) max-w-2xl">
            <p className={eyebrow}>What’s next</p>
            <h2 className={sectionHeading}>
              The future of <em className="not-italic text-primary">WisdomUp</em>
            </h2>
            <p className="mt-4 text-(length:--text-body) leading-(--leading-body) text-muted-foreground">
              We are just getting started. With plans to expand our product range, refine our
              processes, and set new benchmarks in innovation, we are paving the way for a
              brighter tech-driven future.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {future.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-card via-card to-background p-(--space-card-lg)"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-(length:--text-h3) font-semibold">{f.title}</h3>
                  <p className="mt-3 text-(length:--text-caption) leading-(--leading-body) text-muted-foreground">
                    {f.body}
                  </p>
                </div>
              );
            })}
          </div>
        </PageShell>
      </section>

      <section className="section-rhythm relative border-t border-border">
        <PageShell>
          <div className="mx-auto mb-(--space-block) max-w-2xl text-center">
            <p className={eyebrow}>A statement piece</p>
            <h2 className={sectionHeading}>
              Why choose <em className="not-italic text-primary">WisdomUp</em>
            </h2>
            <p className="mt-4 text-(length:--text-body) leading-(--leading-body) text-muted-foreground">
              When you choose WisdomUp, you are not just buying a product. You are buying a
              statement piece.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            {whyChoose.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="bg-background p-(--space-card-lg) sm:p-10">
                  <div aria-hidden="true" className="h-px w-10 bg-primary" />
                  <Icon aria-hidden="true" className="mt-6 h-5 w-5 text-primary" />
                  <h3 className="mt-4 text-(length:--text-h3) font-semibold">{w.title}</h3>
                  <p className="mt-3 text-(length:--text-caption) leading-(--leading-body) text-muted-foreground">
                    {w.body}
                  </p>
                </div>
              );
            })}
          </div>
        </PageShell>
      </section>

      <section className="section-rhythm relative">
        <PageShell>
          <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-card via-card to-background p-(--space-card-lg) text-center sm:p-16">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_60%)]"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-3xl font-heading font-(--weight-heading) text-(length:--text-h2) leading-(--leading-heading) tracking-(--tracking-heading) text-balance">
                Join us on <em className="not-italic text-primary">our journey.</em>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-(length:--text-body) leading-(--leading-body) text-muted-foreground">
                At WisdomUp, we are committed to revolutionizing tech in Pakistan while making a
                mark on the global stage. Together, let’s build a future where Pakistan leads,
                one innovation at a time.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Button variant="primary" size="cta" render={<Link href="/products" />}>
                  Shop the collection
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="cta" shape="pill" render={<Link href="/register" />}>
                  Get in touch
                </Button>
              </div>
            </div>
          </div>
        </PageShell>
      </section>
    </AppShell>
  );
}
