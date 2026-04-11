'use client';

import { Bar, BarChart, Cell, LabelList, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface SentimentChartProps {
  delighted: number;
  satisfied: number;
  dissatisfied: number;
}

const chartConfig = {
  value: { label: 'Score' },
  delighted: { label: 'Delighted', color: 'var(--chart-3)' },
  satisfied: { label: 'Satisfied', color: 'var(--chart-2)' },
  dissatisfied: { label: 'Dissatisfied', color: 'var(--chart-5)' },
} satisfies ChartConfig;

const BAR_COLORS: Record<string, string> = {
  Delighted: 'var(--chart-3)',
  Satisfied: 'var(--chart-2)',
  Dissatisfied: 'var(--chart-5)',
};

export default function SentimentChart({
  delighted,
  satisfied,
  dissatisfied,
}: SentimentChartProps) {
  const chartData = [
    { category: 'Delighted', value: delighted },
    { category: 'Satisfied', value: satisfied },
    { category: 'Dissatisfied', value: dissatisfied },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-[110px] w-full">
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
        barCategoryGap="20%"
      >
        <XAxis
          dataKey="category"
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          tickMargin={4}
        />
        <ChartTooltip
          cursor={true}
          content={
            <ChartTooltipContent
              formatter={(value, name, item) => (
                <span className="font-medium">{item.payload.category}: {value}%</span>
              )}
              hideLabel
            />
          }
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {/* 1. Custom Colors first */}
          {chartData.map((entry) => (
            <Cell key={entry.category} fill={BAR_COLORS[entry.category] || '#ccc'} />
          ))}
          
          {/* 2. LabelList last, and ensure dataKey matches "value" */}
          <LabelList
            dataKey="value" 
            position="insideTop"
            offset={6}
            className="fill-background"
            fontSize={10}
            formatter={(value: any) => `${value}%`}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
