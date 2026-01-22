/**
 * Apple Health Data Schema
 * Unified table for storing health data from Apple HealthKit
 * Supports all 4 pillars: Physical, Emotional, Mental, Energy
 */

-- Create unified health_data table
CREATE TABLE IF NOT EXISTS health_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data_type TEXT NOT NULL, -- e.g., 'stepCount', 'heartRate', 'sleepAnalysis', etc.
  value NUMERIC NOT NULL, -- The actual measurement value
  unit TEXT NOT NULL, -- e.g., 'count', 'bpm', 'hour', 'kcal', etc.
  start_date TIMESTAMPTZ NOT NULL, -- When the measurement started
  end_date TIMESTAMPTZ, -- When the measurement ended (null for instantaneous)
  source TEXT DEFAULT 'apple_health', -- Source of data (apple_health, google_fit, etc.)
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional metadata (device, workout type, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure no duplicate entries for same user, data type, and time
  CONSTRAINT unique_health_entry UNIQUE (user_id, data_type, start_date, source)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_health_data_user_id ON health_data(user_id);
CREATE INDEX IF NOT EXISTS idx_health_data_data_type ON health_data(data_type);
CREATE INDEX IF NOT EXISTS idx_health_data_start_date ON health_data(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_health_data_user_type_date ON health_data(user_id, data_type, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_health_data_source ON health_data(source);

-- GIN index for JSONB metadata queries
CREATE INDEX IF NOT EXISTS idx_health_data_metadata ON health_data USING GIN (metadata);

-- Row Level Security (RLS)
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own health data
CREATE POLICY "Users can view their own health data"
  ON health_data FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own health data
CREATE POLICY "Users can insert their own health data"
  ON health_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own health data
CREATE POLICY "Users can update their own health data"
  ON health_data FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own health data
CREATE POLICY "Users can delete their own health data"
  ON health_data FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_health_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_health_data_updated_at
  BEFORE UPDATE ON health_data
  FOR EACH ROW
  EXECUTE FUNCTION update_health_data_updated_at();

-- Create a view for aggregated daily health metrics (for easier querying)
CREATE OR REPLACE VIEW daily_health_summary AS
SELECT 
  user_id,
  DATE(start_date) as date,
  data_type,
  COUNT(*) as sample_count,
  SUM(value) as total_value,
  AVG(value) as avg_value,
  MIN(value) as min_value,
  MAX(value) as max_value,
  unit,
  source
FROM health_data
GROUP BY user_id, DATE(start_date), data_type, unit, source;

-- Grant access to the view
GRANT SELECT ON daily_health_summary TO authenticated;

-- Comments for documentation
COMMENT ON TABLE health_data IS 'Unified table for storing health data from various sources (Apple Health, Google Fit, etc.)';
COMMENT ON COLUMN health_data.data_type IS 'Type of health data: stepCount, heartRate, sleepAnalysis, activeEnergy, etc.';
COMMENT ON COLUMN health_data.value IS 'The measurement value (steps, bpm, hours, etc.)';
COMMENT ON COLUMN health_data.unit IS 'Unit of measurement: count, bpm, hour, kcal, kg, etc.';
COMMENT ON COLUMN health_data.source IS 'Source of data: apple_health, google_fit, manual, etc.';
COMMENT ON COLUMN health_data.metadata IS 'Additional JSON metadata: device info, workout type, etc.';

