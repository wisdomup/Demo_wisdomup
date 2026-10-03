import type { Metadata } from 'next';

import { AppShell } from '@/components/layout/AppShell';
import { LastUpdated, Prose, ProseSection } from '@/components/common/Prose';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';
import { createMetadata } from '@/lib/seo';
import { CONTACT } from '@/lib/site-config';

const description =
  'How WisdomUp approaches accessibility, what the site already does, what is still outstanding, and how to report a barrier.';

export const metadata: Metadata = createMetadata({
  title: 'Accessibility',
  description,
  path: '/accessibility',
});

/**
 * DEV-006: "Accessibility" was a footer link resolving to /products.
 *
 * The claims below are deliberately limited to what the codebase actually
 * implements — a skip link, keyboard-reachable dialogs, labelled controls,
 * ordered breadcrumbs. An accessibility statement asserting conformance nobody
 * has tested is worse than none, so the outstanding work is named rather than
 * papered over.
 */
export default function AccessibilityPage() {
  return (
    <AppShell>
      <PageHeader title="Accessibility" subtitle={description} />

      <PageShell className="pb-(--space-section) md:pb-(--space-section-lg)">
        <Prose>
          <LastUpdated date="6 September 2026" />

          <ProseSection title="Our aim">
            <p>
              We want anyone to be able to browse, compare and buy from this site,
              regardless of how they use the web. We work towards the{' '}
              <strong>Web Content Accessibility Guidelines 2.1, Level AA</strong>, and treat
              accessibility defects as ordinary bugs rather than a separate backlog.
            </p>
          </ProseSection>

          <ProseSection title="What the site does today">
            <ul>
              <li>A “Skip to content” link is the first thing keyboard focus reaches on
                every page.</li>
              <li>The whole site is operable by keyboard: menus, filter panels, the cart
                drawer and dialogs can all be opened, moved through and closed with the
                keyboard alone, and Escape closes them.</li>
              <li>Dialogs trap focus while open and return it to the control that opened
                them.</li>
              <li>Form fields carry visible labels and error messages that are announced,
                not just coloured red.</li>
              <li>Breadcrumbs are marked up as an ordered list, so assistive technology
                announces depth and position.</li>
              <li>Decorative images are hidden from assistive technology; content images
                carry descriptive alternative text.</li>
              <li>Interactive controls have a visible focus ring that meets contrast
                requirements.</li>
              <li>Ratings and stock states are conveyed as text, not by colour or icon
                alone.</li>
            </ul>
          </ProseSection>

          <ProseSection title="Known gaps">
            <p>
              We have not yet completed an independent audit, so we do not claim full Level
              AA conformance. Areas we know need work:
            </p>
            <ul>
              <li>Some legacy CMS-authored sections can be published with colour
                combinations below the required contrast ratio.</li>
              <li>Video content does not yet carry captions throughout.</li>
              <li>The homepage carousel autoplays; it exposes controls, but we intend to
                make it respect a reduced-motion preference everywhere it appears.</li>
            </ul>
          </ProseSection>

          <ProseSection title="Report a barrier">
            <p>
              If something on this site stopped you doing what you came to do, please tell
              us — it is the fastest way for us to fix it. Email{' '}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or call{' '}
              <a href={`tel:${CONTACT.phoneE164}`}>{CONTACT.phoneDisplay}</a> ({CONTACT.hours}).
              Describe the page and what happened; a screenshot helps but is not required.
            </p>
            <p>
              We aim to acknowledge accessibility reports within two working days. If you
              cannot complete a purchase because of a barrier on the site, we will take the
              order over the phone or WhatsApp instead.
            </p>
          </ProseSection>
        </Prose>
      </PageShell>
    </AppShell>
  );
}
