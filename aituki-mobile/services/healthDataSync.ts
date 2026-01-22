/**
 * Health Data Sync Service
 * Syncs Apple Health data to Supabase
 * Handles incremental updates and conflict resolution
 */

import { supabase } from './supabase';
import {
  HealthDataSample,
  getAllHealthData,
  getStepCount,
  getHeartRate,
  getActiveEnergy,
  getSleepAnalysis,
  getDistanceWalkingRunning,
  getWorkouts,
  getHeartRateVariability,
  getMindfulMinutes,
  getRespiratoryRate,
  getRestingEnergy,
  getBodyMass,
  getVO2Max,
} from './appleHealth';

// Sync status
export interface SyncStatus {
  success: boolean;
  synced: number;
  errors: number;
  lastSyncDate?: Date;
}

// Data type to function mapping
const DATA_TYPE_FETCHERS: Record<string, (startDate: Date, endDate: Date) => Promise<HealthDataSample[]>> = {
  stepCount: getStepCount,
  heartRate: getHeartRate,
  activeEnergy: getActiveEnergy,
  sleepAnalysis: getSleepAnalysis,
  distanceWalkingRunning: getDistanceWalkingRunning,
  workout: getWorkouts,
  heartRateVariability: getHeartRateVariability,
  mindfulMinutes: getMindfulMinutes,
  respiratoryRate: getRespiratoryRate,
  restingEnergy: getRestingEnergy,
  bodyMass: getBodyMass,
  vo2Max: getVO2Max,
};

/**
 * Convert HealthDataSample to Supabase format
 */
function sampleToSupabaseFormat(
  sample: HealthDataSample,
  dataType: string,
  userId: string
): any {
  return {
    user_id: userId,
    data_type: dataType,
    value: sample.value,
    unit: sample.unit,
    start_date: sample.startDate.toISOString(),
    end_date: sample.endDate?.toISOString() || null,
    source: sample.source || 'apple_health',
    metadata: sample.metadata || {},
  };
}

/**
 * Sync a single data type to Supabase
 */
