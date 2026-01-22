/**
 * React Hook for managing user profile data
 * Handles loading states, errors, and CRUD operations
 */

import { useState, useEffect, useCallback } from 'react';
import {
  fetchUserProfile,
  createUserProfile,
  updateUserProfile,
  updateUserName,
  updateUserEmail,
  updateUserMobile,
  updateUserAddress,
  UserProfile,
  UserProfileUpdate,
} from '@/services/userProfile';

interface UseUserProfileReturn {
  // Profile data
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;

  // CRUD operations
  refresh: () => Promise<void>;
  updateProfile: (updates: UserProfileUpdate) => Promise<boolean>;
  updateName: (firstName: string, lastName: string) => Promise<boolean>;
  updateEmail: (email: string) => Promise<boolean>;
  updateMobile: (mobileNumber: string) => Promise<boolean>;
  updateAddress: (address: {
    first_line: string;
    second_line?: string | null;
    city: string;
    county?: string | null;
    country: string;
    postcode: string;
  }) => Promise<boolean>;
}

interface UseUserProfileOptions {
  userId?: string;
  autoFetch?: boolean; // Auto-fetch on mount (default: true)
}

export function useUserProfile(
  options: UseUserProfileOptions = {}
): UseUserProfileReturn {
  const { userId, autoFetch = true } = options;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchUserProfile(userId);
      setProfile(data);
      if (!data && error) {
        // Only set error if we were expecting data
        setError(new Error('Failed to fetch user profile'));
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setProfile(null);
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Refresh profile (alias for fetchProfile for consistency)
  const refresh = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  // Update profile with partial data
  const updateProfile = useCallback(
    async (updates: UserProfileUpdate): Promise<boolean> => {
      try {
        setError(null);
        const updated = await updateUserProfile(updates, userId);

        if (updated) {
          setProfile(updated);
          return true;
        } else {
          setError(new Error('Failed to update profile'));
          return false;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error('Error updating profile:', err);
        return false;
      }
    },
    [userId]
  );

  // Update name
  const updateName = useCallback(
    async (firstName: string, lastName: string): Promise<boolean> => {
      try {
        setError(null);
        const updated = await updateUserName(firstName, lastName, userId);

        if (updated) {
          setProfile(updated);
          return true;
        } else {
          setError(new Error('Failed to update name'));
          return false;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error('Error updating name:', err);
        return false;
      }
    },
    [userId]
  );

  // Update email
  const updateEmail = useCallback(
    async (email: string): Promise<boolean> => {
      try {
        setError(null);
        const updated = await updateUserEmail(email, userId);

        if (updated) {
          setProfile(updated);
          return true;
        } else {
          setError(new Error('Failed to update email'));
          return false;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error('Error updating email:', err);
        return false;
      }
    },
    [userId]
  );

  // Update mobile
  const updateMobile = useCallback(
    async (mobileNumber: string): Promise<boolean> => {
      try {
        setError(null);
        const updated = await updateUserMobile(mobileNumber, userId);

        if (updated) {
          setProfile(updated);
          return true;
        } else {
          setError(new Error('Failed to update mobile number'));
          return false;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error('Error updating mobile:', err);
        return false;
      }
    },
    [userId]
  );

  // Update address
  const updateAddress = useCallback(
    async (address: {
      first_line: string;
      second_line?: string | null;
      city: string;
      county?: string | null;
      country: string;
      postcode: string;
    }): Promise<boolean> => {
      try {
        setError(null);
        const updated = await updateUserAddress(address, userId);

        if (updated) {
          setProfile(updated);
          return true;
        } else {
          setError(new Error('Failed to update address'));
          return false;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error('Error updating address:', err);
        return false;
      }
    },
    [userId]
  );

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchProfile();
    }
  }, [autoFetch, fetchProfile]);

  return {
    profile,
    loading,
    error,
    refresh,
    updateProfile,
    updateName,
    updateEmail,
    updateMobile,
    updateAddress,
  };
}

