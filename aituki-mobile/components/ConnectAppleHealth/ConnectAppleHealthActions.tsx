/**
 * Connect Apple Health – Action buttons
 * Primary: Connect Apple Health | Secondary: Enter data manually
 * Figma 173-30875.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

const PRIMARY_LABEL = 'Connect Apple Health';
const SECONDARY_LABEL = 'Enter data manually';

type Props = {
  onConnect: () => void;
  onEnterDataManually: () => void;
};

export default function ConnectAppleHealthActions({
  onConnect,
  onEnterDataManually,
}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.primaryButton} onPress={onConnect}>
        <Text style={styles.primaryText}>{PRIMARY_LABEL}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={onEnterDataManually}>
        <Text style={styles.secondaryText}>{SECONDARY_LABEL}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  primaryText: {
    ...Typography.variants.subtitle1,
    color: Colors.light.text,
  },
  secondaryButton: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    ...Typography.variants.body2,
    color: Colors.light.textSecondary,
  },
});
