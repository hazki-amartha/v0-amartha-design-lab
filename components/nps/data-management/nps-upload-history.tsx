'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { NPSPeriodData } from '@/lib/nps/types';

interface NPSUploadHistoryProps {
  periods: NPSPeriodData[];
  onDelete: () => void;
}

export default function NPSUploadHistory({ periods, onDelete }: NPSUploadHistoryProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(period: string) {
    if (!confirm(`Delete NPS data for ${period}? This will also remove all linked issues.`)) return;
    setDeleting(period);
    try {
      const res = await fetch(`/api/nps/data?period=${encodeURIComponent(period)}`, { method: 'DELETE' });
      if (res.ok) {
        onDelete();
      } else {
        alert('Failed to delete period');
      }
    } catch {
      alert('Failed to delete period');
    } finally {
      setDeleting(null);
    }
  }

  if (periods.length === 0) {
    return (
      <Card className="p-8 shadow-none rounded-lg text-center">
        <p className="text-muted-foreground">No NPS uploads yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {periods.map(period => (
        <Card key={period.period} className="p-4 shadow-none rounded-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{period.filename}</p>
              <p className="text-xs text-muted-foreground">
                {period.row_count} issues · uploaded {new Date(period.uploaded_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline">{period.period}</Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(period.period)}
                disabled={deleting === period.period}
                className="h-8 w-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
