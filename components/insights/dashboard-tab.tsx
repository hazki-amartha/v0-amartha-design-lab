'use client';

import { useState } from 'react';
import { CSATDataRecord } from '@/lib/insights/types';
import { Button } from '@/components/ui/button';
import { aggregateByBU, aggregateByFeature } from '@/lib/insights/utils';
import BUScoreCardGrid from './bu-scorecard-grid';
import FeatureGrid from './feature-grid';

interface DashboardTabProps {
  data: CSATDataRecord;
}

export default function DashboardTab({ data }: DashboardTabProps) {
  const [activeBU, setActiveBU] = useState<string | null>(null);
  const [showTrend, setShowTrend] = useState(false);

  const buScores = aggregateByBU(data.data);
  const features = aggregateByFeature(data.data, activeBU || undefined);

  return (
    <div className="space-y-6">
      {/* BU Scorecard Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Business Unit Summary</h2>
        <BUScoreCardGrid
          scores={buScores}
          activeBU={activeBU}
          onSelectBU={setActiveBU}
        />
      </div>

      {/* Feature Grid with Trend Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Journey Level Feedback</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTrend(!showTrend)}
          >
            {showTrend ? 'Show Scores' : 'Show Trend'}
          </Button>
        </div>
        <FeatureGrid
          features={features}
          data={data}
          activeBU={activeBU}
          showTrend={showTrend}
        />
      </div>
    </div>
  );
}
