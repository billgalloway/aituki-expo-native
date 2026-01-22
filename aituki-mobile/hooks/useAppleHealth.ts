/**
 * React Hook for managing Apple Health data
 * Handles permissions, syncing, and data fetching
 * Follows the pattern of useUserProfile and useChartData
 */

import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import {
  isHealthKitAvailable,
  requestHealthKitPermissions,
  PermissionStatus,
  getAllHealthData,
  HealthDataSample,
} from '@/services/appleHealth';
import {
  syncHealthDataToSupabase,
  syncSpecificDataType,
  getSyncStatus,
  SyncStatus,
} from '@/services/healthDataSync';

interface UseAppleHealthOptions {
  userId?: string;
  autoSync?: boolean; // Auto-sync on mount (default: false)
  syncInterval?: number; // Auto-sync interval in milliseconds (default: 3600000 = 1 hour)
}

interface UseAppleHealthReturn {
  // Availability and permissions
  isAvailable: boolean;
  permissions: PermissionStatus | null;
  permissionsLoading: boolean;
  
  // Health data
  healthData: {
    physical: {
      steps: HealthDataSample[];
      activeEnergy: HealthDataSample[];
      distance: HealthDataSample[];
      workouts: HealthDataSample[];
    };
    emotional: {
      heartRate: HealthDataSample[];
      heartRateVariability: HealthDataSample[];
      mindfulMinutes: HealthDataSample[];
    };
    mental: {
      sleep: HealthDataSample[];
      respiratoryRate: HealthDataSample[];
    };
    energy: {
      restingEnergy: HealthDataSample[];
      bodyMass: HealthDataSample[];
      vo2Max: HealthDataSample[];
    };
  } | null;
  healthDataLoading: boolean;
  
  // Sync status
  syncStatus: {
    lastSyncDate: Date | null;
    totalRecords: number;
    dataTypes: string[];
  } | null;
  syncStatusLoading: boolean;
  
  // Sync operations
  syncLoading: boolean;
  lastSyncResult: SyncStatus | null;
  
  // Error state
  error: Error | null;
  
  // Actions
  requestPermissions: () => Promise<PermissionStatus>;
  fetchHealthData: (startDate: Date, endDate?: Date) => Promise<void>;
  syncToSupabase: (startDate?: Date, endDate?: Date) => Promise<SyncStatus>;
  syncSpecificType: (dataType: string, startDate: Date, endDate?: Date) => Promise<SyncStatus>;
  refreshSyncStatus: () => Promise<void>;
}

