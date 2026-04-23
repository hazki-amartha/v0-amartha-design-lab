'use client';

import { keyInsights } from '@/lib/nps/data';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, TrendingUp, Info } from 'lucide-react';

const TYPE_CONFIG = {
  danger: {
    border: 'border-l-red-400',
    bg: 'bg-red-50/50',
    badge: 'bg-red-50 text-red-700 border-red-200',
    label: 'Critical',
    Icon: AlertCircle,
    icon: 'text-red-400',
  },
  warning: {
    border: 'border-l-amber-400',
    bg: 'bg-amber-50/50',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Watch',
    Icon: AlertTriangle,
    icon: 'text-amber-400',
  },
  success: {
    border: 'border-l-emerald-400',
    bg: 'bg-emerald-50/50',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Positive',
    Icon: TrendingUp,
    icon: 'text-emerald-500',
  },
  info: {
    border: 'border-l-blue-400',
    bg: 'bg-blue-50/50',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    label: 'Context',
    Icon: Info,
    icon: 'text-blue-400',
  },
} as const;

const TYPE_ORDER = ['danger', 'warning', 'success', 'info'] as const;

export default function NPSKeyInsights() {
  const sorted = [...keyInsights].sort(
    (a, b) =>
      TYPE_ORDER.indexOf(a.type as typeof TYPE_ORDER[number]) -
      TYPE_ORDER.indexOf(b.type as typeof TYPE_ORDER[number])
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Key Insights</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {keyInsights.length} findings from Q4 2025 · sorted by urgency
          </p>
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end shrink-0">
          {TYPE_ORDER.map((type) => {
            const count = keyInsights.filter((i) => i.type === type).length;
            if (!count) return null;
            const cfg = TYPE_CONFIG[type];
            return (
              <span key={type} className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', cfg.badge)}>
                {count} {cfg.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sorted.map((insight, idx) => {
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
              {/* Urgency badge + product tag */}
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

              {/* Prominent stat */}
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

              {/* Insight text */}
              <p className="text-[12.5px] text-card-foreground/80 leading-relaxed">
                {insight.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
