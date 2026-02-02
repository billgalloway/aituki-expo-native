/**
 * Teardrop logo for loading/splash screen
 * Matches Figma: white teardrop with small inner circle, clean and defined (not blob-like)
 * https://www.figma.com/design/DajMfwAJVdLDj6vjKbWudq/aiTuki-prototype-V01?node-id=788-22077
 *
 * - Sharp point at bottom, rounded at top; small dot in lower half
 * - Very subtle outer glow so it stands out from the overlaid background
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface TeardropLogoProps {
  size?: number;
  color?: string;
}

export default function TeardropLogo({ size = 120, color = '#FFFFFF' }: TeardropLogoProps) {
  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100" style={styles.svg}>
        {/* Teardrop: rounded top, sharp point at bottom (clean, not amorphous) */}
        <Path
          d="M50 5 C90 5 95 48 95 68 C95 94 50 98 50 98 C5 94 5 68 5 48 C5 5 50 5 50 5 Z"
          fill={color}
        />
        {/* Inner dot in lower half (small, not a blob) */}
        <Circle cx={50} cy={62} r={6} fill={color} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    // Figma: "very subtle, almost imperceptible outer glow or shadow" so it stands out
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  svg: {
    overflow: 'visible',
  },
});
