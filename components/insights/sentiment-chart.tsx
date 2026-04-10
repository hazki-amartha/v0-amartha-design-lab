'use client';

interface SentimentChartProps {
  delighted: number;
  satisfied: number;
  dissatisfied: number;
}

const CHART_HEIGHT = 90; // px

export default function SentimentChart({
  delighted,
  satisfied,
  dissatisfied,
}: SentimentChartProps) {
  const bars = [
    { label: 'Delighted', value: delighted, color: 'bg-chart-3' },
    { label: 'Satisfied', value: satisfied, color: 'bg-chart-2' },
    { label: 'Dissatisfied', value: dissatisfied, color: 'bg-chart-5' },
  ];

  const maxValue = Math.max(...bars.map((b) => b.value), 1);
  // Scale so the tallest bar fills 95% of the container
  const normalize = (value: number) => Math.max((value / maxValue) * 95, 2);

  return (
    <div className="flex items-end px-2 gap-6" style={{ height: CHART_HEIGHT + 40 }}>
      {bars.map(({ label, value, color }) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-1">
          {/* Bar */}
          <div
            className="w-full flex flex-col justify-end"
            style={{ height: CHART_HEIGHT }}
          >
            <div
              className={`w-full rounded-t-xs ${color} transition-all duration-500`}
              style={{ height: `${normalize(value)}%` }}
            />
          </div>
          {/* Percentage */}
          <span className="text-[11px] font-semibold text-card-foreground leading-none">
            {value}%
          </span>
          {/* Label */}
          <span className="text-[10px] text-muted-foreground leading-none">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
