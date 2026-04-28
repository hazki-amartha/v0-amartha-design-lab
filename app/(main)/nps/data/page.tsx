'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import NPSUploadPanel from '@/components/nps/data-management/nps-upload-panel';
import NPSUploadHistory from '@/components/nps/data-management/nps-upload-history';
import { downloadNPSTemplate } from '@/lib/nps/utils';
import type { NPSPeriodData } from '@/lib/nps/types';

export default function NPSDataPage() {
  const router = useRouter();
  const [periods, setPeriods] = useState<NPSPeriodData[]>([]);

  useEffect(() => { loadPeriods(); }, []);

  async function loadPeriods() {
    try {
      const res = await fetch('/api/nps/data');
      const result = await res.json();
      if (result.success) setPeriods(result.data || []);
    } catch (error) {
      console.error('Error loading NPS periods:', error);
    }
  }

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader
        title="Manage NPS Data"
        onBack={() => router.push('/nps')}
      />
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="bg-card rounded-b-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-8">
          {/* Template Download */}
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border mt-2">
            <div>
              <h3 className="font-semibold text-sm">CSV Template</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Columns: <span className="font-medium">product_area, feature, tag, title, percentage, impact</span>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadNPSTemplate()}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>

          {/* Upload Panel */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Upload NPS Issues CSV</h2>
            <NPSUploadPanel onUploadSuccess={loadPeriods} />
          </div>

          {/* Upload History */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Upload History</h2>
            <NPSUploadHistory periods={periods} onDelete={loadPeriods} />
          </div>
        </div>
      </div>
    </main>
  );
}
