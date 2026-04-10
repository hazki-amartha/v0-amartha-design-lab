'use client';

import { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import MonthPickerDialog from './month-picker';

interface UploadPanelProps {
  onUploadSuccess: () => void;
}

export default function UploadPanel({ onUploadSuccess }: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
      setShowMonthPicker(true);
    } else {
      alert('Please select a CSV file');
    }
  };

  const handleUpload = async (month: number, year: number) => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('month', month.toString());
      formData.append('year', year.toString());

      const response = await fetch('/api/insights', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        alert(`Successfully uploaded ${result.data.row_count} rows`);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onUploadSuccess();
      } else {
        alert(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error('[v0] Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Card
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <div className="space-y-2">
          <div className="flex justify-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-sm">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">CSV files only</p>
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

      <MonthPickerDialog
        open={showMonthPicker}
        onOpenChange={setShowMonthPicker}
        onConfirm={handleUpload}
        loading={uploading}
      />
    </>
  );
}
