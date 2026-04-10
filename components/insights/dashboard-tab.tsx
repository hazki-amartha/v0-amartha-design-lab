'use client';

import { useState } from 'react';
import { CSATDataRecord } from '@/lib/insights/types';
import { Button } from '@/components/ui/button';
import { ArrowDownWideNarrow } from 'lucide-react';
import { aggregateByBU, aggregateByFeature } from '@/lib/insights/utils';
import BUScoreCardGrid from './bu-scorecard-grid';
import FeatureGrid from './feature-grid';

type SortMode = 'default' | 'delight' | 'dissatisfied';

interface DashboardTabProps {
  data: CSATDataRecord;
}

export default function DashboardTab({ data }: DashboardTabProps) {
  const [activeBU, setActiveBU] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('default');

  const buScores = aggregateByBU(data.data);
  const baseFeatures = aggregateByFeature(data.data, activeBU || undefined);

  const features = [...baseFeatures].sort((a, b) => {
    if (sortMode === 'delight') return b.score.delighted - a.score.delighted;
    if (sortMode === 'dissatisfied') return b.score.dissatisfied - a.score.dissatisfied;
    return 0;
  });

  const toggle = (mode: SortMode) => setSortMode((prev) => (prev === mode ? 'default' : mode));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Business Unit Summary</h2>
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
