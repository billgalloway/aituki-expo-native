/**
 * Bottom Navigation Component
 * Matches Figma design with 5 tabs
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconLibrary } from './IconLibrary';
import { Colors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useRouter, usePathname, useSegments } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface NavigationItem {
  name: string;
  iconName: string;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { name: 'home', iconName: 'workbench', path: '/' },
  { name: 'target', iconName: 'trace', path: '/goals' },
  { name: 'data', iconName: 'watch', path: '/data' }, // Watch icon for data
  { name: 'measure', iconName: 'heart-rate', path: '/health' },
  { name: 'tuki', iconName: 'jump', path: '/twin' }, // Jump icon for tuki/twin
];

const pathForTab: Record<string, string> = {
  home: '/',
  target: '/goals',
  data: '/data',
  measure: '/health',
  tuki: '/twin',
};

const tabForPath = (pathname: string): string => {
  if (pathname.startsWith('/goals')) return 'target';
  if (pathname.startsWith('/data')) return 'data';
  if (pathname.startsWith('/health')) return 'measure';
  if (pathname.startsWith('/twin')) return 'tuki';
  return 'home';
};

interface BottomNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? Colors.dark : Colors.light;
  const currentTab = activeTab || tabForPath(pathname || segments.join('/'));

  const handleTabPress = (item: NavigationItem) => {
    onTabChange?.(item.name);
    // Use replace for tab switching (avoids stack issues and "page not found")
    const href = item.path === '/' ? '/(tabs)/' : `/(tabs)${item.path}`;
    router.replace(href as any);
  };

  const dynamicStyles = StyleSheet.create({
    shadowContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderTopLeftRadius: BorderRadius.full,
      borderTopRightRadius: BorderRadius.full,
      overflow: 'visible', // Allow shadows to be visible
    },
    shadowLayer1: {
      // First shadow: radius 6px, opacity 0.15 (15%)
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3, // For Android
      borderTopLeftRadius: BorderRadius.full,
      borderTopRightRadius: BorderRadius.full,
      overflow: 'visible',
    },
    shadowLayer2: {
      // Second shadow: radius 2px, opacity 0.25 (25%)
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 2,
      elevation: 2, // For Android
      borderTopLeftRadius: BorderRadius.full,
      borderTopRightRadius: BorderRadius.full,
      overflow: 'visible',
    },
    container: {
      backgroundColor: themeColors.primary,
      borderTopLeftRadius: BorderRadius.full, // 32px top left
      borderTopRightRadius: BorderRadius.full, // 32px top right
      borderBottomLeftRadius: 0, // 0 bottom left
      borderBottomRightRadius: 0, // 0 bottom right
      paddingTop: Spacing.md, // 16px top
      paddingHorizontal: Spacing.lg, // 24px left/right
      paddingBottom: Spacing.sm, // 8px bottom (will be adjusted by safe area insets)
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflow: 'hidden',
    },
    tabButtonActive: {
      backgroundColor: themeColors.primaryDark,
    },
  });

  return (
    <View style={dynamicStyles.shadowContainer}>
      <View style={dynamicStyles.shadowLayer1}>
        <View style={dynamicStyles.shadowLayer2}>
          <View style={[dynamicStyles.container, { paddingBottom: Spacing.sm + insets.bottom }]}>
            {navigationItems.map((item, index) => {
              const isActive = currentTab === item.name;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleTabPress(item)}
                  style={[
                    styles.tabButton,
                    isActive && dynamicStyles.tabButtonActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <IconLibrary
                    iconName={item.iconName}
                    size={24}
                    color={themeColors.text}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    position: 'relative',
    padding: Spacing.sm + 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'transparent',
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomNavigation;

