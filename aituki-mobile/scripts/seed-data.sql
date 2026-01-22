-- =====================================================
-- Seed Data Script for Supabase
-- =====================================================
-- This script inserts sample data for the current authenticated user.
-- 
-- To use this script:
-- 1. Make sure you're authenticated in Supabase Dashboard
-- 2. OR replace auth.uid() with your user ID manually
-- 3. Open Supabase Dashboard → SQL Editor
-- 4. Copy and paste this script
-- 5. Click "Run" or press Cmd/Ctrl + Enter
-- =====================================================

-- =====================================================
-- Option 1: Use current authenticated user (auth.uid())
-- This automatically uses whoever is logged into the dashboard
-- =====================================================

-- Insert Physical Score Data (most recent)
INSERT INTO physical_scores (user_id, score, percentage, label, timeframe, date)
VALUES (
  auth.uid(), -- Uses the current authenticated user
  179,
  56,
  'Good week',
  'week',
  NOW() - INTERVAL '1 day'
)
ON CONFLICT DO NOTHING;

-- Insert additional historical physical scores for the past week
INSERT INTO physical_scores (user_id, score, percentage, label, timeframe, date)
VALUES 
  (auth.uid(), 172, 54, 'Average week', 'week', NOW() - INTERVAL '2 days'),
  (auth.uid(), 185, 58, 'Great week', 'week', NOW() - INTERVAL '3 days'),
  (auth.uid(), 168, 53, 'Good week', 'week', NOW() - INTERVAL '4 days'),
  (auth.uid(), 175, 55, 'Good week', 'week', NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- Insert Steps Data (for current week)
INSERT INTO steps_data (user_id, quarter, walking, running, date)
VALUES
  (auth.uid(), 'q1', 45, 20, NOW()),
  (auth.uid(), 'q2', 35, 30, NOW()),
  (auth.uid(), 'q3', 50, 25, NOW()),
  (auth.uid(), 'q4', 55, 20, NOW())
ON CONFLICT (user_id, quarter, date) DO UPDATE
SET 
  walking = EXCLUDED.walking,
  running = EXCLUDED.running,
  updated_at = NOW();

-- Insert Heart Rate Data (for today)
INSERT INTO heart_rate_data (user_id, heart_rate, time, date)
VALUES
  (auth.uid(), 85, '08:00', NOW()),
  (auth.uid(), 95, '10:00', NOW()),
  (auth.uid(), 102, '12:00', NOW()),
  (auth.uid(), 98, '14:00', NOW()),
  (auth.uid(), 105, '16:00', NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- Option 2: Use a specific user ID (uncomment to use)
-- =====================================================
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID
-- To get your user ID: Supabase Dashboard → Authentication → Users

/*
DO $$
DECLARE
  target_user_id UUID := 'YOUR_USER_ID_HERE'; -- Replace this!
BEGIN
  -- Physical Score
  INSERT INTO physical_scores (user_id, score, percentage, label, timeframe, date)
  VALUES (target_user_id, 179, 56, 'Good week', 'week', NOW() - INTERVAL '1 day')
  ON CONFLICT DO NOTHING;

  -- Steps Data
  INSERT INTO steps_data (user_id, quarter, walking, running, date)
  VALUES
    (target_user_id, 'q1', 45, 20, NOW()),
    (target_user_id, 'q2', 35, 30, NOW()),
    (target_user_id, 'q3', 50, 25, NOW()),
    (target_user_id, 'q4', 55, 20, NOW())
  ON CONFLICT (user_id, quarter, date) DO UPDATE
  SET 
    walking = EXCLUDED.walking,
    running = EXCLUDED.running,
    updated_at = NOW();

  -- Heart Rate Data
  INSERT INTO heart_rate_data (user_id, heart_rate, time, date)
  VALUES
    (target_user_id, 85, '08:00', NOW()),
    (target_user_id, 95, '10:00', NOW()),
    (target_user_id, 102, '12:00', NOW()),
    (target_user_id, 98, '14:00', NOW()),
    (target_user_id, 105, '16:00', NOW())
  ON CONFLICT DO NOTHING;

  RAISE NOTICE '✅ Data inserted for user: %', target_user_id;
END $$;
*/

-- =====================================================
-- Success Message
-- =====================================================
DO $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NOT NULL THEN
    RAISE NOTICE '✅ Sample data inserted successfully for user: %', current_user_id;
    RAISE NOTICE '📊 Tables populated:';
    RAISE NOTICE '   - physical_scores (5 records)';
    RAISE NOTICE '   - steps_data (4 quarters)';
    RAISE NOTICE '   - heart_rate_data (5 time points)';
    RAISE NOTICE '';
    RAISE NOTICE '💡 Tip: If no data was inserted, you may need to:';
    RAISE NOTICE '   1. Authenticate in Supabase Dashboard, OR';
    RAISE NOTICE '   2. Use Option 2 with a specific user ID';
  ELSE
    RAISE NOTICE '⚠️  No authenticated user found.';
    RAISE NOTICE '💡 Use Option 2 (uncomment the DO block above) with a specific user ID';
  END IF;
END $$;
