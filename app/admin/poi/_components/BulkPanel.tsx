'use client';

/**
 * CSV export of the places in view.
 *
 * There is no import any more. It wrote straight into poi_directory, which the Loxymity migration
 * 0399 dropped on 2026-11-14: India's place data now lives in R2 (a base file plus the edits
 * ledger) and reaches phones through the daily tile publish. Names change through Place feedback
 * (/admin/poi/feedback/), whose approvals write that ledger.
 */

import Link from 'next/link';
import { downloadCsv, toCsv } from '../_lib/csv';
import type { PoiRow } from '../_lib/types';

const HEADERS = ['name', 'poi_type', 'tier', 'source', 'lat', 'lng', 'id'] as const;

type Props = {
  viewportRows: PoiRow[];
};

export default function BulkPanel({ viewportRows }: Props) {
  function exportViewport() {
    downloadCsv(
      `poi-viewport-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '')}.csv`,
      toCsv(
        [...HEADERS],
        viewportRows.map((r) => [r.name, r.poi_type, r.tier, r.source, r.lat, r.lng, r.id]),
      ),
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div>
        <p className="text-xs font-semibold text-dark-text mb-2">Export</p>
        <button
          onClick={exportViewport}
          disabled={viewportRows.length === 0}
          className="w-full border border-dark-border text-dark-muted hover:text-dark-text py-2 rounded-xl text-xs disabled:opacity-40"
        >
          This viewport ({viewportRows.length.toLocaleString()})
        </button>
        <p className="text-[11px] text-dark-muted mt-1.5 leading-snug">
          The published places in view, as the phones have them.
        </p>
      </div>

      <div className="border-t border-dark-border pt-4">
        <p className="text-xs font-semibold text-dark-text mb-2">Changing a place</p>
        <p className="text-[11px] text-dark-muted leading-snug">
          Places are no longer edited or imported here. Review and approve changes in{' '}
          <Link href="/admin/poi/feedback/" className="text-primary hover:underline">Place feedback</Link>;
          approved changes reach phones with the next daily publish.
        </p>
      </div>
    </div>
  );
}
