/**
 * Connect Apple Health – Intro Screen
 * First screen in the HealthKit onboarding flow.
 * Figma: aiTuki prototype V01, node-id=173-30875 / 173-31263
 * Built from components in @/components/ConnectAppleHealth
 */

import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import ConnectAppleHealthHeader from '@/components/ConnectAppleHealth/ConnectAppleHealthHeader';
import ConnectAppleHealthTitleAboveHero from '@/components/ConnectAppleHealth/ConnectAppleHealthTitleAboveHero';
import ConnectAppleHealthHero from '@/components/ConnectAppleHealth/ConnectAppleHealthHero';
import ConnectAppleHealthContent from '@/components/ConnectAppleHealth/ConnectAppleHealthContent';
import ConnectAppleHealthActions from '@/components/ConnectAppleHealth/ConnectAppleHealthActions';

export default function ConnectAppleHealthScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleConnect = () => {
    router.push('/apple-health-permissions');
  };

  const handleEnterDataManually = () => {
    router.replace('/(tabs)/data');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <ConnectAppleHealthHeader />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <ConnectAppleHealthTitleAboveHero />
        <View style={styles.scrollContentInner}>
          <ConnectAppleHealthHero />
          <ConnectAppleHealthContent />
        </View>
      </ScrollView>
      <ConnectAppleHealthActions
        onConnect={handleConnect}
        onEnterDataManually={handleEnterDataManually}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    overflow: 'visible',
  },
  headerWrapper: {
    zIndex: 10,
    elevation: 10,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.light.background,
    marginTop: Spacing.lg,
    overflow: 'visible',
    zIndex: 0,
  },
  scrollContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl * 2 + Spacing.md,
    alignItems: 'center',
    flexGrow: 0,
  },
  scrollContentInner: {
    width: '100%',
    paddingLeft: Spacing.xl,
    paddingRight: Spacing.xl,
    alignItems: 'flex-start',
    overflow: 'visible',
    flexShrink: 0,
  },
});
