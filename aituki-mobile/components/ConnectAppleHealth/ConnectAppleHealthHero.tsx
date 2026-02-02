/**
 * Connect Apple Health – Hero image
 * Figma healthScreen.png (ImageLibrary.misc.healthScreen)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Spacing } from '@/constants/theme';
import ImageLibrary from '@/components/ImageLibrary';

export default function ConnectAppleHealthHero() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: ImageLibrary.getSafeMiscImage('healthScreen') }}
        style={styles.image}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  image: {
    width: '100%',
    maxWidth: 400,
    aspectRatio: 345 / 337,
  },
});