export function useAppleHealth(
  options: UseAppleHealthOptions = {}
): UseAppleHealthReturn {
  const { userId, autoSync = false, syncInterval = 3600000 } = options;

  // Availability state
  const [isAvailable, setIsAvailable] = useState(false);
  
  // Permissions state
  const [permissions, setPermissions] = useState<PermissionStatus | null>(null);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  
  // Health data state
  const [healthData, setHealthData] = useState<UseAppleHealthReturn['healthData']>(null);
  const [healthDataLoading, setHealthDataLoading] = useState(false);
  
  // Sync status state
  const [syncStatus, setSyncStatus] = useState<UseAppleHealthReturn['syncStatus']>(null);
  const [syncStatusLoading, setSyncStatusLoading] = useState(true);
  
  // Sync operations state
  const [syncLoading, setSyncLoading] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncStatus | null>(null);
  
  // Error state
  const [error, setError] = useState<Error | null>(null);

  // Check availability on mount
  useEffect(() => {
    const checkAvailability = async () => {
      if (Platform.OS !== 'ios') {
        setIsAvailable(false);
        setPermissionsLoading(false);
        return;
      }

      try {
        const available = await isHealthKitAvailable();
        setIsAvailable(available);
      } catch (err) {
        console.error('Error checking HealthKit availability:', err);
        setIsAvailable(false);
      } finally {
        setPermissionsLoading(false);
      }
    };

    checkAvailability();
  }, []);

  // Request permissions
  const requestPermissions = useCallback(async (): Promise<PermissionStatus> => {
    if (Platform.OS !== 'ios' || !isAvailable) {
      const status: PermissionStatus = { granted: false, denied: false, unavailable: true };
      setPermissions(status);
      return status;
    }

    setPermissionsLoading(true);
    setError(null);

    try {
      const status = await requestHealthKitPermissions();
      setPermissions(status);
      return status;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to request permissions');
      setError(error);
      const status: PermissionStatus = { granted: false, denied: true, unavailable: false };
      setPermissions(status);
      return status;
    } finally {
      setPermissionsLoading(false);
    }
  }, [isAvailable]);

  // Fetch health data from HealthKit
  const fetchHealthData = useCallback(async (startDate: Date, endDate: Date = new Date()) => {
    if (Platform.OS !== 'ios' || !isAvailable) {
      return;
    }

    setHealthDataLoading(true);
    setError(null);

    try {
      const data = await getAllHealthData(startDate, endDate);
      setHealthData(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch health data');
      setError(error);
      console.error('Error fetching health data:', err);
    } finally {
      setHealthDataLoading(false);
    }
  }, [isAvailable]);

  // Sync health data to Supabase
  const syncToSupabase = useCallback(async (
    startDate?: Date,
    endDate: Date = new Date()
  ): Promise<SyncStatus> => {
    if (Platform.OS !== 'ios' || !isAvailable) {
      return { success: false, synced: 0, errors: 0 };
    }

    setSyncLoading(true);
    setError(null);

    try {
      const result = await syncHealthDataToSupabase(startDate, endDate, userId);
      setLastSyncResult(result);
      
      // Refresh sync status after sync
      await refreshSyncStatus();
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to sync health data');
      setError(error);
      console.error('Error syncing health data:', err);
      return { success: false, synced: 0, errors: 0 };
    } finally {
      setSyncLoading(false);
    }
  }, [isAvailable, userId]);

  // Sync specific data type
  const syncSpecificType = useCallback(async (
    dataType: string,
    startDate: Date,
    endDate: Date = new Date()
  ): Promise<SyncStatus> => {
    if (Platform.OS !== 'ios' || !isAvailable) {
      return { success: false, synced: 0, errors: 0 };
    }

    setSyncLoading(true);
    setError(null);

    try {
      const result = await syncSpecificDataType(dataType, startDate, endDate, userId);
      setLastSyncResult(result);
      
      // Refresh sync status after sync
      await refreshSyncStatus();
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to sync health data');
      setError(error);
      console.error('Error syncing health data:', err);
      return { success: false, synced: 0, errors: 0 };
    } finally {
      setSyncLoading(false);
    }
  }, [isAvailable, userId]);

  // Refresh sync status
  const refreshSyncStatus = useCallback(async () => {
    setSyncStatusLoading(true);
    setError(null);

    try {
      const status = await getSyncStatus(userId);
      setSyncStatus({
        lastSyncDate: status.lastSyncDate,
        totalRecords: status.totalRecords,
        dataTypes: status.dataTypes,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get sync status');
      setError(error);
      console.error('Error getting sync status:', err);
    } finally {
      setSyncStatusLoading(false);
    }
  }, [userId]);

  // Initial sync status fetch
  useEffect(() => {
    refreshSyncStatus();
  }, [refreshSyncStatus]);

  // Auto-sync if enabled
  useEffect(() => {
    if (!autoSync || !isAvailable || !permissions?.granted) {
      return;
    }

    // Initial sync
    const performSync = async () => {
      await syncToSupabase();
    };
    performSync();

    // Set up interval for periodic sync
    const interval = setInterval(() => {
      performSync();
    }, syncInterval);

    return () => clearInterval(interval);
  }, [autoSync, isAvailable, permissions?.granted, syncInterval, syncToSupabase]);

  return {
    isAvailable,
    permissions,
    permissionsLoading,
    healthData,
    healthDataLoading,
    syncStatus,
    syncStatusLoading,
    syncLoading,
    lastSyncResult,
    error,
    requestPermissions,
    fetchHealthData,
    syncToSupabase,
    syncSpecificType,
    refreshSyncStatus,
  };
}

