'use client';

import { MonthData } from '@/lib/insights/types';
import UploadPanel from './data-management/upload-panel';
import UploadHistory from './data-management/upload-history';

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
