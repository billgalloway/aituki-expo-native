/**
 * Health Screen
 * Multi-tab screen with Dashboard, Physical, Emotional, Mental, and Energy tabs
 * Matches Figma design structure
 * Note: Chart data will be pulled from Supabase in the future
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import PhysicalScoreChart from '@/components/PhysicalScoreChart';
import StepsChart from '@/components/StepsChart';
import HeartRateChart from '@/components/HeartRateChart';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';
import { useAppleHealth } from '@/hooks/useAppleHealth';
import { useChartData } from '@/hooks/useChartData';

const tabs = ['Dashboard', 'Physical', 'Emotional', 'Mental', 'Energy'];

export default function HealthScreen() {
  const [activeTab, setActiveTab] = useState(1); // Physical tab active by default
  
  // Apple Health integration
  const {
    isAvailable,
    permissions,
    permissionsLoading,
    syncLoading,
    syncToSupabase,
    requestPermissions,
    syncStatus,
  } = useAppleHealth({ autoSync: false });

  // Chart data from Supabase (pulls from health_data table)
  const {
    physicalScore,
    stepsData,
    heartRateData,
    loading: chartsLoading,
  } = useChartData({ autoRefresh: true });

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Dashboard
        return <DashboardContent />;
      case 1: // Physical
        return <PhysicalContent />;
      case 2: // Emotional
        return <EmotionalContent />;
      case 3: // Mental
        return <MentalContent />;
      case 4: // Energy
        return <EnergyContent />;
      default:
        return <PhysicalContent />;
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tab, activeTab === index && styles.tabActive]}
              onPress={() => setActiveTab(index)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === index && styles.tabTextActive,
                ]}>
                {tab}
              </Text>
              {activeTab === index && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons - Show on all tabs except Dashboard */}
        {activeTab !== 0 && (
          <View style={styles.actionButtonsContainer}>
            {Platform.OS === 'ios' && isAvailable && (
              <TouchableOpacity
                style={styles.connectDeviceButton}
                onPress={async () => {
                  if (!permissions?.granted) {
                    const status = await requestPermissions();
                    if (status.granted) {
                      // Auto-sync after granting permissions
                      await syncToSupabase();
                    } else {
                      Alert.alert(
                        'Permissions Required',
                        'Please grant HealthKit permissions in Settings to sync your health data.'
                      );
                    }
                  } else {
                    // Manual sync
                    const result = await syncToSupabase();
                    if (result.success) {
                      Alert.alert('Success', `Synced ${result.synced} health records`);
                    } else {
                      Alert.alert('Sync Error', `Failed to sync. ${result.errors} errors.`);
                    }
                  }
                }}
                disabled={syncLoading || permissionsLoading}
              >
                {syncLoading || permissionsLoading ? (
                  <ActivityIndicator color={Colors.light.text} size="small" />
                ) : (
                  <Text style={styles.connectDeviceText}>
                    {permissions?.granted ? 'Sync Health Data' : 'Connect Apple Health'}
                  </Text>
                )}
              </TouchableOpacity>
            )}
            {(!isAvailable || Platform.OS !== 'ios') && (
              <TouchableOpacity style={styles.connectDeviceButton}>
                <Text style={styles.connectDeviceText}>Connect a device</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.addDataButton}>
              <Text style={styles.addDataText}>Add data manually</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
      <BottomNavigation activeTab="measure" />
    </View>
  );
}

// Dashboard Tab Content
function DashboardContent() {
  return (
    <View style={styles.tabContent}>
      <View style={styles.dashboardContainer}>
        <Text style={styles.dashboardTitle}>Overview</Text>
        <View style={styles.dashboardGrid}>
          {/* Physical Score Card */}
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardCardTitle}>Physical</Text>
            <Text style={styles.dashboardCardValue}>179</Text>
            <Text style={styles.dashboardCardSubtitle}>56% this week</Text>
          </View>
          
          {/* Emotional Score Card */}
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardCardTitle}>Emotional</Text>
            <Text style={styles.dashboardCardValue}>156</Text>
            <Text style={styles.dashboardCardSubtitle}>62% this week</Text>
          </View>
          
          {/* Mental Score Card */}
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardCardTitle}>Mental</Text>
            <Text style={styles.dashboardCardValue}>142</Text>
            <Text style={styles.dashboardCardSubtitle}>48% this week</Text>
          </View>
          
          {/* Energy Score Card */}
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardCardTitle}>Energy</Text>
            <Text style={styles.dashboardCardValue}>138</Text>
            <Text style={styles.dashboardCardSubtitle}>45% this week</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Physical Tab Content
