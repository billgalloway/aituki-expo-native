/**
 * User Profile Service
 * Manages user profile data (personal details) in Supabase
 */

import { supabase } from './supabase';

// Type definition for user profile
export interface UserProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  mobile_number: string | null;
  address_first_line: string | null;
  address_second_line: string | null;
  address_city: string | null;
  address_county: string | null;
  address_country: string | null;
  address_postcode: string | null;
  created_at: string;
  updated_at: string;
}

// Type for updating profile (all fields optional except user_id)
export interface UserProfileUpdate {
  first_name?: string | null;
  last_name?: string | null;
  email?: string;
  mobile_number?: string | null;
  address_first_line?: string | null;
  address_second_line?: string | null;
  address_city?: string | null;
  address_county?: string | null;
  address_country?: string | null;
  address_postcode?: string | null;
}

/**
 * Fetch user profile from Supabase
 * @param userId - User ID (optional, uses current session if not provided)
 * @returns UserProfile or null if not found/error
 */
export async function fetchUserProfile(
  userId?: string
): Promise<UserProfile | null> {
  try {
    // Get current user if userId not provided
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      console.warn('No user ID available for fetching user profile');
      return null;
    }

    // Query Supabase
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    if (error) {
      // If no profile exists yet, return null (not an error)
      if (error.code === 'PGRST116') {
        console.log('No user profile found for user:', targetUserId);
        return null;
      }
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
}

/**
 * Create a new user profile
 * @param profile - Profile data to insert (must include user_id)
 * @returns Created UserProfile or null on error
 */
export async function createUserProfile(
  profile: Partial<UserProfile> & { user_id: string; email: string }
): Promise<UserProfile | null> {
  try {
    // Get current user if user_id not provided
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = profile.user_id || user?.id;

    if (!targetUserId) {
      console.warn('No user ID available for creating user profile');
      return null;
    }

    // Prepare insert data
    const insertData = {
      user_id: targetUserId,
      email: profile.email || user?.email || '',
      first_name: profile.first_name || null,
      last_name: profile.last_name || null,
      mobile_number: profile.mobile_number || null,
      address_first_line: profile.address_first_line || null,
      address_second_line: profile.address_second_line || null,
      address_city: profile.address_city || null,
      address_county: profile.address_county || null,
      address_country: profile.address_country || 'United Kingdom',
      address_postcode: profile.address_postcode || null,
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return null;
  }
}

/**
 * Update user profile
 * @param updates - Fields to update
 * @param userId - User ID (optional, uses current session if not provided)
 * @returns Updated UserProfile or null on error
 */
export async function updateUserProfile(
  updates: UserProfileUpdate,
  userId?: string
): Promise<UserProfile | null> {
  try {
    // Get current user if userId not provided
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      console.warn('No user ID available for updating user profile');
      return null;
    }

    // Check if profile exists, create if not
    const existingProfile = await fetchUserProfile(targetUserId);
    if (!existingProfile) {
      // Create new profile with updates and user email
      const email = updates.email || user?.email || '';
      if (!email) {
        console.warn('Cannot create profile without email');
        return null;
      }
      return createUserProfile({
        user_id: targetUserId,
        email,
        ...updates,
      });
    }

    // Update existing profile
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', targetUserId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return null;
  }
}

/**
 * Update name fields
 * @param firstName - First name
 * @param lastName - Last name
 * @param userId - User ID (optional, uses current session if not provided)
 */
export async function updateUserName(
  firstName: string,
  lastName: string,
  userId?: string
): Promise<UserProfile | null> {
  return updateUserProfile(
    {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
    },
    userId
  );
}

/**
 * Update email
 * @param email - New email address
 * @param userId - User ID (optional, uses current session if not provided)
 */
export async function updateUserEmail(
  email: string,
  userId?: string
): Promise<UserProfile | null> {
  return updateUserProfile(
    {
      email: email.trim(),
    },
    userId
  );
}

/**
 * Update mobile number
 * @param mobileNumber - New mobile number
 * @param userId - User ID (optional, uses current session if not provided)
 */
export async function updateUserMobile(
  mobileNumber: string,
  userId?: string
): Promise<UserProfile | null> {
  return updateUserProfile(
    {
      mobile_number: mobileNumber.trim(),
    },
    userId
  );
}

/**
 * Update address fields
 * @param address - Address data
 * @param userId - User ID (optional, uses current session if not provided)
 */
export async function updateUserAddress(
  address: {
    first_line: string;
    second_line?: string | null;
    city: string;
    county?: string | null;
    country: string;
    postcode: string;
  },
  userId?: string
): Promise<UserProfile | null> {
  return updateUserProfile(
    {
      address_first_line: address.first_line.trim(),
      address_second_line: address.second_line?.trim() || null,
      address_city: address.city.trim(),
      address_county: address.county?.trim() || null,
      address_country: address.country.trim(),
      address_postcode: address.postcode.trim(),
    },
    userId
  );
}

