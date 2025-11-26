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

interface NavigationItem {
  name: string;
  iconName: string;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { name: 'home', iconName: 'home', path: '/' },
  { name: 'target', iconName: 'target', path: '/goals' },
  { name: 'data', iconName: 'data', path: '/data' },
  { name: 'measure', iconName: 'heart', path: '/health' },
  { name: 'tuki', iconName: 'person', path: '/twin' },
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
  const currentTab = activeTab || tabForPath(pathname || segments.join('/'));

  const handleTabPress = (item: NavigationItem) => {
    onTabChange?.(item.name);
    // Navigate to the tab route
    if (item.path === '/') {
      router.push('/(tabs)/' as any);
    } else {
      router.push(`/(tabs)${item.path}` as any);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {navigationItems.map((item, index) => {
        const isActive = currentTab === item.name;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleTabPress(item)}
            style={[
              styles.tabButton,
              isActive && styles.tabButtonActive,
            ]}
            activeOpacity={0.7}
          >
            <IconLibrary
              iconName={item.iconName}
              size={24}
              color={Colors.light.text}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.primary,
    borderTopLeftRadius: BorderRadius.full,
    borderTopRightRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.medium,
  },
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
  tabButtonActive: {
    backgroundColor: Colors.light.primaryDark,
  },
});

export default BottomNavigation;

