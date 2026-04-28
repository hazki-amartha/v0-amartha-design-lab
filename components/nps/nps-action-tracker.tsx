'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Plus, Trash2, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
  type DragEndEvent,
} from '@/components/kibo-ui/kanban';
import ActionItemDrawer from '@/components/nps/action-item-drawer';
import type { ActionItem, ImpactLevel } from '@/lib/issues/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTIONS = [
  { key: 'backlog' as const, label: 'Backlog', dot: 'bg-slate-400', headerClass: 'text-slate-600', topBar: 'bg-slate-200' },
  { key: 'in_progress' as const, label: 'In Progress', dot: 'bg-amber-400', headerClass: 'text-amber-700', topBar: 'bg-amber-300' },
  { key: 'released' as const, label: 'Released', dot: 'bg-emerald-400', headerClass: 'text-emerald-700', topBar: 'bg-emerald-300' },
];

const KANBAN_COLUMNS = SECTIONS.map(s => ({ id: s.key, name: s.label }));

const PRODUCTS = ['Modal', 'GGS', 'Celengan', 'PPOB', 'GGS & Celengan'];
const IMPACTS: ImpactLevel[] = ['High', 'Medium', 'Low'];

const IMPACT_DOT: Record<ImpactLevel, string> = {
  High: 'bg-red-400',
  Medium: 'bg-amber-400',
  Low: 'bg-slate-300',
};
const IMPACT_TEXT: Record<ImpactLevel, string> = {
  High: 'text-red-600',
  Medium: 'text-amber-600',
  Low: 'text-slate-500',
};

export type KanbanDataItem = Omit<ActionItem, 'id'> & {
  id: string;
  name: string;
  column: string;
  [key: string]: unknown;
};

// ─── IssueCountBadge ─────────────────────────────────────────────────────────

