/**
 * OAuth Profile Sync Service
 * Syncs OAuth provider metadata (Apple, Google, etc.) to user_profiles table
 * 
 * This handles the mapping between OAuth provider user data and our profile schema
 */

import { User } from '@supabase/supabase-js';
import { createUserProfile, updateUserProfile, fetchUserProfile } from './userProfile';

/**
 * OAuth Provider metadata structure
 * Different providers return data in different formats
 */
interface OAuthMetadata {
  email?: string;
  full_name?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  first_name?: string;
  last_name?: string;
  picture?: string;
  avatar_url?: string;
}

/**
 * Extract and normalize user data from OAuth provider
 * Handles different formats from Apple, Google, etc.
 */
function extractOAuthUserData(user: User): {
  email: string;
  firstName: string | null;
  lastName: string | null;
} {
  const metadata = user.user_metadata || {};
  const appMetadata = user.app_metadata || {};
  
  // Provider-specific metadata (from OAuth response)
  const oauthMetadata: OAuthMetadata = {
    ...metadata,
    // Some providers nest data differently
    ...(metadata.raw_user_meta_data || {}),
  };

  // Email: Primary source from user.email, fallback to metadata
  const email = user.email || oauthMetadata.email || '';
  
  // Name extraction: Handle different OAuth provider formats
  let firstName: string | null = null;
  let lastName: string | null = null;
  
  // Apple Sign-In format
  // Apple provides: { full_name: "John Doe" } or separate fields
  if (oauthMetadata.full_name) {
    const nameParts = oauthMetadata.full_name.trim().split(/\s+/);
    if (nameParts.length > 0) {
      firstName = nameParts[0];
      lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;
    }
  }
  
  // Google Sign-In format (preferred fields)
  if (oauthMetadata.given_name) {
    firstName = oauthMetadata.given_name;
  }
  if (oauthMetadata.family_name) {
    lastName = oauthMetadata.family_name;
  }
  
  // Fallback: Check for first_name/last_name directly
  if (!firstName && oauthMetadata.first_name) {
    firstName = oauthMetadata.first_name;
  }
  if (!lastName && oauthMetadata.last_name) {
    lastName = oauthMetadata.last_name;
  }
  
  // Fallback: Try generic "name" field
  if (!firstName && !lastName && oauthMetadata.name) {
    const nameParts = oauthMetadata.name.trim().split(/\s+/);
    if (nameParts.length > 0) {
      firstName = nameParts[0];
      lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;
    }
  }
  
  return {
    email,
    firstName: firstName || null,
    lastName: lastName || null,
  };
}

/**
 * Sync OAuth provider user data to user_profiles table
 * 
 * This is called automatically when a user signs in with OAuth (Apple, Google)
 * to ensure their profile is populated with available data from the provider
 * 
 * @param user - Supabase User object (from auth session)
 * @returns Updated UserProfile or null on error
 */
export async function syncOAuthUserToProfile(
  user: User
): Promise<boolean> {
  try {
    if (!user?.id) {
      console.warn('⚠️ Cannot sync profile: No user ID available');
      return false;
    }

    // Extract user data from OAuth metadata
    const { email, firstName, lastName } = extractOAuthUserData(user);
    
    // Handle case where email might be hidden (e.g., Apple Sign-In with hidden email)
    // Supabase creates users even without email, so we need to handle this
    let profileEmail = email;
    if (!profileEmail) {
      // Apple can hide email - use a placeholder or user's auth ID-based email
      // Supabase might provide a proxy email like: {provider_id}@auth.{project_ref}.supabase.co
      profileEmail = user.email || `${user.id}@auth.placeholder.supabase.co`;
      console.warn('⚠️ OAuth provider did not share email, using fallback:', profileEmail);
    }

    // Check if profile already exists
    const existingProfile = await fetchUserProfile(user.id);
    
    if (existingProfile) {
      // Profile exists - update only if we have new data and current fields are null
      const updates: Record<string, string | null> = {};
      
      // Only update email if profile email is different (but don't override if already set differently)
      // This handles the case where user's email changed in auth but profile wasn't updated
      if (profileEmail && profileEmail !== existingProfile.email) {
        updates.email = profileEmail;
      }
      
      // Only update names if they're currently null and we have data from OAuth
      if (!existingProfile.first_name && firstName) {
        updates.first_name = firstName;
      }
      if (!existingProfile.last_name && lastName) {
        updates.last_name = lastName;
      }
      
      // Only update if we have changes
      if (Object.keys(updates).length > 0) {
        await updateUserProfile(updates, user.id);
        console.log('✅ Synced OAuth data to existing profile:', { updates });
      } else {
        console.log('ℹ️ Profile already has data, skipping OAuth sync');
      }
      
      return true;
    } else {
      // Profile doesn't exist - create with OAuth data
      const newProfile = await createUserProfile({
        user_id: user.id,
        email: profileEmail,
        first_name: firstName,
        last_name: lastName,
      }, user.id);
      
      if (newProfile) {
        console.log('✅ Created profile from OAuth data:', { email, firstName, lastName });
        return true;
      } else {
        console.error('❌ Failed to create profile from OAuth data');
        return false;
      }
    }
  } catch (error) {
    console.error('❌ Error syncing OAuth user to profile:', error);
    return false;
  }
}

/**
 * Sync email signup metadata (first_name, last_name, mobile_number) to user_profiles.
 * Used when user signed up with email and may not have had a session at signup (e.g. email confirmation).
 * Creates profile from user_metadata if no profile exists.
 */
export async function syncEmailSignupMetadataToProfile(user: User): Promise<boolean> {
  try {
    if (!user?.id) return false;
    const meta = user.user_metadata || {};
    const hasMeta = meta.first_name != null || meta.last_name != null || meta.mobile_number != null;
    if (!hasMeta) return true;

    const existing = await fetchUserProfile(user.id);
    if (existing) return true;

    const email = user.email || '';
    if (!email) return false;

    const newProfile = await createUserProfile({
      user_id: user.id,
      email,
      first_name: meta.first_name ?? null,
      last_name: meta.last_name ?? null,
      mobile_number: meta.mobile_number ?? null,
    });
    if (newProfile) {
      console.log('✅ Created profile from email signup metadata');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error syncing email signup metadata to profile:', error);
    return false;
  }
}

/**
 * Check if user signed in via OAuth provider (Apple, Google, etc.)
 */
export function isOAuthUser(user: User | null): boolean {
  if (!user) return false;
  
  // Check app_metadata for provider info
  const provider = user.app_metadata?.provider || 'email';
  const oauthProviders = ['apple', 'google', 'github', 'facebook', 'azure'];
  
  return oauthProviders.includes(provider);
}

/**
 * Get OAuth provider name from user
 */
export function getOAuthProvider(user: User | null): string | null {
  if (!user) return null;
  
  const provider = user.app_metadata?.provider || null;
  return provider && provider !== 'email' ? provider : null;
}

