import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function PageHeader({ title, onBack, actions }: PageHeaderProps) {
  return (
    <div className="bg-card rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-6 h-[72px] flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-sm hover:bg-secondary transition-colors text-muted-foreground hover:text-card-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-[22px] font-semibold tracking-tight text-card-foreground">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
