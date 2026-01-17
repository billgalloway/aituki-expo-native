-- =====================================================
-- Verify Chart Data Tables Setup
-- =====================================================
-- Run this script to verify all tables, indexes, and policies
-- are set up correctly.
-- =====================================================

-- Check if tables exist
SELECT 
  'Tables Check' as check_type,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'physical_scores') THEN '✅ physical_scores exists'
    ELSE '❌ physical_scores missing'
  END as physical_scores,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'steps_data') THEN '✅ steps_data exists'
    ELSE '❌ steps_data missing'
  END as steps_data,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'heart_rate_data') THEN '✅ heart_rate_data exists'
    ELSE '❌ heart_rate_data missing'
  END as heart_rate_data;

-- Check RLS status
SELECT 
  'RLS Status' as check_type,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('physical_scores', 'steps_data', 'heart_rate_data')
ORDER BY tablename;

-- Check indexes
SELECT 
  'Indexes' as check_type,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('physical_scores', 'steps_data', 'heart_rate_data')
ORDER BY tablename, indexname;

-- Check policies
SELECT 
  'Policies' as check_type,
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('physical_scores', 'steps_data', 'heart_rate_data')
ORDER BY tablename, policyname;

-- Count records (if any data exists)
SELECT 
  'Data Count' as check_type,
  'physical_scores' as table_name,
  COUNT(*) as record_count
FROM physical_scores
UNION ALL
SELECT 
  'Data Count' as check_type,
  'steps_data' as table_name,
  COUNT(*) as record_count
FROM steps_data
UNION ALL
SELECT 
  'Data Count' as check_type,
  'heart_rate_data' as table_name,
  COUNT(*) as record_count
FROM heart_rate_data;

