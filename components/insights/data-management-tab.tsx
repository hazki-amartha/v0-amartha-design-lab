'use client';

import { MonthData } from '@/lib/insights/types';
import { downloadCSVTemplate } from '@/lib/insights/utils';
import UploadPanel from './data-management/upload-panel';
import UploadHistory from './data-management/upload-history';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DataManagementTabProps {
  months: MonthData[];
  onDataRefresh: () => void;
}

export default function DataManagementTab({
  months,
  onDataRefresh,
}: DataManagementTabProps) {
  return (
    <div className="space-y-8">
      {/* Template Download */}
      <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border mt-2">
        <div>
          <h3 className="font-semibold text-sm">CSV Template</h3>
          <p className="text-xs text-muted-foreground mt-1">Download the CSV template to ensure proper data mapping</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => downloadCSVTemplate()}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download Template
        </Button>
      </div>

      {/* Upload Panel */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Upload CSV Data</h2>
        <UploadPanel onUploadSuccess={onDataRefresh} />
      </div>

      {/* Upload History */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Upload History</h2>
        <UploadHistory months={months} onDelete={onDataRefresh} />
      </div>
    </div>
  );
}
