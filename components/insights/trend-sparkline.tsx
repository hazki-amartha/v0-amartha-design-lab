'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface TrendSparklineProps {
  data?: number[];
}

export default function TrendSparkline({ data = [65, 70, 68, 75, 80, 78] }: TrendSparklineProps) {
  const chartData = data.map((value, index) => ({
    index,
    value,
  }));

  return (
    <div className="w-full h-12">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
