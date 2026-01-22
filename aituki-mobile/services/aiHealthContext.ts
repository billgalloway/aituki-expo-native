/**
 * AI Health Context Service
 * Aggregates health data into structured context for AI consumption
 * Generates summaries, trends, and insights by pillar
 */

import { supabase } from './supabase';
import { fetchUserProfile, UserProfile } from './userProfile';

// Health context structure for AI
export interface HealthContext {
  profile: {
    name: string;
    email: string;
    age?: number;
  };
  healthSummary: {
    physical: PhysicalSummary;
    emotional: EmotionalSummary;
    mental: MentalSummary;
    energy: EnergySummary;
  };
  recentActivity: RecentActivity[];
  insights: Insight[];
  lastUpdated: Date;
}

interface PhysicalSummary {
  steps: {
    today: number;
    weekAverage: number;
    trend: 'up' | 'down' | 'stable';
  };
  activeEnergy: {
    today: number;
    weekAverage: number;
    trend: 'up' | 'down' | 'stable';
  };
  workouts: {
    count: number;
    totalDuration: number; // minutes
    types: string[];
  };
  distance: {
    today: number; // meters
    weekAverage: number;
  };
}

interface EmotionalSummary {
  heartRate: {
    average: number;
    resting: number;
    max: number;
    trend: 'up' | 'down' | 'stable';
  };
  heartRateVariability: {
    average: number;
    trend: 'up' | 'down' | 'stable';
  };
  mindfulMinutes: {
    today: number;
    weekTotal: number;
  };
}

interface MentalSummary {
  sleep: {
    lastNight: number; // hours
    weekAverage: number;
    quality: 'good' | 'fair' | 'poor';
    trend: 'up' | 'down' | 'stable';
  };
  respiratoryRate: {
    average: number;
    trend: 'up' | 'down' | 'stable';
  };
}

interface EnergySummary {
  restingEnergy: {
    today: number; // kcal
    weekAverage: number;
  };
  bodyMass: {
    current: number; // kg
    trend: 'up' | 'down' | 'stable';
  };
  vo2Max: {
    current: number | null;
    trend: 'up' | 'down' | 'stable' | 'unknown';
  };
}

interface RecentActivity {
  type: string;
  description: string;
  date: Date;
  value: number;
  unit: string;
}

interface Insight {
  pillar: 'physical' | 'emotional' | 'mental' | 'energy';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Calculate trend from data points
 */
function calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable';
  
  const recent = values.slice(-3);
  const older = values.slice(0, -3);
  
