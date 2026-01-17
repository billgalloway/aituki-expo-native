-- =====================================================
-- Sample Chart Data Insert Script
-- =====================================================
-- This script inserts sample data for testing the charts.
-- 
-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with an actual user ID
-- To get your user ID:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Copy a user's UUID
-- 3. Replace all instances of 'YOUR_USER_ID_HERE' below
-- =====================================================

-- Replace this with your actual user ID
-- \set user_id 'YOUR_USER_ID_HERE'

-- Example: If your user ID is '123e4567-e89b-12d3-a456-426614174000'
-- Uncomment and use:
-- \set user_id '123e4567-e89b-12d3-a456-426614174000'

-- =====================================================
-- 1. Insert Physical Score Data
-- =====================================================
INSERT INTO physical_scores (user_id, score, percentage, label, timeframe, date)
VALUES (
  '680d4ee3-1b19-4674-a095-ae43c66a27f7', -- REPLACE THIS
  179,
  56,
  'Good week',
  'week',
  NOW()
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. Insert Steps Data (for current week)
-- =====================================================
INSERT INTO steps_data (user_id, quarter, walking, running, date)
VALUES
  ('680d4ee3-1b19-4674-a095-ae43c66a27f7', 'q1', 45, 20, NOW()),
  ('680d4ee3-1b19-4674-a095-ae43c66a27f7', 'q2', 35, 30, NOW()),
  ('680d4ee3-1b19-4674-a095-ae43c66a27f7', 'q3', 50, 25, NOW()),
  ('680d4ee3-1b19-4674-a095-ae43c66a27f7', 'q4', 55, 20, NOW())
ON CONFLICT (user_id, quarter, date) DO UPDATE
SET 
  walking = EXCLUDED.walking,
  running = EXCLUDED.running,
  updated_at = NOW();

-- =====================================================
-- 3. Insert Heart Rate Data (for today)
-- =====================================================
INSERT INTO heart_rate_data (user_id, heart_rate, time, date)
VALUES
  ('680d4ee3-1b19-4674-a095-ae43c66a27f7', 85, '08:00', NOW()),
  ('680d4ee3-1b19-4674-a095-ae43c66a27f7', 95, '10:00', NOW()),
  ('680d4ee3-1b19-4674-a095-ae43c66a27f7', 102, '12:00', NOW()),
  ('680d4ee3-1b19-4674-a095-ae43c66a27f7', 98, '14:00', NOW()),
  ('680d4ee3-1b19-4674-a095-ae43c66a27f7', 105, '16:00', NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- Success Message
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Sample data inserted successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  Remember to replace YOUR_USER_ID_HERE with an actual user ID';
  RAISE NOTICE '📊 You can now test the charts in your app';
END $$;

