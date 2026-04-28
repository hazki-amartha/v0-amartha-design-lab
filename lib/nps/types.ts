// Shape of one row in the NPS upload CSV
export interface NPSRow {
  product_area: string;   // Modal | GGS | Celengan | PPOB
  business_unit: string;  // Funding | Lending | Payments | Core
  feature: string;        // Monitoring | Application | Onboarding | Disbursement | Repayment
  tag: string;            // DLB | Loan Status | Performance | Profit Visibility | Promo | Disbursement | Onboarding
  title: string;          // Issue description
  percentage: number;     // % of users affected
  impact: string;         // High | Medium | Low
  count: number | null;   // Occurrence count (optional — null if not provided)
}

// Raw NPS upload record in Supabase
export interface NPSDataRecord {
  id: string;
  period: string;
  filename: string;
  uploaded_at: string;
  row_count: number;
  data: NPSRow[];
  created_at: string;
  updated_at: string;
}

// Period listing metadata (for upload history UI)
export interface NPSPeriodData {
  period: string;
  filename: string;
  uploaded_at: string;
  row_count: number;
}
