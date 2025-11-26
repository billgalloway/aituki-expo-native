/**
 * Icon Library Component
 * Maps icon names to Material Icons (Material Symbols)
 */

import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface IconLibraryProps {
  iconName: string;
  size?: number;
  color?: string;
  style?: any;
}

// Icon name mapping to Material Icons
// Using Material Symbols icon names from @expo/vector-icons
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
  'heart-rate': 'monitor-heart', // Heart rate monitor icon
  person: 'person',
  user: 'person-outline',
  
  // Status
  check: 'check',
  'check-circle': 'check-circle',
  info: 'info',
  warning: 'warning',
  
  // Bottom Navigation Icons (from Figma Dock)
  workbench: 'dashboard', // Workbench/dashboard icon for home
  trace: 'track-changes', // Trace/track changes icon for target/goals
  watch: 'watch', // Watch icon for data
  jump: 'directions-run', // Jump/run icon for tuki/twin
};

export const IconLibrary: React.FC<IconLibraryProps> = ({
  iconName,
  size = 24,
  color = '#1f5661',
  style,
}) => {
  const materialIconName = iconMap[iconName] || iconName;

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
