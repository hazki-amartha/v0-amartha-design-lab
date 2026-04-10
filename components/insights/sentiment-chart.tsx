'use client';

interface SentimentChartProps {
  delighted: number;
  satisfied: number;
  dissatisfied: number;
}

const CHART_HEIGHT = 56; // px

export default function SentimentChart({
  delighted,
  satisfied,
  dissatisfied,
}: SentimentChartProps) {
  const bars = [
    { label: 'Delighted', value: delighted, color: 'bg-green-500' },
    { label: 'Satisfied', value: satisfied, color: 'bg-blue-500' },
    { label: 'Dissatisfied', value: dissatisfied, color: 'bg-red-400' },
  ];

  return (
    <div className="flex items-end gap-1.5" style={{ height: CHART_HEIGHT + 40 }}>
      {bars.map(({ label, value, color }) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-1">
          {/* Bar */}
          <div
            className="w-full flex flex-col justify-end"
            style={{ height: CHART_HEIGHT }}
          >
            <div
              className={`w-full rounded-t-sm ${color} transition-all duration-500`}
              style={{ height: `${Math.max(value, 2)}%` }}
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
