'use client';

import { useState } from 'react';
import { actionItems, type ActionItem, type ImpactLevel } from '@/lib/nps/data';
import { cn } from '@/lib/utils';


const SECTIONS = [
  { key: 'backlog'    as const, label: 'Backlog',     dot: 'bg-slate-400',  headerClass: 'text-slate-600',  topBar: 'bg-slate-200'  },
  { key: 'inProgress' as const, label: 'In Progress', dot: 'bg-amber-400',  headerClass: 'text-amber-700',  topBar: 'bg-amber-300'  },
  { key: 'planned'    as const, label: 'Released',    dot: 'bg-emerald-400',headerClass: 'text-emerald-700',topBar: 'bg-emerald-300'},
];

const PRODUCTS = ['Modal', 'GGS', 'Celengan', 'PPOB'];
const IMPACTS: ImpactLevel[] = ['High', 'Medium', 'Low'];

function matchesProduct(item: ActionItem, product: string | null) {
  if (!product) return true;
  return item.product.includes(product);
}

const IMPACT_DOT: Record<ImpactLevel, string> = {
  High:   'bg-red-400',
  Medium: 'bg-amber-400',
  Low:    'bg-slate-300',
};

const IMPACT_TEXT: Record<ImpactLevel, string> = {
  High:   'text-red-600',
  Medium: 'text-amber-600',
  Low:    'text-slate-500',
};

function ActionRow({ item }: { item: ActionItem }) {
  return (
    <div className="py-4 border-b border-border last:border-0 space-y-1.5">
      <p className="text-[13px] font-semibold text-card-foreground leading-snug line-clamp-2">
        {item.feature}
      </p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-muted text-muted-foreground border-border shrink-0">
          {item.tag}
        </span>
        <span className="text-muted-foreground/30">·</span>
        <span className="text-[11px] text-muted-foreground shrink-0">{item.product}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', IMPACT_DOT[item.impact])} />
        <span className={cn('text-[11px] font-medium', IMPACT_TEXT[item.impact])}>
          {item.impact} impact
        </span>
      </div>
    </div>
  );
}

export default function NPSActionTracker() {
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const [activeImpact, setActiveImpact]   = useState<ImpactLevel | null>(null);

  function getFiltered(key: 'backlog' | 'inProgress' | 'planned') {
    return actionItems[key].filter(
      (item) =>
        matchesProduct(item, activeProduct) &&
        (!activeImpact || item.impact === activeImpact)
    );
  }

  const hasFilter = activeProduct || activeImpact;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Action Tracker</h2>
        <p className="text-[12px] text-muted-foreground mt-0.5">What teams are doing about NPS issues right now</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">Product</span>
          <div className="flex gap-1.5 flex-wrap">
            {PRODUCTS.map((p) => (
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
            {IMPACTS.map((impact) => (
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

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SECTIONS.map((section) => {
          const items = getFiltered(section.key);
          return (
            <div key={section.key} className="bg-muted/30 rounded-xl border border-border overflow-hidden">
              <div className={cn('h-1 w-full', section.topBar)} />
              <div className="px-5 py-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className={cn('w-2 h-2 rounded-full shrink-0', section.dot)} />
                  <p className={cn('text-[12px] font-semibold uppercase tracking-widest', section.headerClass)}>
                    {section.label}
                  </p>
                  <span className="ml-auto text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                    {items.length}
                  </span>
                </div>
                {items.length === 0 ? (
                  <p className="text-[12px] text-muted-foreground py-6 text-center">No items match</p>
                ) : (
                  <div>
                    {items.map((item) => (
                      <ActionRow key={item.feature} item={item} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
