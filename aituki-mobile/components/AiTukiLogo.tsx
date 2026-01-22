/**
 * AiTuki Logo Component
 * Matches Figma design system logo component
 * Uses logo asset image from Figma
 */

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface AiTukiLogoProps {
  height?: number;
  width?: number;
}

export default function AiTukiLogo({ 
  height = 40.529,
  width = 100,
}: AiTukiLogoProps) {
  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/icon.png')}
        style={[styles.logo, { width, height }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    // Logo asset will maintain its aspect ratio via resizeMode="contain"
  },
});

