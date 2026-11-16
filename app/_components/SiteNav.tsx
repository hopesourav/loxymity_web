import Link from 'next/link';
import { LogoFull } from './Logo';
import { MobileMenu } from './MobileMenu';

/**
 * The one top bar for every public page (landing, legal, business, place suggestions).
 * Links are absolute (`/#pricing`) so they work from any page. `back` replaces the section links
 * with one "← Home" link (legal pages read better without them).
 */
const LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#privacy', label: 'Privacy' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/business/', label: 'Business' },
];

export function SiteNav({ back = false }: { back?: boolean }) {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-dark-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="Loxymity home" className="shrink-0">
          <LogoFull className="text-2xl" />
        </Link>

        {!back && (
          <div className="hidden items-center gap-7 text-sm font-medium text-dark-muted md:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-dark-text">{l.label}</a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-4">
          {back ? (
            <Link href="/" className="text-sm text-dark-muted transition-colors hover:text-dark-text">← Home</Link>
          ) : (
            <a
              href="/dashboard/login/"
              className="hidden text-sm font-medium text-dark-muted transition-colors hover:text-dark-text sm:inline"
            >
              Dashboard
            </a>
          )}
          <a
            href="/#download"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-dark-bg transition-colors hover:bg-primary-dark sm:px-5"
          >
            Get the app
          </a>
          {!back && <MobileMenu links={LINKS} />}
        </div>
      </div>
    </nav>
  );
}
