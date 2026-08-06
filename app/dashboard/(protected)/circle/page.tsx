'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDashboard } from '../../_lib/context';
import { IconCircle, IconUser, IconCopy, IconRefresh, IconTrash, IconCheck, IconX } from '../../_components/Icons';

type Role = 'admin' | 'member';

type MemberRow = {
  user_id: string;
  role: Role;
  joined_at: string;
  display_name: string | null;
  avatar_url: string | null;
};

type InviteRow = {
  id: string;
  circle_id: string;
  token: string;
  status: string;
  created_at: string;
  expires_at: string | null;
};

export default function CirclePage() {
  const { supabase, activeCircleId, userId, circles } = useDashboard();

  const [members, setMembers]   = useState<MemberRow[]>([]);
  const [invites, setInvites]   = useState<InviteRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);
  const [error, setError]       = useState('');

  const activeCircle = circles.find(c => c.id === activeCircleId);
  const isAdmin = members.find(m => m.user_id === userId)?.role === 'admin';

  async function load() {
    setLoading(true);
    const [{ data: mems }, { data: invs }] = await Promise.all([
      supabase
        .from('circle_members')
        .select('user_id,role,joined_at,profiles!user_id(display_name,avatar_url)')
        .eq('circle_id', activeCircleId),
      supabase
        .from('invites')
        .select('id,circle_id,token,status,created_at,expires_at')
        .eq('circle_id', activeCircleId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false }),
    ]);

    const mapped: MemberRow[] = (mems ?? []).map((m: any) => ({
      user_id: m.user_id,
      role: m.role,
      joined_at: m.joined_at,
      display_name: m.profiles?.display_name ?? null,
      avatar_url: m.profiles?.avatar_url ?? null,
    }));
    setMembers(mapped);
    setInvites((invs ?? []) as InviteRow[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, [activeCircleId]);

  async function createInvite() {
    setInviteLoading(true); setError('');
    const token = crypto.randomUUID().replace(/-/g, '').slice(0, 20);
    const expiresAt = new Date(Date.now() + 7 * 86400_000).toISOString();
    const { error: e } = await supabase.from('invites').insert({
      circle_id: activeCircleId,
      token,
      status: 'pending',
      expires_at: expiresAt,
    });
    if (e) setError(e.message);
    setInviteLoading(false);
    await load();
  }

  async function revokeInvite(id: string) {
    await supabase.from('invites').update({ status: 'revoked' }).eq('id', id);
    await load();
  }

  function copyInviteLink(token: string) {
    const url = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    });
  }

  async function removeMember(memberId: string) {
    setRemoving(true);
    await supabase.from('circle_members').delete()
      .eq('circle_id', activeCircleId).eq('user_id', memberId);
    setRemoving(false); setRemoveId(null);
    await load();
  }

  async function toggleRole(memberId: string, current: Role) {
    const newRole: Role = current === 'admin' ? 'member' : 'admin';
    await supabase.from('circle_members').update({ role: newRole })
      .eq('circle_id', activeCircleId).eq('user_id', memberId);
    await load();
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-dark-border bg-dark-surface shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconCircle size={18} className="text-primary" />
            <h1 className="text-base font-semibold text-dark-text">
              {activeCircle?.name ?? 'Circle'}
            </h1>
          </div>
          <button onClick={load} className="p-1.5 rounded-lg hover:bg-dark-bg text-dark-muted hover:text-dark-text transition-colors" aria-label="Refresh">
            <IconRefresh size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 max-w-2xl w-full mx-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Members */}
            <section>
              <h2 className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-3">
                Members ({members.length})
              </h2>
              <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden divide-y divide-dark-border">
                {members.map(m => {
                  const isSelf = m.user_id === userId;
                  return (
                    <div key={m.user_id} className="flex items-center gap-3 px-4 py-3">
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-dark-bg border border-dark-border flex items-center justify-center shrink-0 overflow-hidden">
                        {m.avatar_url
                          ? <img src={m.avatar_url} alt="" className="w-full h-full object-cover" />
                          : <IconUser size={14} className="text-dark-muted" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-text truncate">
                          {m.display_name ?? 'Unknown'}{isSelf ? ' (you)' : ''}
                        </p>
                        <p className="text-xs text-dark-muted capitalize">{m.role}</p>
                      </div>
                      {isAdmin && !isSelf && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => toggleRole(m.user_id, m.role)}
                            className="px-2.5 py-1 rounded-lg text-xs border border-dark-border text-dark-muted hover:border-primary hover:text-dark-text transition-colors"
                            title={m.role === 'admin' ? 'Demote to member' : 'Promote to admin'}
                          >
                            {m.role === 'admin' ? 'Demote' : 'Make admin'}
                          </button>
                          <button
                            onClick={() => setRemoveId(m.user_id)}
                            className="p-1.5 text-dark-muted hover:text-brand-danger transition-colors"
                            aria-label="Remove member"
                          >
                            <IconTrash size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Invite links */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold text-dark-muted uppercase tracking-wider">
                  Invite Links
                </h2>
                {isAdmin && (
                  <button
                    onClick={createInvite} disabled={inviteLoading}
                    className="px-3 py-1 bg-primary text-dark-bg rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {inviteLoading ? 'Creating…' : 'Create link'}
                  </button>
                )}
              </div>

              {error && <p className="text-xs text-brand-danger mb-3">{error}</p>}

              {invites.length === 0 ? (
                <div className="bg-dark-surface border border-dark-border rounded-2xl px-4 py-6 text-center">
                  <p className="text-dark-muted text-xs">No active invite links. Create one to share.</p>
                </div>
              ) : (
                <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden divide-y divide-dark-border">
                  {invites.map(inv => {
                    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${inv.token}`;
                    const expires = inv.expires_at
                      ? new Date(inv.expires_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
                      : 'No expiry';
                    return (
                      <div key={inv.id} className="flex items-center gap-3 px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono text-dark-muted truncate">{inv.token}</p>
                          <p className="text-xs text-dark-muted">Expires {expires}</p>
                        </div>
                        <button
                          onClick={() => copyInviteLink(inv.token)}
                          className="p-1.5 text-dark-muted hover:text-dark-text transition-colors"
                          aria-label="Copy link"
                        >
                          {copiedToken === inv.token ? <IconCheck size={14} className="text-brand-success" /> : <IconCopy size={14} />}
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => revokeInvite(inv.id)}
                            className="p-1.5 text-dark-muted hover:text-brand-danger transition-colors"
                            aria-label="Revoke"
                          >
                            <IconX size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="text-xs text-dark-muted mt-2">Share the link with the person you want to invite. They must have the Loxymity app installed.</p>
            </section>
          </>
        )}
      </div>

      {/* Remove member confirm */}
      {removeId && (
        <div className="fixed inset-0 z-50 bg-dark-bg/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center">
            <p className="text-sm font-semibold text-dark-text mb-1">Remove member?</p>
            <p className="text-xs text-dark-muted mb-5">They will lose access to this circle immediately.</p>
            <div className="flex gap-3">
              <button onClick={() => setRemoveId(null)} className="flex-1 py-2 border border-dark-border rounded-xl text-sm text-dark-muted hover:text-dark-text transition-colors">
                Cancel
              </button>
              <button onClick={() => removeMember(removeId)} disabled={removing} className="flex-1 py-2 bg-brand-danger text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity">
                {removing ? 'Removing…' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
