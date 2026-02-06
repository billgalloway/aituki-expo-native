/**
 * Apple Health Service
 * Integrates with HealthKit to read health data for the 4 pillars
 * Physical, Emotional, Mental, Energy
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';

// HealthKit type identifiers (Apple's HKQuantityTypeIdentifier / HKCategoryTypeIdentifier strings).
// Defined locally so we never import @kingstinct/react-native-healthkit on Android.
const HK = {
  quantity: {
    stepCount: 'HKQuantityTypeIdentifierStepCount',
    heartRate: 'HKQuantityTypeIdentifierHeartRate',
    activeEnergyBurned: 'HKQuantityTypeIdentifierActiveEnergyBurned',
    distanceWalkingRunning: 'HKQuantityTypeIdentifierDistanceWalkingRunning',
    heartRateVariabilitySDNN: 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
    respiratoryRate: 'HKQuantityTypeIdentifierRespiratoryRate',
    basalEnergyBurned: 'HKQuantityTypeIdentifierBasalEnergyBurned',
    bodyMass: 'HKQuantityTypeIdentifierBodyMass',
    vo2Max: 'HKQuantityTypeIdentifierVO2Max',
  },
  category: {
    sleepAnalysis: 'HKCategoryTypeIdentifierSleepAnalysis',
    mindfulSession: 'HKCategoryTypeIdentifierMindfulSession',
  },
} as const;

// HealthKit types mapping
export enum HealthDataType {
  // Physical Pillar
  STEP_COUNT = 'stepCount',
  ACTIVE_ENERGY = 'activeEnergy',
  DISTANCE_WALKING_RUNNING = 'distanceWalkingRunning',
  WORKOUT = 'workout',
  
  // Emotional Pillar
  HEART_RATE_VARIABILITY = 'heartRateVariability',
  HEART_RATE = 'heartRate',
  MINDFUL_MINUTES = 'mindfulMinutes',
  
  // Mental Pillar
  SLEEP_ANALYSIS = 'sleepAnalysis',
  RESPIRATORY_RATE = 'respiratoryRate',
  
  // Energy Pillar
  RESTING_ENERGY = 'restingEnergy',
  BODY_MASS = 'bodyMass',
  VO2_MAX = 'vo2Max',
}

// Health data sample interface
export interface HealthDataSample {
  value: number;
  unit: string;
  startDate: Date;
  endDate?: Date;
  source?: string;
  metadata?: Record<string, any>;
}

// Permission status
export interface PermissionStatus {
  granted: boolean;
  denied: boolean;
  unavailable: boolean;
}

// HealthKit library imports
let HealthKitModule: any = null;
let isInitialized = false;

// Initialize HealthKit (only on iOS)
const initHealthKit = async () => {
  if (Platform.OS !== 'ios') {
    console.warn('HealthKit is only available on iOS');
    return false;
  }

  // Check if we're running in Expo Go (native modules don't work there)
  const isExpoGo = Constants.executionEnvironment === 'storeClient';
  if (isExpoGo) {
    console.warn('HealthKit: Native modules are not available in Expo Go. Please use a development build to test HealthKit features.');
    return false;
  }

  if (isInitialized && HealthKitModule) {
    return true;
  }

  try {
    // Import the HealthKit library
    // Use a safer require pattern that handles errors gracefully
    let healthKitModule;
    try {
      if (typeof require !== 'undefined') {
        healthKitModule = require('@kingstinct/react-native-healthkit');
        console.log('HealthKit module loaded:', Object.keys(healthKitModule));
      } else {
        console.warn('HealthKit: require not available');
        return false;
      }
    } catch (requireError: any) {
      // This catches both regular errors and invariant violations
      const errorMsg = requireError?.message || String(requireError);
      if (errorMsg.includes('native module') || errorMsg.includes('Invariant Violation')) {
        console.warn('HealthKit: Native module not available. Make sure you are using a development build (not Expo Go) to test HealthKit.');
      } else {
        console.warn('HealthKit library not available:', errorMsg);
      }
      return false;
    }
    
    if (!healthKitModule) {
      console.warn('HealthKit module is null or undefined');
      return false;
    }

    // Library may export default (Healthkit object) or be the object itself
    HealthKitModule = healthKitModule?.default ?? healthKitModule;
    isInitialized = true;

    console.log('HealthKit module initialized successfully');
    console.log('Available methods:', Object.keys(HealthKitModule || {}));
    return true;
  } catch (error) {
    console.error('Failed to load HealthKit module:', error);
    return false;
  }
};

/**
 * Check if HealthKit is available on this device
 * Note: HealthKit does NOT work on simulators - only physical devices
 */
