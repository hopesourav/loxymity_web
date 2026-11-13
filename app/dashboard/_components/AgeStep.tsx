'use client';

import { useState } from 'react';
import { consentBandFromBirth, type ConsentBand } from '../_lib/age';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** The neutral age question: month and year of birth, nothing preset, no age wording. */
export function AgeStep({ onAnswer, busy }: { onAnswer: (band: ConsentBand) => void; busy?: boolean }) {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => thisYear - i);
  const band = month && year ? consentBandFromBirth(Number(year), Number(month)) : null;
  const select = 'w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-sm text-dark-text focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-dark-text">When were you born?</p>
        <p className="text-xs text-dark-muted mt-1">Month and year only. We keep just whether you’re an adult, never the date.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select aria-label="Birth month" value={month} onChange={(e) => setMonth(e.target.value)} className={select}>
          <option value="">Month</option>
          {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>
        <select aria-label="Birth year" value={year} onChange={(e) => setYear(e.target.value)} className={select}>
          <option value="">Year</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <button
        type="button"
        disabled={!band || busy}
        onClick={() => band && onAnswer(band)}
        className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-dark-bg font-semibold py-2.5 rounded-xl text-sm transition-opacity"
      >
        Continue
      </button>
    </div>
  );
}

/** What an under-18 answer leads to on the web: nothing to buy, and the app's parent route. */
export function MinorNotice() {
  return (
    <div className="rounded-xl border border-dark-border bg-dark-surface px-4 py-4 text-center space-y-2">
      <p className="text-sm font-semibold text-dark-text">Loxymity plans are for adults</p>
      <p className="text-xs text-dark-muted">
        If you’re under 18, ask a parent or guardian to invite you to their circle from the Loxymity app.
      </p>
    </div>
  );
}
