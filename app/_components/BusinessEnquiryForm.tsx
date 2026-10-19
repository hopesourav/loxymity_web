'use client';

/**
 * The "For businesses" enquiry form (loxymity.com/business/).
 *
 * Posts to the `business-enquiry` edge function (app repo, migration 0292). That function checks the
 * Cloudflare Turnstile token with its secret, drops honeypot posts, re-validates every field
 * (`_shared/businessEnquiry.ts` is the one validator) and stores the enquiry for the admin console.
 * Nothing is sold and no price is quoted here.
 *
 * When the form is switched off (`system_flags.business_enquiries_enabled`) or not configured, the
 * function answers 503 and this component shows the business@ address instead, so the page always
 * has a way to reach us.
 *
 * The Turnstile SITE key is public by design (it is in every page that shows the widget); the
 * secret lives only in Supabase. NEXT_PUBLIC_TURNSTILE_SITE_KEY overrides the built-in one.
 */
import { useEffect, useRef, useState } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://szsipgfrxvvkgqtpwhso.supabase.co';
const ENDPOINT = `${SUPABASE_URL}/functions/v1/business-enquiry`;
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '0x4AAAAAAFbZLcj7Q10tq87A';
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
export const BUSINESS_EMAIL = 'business@loxymity.com';
const MAILTO = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent('Business enquiry')}`;

/** Same values as ORG_SIZES / INTERESTS / MONITORING in the app repo's _shared/businessEnquiry.ts. */
const ORG_SIZES = [
  { value: '1-10', label: '1–10' },
  { value: '11-50', label: '11–50' },
  { value: '51-250', label: '51–250' },
  { value: '251-1000', label: '251–1,000' },
  { value: '1000+', label: '1,000+' },
];
const INTERESTS = [
  { value: 'lone_worker', label: 'Lone-worker safety' },
  { value: 'employee_benefit', label: 'Employee & family safety benefit' },
  { value: 'care', label: 'Care organisations' },
  { value: 'insurance_partner', label: 'Insurance or bank partnership' },
  { value: 'white_label', label: 'White-label / reseller' },
  { value: 'other', label: 'Something else' },
];
const MONITORING = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not_sure', label: 'Not sure' },
];
const EU = [
  ['AT', 'Austria'], ['BE', 'Belgium'], ['BG', 'Bulgaria'], ['HR', 'Croatia'], ['CY', 'Cyprus'],
  ['CZ', 'Czechia'], ['DK', 'Denmark'], ['EE', 'Estonia'], ['FI', 'Finland'], ['FR', 'France'],
  ['DE', 'Germany'], ['GR', 'Greece'], ['HU', 'Hungary'], ['IE', 'Ireland'], ['IT', 'Italy'],
  ['LV', 'Latvia'], ['LT', 'Lithuania'], ['LU', 'Luxembourg'], ['MT', 'Malta'], ['NL', 'Netherlands'],
  ['PL', 'Poland'], ['PT', 'Portugal'], ['RO', 'Romania'], ['SK', 'Slovakia'], ['SI', 'Slovenia'],
  ['ES', 'Spain'], ['SE', 'Sweden'],
];

const FIELD_ERRORS: Record<string, string> = {
  name: 'Please enter your name.',
  email: 'Please enter a valid work email.',
  organisation: 'Please enter your organisation.',
  country: 'Please choose a country.',
  consent: 'Please tick the box so we can reply to you.',
  phone: 'Please check the phone number (digits, spaces, +, - and brackets only).',
  org_size: 'Please choose an organisation size.',
  interests: 'Please check what you are interested in.',
  needs_monitoring: 'Please choose an answer about 24/7 monitoring.',
};

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
};
declare global { interface Window { turnstile?: Turnstile } }

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'unavailable' }
  | { kind: 'error'; message: string };

const input =
  'w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary';
const label = 'block text-sm font-semibold text-dark-text mb-1.5';

export default function BusinessEnquiryForm() {
  const [f, setF] = useState({
    name: '', email: '', organisation: '', country: '', role: '', phone: '',
    org_size: '', people_count: '', needs_monitoring: '', message: '',
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const widgetEl = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const render = () => {
      if (cancelled || !widgetEl.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(widgetEl.current, {
        sitekey: SITE_KEY,
        theme: 'dark',
        action: 'business_enquiry',
        callback: (t: string) => setToken(t),
        'expired-callback': () => setToken(''),
        'error-callback': () => setToken(''),
      });
    };
    if (window.turnstile) render();
    else {
      let s = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
      if (!s) {
        s = document.createElement('script');
        s.src = TURNSTILE_SRC;
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
      }
      s.addEventListener('load', render);
    }
    return () => { cancelled = true; };
  }, []);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));
  const toggle = (v: string) =>
    setInterests((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) { setStatus({ kind: 'error', message: FIELD_ERRORS.consent }); return; }
    if (!token) { setStatus({ kind: 'error', message: 'Please complete the check above the button, then send again.' }); return; }
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, interests, consent: true, turnstileToken: token, website: trap }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; field?: string };
      if (res.ok && body.ok) { setStatus({ kind: 'sent' }); return; }
      if (res.status === 503) { setStatus({ kind: 'unavailable' }); return; }
      // A token is single-use: get a fresh one for the next try.
      setToken('');
      window.turnstile?.reset(widgetId.current);
      if (res.status === 429) {
        setStatus({ kind: 'error', message: `We've had a lot of enquiries in a short time. Please try again later, or email ${BUSINESS_EMAIL}.` });
      } else if (res.status === 400 && body.field) {
        setStatus({ kind: 'error', message: FIELD_ERRORS[body.field] ?? 'Please check the form and try again.' });
      } else if (res.status === 403) {
        setStatus({ kind: 'error', message: 'The check could not be completed. Please try it again, then send.' });
      } else {
        setStatus({ kind: 'error', message: `Something went wrong. Please try again, or email ${BUSINESS_EMAIL}.` });
      }
    } catch {
      setStatus({ kind: 'error', message: `We couldn't reach our server. Please try again, or email ${BUSINESS_EMAIL}.` });
    }
  }

  if (status.kind === 'sent') {
    return (
      <div className="rounded-2xl border border-brand-success/30 bg-brand-success/5 p-8 text-center" role="status">
        <p className="text-dark-text text-lg font-semibold">Thanks — we&apos;ll reply within 2 working days.</p>
        <p className="text-dark-muted text-sm mt-2">If it&apos;s urgent, email <a className="text-primary hover:underline" href={MAILTO}>{BUSINESS_EMAIL}</a>.</p>
      </div>
    );
  }

  if (status.kind === 'unavailable') {
    return (
      <div className="rounded-2xl border border-dark-border bg-dark-surface p-8 text-center" role="status">
        <p className="text-dark-text text-lg font-semibold">Please email us instead</p>
        <p className="text-dark-muted text-sm mt-2">
          Our enquiry form isn&apos;t taking messages right now. Write to{' '}
          <a className="text-primary hover:underline" href={MAILTO}>{BUSINESS_EMAIL}</a> and tell us about your
          organisation, where you are, and what you need.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="be-name" className={label}>Name</label>
          <input id="be-name" className={input} value={f.name} onChange={set('name')} maxLength={100} required autoComplete="name" />
        </div>
        <div>
          <label htmlFor="be-email" className={label}>Work email</label>
          <input id="be-email" type="email" className={input} value={f.email} onChange={set('email')} maxLength={254} required autoComplete="email" />
        </div>
        <div>
          <label htmlFor="be-org" className={label}>Organisation</label>
          <input id="be-org" className={input} value={f.organisation} onChange={set('organisation')} maxLength={150} required autoComplete="organization" />
        </div>
        <div>
          <label htmlFor="be-country" className={label}>Country</label>
          <select id="be-country" className={input} value={f.country} onChange={set('country')} required>
            <option value="">Choose…</option>
            <option value="IN">India</option>
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <optgroup label="European Union">
              {EU.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
            </optgroup>
            <option value="OTHER">Somewhere else</option>
          </select>
        </div>
        <div>
          <label htmlFor="be-role" className={label}>Your role <span className="text-dark-muted font-normal">(optional)</span></label>
          <input id="be-role" className={input} value={f.role} onChange={set('role')} maxLength={100} autoComplete="organization-title" />
        </div>
        <div>
          <label htmlFor="be-phone" className={label}>Phone <span className="text-dark-muted font-normal">(optional)</span></label>
          <input id="be-phone" type="tel" className={input} value={f.phone} onChange={set('phone')} maxLength={30} autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="be-size" className={label}>Organisation size</label>
          <select id="be-size" className={input} value={f.org_size} onChange={set('org_size')}>
            <option value="">Choose…</option>
            {ORG_SIZES.map((o) => <option key={o.value} value={o.value}>{o.label} people</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="be-people" className={label}>Roughly how many people would use it? <span className="text-dark-muted font-normal">(optional)</span></label>
          <input id="be-people" className={input} value={f.people_count} onChange={set('people_count')} maxLength={40} />
        </div>
      </div>

      <fieldset>
        <legend className={label}>What are you interested in? <span className="text-dark-muted font-normal">(tick any)</span></legend>
        <div className="grid sm:grid-cols-2 gap-2 mt-1">
          {INTERESTS.map((o) => (
            <label key={o.value} className="flex items-center gap-2.5 text-sm text-dark-muted cursor-pointer">
              <input type="checkbox" className="accent-primary w-4 h-4" checked={interests.includes(o.value)} onChange={() => toggle(o.value)} />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={label}>Do you need 24/7 professional monitoring? <span className="text-dark-muted font-normal">(optional)</span></legend>
        <div className="flex flex-wrap gap-5 mt-1">
          {MONITORING.map((o) => (
            <label key={o.value} className="flex items-center gap-2 text-sm text-dark-muted cursor-pointer">
              <input type="radio" name="be-monitoring" className="accent-primary w-4 h-4" value={o.value} checked={f.needs_monitoring === o.value} onChange={set('needs_monitoring')} />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="be-message" className={label}>Anything else we should know? <span className="text-dark-muted font-normal">(optional)</span></label>
        <textarea id="be-message" className={`${input} min-h-28`} value={f.message} onChange={set('message')} maxLength={1000} rows={5} />
        <p className="text-dark-muted text-xs mt-1 text-right">{f.message.length} / 1,000</p>
      </div>

      {/* Honeypot: hidden from people and screen readers; bots that fill it get a quiet "thanks". */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="be-hp">Leave this empty</label>
        <input id="be-hp" name="hp_fax_number" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>

      <label className="flex items-start gap-2.5 text-sm text-dark-muted cursor-pointer">
        <input type="checkbox" className="accent-primary w-4 h-4 mt-0.5" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
        <span>
          Loxymity may contact me about this enquiry. See our{' '}
          <a href="/privacy/" className="text-primary hover:underline">Privacy Policy</a>.
        </span>
      </label>

      <div ref={widgetEl} className="min-h-[65px]" />

      {status.kind === 'error' && (
        <p className="text-sm text-brand-danger bg-brand-danger/10 rounded-lg px-3 py-2" role="alert">{status.message}</p>
      )}

      <button
        type="submit"
        disabled={status.kind === 'sending'}
        className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-dark-bg font-bold px-8 py-3 rounded-xl transition-colors disabled:opacity-60"
      >
        {status.kind === 'sending' ? 'Sending…' : 'Send enquiry'}
      </button>

      <p className="text-dark-muted text-xs leading-relaxed">
        <strong className="text-dark-text">What happens to these details.</strong> AMSEK RESEARCH LABS LLP
        (Loxymity) uses them only to reply to you and to learn which services organisations need. They are stored
        in our database (Supabase, in Mumbai, India), seen only by the Loxymity team, kept for 24 months after we
        last update the enquiry (spam is deleted after 30 days), never sold and never added to a mailing list. The
        check above is Cloudflare Turnstile, which reads technical signals from your browser to stop automated
        spam. To see, correct or delete your enquiry, email{' '}
        <a href={MAILTO} className="text-primary hover:underline">{BUSINESS_EMAIL}</a>. Your other rights are in our{' '}
        <a href="/privacy/" className="text-primary hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
