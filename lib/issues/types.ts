import type { FeedbackItem, FeatureDetail } from '@/lib/insights/types';
import type { NPSRow } from '@/lib/nps/types';

export type IssueSource = 'csat' | 'nps';
export type ImpactLevel = 'High' | 'Medium' | 'Low';
export type ActionStatus = 'backlog' | 'in_progress' | 'released';

export interface Issue {
  id?: string;
  source: IssueSource;
  period: string;
  title: string;
  tag: string | null;
  impact: ImpactLevel | null;
  business_unit: string | null;  // Funding | Lending | Payments | Core
  product_area: string | null;   // Modal | GGS | Celengan | PPOB
  feature: string | null;
  count: number | null;
  percentage: number | null;
  metadata: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface ActionItem {
  id?: string;
  title: string;
  tag: string | null;
  product_area: string | null;
  owner: string | null;
  status: ActionStatus;
  impact: ImpactLevel | null;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface IssueActionLink {
  issue_id: string;
  action_item_id: string;
  created_at?: string;
}

export function csatFeedbackItemToIssue(
  item: FeedbackItem,
  context: FeatureDetail,
  period: string
): Issue {
  return {
    source: 'csat',
    period,
    title: item.text,
    tag: null,
    impact: null,
    business_unit: context.business_unit || null,
    product_area: context.product_area || null,
    feature: context.feature_name || null,
    count: item.count,
    percentage: item.percentage,
    metadata: {
      total_feature_responses: context.total_responses,
      dissatisfied_score: context.score.dissatisfied,
    },
  };
}

export function npsRowToIssue(row: NPSRow, period: string): Issue {
  return {
    source: 'nps',
    period,
    title: row.title,
    tag: row.tag || null,
    impact: (row.impact as ImpactLevel) || null,
    business_unit: row.business_unit || null,
    product_area: row.product_area || null,
    feature: row.feature || null,
    count: row.count ?? null,
    percentage: row.percentage ?? null,
    metadata: {},
  };
}
