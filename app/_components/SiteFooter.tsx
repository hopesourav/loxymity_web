import Link from 'next/link';
import { LogoFull } from './Logo';
import { StoreButtons } from './StoreButtons';

/**
 * The one footer for every public page.
 *
 * - No link to /admin: the old footer carried one coloured like the background (invisible, but
 *   still focusable and in every crawler's view). Admins know the address.
 * - "Open data" is the ODbL notice (public/open-data/LICENSE-ODbL.txt): place names in the app are
 *   partly derived from OpenStreetMap, and ODbL 4.3 needs a notice that tells people the database
 *   is available and where. It was published but linked from nowhere.
 * - The "Coming soon" section and its fine print were removed 2026-11-19 (the site lists only what the
 *   app does today). A store button switched off in `_lib/appLinks.ts` still shows "Soon".
 */
const COLUMNS: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: 'Product',
    links: [
      { href: '/#features', label: 'Features' },
      { href: '/#pricing', label: 'Pricing' },
      { href: '/#faq', label: 'FAQ' },
      { href: '/places/suggest/', label: 'Suggest a place name' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/business/', label: 'For organisations' },
      { href: 'mailto:support@loxymity.com', label: 'Support' },
      { href: '/privacy/#contact', label: 'Grievance Officer' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy/', label: 'Privacy Policy' },
      { href: '/terms/', label: 'Terms of Service' },
      { href: '/delete-account/', label: 'Delete your account' },
      { href: '/open-data/LICENSE-ODbL.txt', label: 'Open data (ODbL)', external: true },
    ],
  },
];

export function SiteFooter({ showStores = true }: { showStores?: boolean }) {
  return (
    <footer className="border-t border-white/[0.06] bg-dark-bg px-6 pb-10 pt-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" aria-label="Loxymity home"><LogoFull className="text-2xl" /></Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-dark-muted">
            Private location sharing for the people you love. Never sold. No ads.
          </p>
          {showStores && <StoreButtons className="mt-6" align="start" />}
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dark-text">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-dark-muted transition-colors hover:text-dark-text"
                    {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-6xl space-y-2 border-t border-white/[0.06] pt-6 text-xs leading-relaxed text-dark-muted">
        <p>
          © {new Date().getFullYear()} AMSEK RESEARCH LABS LLP, West Bengal, India. All rights reserved. Loxymity
          is not an emergency service — in an emergency, call your local emergency number.
        </p>
        <p>
          Place data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline hover:text-dark-text">OpenStreetMap contributors</a>.
          Apple and the Apple logo are trademarks of Apple Inc. App Store
          is a service mark of Apple Inc. Google Play and the Google Play logo are trademarks of Google LLC.
        </p>
      </div>
    </footer>
  );
}
