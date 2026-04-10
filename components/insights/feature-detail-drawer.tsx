'use client';

import { FeatureDetail } from '@/lib/insights/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FeatureDetailDrawerProps {
  feature: FeatureDetail;
  onClose: () => void;
}

export default function FeatureDetailDrawer({
  feature,
  onClose,
}: FeatureDetailDrawerProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border shadow-lg z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{feature.business_unit}</Badge>
            <h2 className="font-semibold text-sm">{feature.feature_name}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Score Cards */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold mb-3">Sentiment Breakdown</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-green-50 p-3 text-center">
                <div className="text-lg font-semibold text-green-600">
                  {feature.score.delighted}%
                </div>
                <div className="text-xs text-muted-foreground">Delighted</div>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {feature.score.satisfied}%
                </div>
                <div className="text-xs text-muted-foreground">Satisfied</div>
              </div>
              <div className="rounded-lg bg-red-50 p-3 text-center">
                <div className="text-lg font-semibold text-red-600">
                  {feature.score.dissatisfied}%
                </div>
                <div className="text-xs text-muted-foreground">Dissatisfied</div>
              </div>
            </div>
          </div>

          {/* Pain Points */}
          {feature.pain_points.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Pain Points</h3>
              <div className="space-y-2">
                {feature.pain_points.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="text-sm space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-foreground flex-1">{item.text}</p>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {item.count}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-red-500 h-1.5 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Positive Feedback */}
          {feature.positive_feedback.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">What Users Love</h3>
              <div className="space-y-2">
                {feature.positive_feedback.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="text-sm space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-foreground flex-1">{item.text}</p>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {item.count}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Responses */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Total responses: {feature.total_responses}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
