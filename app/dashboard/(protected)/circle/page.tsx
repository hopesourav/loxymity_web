'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDashboard } from '../../_lib/context';
import { IconCircle, IconUser, IconCopy, IconRefresh, IconTrash, IconCheck, IconX } from '../../_components/Icons';

// Same server paths as the app (src/backend/circles.ts): invites are single-use 8-character
// codes from create_invite and open https://loxymity.com/join/<CODE>; roles change through
// set_member_role and members leave through remove_member. Direct table writes are refused by
// RLS (no UPDATE/DELETE policy on circle_members; invites have no token/status columns).
type Role = 'owner' | 'admin' | 'member';

type MemberRow = {
  user_id: string;
  role: Role;
  status: 'pending' | 'active';
  joined_at: string;
  display_name: string | null;
  avatar_url: string | null;
};

type InviteRow = {
  id: string;
  circle_id: string;
  code: string;
  created_at: string;
  expires_at: string | null;
};

const INVITE_ERRORS: Record<string, string> = {
  circle_full: 'This circle is full on its current plan.',
  circle_expired: 'This temporary circle has ended.',
  rate_limited: 'Too many invites just now — try again in a little while.',
  not_member: 'Only members of this circle can invite people.',
  not_supported: 'Invites are not available for this circle.',
};

function prettyCode(code: string): string {
  return code.length === 8 ? `${code.slice(0, 4)}-${code.slice(4)}` : code;
}

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
  const myRole = members.find(m => m.user_id === userId)?.role;
  const isAdmin = myRole === 'owner' || myRole === 'admin';

  async function load() {
    setLoading(true);
    const [{ data: mems }, { data: invs }] = await Promise.all([
      supabase
        .from('circle_members')
        .select('user_id,role,status,joined_at,profiles!user_id(display_name,avatar_url)')
        .eq('circle_id', activeCircleId),
      supabase
        .from('invites')
        .select('id,circle_id,code,created_at,expires_at')
        .eq('circle_id', activeCircleId)
        .is('used_at', null)
        .is('revoked_at', null)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false }),
    ]);

    const mapped: MemberRow[] = (mems ?? []).map((m: any) => ({
      user_id: m.user_id,
      role: m.role,
      status: m.status,
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
    const { data, error: e } = await supabase.rpc('create_invite', {
      p_circle_id: activeCircleId,
      p_for_minor: false,
    });
    const d = data as { ok?: boolean; error?: string } | null;
    if (e) setError(e.message);
    else if (!d?.ok) setError(INVITE_ERRORS[d?.error ?? ''] ?? 'Could not create an invite.');
    setInviteLoading(false);
    await load();
  }

  async function revokeInvite(code: string) {
    const { error: e } = await supabase.rpc('revoke_invite', { p_code: code });
    if (e) setError(e.message);
    await load();
  }

  function inviteUrl(code: string) {
    return `${window.location.origin}/join/${code}`;
  }

  function copyInviteLink(code: string) {
    navigator.clipboard.writeText(inviteUrl(code)).then(() => {
      setCopiedToken(code);
      setTimeout(() => setCopiedToken(null), 2000);
    });
  }

  async function removeMember(memberId: string) {
    setRemoving(true); setError('');
    const { error: e } = await supabase.rpc('remove_member', {
      p_circle_id: activeCircleId,
      p_user_id: memberId,
    });
    if (e) setError(e.message);
    setRemoving(false); setRemoveId(null);
    await load();
  }

  async function toggleRole(memberId: string, current: Role) {
    setError('');
    const { error: e } = await supabase.rpc('set_member_role', {
      p_circle_id: activeCircleId,
      p_user_id: memberId,
      p_role: current === 'member' ? 'owner' : 'member',
    });
    if (e) setError(e.message);
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
                        <p className="text-xs text-dark-muted capitalize">
                          {m.status === 'pending' ? 'Waiting for approval in the app' : m.role}
                        </p>
                      </div>
                      {isAdmin && !isSelf && m.status === 'active' && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => toggleRole(m.user_id, m.role)}
                            className="px-2.5 py-1 rounded-lg text-xs border border-dark-border text-dark-muted hover:border-primary hover:text-dark-text transition-colors"
                            title={m.role === 'member' ? 'Make an owner of this circle' : 'Make a regular member'}
                          >
                            {m.role === 'member' ? 'Make owner' : 'Make member'}
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
                    const expires = inv.expires_at
                      ? new Date(inv.expires_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
                      : 'No expiry';
                    return (
                      <div key={inv.id} className="flex items-center gap-3 px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-mono text-dark-text tracking-wider">{prettyCode(inv.code)}</p>
                          <p className="text-xs text-dark-muted">Expires {expires}</p>
                        </div>
                        <button
                          onClick={() => copyInviteLink(inv.code)}
                          className="p-1.5 text-dark-muted hover:text-dark-text transition-colors"
                          aria-label="Copy link"
                        >
                          {copiedToken === inv.code ? <IconCheck size={14} className="text-brand-success" /> : <IconCopy size={14} />}
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => revokeInvite(inv.code)}
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
              <p className="text-xs text-dark-muted mt-2">Each code works once. Send the link to one person you trust; it opens the Loxymity app, or the app store if they don&apos;t have it yet.</p>
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
