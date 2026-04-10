'use client';

import { useState } from 'react';
import { CSATDataRecord, FeatureDetail } from '@/lib/insights/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TrendSparkline from './trend-sparkline';
import FeatureDetailDrawer from './feature-detail-drawer';

interface FeatureGridProps {
  features: FeatureDetail[];
  data: CSATDataRecord;
  activeBU: string | null;
  showTrend: boolean;
}

export default function FeatureGrid({
  features,
  data,
  activeBU,
  showTrend,
}: FeatureGridProps) {
  const [selectedFeature, setSelectedFeature] = useState<FeatureDetail | null>(null);

  if (features.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No feedback data available for selected filter.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <Card
            key={feature.feature_name}
            onClick={() => setSelectedFeature(feature)}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sm leading-tight flex-1">
                  {feature.feature_name}
                </h3>
                {activeBU && (
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {activeBU}
                  </Badge>
                )}
              </div>

              {showTrend ? (
                <TrendSparkline />
              ) : (
                <div className="space-y-2">
                  {/* Score Pills */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-green-600">
                        {feature.score.delighted}%
                      </div>
                      <div className="text-xs text-muted-foreground">Delighted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-blue-600">
                        {feature.score.satisfied}%
                      </div>
                      <div className="text-xs text-muted-foreground">Satisfied</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-red-600">
                        {feature.score.dissatisfied}%
                      </div>
                      <div className="text-xs text-muted-foreground">Dissatisfied</div>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                {feature.total_responses} responses
              </p>
            </div>
          </Card>
        ))}
      </div>

      {selectedFeature && (
        <FeatureDetailDrawer
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />
      )}
    </>
  );
}
