'use client';

import { FileText, Clock, Mail, MessageCircle } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import NPSOverview from '@/components/nps/nps-overview';
import NPSTrendChart from '@/components/nps/nps-trend-chart';
import NPSIssues from '@/components/nps/nps-issues';
import NPSActionTracker from '@/components/nps/nps-action-tracker';
import NPSKeyInsights from '@/components/nps/nps-key-insights';
import NPSHero from '@/components/nps/nps-hero';
import { npsOverview } from '@/lib/nps/data';

const REPORT_URL = 'https://docs.google.com/presentation/d/1TeKdo49H6jCePvCYsnk8mhzAFrCnyjKUIqcV-yDncb4/edit?usp=sharing';

export default function NPSPage() {
  return (
    <main className="flex-1 flex flex-col p-3 pl-0 h-screen overflow-hidden">
      <PageHeader
        title="NPS Dashboard"
        actions={
          <div className="flex items-center gap-3">
<div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[12px]">Data from {npsOverview.period} · Updated {npsOverview.lastUpdated}</span>
            </div>
            <a
              href={REPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <FileText className="h-4 w-4 shrink-0" />
              View Full Report
            </a>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="bg-card rounded-b-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-10">
          <NPSHero />
          <NPSOverview />
          <NPSTrendChart />
          <NPSIssues />
          <NPSActionTracker />
          <NPSKeyInsights />

          {/* Contact / Feedback */}
          <div className="rounded-xl border border-border bg-muted/30 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[13px] font-semibold text-card-foreground">Have feedback or questions about this data?</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">Reach out to Kanya Hadyani — Product Research</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="mailto:ratnakanya.hadyani@amartha.com"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-medium border border-border bg-card text-card-foreground hover:bg-muted/50 transition-colors"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                Email
              </a>
              <a
                href="https://amartha.slack.com/team/U046NE13KDK"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-medium border border-border bg-card text-card-foreground hover:bg-muted/50 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                Slack — Kanya Hadyani
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
