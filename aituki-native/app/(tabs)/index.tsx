/**
 * Home Screen
 * Shows hero programs, today activities, and digital twin suggestions
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';
import ImageLibrary from '@/components/ImageLibrary';

const heroPrograms = [
  {
    title: 'Perimenopause tracking',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    image: ImageLibrary.hero.perimenopause,
  },
  {
    title: 'Yoga and Pilates',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    image: ImageLibrary.hero.yoga,
  },
  {
    title: 'Mindfulness or meditation',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    image: ImageLibrary.hero.mindfulness,
  },
  {
    title: 'Meal planning & Mindful eating',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    image: ImageLibrary.hero.mealPlanning,
  },
  {
    title: 'Sleep routine',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    image: ImageLibrary.hero.sleep,
  },
  {
    title: 'Symptom tracking',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    image: ImageLibrary.hero.symptomTracking,
  },
];

const todayActivities = [
  {
    title: 'Meditation',
    time: '20.30 am',
    description: '15 min relaxation',
    status: 'completed',
    image: ImageLibrary.today.meditation,
  },
  {
    title: 'Perimenopause',
    value: '567',
    status: 'High',
    description: 'Check weekly levels',
    isHigh: true,
    image: ImageLibrary.today.perimenopause,
  },
  {
    title: 'Diet',
    time: '12.30 am',
    description: '20 min cycling',
    status: 'completed',
    image: ImageLibrary.today.diet,
  },
  {
    title: 'Adaptogen therapy',
    time: '8.30 am',
    description: 'Reishi mushroom',
    status: 'completed',
    image: ImageLibrary.today.therapy,
  },
  {
    title: 'Exercise',
    time: '12.30 am',
    description: '20 min cycling',
    status: 'completed',
    image: ImageLibrary.today.exercise,
  },
];

const suggestions = [
  {
    title: 'Hormone therapy',
    description: 'Practical help and advice in transitioning through this challenging period of life',
    rating: 4.5,
    reviews: 145,
    users: 1024,
    image: ImageLibrary.suggestions.hormoneTherapy,
  },
  {
    title: 'Managing your weight',
    description: 'Track, monitor, and understand your weight loss. Set realistic goals and timeframes',
    rating: 4.5,
    reviews: 145,
    users: 1024,
    image: ImageLibrary.suggestions.weightManagement,
  },
  {
    title: 'Fitness and strength',
    description: 'Track, monitor, and understand your weight loss. Set realistic goals and timeframes',
    rating: 4.5,
    reviews: 145,
    users: 1024,
    image: ImageLibrary.suggestions.fitness,
  },
  {
    title: 'Reducing stress',
    description: 'Track, monitor, and understand your weight loss. Set realistic goals and timeframes',
    rating: 4.5,
    reviews: 145,
    users: 1024,
    image: ImageLibrary.suggestions.stressReduction,
  },
  {
    title: 'Managing a condition',
    description: 'Track, monitor, and understand your weight loss. Set realistic goals and timeframes',
    rating: 4.5,
    reviews: 145,
    users: 1024,
    image: ImageLibrary.suggestions.conditionManagement,
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Hero Programs - Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.heroScroll}>
          {heroPrograms.map((program, index) => (
            <View key={index} style={styles.heroCard}>
              <Image
                source={{ uri: program.image }}
                style={styles.heroImage}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.heroContent}>
                <View style={styles.heroHeader}>
                  <Text style={styles.heroTitle}>{program.title}</Text>
                  <TouchableOpacity>
                    <IconLibrary iconName="more-vert" size={20} color={Colors.light.text} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.heroDuration}>{program.duration}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Today Section */}
        <View style={styles.sectionHeader}>
          <IconLibrary iconName="psychology" size={24} color={Colors.light.text} />
          <Text style={styles.sectionTitle}>Today</Text>
        </View>

        {/* Today Activities - Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.todayScroll}>
          {todayActivities.map((activity, index) => (
            <View key={index} style={styles.todayCard}>
              <View style={styles.todayHeader}>
                <Text style={styles.todayTitle}>{activity.title}</Text>
                <View style={styles.todayDivider} />
                <View style={styles.todayDots}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              </View>
              <Image
                source={{ uri: activity.image }}
                style={styles.todayImage}
                contentFit="contain"
                transition={200}
              />
              <View style={styles.todayFooter}>
                <Text style={[styles.todayValue, activity.isHigh && styles.todayValueHigh]}>
                  {activity.time || activity.value}
                  {activity.status && (
                    <Text style={styles.todayStatus}> {activity.status}</Text>
                  )}
                </Text>
                <Text style={styles.todayDescription}>{activity.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Create New Goal Button */}
        <TouchableOpacity style={styles.newGoalButton}>
          <Text style={styles.newGoalText}>Create a new goal</Text>
          <IconLibrary iconName="add" size={18} color={Colors.light.text} />
        </TouchableOpacity>

        {/* Digital Twin Suggestions Section */}
        <View style={styles.sectionHeader}>
          <IconLibrary iconName="psychology" size={24} color={Colors.light.text} />
          <Text style={styles.sectionTitle}>Digital twin suggestions</Text>
        </View>

        {/* Suggestion Cards - Text-based cards only (matching Figma ContentCards) */}
        {suggestions.map((suggestion, index) => (
          <View key={index} style={styles.suggestionCard}>
            <View style={styles.suggestionHeader}>
              <Image
                source={{ uri: suggestion.image }}
                style={styles.suggestionImage}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.suggestionContent}>
                <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                <View style={styles.suggestionRating}>
                  <Text style={styles.suggestionRatingText}>
                    ⭐ {suggestion.rating} • {suggestion.reviews} reviews
                  </Text>
                </View>
                <Text style={styles.suggestionUsers}>Used by {suggestion.users} people</Text>
              </View>
              <TouchableOpacity>
                <IconLibrary iconName="more-vert" size={20} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.suggestionDivider} />
            <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
          </View>
        ))}

        {/* View All Articles Button */}
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all articles</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavigation activeTab="home" />
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
  heroScroll: {
    gap: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  heroCard: {
    width: 345,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(31, 86, 97, 0.15)',
    backgroundColor: Colors.light.background,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: 170,
  },
  heroContent: {
    padding: Spacing.md,
    paddingTop: Spacing.sm,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  heroTitle: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
    marginRight: Spacing.sm,
  },
  heroDuration: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
  todayScroll: {
    gap: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  todayCard: {
    width: 153,
    height: 250,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(31, 86, 97, 0.15)',
    backgroundColor: Colors.light.background,
    justifyContent: 'space-between',
  },
  todayHeader: {
    gap: Spacing.sm,
  },
  todayTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
  todayDivider: {
    height: 1,
    backgroundColor: Colors.light.primary,
  },
  todayDots: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'flex-end',
  },
  dot: {
    width: 9.618,
    height: 9.618,
    borderRadius: 4.809,
    backgroundColor: Colors.light.primary,
  },
  todayImage: {
    flex: 1,
    marginVertical: Spacing.sm,
  },
  todayFooter: {
    gap: Spacing.xs,
  },
  todayValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
  todayValueHigh: {
    color: '#d32f2f',
  },
  todayStatus: {
    fontSize: Typography.fontSize.xs,
  },
  todayDescription: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.text,
  },
  newGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.background,
  },
  newGoalText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.text,
  },
  suggestionCard: {
    padding: Spacing.md,
    paddingTop: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(31, 86, 97, 0.15)',
    backgroundColor: Colors.light.background,
    gap: Spacing.sm,
  },
  suggestionHeader: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  suggestionImage: {
    width: 71.718,
    height: 74.341,
    borderRadius: BorderRadius.sm,
  },
  suggestionContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  suggestionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
  suggestionRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  suggestionRatingText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.textSecondary,
  },
  suggestionUsers: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.textSecondary,
  },
  suggestionDivider: {
    height: 1,
    backgroundColor: Colors.light.primary,
    marginVertical: Spacing.sm,
  },
  suggestionDescription: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.text,
    lineHeight: 20,
    paddingTop: Spacing.sm,
  },
  viewAllButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  viewAllText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.text,
    fontWeight: Typography.fontWeight.regular,
  },
});
