/**
 * Data Screen
 * Connect devices and manage health data
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';
import { deviceImages, serviceImages } from '@/components/ImageLibrary';
import { useAppleHealth } from '@/hooks/useAppleHealth';
import { clearHealthContextCache } from '@/services/openai';

const devices = [
  { name: 'Apple', imageKey: 'apple' as keyof typeof deviceImages, fallbackIcon: 'watch' },
  { name: 'Android', imageKey: 'android' as keyof typeof deviceImages, fallbackIcon: 'watch' },
  { name: 'Fitbit', imageKey: 'fitbit' as keyof typeof deviceImages, fallbackIcon: 'watch' },
  { name: 'Auro', imageKey: 'auro' as keyof typeof deviceImages, fallbackIcon: 'watch' },
];

const services = [
  { name: 'Add data manually', imageKey: 'manual' as keyof typeof serviceImages, fallbackIcon: 'edit' },
  { name: 'BUPA', imageKey: 'bupa' as keyof typeof serviceImages, fallbackIcon: 'local-hospital' },
  { name: 'Virgin fitness', imageKey: 'virgin' as keyof typeof serviceImages, fallbackIcon: 'fitness-center' },
  { name: 'NHS', imageKey: 'nhs' as keyof typeof serviceImages, fallbackIcon: 'local-hospital' },
  { name: 'AXA', imageKey: 'axa' as keyof typeof serviceImages, fallbackIcon: 'local-hospital' },
  { name: 'Vitality', imageKey: 'vitality' as keyof typeof serviceImages, fallbackIcon: 'local-hospital' },
];

// Enable images now that they're in Supabase
const USE_IMAGES = true;

export default function DataScreen() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Apple Health integration
  const {
    isAvailable,
    permissions,
    permissionsLoading,
    syncLoading,
    syncToSupabase,
    requestPermissions,
    syncStatus,
    refreshSyncStatus,
  } = useAppleHealth({ autoSync: false });

  // Refresh sync status when component mounts or permissions change
  useEffect(() => {
    if (Platform.OS === 'ios' && isAvailable && permissions?.granted) {
      refreshSyncStatus();
    }
  }, [isAvailable, permissions?.granted, refreshSyncStatus]);

  const handleImageError = (key: string, url: string) => {
    console.log(`❌ Image failed to load: ${key}`, url);
    setImageErrors(prev => ({ ...prev, [key]: true }));
  };

  const handleAppleHealthPress = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Not Available', 'Apple Health is only available on iOS devices.');
      return;
    }

    if (!isAvailable) {
      // HealthKit doesn't work on simulators - show appropriate message
      // Note: We can't reliably detect simulator in React Native without expo-device,
      // but the library's isAvailable() will return false on simulators
      Alert.alert(
        'HealthKit Not Available', 
        'HealthKit is not available. Common reasons:\n\n• Running on iOS Simulator (HealthKit requires a physical device)\n• HealthKit capability not enabled in Xcode\n• App needs to be rebuilt after adding HealthKit\n• HealthKit entitlement missing from provisioning profile\n\nTo fix build error 65:\n1. Open ios/aituki-mobile.xcworkspace in Xcode\n2. Select target → Signing & Capabilities\n3. Click "+ Capability" → Add "HealthKit"\n4. Clean build folder (Cmd+Shift+K)\n5. Rebuild the app'
      );
      return;
    }

    if (!permissions?.granted) {
      // Request permissions
      try {
        const status = await requestPermissions();
        console.log('Permission request result:', status);
        
        if (status.granted) {
        // Auto-sync after granting permissions (sync last 30 days of data)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // Get last 30 days
        
        const result = await syncToSupabase(startDate, endDate);
        if (result.success) {
          // Clear AI context cache so it picks up new data
          clearHealthContextCache();
          
          Alert.alert(
            'Connected!',
            `Successfully connected to Apple Health and synced ${result.synced} health records. Your data is now available for personalized insights.`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Connected',
            `Connected to Apple Health, but encountered some issues syncing data. ${result.errors} errors occurred. You can try syncing again later.`,
            [{ text: 'OK' }]
          );
        }
        } else if (status.denied) {
          Alert.alert(
            'Permissions Required',
            'To connect Apple Health, please grant permissions in:\n\nSettings > Privacy & Security > Health > AiTuki\n\nThen return here to complete the connection.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => {
                // Note: Linking.openSettings() would require expo-linking
                // For now, just show the message
              }}
            ]
          );
        } else if (status.unavailable) {
          Alert.alert(
            'HealthKit Unavailable',
            'HealthKit is not available. This may be because:\n\n• HealthKit capability is not enabled in Xcode\n• The app needs to be rebuilt with HealthKit support\n• Running on a simulator (HealthKit requires a physical device)'
          );
        }
      } catch (error) {
        console.error('Error in handleAppleHealthPress:', error);
        Alert.alert(
          'Error',
          `Failed to connect to Apple Health: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease ensure HealthKit is enabled in Xcode and the app is rebuilt.`
        );
      }
    } else {
      // Already connected - trigger manual sync
      const endDate = new Date();
      const startDate = syncStatus?.lastSyncDate 
        ? new Date(syncStatus.lastSyncDate)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days if no previous sync
      
      const result = await syncToSupabase(startDate, endDate);
      if (result.success) {
        // Clear AI context cache so it picks up new data
        clearHealthContextCache();
        
        Alert.alert(
          'Sync Complete', 
          `Successfully synced ${result.synced} new health records. Your data has been updated.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Sync Error', 
          `Failed to sync health data. ${result.errors} errors occurred. Please try again.`,
          [{ text: 'OK' }]
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Add health data</Text>
          <Text style={styles.subtitle}>
            Tuki uses your health data to understand you and your body. The easiest way is to connect
            a device.
          </Text>
        </View>

        {/* Devices Section */}
        <View style={styles.section}>
          {devices.map((device, index) => {
            const imageKey = `device-${device.imageKey}`;
            const hasError = imageErrors[imageKey];
            const imageUrl = deviceImages[device.imageKey];

            // Special handling for Apple device
            const isApple = device.name === 'Apple';
            const isConnected = isApple && Platform.OS === 'ios' && permissions?.granted;
            const isLoading = isApple && (permissionsLoading || syncLoading);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.listItem,
                  index < devices.length - 1 && styles.listItemBorder,
                ]}
                onPress={isApple ? handleAppleHealthPress : undefined}
                disabled={isLoading}>
                <View style={styles.listItemIcon}>
                  {USE_IMAGES && !hasError && imageUrl ? (
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.listItemImage}
                      contentFit="contain"
                      transition={200}
                      onError={() => handleImageError(imageKey, imageUrl)}
                      placeholderContentFit="contain"
                      cachePolicy="memory-disk"
                    />
                  ) : (
                    <IconLibrary iconName={device.fallbackIcon} size={24} color={Colors.light.text} />
                  )}
                </View>
                <View style={styles.listItemTextContainer}>
                  <Text style={styles.listItemText}>{device.name}</Text>
                  {isApple && Platform.OS === 'ios' && (
                    <Text style={styles.listItemSubtext}>
                      {isLoading
                        ? 'Connecting...'
                        : isConnected
                        ? syncStatus?.lastSyncDate
                          ? `Last synced: ${new Date(syncStatus.lastSyncDate).toLocaleDateString()}`
                          : syncStatus?.totalRecords
                          ? `${syncStatus.totalRecords} records synced`
                          : 'Connected'
                        : 'Tap to connect'}
                    </Text>
                  )}
                </View>
                {isLoading ? (
                  <ActivityIndicator size="small" color={Colors.light.primary} />
                ) : (
                  <IconLibrary
                    iconName={isConnected ? "check-circle" : "chevron-right"}
                    size={24}
                    color={isConnected ? Colors.light.primary : Colors.light.textSecondary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          {services.map((service, index) => {
            const imageKey = `service-${service.imageKey}`;
            const hasError = imageErrors[imageKey];
            const imageUrl = serviceImages[service.imageKey];

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.listItem,
                  index < services.length - 1 && styles.listItemBorder,
                ]}>
                <View style={styles.listItemIcon}>
                  {USE_IMAGES && !hasError && imageUrl ? (
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.listItemImage}
                      contentFit="contain"
                      transition={200}
                      onError={() => handleImageError(imageKey, imageUrl)}
                      placeholderContentFit="contain"
                      cachePolicy="memory-disk"
                    />
                  ) : (
                    <IconLibrary iconName={service.fallbackIcon} size={24} color={Colors.light.text} />
                  )}
                </View>
                <Text style={styles.listItemText}>{service.name}</Text>
                <IconLibrary iconName="chevron-right" size={24} color={Colors.light.textSecondary} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <BottomNavigation activeTab="data" />
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
    padding: Spacing.lg,
    paddingBottom: 120,
    gap: Spacing.md,
  },
  headerSection: {
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.text,
    lineHeight: 20,
  },
  section: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(31, 86, 97, 0.15)',
    backgroundColor: Colors.light.background,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31, 86, 97, 0.25)',
  },
  listItemIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(31, 86, 97, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  listItemImage: {
    width: '100%',
    height: '100%',
  },
  listItemTextContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  listItemText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
  listItemSubtext: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.textSecondary,
  },
});
