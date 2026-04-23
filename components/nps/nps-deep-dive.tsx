'use client';

import { useState } from 'react';
import { deepDiveData, type Product, type Journey, type ImpactLevel } from '@/lib/nps/data';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';

const PRODUCTS: Product[] = ['Modal', 'GGS', 'Celengan', 'PPOB'];
const JOURNEYS: Journey[] = ['Monitoring', 'Application', 'Onboarding', 'Disbursement', 'Repayment'];

const IMPACT_CONFIG: Record<ImpactLevel, { bar: string; badge: string }> = {
  High: { bar: 'bg-red-400', badge: 'bg-red-50 text-red-700 border-red-200' },
  Medium: { bar: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  Low: { bar: 'bg-slate-300', badge: 'bg-slate-50 text-slate-600 border-slate-200' },
};

const TAG_COLORS: Record<string, string> = {
  DLB: 'bg-violet-50 text-violet-700 border-violet-200',
  Disbursement: 'bg-orange-50 text-orange-700 border-orange-200',
  'Loan Status': 'bg-blue-50 text-blue-700 border-blue-200',
  'Profit Visibility': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Promo: 'bg-pink-50 text-pink-700 border-pink-200',
  Performance: 'bg-red-50 text-red-700 border-red-200',
  Onboarding: 'bg-sky-50 text-sky-700 border-sky-200',
};

export default function NPSDeepDive() {
  const [product, setProduct] = useState<Product>('Modal');
  const [journey, setJourney] = useState<Journey>('Monitoring');

  const issues = deepDiveData[product][journey] ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Issue Deep Dive</h2>
        <p className="text-[12px] text-muted-foreground mt-0.5">Filter by product and journey to explore specific pain points</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Product</label>
          <Select
            value={product}
            onChange={(e) => setProduct(e.target.value as Product)}
            className="w-[160px]"
          >
            {PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Journey</label>
          <Select
            value={journey}
            onChange={(e) => setJourney(e.target.value as Journey)}
            className="w-[160px]"
          >
            {JOURNEYS.map((j) => <option key={j} value={j}>{j}</option>)}
          </Select>
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-10 text-center">
          <p className="text-[13px] text-muted-foreground">No issues recorded for {product} → {journey}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {issues.map((issue) => {
            const impactConfig = IMPACT_CONFIG[issue.impact];
            const tagColor = TAG_COLORS[issue.tag] ?? 'bg-muted text-muted-foreground border-border';
            return (
              <div
                key={issue.issue}
                className="bg-muted/30 rounded-xl border border-border px-5 py-3.5 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', tagColor)}>
                      {issue.tag}
                    </span>
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', impactConfig.badge)}>
                      {issue.impact}
                    </span>
                  </div>
                  <p className="text-[13px] text-card-foreground font-medium truncate">{issue.issue}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[20px] font-semibold text-card-foreground leading-none">{issue.percentage}<span className="text-[12px] font-normal text-muted-foreground">%</span></p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">of users</p>
                </div>
                <div className="w-24 shrink-0">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', impactConfig.bar)}
                      style={{ width: `${issue.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tag legend */}
      <div className="flex flex-wrap gap-2 pt-1">
        {Object.entries(TAG_COLORS).map(([tag, cls]) => (
          <span key={tag} className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', cls)}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
