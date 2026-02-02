/**
 * Connect Apple Health – Actions (Figma 173-30875)
 * Rebuilt from Figma: "Ok, lets go" button + "Enter data manually" link.
 * All text uses inline color #1F5661 so theme cannot override.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

/** text/primary – inline so nothing overrides */
const TEXT_PRIMARY = '#1F5661';

const PRIMARY_LABEL = 'Ok, lets go';
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
        <Text style={[styles.primaryText, { color: TEXT_PRIMARY }]}>{PRIMARY_LABEL}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryLink} onPress={onEnterDataManually}>
        <Text style={[styles.secondaryText, { color: TEXT_PRIMARY }]}>{SECONDARY_LABEL}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl + Spacing.sm : Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
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
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    fontWeight: Typography.fontWeight.medium,
  },
  secondaryLink: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
});
