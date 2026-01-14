/**
 * Home Screen
 * Shows hero programs, today activities, and digital twin suggestions
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';
import ImageLibrary from '@/components/ImageLibrary';
import { useHeroPrograms } from '@/hooks/useHeroPrograms';

const todayActivities = [
  {
    title: 'Meditation',
    time: '20.30 am',
    description: '15 min relaxation',
    status: 'completed',
    image: ImageLibrary.getSafeTodayImage('meditation'),
  },
  {
    title: 'Perimenopause',
    value: '567',
    status: 'High',
    description: 'Check weekly levels',
    isHigh: true,
    image: ImageLibrary.getSafeTodayImage('perimenopause'),
  },
  {
    title: 'Diet',
    time: '12.30 am',
    description: '20 min cycling',
    status: 'completed',
    image: ImageLibrary.getSafeTodayImage('diet'),
  },
  {
    title: 'Adaptogen therapy',
    time: '8.30 am',
    description: 'Reishi mushroom',
    status: 'completed',
    image: ImageLibrary.getSafeTodayImage('therapy'),
  },
  {
    title: 'Exercise',
    time: '12.30 am',
    description: '20 min cycling',
    status: 'completed',
    image: ImageLibrary.getSafeTodayImage('exercise'),
  },
];

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

const articles = [
  {
    title: 'Life a healthier life',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    image: ImageLibrary.getSafeProgramImage('healthyLife'),
  },
  {
    title: 'Focus on mental health',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    image: ImageLibrary.getSafeProgramImage('mentalHealth'),
  },
  {
    title: 'Get a good nights sleep',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    image: ImageLibrary.getSafeProgramImage('sleep'),
  },
  {
    title: 'Get stronger',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    image: ImageLibrary.getSafeProgramImage('strength'),
  },
  {
    title: 'Find time to relax',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    image: ImageLibrary.getSafeProgramImage('relax'),
  },
  {
    title: 'Play a sport',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    image: ImageLibrary.getSafeProgramImage('sport'),
  },
  {
    title: 'Be part of a community',
    duration: '8 weeks • Day 15 • 35-45 min pw',
    image: ImageLibrary.getSafeProgramImage('community'),
  },
];

export default function HomeScreen() {
  // Fetch hero programs from Contentful
  const { heroPrograms, loading: heroLoading, error } = useHeroPrograms();
  
  // Track image load errors and invalid URLs
  const [imageErrors, setImageErrors] = React.useState<Set<string>>(new Set());
  
  // Helper to check if URL is invalid
  const isInvalidImageUrl = (url: string | undefined): boolean => {
    if (!url || typeof url !== 'string') {
      return true;
    }
    // Check if URL has been marked as failed
    if (imageErrors.has(url)) {
      return true;
    }
    // Supabase URLs should always be valid
    return false;
  };
  
  // Debug: Log when validation runs
  React.useEffect(() => {
    if (heroPrograms.length > 0) {
      heroPrograms.forEach((program) => {
        const isInvalid = isInvalidImageUrl(program.image);
        if (isInvalid) {
          console.log('🚫 Invalid image URL detected:', program.image);
        }
      });
    }
  }, [heroPrograms]);

  // Debug: Log image URLs to verify they're being loaded
  React.useEffect(() => {
    if (heroPrograms.length > 0) {
      console.log('✅ Hero programs loaded:', heroPrograms.length);
      console.log('Hero images:', heroPrograms.map(p => ({ title: p.title, image: p.image })));
    } else {
      console.warn('⚠️ No hero programs loaded');
    }
    if (error) {
      console.error('❌ Hero programs error:', error);
    }
    console.log('Today images:', todayActivities.map(a => ({ title: a.title, image: a.image })));
    console.log('Suggestion images:', suggestions.map(s => ({ title: s.title, image: s.image })));
  }, [heroPrograms, error]);

  // Diagnostic test - uncomment to test Contentful connection
  // React.useEffect(() => {
  //   import('@/utils/testContentful').then(({ testContentfulConnection }) => {
  //     testContentfulConnection();
  //   });
  // }, []);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Hero Programs - Horizontal Scroll */}
        <View style={styles.heroScrollWrapper}>
          {heroLoading ? (
            <View style={styles.heroLoadingContainer}>
              <ActivityIndicator size="large" color={Colors.light.primary} />
              <Text style={styles.loadingText}>Loading from CMS...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>CMS Error: {error.message}</Text>
              <Text style={styles.errorSubtext}>Showing fallback content</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.heroScrollContainer}
              contentContainerStyle={styles.heroScroll}>
              {heroPrograms.map((program) => (
                <View 
                  key={program.sys.id} 
                  style={styles.heroCardWrapper}
                >
                  <View style={styles.heroCard}>
                    {isInvalidImageUrl(program.image) ? (
                      <View style={[styles.heroImage, styles.imagePlaceholder]}>
                        <IconLibrary iconName="photo" size={48} color={Colors.light.textSecondary} />
                      </View>
                    ) : (
                      <Image
                        source={{ uri: program.image }}
                        style={styles.heroImage}
                        contentFit="cover"
                        transition={200}
                        onError={(error) => {
                          console.error('Image load error:', error, 'URI:', program.image);
                          setImageErrors(prev => new Set(prev).add(program.image));
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', program.image);
                        }}
                        placeholderContentFit="cover"
                        recyclingKey={program.sys.id}
                        cachePolicy="memory-disk"
                      />
                    )}
                    <View style={styles.heroContent}>
                      <View style={styles.heroHeader}>
                        <Text style={styles.heroTitle}>{program.title}</Text>
                        <TouchableOpacity>
                          <IconLibrary iconName="more-vert" size={20} color={Colors.light.text} />
                        </TouchableOpacity>
                      </View>
                      {/* Duration Data - Structured layout matching Figma */}
                      <View style={styles.durationData}>
                        {program.duration > 0 && (
                          <Text style={styles.durationItem}>
                            {program.duration} week{program.duration !== 1 ? 's' : ''}
                          </Text>
                        )}
                        {program.durationDays > 0 && (
                          <>
                            {program.duration > 0 && <Text style={styles.durationSeparator}> • </Text>}
                            <Text style={styles.durationItem}>Day {program.durationDays}</Text>
                          </>
                        )}
                        {program.minPerWeek > 0 && (
                          <>
                            {(program.duration > 0 || program.durationDays > 0) && <Text style={styles.durationSeparator}> • </Text>}
                            <Text style={styles.durationItem}>{program.minPerWeek} min pw</Text>
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Today Section */}
        <View style={styles.todaySectionHeader}>
          <IconLibrary iconName="psychology" size={24} color={Colors.light.text} />
          <Text style={styles.sectionTitle}>Today</Text>
        </View>

        {/* Today Activities - Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.todayScroll}>
          {todayActivities.map((activity, index) => (
            <View key={index} style={styles.todayCardWrapper}>
              <View style={styles.todayCard}>
                <View style={styles.todayHeader}>
                  <Text style={styles.todayTitle}>{activity.title}</Text>
                  <View style={styles.todayDivider} />
                  <View style={styles.todayDots}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                </View>
                {isInvalidImageUrl(activity.image) ? (
                  <View style={[styles.todayImage, styles.imagePlaceholder]}>
                    <IconLibrary iconName="photo" size={32} color={Colors.light.textSecondary} />
                  </View>
                ) : (
                  <Image
                    source={{ uri: activity.image }}
                    style={[styles.todayImage, { backgroundColor: 'transparent' }]}
                    contentFit="contain"
                    transition={200}
                    onError={(error) => {
                      console.error('Today image load error:', error, 'URI:', activity.image);
                      setImageErrors(prev => new Set(prev).add(activity.image));
                    }}
                    onLoad={() => {
                      console.log('Today image loaded successfully:', activity.image);
                    }}
                    placeholderContentFit="contain"
                  />
                )}
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
          <View key={index} style={styles.suggestionCardWrapper}>
            <View style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                {isInvalidImageUrl(suggestion.image) ? (
                  <View style={[styles.suggestionImage, styles.imagePlaceholder]}>
                    <IconLibrary iconName="photo" size={24} color={Colors.light.textSecondary} />
                  </View>
                ) : (
                  <Image
                    source={{ uri: suggestion.image }}
                    style={[styles.suggestionImage, { backgroundColor: 'transparent' }]}
                    contentFit="cover"
                    transition={200}
                    onError={(error) => {
                      console.error('Suggestion image load error:', error, 'URI:', suggestion.image);
                      setImageErrors(prev => new Set(prev).add(suggestion.image));
                    }}
                    onLoad={() => {
                      console.log('Suggestion image loaded successfully:', suggestion.image);
                    }}
                    placeholderContentFit="cover"
                  />
                )}
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
          </View>
        ))}

        {/* Articles Section */}
        {articles.map((article, index) => (
          <View key={index} style={styles.articleCardWrapper}>
            <View style={styles.articleCard}>
              <View style={styles.articleImageContainer}>
                {isInvalidImageUrl(article.image) ? (
                  <View style={[styles.articleImage, styles.imagePlaceholder]}>
                    <IconLibrary iconName="photo" size={48} color={Colors.light.textSecondary} />
                  </View>
                ) : (
                  <Image
                    source={{ uri: article.image }}
                    style={[styles.articleImage, { backgroundColor: 'transparent' }]}
                    contentFit="cover"
                    transition={200}
                    onError={(error) => {
                      console.error('Article image load error:', error, 'URI:', article.image);
                      setImageErrors(prev => new Set(prev).add(article.image));
                    }}
                    onLoad={() => {
                      console.log('Article image loaded successfully:', article.image);
                    }}
                    placeholderContentFit="cover"
                  />
                )}
              </View>
              <View style={styles.articleContent}>
                <View style={styles.articleHeader}>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <TouchableOpacity>
                    <IconLibrary iconName="more-vert" size={20} color={Colors.light.text} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.articleDuration}>{article.duration}</Text>
              </View>
            </View>
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
  heroScrollWrapper: {
    marginBottom: -Spacing.lg, // Remove parent gap spacing below
  },
  heroLoadingContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    gap: Spacing.sm,
  },
  loadingText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    marginTop: Spacing.sm,
  },
  errorContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  errorText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.error,
    textAlign: 'center',
  },
  errorSubtext: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xs,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  heroScrollContainer: {
    marginHorizontal: -Spacing.lg, // Extend to full width, breaking out of parent padding
  },
  heroScroll: {
    gap: Spacing.lg,
    paddingLeft: Spacing.lg, // Maintain initial indentation
    paddingRight: Spacing.lg, // Ensure last card is fully visible
    alignItems: 'flex-start', // Start alignment, cards will naturally size
  },
  heroCardWrapper: {
    width: 345,
    borderRadius: BorderRadius.md,
    // Drop shadow: x0, y0, blur 2px, spread 0 (reduced by 25% again)
    shadowColor: '#000000',
    shadowOpacity: 0.140625, // Reduced by 25% again (0.1875 * 0.75)
    shadowRadius: 2, // Reduced by 25% again (3 * 0.75 = 2.25, rounded to 2)
    elevation: 2, // Reduced by 25% again (3 * 0.75 = 2.25, rounded to 2)
    paddingBottom: 4, // Add padding to allow shadow to show at bottom
    marginBottom: -4, // Compensate for padding to maintain spacing
  },
  heroCard: {
    width: '100%',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(31, 86, 97, 0.15)',
    backgroundColor: Colors.light.background,
    overflow: 'hidden',
    flexDirection: 'column', // Ensure vertical layout
  },
  heroImage: {
    width: '100%',
    height: 170,
    backgroundColor: '#ffffff', // White background to prevent green
  },
  heroContent: {
    padding: Spacing.md,
    paddingTop: Spacing.sm,
    justifyContent: 'space-between', // Space out title and duration
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
  durationData: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  durationItem: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.textSecondary,
  },
  durationSeparator: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    marginHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  todaySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    // 64px total spacing above (heroScrollWrapper cancels parent gap, so set directly)
    marginTop: 8,
    // 32px total spacing below
    paddingBottom: 0, // 8px + 24px (parent gap) = 32px total
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
  todayCardWrapper: {
    width: 153,
    borderRadius: BorderRadius.md,
    // Drop shadow: x0, y0, blur 2px, spread 0 (reduced by 25% again)
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.140625, // Reduced by 25% again (0.1875 * 0.75)
    shadowRadius: 2, // Reduced by 25% again (3 * 0.75 = 2.25, rounded to 2)
    elevation: 2, // Reduced by 25% again (3 * 0.75 = 2.25, rounded to 2)
  },
  todayCard: {
    width: '100%',
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
    backgroundColor: '#ffffff', // White background to prevent green
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
  suggestionCardWrapper: {
    width: '100%',
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    // Drop shadow: x0, y0, blur 2px, spread 0 (reduced by 25% again)
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.140625, // Reduced by 25% again (0.1875 * 0.75)
    shadowRadius: 2, // Reduced by 25% again (3 * 0.75 = 2.25, rounded to 2)
    elevation: 2, // Reduced by 25% again (3 * 0.75 = 2.25, rounded to 2)
  },
  suggestionCard: {
    width: '100%',
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
    backgroundColor: '#ffffff', // White background to prevent green
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
  articleCardWrapper: {
    width: '100%',
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.md, // Match card border radius for shadow
    // Drop shadow: x0, y0, blur 2px, spread 0 (reduced by 25% again)
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.140625, // Reduced by 25% again (0.1875 * 0.75)
    shadowRadius: 2, // Reduced by 25% again (3 * 0.75 = 2.25, rounded to 2)
    elevation: 2, // Reduced by 25% again (3 * 0.75 = 2.25, rounded to 2)
  },
  articleCard: {
    width: '100%',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(31, 86, 97, 0.15)',
    backgroundColor: Colors.light.background,
    overflow: 'hidden',
  },
  articleImageContainer: {
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 170,
    backgroundColor: '#ffffff', // White background to prevent green
  },
  imagePlaceholder: {
    backgroundColor: '#e8e8e8', // Light gray background (darker to be more visible)
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d0d0d0', // Gray border
    borderRadius: BorderRadius.sm,
  },
  articleContent: {
    padding: Spacing.md,
    paddingTop: Spacing.sm,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  articleTitle: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
    marginRight: Spacing.sm,
  },
  articleDuration: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.textSecondary,
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
