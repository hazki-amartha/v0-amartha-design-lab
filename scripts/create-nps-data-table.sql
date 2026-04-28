-- Raw NPS upload store — mirrors csat_data pattern
-- Each row represents one quarterly NPS report upload
CREATE TABLE IF NOT EXISTS nps_data (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period      TEXT NOT NULL,          -- 'Q4-2025', 'Q1-2026', …
  filename    TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  row_count   INTEGER NOT NULL,
  data        JSONB NOT NULL,         -- raw NPSRow array
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- One upload per period only
CREATE UNIQUE INDEX IF NOT EXISTS idx_nps_data_period ON nps_data(period);

ALTER TABLE nps_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on nps_data" ON nps_data
  FOR ALL USING (true) WITH CHECK (true);
