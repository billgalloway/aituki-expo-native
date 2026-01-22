/**
 * Chart Data Service
 * Fetches chart data from Supabase for health metrics
 */

import { supabase } from './supabase';

// Types for chart data
export interface PhysicalScoreData {
  score: number;
  percentage: number;
  label: string;
  date: string;
  timeframe: string;
}

export interface StepsData {
  quarter: string; // 'q1', 'q2', 'q3', 'q4'
  walking: number;
  running: number;
  total: number;
  date: string;
}

export interface HeartRateData {
  time: string; // '08:00', '10:00', etc.
  heartRate: number;
  date: string;
}

/**
 * Fetch Physical Score data from Supabase
 * @param userId - User ID (optional, uses current session if not provided)
 * @param timeframe - 'week', 'month', 'year' (default: 'week')
 * @param days - Number of days to look back (default: 7)
 */
export async function fetchPhysicalScoreData(
  userId?: string,
  timeframe: string = 'week',
  days: number = 7
): Promise<PhysicalScoreData | null> {
  try {
    // Get current user if userId not provided
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      console.warn('No user ID available for fetching physical score data');
      return null;
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Query Supabase
    const { data, error } = await supabase
      .from('physical_scores')
      .select('*')
      .eq('user_id', targetUserId)
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString())
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching physical score data:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      score: data.score || 179,
      percentage: data.percentage || 56,
      label: data.label || 'Good week',
      date: data.date,
      timeframe: data.timeframe || timeframe,
    };
  } catch (error) {
    console.error('Error in fetchPhysicalScoreData:', error);
    return null;
  }
}

/**
 * Fetch Steps data from Supabase
 * Tries health_data table first (Apple Health), falls back to steps_data table
 * @param userId - User ID (optional, uses current session if not provided)
 * @param quarters - Array of quarters to fetch (default: ['q1', 'q2', 'q3', 'q4'])
 */
export async function fetchStepsData(
  userId?: string,
  quarters: string[] = ['q1', 'q2', 'q3', 'q4']
): Promise<{ walkingData: number[]; runningData: number[]; total: number } | null> {
  try {
    // Get current user if userId not provided
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      console.warn('No user ID available for fetching steps data');
      return null;
    }

    // Get current week's data
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    // First, try to get data from unified health_data table (Apple Health)
    const { data: healthData, error: healthDataError } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('data_type', 'stepCount')
      .eq('source', 'apple_health')
      .gte('start_date', startOfWeek.toISOString())
      .lte('start_date', endOfWeek.toISOString())
      .order('start_date', { ascending: true });

    // If we have health_data, use it
    if (!healthDataError && healthData && healthData.length > 0) {
      // Group steps by day and calculate quarters
      const dailySteps: Record<string, number> = {};
      healthData.forEach((record: any) => {
        const date = new Date(record.start_date).toISOString().split('T')[0];
        dailySteps[date] = (dailySteps[date] || 0) + parseFloat(record.value);
      });

      // Calculate quarters (divide week into 4 quarters)
      const daysInWeek = 7;
      const daysPerQuarter = daysInWeek / 4;
      const walkingData: number[] = [];
      const runningData: number[] = [];
      let total = 0;

      for (let q = 0; q < 4; q++) {
        let quarterSteps = 0;
        const quarterStart = q * daysPerQuarter;
        const quarterEnd = (q + 1) * daysPerQuarter;

        for (let d = 0; d < daysInWeek; d++) {
          if (d >= quarterStart && d < quarterEnd) {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + d);
            const dateStr = date.toISOString().split('T')[0];
            quarterSteps += dailySteps[dateStr] || 0;
          }
        }

        // For now, assume all steps are walking (can be enhanced with workout data)
        walkingData.push(Math.round(quarterSteps * 0.8)); // 80% walking
        runningData.push(Math.round(quarterSteps * 0.2)); // 20% running
        total += quarterSteps;
      }

      return { walkingData, runningData, total };
    }

    // Fallback to steps_data table (legacy)
    const { data, error } = await supabase
      .from('steps_data')
      .select('*')
      .eq('user_id', targetUserId)
      .gte('date', startOfWeek.toISOString())
      .lte('date', endOfWeek.toISOString())
      .order('quarter', { ascending: true });

    if (error) {
      console.error('Error fetching steps data:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    // Group data by quarter and calculate totals
    const walkingData: number[] = [];
    const runningData: number[] = [];
    let total = 0;

    quarters.forEach((quarter) => {
      const quarterData = data.find((item: StepsData) => item.quarter === quarter);
      if (quarterData) {
        walkingData.push(quarterData.walking || 0);
        runningData.push(quarterData.running || 0);
        total += (quarterData.walking || 0) + (quarterData.running || 0);
      } else {
        // Default values if no data
        walkingData.push(0);
        runningData.push(0);
      }
    });

    // Calculate total from all data if not already calculated
    if (total === 0 && data.length > 0) {
      total = data.reduce((sum: number, item: StepsData) => {
        return sum + (item.walking || 0) + (item.running || 0);
      }, 0);
    }

    return {
      walkingData,
      runningData,
      total,
    };
  } catch (error) {
    console.error('Error in fetchStepsData:', error);
    return null;
  }
}

