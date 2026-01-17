-- =====================================================
-- Supabase Chart Data Tables Setup Script
-- =====================================================
-- This script creates all tables, indexes, and RLS policies
-- for chart data integration.
-- 
-- To run:
-- 1. Open Supabase Dashboard → SQL Editor
-- 2. Copy and paste this entire script
-- 3. Click "Run" or press Cmd/Ctrl + Enter
-- =====================================================

-- =====================================================
-- 1. Physical Scores Table
-- =====================================================
CREATE TABLE IF NOT EXISTS physical_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  label TEXT,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  timeframe TEXT DEFAULT 'week',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_physical_scores_user_date 
  ON physical_scores(user_id, date DESC);

-- Row Level Security (RLS)
ALTER TABLE physical_scores ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS "Users can view their own physical scores" ON physical_scores;
DROP POLICY IF EXISTS "Users can insert their own physical scores" ON physical_scores;
DROP POLICY IF EXISTS "Users can update their own physical scores" ON physical_scores;

CREATE POLICY "Users can view their own physical scores"
  ON physical_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own physical scores"
  ON physical_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own physical scores"
  ON physical_scores FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- 2. Steps Data Table
-- =====================================================
CREATE TABLE IF NOT EXISTS steps_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quarter TEXT NOT NULL CHECK (quarter IN ('q1', 'q2', 'q3', 'q4')),
  walking INTEGER NOT NULL DEFAULT 0,
  running INTEGER NOT NULL DEFAULT 0,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quarter, date)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_steps_data_user_date 
  ON steps_data(user_id, date DESC);

-- Row Level Security (RLS)
ALTER TABLE steps_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS "Users can view their own steps data" ON steps_data;
DROP POLICY IF EXISTS "Users can insert their own steps data" ON steps_data;
DROP POLICY IF EXISTS "Users can update their own steps data" ON steps_data;

CREATE POLICY "Users can view their own steps data"
  ON steps_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own steps data"
  ON steps_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own steps data"
  ON steps_data FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- 3. Heart Rate Data Table
-- =====================================================
CREATE TABLE IF NOT EXISTS heart_rate_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  heart_rate INTEGER NOT NULL,
  time TEXT NOT NULL, -- Format: 'HH:MM' (e.g., '08:00')
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_heart_rate_data_user_date 
  ON heart_rate_data(user_id, date DESC);

-- Row Level Security (RLS)
ALTER TABLE heart_rate_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS "Users can view their own heart rate data" ON heart_rate_data;
DROP POLICY IF EXISTS "Users can insert their own heart rate data" ON heart_rate_data;
DROP POLICY IF EXISTS "Users can update their own heart rate data" ON heart_rate_data;

CREATE POLICY "Users can view their own heart rate data"
  ON heart_rate_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own heart rate data"
  ON heart_rate_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own heart rate data"
  ON heart_rate_data FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- Success Message
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ All chart data tables created successfully!';
  RAISE NOTICE '📊 Tables created:';
  RAISE NOTICE '   - physical_scores';
  RAISE NOTICE '   - steps_data';
  RAISE NOTICE '   - heart_rate_data';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 Row Level Security (RLS) enabled on all tables';
  RAISE NOTICE '📑 Indexes created for optimal query performance';
END $$;

