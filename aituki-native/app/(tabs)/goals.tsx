/**
 * Goals Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Colors, Typography, Spacing } from '@/constants/theme';

export default function GoalsScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Goals</Text>
        <Text style={styles.subtitle}>Your goals and progress will appear here</Text>
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
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xl,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.light.textSecondary,
  },
});

