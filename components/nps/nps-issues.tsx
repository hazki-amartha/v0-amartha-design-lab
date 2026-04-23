'use client';

import { useState } from 'react';
import { issueDrivers, deepDiveData, type ImpactLevel, type Product, type Journey } from '@/lib/nps/data';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const THEME_TAGS: Record<string, string[]> = {
  'Visibility & Clarity':    ['Loan Status', 'Profit Visibility', 'DLB'],
  'Lack of Confidence':      ['Disbursement'],
  'Fragmented Information':  ['Onboarding', 'Promo'],
  'Performance Issues':      ['Performance'],
};

const IMPACT_CONFIG: Record<ImpactLevel, { bar: string; badge: string }> = {
  High:   { bar: 'bg-red-400',    badge: 'bg-red-50 text-red-700 border-red-200' },
  Medium: { bar: 'bg-amber-400',  badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  Low:    { bar: 'bg-slate-300',  badge: 'bg-slate-50 text-slate-600 border-slate-200' },
};

const TAG_COLORS: Record<string, string> = {
  DLB:                'bg-violet-50 text-violet-700 border-violet-200',
  Disbursement:       'bg-orange-50 text-orange-700 border-orange-200',
  'Loan Status':      'bg-blue-50 text-blue-700 border-blue-200',
  'Profit Visibility':'bg-emerald-50 text-emerald-700 border-emerald-200',
  Promo:              'bg-pink-50 text-pink-700 border-pink-200',
  Performance:        'bg-red-50 text-red-700 border-red-200',
  Onboarding:         'bg-sky-50 text-sky-700 border-sky-200',
};

const THEME_BAR = [
  'bg-accent',
  'bg-[var(--chart-1)]',
  'bg-[var(--chart-4)]',
  'bg-[var(--chart-5)]',
];

interface FlatIssue {
  tag: string;
  issue: string;
  percentage: number;
  impact: ImpactLevel;
  product: Product;
  journey: Journey;
}

function buildFlatIssues(): FlatIssue[] {
  const result: FlatIssue[] = [];
  for (const [product, journeys] of Object.entries(deepDiveData)) {
    for (const [journey, issues] of Object.entries(journeys)) {
      for (const issue of issues) {
        result.push({
          ...issue,
          product: product as Product,
          journey: journey as Journey,
        });
      }
    }
  }
  return result.sort((a, b) => b.percentage - a.percentage);
}

const ALL_ISSUES = buildFlatIssues();

const PRODUCTS: Product[] = ['Modal', 'GGS', 'Celengan', 'PPOB'];

export default function NPSIssues() {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const activeTags = activeTheme ? THEME_TAGS[activeTheme] : null;
  const filtered = ALL_ISSUES
    .filter((i) => !activeTags || activeTags.includes(i.tag))
    .filter((i) => !activeProduct || i.product === activeProduct);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Root Causes & Issues</h2>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Select a theme to filter specific issues — or view all at once
        </p>
      </div>

      {/* Theme selector cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {issueDrivers.map((driver, i) => {
          const delta = driver.contribution - driver.previousContribution;
          const TrendIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
          const trendColor = delta > 0 ? 'text-red-500' : delta < 0 ? 'text-emerald-600' : 'text-muted-foreground';
          const impactClass = IMPACT_CONFIG[driver.impact].badge;
          const isActive = activeTheme === driver.theme;
          const barColor = THEME_BAR[i];

          return (
            <button
              key={driver.theme}
              onClick={() => setActiveTheme(isActive ? null : driver.theme)}
              className={cn(
                'text-left rounded-xl border px-4 py-3.5 transition-all space-y-2',
                isActive
                  ? 'border-accent bg-accent/5 shadow-[0_0_0_1px_var(--accent)]'
                  : 'border-border bg-muted/30 hover:border-muted-foreground/30'
              )}
            >
              <div className="flex items-start justify-between gap-1">
                <p className={cn('text-[13px] font-semibold leading-tight', isActive ? 'text-accent' : 'text-card-foreground')}>
                  {driver.theme}
                </p>
                <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 mt-0.5', impactClass)}>
                  {driver.impact}
                </span>
              </div>

              <div>
                <div className="flex items-end justify-between mb-1">
                  <span className="text-[11px] text-muted-foreground">Contribution</span>
                  <span className="text-[18px] font-semibold text-card-foreground leading-none">
                    {driver.contribution}<span className="text-[11px] font-normal text-muted-foreground">%</span>
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', barColor)} style={{ width: `${driver.contribution}%` }} />
                </div>
              </div>

              <div className={cn('flex items-center gap-1', trendColor)}>
                <TrendIcon className="h-3 w-3" />
                <span className="text-[10px] font-medium">
                  {delta > 0 ? '+' : ''}{delta}% vs last quarter
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Product filter */}
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

      {/* Issue table */}
      <div>
        {/* Table meta row */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'issue' : 'issues'}
            {activeTheme ? ` — ${activeTheme}` : ''}
            {activeProduct ? ` · ${activeProduct}` : ''}
          </p>
          {(activeTheme || activeProduct) && (
            <button
              onClick={() => { setActiveTheme(null); setActiveProduct(null); }}
              className="text-[11px] text-muted-foreground hover:text-card-foreground transition-colors underline underline-offset-2"
            >
              Clear all
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-8 text-center">
            <p className="text-[13px] text-muted-foreground">No issues mapped for this filter</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-[24px_1fr_140px_120px_52px] gap-0 bg-muted/50 border-b border-border px-4 py-2">
              <span />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Issue</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Product · Journey</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Tag</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground text-right">%</span>
            </div>

            {/* Rows — scrollable past 12 items */}
            <div className={cn(filtered.length > 12 ? 'max-h-[480px] overflow-y-auto' : '')}>
              {filtered.map((issue, idx) => {
                const impactDot = IMPACT_CONFIG[issue.impact].bar;
                const tagColor = TAG_COLORS[issue.tag] ?? 'bg-muted text-muted-foreground border-border';
                const pctColor =
                  issue.percentage >= 60 ? 'text-red-600' :
                  issue.percentage >= 35 ? 'text-amber-600' :
                  'text-muted-foreground';

                return (
                  <div
                    key={`${issue.product}-${issue.journey}-${idx}`}
                    className={cn(
                      'grid grid-cols-[24px_1fr_140px_120px_52px] gap-0 items-center px-4 py-2.5 border-b border-border last:border-0 transition-colors hover:bg-muted/30',
                      idx % 2 === 0 ? 'bg-card' : 'bg-muted/10'
                    )}
                  >
                    {/* Severity dot */}
                    <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', impactDot)} />

                    {/* Issue text — truncates gracefully */}
                    <p className="text-[12.5px] text-card-foreground pr-4 leading-snug line-clamp-2">
                      {issue.issue}
                    </p>

                    {/* Product · Journey */}
                    <p className="text-[11px] text-muted-foreground pr-4">
                      <span className="font-medium text-card-foreground/70">{issue.product}</span>
                      <span className="mx-1 text-muted-foreground/40">·</span>
                      {issue.journey}
                    </p>

                    {/* Tag */}
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border w-fit', tagColor)}>
                      {issue.tag}
                    </span>

                    {/* Percentage — color encodes severity */}
                    <span className={cn('text-[13px] font-semibold tabular-nums text-right', pctColor)}>
                      {issue.percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
