'use client';

import { useState } from 'react';
import { CSATDataRecord } from '@/lib/insights/types';
import { Button } from '@/components/ui/button';
import { ArrowDownWideNarrow } from 'lucide-react';
import { aggregateByBU, aggregateByFeature } from '@/lib/insights/utils';
import { MonthData } from '@/lib/insights/types';
import { ChevronDown } from 'lucide-react';
import BUScoreCardGrid from './bu-scorecard-grid';
import FeatureGrid from './feature-grid';

type SortMode = 'default' | 'delight' | 'dissatisfied';

interface DashboardTabProps {
  data: CSATDataRecord;
  months: MonthData[];
  onMonthChange: (month: string) => void;
}

export default function DashboardTab({ data, months, onMonthChange }: DashboardTabProps) {
  const [activeBU, setActiveBU] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('default');

  const buScores = aggregateByBU(data.data);
  const baseFeatures = aggregateByFeature(data.data, activeBU || undefined);

  // Summary metrics — scoped to active BU filter when set
  const filteredScores = activeBU ? buScores.filter((b) => b.business_unit === activeBU) : buScores;
  const filteredRows = activeBU ? data.data.filter((r) => r.business_unit === activeBU) : data.data;

  const totalResponses = filteredScores.reduce((s, b) => s + b.total_responses, 0);
  const totalDelighted = filteredScores.reduce((s, b) => s + b.delighted_count, 0);
  const totalSatisfied = filteredScores.reduce((s, b) => s + b.satisfied_count, 0);
  const overallCSAT = totalResponses > 0
    ? Math.round(((totalDelighted + totalSatisfied) / totalResponses) * 100)
    : 0;
  const totalJourneys = new Set(filteredRows.map((r) => r.trigger_event)).size;

  // Format month label: "2026-04" → "April 2026"
  const [year, month] = data.month.split('-');
  const monthLabel = new Date(Number(year), Number(month) - 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const features = [...baseFeatures].sort((a, b) => {
    if (sortMode === 'delight') return b.score.delighted - a.score.delighted;
    if (sortMode === 'dissatisfied') return b.score.dissatisfied - a.score.dissatisfied;
    return 0;
  });

  const toggle = (mode: SortMode) => setSortMode((prev) => (prev === mode ? 'default' : mode));

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold">CSAT Summary</h2>
          <div className="inline-grid relative">
            {/* Hidden span mirrors selected label — sizes the grid cell to fit content */}
            <span className="col-start-1 row-start-1 invisible pointer-events-none text-base font-normal pr-5">
              {monthLabel}
            </span>
            <select
              value={data.month}
              onChange={(e) => onMonthChange(e.target.value)}
              className="col-start-1 row-start-1 w-full appearance-none bg-transparent text-base font-normal text-muted-foreground pr-2 focus:outline-none cursor-pointer hover:text-card-foreground transition-colors"
            >
              {months.map((m) => {
                const [y, mo] = m.month.split('-');
                const label = new Date(Number(y), Number(mo) - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
                return <option key={m.month} value={m.month}>{label}</option>;
              })}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Summary metric cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/30 rounded-xl border border-border px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Overall CSAT</p>
            <p className="text-[28px] font-semibold tracking-tight text-card-foreground leading-none">
              {overallCSAT}
              <span className="text-[16px] text-muted-foreground font-normal">%</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Delighted + Satisfied</p>
          </div>
          <div className="bg-muted/30 rounded-xl border border-border px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Total Responses</p>
            <p className="text-[28px] font-semibold tracking-tight text-card-foreground leading-none">
              {totalResponses.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">{activeBU ? `In ${activeBU}` : 'Across all business units'}</p>
          </div>
          <div className="bg-muted/30 rounded-xl border border-border px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Total Journeys</p>
            <p className="text-[28px] font-semibold tracking-tight text-card-foreground leading-none">
              {totalJourneys}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Unique trigger events</p>
          </div>
        </div>

        <BUScoreCardGrid
          scores={buScores}
          activeBU={activeBU}
          onSelectBU={setActiveBU}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Journey Level Feedback</h2>
          <div className="flex gap-2">
            <Button
              variant={sortMode === 'delight' ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggle('delight')}
              className="gap-1.5"
            >
              <ArrowDownWideNarrow className="h-3.5 w-3.5" />
              Highest Delight
            </Button>
            <Button
              variant={sortMode === 'dissatisfied' ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggle('dissatisfied')}
              className="gap-1.5"
            >
              <ArrowDownWideNarrow className="h-3.5 w-3.5" />
              Highest Dissatisfied
            </Button>
          </div>
        </div>
        <FeatureGrid features={features} activeBU={activeBU} />
      </div>
    </div>
  );
}
