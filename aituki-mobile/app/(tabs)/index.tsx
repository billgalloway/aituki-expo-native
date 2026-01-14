/**
 * Home Screen
 * Updated to match Figma design with Stress Parameter, Today's Nudges, Today's Goals, and Smart twin suggestions
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import StressDashboard from '@/components/StressDashboard';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';
import ImageLibrary from '@/components/ImageLibrary';

// Today's Nudges data
const nudges = [
  {
    type: 'Emotional',
    title: 'Mood swings detected',
    action: 'Try 5-min breathing exercise',
    icon: 'favorite',
    backgroundColor: 'rgba(105, 240, 240, 0.08)',
  },
  {
    type: 'Physical',
    title: 'Low movement today',
    action: 'Take a short walk',
    icon: 'fitness-center',
    backgroundColor: 'rgba(105, 240, 240, 0.08)',
  },
  {
    type: 'Mental',
    title: 'Sleep duration below average',
    action: 'Aim for 7+ hrs tonigh',
    icon: 'psychology',
    backgroundColor: 'rgba(105, 240, 240, 0.08)',
  },
  {
    type: 'Energy',
    title: 'High screen time!',
    action: 'Consider a 10-min break',
    icon: 'person',
    backgroundColor: 'rgba(105, 240, 240, 0.08)',
  },
];

// Today's Goals data
const todayGoals = [
  {
    title: 'Meditation',
    time: '20.30',
    timeUnit: 'am',
    description: '15 min relaxation',
    image: ImageLibrary.getSafeTodayImage('meditation'),
    status: 'completed',
  },
  {
    title: 'Perimenapause',
    value: '567',
    status: 'High',
    description: 'Check weekly levels',
    image: ImageLibrary.getSafeTodayImage('perimenopause'),
    isHigh: true,
  },
  {
    title: 'Diet',
    time: '12.30',
    timeUnit: 'am',
    description: '20 min cycling',
    image: ImageLibrary.getSafeTodayImage('diet'),
    status: 'completed',
  },
  {
    title: 'Adaptogen therapy',
    time: '8.30',
    timeUnit: 'am',
    description: 'Reushi mushroom',
    image: ImageLibrary.getSafeTodayImage('therapy'),
    status: 'completed',
  },
  {
    title: 'Exercise',
    time: '12.30',
    timeUnit: 'am',
    description: '20 min cycling',
    image: ImageLibrary.getSafeTodayImage('exercise'),
    status: 'completed',
  },
];

// Smart twin suggestions data
const suggestions = [
  {
    title: 'Hormone therapy',
    description: 'Practical help and advice in transitioning through this challenging period of life',
    rating: 4.5,
    reviews: 145,
    users: 1024,
    image: ImageLibrary.getSafeSuggestionImage('hormoneTherapy'),
  },
  {
    title: 'Managing your weight',
    description: 'Track, monitor, and understand your weight loss. Set realistic goals and timeframes',
    rating: 4.5,
    reviews: 145,
    users: 1024,
    image: ImageLibrary.getSafeSuggestionImage('weightManagement'),
  },
  {
    title: 'Fitness and strength',
    description: 'Track, monitor, and understand your weight loss. Set realistic goals and timeframes',
    rating: 4.5,
    reviews: 145,
    users: 1024,
    image: ImageLibrary.getSafeSuggestionImage('fitness'),
  },
  {
    title: 'Reducing stress',
    description: 'Track, monitor, and understand your weight loss. Set realistic goals and timeframes',
    rating: 4.5,
    reviews: 145,
    users: 1024,
    image: ImageLibrary.getSafeSuggestionImage('stressReduction'),
  },
  {
    title: 'Managing a condition',
    description: 'Track, monitor, and understand your weight loss. Set realistic goals and timeframes',
    rating: 4.5,
    reviews: 145,
    users: 1024,
    image: ImageLibrary.getSafeSuggestionImage('conditionManagement'),
  },
];

export default function HomeScreen() {
  const [showAlert, setShowAlert] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const isInvalidImageUrl = (url: string | undefined): boolean => {
    if (!url || typeof url !== 'string') return true;
    if (imageErrors.has(url)) return true;
    return false;
  };

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <View key={i} style={styles.star}>
          <IconLibrary iconName="star" size={18} color={Colors.light.primaryDark} />
        </View>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <View key="half" style={styles.star}>
          <IconLibrary iconName="star-half" size={18} color={Colors.light.primaryDark} />
        </View>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <View key={`empty-${i}`} style={styles.star}>
          <IconLibrary iconName="star-outline" size={18} color={Colors.light.border} />
        </View>
      );
    }

    return stars;
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Stress Parameter Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconLibrary iconName="psychology" size={24} color={Colors.light.text} />
            <Text style={styles.sectionTitle}>Stress Parameter</Text>
          </View>
          <StressDashboard stressLevel={60} stressLabel="Stress rising" />
        </View>

        {/* Cortisol Alert */}
        {showAlert && (
          <View style={styles.alert}>
            <View style={styles.alertIconContainer}>
              <IconLibrary iconName="warning" size={22} color={Colors.light.warning} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Cortisol elevated!</Text>
              <Text style={styles.alertText}>
                short sleep, low daily movement, a high-stress peak, and very low energy
              </Text>
              <Text style={styles.alertAction}>
                Let's reduce stress with a calming nudge.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.alertCloseButton}
              onPress={() => setShowAlert(false)}>
              <IconLibrary iconName="close" size={20} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
        )}

        {/* Today's Nudges Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconLibrary iconName="psychology" size={24} color={Colors.light.text} />
            <Text style={styles.sectionTitle}>Today's Nudges</Text>
          </View>
          {nudges.map((nudge, index) => (
            <View key={index} style={[styles.nudgeCard, { backgroundColor: nudge.backgroundColor }]}>
              <View style={styles.nudgeIconContainer}>
                <IconLibrary iconName={nudge.icon as any} size={35} color={Colors.light.text} />
              </View>
              <View style={styles.nudgeContent}>
                <Text style={styles.nudgeType}>{nudge.type}</Text>
                <Text style={styles.nudgeTitle}>{nudge.title}</Text>
                <TouchableOpacity style={styles.nudgeButton}>
                  <Text style={styles.nudgeButtonText}>{nudge.action}</Text>
                  <IconLibrary iconName="arrow-forward" size={16} color={Colors.light.text} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Today's Goals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconLibrary iconName="psychology" size={24} color={Colors.light.text} />
            <Text style={styles.sectionTitle}>Today's Goals</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.goalsScroll}>
            {todayGoals.map((goal, index) => (
              <View key={index} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <View style={styles.goalDivider} />
                  <View style={styles.goalDots}>
                    <View style={[styles.dot, { backgroundColor: Colors.light.primary }]} />
                    {goal.isHigh && (
                      <View style={[styles.dot, { backgroundColor: Colors.light.error }]} />
                    )}
                  </View>
                </View>
                {isInvalidImageUrl(goal.image) ? (
                  <View style={[styles.goalImage, styles.imagePlaceholder]}>
                    <IconLibrary iconName="photo" size={32} color={Colors.light.textSecondary} />
                  </View>
                ) : (
                  <Image
                    source={{ uri: goal.image }}
                    style={styles.goalImage}
                    contentFit="cover"
                    transition={200}
                    onError={() => setImageErrors(prev => new Set(prev).add(goal.image))}
                  />
                )}
                <View style={styles.goalFooter}>
                  <Text style={styles.goalValue}>
                    {goal.time || goal.value}
                    {goal.time && <Text style={styles.goalTimeUnit}> {goal.timeUnit}</Text>}
                    {goal.status && (
                      <Text style={[styles.goalStatus, goal.isHigh && styles.goalStatusHigh]}>
                        {' '}{goal.status}
                      </Text>
                    )}
                  </Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.newGoalButton}>
            <Text style={styles.newGoalText}>Create a new goal</Text>
            <IconLibrary iconName="add" size={18} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        {/* Smart Twin Suggestions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconLibrary iconName="psychology" size={24} color={Colors.light.text} />
            <Text style={styles.sectionTitle}>Smart twin suggestions</Text>
          </View>
          {suggestions.map((suggestion, index) => (
            <View key={index} style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                {isInvalidImageUrl(suggestion.image) ? (
                  <View style={[styles.suggestionImage, styles.imagePlaceholder]}>
                    <IconLibrary iconName="photo" size={24} color={Colors.light.textSecondary} />
                  </View>
                ) : (
                  <Image
                    source={{ uri: suggestion.image }}
                    style={styles.suggestionImage}
                    contentFit="cover"
                    transition={200}
                    onError={() => setImageErrors(prev => new Set(prev).add(suggestion.image))}
                  />
                )}
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                  <View style={styles.suggestionRating}>
                    <View style={styles.starsContainer}>
                      {renderStars(suggestion.rating)}
                    </View>
                    <Text style={styles.suggestionReviews}>{suggestion.reviews} reviews</Text>
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
        </View>
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
  section: {
    gap: Spacing.md,
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
  // Alert styles
  alert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff4e5',
    borderWidth: 1,
    borderColor: 'rgba(239, 108, 0, 0.5)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  alertIconContainer: {
    paddingTop: 7,
  },
  alertContent: {
    flex: 1,
    gap: 4,
  },
  alertTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: '#663c00',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  alertText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.regular,
    color: '#663c00',
    lineHeight: 20,
    letterSpacing: 0.4,
  },
  alertAction: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: '#663c00',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  alertCloseButton: {
    padding: 5,
    borderRadius: BorderRadius.round,
  },
  // Nudge card styles
  nudgeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.small,
  },
  nudgeIconContainer: {
    width: 90.905,
    height: 90.905,
    borderRadius: 45.4525,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nudgeContent: {
    flex: 1,
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  nudgeType: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  nudgeTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text,
    lineHeight: 20,
    letterSpacing: 0.4,
  },
  nudgeButton: {
    backgroundColor: Colors.light.primaryLight,
    borderRadius: BorderRadius.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
  },
  nudgeButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: 13,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
    letterSpacing: 0.46,
  },
  // Goal card styles
  goalsScroll: {
    gap: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  goalCard: {
    width: 153,
    height: 238,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.sm,
    padding: 10,
    backgroundColor: Colors.light.background,
    justifyContent: 'space-between',
  },
  goalHeader: {
    gap: Spacing.sm,
  },
  goalTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
    lineHeight: 22.4,
    letterSpacing: 0.15,
  },
  goalDivider: {
    height: 1,
    backgroundColor: Colors.light.primary,
  },
  goalDots: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'flex-end',
  },
  dot: {
    width: 9.618,
    height: 9.618,
    borderRadius: 4.809,
  },
  goalImage: {
    flex: 1,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  goalFooter: {
    gap: 0,
  },
  goalValue: {
    fontFamily: Typography.fontFamily,
    fontSize: 20,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
    lineHeight: 24.7,
    letterSpacing: 0.25,
  },
  goalTimeUnit: {
    fontSize: 12.9,
  },
  goalStatus: {
    fontSize: 12.9,
  },
  goalStatusHigh: {
    color: Colors.light.error,
  },
  goalDescription: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text,
    lineHeight: 20,
    letterSpacing: 0.17,
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
    marginTop: Spacing.md,
  },
  newGoalText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.text,
  },
  // Suggestion card styles
  suggestionCard: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.xs,
    ...Shadows.small,
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
    gap: 4,
  },
  suggestionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
    lineHeight: 24.7,
    letterSpacing: 0.25,
  },
  suggestionRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingTop: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    width: 18,
    height: 18,
  },
  suggestionReviews: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  suggestionUsers: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  suggestionDivider: {
    height: 1,
    backgroundColor: Colors.light.primary,
    marginVertical: Spacing.sm,
  },
  suggestionDescription: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text,
    lineHeight: 20,
    letterSpacing: 0.17,
    paddingTop: Spacing.sm,
  },
  imagePlaceholder: {
    backgroundColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: BorderRadius.sm,
  },
});
