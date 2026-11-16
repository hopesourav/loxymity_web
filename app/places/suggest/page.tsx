import type { Metadata } from 'next';
import { SiteFooter } from '../../_components/SiteFooter';
import { SiteNav } from '../../_components/SiteNav';
import SuggestForm from './_components/SuggestForm';

/**
 * loxymity.com/places/suggest/ — tell us a place name is wrong, a place isn't there, or a place is
 * missing (app repo migration 0342). Signed-in Loxymity accounts only (owner decision 2026-10-31):
 * the limits and "reported by N people" are per account. Outside /dashboard/(protected) on purpose —
 * that layout sends a free account to the upgrade page.
 *
 * Writes through ONE RPC, submit_poi_feedback, with the person's own session — the same door as
 * the app. A daily batch checks each report against OpenStreetMap / Wikidata and an AI's reading;
 * an admin decides the rest at /admin/poi/feedback.
 */
export const metadata: Metadata = {
  title: 'Suggest a place or fix a name — Loxymity',
  description: 'Tell us when Loxymity shows the wrong name for a place, shows a place that is not there, or is missing one.',
};

export default function SuggestPlacePage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <SiteNav back />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="eyebrow mb-3">Place names</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-dark-text tracking-[-0.03em]">
            Suggest a place or fix a name
          </h1>
          <p className="text-dark-muted mt-4">
            Loxymity names the places you stop at — &ldquo;Near Victoria Memorial&rdquo;, &ldquo;In Salt Lake&rdquo;.
            Those names are shared by everyone who uses the app, so we check each suggestion before anything
            changes. If we accept it, the new name usually reaches phones within a few days.
          </p>
          <div className="mt-8">
            <SuggestForm />
          </div>
        </div>
      </main>
      <SiteFooter showStores={false} />
    </div>
  );
}
