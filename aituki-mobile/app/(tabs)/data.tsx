/**
 * Data Screen
 * Connect devices and manage health data
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

const devices = [
  { name: 'Apple', icon: 'watch' },
  { name: 'Android', icon: 'watch' },
  { name: 'Fitbit', icon: 'watch' },
  { name: 'Auro', icon: 'watch' },
];

const services = [
  { name: 'Add data manually', icon: 'edit' },
  { name: 'BUPA', icon: 'local-hospital' },
  { name: 'Virgin fitness', icon: 'fitness-center' },
  { name: 'NHS', icon: 'local-hospital' },
  { name: 'AXA', icon: 'local-hospital' },
  { name: 'Vitality', icon: 'local-hospital' },
];

export default function DataScreen() {
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
          {devices.map((device, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.listItem,
                index < devices.length - 1 && styles.listItemBorder,
              ]}>
              <View style={styles.listItemIcon}>
                <IconLibrary iconName={device.icon} size={24} color={Colors.light.text} />
              </View>
              <Text style={styles.listItemText}>{device.name}</Text>
              <IconLibrary iconName="chevron-right" size={24} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          {services.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.listItem,
                index < services.length - 1 && styles.listItemBorder,
              ]}>
              <View style={styles.listItemIcon}>
                <IconLibrary iconName={service.icon} size={24} color={Colors.light.text} />
              </View>
              <Text style={styles.listItemText}>{service.name}</Text>
              <IconLibrary iconName="chevron-right" size={24} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          ))}
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
  },
  listItemText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
});
