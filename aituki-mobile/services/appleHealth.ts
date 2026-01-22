/**
 * Apple Health Service
 * Integrates with HealthKit to read health data for the 4 pillars
 * Physical, Emotional, Mental, Energy
 */

import { Platform } from 'react-native';

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

// HealthKit wrapper (will be implemented with actual library)
let HealthKit: any = null;

// Initialize HealthKit (only on iOS)
// Note: Made optional to prevent build failures if library has issues
const initHealthKit = async () => {
  if (Platform.OS !== 'ios') {
    console.warn('HealthKit is only available on iOS');
    return false;
  }

  try {
    // Dynamic import for HealthKit library
    // Using try-catch to gracefully handle if library isn't properly installed
    // TEMPORARY: Commented out due to Swift compilation error in library
    // TODO: Fix or replace @kingstinct/react-native-healthkit library
    let healthKitModule;
    try {
      // @ts-ignore - Library may have build issues
      healthKitModule = require('@kingstinct/react-native-healthkit');
    } catch (requireError: any) {
      console.warn('HealthKit library not available (may not be installed or has build issues):', requireError?.message || requireError);
      return false;
    }
    
    if (!healthKitModule) {
      console.warn('HealthKit module is null or undefined');
      return false;
    }
    
    // The library exports as a default export or named exports
    HealthKit = healthKitModule.default || healthKitModule.HealthKit || healthKitModule;
    
    if (!HealthKit) {
      console.warn('HealthKit module loaded but no valid export found');
      return false;
    }
    
    // Check if required methods exist
    if (typeof HealthKit.isAvailable !== 'function' && typeof HealthKit.requestAuthorization !== 'function') {
      console.warn('HealthKit module loaded but required methods not found');
      return false;
    }
    
    console.log('HealthKit module initialized successfully');
    return true;
  } catch (error) {
    console.warn('Failed to load HealthKit module (non-fatal, app will continue without HealthKit):', error);
    // Return false instead of throwing - allows app to continue working
    return false;
  }
};

/**
 * Check if HealthKit is available on this device
 * Note: HealthKit does NOT work on simulators - only physical devices
 */
