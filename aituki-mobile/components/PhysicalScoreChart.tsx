/**
 * Physical Score Chart Component
 * Circular progress chart matching Figma design
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

interface PhysicalScoreChartProps {
  score?: number;
  subtitle?: string;
  percentage?: number;
  label?: string;
}

export default function PhysicalScoreChart({
  score = 179,
  subtitle = 'Last 7 days',
  percentage = 56,
  label = 'Good week',
}: PhysicalScoreChartProps) {
  const size = 148;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = percentage / 100;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Physical score</Text>
        <IconLibrary iconName="more-vert" size={24} color={Colors.light.text} />
      </View>

      {/* Main Value */}
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{score}</Text>
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Circular Progress Chart */}
      <View style={styles.chartContainer}>
        <View style={styles.chartWrapper}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={Colors.light.primaryLight || '#E0E0E0'}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={Colors.light.primary}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          {/* Center content */}
          <View style={styles.centerContent}>
            <Text style={styles.centerLabel}>{label}</Text>
            <Text style={styles.centerPercentage}>{percentage}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.light.background,
    borderRadius: 4,
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
  subtitleContainer: {
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.light.text,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  chartWrapper: {
    width: 148,
    height: 148,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.light.text,
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: 4,
  },
  centerPercentage: {
    fontFamily: Typography.fontFamily,
    fontSize: 20,
    fontWeight: '500',
    color: Colors.light.text,
    lineHeight: 24.7,
  },
});

