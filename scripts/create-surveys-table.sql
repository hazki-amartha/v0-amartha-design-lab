-- Create surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  config JSONB NOT NULL,
  html_output TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at DESC);

-- Enable Row Level Security
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read/write (adjust as needed for auth)
CREATE POLICY "Allow all operations on surveys" ON surveys
  FOR ALL USING (true) WITH CHECK (true);
