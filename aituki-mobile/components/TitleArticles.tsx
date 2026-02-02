/**
 * TitleArticles – section title for the Articles area (Figma node 668-20891).
 * Matches home section header exactly: sectionHeader + sectionTitle (icon 24px, gap Spacing.sm).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

export interface TitleArticlesProps {
  /** Title text (default: "Articles") */
  title?: string;
  /** Optional icon name (default: "article") */
  icon?: string;
}

export default function TitleArticles({ title = 'Articles', icon = 'article' }: TitleArticlesProps) {
  return (
    <View style={styles.sectionHeader}>
      <IconLibrary iconName={icon as any} size={24} color={Colors.light.text} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
});
