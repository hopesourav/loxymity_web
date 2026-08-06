'use client';

import { useState, useEffect } from 'react';
import { useDashboard } from '../../_lib/context';
import type { LocationShare } from '../../_lib/types';
import { IconShare, IconCopy, IconCheck, IconTrash, IconLink, IconPlus } from '../../_components/Icons';

type ExpiryOption = { label: string; hours: number };
const EXPIRY_OPTIONS: ExpiryOption[] = [
  { label: '1 hour',  hours: 1 },
  { label: '6 hours', hours: 6 },
  { label: '24 hours', hours: 24 },
  { label: '7 days',  hours: 168 },
];

function timeLeft(expiresAt: string | null): string {
  if (!expiresAt) return 'No expiry';
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return 'Expired';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h >= 24) return `${Math.floor(h / 24)}d left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

function isExpired(expiresAt: string | null) {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
}

export default function SharePage() {
  const { supabase, userId } = useDashboard();
  const [shares, setShares]       = useState<LocationShare[]>([]);
  const [loading, setLoading]     = useState(true);
  const [creating, setCreating]   = useState(false);
  const [selectedHours, setSelectedHours] = useState(24);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [revokeId, setRevokeId]   = useState<string | null>(null);
  const [error, setError]         = useState('');

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('location_shares')
      .select('*')
      .eq('owner_id', userId)
      .eq('revoked', false)
      .order('created_at', { ascending: false });
    setShares((data ?? []) as LocationShare[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, [userId]);

  async function createShare() {
    setCreating(true); setError('');
    const expiresAt = new Date(Date.now() + selectedHours * 3600000).toISOString();
    const { error: e } = await supabase.from('location_shares').insert({
      owner_id: userId,
      expires_at: expiresAt,
    });
    if (e) { setError(e.message); setCreating(false); return; }
    setCreating(false);
    await load();
  }

  async function revokeShare(id: string) {
    await supabase.from('location_shares').update({ revoked: true }).eq('id', id);
    setRevokeId(null);
    await load();
  }

  function shareUrl(token: string) {
    return `${window.location.origin}/share/?token=${token}`;
  }

  function copyLink(token: string) {
    navigator.clipboard.writeText(shareUrl(token)).then(() => {
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    });
  }

  const active = shares.filter(s => !isExpired(s.expires_at));
  const expired = shares.filter(s => isExpired(s.expires_at));

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-dark-border bg-dark-surface shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <IconShare size={18} className="text-primary" />
          <h1 className="text-base font-semibold text-dark-text">Share Location</h1>
        </div>

        {/* Create form */}
        <div className="bg-dark-bg border border-dark-border rounded-2xl p-4">
          <p className="text-sm font-medium text-dark-text mb-1">Create a share link</p>
          <p className="text-xs text-dark-muted mb-3">
            Anyone with the link can view your real-time location — no account required.
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex gap-1.5 flex-wrap">
              {EXPIRY_OPTIONS.map(opt => (
                <button
                  key={opt.hours}
                  onClick={() => setSelectedHours(opt.hours)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedHours === opt.hours
                      ? 'bg-primary/20 text-primary'
                      : 'bg-dark-surface border border-dark-border text-dark-muted hover:text-dark-text'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={createShare} disabled={creating}
              className="ml-auto flex items-center gap-1.5 px-4 py-1.5 bg-primary text-dark-bg text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <IconPlus size={13} />
              {creating ? 'Creating…' : 'Create link'}
            </button>
          </div>
          {error && <p className="text-xs text-brand-danger mt-2">{error}</p>}
        </div>
      </div>

      {/* Share list */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 max-w-2xl w-full mx-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-3">
                  Active ({active.length})
                </h2>
                <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden divide-y divide-dark-border">
                  {active.map(s => (
                    <ShareRow
                      key={s.id} share={s} copied={copiedToken === s.token}
                      onCopy={() => copyLink(s.token)}
                      onRevoke={() => setRevokeId(s.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {active.length === 0 && expired.length === 0 && (
              <div className="text-center py-12">
                <IconLink size={28} className="text-dark-muted mx-auto mb-3" />
                <p className="text-dark-muted text-sm">No share links yet.</p>
                <p className="text-xs text-dark-muted mt-1">Create one above to share your live location.</p>
              </div>
            )}

            {expired.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-3">
                  Expired
                </h2>
                <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden divide-y divide-dark-border opacity-50">
                  {expired.map(s => (
                    <ShareRow
                      key={s.id} share={s} copied={false}
                      onCopy={() => {}}
                      onRevoke={() => {}}
                      disabled
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Revoke confirm */}
      {revokeId && (
        <div className="fixed inset-0 z-50 bg-dark-bg/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center">
            <p className="text-sm font-semibold text-dark-text mb-1">Revoke share link?</p>
            <p className="text-xs text-dark-muted mb-5">Anyone with the link will lose access immediately.</p>
            <div className="flex gap-3">
              <button onClick={() => setRevokeId(null)} className="flex-1 py-2 border border-dark-border rounded-xl text-sm text-dark-muted hover:text-dark-text transition-colors">
                Cancel
              </button>
              <button onClick={() => revokeShare(revokeId)} className="flex-1 py-2 bg-brand-danger text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShareRow({
  share, copied, onCopy, onRevoke, disabled = false,
}: {
  share: LocationShare;
  copied: boolean;
  onCopy: () => void;
  onRevoke: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <IconLink size={13} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-dark-muted truncate">{share.token}</p>
        <p className="text-xs text-dark-muted">{timeLeft(share.expires_at)}</p>
      </div>
      {!disabled && (
        <>
          <button onClick={onCopy} className="p-1.5 text-dark-muted hover:text-dark-text transition-colors" aria-label="Copy link">
            {copied ? <IconCheck size={14} className="text-brand-success" /> : <IconCopy size={14} />}
          </button>
          <button onClick={onRevoke} className="p-1.5 text-dark-muted hover:text-brand-danger transition-colors" aria-label="Revoke">
            <IconTrash size={14} />
          </button>
        </>
      )}
    </div>
  );
}
