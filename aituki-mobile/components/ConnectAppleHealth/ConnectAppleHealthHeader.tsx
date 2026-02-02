/**
 * Connect Apple Health – Header
 * Figma 173-30875: Primary teal bar, back button, centered title.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

const TITLE = 'Connect Apple Health';

export default function ConnectAppleHealthHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View>
      <View style={[styles.statusBarFill, { height: insets.top }]} />
      <View style={styles.wrapper}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <IconLibrary iconName="chevron-left" size={35} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{TITLE}</Text>
          <TouchableOpacity
            style={styles.alertsButton}
            onPress={() => router.push('/alerts-notifications')}
            accessibilityLabel="Alerts"
          >
            <IconLibrary iconName="notifications" size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBarFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.primary,
  },
  wrapper: {
    borderBottomLeftRadius: BorderRadius.full,
    borderBottomRightRadius: BorderRadius.full,
    overflow: 'visible',
    backgroundColor: Colors.light.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  safeArea: {
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.full,
    borderBottomRightRadius: BorderRadius.full,
    overflow: 'visible',
  },
  backButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.variants.h4,
    color: Colors.light.text,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    pointerEvents: 'none',
  },
  alertsButton: {
    padding: Spacing.xs,
    minWidth: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
