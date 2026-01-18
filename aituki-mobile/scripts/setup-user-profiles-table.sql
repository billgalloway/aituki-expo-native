-- =====================================================
-- User Profiles Table Setup Script
-- =====================================================
-- This script creates the user_profiles table for storing
-- personal details (name, email, mobile, address) linked
-- to Supabase auth.users
-- 
-- Run this script in Supabase SQL Editor
-- =====================================================

-- Drop table if it exists (for development/reset)
-- DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  -- Primary Key (references auth.users)
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Name Fields
  first_name TEXT,
  last_name TEXT,
  
  -- Contact Fields
  email TEXT NOT NULL UNIQUE,
  mobile_number TEXT,
  
  -- Address Fields
  address_first_line TEXT,
  address_second_line TEXT,
  address_city TEXT,
  address_county TEXT,
  address_country TEXT DEFAULT 'United Kingdom',
  address_postcode TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Index on user_id (primary key - already indexed, but explicit for clarity)
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Index on email for quick lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for development/reset)
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON user_profiles;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON user_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- Triggers
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists (for development/reset)
DROP TRIGGER IF EXISTS trigger_update_user_profiles_updated_at ON user_profiles;

-- Create trigger to update updated_at on row update
CREATE TRIGGER trigger_update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

-- =====================================================
-- Validation Constraints (Optional - can be added if needed)
-- =====================================================

-- Note: Email validation is handled at the application level
-- If you want database-level email validation, you could add:
-- ALTER TABLE user_profiles ADD CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- =====================================================
-- Verification Queries
-- =====================================================

-- Uncomment to verify table structure:
-- SELECT 
--   column_name, 
--   data_type, 
--   is_nullable,
--   column_default
-- FROM information_schema.columns
-- WHERE table_name = 'user_profiles'
-- ORDER BY ordinal_position;

-- Uncomment to verify RLS policies:
-- SELECT 
--   policyname, 
--   cmd, 
--   qual,
--   with_check
-- FROM pg_policies
-- WHERE tablename = 'user_profiles';

-- =====================================================
-- Example Insert Query (for testing)
-- =====================================================
-- Replace YOUR_USER_ID_HERE with actual user UUID from auth.users
--
-- INSERT INTO user_profiles (
--   user_id,
--   first_name,
--   last_name,
--   email,
--   mobile_number,
--   address_first_line,
--   address_second_line,
--   address_city,
--   address_county,
--   address_country,
--   address_postcode
-- ) VALUES (
--   'YOUR_USER_ID_HERE'::uuid,
--   'Bill',
--   'Galloway',
--   'bill@billgalloway.com',
--   '+44 07801 745679',
--   'Groveland View',
--   NULL,
--   'Axminster',
--   'Devon',
--   'United Kingdom',
--   'EX13 5SX'
-- );

-- =====================================================
-- Script Complete
-- =====================================================
-- The user_profiles table is now ready for use.
-- Users can only access their own profiles via RLS policies.
-- The updated_at timestamp will automatically update on row changes.
-- =====================================================

