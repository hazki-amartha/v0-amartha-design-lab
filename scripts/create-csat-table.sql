-- Create csat_data table for storing uploaded CSAT survey data
CREATE TABLE IF NOT EXISTS csat_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month TEXT NOT NULL,
  filename TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  row_count INTEGER NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on month for faster lookups
CREATE INDEX IF NOT EXISTS idx_csat_data_month ON csat_data(month DESC);

-- Enable RLS
ALTER TABLE csat_data ENABLE ROW LEVEL SECURITY;

-- Create policy allowing all operations (no auth required for MVP)
CREATE POLICY "Allow all operations on csat_data" ON csat_data
  FOR ALL
  USING (true)
  WITH CHECK (true);
