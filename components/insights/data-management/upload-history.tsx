'use client';

import { useState } from 'react';
import { MonthData } from '@/lib/insights/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface UploadHistoryProps {
  months: MonthData[];
  onDelete: () => void;
}

export default function UploadHistory({ months, onDelete }: UploadHistoryProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (month: string) => {
    if (!confirm(`Delete data for ${month}?`)) return;

    setDeleting(month);
    try {
      const response = await fetch(`/api/insights?month=${month}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete();
      } else {
        alert('Failed to delete data');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete data');
    } finally {
      setDeleting(null);
    }
  };

  if (months.length === 0) {
    return (
      <Card className="p-8 shadow-none rounded-lg text-center">
        <p className="text-muted-foreground">No uploads yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {months.map((month) => (
        <Card key={month.month} className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{month.filename}</p>
              <p className="text-xs text-muted-foreground">
                {month.row_count} rows • uploaded {new Date(month.uploaded_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline">{month.month}</Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(month.month)}
                disabled={deleting === month.month}
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