/**
 * Fetch Heart Rate data from Supabase
 * Tries health_data table first (Apple Health), falls back to heart_rate_data table
 * @param userId - User ID (optional, uses current session if not provided)
 * @param date - Specific date to fetch (default: today)
 * @param timeLabels - Array of time labels for x-axis
 */
export async function fetchHeartRateData(
  userId?: string,
  date?: Date,
  timeLabels: string[] = ['08:00', '10:00', '12:00', '14:00', '16:00']
): Promise<{ heartRateData: number[]; average: number } | null> {
  try {
    // Get current user if userId not provided
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      console.warn('No user ID available for fetching heart rate data');
      return null;
    }

    // Use provided date or today
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // First, try to get data from unified health_data table (Apple Health)
    const { data: healthData, error: healthDataError } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('data_type', 'heartRate')
      .eq('source', 'apple_health')
      .gte('start_date', startOfDay.toISOString())
      .lte('start_date', endOfDay.toISOString())
      .order('start_date', { ascending: true });

    // If we have health_data, use it
    if (!healthDataError && healthData && healthData.length > 0) {
      // Group heart rate by time slots
      const heartRateByTime: Record<string, number[]> = {};
      healthData.forEach((record: any) => {
        const recordDate = new Date(record.start_date);
        const hour = recordDate.getHours();
        const minute = recordDate.getMinutes();
        const timeSlot = `${String(hour).padStart(2, '0')}:${String(Math.floor(minute / 15) * 15).padStart(2, '0')}`;
        
        if (!heartRateByTime[timeSlot]) {
          heartRateByTime[timeSlot] = [];
        }
        heartRateByTime[timeSlot].push(parseFloat(record.value));
      });

      // Map to time labels (average values for each time slot)
      const heartRateData = timeLabels.map((timeLabel) => {
        // Find closest time slot
        const matchingSlots = Object.keys(heartRateByTime).filter(slot => {
          const [slotHour, slotMin] = slot.split(':').map(Number);
          const [labelHour, labelMin] = timeLabel.split(':').map(Number);
          return Math.abs(slotHour - labelHour) <= 1; // Within 1 hour
        });

        if (matchingSlots.length > 0) {
          const allValues = matchingSlots.flatMap(slot => heartRateByTime[slot]);
          return allValues.reduce((a, b) => a + b, 0) / allValues.length;
        }
        return 0;
      });

      const average = heartRateData.length > 0
        ? heartRateData.reduce((sum, val) => sum + val, 0) / heartRateData.length
        : 0;

      return {
        heartRateData: heartRateData.map(v => Math.round(v)),
        average: Math.round(average),
      };
    }

    // Fallback to heart_rate_data table (legacy)
    const { data, error } = await supabase
      .from('heart_rate_data')
      .select('*')
      .eq('user_id', targetUserId)
      .gte('date', startOfDay.toISOString())
      .lte('date', endOfDay.toISOString())
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching heart rate data:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    // Map data to time labels
    const heartRateData: number[] = timeLabels.map((timeLabel) => {
      // Match by time field directly (format: 'HH:MM')
      const matchingData = data.find((item: any) => item.time === timeLabel);
      return matchingData?.heart_rate || matchingData?.heartRate || 0;
    });

    // Calculate average
    const average = heartRateData.length > 0
      ? heartRateData.reduce((sum, val) => sum + val, 0) / heartRateData.length
      : 0;

    return {
      heartRateData,
      average: Math.round(average),
    };
  } catch (error) {
    console.error('Error in fetchHeartRateData:', error);
    return null;
  }
}

/**
 * Fetch all chart data for a user (combined query for efficiency)
 */
export async function fetchAllChartData(userId?: string) {
  try {
    const [physicalScore, steps, heartRate] = await Promise.all([
      fetchPhysicalScoreData(userId),
      fetchStepsData(userId),
      fetchHeartRateData(userId),
    ]);

    return {
      physicalScore,
      steps,
      heartRate,
    };
  } catch (error) {
    console.error('Error fetching all chart data:', error);
    return {
      physicalScore: null,
      steps: null,
      heartRate: null,
    };
  }
}

