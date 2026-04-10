'use client';

import { BUScorecard } from '@/lib/insights/types';
import { Card } from '@/components/ui/card';
import SentimentChart from './sentiment-chart';

interface BUScoreCardGridProps {
  scores: BUScorecard[];
  activeBU: string | null;
  onSelectBU: (bu: string | null) => void;
}

export default function BUScoreCardGrid({
  scores,
  activeBU,
  onSelectBU,
}: BUScoreCardGridProps) {
  const handleClick = (bu: string) => {
    onSelectBU(activeBU === bu ? null : bu);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {scores.map((score) => {
        const isActive = activeBU === score.business_unit;
        return (
          <Card
            key={score.business_unit}
            onClick={() => handleClick(score.business_unit)}
            className={`shadow-none p-4 cursor-pointer transition-colors gap-0 ${
              isActive
                ? 'border-primary bg-primary/5'
                : 'hover:bg-muted border-border'
            }`}
          >
            <h3 className="font-semibold text-[13px] text-card-foreground mb-3">
              {score.business_unit}
            </h3>

            <SentimentChart
              delighted={score.delighted_percentage}
              satisfied={score.satisfied_percentage}
              dissatisfied={score.dissatisfied_percentage}
            />

            <p className="text-[11px] text-muted-foreground mt-3">
              {score.total_responses.toLocaleString()} responses
            </p>
          </Card>
        );
      })}
    </div>
  );
}
