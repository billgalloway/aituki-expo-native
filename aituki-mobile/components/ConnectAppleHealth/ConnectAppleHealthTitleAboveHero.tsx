/**
 * Connect Apple Health – Title above hero image
 * Typography component: "Connect to Apple Health"
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';

const TITLE = 'Connect to Apple Health';

export default function ConnectAppleHealthTitleAboveHero() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{TITLE}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.variants.h5.fontSize,
    fontWeight: Typography.variants.h5.fontWeight,
    lineHeight: 22,
    color: Colors.light.textPrimary,
    textAlign: 'left',
  },
});