  if (older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  
  const change = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (change > 5) return 'up';
  if (change < -5) return 'down';
  return 'stable';
}

/**
 * Get health data from Supabase for a date range
 */
async function getHealthDataFromSupabase(
  userId: string,
  dataType: string,
  startDate: Date,
  endDate: Date
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', userId)
      .eq('data_type', dataType)
      .eq('source', 'apple_health')
      .gte('start_date', startDate.toISOString())
      .lte('start_date', endDate.toISOString())
      .order('start_date', { ascending: true });

    if (error) {
      console.error(`Error fetching ${dataType}:`, error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(`Exception fetching ${dataType}:`, error);
    return [];
  }
}

/**
 * Get aggregated daily values for a data type
 */
async function getDailyAggregates(
  userId: string,
  dataType: string,
  days: number = 7
): Promise<number[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const data = await getHealthDataFromSupabase(userId, dataType, startDate, endDate);

  // Group by day and sum values
  const dailyTotals: Record<string, number> = {};
  
  data.forEach((record: any) => {
    const date = new Date(record.start_date).toISOString().split('T')[0];
    dailyTotals[date] = (dailyTotals[date] || 0) + parseFloat(record.value);
  });

  // Return array of daily totals
  const result: number[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    result.unshift(dailyTotals[dateStr] || 0);
  }

  return result;
}

/**
 * Generate health context for AI
 */
export async function generateHealthContext(
  userId?: string,
  days: number = 7
): Promise<HealthContext | null> {
  try {
    // Get current user if userId not provided
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      console.warn('No user ID available for generating health context');
      return null;
    }

    // Fetch user profile
    const profile = await fetchUserProfile(targetUserId);
    if (!profile) {
      console.warn('No profile found for user');
      return null;
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch all health data types in parallel
    const [
      stepsData,
      activeEnergyData,
      distanceData,
      workoutData,
      heartRateData,
      hrvData,
      mindfulData,
      sleepData,
      respiratoryData,
      restingEnergyData,
      bodyMassData,
      vo2MaxData,
    ] = await Promise.all([
      getDailyAggregates(targetUserId, 'stepCount', days),
      getDailyAggregates(targetUserId, 'activeEnergy', days),
      getDailyAggregates(targetUserId, 'distanceWalkingRunning', days),
      getHealthDataFromSupabase(targetUserId, 'workout', startDate, endDate),
      getHealthDataFromSupabase(targetUserId, 'heartRate', startDate, endDate),
      getHealthDataFromSupabase(targetUserId, 'heartRateVariability', startDate, endDate),
      getDailyAggregates(targetUserId, 'mindfulMinutes', days),
      getHealthDataFromSupabase(targetUserId, 'sleepAnalysis', startDate, endDate),
      getHealthDataFromSupabase(targetUserId, 'respiratoryRate', startDate, endDate),
      getDailyAggregates(targetUserId, 'restingEnergy', days),
      getHealthDataFromSupabase(targetUserId, 'bodyMass', startDate, endDate),
      getHealthDataFromSupabase(targetUserId, 'vo2Max', startDate, endDate),
    ]);

    // Calculate physical summary
    const todaySteps = stepsData[stepsData.length - 1] || 0;
    const weekAvgSteps = stepsData.reduce((a, b) => a + b, 0) / stepsData.length;
    const todayEnergy = activeEnergyData[activeEnergyData.length - 1] || 0;
    const weekAvgEnergy = activeEnergyData.reduce((a, b) => a + b, 0) / activeEnergyData.length;
    const todayDistance = distanceData[distanceData.length - 1] || 0;
    const weekAvgDistance = distanceData.reduce((a, b) => a + b, 0) / distanceData.length;

    const workouts = workoutData || [];
    const workoutTypes = [...new Set(workouts.map((w: any) => w.metadata?.workoutType || 'unknown'))];
    const totalWorkoutDuration = workouts.reduce((sum: number, w: any) => {
      const start = new Date(w.start_date);
      const end = w.end_date ? new Date(w.end_date) : new Date();
      return sum + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);

    // Calculate emotional summary
    const heartRates = heartRateData.map((r: any) => parseFloat(r.value));
    const avgHeartRate = heartRates.length > 0
      ? heartRates.reduce((a, b) => a + b, 0) / heartRates.length
      : 0;
    const restingHeartRate = heartRates.length > 0 ? Math.min(...heartRates) : 0;
    const maxHeartRate = heartRates.length > 0 ? Math.max(...heartRates) : 0;

    const hrvValues = hrvData.map((r: any) => parseFloat(r.value));
    const avgHRV = hrvValues.length > 0
      ? hrvValues.reduce((a, b) => a + b, 0) / hrvValues.length
      : 0;

    const todayMindful = mindfulData[mindfulData.length - 1] || 0;
    const weekTotalMindful = mindfulData.reduce((a, b) => a + b, 0);

    // Calculate mental summary
    const sleepRecords = sleepData || [];
    const lastNightSleep = sleepRecords.length > 0
      ? sleepRecords
          .filter((s: any) => {
            const sleepDate = new Date(s.start_date);
            return sleepDate.toDateString() === new Date().toDateString() ||
                   sleepDate.toDateString() === new Date(Date.now() - 86400000).toDateString();
          })
          .reduce((sum: number, s: any) => {
            const start = new Date(s.start_date);
            const end = s.end_date ? new Date(s.end_date) : new Date();
            return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          }, 0)
      : 0;

    const weekSleepHours = sleepRecords.reduce((sum: number, s: any) => {
      const start = new Date(s.start_date);
      const end = s.end_date ? new Date(s.end_date) : new Date();
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0) / Math.max(days, 1);

    const sleepQuality = lastNightSleep >= 7 ? 'good' : lastNightSleep >= 5 ? 'fair' : 'poor';

    const respiratoryValues = respiratoryData.map((r: any) => parseFloat(r.value));
    const avgRespiratory = respiratoryValues.length > 0
      ? respiratoryValues.reduce((a, b) => a + b, 0) / respiratoryValues.length
      : 0;

    // Calculate energy summary
    const todayRestingEnergy = restingEnergyData[restingEnergyData.length - 1] || 0;
    const weekAvgRestingEnergy = restingEnergyData.reduce((a, b) => a + b, 0) / restingEnergyData.length;

    const bodyMassRecords = bodyMassData || [];
    const currentBodyMass = bodyMassRecords.length > 0
      ? parseFloat(bodyMassRecords[bodyMassRecords.length - 1].value)
      : 0;
    const bodyMassValues = bodyMassRecords.map((r: any) => parseFloat(r.value));
    const bodyMassTrend = calculateTrend(bodyMassValues);

    const vo2MaxRecords = vo2MaxData || [];
    const currentVO2Max = vo2MaxRecords.length > 0
      ? parseFloat(vo2MaxRecords[vo2MaxRecords.length - 1].value)
      : null;
    const vo2MaxValues = vo2MaxRecords.map((r: any) => parseFloat(r.value));
    const vo2MaxTrend = vo2MaxValues.length >= 2 ? calculateTrend(vo2MaxValues) : 'unknown';

    // Generate insights
    const insights: Insight[] = [];
    
    if (todaySteps < 5000) {
      insights.push({
        pillar: 'physical',
        message: 'Low step count today. Consider taking a walk.',
        priority: 'medium',
      });
    }
    
    if (lastNightSleep < 6) {
      insights.push({
        pillar: 'mental',
        message: 'Insufficient sleep last night. Aim for 7-9 hours.',
        priority: 'high',
      });
    }
    
    if (avgHeartRate > 100 && avgHeartRate < 60) {
      insights.push({
        pillar: 'emotional',
        message: 'Heart rate outside normal range. Consider consulting a healthcare provider.',
        priority: 'high',
      });
    }

    // Build context
    const context: HealthContext = {
      profile: {
        name: profile.first_name && profile.last_name
          ? `${profile.first_name} ${profile.last_name}`
          : profile.first_name || profile.email.split('@')[0],
        email: profile.email,
      },
      healthSummary: {
        physical: {
          steps: {
            today: todaySteps,
            weekAverage: weekAvgSteps,
            trend: calculateTrend(stepsData),
          },
          activeEnergy: {
            today: todayEnergy,
            weekAverage: weekAvgEnergy,
            trend: calculateTrend(activeEnergyData),
          },
          workouts: {
            count: workouts.length,
            totalDuration: totalWorkoutDuration,
            types: workoutTypes,
          },
          distance: {
            today: todayDistance,
            weekAverage: weekAvgDistance,
          },
        },
        emotional: {
          heartRate: {
            average: Math.round(avgHeartRate),
            resting: Math.round(restingHeartRate),
            max: Math.round(maxHeartRate),
            trend: calculateTrend(heartRates),
          },
          heartRateVariability: {
            average: Math.round(avgHRV),
            trend: calculateTrend(hrvValues),
          },
          mindfulMinutes: {
            today: todayMindful,
            weekTotal: weekTotalMindful,
          },
        },
        mental: {
          sleep: {
            lastNight: Math.round(lastNightSleep * 10) / 10,
            weekAverage: Math.round(weekSleepHours * 10) / 10,
            quality: sleepQuality,
            trend: 'stable', // Could calculate from sleep data
          },
          respiratoryRate: {
            average: Math.round(avgRespiratory * 10) / 10,
            trend: calculateTrend(respiratoryValues),
          },
        },
        energy: {
          restingEnergy: {
            today: Math.round(todayRestingEnergy),
            weekAverage: Math.round(weekAvgRestingEnergy),
          },
          bodyMass: {
            current: Math.round(currentBodyMass * 10) / 10,
            trend: bodyMassTrend,
          },
          vo2Max: {
            current: currentVO2Max ? Math.round(currentVO2Max * 10) / 10 : null,
            trend: vo2MaxTrend,
          },
        },
      },
      recentActivity: workouts.slice(-5).map((w: any) => ({
        type: 'workout',
        description: w.metadata?.workoutType || 'Workout',
        date: new Date(w.start_date),
        value: w.metadata?.totalDistance || 0,
        unit: 'meter',
      })),
      insights,
      lastUpdated: new Date(),
    };

    return context;
  } catch (error) {
    console.error('Error generating health context:', error);
    return null;
  }
}

/**
 * Format health context as a string for AI prompts
 */
export function formatHealthContextForAI(context: HealthContext): string {
  const { profile, healthSummary, insights, recentActivity } = context;

  let prompt = `User Health Profile:
Name: ${profile.name}
Email: ${profile.email}

Health Summary (Last 7 Days):

PHYSICAL PILLAR:
- Steps: ${healthSummary.physical.steps.today.toLocaleString()} today (avg: ${Math.round(healthSummary.physical.steps.weekAverage).toLocaleString()}/day, trend: ${healthSummary.physical.steps.trend})
- Active Energy: ${Math.round(healthSummary.physical.activeEnergy.today)} kcal today (avg: ${Math.round(healthSummary.physical.activeEnergy.weekAverage)} kcal/day, trend: ${healthSummary.physical.activeEnergy.trend})
- Workouts: ${healthSummary.physical.workouts.count} workouts, ${Math.round(healthSummary.physical.workouts.totalDuration)} minutes total
- Distance: ${Math.round(healthSummary.physical.distance.today / 1000)} km today (avg: ${Math.round(healthSummary.physical.distance.weekAverage / 1000)} km/day)

EMOTIONAL PILLAR:
- Heart Rate: Avg ${healthSummary.emotional.heartRate.average} bpm, Resting ${healthSummary.emotional.heartRate.resting} bpm, Max ${healthSummary.emotional.heartRate.max} bpm (trend: ${healthSummary.emotional.heartRate.trend})
- Heart Rate Variability: Avg ${healthSummary.emotional.heartRateVariability.average} ms (trend: ${healthSummary.emotional.heartRateVariability.trend})
- Mindful Minutes: ${healthSummary.emotional.mindfulMinutes.today} today, ${Math.round(healthSummary.emotional.mindfulMinutes.weekTotal)} this week

MENTAL PILLAR:
- Sleep: ${healthSummary.mental.sleep.lastNight} hours last night (avg: ${healthSummary.mental.sleep.weekAverage} hrs/night, quality: ${healthSummary.mental.sleep.quality}, trend: ${healthSummary.mental.sleep.trend})
- Respiratory Rate: Avg ${healthSummary.mental.respiratoryRate.average} breaths/min (trend: ${healthSummary.mental.respiratoryRate.trend})

ENERGY PILLAR:
- Resting Energy: ${healthSummary.energy.restingEnergy.today} kcal today (avg: ${Math.round(healthSummary.energy.restingEnergy.weekAverage)} kcal/day)
- Body Mass: ${healthSummary.energy.bodyMass.current} kg (trend: ${healthSummary.energy.bodyMass.trend})
- VO2 Max: ${healthSummary.energy.vo2Max.current || 'Not available'} (trend: ${healthSummary.energy.vo2Max.trend})
`;

  if (insights.length > 0) {
    prompt += `\nKey Insights:\n`;
    insights.forEach((insight) => {
      prompt += `- [${insight.pillar.toUpperCase()}] ${insight.message} (Priority: ${insight.priority})\n`;
    });
  }

  if (recentActivity.length > 0) {
    prompt += `\nRecent Activity:\n`;
    recentActivity.forEach((activity) => {
      prompt += `- ${activity.description} on ${activity.date.toLocaleDateString()}\n`;
    });
  }

  return prompt;
}

