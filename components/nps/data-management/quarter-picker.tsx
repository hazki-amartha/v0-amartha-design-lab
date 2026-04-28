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
import { cn } from '@/lib/utils';

interface QuarterPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (quarter: number, year: number) => void;
  loading?: boolean;
}

export default function QuarterPickerDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
}: QuarterPickerDialogProps) {
  const [quarter, setQuarter] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (open) {
      const now = new Date();
      setQuarter(Math.ceil((now.getMonth() + 1) / 3));
      setYear(now.getFullYear());
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Select Report Period</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Quarter</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(q => (
                <button
                  key={q}
                  onClick={() => setQuarter(q)}
                  className={cn(
                    'py-2 rounded-lg text-[13px] font-semibold border transition-colors',
                    quarter === q
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border hover:bg-muted/50'
                  )}
                >
                  Q{q}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Year</label>
            <Input
              type="number"
              value={year}
              onChange={e => setYear(parseInt(e.target.value) || year)}
              min={2020}
              max={2099}
            />
          </div>

          <p className="text-[11px] text-muted-foreground">
            Will be saved as period: <span className="font-semibold text-card-foreground">Q{quarter}-{year}</span>
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm(quarter, year);
              onOpenChange(false);
            }}
            disabled={loading}
          >
            {loading ? 'Uploading…' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