function IssueCountBadge({ actionId }: { actionId: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/action-items/${actionId}/issues`)
      .then(r => r.json())
      .then(d => { if (d.success) setCount(d.data.length); })
      .catch(() => { });
  }, [actionId]);

  if (!count) return null;

  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border bg-blue-50 border-blue-200 text-blue-700 shrink-0">
      <Link2 className="w-3 h-3 shrink-0" />
      {count} {count === 1 ? 'issue linked' : 'issues linked'}
    </span>
  );
}

// ─── ActionCard ───────────────────────────────────────────────────────────────

function ActionCard({
  item,
  onDelete,
  onOpen,
}: {
  item: KanbanDataItem;
  onDelete: (id: string) => void;
  onOpen: (item: KanbanDataItem) => void;
}) {
  const impact = item.impact as ImpactLevel | null;

  return (
    <div className="space-y-2 group">
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={e => { e.stopPropagation(); onOpen(item); }}
          className="text-[13px] font-semibold text-card-foreground leading-snug line-clamp-2 flex-1 text-left hover:underline underline-offset-2 transition-colors"
        >
          {item.title as string}
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDelete(item.id); }}
          className="shrink-0 p-0.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {item.product_area && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-muted text-muted-foreground border-border shrink-0">
            {item.product_area as string}
          </span>
        )}
        {item.tag && (
          <>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-[11px] text-muted-foreground shrink-0">{item.tag as string}</span>
          </>
        )}
        {item.owner && (
          <>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-[11px] text-muted-foreground shrink-0">{item.owner as string}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <IssueCountBadge actionId={item.id} />
        {impact && (
          <div className="flex items-center gap-1">
            <span className={cn('text-[11px] font-medium', IMPACT_TEXT[impact])}>{impact}</span>
          </div>
        )}
      </div>

      {item.notes && (
        <p className="text-[11px] text-muted-foreground leading-relaxed border-l-2 border-border pl-2 line-clamp-2">
          {item.notes as string}
        </p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NPSActionTracker() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const [activeImpact, setActiveImpact] = useState<ImpactLevel | null>(null);
  const pendingStatusRef = useRef<{ id: string; newStatus: string } | null>(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerItem, setDrawerItem] = useState<(ActionItem & { id: string }) | null>(null);

  const loadItems = useCallback(() => {
    setLoading(true);
    fetch('/api/action-items')
      .then(r => r.json())
      .then(d => { if (d.success) setItems(d.data); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  // ── Kanban data ──────────────────────────────────────────────────────────────

  const kanbanData = useMemo<KanbanDataItem[]>(() =>
    items
      .filter((i): i is ActionItem & { id: string } => Boolean(i.id))
      .map(i => ({ ...i, name: i.title, column: i.status } as KanbanDataItem)),
    [items]
  );

  const filteredKanbanData = useMemo(() =>
    kanbanData.filter(item => {
      if (activeProduct && !item.product_area?.includes(activeProduct)) return false;
      if (activeImpact && item.impact !== activeImpact) return false;
      return true;
    }),
    [kanbanData, activeProduct, activeImpact]
  );

  // ── Drag handlers ────────────────────────────────────────────────────────────

  function handleDataChange(newData: KanbanDataItem[]) {
    for (const d of newData) {
      const original = items.find(i => i.id === d.id);
      if (original && original.status !== d.column) {
        pendingStatusRef.current = { id: d.id, newStatus: d.column };
      }
    }
    setItems(prev => prev.map(item => {
      const updated = newData.find(d => d.id === item.id);
      return updated ? { ...item, status: updated.column as ActionItem['status'] } : item;
    }));
  }

  async function handleDragEnd(_event: DragEndEvent) {
    if (pendingStatusRef.current) {
      const { id, newStatus } = pendingStatusRef.current;
      pendingStatusRef.current = null;
      await fetch(`/api/action-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    }
  }

  // ── Drawer handlers ──────────────────────────────────────────────────────────

  function openCreate() {
    setDrawerItem(null);
    setDrawerOpen(true);
  }

  function openEdit(item: KanbanDataItem) {
    setDrawerItem(item as ActionItem & { id: string });
    setDrawerOpen(true);
  }

  function handleCreated(newItem: ActionItem & { id: string }) {
    setItems(prev => [newItem, ...prev]);
  }

  function handleSaved(id: string, patch: Partial<ActionItem>) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  }

  async function handleDeleted(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
    await fetch(`/api/action-items/${id}`, { method: 'DELETE' });
  }

  async function handleDeleteFromCard(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
    await fetch(`/api/action-items/${id}`, { method: 'DELETE' });
  }

  const hasFilter = activeProduct || activeImpact;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Action Tracker</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            What teams are doing about NPS and CSAT issues right now
          </p>
        </div>
        <Button size="sm" onClick={openCreate} className="shrink-0 gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          New Action
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">Product</span>
          <div className="flex gap-1.5 flex-wrap">
            {PRODUCTS.slice(0, 4).map(p => (
              <button
                key={p}
                onClick={() => setActiveProduct(activeProduct === p ? null : p)}
                className={cn(
                  'px-3 py-1 rounded-full text-[12px] font-medium border transition-colors',
                  activeProduct === p
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-muted-foreground/40 hover:text-card-foreground'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-4 bg-border shrink-0 hidden sm:block" />

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">Impact</span>
          <div className="flex gap-1.5 flex-wrap">
            {IMPACTS.map(impact => (
              <button
                key={impact}
                onClick={() => setActiveImpact(activeImpact === impact ? null : impact)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium border transition-colors',
                  activeImpact === impact
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-muted-foreground/40 hover:text-card-foreground'
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', IMPACT_DOT[impact])} />
                {impact}
              </button>
            ))}
          </div>
        </div>

        {hasFilter && (
          <button
            onClick={() => { setActiveProduct(null); setActiveImpact(null); }}
            className="text-[11px] text-muted-foreground hover:text-card-foreground underline underline-offset-2 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Kanban board */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {SECTIONS.map(section => (
            <div key={section.key} className="bg-muted/30 rounded-xl border border-border overflow-hidden">
              <div className={cn('h-1 w-full', section.topBar)} />
              <div className="px-5 py-4 space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <KanbanProvider<KanbanDataItem>
          columns={KANBAN_COLUMNS}
          data={filteredKanbanData}
          onDataChange={handleDataChange}
          onDragEnd={handleDragEnd}
          className="h-auto"
        >
          {(column) => {
            const section = SECTIONS.find(s => s.key === column.id)!;
            const count = filteredKanbanData.filter(d => d.column === column.id).length;
            return (
              <KanbanBoard
                key={column.id}
                id={column.id}
                className="bg-muted/30 rounded-xl border-border shadow-none divide-y-0"
              >
                <KanbanHeader className="px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className={cn('w-2 h-2 rounded-full shrink-0', section.dot)} />
                    <p className={cn('text-[12px] font-semibold uppercase tracking-widest', section.headerClass)}>
                      {section.label}
                    </p>
                    <span className="ml-auto text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                      {count}
                    </span>
                  </div>
                </KanbanHeader>
                <KanbanCards<KanbanDataItem> id={column.id} className="px-3 pb-3 pt-2 gap-2">
                  {(item) => (
                    <KanbanCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      column={item.column}
                      className="shadow-none border-border bg-card"
                    >
                      <ActionCard item={item} onDelete={handleDeleteFromCard} onOpen={openEdit} />
                    </KanbanCard>
                  )}
                </KanbanCards>
              </KanbanBoard>
            );
          }}
        </KanbanProvider>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <ActionItemDrawer
          item={drawerItem}
          onClose={() => setDrawerOpen(false)}
          onCreated={handleCreated}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
