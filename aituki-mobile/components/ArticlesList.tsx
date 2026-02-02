/**
 * ArticlesList – vertical list of articles from Contentful CMS
 * Figma node 668-20891: matches Smart twin suggestions card layout exactly
 * (same card, header, image size, title/description/divider styles).
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useArticles } from '@/hooks/useArticles';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

export default function ArticlesList() {
  const { articles, loading, error } = useArticles();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const isInvalidImage = (url: string | undefined) => !url || imageErrors.has(url);

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="small" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Loading articles…</Text>
      </View>
    );
  }

  if (error || !articles?.length) {
    return (
      <View style={styles.fallbackWrap}>
        <Text style={styles.fallbackText}>
          {error ? 'Content unavailable. Showing default articles.' : 'No articles yet.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {articles.map((article) => (
        <View key={article.sys.id} style={styles.suggestionCard}>
          <View style={styles.suggestionHeader}>
            {isInvalidImage(article.image) ? (
              <View style={[styles.suggestionImage, styles.imagePlaceholder]}>
                <IconLibrary iconName="photo" size={24} color={Colors.light.textSecondary} />
              </View>
            ) : (
              <Image
                source={{ uri: article.image }}
                style={styles.suggestionImage}
                contentFit="cover"
                transition={200}
                onError={() => setImageErrors((p) => new Set(p).add(article.image))}
              />
            )}
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionTitle} numberOfLines={2}>{article.title}</Text>
            </View>
            <TouchableOpacity>
              <IconLibrary iconName="more-vert" size={20} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.suggestionDivider} />
          <Text style={styles.suggestionDescription} numberOfLines={2}>
            {article.excerpt || article.title}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
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
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: Typography.fontWeight.medium,
    lineHeight: 24.7,
    letterSpacing: 0.25,
    color: Colors.light.text,
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
  loadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  loadingText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
  },
  fallbackWrap: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  fallbackText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
  },
});
