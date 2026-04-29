'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import type { Issue, ImpactLevel } from '@/lib/issues/types';
import InsightTable from './insight-table';

type SourceFilter = 'all' | 'nps' | 'csat';
type ImpactFilter = 'all' | ImpactLevel;
type PageSize = 10 | 25 | 50;

interface InsightLibraryShellProps {
  issues: Issue[];
}

function unique<T>(arr: (T | null | undefined)[]): T[] {
  return [...new Set(arr.filter((v): v is T => v != null))];
}

export default function InsightLibraryShell({ issues }: InsightLibraryShellProps) {
  const [source, setSource] = useState<SourceFilter>('all');
  const [period, setPeriod] = useState<string | null>(null);
  const [businessUnit, setBusinessUnit] = useState<string | null>(null);
  const [productArea, setProductArea] = useState<string | null>(null);
  const [impact, setImpact] = useState<ImpactFilter>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);

  const periods = useMemo(() => unique(issues.map((i) => i.period)).sort(), [issues]);
  const businessUnits = useMemo(() => unique(issues.map((i) => i.business_unit)).sort(), [issues]);
  const productAreas = useMemo(() => unique(issues.map((i) => i.product_area)).sort(), [issues]);

  const filtered = useMemo(() => {
    return issues.filter((i) => {
      if (source !== 'all' && i.source !== source) return false;
      if (period && i.period !== period) return false;
      if (businessUnit && i.business_unit !== businessUnit) return false;
      if (productArea && i.product_area !== productArea) return false;
      if (impact !== 'all' && i.impact !== impact) return false;
      return true;
    });
  }, [issues, source, period, businessUnit, productArea, impact]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const pageEnd = Math.min(currentPage * pageSize, filtered.length);
  const paginatedIssues = filtered.slice(pageStart === 0 ? 0 : pageStart - 1, pageEnd);

  useEffect(() => {
    setPage(1);
  }, [source, period, businessUnit, productArea, impact, pageSize]);

  const hasFilters = source !== 'all' || period || businessUnit || productArea || impact !== 'all';

  function clearAll() {
    setSource('all');
    setPeriod(null);
    setBusinessUnit(null);
    setProductArea(null);
    setImpact('all');
  }

  const npsCount = issues.filter((i) => i.source === 'nps').length;
  const csatCount = issues.filter((i) => i.source === 'csat').length;
  const highCount = issues.filter((i) => i.impact === 'High').length;
  const medCount  = issues.filter((i) => i.impact === 'Medium').length;
  const lowCount  = issues.filter((i) => i.impact === 'Low').length;

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Stat label="Total" value={issues.length} />
        <div className="w-px h-4 bg-border" />
        <Stat label="NPS" value={npsCount} color="text-blue-600" />
        <Stat label="CSAT" value={csatCount} color="text-emerald-600" />
        <div className="w-px h-4 bg-border" />
        <Stat label="High" value={highCount} color="text-red-600" dot="bg-red-400" />
        <Stat label="Medium" value={medCount} color="text-amber-600" dot="bg-amber-400" />
        <Stat label="Low" value={lowCount} color="text-slate-500" dot="bg-slate-300" />
      </div>

      {/* Filter bar */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              Filters
            </div>
            {hasFilters && (
              <Button
                variant="secondary"
                size="sm"
                onClick={clearAll}
                className="text-muted-foreground hover:text-card-foreground"
              >
                <X className="h-3 w-3" />
                Clear all
              </Button>
            )}
          </div>

          {businessUnits.length > 1 && (
            <FilterRow label="Business Unit">
              <Pill active={businessUnit === null} onClick={() => setBusinessUnit(null)}>All</Pill>
              {businessUnits.map((b) => (
                <Pill key={b} active={businessUnit === b} onClick={() => setBusinessUnit(businessUnit === b ? null : b)}>{b}</Pill>
              ))}
            </FilterRow>
          )}

          <div className="grid gap-3 md:grid-cols-4">
            <FilterField label="Source">
              <Select
                value={source}
                onChange={(e) => setSource(e.target.value as SourceFilter)}
                className="h-9 rounded-lg"
              >
                <option value="all">All sources</option>
                <option value="nps">NPS</option>
                <option value="csat">CSAT</option>
              </Select>
            </FilterField>

            <FilterField label="Period">
              <Select
                value={period ?? 'all'}
                onChange={(e) => setPeriod(e.target.value === 'all' ? null : e.target.value)}
                className="h-9 rounded-lg"
                disabled={periods.length <= 1}
              >
                <option value="all">All periods</option>
                {periods.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </Select>
            </FilterField>

            <FilterField label="Product Area">
              <Select
                value={productArea ?? 'all'}
                onChange={(e) => setProductArea(e.target.value === 'all' ? null : e.target.value)}
                className="h-9 rounded-lg"
                disabled={productAreas.length <= 1}
              >
                <option value="all">All product areas</option>
                {productAreas.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </Select>
            </FilterField>

            <FilterField label="Impact">
              <Select
                value={impact}
                onChange={(e) => setImpact(e.target.value as ImpactFilter)}
                className="h-9 rounded-lg"
              >
                <option value="all">All impact levels</option>
                <option value="High">High impact</option>
                <option value="Medium">Medium impact</option>
                <option value="Low">Low impact</option>
              </Select>
            </FilterField>
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {filtered.length === 0 ? '0 issues' : `${pageStart}-${pageEnd} of ${filtered.length} ${filtered.length === 1 ? 'issue' : 'issues'}`}
          {source !== 'all' ? ` · ${source.toUpperCase()}` : ''}
          {period ? ` · ${period}` : ''}
          {businessUnit ? ` · ${businessUnit}` : ''}
          {productArea ? ` · ${productArea}` : ''}
          {impact !== 'all' ? ` · ${impact} impact` : ''}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Rows</span>
          <Select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value) as PageSize)}
            className="h-8 w-[84px] rounded-lg px-3 text-[12px]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </Select>
        </div>
      </div>

      <InsightTable issues={paginatedIssues} />

      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12px] text-muted-foreground">
            Page <span className="font-medium text-card-foreground">{currentPage}</span> of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color, dot }: { label: string; value: number; color?: string; dot?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dot)} />}
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className={cn('text-[13px] font-semibold tabular-nums', color ?? 'text-card-foreground')}>{value}</span>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 flex-wrap border-t border-border pt-4">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">{label}</span>
      <div className="flex gap-1.5 flex-wrap items-center">{children}</div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-full text-[12px] font-medium border transition-colors',
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-card text-muted-foreground border-border hover:border-muted-foreground/40 hover:text-card-foreground'
      )}
    >
      {children}
    </button>
  );
}
