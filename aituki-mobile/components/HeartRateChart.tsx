/**
 * Heart Rate Chart Component
 * Line chart matching Figma design with time-based x-axis
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

interface HeartRateChartProps {
  value?: string;
  subtitle?: string;
  timeLabels?: string[];
  heartRateData?: number[];
}

export default function HeartRateChart({
  value = '102',
  subtitle = '15% above average',
  timeLabels = ['08:00', '10:00', '12:00', '14:00', '16:00'],
  heartRateData = [85, 95, 102, 98, 105],
}: HeartRateChartProps) {
  // Prepare data for line chart
  const lineData = heartRateData.map((value, index) => ({
    value,
    label: '',
    labelTextStyle: {
      color: 'transparent',
      fontSize: 0,
    },
  }));

  // Calculate chart width based on available space
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - (Spacing.xl * 2); // Account for padding

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Average Heart Rate</Text>
        <IconLibrary iconName="more-vert" size={24} color={Colors.light.text} />
      </View>

      {/* Main Value */}
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Chart Container */}
      <View style={styles.chartContainer}>
        <LineChart
          data={lineData}
          width={chartWidth}
          height={180}
          color={Colors.light.primaryDark}
          thickness={2}
          hideRules
          yAxisThickness={0}
          xAxisThickness={0}
          hideYAxisText
          spacing={chartWidth / (lineData.length - 1) - 20}
          curved
          isAnimated
          animationDuration={800}
          areaChart
          startFillColor={Colors.light.primaryDark}
          endFillColor={Colors.light.primary || '#E0F5F5'}
          startOpacity={0.3}
          endOpacity={0}
        />
      </View>

      {/* X-axis Labels */}
      <View style={styles.xAxisContainer}>
        {timeLabels.map((label, index) => (
          <View key={index} style={styles.xAxisLabelContainer}>
            <Text style={[
              styles.xAxisLabelText,
              index === 2 && styles.xAxisLabelInactive
            ]}>
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.variants.h4,
    color: Colors.light.text,
    fontSize: 16,
  },
  valueContainer: {
    height: 48,
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  value: {
    fontFamily: 'Poppins',
    fontSize: 32,
    fontWeight: '400',
    color: Colors.light.primaryDark,
    letterSpacing: -1.2,
  },
  subtitleContainer: {
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '400',
    color: Colors.light.textSecondary,
  },
  chartContainer: {
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  xAxisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
  },
  xAxisLabelContainer: {
    flex: 1,
    alignItems: 'center',
  },
  xAxisLabelText: {
    fontFamily: Typography.fontFamily,
    fontSize: 14,
    fontWeight: '400',
    color: '#1a9392',
    lineHeight: 20,
    letterSpacing: 0.17,
  },
  xAxisLabelInactive: {
    color: Colors.light.textSecondary,
  },
});
