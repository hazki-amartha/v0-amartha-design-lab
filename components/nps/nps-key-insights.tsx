'use client';

import { useState } from 'react';
import { keyInsights } from '@/lib/nps/data';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, TrendingUp, Info } from 'lucide-react';

const TYPE_CONFIG = {
  danger: {
    border: 'border-l-red-400',
    bg: 'bg-red-50/50',
    badge: 'bg-red-50 text-red-700 border-red-200',
    activeBadge: 'bg-red-600 text-white border-red-600',
    label: 'Critical',
    Icon: AlertCircle,
    icon: 'text-red-400',
  },
  warning: {
    border: 'border-l-amber-400',
    bg: 'bg-amber-50/50',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    activeBadge: 'bg-amber-500 text-white border-amber-500',
    label: 'Watch',
    Icon: AlertTriangle,
    icon: 'text-amber-400',
  },
  success: {
    border: 'border-l-emerald-400',
    bg: 'bg-emerald-50/50',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    activeBadge: 'bg-emerald-600 text-white border-emerald-600',
    label: 'Positive',
    Icon: TrendingUp,
    icon: 'text-emerald-500',
  },
  info: {
    border: 'border-l-blue-400',
    bg: 'bg-blue-50/50',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    activeBadge: 'bg-blue-600 text-white border-blue-600',
    label: 'Context',
    Icon: Info,
    icon: 'text-blue-400',
  },
} as const;

const TYPE_ORDER = ['danger', 'warning', 'success', 'info'] as const;
const PRODUCTS = ['Modal', 'GGS', 'PPOB'];

export default function NPSKeyInsights() {
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<string | null>(null);

  const sorted = [...keyInsights].sort(
    (a, b) =>
      TYPE_ORDER.indexOf(a.type as typeof TYPE_ORDER[number]) -
      TYPE_ORDER.indexOf(b.type as typeof TYPE_ORDER[number])
  );

  const filtered = sorted.filter(
    (i) =>
      (!activeType || i.type === activeType) &&
      (!activeProduct || i.product === activeProduct)
  );

  const hasFilter = activeType || activeProduct;

  return (
    <div className="space-y-4">
      {/* Header + type filter pills */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Key Insights</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {filtered.length} of {keyInsights.length} findings from Q4 2025 · sorted by urgency
          </p>
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end shrink-0">
          {TYPE_ORDER.map((type) => {
            const count = keyInsights.filter((i) => i.type === type).length;
            if (!count) return null;
            const cfg = TYPE_CONFIG[type];
            const isActive = activeType === type;
            return (
              <button
                key={type}
                onClick={() => setActiveType(isActive ? null : type)}
                className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors',
                  isActive ? cfg.activeBadge : cfg.badge
                )}
              >
                {count} {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product + clear filters row */}
      <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
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
        {hasFilter && (
          <button
            onClick={() => { setActiveType(null); setActiveProduct(null); }}
            className="text-[11px] text-muted-foreground hover:text-card-foreground underline underline-offset-2 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-10 text-center">
          <p className="text-[13px] text-muted-foreground">No insights match this filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((insight, idx) => {
            const cfg = TYPE_CONFIG[insight.type as keyof typeof TYPE_CONFIG];
            const { Icon } = cfg;
            return (
              <div
                key={idx}
                className={cn(
                  'rounded-xl border border-border border-l-4 px-4 py-4 flex flex-col gap-3',
                  cfg.border,
                  cfg.bg,
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Icon className={cn('h-3.5 w-3.5 shrink-0', cfg.icon)} />
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', cfg.badge)}>
                      {cfg.label}
                    </span>
                  </div>
                  {insight.product && (
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full border border-border">
                      {insight.product}
                    </span>
                  )}
                </div>

                {insight.stat && (
                  <div>
                    <p className="text-[26px] font-bold leading-none text-card-foreground tracking-tight">
                      {insight.stat}
                    </p>
                    {insight.delta && (
                      <p className="text-[11px] text-muted-foreground mt-1">{insight.delta}</p>
                    )}
                  </div>
                )}

                <p className="text-[12.5px] text-card-foreground/80 leading-relaxed">
                  {insight.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
