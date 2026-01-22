-- =====================================================
-- Simple Seed Data Script for Supabase
-- =====================================================
-- 
-- INSTRUCTIONS:
-- 1. Get your User ID: Supabase Dashboard → Authentication → Users
-- 2. Replace 'YOUR_USER_ID_HERE' below with your actual UUID
-- 3. Copy this entire script
-- 4. Paste into Supabase Dashboard → SQL Editor
-- 5. Click "Run"
-- =====================================================

-- ⚠️ REPLACE THIS WITH YOUR USER ID ⚠️
-- Get it from: Supabase Dashboard → Authentication → Users
\set user_id 'YOUR_USER_ID_HERE'

-- Example format (replace with yours):
-- \set user_id '123e4567-e89b-12d3-a456-426614174000'

-- =====================================================
-- Insert Physical Score Data
-- =====================================================
INSERT INTO physical_scores (user_id, score, percentage, label, timeframe, date)
VALUES 
  (:user_id, 179, 56, 'Good week', 'week', NOW() - INTERVAL '1 day'),
  (:user_id, 172, 54, 'Average week', 'week', NOW() - INTERVAL '2 days'),
  (:user_id, 185, 58, 'Great week', 'week', NOW() - INTERVAL '3 days'),
  (:user_id, 168, 53, 'Good week', 'week', NOW() - INTERVAL '4 days'),
  (:user_id, 175, 55, 'Good week', 'week', NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Insert Steps Data (for current week)
-- =====================================================
INSERT INTO steps_data (user_id, quarter, walking, running, date)
VALUES
  (:user_id, 'q1', 45, 20, NOW()),
  (:user_id, 'q2', 35, 30, NOW()),
  (:user_id, 'q3', 50, 25, NOW()),
  (:user_id, 'q4', 55, 20, NOW())
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
  (:user_id, 85, '08:00', NOW()),
  (:user_id, 95, '10:00', NOW()),
  (:user_id, 102, '12:00', NOW()),
  (:user_id, 98, '14:00', NOW()),
  (:user_id, 105, '16:00', NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- Success Message
-- =====================================================
SELECT '✅ Sample data inserted successfully!' as status;
