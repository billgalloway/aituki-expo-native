/**
 * Heart Rate Chart Component
 * Line chart matching Figma design with time-based x-axis
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

interface HeartRateChartProps {
  value?: string;
  subtitle?: string;
  timeLabels?: string[];
  heartRateData?: number[];
}

const DEFAULT_HEART_RATE = [85, 95, 102, 98, 105];
const DEFAULT_TIME_LABELS = ['08:00', '10:00', '12:00', '14:00', '16:00'];

export default function HeartRateChart({
  value = '102',
  subtitle = '15% above average',
  timeLabels = DEFAULT_TIME_LABELS,
  heartRateData = DEFAULT_HEART_RATE,
}: HeartRateChartProps) {
  // Ensure we have at least 2 data points (required for line chart; avoids division by zero in spacing)
  const safeData = Array.isArray(heartRateData) && heartRateData.length >= 2
    ? heartRateData
    : DEFAULT_HEART_RATE;

  // Prepare data for line chart
  const lineData = safeData.map((val) => ({
    value: typeof val === 'number' && !Number.isNaN(val) ? val : 0,
    label: '',
    labelTextStyle: {
      color: 'transparent',
      fontSize: 0,
    },
  }));

  // Calculate chart width and spacing; avoid division by zero when lineData.length < 2
  // Android: Dimensions can return 0 before layout; use fallback
  const rawWidth = Dimensions.get('window').width;
  const screenWidth = rawWidth > 0 ? rawWidth : 360;
  const chartWidth = Math.max(200, screenWidth - (Spacing.xl * 2));
  const spacingDivisor = Math.max(1, lineData.length - 1);
  const spacing = chartWidth / spacingDivisor - 20;

  const isAndroid = Platform.OS === 'android';

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

      {/* Chart Container - minWidth on Android prevents layout collapse */}
      <View style={[styles.chartContainer, isAndroid && styles.chartContainerAndroid]}>
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
          spacing={Math.max(8, spacing)}
          curved={!isAndroid}
          isAnimated={!isAndroid}
          animationDuration={800}
          areaChart={!isAndroid}
          {...(!isAndroid && {
            startFillColor: Colors.light.primaryDark,
            endFillColor: Colors.light.primary || '#E0F5F5',
            startOpacity: 0.3,
            endOpacity: 0,
          })}
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
    fontFamily: Typography.fontFamily,
    fontSize: 32,
    fontWeight: '400',
    color: Colors.light.primaryDark,
    letterSpacing: -1.2,
  },
  subtitleContainer: {
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.light.textSecondary,
  },
  chartContainer: {
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  chartContainerAndroid: {
    minWidth: 280,
    overflow: 'hidden' as const,
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
