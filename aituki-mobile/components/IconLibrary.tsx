/**
 * Icon Library Component
 * Uses Google Material Symbols Rounded exclusively with variable font properties:
 * - Weight: 100
 * - Grade: 200
 * - Optical Size: 20px
 * - Style: Rounded
 * 
 * All icons available at: https://fonts.google.com/icons
 * 
 * Usage:
 *   <IconLibrary iconName="home" size={24} color="#1f5661" />
 *   <IconLibrary iconName="favorite" size={24} color="#ff0000" />
 */

import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { useFonts } from 'expo-font';

interface IconLibraryProps {
  iconName: string;
  size?: number;
  color?: string;
  style?: any;
}

// Map custom icon names to Material Symbols icon names
// You can also use Material Symbol names directly from https://fonts.google.com/icons
const iconNameMap: Record<string, string> = {
  // Navigation
  'home': 'home',
  'menu': 'menu',
  'close': 'close',
  'chevron-right': 'chevron_right',
  'chevron-left': 'chevron_left',
  'expand-more': 'expand_more',
  'settings': 'settings',
  'help': 'help',
  'phone': 'phone',
  'swap-horiz': 'swap_horiz',
  'balance': 'balance',
  'logout': 'logout',
  'more-vert': 'more_vert',
  
  // User & Profile
  'user': 'person',
  'person': 'person',
  'woman': 'woman',
  'jump': 'person',
  
  // Notifications
  'notifications': 'notifications',
  'bell': 'notifications',
  
  // Actions
  'add': 'add',
  'search': 'search',
  'edit': 'edit',
  'send': 'send',
  
  // Health & Wellness
  'target': 'gps_fixed',
  'data': 'bar_chart',
  'heart': 'favorite',
  'heart-rate': 'favorite',
  'workbench': 'dashboard',
  'trace': 'track_changes',
  'watch': 'watch',
  
  // UI Elements
  'calendar-today': 'today',
  'language': 'language',
  'drag-indicator': 'drag_indicator',
  'mic': 'mic',
  'psychology': 'psychology',
  'brain': 'psychology',
  
  // Medical & Fitness
  'local-hospital': 'local_hospital',
  'fitness-center': 'fitness_center',
  'sport': 'directions_run',
  'attachment': 'attach_file',
  'attach-file': 'attach_file',
  'photo': 'photo',
  
  // Additional
  'filter': 'filter_list',
  'check': 'check',
  'check-circle': 'check_circle',
  'info': 'info',
  'warning': 'warning',
  'email': 'email',
  'lock': 'lock',
  'apple': 'apple',
  'google': 'google',
  'arrow_forward': 'arrow_forward',
  'arrow-forward': 'arrow_forward',
  'favorite': 'favorite',
  'pagoda': 'temple_hindu',
  'star': 'star',
  'star-half': 'star_half',
  'star-outline': 'star_border',
  'chat-bubble-outline': 'chat_bubble_outline',
  'refresh': 'refresh',
};

/**
 * Icon Library Component
 * Renders Google Material Symbols Rounded with variable font properties
 * 
 * @param iconName - The Material Symbol name (see https://fonts.google.com/icons)
 *                   Can use custom mapped names or Material Symbol names directly
 * @param size - Icon size in pixels (default: 24)
 * @param color - Icon color (default: '#1f5661')
 * @param style - Additional styles for the container View
 * 
 * Variable Font Settings:
 * - Weight: 100 (lightest)
 * - Grade: 200
 * - Optical Size: 20px
 * - Style: Rounded
 */
export const IconLibrary: React.FC<IconLibraryProps> = ({
  iconName,
  size = 24,
  color = '#1f5661',
  style,
}) => {
  // Load Material Symbols Rounded variable font
  // The font is already in assets/fonts/MaterialSymbolsRounded.ttf
  const [fontsLoaded, fontError] = useFonts({
    'MaterialSymbolsRounded': require('../assets/fonts/MaterialSymbolsRounded.ttf'),
  });

  // Get the Material Symbol name (either mapped or use directly)
  // Material Symbols use snake_case names like "account_circle", "settings", etc.
  const materialSymbolName = iconNameMap[iconName] || iconName;

  // If font not loaded, fallback to MaterialIcons from @expo/vector-icons
  if (!fontsLoaded || fontError) {
    // Fallback: Use MaterialIcons from @expo/vector-icons
    const { MaterialIcons } = require('@expo/vector-icons');
    return (
      <View style={style}>
        <MaterialIcons 
          name={materialSymbolName.replace(/_/g, '-') as any} 
          size={size} 
          color={color}
        />
      </View>
    );
  }

  // Material Symbols use Unicode codepoints in private use area
  // The font has ligatures that convert icon names to glyphs
  // We'll render the icon name directly and let the font handle it
  return (
    <View style={style}>
      <Text
        style={[
          styles.icon,
          {
            fontSize: Math.max(20, size), // Minimum 20px for optical size
            color: color,
            // Variable font settings:
            // - Weight: 100 (lightest stroke)
            // - Grade: 200 (increased thickness without changing footprint)
            // - Optical Size: 20px (optimized for small sizes)
            // - Style: Rounded (handled by font variant)
            ...(Platform.OS === 'ios' || Platform.OS === 'android'
              ? {
                  fontWeight: '100',
                  // fontVariationSettings supported on iOS 12+ and Android 8+
                  fontVariationSettings: "'wght' 100, 'GRAD' 200, 'opsz' 20",
                }
              : {
                  fontWeight: '100',
                }),
          },
        ]}
      >
        {materialSymbolName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontFamily: 'MaterialSymbolsRounded',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});

export default IconLibrary;
