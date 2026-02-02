/**
 * HeroScroller – horizontal carousel of hero/articles content.
 * Pulls from Contentful CMS (heroProgram content type); falls back to
 * built-in holding content when Contentful is unavailable or empty.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useHeroPrograms } from '@/hooks/useHeroPrograms';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

const CARD_WIDTH = 220;
const CARD_MARGIN = Spacing.sm;
const CARD_HEIGHT = 160;

export default function HeroScroller() {
  const { heroPrograms, loading, error } = useHeroPrograms();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const isInvalidImageUrl = (url: string | undefined): boolean => {
    if (!url || typeof url !== 'string') return true;
    return imageErrors.has(url);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>Content unavailable. Showing default articles.</Text>
      </View>
    );
  }

  if (!heroPrograms || heroPrograms.length === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>No articles yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {heroPrograms.map((item) => (
        <View key={item.sys.id} style={styles.card}>
          {isInvalidImageUrl(item.image) ? (
            <View style={[styles.cardImage, styles.imagePlaceholder]}>
              <IconLibrary iconName="photo" size={32} color={Colors.light.textSecondary} />
            </View>
          ) : (
            <Image
              source={{ uri: item.image }}
              style={styles.cardImage}
              resizeMode="cover"
              onError={() => setImageErrors((prev) => new Set(prev).add(item.image))}
            />
          )}
          <View style={styles.cardOverlay} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            {item.formattedDuration ? (
              <Text style={styles.cardMeta} numberOfLines={1}>
                {item.formattedDuration}
              </Text>
            ) : null}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: CARD_MARGIN,
    paddingVertical: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.light.border,
    ...Shadows.small,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cardContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: Spacing.md,
  },
  cardTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: Typography.fontWeight.medium,
    lineHeight: 24.7,
    letterSpacing: 0.25,
    color: '#fff',
  },
  cardMeta: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.regular,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    letterSpacing: 0.4,
  },
  imagePlaceholder: {
    backgroundColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
  },
  fallbackContainer: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  fallbackText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
  },
});
