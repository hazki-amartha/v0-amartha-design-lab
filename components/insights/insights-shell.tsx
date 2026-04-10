'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select } from '@/components/ui/select';
import { CSATDataRecord, MonthData } from '@/lib/insights/types';
import DashboardTab from './dashboard-tab';
import DataManagementTab from './data-management-tab';

interface InsightsShellProps {
  months: MonthData[];
  onDataUpdated?: () => void;
}

export default function InsightsShell({ months, onDataUpdated }: InsightsShellProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    months.length > 0 ? months[0].month : null
  );
  const [monthData, setMonthData] = useState<CSATDataRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMonth) {
      loadMonthData(selectedMonth);
    }
  }, [selectedMonth]);

  async function loadMonthData(month: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/insights?month=${month}`);
      const result = await response.json();
      if (result.success) {
        setMonthData(result.data);
      }
    } catch (error) {
      console.error('Error loading month data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDataRefresh = async () => {
    // Reload months list from API
    const response = await fetch('/api/insights');
    const result = await response.json();
    if (result.success) {
      // Update parent or reload page
      if (onDataUpdated) {
        onDataUpdated();
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {months.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                No CSAT data uploaded yet. Go to Data Management to upload a CSV file.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">Select Month</label>
                <Select
                  value={selectedMonth || ''}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-auto"
                >
                  {months.map((m) => (
                    <option key={m.month} value={m.month}>
                      {m.month}
                    </option>
                  ))}
                </Select>
              </div>
              {loading ? (
                <div className="text-center text-muted-foreground">Loading...</div>
              ) : monthData ? (
                <DashboardTab data={monthData} />
              ) : null}
            </>
          )}
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <DataManagementTab months={months} onDataRefresh={handleDataRefresh} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
