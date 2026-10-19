import type { Metadata } from 'next';
import Link from 'next/link';
import { LogoFull } from '../_components/Logo';
import BusinessEnquiryForm, { BUSINESS_EMAIL } from '../_components/BusinessEnquiryForm';

/**
 * loxymity.com/business/ — "For businesses" (business review 2026-10-19, plan §6 C).
 *
 * Names NO price: a quote depends on people, services and monitoring, and the enquiries are how we
 * learn which business pilot to run first. Copy rule: the Terms say Loxymity "is not a monitoring
 * product for employers" and offer business terms only under a written agreement (§4.3), so this
 * page sells safety the person controls and partnerships under a signed agreement — never tracking
 * employees. Do not promise BS 8484, a monitoring centre or legal compliance until one exists.
 */
export const metadata: Metadata = {
  title: 'Loxymity for organisations — safety people control',
  description:
    'Lone-worker safety, an employee and family safety benefit, care organisations, and partnerships with insurers and banks. Location is shared by the person, for their safety — never sold. Talk to us.',
};

const OFFERS = [
  {
    title: 'Lone-worker safety',
    body: 'For people who work alone — in care, utilities, property or retail. An SOS that reaches the team at once (on Android it rings through silent mode), crash detection with an “Are you OK?” countdown, one-tap “Arrived safely” check-ins, and replies the worker can see: “Seen”, “On my way”.',
    note: 'Tell us whether you need 24/7 professional monitoring — it shapes what we propose.',
  },
  {
    title: 'Employee & family safety benefit',
    body: 'Give your people Loxymity Platinum for their families: places with arrival alerts, longer history, driving reports, and a safer journey home after a late shift. A benefit people choose to use, designed to support your duty of care.',
  },
  {
    title: 'Care organisations',
    body: 'Care circles for older people living independently: a loud SOS, places with arrival and leave alerts, and the family and carers who look after them kept in the loop — with the person in control of what is shared.',
  },
  {
    title: 'Insurers, banks & partners',
    body: 'Offer Loxymity to your customers as a benefit. Any sharing with you — driving insights, for example — would happen only when the person chooses it, one score or event at a time, never their trail.',
  },
];

const PRINCIPLES = [
  'People see what is shared and with whom, and can pause it at any time.',
  'Location is never sold, and there is no advertising.',
  'Every organisation works with us under a signed agreement, including a data-processing agreement.',
  'Enquiries welcome from India, the United Kingdom, the European Union and the United States.',
];

const FAQ = [
  {
    q: 'Why are there no prices on this page?',
    a: 'Because a fair quote depends on how many people, which services, and whether you need 24/7 monitoring. Tell us what you need and we will come back with one.',
  },
  {
    q: 'Can we use Loxymity to track our employees?',
    a: 'No. Loxymity is not a monitoring tool for employers. People share their own location, choose who sees it and can pause it — that is what makes it a safety product. Business use is only under a written agreement with us, as our Terms say.',
  },
  {
    q: 'Where are you available?',
    a: 'The app is on the App Store and Google Play. We are talking to organisations in India, the UK, the EU and the US — tell us where your people are.',
  },
  {
    q: 'Is our data sold?',
    a: 'Never. There is no advertising either. We use service providers only to run the service; they are listed in our Privacy Policy.',
  },
];

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/90 backdrop-blur-lg border-b border-dark-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/"><LogoFull className="text-2xl font-bold" /></Link>
          <div className="flex items-center gap-5">
            <Link href="/" className="hidden sm:inline text-sm text-dark-muted hover:text-dark-text transition-colors">← Home</Link>
            <a href="#enquiry" className="bg-primary hover:bg-primary-dark text-dark-bg text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
              Talk to us
            </a>
          </div>
        </div>
      </nav>

      <header className="relative pt-36 pb-16 px-6 overflow-hidden">
        <div className="aurora" aria-hidden="true"><span className="a1" /><span className="a3" /></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-hud uppercase tracking-wide text-sm font-semibold text-primary mb-4">For organisations</p>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-dark-text tracking-tight leading-tight">
            Safety for the people who work for you — <span className="text-gradient">and the people they go home to.</span>
          </h1>
          <p className="text-dark-muted text-lg mt-6">
            Loxymity is location sharing that people choose and control: shared by the person, for their safety.
            Never sold, no ads.
          </p>
          <a href="#enquiry" className="inline-block mt-8 bg-primary hover:bg-primary-dark text-dark-bg font-bold px-8 py-3.5 rounded-xl transition-colors">
            Talk to us
          </a>
        </div>
      </header>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-dark-text text-center mb-10">What we offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {OFFERS.map((o) => (
              <div key={o.title} className="card-premium gradient-border rounded-3xl p-7">
                <h3 className="text-dark-text text-xl font-bold mb-3">{o.title}</h3>
                <p className="text-dark-muted text-sm leading-relaxed">{o.body}</p>
                {o.note && <p className="text-dark-text text-sm mt-3">{o.note}</p>}
              </div>
            ))}
          </div>
          <p className="text-dark-muted text-sm text-center mt-8">
            Interested in a white-label or reseller arrangement? Tick it in the form below.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-dark-surface/40 border-y border-dark-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-semibold text-dark-text text-center mb-8">How we work with organisations</h2>
          <ul className="space-y-3">
            {PRINCIPLES.map((p) => (
              <li key={p} className="flex items-start gap-3 text-dark-muted">
                <svg className="w-5 h-5 text-brand-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-semibold text-dark-text text-center mb-6">Questions</h2>
          <div className="divide-y divide-dark-border">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="py-5 group">
                <summary className="flex items-center justify-between cursor-pointer text-dark-text font-semibold text-base leading-snug pr-1 gap-4">
                  <span>{q}</span>
                  <svg className="faq-chevron w-5 h-5 text-dark-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-dark-muted text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="enquiry" className="scroll-mt-20 py-16 px-6">
        <div className="max-w-3xl mx-auto rounded-3xl border border-dark-border bg-dark-surface p-7 md:p-10">
          <h2 className="font-display text-3xl font-semibold text-dark-text mb-2">Talk to us</h2>
          <p className="text-dark-muted text-sm mb-8">
            Tell us about your organisation and what you need. We reply within 2 working days. Prefer email?
            Write to <a href={`mailto:${BUSINESS_EMAIL}`} className="text-primary hover:underline">{BUSINESS_EMAIL}</a>.
          </p>
          <BusinessEnquiryForm />
        </div>
      </section>

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
