'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import DataManagementTab from '@/components/insights/data-management-tab';
import { MonthData } from '@/lib/insights/types';

export default function DataManagementPage() {
  const router = useRouter();
  const [months, setMonths] = useState<MonthData[]>([]);

  useEffect(() => {
    loadMonths();
  }, []);

  async function loadMonths() {
    try {
      const response = await fetch('/api/insights');
      const result = await response.json();
      if (result.success) setMonths(result.data || []);
    } catch (error) {
      console.error('Error loading months:', error);
    }
  }

  return (
    <main className="flex-1 flex flex-col gap-3 p-3 pl-0 h-screen overflow-hidden">
      <PageHeader
        title="Manage Data"
        onBack={() => router.push('/insights')}
      />
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="bg-card rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
          <DataManagementTab months={months} onDataRefresh={loadMonths} />
        </div>
      </div>
    </main>
  );
}
