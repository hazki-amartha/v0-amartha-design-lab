'use client';

import { npsOverview } from '@/lib/nps/data';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const BENCHMARK_CONFIG = {
  Good: { label: 'Good', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  Great: { label: 'Great', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'Needs Improvement': { label: 'Needs Improvement', className: 'bg-red-50 text-red-700 border-red-200' },
};

export default function NPSOverview() {
  const { currentScore, change, benchmark, promoters, passives, detractors, totalResponses, period } = npsOverview;
  const benchmarkConfig = BENCHMARK_CONFIG[benchmark] ?? BENCHMARK_CONFIG['Good'];

  const TrendIcon = change < 0 ? TrendingDown : change > 0 ? TrendingUp : Minus;
  const trendColor = change < 0 ? 'text-red-500' : change > 0 ? 'text-emerald-500' : 'text-muted-foreground';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* NPS Score */}
      <div className="bg-muted/30 rounded-xl border border-border px-5 py-4 md:col-span-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          NPS Score — {period}
        </p>
        <div className="flex items-end gap-3 mb-3">
          <p className="text-[56px] font-semibold tracking-tight text-card-foreground leading-none">
            {currentScore}
          </p>
          <div className={cn('flex items-center gap-1 mb-1', trendColor)}>
            <TrendIcon className="h-4 w-4" />
            <span className="text-[14px] font-semibold">
              {change > 0 ? '+' : ''}{change} pts
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full border', benchmarkConfig.className)}>
            {benchmarkConfig.label}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {totalResponses.toLocaleString()} responses
          </span>
        </div>
      </div>

      {/* Promoter / Passive / Detractor */}
      <div className="bg-muted/30 rounded-xl border border-border px-5 py-4 md:col-span-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Respondent Breakdown
        </p>

        {/* Stacked bar */}
        <div className="flex h-3 rounded-full overflow-hidden mb-4">
          <div style={{ width: `${promoters}%` }} className="bg-emerald-400 transition-all" />
          <div style={{ width: `${passives}%` }} className="bg-slate-300 transition-all" />
          <div style={{ width: `${detractors}%` }} className="bg-red-400 transition-all" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <BreakdownCard
            label="Promoters"
            value={promoters}
            description="Score 9–10"
            color="text-emerald-600"
            dotColor="bg-emerald-400"
          />
          <BreakdownCard
            label="Passives"
            value={passives}
            description="Score 7–8"
            color="text-slate-500"
            dotColor="bg-slate-300"
          />
          <BreakdownCard
            label="Detractors"
            value={detractors}
            description="Score 0–6"
            color="text-red-500"
            dotColor="bg-red-400"
          />
        </div>
      </div>
    </div>
  );
}

function BreakdownCard({
  label,
  value,
  description,
  color,
  dotColor,
}: {
  label: string;
  value: number;
  description: string;
  color: string;
  dotColor: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <span className={cn('w-2 h-2 rounded-full', dotColor)} />
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
      <p className={cn('text-[24px] font-semibold leading-none', color)}>
        {value}<span className="text-[14px] font-normal">%</span>
      </p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}
