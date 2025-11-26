/**
 * Icon Library Component
 * Maps icon names to Material Icons or custom icons
 */

import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { IconSymbol } from './ui/icon-symbol';

interface IconLibraryProps {
  iconName: string;
  size?: number;
  color?: string;
  style?: any;
}

// Icon name mapping to Material Icons
const iconMap: Record<string, string> = {
  // Navigation
  home: 'home',
  menu: 'menu',
  close: 'close',
  'chevron-right': 'chevron-right',
  'more-vert': 'more-vert',
  
  // Actions
  plus: 'add',
  search: 'search',
  filter: 'filter-list',
  settings: 'settings',
  
  // Health & Wellness
  target: 'gps-fixed',
  data: 'data-usage',
  heart: 'favorite',
  heartRate: 'favorite-border',
  person: 'person',
  user: 'person-outline',
  
  // Status
  check: 'check',
  'check-circle': 'check-circle',
  info: 'info',
  warning: 'warning',
  
  // Custom icons (using SF Symbols on iOS, Material on Android)
  workbench: 'dashboard',
  trace: 'track-changes',
  watch: 'watch',
  jump: 'directions-run',
};

export const IconLibrary: React.FC<IconLibraryProps> = ({
  iconName,
  size = 24,
  color = '#1f5661',
  style,
}) => {
  const materialIconName = iconMap[iconName] || iconName;

  // Use MaterialIcons for most icons
  return (
    <MaterialIcons
      name={materialIconName as any}
      size={size}
      color={color}
      style={style}
    />
  );
};

export default IconLibrary;