async function syncDataType(
  dataType: string,
  samples: HealthDataSample[],
  userId: string
): Promise<{ synced: number; errors: number }> {
  if (samples.length === 0) {
    return { synced: 0, errors: 0 };
  }

  try {
    // Convert samples to Supabase format
    const records = samples.map((sample) =>
      sampleToSupabaseFormat(sample, dataType, userId)
    );

    // Use upsert to handle conflicts (based on unique constraint)
    // Note: Supabase requires array format for composite keys
    const { data, error } = await supabase
      .from('health_data')
      .upsert(records, {
        onConflict: 'user_id,data_type,start_date,source',
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.error(`Error syncing ${dataType}:`, error);
      return { synced: 0, errors: samples.length };
    }

    return { synced: data?.length || 0, errors: 0 };
  } catch (error) {
    console.error(`Exception syncing ${dataType}:`, error);
    return { synced: 0, errors: samples.length };
  }
}

/**
 * Get last sync date for a user from Supabase
 */
async function getLastSyncDate(userId: string): Promise<Date | null> {
  try {
    const { data, error } = await supabase
      .from('health_data')
      .select('start_date')
      .eq('user_id', userId)
      .eq('source', 'apple_health')
      .order('start_date', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return new Date(data.start_date);
  } catch (error) {
    console.error('Error getting last sync date:', error);
    return null;
  }
}

/**
 * Sync all health data to Supabase
 * @param startDate - Start date for data range (defaults to last sync or 7 days ago)
 * @param endDate - End date for data range (defaults to now)
 * @param userId - User ID (optional, uses current session if not provided)
 */
export async function syncHealthDataToSupabase(
  startDate?: Date,
  endDate: Date = new Date(),
  userId?: string
): Promise<SyncStatus> {
  try {
    // Get current user if userId not provided
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      console.warn('No user ID available for syncing health data');
      return { success: false, synced: 0, errors: 0 };
    }

    // Determine start date (use last sync or default to 7 days ago)
    let syncStartDate = startDate;
    if (!syncStartDate) {
      const lastSync = await getLastSyncDate(targetUserId);
      if (lastSync) {
        // Sync from last sync date (with 1 hour overlap to catch any missed data)
        syncStartDate = new Date(lastSync.getTime() - 60 * 60 * 1000);
      } else {
        // First sync - get last 7 days
        syncStartDate = new Date();
        syncStartDate.setDate(syncStartDate.getDate() - 7);
      }
    }

    console.log(`Syncing health data from ${syncStartDate.toISOString()} to ${endDate.toISOString()}`);

    // Fetch all health data
    const allData = await getAllHealthData(syncStartDate, endDate);

    // Sync each data type
    const syncResults = await Promise.all([
      // Physical
      syncDataType('stepCount', allData.physical.steps, targetUserId),
      syncDataType('activeEnergy', allData.physical.activeEnergy, targetUserId),
      syncDataType('distanceWalkingRunning', allData.physical.distance, targetUserId),
      syncDataType('workout', allData.physical.workouts, targetUserId),
      
      // Emotional
      syncDataType('heartRate', allData.emotional.heartRate, targetUserId),
      syncDataType('heartRateVariability', allData.emotional.heartRateVariability, targetUserId),
      syncDataType('mindfulMinutes', allData.emotional.mindfulMinutes, targetUserId),
      
      // Mental
      syncDataType('sleepAnalysis', allData.mental.sleep, targetUserId),
      syncDataType('respiratoryRate', allData.mental.respiratoryRate, targetUserId),
      
      // Energy
      syncDataType('restingEnergy', allData.energy.restingEnergy, targetUserId),
      syncDataType('bodyMass', allData.energy.bodyMass, targetUserId),
      syncDataType('vo2Max', allData.energy.vo2Max, targetUserId),
    ]);

    // Aggregate results
    const totalSynced = syncResults.reduce((sum, result) => sum + result.synced, 0);
    const totalErrors = syncResults.reduce((sum, result) => sum + result.errors, 0);

    const status: SyncStatus = {
      success: totalErrors === 0,
      synced: totalSynced,
      errors: totalErrors,
      lastSyncDate: endDate,
    };

    console.log(`Sync complete: ${totalSynced} records synced, ${totalErrors} errors`);
    return status;
  } catch (error) {
    console.error('Error syncing health data:', error);
    return { success: false, synced: 0, errors: 0 };
  }
}

/**
 * Sync a specific data type to Supabase
 * @param dataType - Type of health data to sync
 * @param startDate - Start date for data range
 * @param endDate - End date for data range
 * @param userId - User ID (optional, uses current session if not provided)
 */
export async function syncSpecificDataType(
  dataType: string,
  startDate: Date,
  endDate: Date = new Date(),
  userId?: string
): Promise<SyncStatus> {
  try {
    // Get current user if userId not provided
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      console.warn('No user ID available for syncing health data');
      return { success: false, synced: 0, errors: 0 };
    }

    // Get the fetcher function for this data type
    const fetcher = DATA_TYPE_FETCHERS[dataType];
    if (!fetcher) {
      console.error(`Unknown data type: ${dataType}`);
      return { success: false, synced: 0, errors: 0 };
    }

    // Fetch data
    const samples = await fetcher(startDate, endDate);

    // Sync to Supabase
    const result = await syncDataType(dataType, samples, targetUserId);

    return {
      success: result.errors === 0,
      synced: result.synced,
      errors: result.errors,
      lastSyncDate: endDate,
    };
  } catch (error) {
    console.error(`Error syncing ${dataType}:`, error);
    return { success: false, synced: 0, errors: 0 };
  }
}

/**
 * Get sync status for a user
 */
export async function getSyncStatus(userId?: string): Promise<{
  lastSyncDate: Date | null;
  totalRecords: number;
  dataTypes: string[];
}> {
  try {
    // Get current user if userId not provided
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      return { lastSyncDate: null, totalRecords: 0, dataTypes: [] };
    }

    // Get last sync date
    const lastSyncDate = await getLastSyncDate(targetUserId);

    // Get total records and data types
    const { data, error } = await supabase
      .from('health_data')
      .select('data_type')
      .eq('user_id', targetUserId)
      .eq('source', 'apple_health');

    if (error) {
      console.error('Error getting sync status:', error);
      return { lastSyncDate, totalRecords: 0, dataTypes: [] };
    }

    const dataTypes = [...new Set((data || []).map((r: any) => r.data_type))];
    const totalRecords = data?.length || 0;

    return {
      lastSyncDate,
      totalRecords,
      dataTypes,
    };
  } catch (error) {
    console.error('Error getting sync status:', error);
    return { lastSyncDate: null, totalRecords: 0, dataTypes: [] };
  }
}

