'use client';

import { useState, useEffect } from 'react';
import { CSATDataRecord, MonthData } from '@/lib/insights/types';
import DashboardTab from './dashboard-tab';

interface InsightsShellProps {
  months: MonthData[];
  onDataUpdated?: () => void;
  selectedMonth: string | null;
  onMonthChange: (month: string) => void;
}

export default function InsightsShell({
  months,
  selectedMonth,
}: InsightsShellProps) {
  const [monthData, setMonthData] = useState<CSATDataRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMonth) loadMonthData(selectedMonth);
  }, [selectedMonth]);

  async function loadMonthData(month: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/insights?month=${month}`);
      const result = await response.json();
      if (result.success) setMonthData(result.data);
    } catch (error) {
      console.error('Error loading month data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (months.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No CSAT data uploaded yet. Go to Data Management to upload a CSV file.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center text-muted-foreground py-12">Loading...</div>;
  }

  return monthData ? <DashboardTab data={monthData} /> : null;
}
