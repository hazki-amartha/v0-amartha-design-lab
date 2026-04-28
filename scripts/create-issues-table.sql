-- Canonical issue store — pain points from CSAT and NPS deep-dive data
CREATE TABLE IF NOT EXISTS issues (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source       TEXT NOT NULL CHECK (source IN ('csat', 'nps')),
  period       TEXT NOT NULL,        -- 'YYYY-MM' for CSAT, 'Q4-2025' for NPS
  title        TEXT NOT NULL,
  tag          TEXT,
  impact       TEXT CHECK (impact IN ('High', 'Medium', 'Low')),
  business_unit TEXT,                -- company BU: Funding | Lending | Payments | Core
  product_area TEXT,                 -- product: Modal | GGS | Celengan | PPOB (NPS) or equivalent (CSAT)
  feature      TEXT,                 -- unified: trigger_event (CSAT) | journey (NPS)
  count        INTEGER,              -- CSAT only: occurrence count
  percentage   NUMERIC(5,2),
  metadata     JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_issues_source       ON issues(source);
CREATE INDEX IF NOT EXISTS idx_issues_period       ON issues(period DESC);
CREATE INDEX IF NOT EXISTS idx_issues_business_unit ON issues(business_unit);
CREATE INDEX IF NOT EXISTS idx_issues_product_area ON issues(product_area);
CREATE INDEX IF NOT EXISTS idx_issues_feature      ON issues(feature);
CREATE INDEX IF NOT EXISTS idx_issues_tag          ON issues(tag);
CREATE INDEX IF NOT EXISTS idx_issues_impact       ON issues(impact);

-- Prevent duplicate CSAT pain points on re-upload of same month
CREATE UNIQUE INDEX IF NOT EXISTS idx_issues_csat_dedup
  ON issues(source, period, business_unit, feature, title)
  WHERE source = 'csat';

ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on issues" ON issues
  FOR ALL USING (true) WITH CHECK (true);
