import Link from 'next/link';
import { LogoFull } from './Logo';

/**
 * Shared frame for /terms and /privacy.
 *
 * The two pages used to set `text-gray-900` headings and `text-gray-600` body copy on the
 * site's near-black background, which rendered the headings invisible (checked by screenshot
 * 2026-10-17). Everything here uses the dark palette from tailwind.config.ts.
 *
 * The app shows these pages from `TERMS_URL` / `PRIVACY_URL` (src/lib/legal.ts in the app repo)
 * and asks every user to accept them again whenever `TERMS_VERSION` / `PRIVACY_VERSION` changes.
 * The `version` shown here must match those constants.
 */
export function LegalPage({ title, version, effective, intro, children }: {
  title: string;
  version: string;
  effective: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/90 backdrop-blur-lg border-b border-dark-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/"><LogoFull className="text-2xl font-bold" /></Link>
          <Link href="/" className="text-sm text-dark-muted hover:text-dark-text transition-colors">← Back to Home</Link>
        </div>
      </nav>

      <header className="pt-28 pb-10 px-6 border-b border-dark-border">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-dark-text mb-3">{title}</h1>
          <p className="text-dark-muted text-sm">
            Version {version} · Effective {effective}
          </p>
          <p className="text-dark-muted text-sm mt-1">
            AMSEK RESEARCH LABS LLP (&ldquo;Loxymity&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
          </p>
          {intro && <div className="mt-6 text-[15px] leading-relaxed text-[#D6D3CE] space-y-3">{intro}</div>}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">
        <div className="space-y-12">{children}</div>
      </main>

      <footer className="py-10 px-6 bg-dark-bg border-t border-dark-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="mb-2"><LogoFull className="text-xl font-bold opacity-80" /></div>
            <p className="text-dark-muted text-sm">© {new Date().getFullYear()} AMSEK RESEARCH LABS LLP. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm text-dark-muted">
            <Link href="/privacy/" className="hover:text-dark-text transition-colors">Privacy Policy</Link>
            <Link href="/terms/" className="hover:text-dark-text transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-dark-text transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl md:text-2xl font-bold text-dark-text mb-4">{title}</h2>
      <div className="text-[15px] leading-relaxed text-[#D6D3CE] space-y-3 [&_strong]:text-dark-text [&_a]:text-primary [&_a:hover]:underline">
        {children}
      </div>
    </section>
  );
}

export function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold text-dark-text">{title}</h3>
      {children}
    </div>
  );
}

export function List({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-5 space-y-2 marker:text-dark-muted">{children}</ul>;
}

/** A highlighted block for the clauses a reader most needs to see (safety limits, liability). */
export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-3">{children}</div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-dark-border">
      <table className="w-full text-sm">
        <thead className="bg-dark-surface text-dark-text">
          <tr>{head.map((h) => <th key={h} className="text-left font-semibold px-4 py-3 align-top">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-dark-border">
          {rows.map((r, i) => (
            <tr key={i} className="align-top">
              {r.map((c, j) => <td key={j} className={`px-4 py-3 ${j === 0 ? 'text-dark-text font-medium' : 'text-[#D6D3CE]'}`}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const LEGAL_VERSION = '2026-10-17';
export const LEGAL_EFFECTIVE = '17 October 2026';
