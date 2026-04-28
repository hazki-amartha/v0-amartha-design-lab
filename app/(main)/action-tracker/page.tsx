'use client';

import { PageHeader } from '@/components/page-header';
import NPSActionTracker from '@/components/nps/nps-action-tracker';

export default function ActionTrackerPage() {
  return (
    <>
      <PageHeader title="Action Tracker" />
      <div className="flex-1 overflow-y-auto p-6">
        <NPSActionTracker />
      </div>
    </>
  );
}
