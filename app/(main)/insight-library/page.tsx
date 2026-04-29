'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import InsightLibraryShell from '@/components/insight-library/insight-library-shell';
import type { Issue } from '@/lib/issues/types';

export default function InsightLibraryPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/issues')
      .then((r) => r.json())
      .then((result) => {
        if (result.success) setIssues(result.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Insight Library" />
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="space-y-3">
            <div className="h-5 w-64 bg-muted rounded animate-pulse" />
            <div className="h-9 w-full bg-muted rounded animate-pulse" />
            <div className="h-9 w-full bg-muted rounded animate-pulse" />
            <div className="h-64 w-full bg-muted rounded-xl animate-pulse" />
          </div>
        ) : (
          <InsightLibraryShell issues={issues} />
        )}
      </div>
    </>
  );
}
