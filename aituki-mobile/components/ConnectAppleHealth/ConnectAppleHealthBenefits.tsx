/**
 * Connect Apple Health – Benefits list
 * Checkmark list of benefits (Figma typography body1).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

const BENEFITS = [
  'Automatic data sync from your iPhone',
  'Comprehensive health tracking',
  'Personalized insights and recommendations',
  'Secure and private data handling',
] as const;

export default function ConnectAppleHealthBenefits() {
  return (
    <View style={styles.container}>
      {BENEFITS.map((text, index) => (
        <View key={index} style={styles.item}>
          <IconLibrary iconName="check" size={20} color={Colors.light.textPrimary} />
          <Text style={styles.text}>{text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  text: {
    ...Typography.variants.body1,
    color: Colors.light.textPrimary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
});
