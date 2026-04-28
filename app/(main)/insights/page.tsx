'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import InsightsShell from '@/components/insights/insights-shell';
import { MonthData } from '@/lib/insights/types';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { Database } from 'lucide-react';

export default function InsightsPage() {
  const router = useRouter();
  const [months, setMonths] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    loadMonths();
  }, []);

  async function loadMonths() {
    setLoading(true);
    try {
      const response = await fetch('/api/insights');
      const result = await response.json();
      if (result.success) {
        const data: MonthData[] = result.data || [];
        setMonths(data);
        if (data.length > 0) setSelectedMonth(data[0].month);
      }
    } catch (error) {
      console.error('Error loading months:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="CSAT Dashboard"
        actions={
          <Button
            variant="default"
            onClick={() => router.push('/insights/data')}
            className="gap-2"
          >
            <Database className="w-4 h-4" />
            Manage Data Source
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="h-40 bg-muted rounded-md animate-pulse" />
            <div className="h-40 bg-muted rounded-md animate-pulse" />
            <div className="h-40 bg-muted rounded-md animate-pulse" />
            <div className="h-40 bg-muted rounded-md animate-pulse" />
          </div>
        ) : (
          <InsightsShell
            months={months}
            onDataUpdated={loadMonths}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        )}
      </div>
    </>
  );
}
