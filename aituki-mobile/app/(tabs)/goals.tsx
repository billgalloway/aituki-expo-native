/**
 * Goals Screen
 * Shows user goals with progress tracking
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

const goals = [
  {
    title: 'Live a healthier life',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    progress: 75,
    daysRemaining: 41,
  },
  {
    title: 'Focus on mental health',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    progress: 60,
    daysRemaining: 22,
  },
  {
    title: 'Get a good nights sleep',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    progress: 85,
    daysRemaining: 8,
  },
  {
    title: 'Get stronger',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    progress: 45,
    daysRemaining: 31,
  },
  {
    title: 'Find time to relax',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    progress: 30,
    daysRemaining: 38,
  },
];

export default function GoalsScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Set New Goal Button */}
        <TouchableOpacity style={styles.newGoalButton}>
          <Text style={styles.newGoalText}>Set a new goal</Text>
          <IconLibrary iconName="add" size={20} color={Colors.light.text} />
        </TouchableOpacity>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Set achievable goals</Text>
          <Text style={styles.infoText}>
            Tuki can help you to create any type of personal goal. We can create bespoke digital twin
            functionality for almost any health objective.
          </Text>
        </View>

        {/* Goals List */}
        {goals.map((goal, index) => (
          <View key={index} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalDuration}>{goal.duration}</Text>
              </View>
              <TouchableOpacity>
                <IconLibrary iconName="more-vert" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={styles.progressValue}>{goal.progress}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${goal.progress}%` }]} />
              </View>
            </View>

            <Text style={styles.daysRemaining}>{goal.daysRemaining} days remaining</Text>
          </View>
        ))}
      </ScrollView>
      <BottomNavigation activeTab="target" />
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
    gap: Spacing.lg,
  },
  newGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.background,
  },
  newGoalText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
  infoCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(31, 86, 97, 0.15)',
    backgroundColor: Colors.light.background,
  },
  infoTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  goalCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(31, 86, 97, 0.15)',
    backgroundColor: Colors.light.background,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: Typography.fontWeight.medium,
    lineHeight: 24.7,
    letterSpacing: 0.25,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  goalDuration: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.textSecondary,
  },
  progressContainer: {
    gap: Spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xs,
    color: Colors.light.textSecondary,
  },
  progressValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(31, 86, 97, 0.1)',
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.sm,
  },
  daysRemaining: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
  },
});
