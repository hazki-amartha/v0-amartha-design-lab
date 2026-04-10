'use client';

import { BUScorecard } from '@/lib/insights/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    if (activeBU === bu) {
      onSelectBU(null);
    } else {
      onSelectBU(bu);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {scores.map((score) => {
        const isActive = activeBU === score.business_unit;
        return (
          <Card
            key={score.business_unit}
            onClick={() => handleClick(score.business_unit)}
            className={`p-4 cursor-pointer transition-colors ${
              isActive
                ? 'border-primary bg-primary/5'
                : 'hover:bg-muted border-border'
            }`}
          >
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">{score.business_unit}</h3>

              {/* Delighted Percentage */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">Delighted</span>
                  <span className="text-sm font-semibold text-green-600">
                    {score.delighted_percentage}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${score.delighted_percentage}%` }}
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  {score.delighted_count} Delighted
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {score.satisfied_count} Satisfied
                </Badge>
                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                  {score.dissatisfied_count} Dissatisfied
                </Badge>
              </div>

              {/* Total Count */}
              <p className="text-xs text-muted-foreground pt-2">
                {score.total_responses} responses
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
