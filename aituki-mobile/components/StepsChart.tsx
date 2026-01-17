/**
 * Steps Chart Component
 * Stacked bar chart matching Figma design with Walking and Running data
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Colors, Typography, Spacing } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

interface StepsChartProps {
  value?: string;
  subtitle?: string;
  walkingData?: number[];
  runningData?: number[];
}

export default function StepsChart({
  value = '56,348',
  subtitle = '15% above average',
  walkingData = [45, 35, 50, 55],
  runningData = [20, 30, 25, 20],
}: StepsChartProps) {
  // Prepare data for stacked bar chart
  // Each bar has two stacks: Walking (bottom) and Running (top)
  const barData = walkingData.map((walkingValue, index) => ({
    stacks: [
      {
        value: walkingValue,
        color: '#7987FF', // Walking color (bottom)
      },
      {
        value: runningData[index],
        color: '#E697FF', // Running color (top)
      },
    ],
    label: '',
    labelTextStyle: {
      color: 'transparent',
      fontSize: 0,
    },
  }));

  // Y-axis labels (from top to bottom: 60, 40, 20, 0)
  const yAxisLabels = ['60', '40', '20', '0'];

  // Calculate chart width based on available space
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - (Spacing.lg * 2) - 48 - Spacing.sm; // Container padding + y-axis + spacing

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Steps</Text>
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
        {/* Y-axis Labels */}
        <View style={styles.yAxisContainer}>
          {yAxisLabels.map((label, index) => (
            <Text key={index} style={styles.yAxisLabel}>
              {label}
            </Text>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chartWrapper}>
          <BarChart
            data={barData}
            width={chartWidth}
            height={180}
            barWidth={12}
            spacing={8}
            roundedTop
            roundedBottom
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            noOfSections={3}
            maxValue={60}
            isAnimated
            animationDuration={800}
            disablePress
            showVerticalLines={false}
            showHorizontalLines={false}
            yAxisTextStyle={{ color: 'transparent', fontSize: 0 }}
            xAxisLabelTextStyle={{ color: 'transparent', fontSize: 0 }}
          />
        </View>
      </View>

      {/* X-axis Labels */}
      <View style={styles.xAxisContainer}>
        {['q1', 'q2', 'q3', 'q4'].map((label, index) => (
          <View key={index} style={styles.xAxisLabelContainer}>
            <Text style={styles.xAxisLabelText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#7987FF' }]} />
          <Text style={styles.legendText}>Walking</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#E697FF' }]} />
          <Text style={styles.legendText}>Running</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#F1F1F1',
    borderRadius: 4,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.light.background,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.variants.h4,
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '500',
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
    color: '#165baa',
    letterSpacing: -1.2,
  },
  subtitleContainer: {
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '400',
    color: Colors.light.text,
  },
  chartContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  yAxisContainer: {
    width: 24,
    justifyContent: 'space-between',
    paddingRight: Spacing.sm,
  },
  yAxisLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: Colors.light.text,
    lineHeight: 15.174,
  },
  chartWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  xAxisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
  },
  xAxisLabelContainer: {
    flex: 1,
    alignItems: 'center',
  },
  xAxisLabelText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '400',
    color: Colors.light.text,
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingTop: Spacing.lg,
    paddingRight: 10,
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
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.text,
  },
});
