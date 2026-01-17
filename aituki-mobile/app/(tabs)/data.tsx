/**
 * Data Screen
 * Connect devices and manage health data
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';
import { deviceImages, serviceImages } from '@/components/ImageLibrary';

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

  const handleImageError = (key: string, url: string) => {
    console.log(`❌ Image failed to load: ${key}`, url);
    setImageErrors(prev => ({ ...prev, [key]: true }));
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

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.listItem,
                  index < devices.length - 1 && styles.listItemBorder,
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
                    <IconLibrary iconName={device.fallbackIcon} size={24} color={Colors.light.text} />
                  )}
                </View>
                <Text style={styles.listItemText}>{device.name}</Text>
                <IconLibrary iconName="chevron-right" size={24} color={Colors.light.textSecondary} />
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
  listItemText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
});
