/**
 * Connect Apple Health – Info note (Figma 173-30875)
 * Rebuilt from Figma: circular "i" + "aiTuki works best with access to apple health".
 * Uses inline color #1F5661 so theme cannot override.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

const INFO_NOTE = "aiTuki works best with access to apple health";

/** text/primary – inline so nothing overrides */
const TEXT_PRIMARY = '#1F5661';

export default function ConnectAppleHealthInfoNote() {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Text style={[styles.iconText, { color: Colors.light.background }]}>i</Text>
      </View>
      <Text style={[styles.label, { color: TEXT_PRIMARY }]}>{INFO_NOTE}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    width: '100%',
  },
  iconWrap: {
    width: Spacing.lg,
    height: Spacing.lg,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  iconText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  label: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: '400',
    lineHeight: 20,
  },
});
