-- =====================================================
-- Easy Seed Data Script for Supabase
-- =====================================================
-- 
-- INSTRUCTIONS:
-- 1. Get your User ID: Supabase Dashboard → Authentication → Users
-- 2. Find and replace '3267d78c-5be9-4ad1-b3bc-89173f0b8563' below with your actual UUID
-- 3. Copy this entire script
-- 4. Paste into Supabase Dashboard → SQL Editor
-- 5. Click "Run"
-- =====================================================

-- ⚠️ REPLACE '3267d78c-5be9-4ad1-b3bc-89173f0b8563' WITH YOUR ACTUAL USER ID ⚠️
-- Get it from: Supabase Dashboard → Authentication → Users
-- Example format: '123e4567-e89b-12d3-a456-426614174000'

-- =====================================================
-- Insert Physical Score Data
-- =====================================================
INSERT INTO physical_scores (user_id, score, percentage, label, timeframe, date)
VALUES 
  ('3267d78c-5be9-4ad1-b3bc-89173f0b8563', 179, 56, 'Good week', 'week', NOW() - INTERVAL '1 day'),
  ('3267d78c-5be9-4ad1-b3bc-89173f0b8563', 172, 54, 'Average week', 'week', NOW() - INTERVAL '2 days'),
  ('3267d78c-5be9-4ad1-b3bc-89173f0b8563', 185, 58, 'Great week', 'week', NOW() - INTERVAL '3 days'),
  ('3267d78c-5be9-4ad1-b3bc-89173f0b8563', 168, 53, 'Good week', 'week', NOW() - INTERVAL '4 days'),
  ('3267d78c-5be9-4ad1-b3bc-89173f0b8563', 175, 55, 'Good week', 'week', NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Insert Steps Data (for current week)
-- =====================================================
INSERT INTO steps_data (user_id, quarter, walking, running, date)
VALUES
  ('3267d78c-5be9-4ad1-b3bc-89173f0b8563', 'q1', 45, 20, NOW()),
  ('3267d78c-5be9-4ad1-b3bc-89173f0b8563', 'q2', 35, 30, NOW()),
  ('3267d78c-5be9-4ad1-b3bc-89173f0b8563', 'q3', 50, 25, NOW()),
  ('3267d78c-5be9-4ad1-b3bc-89173f0b8563', 'q4', 55, 20, NOW())
ON CONFLICT (user_id, quarter, date) DO UPDATE
SET 
  walking = EXCLUDED.walking,
  running = EXCLUDED.running,
  updated_at = NOW();

-- =====================================================
-- Insert Heart Rate Data (for today)
-- =====================================================
INSERT INTO heart_rate_data (user_id, heart_rate, time, date)
VALUES
  ('3267d78c-5be9-4ad1-b3bc-89173f0b8563', 85, '08:00', NOW()),
  ('3267d78c-5be9-4ad1-b3bc-89173f0b8563', 95, '10:00', NOW()),
  ('3267d78c-5be9-4ad1-b3bc-89173f0b8563', 102, '12:00', NOW()),
  ('3267d78c-5be9-4ad1-b3bc-89173f0b8563', 98, '14:00', NOW()),
  ('3267d78c-5be9-4ad1-b3bc-89173f0b8563', 105, '16:00', NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- Verify data was inserted
-- =====================================================
SELECT 
  'physical_scores' as table_name, 
  COUNT(*) as record_count 
FROM physical_scores 
WHERE user_id = '3267d78c-5be9-4ad1-b3bc-89173f0b8563'
UNION ALL
SELECT 
  'steps_data' as table_name, 
  COUNT(*) as record_count 
FROM steps_data npx 
WHERE user_id = '3267d78c-5be9-4ad1-b3bc-89173f0b8563'
UNION ALL
SELECT 
  'heart_rate_data' as table_name, 
  COUNT(*) as record_count 
FROM heart_rate_data 
WHERE user_id = '3267d78c-5be9-4ad1-b3bc-89173f0b8563';
