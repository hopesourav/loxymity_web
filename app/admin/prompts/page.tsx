'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '../_lib/adminContext';
import type { AppPrompt } from '../_lib/types';

type InputType = 'none' | 'text' | 'phone' | 'choice';
type Style = 'sheet' | 'banner' | 'fullscreen';

interface Choice { label: string; value: string }

interface FormState {
  key: string;
  title: string;
  body: string;
  icon: string;
  ctaLabel: string;
  dismissLabel: string;
  inputType: InputType;
  choices: Choice[];
  style: Style;
  required: boolean;
  priority: number;
  targetUserIds: string;
  targetCircleIds: string;
  targetPlatform: '' | 'ios' | 'android';
  targetMinVersion: string;
  expiresIn: '' | '24h' | '3d' | '7d' | '30d' | 'never';
}

const DEFAULT_FORM: FormState = {
  key: '', title: '', body: '', icon: '',
  ctaLabel: 'Got it', dismissLabel: '',
  inputType: 'none', choices: [{ label: '', value: '' }],
  style: 'sheet', required: true, priority: 0,
  targetUserIds: '', targetCircleIds: '',
  targetPlatform: '', targetMinVersion: '', expiresIn: '7d',
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function expiresAt(expiresIn: string): string | null {
  const map: Record<string, number> = {
    '24h': 24 * 3600, '3d': 3 * 86400, '7d': 7 * 86400, '30d': 30 * 86400,
  };
  if (!map[expiresIn]) return null;
  return new Date(Date.now() + map[expiresIn] * 1000).toISOString();
}

function parseIds(raw: string): string[] | null {
  const ids = raw.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
  return ids.length ? ids : null;
}

export default function PromptsPage() {
  const { supabase } = useAdmin();
  const [prompts, setPrompts] = useState<AppPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [showForm, setShowForm] = useState(false);

  const loadPrompts = async () => {
    const { data } = await supabase
      .from('app_prompts')
      .select('*')
      .order('priority', { ascending: false });
    setPrompts((data ?? []) as AppPrompt[]);
    setLoading(false);
  };

  useEffect(() => { loadPrompts(); }, [supabase]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setChoice(index: number, field: keyof Choice, value: string) {
    setForm((prev) => {
      const choices = [...prev.choices];
      choices[index] = { ...choices[index], [field]: value };
      return { ...prev, choices };
    });
  }

  async function handleSave() {
    if (!form.title || !form.body) { setSaveError('Title and body are required.'); return; }
    setSaving(true);
    setSaveError('');

    const key = form.key || slugify(form.title);
    const choices =
      form.inputType === 'choice' && form.choices.some((c) => c.label.trim())
        ? form.choices.filter((c) => c.label.trim()).map((c) => ({
            label: c.label,
            value: c.value || slugify(c.label),
          }))
        : null;

    const { error } = await supabase.from('app_prompts').insert({
      key,
      title: form.title,
      body: form.body,
      icon: form.icon.trim() || null,
      cta_label: form.ctaLabel || 'OK',
      dismiss_label: form.dismissLabel.trim() || null,
      input_type: form.inputType,
      choices,
      style: form.style,
      required: form.required,
      priority: form.priority,
      target_user_ids: parseIds(form.targetUserIds),
      target_circle_ids: parseIds(form.targetCircleIds),
      target_platform: form.targetPlatform || null,
      target_min_version: form.targetMinVersion.trim() || null,
      expires_at: form.expiresIn === 'never' || !form.expiresIn ? null : expiresAt(form.expiresIn),
    });

    setSaving(false);
    if (error) {
      setSaveError(error.message);
    } else {
      setSaveSuccess(true);
      setForm(DEFAULT_FORM);
      setShowForm(false);
      setTimeout(() => setSaveSuccess(false), 3000);
      await loadPrompts();
    }
  }

  async function handleDelete(id: string) {
    await supabase.from('app_prompts').delete().eq('id', id);
    setDeleteConfirm(null);
    await loadPrompts();
  }

  function isExpired(prompt: AppPrompt) {
    return prompt.expires_at && new Date(prompt.expires_at) < new Date();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-dark-text">App Prompts</h1>
          <p className="text-dark-muted text-sm">In-app modals and banners pushed to users</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setForm(DEFAULT_FORM); setSaveError(''); }}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-dark-bg text-sm font-bold rounded-xl transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Prompt'}
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-brand-success/10 border border-brand-success/20 text-brand-success text-sm font-semibold rounded-2xl px-5 py-3">
          Prompt published successfully.
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-border">
            <p className="font-semibold text-dark-text">New Prompt</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: form */}
              <div className="space-y-5">
                {/* Content */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-dark-muted uppercase tracking-wide">Content</p>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-dark-muted mb-1">Icon</label>
                      <input
                        type="text"
                        className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-center text-xl text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="📢"
                        maxLength={2}
                        value={form.icon}
                        onChange={(e) => set('icon', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs text-dark-muted mb-1">Title *</label>
                      <input
                        type="text"
                        className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Important Update"
                        value={form.title}
                        onChange={(e) => set('title', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-dark-muted mb-1">Body *</label>
                    <textarea
                      rows={3}
                      className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="We've updated our privacy policy…"
                      value={form.body}
                      onChange={(e) => set('body', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-dark-muted mb-1">
                      Prompt key <span className="text-dark-muted font-normal">(auto-filled)</span>
                    </label>
                    <input
                      type="text"
                      className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-sm font-mono text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="privacy_update_aug2026"
                      value={form.key}
                      onChange={(e) => set('key', e.target.value)}
                      onBlur={() => { if (!form.key && form.title) set('key', slugify(form.title)); }}
                    />
                    {!form.key && form.title && (
                      <button onClick={() => set('key', slugify(form.title))} className="text-xs text-primary hover:underline mt-1">
                        Use &ldquo;{slugify(form.title)}&rdquo;
                      </button>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-dark-muted uppercase tracking-wide">Buttons</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-dark-muted mb-1">CTA label</label>
                      <input
                        type="text"
                        className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Got it"
                        value={form.ctaLabel}
                        onChange={(e) => set('ctaLabel', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-dark-muted mb-1">Dismiss label</label>
                      <input
                        type="text"
                        className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Maybe later"
                        value={form.dismissLabel}
                        onChange={(e) => set('dismissLabel', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-dark-muted mb-1">Input type</label>
                    <div className="flex gap-2">
                      {(['none', 'text', 'phone', 'choice'] as InputType[]).map((t) => (
                        <button key={t} onClick={() => set('inputType', t)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors border ${
                            form.inputType === t ? 'bg-primary text-dark-bg border-primary' : 'bg-dark-bg border-dark-border text-dark-muted hover:text-dark-text'
                          }`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  {form.inputType === 'choice' && (
                    <div>
                      <label className="block text-xs text-dark-muted mb-2">Choices</label>
                      {form.choices.map((c, i) => (
                        <div key={i} className="flex gap-2 items-center mb-2">
                          <input
                            type="text"
                            className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Label"
                            value={c.label}
                            onChange={(e) => setChoice(i, 'label', e.target.value)}
                          />
                          <input
                            type="text"
                            className="w-28 bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm font-mono text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="value"
                            value={c.value}
                            onChange={(e) => setChoice(i, 'value', e.target.value)}
                          />
                          {form.choices.length > 1 && (
                            <button onClick={() => setForm(prev => ({ ...prev, choices: prev.choices.filter((_, j) => j !== i) }))}
                              className="text-dark-muted hover:text-brand-danger transition-colors text-lg">×</button>
                          )}
                        </div>
                      ))}
                      <button onClick={() => setForm(prev => ({ ...prev, choices: [...prev.choices, { label: '', value: '' }] }))}
                        className="text-xs text-primary hover:underline">+ Add choice</button>
                    </div>
                  )}
                </div>

                {/* Display */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-dark-muted uppercase tracking-wide">Display</p>
                  <div>
                    <label className="block text-xs text-dark-muted mb-1">Style</label>
                    <div className="flex gap-2">
                      {(['sheet', 'banner', 'fullscreen'] as Style[]).map((s) => (
                        <button key={s} onClick={() => set('style', s)}
                          className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-colors border ${
                            form.style === s ? 'bg-primary text-dark-bg border-primary' : 'bg-dark-bg border-dark-border text-dark-muted hover:text-dark-text'
                          }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-dark-muted mb-1">Priority</label>
                      <input type="number"
                        className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-sm text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
                        value={form.priority}
                        onChange={(e) => set('priority', parseInt(e.target.value) || 0)} />
                    </div>
                    <div>
                      <label className="block text-xs text-dark-muted mb-1">Required</label>
                      <div className="flex gap-2 mt-1">
                        {([true, false] as const).map((v) => (
                          <button key={String(v)} onClick={() => set('required', v)}
                            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                              form.required === v ? 'bg-primary text-dark-bg border-primary' : 'bg-dark-bg border-dark-border text-dark-muted hover:text-dark-text'
                            }`}>
                            {v ? 'Required' : 'Optional'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-dark-muted mb-1">Expires</label>
                    <div className="flex gap-2 flex-wrap">
                      {(['24h', '3d', '7d', '30d', 'never'] as const).map((v) => (
                        <button key={v} onClick={() => set('expiresIn', v)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                            form.expiresIn === v ? 'bg-primary text-dark-bg border-primary' : 'bg-dark-bg border-dark-border text-dark-muted hover:text-dark-text'
                          }`}>
                          {v === '24h' ? '24 h' : v === '3d' ? '3 days' : v === '7d' ? '7 days' : v === '30d' ? '30 days' : 'Never'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Targeting */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-dark-muted uppercase tracking-wide">Targeting</p>
                  <div>
                    <label className="block text-xs text-dark-muted mb-1">Platform</label>
                    <div className="flex gap-2">
                      {([['', 'All'], ['ios', 'iOS'], ['android', 'Android']] as const).map(([v, l]) => (
                        <button key={v} onClick={() => set('targetPlatform', v as FormState['targetPlatform'])}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                            form.targetPlatform === v ? 'bg-primary text-dark-bg border-primary' : 'bg-dark-bg border-dark-border text-dark-muted hover:text-dark-text'
                          }`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-dark-muted mb-1">Min app version</label>
                    <input type="text"
                      className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-sm font-mono text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0.8.0"
                      value={form.targetMinVersion}
                      onChange={(e) => set('targetMinVersion', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs text-dark-muted mb-1">User IDs (comma-separated)</label>
                    <textarea rows={2}
                      className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-sm font-mono text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="uuid, uuid, …"
                      value={form.targetUserIds}
                      onChange={(e) => set('targetUserIds', e.target.value)} />
                  </div>
                </div>

                {saveError && <p className="text-brand-danger text-sm">{saveError}</p>}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-dark-bg font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                  {saving ? 'Publishing…' : 'Publish Prompt'}
                </button>
              </div>

              {/* Right: preview */}
              <div className="lg:sticky lg:top-6 h-fit">
                <p className="text-xs font-semibold text-dark-muted uppercase tracking-wide mb-3">Preview</p>
                <div className={`bg-dark-bg border-2 border-dark-border rounded-2xl p-5 ${form.style === 'banner' ? 'flex items-start gap-3' : 'text-center'}`}>
                  {form.icon && (
                    <span className={`text-3xl ${form.style === 'banner' ? '' : 'block mb-2'}`}>{form.icon}</span>
                  )}
                  <div className={form.style === 'banner' ? 'flex-1 text-left' : ''}>
                    <p className="font-bold text-dark-text text-base">
                      {form.title || <span className="text-dark-muted">Title</span>}
                    </p>
                    <p className="text-dark-muted text-sm mt-1">
                      {form.body || <span className="text-dark-border">Body text…</span>}
                    </p>
                    {form.inputType === 'text' && (
                      <div className="mt-3 border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-muted">Type your answer…</div>
                    )}
                    {form.inputType === 'phone' && (
                      <div className="mt-3 border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-muted">+91 9876543210</div>
                    )}
                    {form.inputType === 'choice' && (
                      <div className="mt-3 space-y-1.5">
                        {form.choices.filter((c) => c.label).map((c, i) => (
                          <div key={i} className="border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text">{c.label}</div>
                        ))}
                      </div>
                    )}
                    <div className={`mt-4 flex gap-2 ${form.style === 'banner' ? '' : 'justify-center'}`}>
                      <button className="px-4 py-2 bg-primary text-dark-bg text-sm font-semibold rounded-xl">{form.ctaLabel || 'OK'}</button>
                      {form.dismissLabel && (
                        <button className="px-4 py-2 bg-dark-surface text-dark-muted text-sm font-semibold rounded-xl">{form.dismissLabel}</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing prompts list */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-border">
          <p className="font-semibold text-dark-text">Published Prompts ({prompts.length})</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-dark-border">
            {prompts.map((p) => {
              const expired = isExpired(p);
              return (
                <div key={p.id} className="px-5 py-4 flex items-start gap-4">
                  {p.icon && <span className="text-2xl shrink-0 mt-0.5">{p.icon}</span>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-dark-text">{p.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        expired ? 'bg-dark-bg text-dark-muted' : 'bg-brand-success/10 text-brand-success'
                      }`}>
                        {expired ? 'expired' : 'active'}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-dark-bg text-dark-muted capitalize">{p.style}</span>
                      <span className="text-xs text-dark-muted ml-auto shrink-0">priority {p.priority}</span>
                    </div>
                    <p className="text-dark-muted text-sm mt-0.5 truncate">{p.body}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-dark-muted">
                      <span className="font-mono">{p.key}</span>
                      {p.expires_at && <span>Expires: {new Date(p.expires_at).toLocaleDateString()}</span>}
                      {p.target_platform && <span>{p.target_platform === 'ios' ? 'iOS' : 'Android'} only</span>}
                    </div>
                  </div>
                  {deleteConfirm === p.id ? (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleDelete(p.id)}
                        className="px-3 py-1.5 bg-brand-danger/10 border border-brand-danger/20 text-brand-danger text-xs font-semibold rounded-xl hover:bg-brand-danger/20 transition-colors">
                        Confirm delete
                      </button>
                      <button onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1.5 bg-dark-bg border border-dark-border text-dark-muted text-xs rounded-xl hover:text-dark-text transition-colors">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(p.id)}
                      className="shrink-0 px-3 py-1.5 bg-dark-bg border border-dark-border text-dark-muted text-xs rounded-xl hover:text-brand-danger hover:border-brand-danger/30 transition-colors">
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
            {prompts.length === 0 && (
              <p className="px-5 py-12 text-center text-dark-muted">No prompts published yet. Create one above.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
