/**
 * Connect Apple Health – Scrollable content (title + description + info)
 * Figma 173-30875. Info component under the text paragraph.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography, Spacing } from '@/constants/theme';
import ConnectAppleHealthInfoNote from './ConnectAppleHealthInfoNote';

const TITLE = 'Connect to Apple Health';
const DESCRIPTION =
  'aiTuki uses this data to generate AI powered help and advice. It can create customised goals that are tailored specifically to you.';

export default function ConnectAppleHealthContent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{TITLE}</Text>
      <View style={styles.descriptionWrap}>
        <Text style={styles.description}>{DESCRIPTION}</Text>
      </View>
      <ConnectAppleHealthInfoNote />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'visible',
    minHeight: Spacing.xl * 6 + Spacing.md,
    flexShrink: 0,
  },
  title: {
    ...Typography.variants.h3,
    textAlign: 'left',
    marginBottom: Spacing.md,
    color: '#1F5661',
  },
  descriptionWrap: {
    width: '100%',
    minHeight: Spacing.xl * 2,
    marginBottom: Spacing.md,
    flexShrink: 0,
  },
  description: {
    ...Typography.variants.body2,
    textAlign: 'left',
    lineHeight: Typography.fontSize.sm * 1.5,
    color: '#1F5661',
  },
});
