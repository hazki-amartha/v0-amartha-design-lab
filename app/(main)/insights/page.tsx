'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import InsightsShell from '@/components/insights/insights-shell';
import { MonthData } from '@/lib/insights/types';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
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
    <main className="flex-1 flex flex-col gap-3 p-3 pl-0 min-h-screen">
      <PageHeader
        title="CSAT Insights"
        actions={
          <>
            {months.length > 0 && (
              <Select
                value={selectedMonth || ''}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-auto h-9 justify-center"
              >
                {months.map((m) => (
                  <option key={m.month} value={m.month}>{m.month}</option>
                ))}
              </Select>
            )}
            <Button
              variant="default"
              onClick={() => router.push('/insights/data')}
              className="gap-2"
            >
              <Database className="w-4 h-4" />
              Data Management
            </Button>
          </>
        }
      />
      <div className="bg-card rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
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
    </main>
  );
}
