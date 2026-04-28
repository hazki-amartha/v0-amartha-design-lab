'use client';

import { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import QuarterPickerDialog from './quarter-picker';

interface NPSUploadPanelProps {
  onUploadSuccess: () => void;
}

export default function NPSUploadPanel({ onUploadSuccess }: NPSUploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showQuarterPicker, setShowQuarterPicker] = useState(false);
  const [uploading, setUploading] = useState(false);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
      setShowQuarterPicker(true);
    } else {
      alert('Please select a CSV file');
    }
  }

  async function handleUpload(quarter: number, year: number) {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('quarter', quarter.toString());
      formData.append('year', year.toString());

      const res = await fetch('/api/nps/data', { method: 'POST', body: formData });
      const result = await res.json();

      if (result.success) {
        alert(`Uploaded ${result.data.row_count} issues for Q${quarter}-${year}`);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onUploadSuccess();
      } else {
        alert(`Upload failed: ${result.error}`);
      }
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Card
        onClick={() => fileInputRef.current?.click()}
        className="border-border border-dashed rounded-lg shadow-none p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <div className="space-y-2">
          <div className="flex justify-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-sm">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">CSV files only · 6 columns: product_area, feature, tag, title, percentage, impact</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
      </Card>

      <QuarterPickerDialog
        open={showQuarterPicker}
        onOpenChange={setShowQuarterPicker}
        onConfirm={handleUpload}
        loading={uploading}
      />
    </>
  );
}
