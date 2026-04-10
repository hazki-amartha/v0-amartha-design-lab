'use client';

import { useEffect, useState } from 'react';
import InsightsShell from '@/components/insights/insights-shell';
import { MonthData } from '@/lib/insights/types';

export default function InsightsPage() {
  const [months, setMonths] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMonths();
  }, []);

  async function loadMonths() {
    setLoading(true);
    try {
      const response = await fetch('/api/insights');
      const result = await response.json();
      if (result.success) {
        setMonths(result.data || []);
      }
    } catch (error) {
      console.error('Error loading months:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col gap-3 p-3 pl-0 min-h-screen">
      <div className="bg-card rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <h1 className="text-[22px] font-semibold tracking-tight text-card-foreground">User Insights</h1>
      </div>
      <div className="bg-card rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        {loading ? (
          <div className="space-y-6">
            <div className="flex gap-2">
              <div className="h-10 w-24 bg-muted rounded-md animate-pulse" />
              <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-40 bg-muted rounded-md animate-pulse" />
              <div className="h-40 bg-muted rounded-md animate-pulse" />
              <div className="h-40 bg-muted rounded-md animate-pulse" />
              <div className="h-40 bg-muted rounded-md animate-pulse" />
            </div>
          </div>
        ) : (
          <InsightsShell months={months} onDataUpdated={loadMonths} />
        )}
      </div>
    </main>
  );
}
