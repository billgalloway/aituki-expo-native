/**
 * React Hook for fetching chart data from Supabase
 * Handles loading states, errors, and automatic refresh
 */

import { useState, useEffect } from 'react';
import {
  fetchPhysicalScoreData,
  fetchStepsData,
  fetchHeartRateData,
  fetchAllChartData,
  PhysicalScoreData,
} from '@/services/chartData';

interface UseChartDataOptions {
  userId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseChartDataReturn {
  // Physical Score
  physicalScore: PhysicalScoreData | null;
  physicalScoreLoading: boolean;
  physicalScoreError: Error | null;

  // Steps
  stepsData: { walkingData: number[]; runningData: number[]; total: number } | null;
  stepsLoading: boolean;
  stepsError: Error | null;

  // Heart Rate
  heartRateData: { heartRateData: number[]; average: number } | null;
  heartRateLoading: boolean;
  heartRateError: Error | null;

  // Combined loading state
  loading: boolean;

  // Refresh function
  refresh: () => Promise<void>;
}

export function useChartData(options: UseChartDataOptions = {}): UseChartDataReturn {
  const { userId, autoRefresh = false, refreshInterval = 60000 } = options; // Default: refresh every minute

  // Physical Score state
  const [physicalScore, setPhysicalScore] = useState<PhysicalScoreData | null>(null);
  const [physicalScoreLoading, setPhysicalScoreLoading] = useState(true);
  const [physicalScoreError, setPhysicalScoreError] = useState<Error | null>(null);

  // Steps state
  const [stepsData, setStepsData] = useState<{ walkingData: number[]; runningData: number[]; total: number } | null>(null);
  const [stepsLoading, setStepsLoading] = useState(true);
  const [stepsError, setStepsError] = useState<Error | null>(null);

  // Heart Rate state
  const [heartRateData, setHeartRateData] = useState<{ heartRateData: number[]; average: number } | null>(null);
  const [heartRateLoading, setHeartRateLoading] = useState(true);
  const [heartRateError, setHeartRateError] = useState<Error | null>(null);

  // Fetch all data
  const fetchData = async () => {
    try {
      // Fetch all data in parallel
      const [physicalScoreResult, stepsResult, heartRateResult] = await Promise.allSettled([
        fetchPhysicalScoreData(userId),
        fetchStepsData(userId),
        fetchHeartRateData(userId),
      ]);

      // Handle Physical Score
      if (physicalScoreResult.status === 'fulfilled') {
        setPhysicalScore(physicalScoreResult.value);
        setPhysicalScoreError(null);
      } else {
        setPhysicalScoreError(physicalScoreResult.reason);
        setPhysicalScore(null);
      }
      setPhysicalScoreLoading(false);

      // Handle Steps
      if (stepsResult.status === 'fulfilled') {
        setStepsData(stepsResult.value);
        setStepsError(null);
      } else {
        setStepsError(stepsResult.reason);
        setStepsData(null);
      }
      setStepsLoading(false);

      // Handle Heart Rate
      if (heartRateResult.status === 'fulfilled') {
        setHeartRateData(heartRateResult.value);
        setHeartRateError(null);
      } else {
        setHeartRateError(heartRateResult.reason);
        setHeartRateData(null);
      }
      setHeartRateLoading(false);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setPhysicalScoreError(error as Error);
      setStepsError(error as Error);
      setHeartRateError(error as Error);
      setPhysicalScoreLoading(false);
      setStepsLoading(false);
      setHeartRateLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [userId]);

  // Auto-refresh if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, userId]);

  const loading = physicalScoreLoading || stepsLoading || heartRateLoading;

  return {
    physicalScore,
    physicalScoreLoading,
    physicalScoreError,
    stepsData,
    stepsLoading,
    stepsError,
    heartRateData,
    heartRateLoading,
    heartRateError,
    loading,
    refresh: fetchData,
  };
}

