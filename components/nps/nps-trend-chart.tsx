'use client';

import { useState } from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { npsTrend, npsByProduct, npsBySegment } from '@/lib/nps/data';
import { cn } from '@/lib/utils';

type View = 'overall' | 'product' | 'segment';

const overallConfig = {
  nps: { label: 'NPS Score', color: 'var(--accent)' },
} satisfies ChartConfig;

const productConfig = {
  Modal: { label: 'Modal', color: 'var(--chart-1)' },
  Celengan: { label: 'Celengan', color: 'var(--chart-2)' },
  GGS: { label: 'GGS', color: 'var(--chart-3)' },
  PPOB: { label: 'PPOB', color: 'var(--chart-5)' },
} satisfies ChartConfig;

const segmentConfig = {
  Borrower: { label: 'Borrower', color: 'var(--chart-1)' },
  Lender: { label: 'Lender', color: 'var(--chart-3)' },
  Agent: { label: 'Agent', color: 'var(--chart-4)' },
} satisfies ChartConfig;

const VIEW_DATA: Record<View, { data: Record<string, string | number>[]; config: ChartConfig; keys: string[] }> = {
  overall: { data: npsTrend, config: overallConfig, keys: ['nps'] },
  product: { data: npsByProduct, config: productConfig, keys: ['Modal', 'Celengan', 'GGS', 'PPOB'] },
  segment: { data: npsBySegment, config: segmentConfig, keys: ['Borrower', 'Lender', 'Agent'] },
};

const COLORS: Record<string, string> = {
  nps: 'var(--accent)',
  Modal: 'var(--chart-1)',
  Celengan: 'var(--chart-2)',
  GGS: 'var(--chart-3)',
  PPOB: 'var(--chart-5)',
  Borrower: 'var(--chart-1)',
  Lender: 'var(--chart-3)',
  Agent: 'var(--chart-4)',
};

export default function NPSTrendChart() {
  const [view, setView] = useState<View>('overall');
  const { data, config, keys } = VIEW_DATA[view];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">NPS Trend</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Q1 2024 — Q4 2024</p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {(['overall', 'product', 'segment'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'px-3 py-1.5 rounded-md text-[12px] font-medium capitalize transition-colors',
                view === v
                  ? 'bg-card text-card-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-card-foreground'
              )}
            >
              {v === 'overall' ? 'Overall' : v === 'product' ? 'By Product' : 'By Segment'}
            </button>
          ))}
        </div>
      </div>

      <ChartContainer config={config} className="h-[220px] w-full">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            dataKey="quarter"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickMargin={8}
          />
          <YAxis
            domain={[20, 65]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickMargin={8}
            tickFormatter={(v) => `${v}`}
          />
          <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="4 4" />
          <ChartTooltip content={<ChartTooltipContent />} />
          {keys.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[key]}
              strokeWidth={2}
              dot={{ r: 4, fill: COLORS[key], strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ChartContainer>

      {/* Legend */}
      {keys.length > 1 && (
        <div className="flex flex-wrap gap-4">
          {keys.map((key) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: COLORS[key], display: 'inline-block' }} />
              <span className="text-[11px] text-muted-foreground">
                {(config as Record<string, { label: string }>)[key]?.label ?? key}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