function PhysicalContent() {
  const {
    physicalScore,
    stepsData,
    heartRateData,
    loading: chartsLoading,
  } = useChartData({ autoRefresh: true });

  if (chartsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Loading chart data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <View style={styles.chartsContainer}>
        <PhysicalScoreChart
          score={physicalScore?.score || 179}
          subtitle="Last 7 days"
          percentage={physicalScore?.percentage || 56}
          label={physicalScore?.label || "Good week"}
        />
        <StepsChart
          value={stepsData?.total.toLocaleString() || "0"}
          subtitle="15% above average"
          walkingData={stepsData?.walkingData || [0, 0, 0, 0]}
          runningData={stepsData?.runningData || [0, 0, 0, 0]}
        />
        <HeartRateChart
          value={heartRateData?.average.toString() || "0"}
          subtitle="15% above average"
          timeLabels={['08:00', '10:00', '12:00', '14:00', '16:00']}
          heartRateData={heartRateData?.heartRateData || [0, 0, 0, 0, 0]}
        />
      </View>
    </View>
  );
}

// Emotional Tab Content
function EmotionalContent() {
  return (
    <View style={styles.tabContent}>
      <View style={styles.chartsContainer}>
        <PhysicalScoreChart
          score={156}
          subtitle="Last 7 days"
          percentage={62}
          label="Excellent week"
        />
      </View>
    </View>
  );
}

// Mental Tab Content
function MentalContent() {
  return (
    <View style={styles.tabContent}>
      <View style={styles.chartsContainer}>
        <PhysicalScoreChart
          score={142}
          subtitle="Last 7 days"
          percentage={48}
          label="Fair week"
        />
      </View>
    </View>
  );
}

// Energy Tab Content
function EnergyContent() {
  return (
    <View style={styles.tabContent}>
      <View style={styles.chartsContainer}>
        <PhysicalScoreChart
          score={138}
          subtitle="Last 7 days"
          percentage={45}
          label="Needs improvement"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.md,
    paddingHorizontal: 0,
    paddingBottom: 120,
    gap: Spacing.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    // Active state handled by underline
  },
  tabText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: '400',
    color: Colors.light.textSecondary,
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  tabTextActive: {
    color: Colors.light.text,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.light.primary,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  connectDeviceButton: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectDeviceText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: '400',
    color: Colors.light.text,
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  addDataButton: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addDataText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: '400',
    color: Colors.light.text,
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  tabContent: {
    paddingHorizontal: Spacing.lg,
  },
  chartsContainer: {
    gap: Spacing.xl,
  },
  // Dashboard styles
  dashboardContainer: {
    gap: Spacing.lg,
  },
  dashboardTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: 20,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  dashboardCard: {
    width: '47%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#F1F1F1',
    backgroundColor: Colors.light.background,
    alignItems: 'center',
  },
  dashboardCardTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: '400',
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  dashboardCardValue: {
    fontFamily: Typography.fontFamily,
    fontSize: 32,
    fontWeight: '400',
    color: Colors.light.primary,
    letterSpacing: -1.2,
    marginBottom: Spacing.xs,
  },
  dashboardCardSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xs,
    fontWeight: '400',
    color: Colors.light.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
  },
});
