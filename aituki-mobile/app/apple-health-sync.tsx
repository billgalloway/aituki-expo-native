/**
 * Apple Health Data Sync Screen
 * Third screen in the HealthKit onboarding flow
 * Shows progress while syncing health data
 * Based on Figma design
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';
import { useAppleHealth } from '@/hooks/useAppleHealth';
import { syncHealthDataToSupabase } from '@/services/healthDataSync';
import { clearHealthContextCache } from '@/services/openai';

interface SyncProgress {
  status: 'syncing' | 'complete' | 'error';
  currentStep: string;
  recordsSynced: number;
  errors: number;
}

export default function AppleHealthSyncScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { syncToSupabase } = useAppleHealth({ autoSync: false });
  
  const [progress, setProgress] = useState<SyncProgress>({
    status: 'syncing',
    currentStep: 'Initializing sync...',
    recordsSynced: 0,
    errors: 0,
  });

  useEffect(() => {
    const performSync = async () => {
      try {
        setProgress(prev => ({ ...prev, currentStep: 'Connecting to Apple Health...' }));
        
        // Wait a moment for UI to update
        await new Promise(resolve => setTimeout(resolve, 500));

        setProgress(prev => ({ ...prev, currentStep: 'Fetching health data...' }));
        
        // Sync last 30 days of data
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        setProgress(prev => ({ ...prev, currentStep: 'Syncing to cloud...' }));

        const result = await syncHealthDataToSupabase(startDate, endDate);

        if (result.success) {
          // Clear AI context cache so it picks up new data
          clearHealthContextCache();

          setProgress({
            status: 'complete',
            currentStep: 'Sync complete!',
            recordsSynced: result.synced,
            errors: result.errors,
          });

          // Wait a moment to show success, then navigate
          setTimeout(() => {
            router.replace('/(tabs)/health');
          }, 2000);
        } else {
          setProgress({
            status: 'error',
            currentStep: 'Sync completed with errors',
            recordsSynced: result.synced,
            errors: result.errors,
          });
        }
      } catch (error) {
        console.error('Error during sync:', error);
        setProgress({
          status: 'error',
          currentStep: 'An error occurred during sync',
          recordsSynced: 0,
          errors: 1,
        });
      }
    };

    performSync();
  }, []);

  const handleCancel = () => {
    // Note: Can't actually cancel an in-progress sync, but can navigate away
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Health Data Sync</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {progress.status === 'syncing' ? (
            <ActivityIndicator 
              size="large" 
              color={Colors.light.primary} 
              style={styles.spinner}
            />
          ) : progress.status === 'complete' ? (
            <View style={styles.successIcon}>
              <IconLibrary iconName="check" size={80} color={Colors.light.primary} />
            </View>
          ) : (
            <View style={styles.errorIcon}>
              <IconLibrary iconName="error" size={80} color="#ef4444" />
            </View>
          )}
        </View>

        {/* Status Text */}
        <Text style={styles.statusText}>{progress.currentStep}</Text>

        {/* Progress Details */}
        {progress.status === 'syncing' && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>
              Please wait while we import your health data. This may take a few moments...
            </Text>
          </View>
        )}

        {/* Results */}
        {progress.status === 'complete' && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultItem}>
              <IconLibrary iconName="check" size={20} color={Colors.light.primary} />
              <Text style={styles.resultText}>
                {progress.recordsSynced} health records synced
              </Text>
            </View>
            {progress.errors > 0 && (
              <View style={styles.resultItem}>
                <IconLibrary iconName="warning" size={20} color="#ef4444" />
                <Text style={[styles.resultText, { color: '#ef4444' }]}>
                  {progress.errors} errors occurred
                </Text>
              </View>
            )}
            <Text style={styles.successMessage}>
              Your health data is now available for personalized insights!
            </Text>
          </View>
        )}

        {progress.status === 'error' && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              We encountered an issue syncing your data. You can try again later from the Health screen.
            </Text>
            {progress.recordsSynced > 0 && (
              <Text style={styles.partialSuccessText}>
                {progress.recordsSynced} records were successfully synced.
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      {progress.status === 'syncing' && (
        <View style={styles.buttonContainer}>
          <Text style={styles.cancelText} onPress={handleCancel}>
            Cancel
          </Text>
        </View>
      )}

      {progress.status === 'error' && (
        <View style={styles.buttonContainer}>
          <Text 
            style={styles.retryText}
            onPress={() => router.replace('/apple-health-permissions')}
          >
            Try Again
          </Text>
          <Text 
            style={styles.skipText}
            onPress={() => router.replace('/(tabs)/health')}
          >
            Continue Anyway
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.light.text,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  spinner: {
    marginVertical: Spacing.xl,
  },
  successIcon: {
    marginVertical: Spacing.xl,
  },
  errorIcon: {
    marginVertical: Spacing.xl,
  },
  statusText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  detailsContainer: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
    maxWidth: '90%',
  },
  detailsText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  resultText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.light.text,
    marginLeft: Spacing.sm,
  },
  successMessage: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.lg,
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    maxWidth: '90%',
  },
  errorText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: '#991b1b',
    textAlign: 'center',
    lineHeight: 22,
  },
  partialSuccessText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  buttonContainer: {
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.light.textSecondary,
    textDecorationLine: 'underline',
  },
  retryText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: Spacing.sm,
    textDecorationLine: 'underline',
  },
  skipText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
  },
});
