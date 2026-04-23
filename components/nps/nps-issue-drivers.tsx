'use client';

import { issueDrivers, type ImpactLevel } from '@/lib/nps/data';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const IMPACT_CONFIG: Record<ImpactLevel, { className: string }> = {
  High: { className: 'bg-red-50 text-red-700 border-red-200' },
  Medium: { className: 'bg-amber-50 text-amber-700 border-amber-200' },
  Low: { className: 'bg-slate-50 text-slate-600 border-slate-200' },
};

const BAR_COLORS = [
  'bg-accent',
  'bg-chart-1',
  'bg-chart-4',
  'bg-chart-5',
];

export default function NPSIssueDrivers() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Core Issue Drivers</h2>
        <p className="text-[12px] text-muted-foreground mt-0.5">Why NPS changed — grouped by theme</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {issueDrivers.map((driver, i) => {
          const delta = driver.contribution - driver.previousContribution;
          const TrendIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
          const trendColor = delta > 0 ? 'text-red-500' : delta < 0 ? 'text-emerald-600' : 'text-muted-foreground';
          const impactConfig = IMPACT_CONFIG[driver.impact];
          const barColor = BAR_COLORS[i] ?? 'bg-accent';

          return (
            <div
              key={driver.theme}
              className="bg-muted/30 rounded-xl border border-border px-5 py-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[14px] font-semibold text-card-foreground">{driver.theme}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <TrendIcon className={cn('h-3 w-3', trendColor)} />
                    <span className={cn('text-[11px] font-medium', trendColor)}>
                      {delta > 0 ? '+' : ''}{delta}% vs last quarter
                    </span>
                  </div>
                </div>
                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0', impactConfig.className)}>
                  {driver.impact} Impact
                </span>
              </div>

              {/* Contribution bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-muted-foreground">Contribution to NPS drop</span>
                  <span className="text-[13px] font-semibold text-card-foreground">{driver.contribution}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', barColor)}
                    style={{ width: `${driver.contribution}%` }}
                  />
                </div>
              </div>

              {/* Sub-issues */}
              <ul className="space-y-1">
                {driver.issues.map((issue) => (
                  <li key={issue} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
