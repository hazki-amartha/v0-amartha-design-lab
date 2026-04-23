'use client';

import { PageHeader } from '@/components/page-header';
import NPSOverview from '@/components/nps/nps-overview';
import NPSTrendChart from '@/components/nps/nps-trend-chart';
import NPSIssues from '@/components/nps/nps-issues';
import NPSActionTracker from '@/components/nps/nps-action-tracker';
import NPSKeyInsights from '@/components/nps/nps-key-insights';

export default function NPSPage() {
  return (
    <main className="flex-1 flex flex-col p-3 pl-0 h-screen overflow-hidden">
      <PageHeader title="NPS Dashboard" />
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="bg-card rounded-b-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-10">
          <NPSOverview />
          <NPSTrendChart />
          <NPSIssues />
          <NPSActionTracker />
          <NPSKeyInsights />
        </div>
      </div>
    </main>
  );
}
