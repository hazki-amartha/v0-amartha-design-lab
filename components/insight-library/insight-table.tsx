'use client';

import { cn } from '@/lib/utils';
import type { Issue, ImpactLevel } from '@/lib/issues/types';

const IMPACT_DOT: Record<ImpactLevel, string> = {
  High:   'bg-red-400',
  Medium: 'bg-amber-400',
  Low:    'bg-slate-300',
};

const SOURCE_BADGE: Record<string, string> = {
  nps:  'bg-blue-50 text-blue-700 border-blue-200',
  csat: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

interface InsightTableProps {
  issues: Issue[];
}

export default function InsightTable({ issues }: InsightTableProps) {
  if (issues.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-12 text-center">
        <p className="text-[13px] text-muted-foreground">No issues match the current filters</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Column headers */}
      <div className="grid grid-cols-[16px_1fr_60px_90px_110px_110px_110px_56px] bg-muted/50 border-b border-border px-5 py-3 gap-x-4">
        <span />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Issue</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Source</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Period</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Business Unit</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Product Area</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Feature</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground text-right">Count</span>
      </div>

      {/* Rows */}
      <div className="overflow-y-auto">
        {issues.map((issue, idx) => {
          const dotClass = issue.impact ? IMPACT_DOT[issue.impact] : 'bg-muted-foreground/30';
          const sourceBadge = SOURCE_BADGE[issue.source] ?? 'bg-muted text-muted-foreground border-border';

          return (
            <div
              key={issue.id ?? idx}
              className="grid grid-cols-[16px_1fr_60px_90px_110px_110px_110px_56px] items-center gap-x-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 bg-card transition-colors"
            >
              {/* Impact dot */}
              <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotClass)} />

              {/* Title */}
              <p className="text-[13px] text-card-foreground leading-snug line-clamp-2 pr-2">
                {issue.title}
              </p>

              {/* Source */}
              <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border w-fit uppercase', sourceBadge)}>
                {issue.source}
              </span>

              {/* Period */}
              <p className="text-[11px] text-muted-foreground">{issue.period}</p>

              {/* Business Unit */}
              <p className="text-[11px] text-muted-foreground">{issue.business_unit ?? '—'}</p>

              {/* Product Area */}
              <p className="text-[11px] font-medium text-card-foreground/70">{issue.product_area ?? '—'}</p>

              {/* Feature */}
              <p className="text-[11px] text-muted-foreground">{issue.feature ?? '—'}</p>

              {/* Count */}
              <p className="text-[13px] font-semibold tabular-nums text-right text-card-foreground">
                {issue.count != null ? issue.count.toLocaleString() : '—'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
