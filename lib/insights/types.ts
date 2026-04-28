export interface CSATRow {
  OS: string;
  csat_category: string;
  detailed_feedback: string;
  csat_label: string;
  trigger_event: string;
  business_unit: string;
  product_area: string;     // Modal | GGS | Celengan | PPOB — optional in CSV, empty string if absent
  app_segments: string;
  Occurrences: number;
}

export interface CSATDataRecord {
  id: string;
  month: string;
  filename: string;
  uploaded_at: string;
  row_count: number;
  data: CSATRow[];
  created_at: string;
  updated_at: string;
}

export interface BUScorecard {
  business_unit: string;
  delighted_percentage: number;
  satisfied_percentage: number;
  dissatisfied_percentage: number;
  total_responses: number;
  delighted_count: number;
  satisfied_count: number;
  dissatisfied_count: number;
}

export interface FeatureScore {
  delighted: number;
  satisfied: number;
  dissatisfied: number;
}

export interface FeatureDetail {
  feature_name: string;
  business_unit: string;
  product_area: string;
  score: FeatureScore;
  total_responses: number;
  pain_points: FeedbackItem[];
  positive_feedback: FeedbackItem[];
}

export interface FeedbackItem {
  text: string;
  count: number;
  percentage: number;
}

export interface MonthData {
  month: string;
  filename: string;
  uploaded_at: string;
  row_count: number;
}
