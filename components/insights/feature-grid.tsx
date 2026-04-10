'use client';

import { useState } from 'react';
import { FeatureDetail } from '@/lib/insights/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SentimentChart from './sentiment-chart';
import FeatureDetailDrawer from './feature-detail-drawer';

interface FeatureGridProps {
  features: FeatureDetail[];
  activeBU: string | null;
}

export default function FeatureGrid({ features, activeBU }: FeatureGridProps) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <Card
            key={feature.feature_name}
            onClick={() => setSelectedFeature(feature)}
            className="shadow-none p-4 cursor-pointer hover:bg-muted transition-colors gap-0 border-border"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="font-semibold text-[13px] text-card-foreground leading-tight flex-1">
                {feature.feature_name}
              </h3>
              <Badge variant="secondary" className="text-[10px] flex-shrink-0">
                {feature.business_unit}
              </Badge>
            </div>

            <SentimentChart
              delighted={feature.score.delighted}
              satisfied={feature.score.satisfied}
              dissatisfied={feature.score.dissatisfied}
            />

            <div className="flex items-center gap-3 mt-3">
              <span className="text-[11px] text-muted-foreground">
                <span className="text-red-500 font-medium">{feature.pain_points.length}</span> pain points
              </span>
              <span className="text-muted-foreground/40 text-[11px]">·</span>
              <span className="text-[11px] text-muted-foreground">
                <span className="text-green-600 font-medium">{feature.positive_feedback.length}</span> delight points
              </span>
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
