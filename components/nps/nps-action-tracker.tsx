'use client';

import { actionItems, type ActionItem, type ImpactLevel } from '@/lib/nps/data';
import { cn } from '@/lib/utils';

const IMPACT_CONFIG: Record<ImpactLevel, string> = {
  High: 'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-slate-50 text-slate-600 border-slate-200',
};

const TAG_COLORS: Record<string, string> = {
  DLB: 'bg-violet-50 text-violet-700 border-violet-200',
  Disbursement: 'bg-orange-50 text-orange-700 border-orange-200',
  'Loan Status': 'bg-blue-50 text-blue-700 border-blue-200',
  'Profit Visibility': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Promo: 'bg-pink-50 text-pink-700 border-pink-200',
  Performance: 'bg-red-50 text-red-700 border-red-200',
  Onboarding: 'bg-sky-50 text-sky-700 border-sky-200',
  'Fragmented Information': 'bg-slate-50 text-slate-700 border-slate-200',
  'Lack of Confidence': 'bg-purple-50 text-purple-700 border-purple-200',
};

const SECTIONS = [
  {
    key: 'backlog' as const,
    label: 'Backlog',
    dot: 'bg-slate-400',
    headerClass: 'text-slate-600',
    topBar: 'bg-slate-200',
  },
  {
    key: 'inProgress' as const,
    label: 'In Progress',
    dot: 'bg-amber-400',
    headerClass: 'text-amber-700',
    topBar: 'bg-amber-300',
  },
  {
    key: 'planned' as const,
    label: 'Released',
    dot: 'bg-emerald-400',
    headerClass: 'text-emerald-700',
    topBar: 'bg-emerald-300',
  },
];

function ActionRow({ item }: { item: ActionItem }) {
  const impactClass = IMPACT_CONFIG[item.impact];
  const tagClass = TAG_COLORS[item.tag] ?? 'bg-muted text-muted-foreground border-border';

  return (
    <div className="py-3 border-b border-border last:border-0 space-y-2">
      <p className="text-[13px] font-semibold text-card-foreground leading-snug line-clamp-2">
        {item.feature}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0', tagClass)}>
          {item.tag}
        </span>
        <span className="text-[11px] text-muted-foreground truncate flex-1 min-w-0">
          {item.product} · {item.owner}
        </span>
        <span className={cn('shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border', impactClass)}>
          {item.impact}
        </span>
      </div>
    </div>
  );
}

export default function NPSActionTracker() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Action Tracker</h2>
        <p className="text-[12px] text-muted-foreground mt-0.5">What teams are doing about NPS issues right now</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SECTIONS.map((section) => (
          <div key={section.key} className="bg-muted/30 rounded-xl border border-border overflow-hidden">
            {/* Color accent bar */}
            <div className={cn('h-1 w-full', section.topBar)} />
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-4">
                <span className={cn('w-2 h-2 rounded-full shrink-0', section.dot)} />
                <p className={cn('text-[12px] font-semibold uppercase tracking-widest', section.headerClass)}>
                  {section.label}
                </p>
                <span className="ml-auto text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                  {actionItems[section.key].length}
                </span>
              </div>
              <div>
                {actionItems[section.key].map((item) => (
                  <ActionRow key={item.feature} item={item} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
