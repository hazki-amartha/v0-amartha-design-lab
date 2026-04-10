'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface MonthPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (month: number, year: number) => void;
  loading?: boolean;
}

export default function MonthPickerDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
}: MonthPickerDialogProps) {
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (open) {
      const now = new Date();
      setMonth(now.getMonth() + 1);
      setYear(now.getFullYear());
    }
  }, [open]);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Upload Month</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Month</label>
            <Select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              {monthNames.map((m, idx) => (
                <option key={idx} value={idx + 1}>
                  {m}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Year</label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm(month, year);
              onOpenChange(false);
            }}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
