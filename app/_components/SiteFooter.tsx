import Link from 'next/link';
import { LogoFull } from './Logo';
import { StoreButtons } from './StoreButtons';
import { SOCIAL_LINKS } from '../_lib/seo';

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
 * - Our YouTube, Instagram and Facebook pages are linked here with rel="me" (2026-11-23): together
 *   with the organisation's `sameAs` (`_lib/seo.ts`) they tell search engines the profiles are ours.
 */
const COLUMNS: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: 'Product',
    links: [
      { href: '/features/', label: 'Features' },
      { href: '/pricing/', label: 'Pricing' },
      { href: '/help/', label: 'Help centre' },
      { href: '/places/suggest/', label: 'Suggest a place name' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about/', label: 'About Loxymity' },
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

// 24×24 glyphs, drawn with fill-rule evenodd (holes are separate subpaths). Inline SVG: no icon font,
// no third-party script.
const SOCIALS = [
  {
    label: 'YouTube',
    href: SOCIAL_LINKS.youtube,
    icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    label: 'Instagram',
    href: SOCIAL_LINKS.instagram,
    icon: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm5.25-4a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z',
  },
  {
    label: 'Facebook',
    href: SOCIAL_LINKS.facebook,
    icon: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
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
          <ul className="mt-5 flex items-center gap-2" aria-label="Loxymity on social media">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={`Loxymity on ${s.label}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-dark-muted transition-colors hover:border-white/20 hover:text-dark-text"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d={s.icon} /></svg>
                </a>
              </li>
            ))}
          </ul>
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