export async function isHealthKitAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return false;
  }

  // Check if running on simulator
  // HealthKit is not available on simulators
  if (Platform.isPad === false && Platform.isTVOS === false) {
    // This is a basic check, but we should also check the actual device type
    // For now, we'll rely on the library's isAvailable() check
  }

  if (!HealthKit) {
    const initialized = await initHealthKit();
    if (!initialized) {
      console.warn('HealthKit module failed to initialize - may be missing or not properly configured');
      return false;
    }
  }

  if (!HealthKit) {
    return false;
  }

  try {
    // Check if the method exists
    if (typeof HealthKit.isAvailable !== 'function') {
      console.error('HealthKit.isAvailable is not a function');
      console.log('Available HealthKit methods:', Object.keys(HealthKit));
      return false;
    }
    
    const available = await HealthKit.isAvailable();
    console.log('HealthKit.isAvailable() returned:', available);
    return available;
  } catch (error) {
    console.error('Error checking HealthKit availability:', error);
    // If error occurs, it might be because we're on a simulator
    // HealthKit always returns false on simulators
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

  if (!HealthKit) {
    const initialized = await initHealthKit();
    if (!initialized) {
      return { granted: false, denied: false, unavailable: true };
    }
  }

  try {
    // Check if the method exists
    if (!HealthKit.requestAuthorization) {
      console.error('HealthKit.requestAuthorization method not found');
      console.log('Available HealthKit methods:', Object.keys(HealthKit));
      return { granted: false, denied: false, unavailable: true };
    }

    // Define permissions for all data types we need
    // Note: @kingstinct/react-native-healthkit uses different permission format
    const permissions = {
      read: [
        'StepCount',
        'ActiveEnergyBurned',
        'DistanceWalkingRunning',
        'HeartRate',
        'HeartRateVariabilitySDNN',
        'SleepAnalysis',
        'RespiratoryRate',
        'BasalEnergyBurned',
        'BodyMass',
        'VO2Max',
        'MindfulSession',
        'Workout',
      ],
      write: [], // We're only reading data for now
    };

    console.log('Requesting HealthKit permissions with:', permissions);
    const result = await HealthKit.requestAuthorization(permissions);
    console.log('HealthKit permission result:', result);
    
    // Handle different response formats
    if (typeof result === 'object' && result !== null) {
      return {
        granted: result.status === 'authorized' || result.authorized === true,
        denied: result.status === 'denied' || result.denied === true,
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
  if (!HealthKit) {
    await initHealthKit();
  }

  if (!HealthKit) {
    return [];
  }

  try {
    const samples = await HealthKit.getQuantitySamples({
      type: 'StepCount',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      unit: 'count',
    });

    return samples.map((sample: any) => ({
      value: sample.quantity || sample.value || 0,
      unit: 'count',
      startDate: new Date(sample.startDate),
      endDate: sample.endDate ? new Date(sample.endDate) : undefined,
      source: sample.sourceName || 'Apple Health',
      metadata: {
        device: sample.device,
      },
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
  if (!HealthKit) {
    await initHealthKit();
  }

  if (!HealthKit) {
    return [];
  }

  try {
    const samples = await HealthKit.getQuantitySamples({
      type: 'HeartRate',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      unit: 'bpm',
    });

    return samples.map((sample: any) => ({
      value: sample.quantity || sample.value || 0,
      unit: 'bpm',
      startDate: new Date(sample.startDate),
      endDate: sample.endDate ? new Date(sample.endDate) : undefined,
      source: sample.sourceName || 'Apple Health',
      metadata: {
        device: sample.device,
      },
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
  if (!HealthKit) {
    await initHealthKit();
  }

  if (!HealthKit) {
    return [];
  }

  try {
    const samples = await HealthKit.getQuantitySamples({
      type: 'ActiveEnergyBurned',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      unit: 'kcal',
    });

    return samples.map((sample: any) => ({
      value: sample.quantity || sample.value || 0,
      unit: 'kcal',
      startDate: new Date(sample.startDate),
      endDate: sample.endDate ? new Date(sample.endDate) : undefined,
      source: sample.sourceName || 'Apple Health',
      metadata: {
        device: sample.device,
      },
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
  if (!HealthKit) {
    await initHealthKit();
  }

  if (!HealthKit) {
    return [];
  }

  try {
    const samples = await HealthKit.getCategorySamples({
      type: 'SleepAnalysis',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    return samples.map((sample: any) => {
      const start = new Date(sample.startDate);
      const end = new Date(sample.endDate);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      return {
        value: hours,
        unit: 'hour',
        startDate: start,
        endDate: end,
        source: sample.sourceName || 'Apple Health',
        metadata: {
          value: sample.value, // Sleep type (asleep, inBed, etc.)
          device: sample.device,
        },
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
  if (!HealthKit) {
    await initHealthKit();
  }

  if (!HealthKit) {
    return [];
  }

  try {
    const samples = await HealthKit.getQuantitySamples({
      type: 'DistanceWalkingRunning',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      unit: 'meter',
    });

    return samples.map((sample: any) => ({
      value: sample.quantity || sample.value || 0,
      unit: 'meter',
      startDate: new Date(sample.startDate),
      endDate: sample.endDate ? new Date(sample.endDate) : undefined,
      source: sample.sourceName || 'Apple Health',
      metadata: {
        device: sample.device,
      },
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
  if (!HealthKit) {
    await initHealthKit();
  }

  if (!HealthKit) {
    return [];
  }

  try {
    const workouts = await HealthKit.getWorkouts({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    return workouts.map((workout: any) => {
      const start = new Date(workout.startDate);
      const end = new Date(workout.endDate);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60); // minutes

      return {
        value: duration,
        unit: 'minute',
        startDate: start,
        endDate: end,
        source: workout.sourceName || 'Apple Health',
        metadata: {
          workoutType: workout.workoutType,
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
  if (!HealthKit) {
    await initHealthKit();
  }

  if (!HealthKit) {
    return [];
  }

  try {
    const samples = await HealthKit.getQuantitySamples({
      type: 'HeartRateVariabilitySDNN',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      unit: 'ms',
    });

    return samples.map((sample: any) => ({
      value: sample.quantity || sample.value || 0,
      unit: 'ms',
      startDate: new Date(sample.startDate),
      endDate: sample.endDate ? new Date(sample.endDate) : undefined,
      source: sample.sourceName || 'Apple Health',
      metadata: {
        device: sample.device,
      },
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
  if (!HealthKit) {
    await initHealthKit();
  }

  if (!HealthKit) {
    return [];
  }

  try {
    const samples = await HealthKit.getCategorySamples({
      type: 'MindfulSession',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    return samples.map((sample: any) => {
      const start = new Date(sample.startDate);
      const end = new Date(sample.endDate);
      const minutes = (end.getTime() - start.getTime()) / (1000 * 60);

      return {
        value: minutes,
        unit: 'minute',
        startDate: start,
        endDate: end,
        source: sample.sourceName || 'Apple Health',
        metadata: {
          device: sample.device,
        },
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
  if (!HealthKit) {
    await initHealthKit();
  }

  if (!HealthKit) {
    return [];
  }

  try {
    const samples = await HealthKit.getQuantitySamples({
      type: 'RespiratoryRate',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      unit: 'count/min',
    });

    return samples.map((sample: any) => ({
      value: sample.quantity || sample.value || 0,
      unit: 'count/min',
      startDate: new Date(sample.startDate),
      endDate: sample.endDate ? new Date(sample.endDate) : undefined,
      source: sample.sourceName || 'Apple Health',
      metadata: {
        device: sample.device,
      },
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
  if (!HealthKit) {
    await initHealthKit();
  }

  if (!HealthKit) {
    return [];
  }

  try {
    const samples = await HealthKit.getQuantitySamples({
      type: 'BasalEnergyBurned',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      unit: 'kcal',
    });

    return samples.map((sample: any) => ({
      value: sample.quantity || sample.value || 0,
      unit: 'kcal',
      startDate: new Date(sample.startDate),
      endDate: sample.endDate ? new Date(sample.endDate) : undefined,
      source: sample.sourceName || 'Apple Health',
      metadata: {
        device: sample.device,
      },
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
  if (!HealthKit) {
    await initHealthKit();
  }

  if (!HealthKit) {
    return [];
  }

  try {
    const samples = await HealthKit.getQuantitySamples({
      type: 'BodyMass',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      unit: 'kg',
    });

    return samples.map((sample: any) => ({
      value: sample.quantity || sample.value || 0,
      unit: 'kg',
      startDate: new Date(sample.startDate),
      endDate: sample.endDate ? new Date(sample.endDate) : undefined,
      source: sample.sourceName || 'Apple Health',
      metadata: {
        device: sample.device,
      },
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
  if (!HealthKit) {
    await initHealthKit();
  }

  if (!HealthKit) {
    return [];
  }

  try {
    const samples = await HealthKit.getQuantitySamples({
      type: 'VO2Max',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      unit: 'ml/kg·min',
    });

    return samples.map((sample: any) => ({
      value: sample.quantity || sample.value || 0,
      unit: 'ml/kg·min',
      startDate: new Date(sample.startDate),
      endDate: sample.endDate ? new Date(sample.endDate) : undefined,
      source: sample.sourceName || 'Apple Health',
      metadata: {
        device: sample.device,
      },
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

