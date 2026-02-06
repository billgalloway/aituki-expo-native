/**
 * Victory Native charts for Android
 * Replaces react-native-gifted-charts which crashes on Android
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  CartesianChart,
  Line,
  StackedBar,
  PolarChart,
  Pie,
} from 'victory-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

// --- Physical Score (circular progress using Pie) ---
interface PhysicalScoreChartAndroidProps {
  score?: number;
  subtitle?: string;
  percentage?: number;
  label?: string;
}

export function PhysicalScoreChartAndroid({
  score = 179,
  subtitle = 'Last 7 days',
  percentage = 56,
  label = 'Good week',
}: PhysicalScoreChartAndroidProps) {
  const safePercentage = Math.max(0, Math.min(100, percentage ?? 56));
  const pieData = [
    { label: 'progress', value: safePercentage, color: Colors.light.primary },
    {
      label: 'remainder',
      value: 100 - safePercentage,
      color: Colors.light.primaryLight || '#E0E0E0',
    },
  ];

  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.header}>
        <Text style={chartStyles.title}>Physical score</Text>
        <IconLibrary iconName="more-vert" size={24} color={Colors.light.text} />
      </View>
      <View style={chartStyles.valueContainer}>
        <Text style={chartStyles.value}>{score}</Text>
      </View>
      <View style={chartStyles.subtitleContainer}>
        <Text style={chartStyles.subtitle}>{subtitle}</Text>
      </View>
      <View style={chartStyles.chartWrapper}>
        <PolarChart
          data={pieData}
          colorKey="color"
          labelKey="label"
          valueKey="value"
          containerStyle={{ width: 148, height: 148 }}
        >
          <Pie.Chart innerRadius="60%" startAngle={-90} />
        </PolarChart>
        <View style={chartStyles.centerContent} pointerEvents="none">
          <Text style={chartStyles.centerLabel}>{label}</Text>
          <Text style={chartStyles.centerPercentage}>{safePercentage}%</Text>
        </View>
      </View>
    </View>
  );
}

// --- Steps (stacked bar) ---
interface StepsChartAndroidProps {
  value?: string;
  subtitle?: string;
  walkingData?: number[];
  runningData?: number[];
}

export function StepsChartAndroid({
  value = '0',
  subtitle = '15% above average',
  walkingData = [45, 35, 50, 55],
  runningData = [20, 30, 25, 20],
}: StepsChartAndroidProps) {
  const walking = walkingData?.slice(0, 4) ?? [0, 0, 0, 0];
  const running = runningData?.slice(0, 4) ?? [0, 0, 0, 0];
  const data = [0, 1, 2, 3].map((i) => ({
    quarter: i,
    walking: walking[i] ?? 0,
    running: running[i] ?? 0,
  }));

  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.header}>
        <Text style={chartStyles.title}>Steps</Text>
        <IconLibrary iconName="more-vert" size={24} color={Colors.light.text} />
      </View>
      <View style={chartStyles.valueContainer}>
        <Text style={chartStyles.valueSteps}>{value}</Text>
      </View>
      <View style={chartStyles.subtitleContainer}>
        <Text style={chartStyles.subtitle}>{subtitle}</Text>
      </View>
      <View style={chartStyles.chartArea}>
        <CartesianChart
          data={data}
          xKey="quarter"
          yKeys={['walking', 'running']}
          domainPadding={{ left: 20, right: 20, top: 10, bottom: 10 }}
        >
          {({ points, chartBounds }) => (
            <StackedBar
              points={[points.walking, points.running]}
              chartBounds={chartBounds}
              colors={['#7987FF', '#E697FF']}
            />
          )}
        </CartesianChart>
      </View>
      <View style={chartStyles.xAxisContainer}>
        {['q1', 'q2', 'q3', 'q4'].map((l, i) => (
          <View key={i} style={chartStyles.xAxisLabel}>
            <Text style={chartStyles.xAxisText}>{l}</Text>
          </View>
        ))}
      </View>
      <View style={chartStyles.legend}>
        <View style={chartStyles.legendItem}>
          <View style={[chartStyles.legendDot, { backgroundColor: '#7987FF' }]} />
          <Text style={chartStyles.legendText}>Walking</Text>
        </View>
        <View style={chartStyles.legendItem}>
          <View style={[chartStyles.legendDot, { backgroundColor: '#E697FF' }]} />
          <Text style={chartStyles.legendText}>Running</Text>
        </View>
      </View>
    </View>
  );
}

// --- Heart Rate (line chart) ---
interface HeartRateChartAndroidProps {
  value?: string;
  subtitle?: string;
  timeLabels?: string[];
  heartRateData?: number[];
}

export function HeartRateChartAndroid({
  value = '0',
  subtitle = '15% above average',
  timeLabels = ['08:00', '10:00', '12:00', '14:00', '16:00'],
  heartRateData = [85, 95, 102, 98, 105],
}: HeartRateChartAndroidProps) {
  const safeData = heartRateData?.slice(0, 5) ?? [0, 0, 0, 0, 0];
  const data = safeData.map((v, i) => ({
    index: i,
    heartRate: typeof v === 'number' && !Number.isNaN(v) ? v : 0,
  }));

  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.header}>
        <Text style={chartStyles.title}>Average Heart Rate</Text>
        <IconLibrary iconName="more-vert" size={24} color={Colors.light.text} />
      </View>
      <View style={chartStyles.valueContainer}>
        <Text style={chartStyles.valueHeartRate}>{value}</Text>
      </View>
      <View style={chartStyles.subtitleContainer}>
        <Text style={chartStyles.subtitle}>{subtitle}</Text>
      </View>
      <View style={chartStyles.chartArea}>
        <CartesianChart
          data={data}
          xKey="index"
          yKeys={['heartRate']}
          domainPadding={{ left: 20, right: 20, top: 10, bottom: 10 }}
        >
          {({ points }) => (
            <Line
              points={points.heartRate}
              color={Colors.light.primaryDark}
              strokeWidth={2}
            />
          )}
        </CartesianChart>
      </View>
      <View style={chartStyles.xAxisContainer}>
        {timeLabels.map((l, i) => (
          <View key={i} style={chartStyles.xAxisLabel}>
            <Text style={[chartStyles.xAxisText, i === 2 && { color: Colors.light.textSecondary }]}>
              {l}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: Colors.light.background,
    borderRadius: 4,
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
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
    color: Colors.light.primary,
    letterSpacing: -1.2,
  },
  valueSteps: {
    fontFamily: Typography.fontFamily,
    fontSize: 32,
    fontWeight: '400',
    color: '#165baa',
    letterSpacing: -1.2,
  },
  valueHeartRate: {
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
    color: Colors.light.text,
  },
  chartWrapper: {
    width: 148,
    height: 148,
    alignSelf: 'center',
    position: 'relative',
  },
  centerContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 4,
  },
  centerPercentage: {
    fontFamily: Typography.fontFamily,
    fontSize: 20,
    fontWeight: '500',
    color: Colors.light.text,
  },
  chartArea: {
    height: 180,
    marginBottom: Spacing.sm,
  },
  xAxisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },
  xAxisLabel: {
    flex: 1,
    alignItems: 'center',
  },
  xAxisText: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    fontWeight: '400',
    color: '#1a9392',
  },
  legend: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.text,
  },
});
