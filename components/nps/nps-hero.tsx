import { TrendingDown } from 'lucide-react';

export default function NPSHero() {
  return (
    <div className="grid grid-cols-[2fr_3fr] gap-4">
      {/* Left: NPS Score */}
      <div className="rounded-2xl border border-border bg-card px-6 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          NPS Score — Q4 2025
        </p>
        <div className="flex items-end gap-3 mb-4">
          <span className="text-[64px] font-bold leading-none text-foreground tracking-tight">40</span>
          <div className="mb-1.5 flex items-center gap-1">
            <TrendingDown className="h-4 w-4 text-red-500" strokeWidth={2.5} />
            <span className="text-[14px] font-semibold text-red-500">-4 pts</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-border text-muted-foreground">
            Good
          </span>
          <span className="text-[12px] text-muted-foreground">1,070 responses</span>
        </div>
      </div>

      {/* Right: Respondent Breakdown */}
      <div className="rounded-2xl border border-border bg-card px-6 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Respondent Breakdown
        </p>

        {/* Segmented bar */}
        <div className="flex h-3 rounded-full overflow-hidden mb-5">
          <div className="bg-emerald-400" style={{ width: '58%' }} />
          <div className="bg-slate-200 mx-0.5" style={{ width: '24%' }} />
          <div className="bg-red-400" style={{ width: '18%' }} />
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-3 divide-x divide-border">
          <div className="pr-6">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-[12px] text-muted-foreground">Promoters</span>
            </div>
            <p className="text-[32px] font-bold text-emerald-500 leading-none mb-1">
              58<span className="text-[18px] font-semibold">%</span>
            </p>
            <p className="text-[11px] text-muted-foreground">Score 9–10</p>
          </div>
          <div className="px-6">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
              <span className="text-[12px] text-muted-foreground">Passives</span>
            </div>
            <p className="text-[32px] font-bold text-slate-500 leading-none mb-1">
              24<span className="text-[18px] font-semibold">%</span>
            </p>
            <p className="text-[11px] text-muted-foreground">Score 7–8</p>
          </div>
          <div className="pl-6">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
              <span className="text-[12px] text-muted-foreground">Detractors</span>
            </div>
            <p className="text-[32px] font-bold text-red-500 leading-none mb-1">
              18<span className="text-[18px] font-semibold">%</span>
            </p>
            <p className="text-[11px] text-muted-foreground">Score 0–6</p>
          </div>
        </div>
      </div>
    </div>
  );
}
