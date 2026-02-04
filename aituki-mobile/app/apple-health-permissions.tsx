/**
 * Apple Health Permissions Selection Screen
 * Second screen in the HealthKit onboarding flow
 * Allows users to select which data types to share
 * Based on Figma design
 */

import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';
import { useAppleHealth } from '@/hooks/useAppleHealth';
import ConnectAppleHealthHeader from '@/components/ConnectAppleHealth/ConnectAppleHealthHeader';
import ConnectAppleHealthTitleAboveHero from '@/components/ConnectAppleHealth/ConnectAppleHealthTitleAboveHero';
import ThemedSwitch from '@/components/ThemedSwitch';

// Health data types with descriptions
const HEALTH_DATA_TYPES = [
  {
    id: 'stepCount',
    label: 'Steps',
    description: 'Daily step count and activity',
    category: 'Physical',
    icon: 'directions_walk', // Material Symbol name
  },
  {
    id: 'heartRate',
    label: 'Heart Rate',
    description: 'Heart rate measurements',
    category: 'Emotional',
    icon: 'favorite',
  },
  {
    id: 'activeEnergy',
    label: 'Active Energy',
    description: 'Calories burned during activity',
    category: 'Physical',
    icon: 'fitness-center',
  },
  {
    id: 'sleepAnalysis',
    label: 'Sleep',
    description: 'Sleep duration and quality',
    category: 'Mental',
    icon: 'bedtime',
  },
  {
    id: 'distanceWalkingRunning',
    label: 'Distance',
    description: 'Walking and running distance',
    category: 'Physical',
    icon: 'directions_run',
  },
  {
    id: 'workout',
    label: 'Workouts',
    description: 'Exercise and workout sessions',
    category: 'Physical',
    icon: 'sports-handball',
  },
  {
    id: 'heartRateVariability',
    label: 'Heart Rate Variability',
    description: 'HRV measurements for stress tracking',
    category: 'Emotional',
    icon: 'favorite',
  },
  {
    id: 'mindfulMinutes',
    label: 'Mindful Minutes',
    description: 'Meditation and mindfulness sessions',
    category: 'Emotional',
    icon: 'psychology',
  },
  {
    id: 'respiratoryRate',
    label: 'Respiratory Rate',
    description: 'Breathing rate measurements',
    category: 'Mental',
    icon: 'air',
  },
  {
    id: 'restingEnergy',
    label: 'Resting Energy',
    description: 'Basal metabolic rate',
    category: 'Energy',
    icon: 'battery_charging_full',
  },
  {
    id: 'bodyMass',
    label: 'Body Mass',
    description: 'Weight measurements',
    category: 'Energy',
    icon: 'monitor_weight',
  },
  {
    id: 'vo2Max',
    label: 'VO2 Max',
    description: 'Cardiovascular fitness level',
    category: 'Energy',
    icon: 'trending_up',
  },
];

export default function AppleHealthPermissionsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { requestPermissions, isAvailable } = useAppleHealth({ autoSync: false });

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
  const [selectedTypes, setSelectedTypes] = useState<Record<string, boolean>>(() => {
    // Default: all enabled
    const defaults: Record<string, boolean> = {};
    HEALTH_DATA_TYPES.forEach(type => {
      defaults[type.id] = true;
    });
    return defaults;
  });

  const toggleDataType = (id: string) => {
    setSelectedTypes(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleContinue = async () => {
    // Get selected data types
    const selectedIds = Object.entries(selectedTypes)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);

    if (selectedIds.length === 0) {
      // Show error - at least one type must be selected
      return;
    }

    // Request permissions for selected types
    // Note: HealthKit requests all permissions at once, but we can track which ones user wants
    try {
      const status = await requestPermissions();
      
      if (status.granted) {
        // Navigate to sync screen
        router.push({
          pathname: '/apple-health-sync',
          params: { selectedTypes: JSON.stringify(selectedIds) },
        });
      } else if (status.denied) {
        // Show error message
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <ConnectAppleHealthHeader title="Apple Health Permissions" />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <ConnectAppleHealthTitleAboveHero />
        <Text style={styles.description}>
          Select which health data types you'd like to share with AiTuki. You can change these settings anytime.
        </Text>

        {/* Data Types List */}
        <View style={styles.dataTypesContainer}>
          {HEALTH_DATA_TYPES.map((type) => (
            <View key={type.id} style={styles.dataTypeItem}>
              <View style={styles.dataTypeLeft}>
                <View style={styles.iconWrapper}>
                  <IconLibrary 
                    iconName={type.icon} 
                    size={24} 
                    color={Colors.light.textPrimary} 
                  />
                </View>
                <View style={styles.dataTypeInfo}>
                  <Text style={styles.dataTypeLabel}>{type.label}</Text>
                  <Text style={styles.dataTypeDescription}>{type.description}</Text>
                  <Text style={styles.dataTypeCategory}>{type.category}</Text>
                </View>
              </View>
              <ThemedSwitch
                value={selectedTypes[type.id]}
                onValueChange={() => toggleDataType(type.id)}
              />
            </View>
          ))}
        </View>

        {/* Info Note */}
        <View style={styles.infoContainer}>
          <IconLibrary iconName="info" size={20} color={Colors.light.textPrimary} />
          <Text style={styles.infoText}>
            You'll be prompted to grant permissions in the next step. You can modify these settings later in iOS Settings.
          </Text>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            Object.values(selectedTypes).every(v => !v) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={Object.values(selectedTypes).every(v => !v)}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerWrapper: {
    zIndex: 10,
    elevation: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  description: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  dataTypesContainer: {
    marginBottom: Spacing.lg,
  },
  dataTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  dataTypeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  dataTypeInfo: {
    flex: 1,
  },
  dataTypeLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  dataTypeDescription: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  dataTypeCategory: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xs,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  infoText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  continueButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.light.border,
    opacity: 0.5,
  },
  continueButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.light.text,
  },
});
