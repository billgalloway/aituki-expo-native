/**
 * Home Screen
 * Shows only Header and BottomNavigation
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <BottomNavigation activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});
