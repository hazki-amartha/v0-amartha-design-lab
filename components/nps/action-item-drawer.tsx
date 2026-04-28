'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Trash2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { ActionItem, ImpactLevel, Issue } from '@/lib/issues/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTIONS = [
  { key: 'backlog'     as const, label: 'Backlog',     dot: 'bg-slate-400',   headerClass: 'text-slate-600',   topBar: 'bg-slate-200'   },
  { key: 'in_progress' as const, label: 'In Progress', dot: 'bg-amber-400',   headerClass: 'text-amber-700',   topBar: 'bg-amber-300'   },
  { key: 'released'    as const, label: 'Released',    dot: 'bg-emerald-400', headerClass: 'text-emerald-700', topBar: 'bg-emerald-300' },
];

const PRODUCTS = ['Modal', 'GGS', 'Celengan', 'PPOB', 'GGS & Celengan'];
const FEATURES = ['DLB', 'Loan Status', 'Performance', 'Profit Visibility', 'Promo', 'Disbursement', 'Onboarding'];
const IMPACTS: ImpactLevel[] = ['High', 'Medium', 'Low'];

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActionItemDrawerProps {
  item: (ActionItem & { id: string }) | null;
  onClose: () => void;
  onCreated: (item: ActionItem & { id: string }) => void;
  onSaved: (id: string, patch: Partial<ActionItem>) => void;
  onDeleted: (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ActionItemDrawer({
  item,
  onClose,
  onCreated,
  onSaved,
  onDeleted,
}: ActionItemDrawerProps) {
  const isEditMode = item !== null;

  // ── Animation ───────────────────────────────────────────────────────────────
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(r2);
    });
    return () => cancelAnimationFrame(r1);
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 280);
  }

  // ── Form state ───────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    title:        item?.title        ?? '',
    tag:          item?.tag          ?? '',
    product_area: item?.product_area ?? '',
    owner:        item?.owner        ?? '',
    status:       (item?.status      ?? 'backlog') as ActionItem['status'],
    impact:       item?.impact       ?? '',
    notes:        item?.notes        ?? '',
  });
  const [saving, setSaving] = useState(false);

  // id available after creation in create mode
  const [savedId, setSavedId] = useState<string | null>(item?.id ?? null);
  const canLinkIssues = savedId !== null;

  // ── Issue linking ────────────────────────────────────────────────────────────
  const [linked, setLinked] = useState<Issue[]>([]);
  const [stagedIssues, setStagedIssues] = useState<Issue[]>([]); // create mode only
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [search, setSearch] = useState('');

  const loadLinked = useCallback(() => {
    if (!savedId) return;
    fetch(`/api/action-items/${savedId}/issues`)
      .then(r => r.json())
      .then(d => { if (d.success) setLinked(d.data); })
      .catch(() => {});
  }, [savedId]);

  useEffect(() => {
    setLoadingIssues(true);
    fetch('/api/issues')
      .then(r => r.json())
      .then(d => { if (d.success) setAllIssues(d.data); })
      .catch(() => {})
      .finally(() => setLoadingIssues(false));
    if (isEditMode) loadLinked();
  }, [isEditMode, loadLinked]);

  // Reload linked when savedId is set after creation
  useEffect(() => {
    if (savedId && !isEditMode) loadLinked();
  }, [savedId, isEditMode, loadLinked]);

  // ── Save / Create ────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const body = {
        title:        form.title.trim(),
        tag:          form.tag          || null,
        product_area: form.product_area || null,
        owner:        form.owner        || null,
        status:       form.status,
        impact:       form.impact       || null,
        notes:        form.notes        || null,
      };

      if (!isEditMode && !savedId) {
        // Create new item
        const res = await fetch('/api/action-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success) {
          const newId = data.data.id as string;
          // Link any staged issues
          for (const issue of stagedIssues) {
            if (!issue.id) continue;
            await fetch(`/api/action-items/${newId}/issues`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ issue_id: issue.id }),
            });
          }
          onCreated(data.data);
          setSavedId(newId);
          setStagedIssues([]);
        }
      } else {
        // Update existing item
        const id = savedId ?? item!.id;
        await fetch(`/api/action-items/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        onSaved(id, { ...body, impact: (body.impact as ImpactLevel) ?? null });
        handleClose();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const id = savedId ?? item?.id;
    if (!id) return;
    onDeleted(id);
    handleClose();
  }

  // ── Issue link/unlink ────────────────────────────────────────────────────────
  async function handleToggleImmediate(issue: Issue) {
    if (!issue.id || !savedId) return;
    const isLinked = linked.some(l => l.id === issue.id);
    if (isLinked) {
      await fetch(`/api/action-items/${savedId}/issues`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue_id: issue.id }),
      });
    } else {
      await fetch(`/api/action-items/${savedId}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue_id: issue.id }),
      });
    }
    loadLinked();
  }

  function handleToggleStaged(issue: Issue) {
    setStagedIssues(prev =>
      prev.some(i => i.id === issue.id)
        ? prev.filter(i => i.id !== issue.id)
        : [...prev, issue]
    );
  }

  // ── Derived values ───────────────────────────────────────────────────────────
  const section = SECTIONS.find(s => s.key === form.status);
  const currentLinked  = canLinkIssues ? linked       : stagedIssues;
  const currentLinkedIds = new Set(currentLinked.map(i => i.id));

  // When search is active, scan all issues. When empty, narrow by feature + product area.
  const contextFilterActive = !search && Boolean(form.tag);
  const filteredIssues = (() => {
    if (search) {
      const q = search.toLowerCase();
      return allIssues.filter(i =>
        i.title.toLowerCase().includes(q) ||
        (i.product_area?.toLowerCase() ?? '').includes(q) ||
        (i.feature?.toLowerCase() ?? '').includes(q) ||
        (i.tag?.toLowerCase() ?? '').includes(q)
      );
    }
    if (form.tag) {
      return allIssues.filter(i => {
        const featureMatch = i.feature === form.tag || i.tag === form.tag;
        const productMatch = !form.product_area || i.product_area === form.product_area;
        return featureMatch && productMatch;
      });
    }
    return allIssues;
  })();

  const headerTitle = form.title.trim() || (isEditMode ? 'Edit Action' : 'New Action');

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-[280ms]',
          visible ? 'opacity-100' : 'opacity-0'
        )}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-lg z-50 flex flex-col transition-transform duration-[280ms] ease-out',
          visible ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={cn('w-2 h-2 rounded-full shrink-0', section?.dot)} />
            <h2 className="font-semibold text-sm truncate">{headerTitle}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 p-4 rounded-sm hover:bg-secondary hover:text-primary transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Title *
            </label>
            <Input
              placeholder="Describe the action being taken…"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="text-[13px]"
            />
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Product area</label>
              <Select value={form.product_area} onChange={e => setForm(f => ({ ...f, product_area: e.target.value }))}>
                <option value="">Select…</option>
                {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Feature</label>
              <Select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}>
                <option value="">Select…</option>
                {FEATURES.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Impact</label>
              <Select value={form.impact} onChange={e => setForm(f => ({ ...f, impact: e.target.value }))}>
                <option value="">Select…</option>
                {IMPACTS.map(i => <option key={i} value={i}>{i}</option>)}
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Status</label>
              <Select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as ActionItem['status'] }))}
              >
                {SECTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </Select>
            </div>
          </div>

          {/* Owner */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Owner</label>
            <Input
              placeholder="Team or person responsible"
              value={form.owner}
              onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}
              className="text-[13px]"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Notes</label>
            <textarea
              placeholder="Optional context or links"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="w-full text-[13px] px-3 py-2 rounded-md border border-input bg-background resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
            />
          </div>

          {/* Issue linking */}
          <div className="pt-1 border-t border-border space-y-3">
            <div className="flex items-center justify-between pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Linked Issues
              </p>
              {!canLinkIssues && (
                <span className="text-[10px] text-muted-foreground">
                  Staged — saves on create
                </span>
              )}
            </div>

            {/* Current / staged linked issues */}
            {currentLinked.length > 0 && (
              <div className="space-y-1.5">
                {currentLinked.map(issue => (
                  <div
                    key={issue.id}
                    className="flex items-start justify-between gap-3 group p-2.5 rounded-lg bg-blue-50 border border-blue-100"
                  >
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-card-foreground leading-snug line-clamp-1">
                        {issue.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {[issue.source?.toUpperCase(), issue.product_area, issue.feature]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        canLinkIssues
                          ? handleToggleImmediate(issue)
                          : handleToggleStaged(issue)
                      }
                      className="shrink-0 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 mt-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Context filter indicator */}
            {contextFilterActive && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">
                  Filtered by <span className="font-medium text-foreground">{form.tag}</span>
                  {form.product_area && <> · <span className="font-medium text-foreground">{form.product_area}</span></>}
                </span>
                <span className="text-[10px] text-muted-foreground/60">— search to see all</span>
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder={contextFilterActive ? 'Search all issues…' : 'Search issues to link…'}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-8 text-[12px]"
              />
            </div>

            {/* Issues list */}
            <div className="space-y-1 max-h-52 overflow-y-auto">
              {loadingIssues && (
                <p className="text-[12px] text-muted-foreground py-3 text-center">Loading…</p>
              )}
              {!loadingIssues && filteredIssues.length === 0 && (
                <p className="text-[12px] text-muted-foreground py-3 text-center">No issues found</p>
              )}
              {!loadingIssues &&
                filteredIssues.map(issue => {
                  const isLinked = currentLinkedIds.has(issue.id);
                  return (
                    <div
                      key={issue.id}
                      className={cn(
                        'flex items-start justify-between gap-3 p-2 rounded-lg cursor-pointer transition-colors',
                        isLinked ? 'bg-blue-50' : 'hover:bg-muted/50'
                      )}
                      onClick={() =>
                        canLinkIssues
                          ? handleToggleImmediate(issue)
                          : handleToggleStaged(issue)
                      }
                    >
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-card-foreground leading-snug line-clamp-2">
                          {issue.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {[issue.source?.toUpperCase(), issue.product_area, issue.feature, issue.tag]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded border mt-0.5',
                          isLinked
                            ? 'bg-blue-100 border-blue-200 text-blue-700'
                            : 'bg-muted border-border text-muted-foreground'
                        )}
                      >
                        {isLinked ? 'Linked' : 'Link'}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border px-5 py-4 flex items-center justify-between bg-card">
          {isEditMode || savedId ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClose}>
              {isEditMode || savedId ? 'Close' : 'Cancel'}
            </Button>
            {/* In edit mode: save closes. In create mode: create keeps drawer open for issue linking. */}
            {!(savedId && !isEditMode) && (
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
              >
                {saving ? 'Saving…' : isEditMode ? 'Save' : 'Create'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
