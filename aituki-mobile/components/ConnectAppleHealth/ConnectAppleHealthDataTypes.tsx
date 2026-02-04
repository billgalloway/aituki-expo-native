/**
 * Connect Apple Health – Data types strip under intro text
 * Figma 173-30875: component under the text (what we'll connect).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

const DATA_TYPES = [
  { icon: 'heart', label: 'Heart' },
  { icon: 'fitness-center', label: 'Activity' },
  { icon: 'watch', label: 'Sleep' },
  { icon: 'data', label: 'Nutrition' },
] as const;

export default function ConnectAppleHealthDataTypes() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>What we'll connect</Text>
      <View style={styles.row}>
        {DATA_TYPES.map(({ icon, label }) => (
          <View key={label} style={styles.item}>
            <View style={styles.iconWrap}>
              <IconLibrary
                iconName={icon}
                size={22}
                color={Colors.light.textPrimary}
              />
            </View>
            <Text style={styles.label}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.variants.body2,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  item: {
    alignItems: 'center',
    minWidth: 72,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    ...Typography.variants.body2,
    color: Colors.light.textPrimary,
    fontSize: 12,
  },
});
