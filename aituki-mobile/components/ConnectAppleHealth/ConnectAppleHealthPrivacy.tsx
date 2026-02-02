/**
 * Connect Apple Health – Privacy note
 * Figma typography body2, centered.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

const PRIVACY_TEXT =
  'Your health data is encrypted and stored securely. We only access the data types you explicitly grant permission for.';

export default function ConnectAppleHealthPrivacy() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{PRIVACY_TEXT}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  text: {
    ...Typography.variants.body2,
    color: Colors.light.textSecondary,
    textAlign: 'left',
  },
});