export async function isHealthKitAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    console.log('HealthKit: Not iOS platform');
    return false;
  }

  const initialized = await initHealthKit();
  if (!initialized || !HealthKitModule) {
    console.warn('HealthKit module failed to initialize');
    return false;
  }

  try {
    // @kingstinct/react-native-healthkit exposes isHealthDataAvailable on default export
    const checkMethod =
      HealthKitModule?.isHealthDataAvailable ?? HealthKitModule?.isAvailable;

    if (!checkMethod || typeof checkMethod !== 'function') {
      console.error('HealthKit availability check method not found');
      console.log('Available methods:', Object.keys(HealthKitModule || {}));
      return false;
    }

    const available = await checkMethod();
    console.log('HealthKit availability check returned:', available);
    return available === true;
  } catch (error) {
    console.error('Error checking HealthKit availability:', error);
    return false;
  }
}

/**
 * Request HealthKit permissions for all required data types
 */
export async function requestHealthKitPermissions(): Promise<PermissionStatus> {
  if (Platform.OS !== 'ios') {
    return { granted: false, denied: false, unavailable: true };
  }

  const initialized = await initHealthKit();
  if (!initialized || !HealthKitModule) {
    console.error('HealthKit module not initialized');
    return { granted: false, denied: false, unavailable: true };
  }

  try {
    const requestAuth = HealthKitModule.requestAuthorization;
    
    if (!requestAuth || typeof requestAuth !== 'function') {
      console.error('HealthKit.requestAuthorization method not found');
      console.log('Available methods:', Object.keys(HealthKitModule));
      return { granted: false, denied: false, unavailable: true };
    }

    // Library expects (read: array of type ids, write?: array of type ids)
    const readTypes: string[] = [
      HK.quantity.stepCount,
      HK.quantity.activeEnergyBurned,
      HK.quantity.distanceWalkingRunning,
      HK.quantity.heartRate,
      HK.quantity.heartRateVariabilitySDNN,
      HK.quantity.respiratoryRate,
      HK.quantity.basalEnergyBurned,
      HK.quantity.bodyMass,
      HK.quantity.vo2Max,
      HK.category.sleepAnalysis,
      HK.category.mindfulSession,
      'HKWorkoutTypeIdentifier',
    ];

    const writeTypes: string[] = []; // Read-only for now

    console.log('Requesting HealthKit permissions...');
    const result = await requestAuth(readTypes, writeTypes);
    console.log('HealthKit permission result:', result);
    // Library returns boolean (true = user completed the sheet; does not mean all granted)
    if (typeof result === 'object' && result !== null) {
      const isAuthorized = result.status === 'authorized' || result.authorized === true;
      const isDenied = result.status === 'denied' || result.denied === true;
      
      return {
        granted: isAuthorized,
        denied: isDenied,
        unavailable: false,
      };
    }
    
    return {
      granted: result === 'authorized' || result === true,
      denied: result === 'denied' || result === false,
      unavailable: false,
    };
  } catch (error) {
    console.error('Error requesting HealthKit permissions:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return { granted: false, denied: true, unavailable: false };
  }
}

/**
 * Get step count for a date range
 */
export async function getStepCount(
  startDate: Date,
  endDate: Date = new Date()
): Promise<HealthDataSample[]> {
  if (!HealthKitModule) {
    await initHealthKit();
  }

  if (!HealthKitModule) {
    return [];
  }

  try {
    const { samples } = await HealthKitModule.queryQuantitySamples(
      HK.quantity.stepCount,
      { from: startDate, to: endDate, unit: 'count' }
    );

    return samples.map((sample: any) => ({
      value: sample.quantity ?? 0,
      unit: 'count',
      startDate: sample.startDate,
      endDate: sample.endDate,
      source: sample.sourceRevision?.source?.name ?? 'Apple Health',
      metadata: { device: sample.device },
    }));
  } catch (error) {
    console.error('Error fetching step count:', error);
    return [];
  }
}

/**
 * Get heart rate data for a date range
 */
export async function getHeartRate(
  startDate: Date,
  endDate: Date = new Date()
): Promise<HealthDataSample[]> {
  if (!HealthKitModule) {
    await initHealthKit();
  }

  if (!HealthKitModule) {
    return [];
  }

  try {
    const { samples } = await HealthKitModule.queryQuantitySamples(
      HK.quantity.heartRate,
      { from: startDate, to: endDate, unit: 'count/min' }
    );

    return samples.map((sample: any) => ({
      value: sample.quantity ?? 0,
      unit: 'bpm',
      startDate: sample.startDate,
      endDate: sample.endDate,
      source: sample.sourceRevision?.source?.name ?? 'Apple Health',
      metadata: { device: sample.device },
    }));
  } catch (error) {
    console.error('Error fetching heart rate:', error);
    return [];
  }
}

/**
 * Get active energy burned for a date range
 */
export async function getActiveEnergy(
  startDate: Date,
  endDate: Date = new Date()
): Promise<HealthDataSample[]> {
  if (!HealthKitModule) {
    await initHealthKit();
  }

  if (!HealthKitModule) {
    return [];
  }

  try {
    const { samples } = await HealthKitModule.queryQuantitySamples(
      HK.quantity.activeEnergyBurned,
      { from: startDate, to: endDate, unit: 'kcal' }
    );

    return samples.map((sample: any) => ({
      value: sample.quantity ?? 0,
      unit: 'kcal',
      startDate: sample.startDate,
      endDate: sample.endDate,
      source: sample.sourceRevision?.source?.name ?? 'Apple Health',
      metadata: { device: sample.device },
    }));
  } catch (error) {
    console.error('Error fetching active energy:', error);
    return [];
  }
}

/**
 * Get sleep analysis data for a date range
 */
export async function getSleepAnalysis(
  startDate: Date,
  endDate: Date = new Date()
): Promise<HealthDataSample[]> {
  if (!HealthKitModule) {
    await initHealthKit();
  }

  if (!HealthKitModule) {
    return [];
  }

  try {
    const { samples } = await HealthKitModule.queryCategorySamples(
      HK.category.sleepAnalysis,
      { from: startDate, to: endDate }
    );

    return samples.map((sample: any) => {
      const start = sample.startDate;
      const end = sample.endDate;
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      return {
        value: hours,
        unit: 'hour',
        startDate: start,
        endDate: end,
        source: sample.sourceRevision?.source?.name ?? 'Apple Health',
        metadata: { value: sample.value, device: sample.device },
      };
    });
  } catch (error) {
    console.error('Error fetching sleep analysis:', error);
    return [];
  }
}

/**
 * Get distance walking/running for a date range
 */
export async function getDistanceWalkingRunning(
  startDate: Date,
  endDate: Date = new Date()
): Promise<HealthDataSample[]> {
  if (!HealthKitModule) {
    await initHealthKit();
  }

  if (!HealthKitModule) {
    return [];
  }

  try {
    const { samples } = await HealthKitModule.queryQuantitySamples(
      HK.quantity.distanceWalkingRunning,
      { from: startDate, to: endDate, unit: 'm' }
    );

    return samples.map((sample: any) => ({
      value: sample.quantity ?? 0,
      unit: 'meter',
      startDate: sample.startDate,
      endDate: sample.endDate,
      source: sample.sourceRevision?.source?.name ?? 'Apple Health',
      metadata: { device: sample.device },
    }));
  } catch (error) {
    console.error('Error fetching distance walking/running:', error);
    return [];
  }
}

/**
 * Get workouts for a date range
 */
export async function getWorkouts(
  startDate: Date,
  endDate: Date = new Date()
): Promise<HealthDataSample[]> {
  if (!HealthKitModule) {
    await initHealthKit();
  }

  if (!HealthKitModule) {
    return [];
  }

  try {
    const workouts = await HealthKitModule.queryWorkouts({
      from: startDate,
      to: endDate,
    });

    return workouts.map((workout: any) => {
      const start = workout.startDate;
      const end = workout.endDate;
      const duration = (end.getTime() - start.getTime()) / (1000 * 60); // minutes

      return {
        value: duration,
        unit: 'minute',
        startDate: start,
        endDate: end,
        source: workout.sourceRevision?.source?.name ?? 'Apple Health',
        metadata: {
          workoutType: workout.workoutActivityType,
          totalEnergyBurned: workout.totalEnergyBurned,
          totalDistance: workout.totalDistance,
          device: workout.device,
        },
      };
    });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
}

/**
 * Get heart rate variability for a date range
 */
export async function getHeartRateVariability(
  startDate: Date,
  endDate: Date = new Date()
): Promise<HealthDataSample[]> {
  if (!HealthKitModule) {
    await initHealthKit();
  }

  if (!HealthKitModule) {
    return [];
  }

  try {
    const { samples } = await HealthKitModule.queryQuantitySamples(
      HK.quantity.heartRateVariabilitySDNN,
      { from: startDate, to: endDate, unit: 'ms' }
    );

    return samples.map((sample: any) => ({
      value: sample.quantity ?? 0,
      unit: 'ms',
      startDate: sample.startDate,
      endDate: sample.endDate,
      source: sample.sourceRevision?.source?.name ?? 'Apple Health',
      metadata: { device: sample.device },
    }));
  } catch (error) {
    console.error('Error fetching heart rate variability:', error);
    return [];
  }
}

/**
 * Get mindful minutes for a date range
 */
export async function getMindfulMinutes(
  startDate: Date,
  endDate: Date = new Date()
): Promise<HealthDataSample[]> {
  if (!HealthKitModule) {
    await initHealthKit();
  }

  if (!HealthKitModule) {
    return [];
  }

  try {
    const { samples } = await HealthKitModule.queryCategorySamples(
      HK.category.mindfulSession,
      { from: startDate, to: endDate }
    );

    return samples.map((sample: any) => {
      const start = sample.startDate;
      const end = sample.endDate;
      const minutes = (end.getTime() - start.getTime()) / (1000 * 60);

      return {
        value: minutes,
        unit: 'minute',
        startDate: start,
        endDate: end,
        source: sample.sourceRevision?.source?.name ?? 'Apple Health',
        metadata: { device: sample.device },
      };
    });
  } catch (error) {
    console.error('Error fetching mindful minutes:', error);
    return [];
  }
}

/**
 * Get respiratory rate for a date range
 */
export async function getRespiratoryRate(
  startDate: Date,
  endDate: Date = new Date()
): Promise<HealthDataSample[]> {
  if (!HealthKitModule) {
    await initHealthKit();
  }

  if (!HealthKitModule) {
    return [];
  }

  try {
    const { samples } = await HealthKitModule.queryQuantitySamples(
      HK.quantity.respiratoryRate,
      { from: startDate, to: endDate, unit: 'count/min' }
    );

    return samples.map((sample: any) => ({
      value: sample.quantity ?? 0,
      unit: 'count/min',
      startDate: sample.startDate,
      endDate: sample.endDate,
      source: sample.sourceRevision?.source?.name ?? 'Apple Health',
      metadata: { device: sample.device },
    }));
  } catch (error) {
    console.error('Error fetching respiratory rate:', error);
    return [];
  }
}

/**
 * Get resting energy for a date range
 */
export async function getRestingEnergy(
  startDate: Date,
  endDate: Date = new Date()
): Promise<HealthDataSample[]> {
  if (!HealthKitModule) {
    await initHealthKit();
  }

  if (!HealthKitModule) {
    return [];
  }

  try {
    const { samples } = await HealthKitModule.queryQuantitySamples(
      HK.quantity.basalEnergyBurned,
      { from: startDate, to: endDate, unit: 'kcal' }
    );

    return samples.map((sample: any) => ({
      value: sample.quantity ?? 0,
      unit: 'kcal',
      startDate: sample.startDate,
      endDate: sample.endDate,
      source: sample.sourceRevision?.source?.name ?? 'Apple Health',
      metadata: { device: sample.device },
    }));
  } catch (error) {
    console.error('Error fetching resting energy:', error);
    return [];
  }
}

/**
 * Get body mass for a date range
 */
export async function getBodyMass(
  startDate: Date,
  endDate: Date = new Date()
): Promise<HealthDataSample[]> {
  if (!HealthKitModule) {
    await initHealthKit();
  }

  if (!HealthKitModule) {
    return [];
  }

  try {
    const { samples } = await HealthKitModule.queryQuantitySamples(
      HK.quantity.bodyMass,
      { from: startDate, to: endDate, unit: 'kg' }
    );

    return samples.map((sample: any) => ({
      value: sample.quantity ?? 0,
      unit: 'kg',
      startDate: sample.startDate,
      endDate: sample.endDate,
      source: sample.sourceRevision?.source?.name ?? 'Apple Health',
      metadata: { device: sample.device },
    }));
  } catch (error) {
    console.error('Error fetching body mass:', error);
    return [];
  }
}

/**
 * Get VO2 Max for a date range (if available)
 */
export async function getVO2Max(
  startDate: Date,
  endDate: Date = new Date()
): Promise<HealthDataSample[]> {
  if (!HealthKitModule) {
    await initHealthKit();
  }

  if (!HealthKitModule) {
    return [];
  }

  try {
    const { samples } = await HealthKitModule.queryQuantitySamples(
      HK.quantity.vo2Max,
      { from: startDate, to: endDate, unit: 'ml/(kg*min)' }
    );

    return samples.map((sample: any) => ({
      value: sample.quantity ?? 0,
      unit: 'ml/kg·min',
      startDate: sample.startDate,
      endDate: sample.endDate,
      source: sample.sourceRevision?.source?.name ?? 'Apple Health',
      metadata: { device: sample.device },
    }));
  } catch (error) {
    console.error('Error fetching VO2 Max:', error);
    return [];
  }
}

/**
 * Get all health data for a date range (batch fetch)
 * Returns data organized by pillar
 */
export async function getAllHealthData(
  startDate: Date,
  endDate: Date = new Date()
): Promise<{
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
}> {
  // Fetch all data in parallel
  const [
    steps,
    activeEnergy,
    distance,
    workouts,
    heartRate,
    heartRateVariability,
    mindfulMinutes,
    sleep,
    respiratoryRate,
    restingEnergy,
    bodyMass,
    vo2Max,
  ] = await Promise.all([
    getStepCount(startDate, endDate),
    getActiveEnergy(startDate, endDate),
    getDistanceWalkingRunning(startDate, endDate),
    getWorkouts(startDate, endDate),
    getHeartRate(startDate, endDate),
    getHeartRateVariability(startDate, endDate),
    getMindfulMinutes(startDate, endDate),
    getSleepAnalysis(startDate, endDate),
    getRespiratoryRate(startDate, endDate),
    getRestingEnergy(startDate, endDate),
    getBodyMass(startDate, endDate),
    getVO2Max(startDate, endDate),
  ]);

  return {
    physical: {
      steps,
      activeEnergy,
      distance,
      workouts,
    },
    emotional: {
      heartRate,
      heartRateVariability,
      mindfulMinutes,
    },
    mental: {
      sleep,
      respiratoryRate,
    },
    energy: {
      restingEnergy,
      bodyMass,
      vo2Max,
    },
  };
}

