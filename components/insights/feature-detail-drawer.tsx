'use client';

import { useState } from 'react';
import { FeatureDetail, FeedbackItem } from '@/lib/insights/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

interface FeatureDetailDrawerProps {
  feature: FeatureDetail;
  onClose: () => void;
}

const PAGE_SIZE = 5;

function FeedbackList({
  items,
  barColor,
}: {
  items: FeedbackItem[];
  barColor: string;
}) {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const maxCount = Math.max(...items.map((i) => i.count), 1);
  const normalize = (count: number) => Math.max((count / maxCount) * 95, 2);
  const visible = items.slice(0, limit);
  const hasMore = limit < items.length;

  return (
    <div className="space-y-3">
      {visible.map((item, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-foreground flex-1">{item.text}</p>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {item.count}
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className={`${barColor} h-1.5 rounded-full transition-all duration-500`}
              style={{ width: `${normalize(item.count)}%` }}
            />
          </div>
        </div>
      ))}
      {hasMore ? (
        <button
          onClick={() => setLimit((l) => l + PAGE_SIZE)}
          className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-card-foreground transition-colors mt-1"
        >
          <ChevronDown className="h-3.5 w-3.5" />
          View {Math.min(PAGE_SIZE, items.length - limit)} more
        </button>
      ) : limit > PAGE_SIZE && (
        <button
          onClick={() => setLimit(PAGE_SIZE)}
          className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-card-foreground transition-colors mt-1"
        >
          <ChevronUp className="h-3.5 w-3.5" />
          View less
        </button>
      )}
    </div>
  );
}

export default function FeatureDetailDrawer({
  feature,
  onClose,
}: FeatureDetailDrawerProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 h-full z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-lg z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm">{feature.feature_name}</h2>
            <Badge variant="secondary">{feature.business_unit}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Score Cards */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Sentiment Breakdown</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-green-50 p-3 text-center">
                <div className="text-lg font-semibold text-green-600">{feature.score.delighted}%</div>
                <div className="text-xs text-muted-foreground">Delighted</div>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-center">
                <div className="text-lg font-semibold text-blue-600">{feature.score.satisfied}%</div>
                <div className="text-xs text-muted-foreground">Satisfied</div>
              </div>
              <div className="rounded-lg bg-red-50 p-3 text-center">
                <div className="text-lg font-semibold text-red-600">{feature.score.dissatisfied}%</div>
                <div className="text-xs text-muted-foreground">Dissatisfied</div>
              </div>
            </div>
          </div>

          {/* Pain Points */}
          {feature.pain_points.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Pain Points</h3>
              <FeedbackList items={feature.pain_points} barColor="bg-red-500" />
            </div>
          )}

          {/* Positive Feedback */}
          {feature.positive_feedback.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">What Users Love</h3>
              <FeedbackList items={feature.positive_feedback} barColor="bg-green-500" />
            </div>
          )}

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
