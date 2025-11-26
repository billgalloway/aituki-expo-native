/**
 * Health Screen
 * Track health metrics and measurements
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

const tabs = ['Physical', 'Emotional', 'Cognitive', 'Spiritual'];

const healthMetrics = [
  {
    title: 'Steps',
    value: '10560',
    unit: 'steps',
    status: 'Above average',
    statusColor: '#4caf50',
  },
  {
    title: 'Body measurements',
    value: '71.8',
    unit: 'kg',
    status: '-0.4kg',
    statusColor: '#4caf50',
  },
  {
    title: 'Cycling',
    value: '10.4',
    unit: 'Klm',
    status: 'Last 7 days',
    statusColor: '#4caf50',
  },
  {
    title: 'Heart',
    value: '120/82',
    unit: 'mmHg',
    value2: '75',
    unit2: 'bpm',
    status: 'Pre-High pressure',
    statusColor: '#ef6c00',
  },
  {
    title: 'Respiratory',
    value: '96%',
    unit: 'CO2',
    status: 'Above average',
    statusColor: '#4caf50',
  },
];

export default function HealthScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [showAlert, setShowAlert] = useState(true);

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
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Data Button */}
        <TouchableOpacity style={styles.addDataButton}>
          <Text style={styles.addDataText}>Add data</Text>
        </TouchableOpacity>

        {/* Alert */}
        {showAlert && (
          <View style={styles.alert}>
            <Text style={styles.alertText}>You've been sitting for 90 mins—let's stretch</Text>
            <TouchableOpacity onPress={() => setShowAlert(false)}>
              <IconLibrary iconName="close" size={20} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
        )}

        {/* Health Metrics */}
        <View style={styles.metricsGrid}>
          {healthMetrics.map((metric, index) => (
            <View
              key={index}
              style={[
                styles.metricCard,
                metric.title === 'Steps' && styles.metricCardWide,
              ]}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricTitle}>{metric.title}</Text>
                <View style={styles.metricDivider} />
              </View>
              <View style={styles.metricValues}>
                <Text style={styles.metricValue}>
                  {metric.value}
                  <Text style={styles.metricUnit}> {metric.unit}</Text>
                </Text>
                {metric.value2 && (
                  <Text style={styles.metricValue}>
                    {metric.value2}
                    <Text style={styles.metricUnit}> {metric.unit2}</Text>
                  </Text>
                )}
                <Text style={[styles.metricStatus, { color: metric.statusColor }]}>
                  {metric.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNavigation activeTab="measure" />
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31, 86, 97, 0.1)',
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.light.accent,
  },
  tabText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: Colors.light.text,
  },
  addDataButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.accent,
  },
  addDataText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.text,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: '#e5f6fd',
    gap: Spacing.sm,
  },
  alertText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: '#014361',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  metricCard: {
    width: '47%',
    height: 238,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(31, 86, 97, 0.15)',
    backgroundColor: Colors.light.background,
    justifyContent: 'space-between',
  },
  metricCardWide: {
    width: '100%',
  },
  metricHeader: {
    gap: Spacing.sm,
  },
  metricTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
  metricDivider: {
    height: 1,
    backgroundColor: Colors.light.accent,
  },
  metricValues: {
    gap: Spacing.xs,
  },
  metricValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
  metricUnit: {
    fontSize: Typography.fontSize.xs,
  },
  metricStatus: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xs,
  },
});
