/**
 * Connect Apple Health – Scrollable content
 * Title, description, benefits list, privacy note.
 * Figma 173-30875 typography.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import ConnectAppleHealthDataTypes from './ConnectAppleHealthDataTypes';
import ConnectAppleHealthBenefits from './ConnectAppleHealthBenefits';
import ConnectAppleHealthPrivacy from './ConnectAppleHealthPrivacy';

const TITLE = 'Connect Apple Health';
const DESCRIPTION =
  'Connect your Apple Health data to get personalized insights and track your wellbeing across physical, emotional, mental, and energy pillars.';

export default function ConnectAppleHealthContent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{TITLE}</Text>
      <Text style={styles.description}>{DESCRIPTION}</Text>
      <ConnectAppleHealthDataTypes />
      <ConnectAppleHealthBenefits />
      <ConnectAppleHealthPrivacy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'visible',
  },
  title: {
    ...Typography.variants.h3,
    color: Colors.light.text,
    textAlign: 'left',
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.variants.body1,
    color: Colors.light.textSecondary,
    textAlign: 'left',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    lineHeight: 24,
  },
});
