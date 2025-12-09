/**
 * Header Component
 * Matches Figma design with menu drawer and alerts
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Badge, Divider, Chip } from 'react-native-paper';
import { IconLibrary } from './IconLibrary';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface HeaderProps {
  onMenuPress?: () => void;
  onAlertsPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress, onAlertsPress }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? Colors.dark : Colors.light;

  const handleMenuPress = () => {
    setMenuOpen(true);
    onMenuPress?.();
  };

  const handleAlertsPress = () => {
    setAlertsOpen(true);
    onAlertsPress?.();
  };

  const navItems = [
    { label: 'Home', path: '/', iconName: 'home' },
    { label: 'Goals', path: '/goals', iconName: 'target' },
    { label: 'Data', path: '/data', iconName: 'data' },
    { label: 'Health', path: '/health', iconName: 'heart' },
    { label: 'Twin', path: '/twin', iconName: 'person' },
  ];

  // Create dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    safeArea: {
      backgroundColor: themeColors.primary,
      borderBottomLeftRadius: BorderRadius.full,
      borderBottomRightRadius: BorderRadius.full,
      overflow: 'hidden',
      zIndex: 10,
      // No elevation on safeArea to prevent shadow above
    },
    header: {
      backgroundColor: 'transparent',
      borderBottomLeftRadius: BorderRadius.full,
      borderBottomRightRadius: BorderRadius.full,
      overflow: 'hidden',
      zIndex: 10,
      // No elevation on header to prevent shadow above
    },
    iconBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      backgroundColor: themeColors.primary,
    },
    promptBar: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.lg,
      backgroundColor: themeColors.primary,
      borderBottomLeftRadius: BorderRadius.full,
      borderBottomRightRadius: BorderRadius.full,
      // Shadow only at the bottom - reduced blur and offset lower
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      elevation: 4, // For Android
    },
    promptButton: {
      backgroundColor: themeColors.background,
      borderRadius: BorderRadius.full,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.md + 6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
    },
    promptText: {
      fontFamily: Typography.fontFamily,
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.regular,
      color: themeColors.text,
      letterSpacing: Typography.letterSpacing.wider,
    },
    avatar: {
      backgroundColor: themeColors.primaryLight,
    },
    drawer: {
      width: '80%',
      maxWidth: 360,
      backgroundColor: themeColors.background,
      borderTopRightRadius: BorderRadius.xl,
      borderBottomRightRadius: BorderRadius.xl,
      ...Shadows.large,
    },
    drawerProfileName: {
      fontFamily: Typography.fontFamily,
      fontWeight: Typography.fontWeight.bold,
      fontSize: Typography.fontSize.base,
      color: themeColors.text,
    },
    proChip: {
      height: 20,
      backgroundColor: themeColors.text,
    },
    proChipText: {
      fontSize: 12,
      color: themeColors.background,
      paddingHorizontal: 6,
    },
    drawerNavLabel: {
      fontFamily: Typography.fontFamily,
      fontWeight: Typography.fontWeight.medium,
      fontSize: Typography.fontSize.xs,
      color: themeColors.textSecondary,
      letterSpacing: 1.1,
      marginBottom: Spacing.xs,
    },
    drawerNavText: {
      flex: 1,
      fontFamily: Typography.fontFamily,
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.medium,
      color: themeColors.text,
    },
    alertsContainer: {
      flex: 1,
      backgroundColor: themeColors.background,
      width: '100%',
      maxWidth: 393,
      alignSelf: 'flex-end',
    },
    alertsHeader: {
      backgroundColor: themeColors.primary,
      paddingTop: Spacing.xl,
      paddingHorizontal: Spacing.sm + 4,
      paddingBottom: Spacing.sm + 4,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    alertText: {
      fontFamily: Typography.fontFamily,
      color: themeColors.text,
    },
  });

  return (
    <>
      <SafeAreaView edges={['top']} style={dynamicStyles.safeArea}>
        <View style={dynamicStyles.header}>
          {/* Icon Bar */}
          <View style={dynamicStyles.iconBar}>
            {/* Left side - Hamburger menu */}
            <TouchableOpacity
              onPress={handleMenuPress}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <IconLibrary iconName="menu" size={24} color={themeColors.text} />
            </TouchableOpacity>

            {/* Right side - Avatar with badge */}
            <TouchableOpacity
              onPress={handleAlertsPress}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <View style={styles.badgeContainer}>
                <Badge visible={true} size={12} style={styles.badge}>
                  4
                </Badge>
                <Avatar.Icon
                  size={40}
                  icon={() => <IconLibrary iconName="notifications" size={24} color={themeColors.text} />}
                  style={dynamicStyles.avatar}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Prompt Bar */}
          <View style={dynamicStyles.promptBar}>
            <TouchableOpacity style={dynamicStyles.promptButton} activeOpacity={0.8}>
              <Text style={dynamicStyles.promptText}>Get help from your digital twin</Text>
              <View style={styles.arrowContainer}>
                <IconLibrary iconName="chevron-right" size={18} color={themeColors.text} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Menu Drawer Modal */}
      <Modal
        visible={menuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.drawerBackdrop}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.drawerContainer}>
            <View style={dynamicStyles.drawer} onStartShouldSetResponder={() => true}>
              {/* Drawer Header */}
              <View style={styles.drawerHeader}>
                <View style={styles.drawerProfile}>
                  <Avatar.Icon
                    size={44}
                  icon={() => <IconLibrary iconName="user" size={24} color={themeColors.text} />}
                  style={[dynamicStyles.avatar, { borderWidth: 2, borderColor: themeColors.primaryLight }]}
                  />
                  <View style={styles.drawerProfileInfo}>
                    <Text style={dynamicStyles.drawerProfileName}>Pilar</Text>
                    <Chip
                      style={dynamicStyles.proChip}
                      textStyle={dynamicStyles.proChipText}
                      mode="flat"
                    >
                      Pro member
                    </Chip>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setMenuOpen(false)}
                  style={styles.closeButton}
                >
                  <IconLibrary iconName="close" size={22} color={themeColors.text} />
                </TouchableOpacity>
              </View>
              <Divider />
              
              {/* Navigation Items */}
              <View style={styles.drawerNavSection}>
                <Text style={dynamicStyles.drawerNavLabel}>Navigation</Text>
                {navItems.map((item) => (
                  <TouchableOpacity
                    key={item.path}
                    style={styles.drawerNavItem}
                    onPress={() => {
                      setMenuOpen(false);
                      router.push(item.path as any);
                    }}
                  >
                    <IconLibrary iconName={item.iconName} size={22} color={themeColors.text} />
                    <Text style={dynamicStyles.drawerNavText}>{item.label}</Text>
                    <IconLibrary iconName="chevron-right" size={20} color={themeColors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Alerts Drawer Modal */}
      <Modal
        visible={alertsOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAlertsOpen(false)}
      >
        <View style={dynamicStyles.alertsContainer}>
          <View style={dynamicStyles.alertsHeader}>
            <TouchableOpacity
              onPress={() => setAlertsOpen(false)}
              style={styles.closeButton}
            >
              <IconLibrary iconName="close" size={20} color={themeColors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton}>
              <IconLibrary iconName="more-vert" size={20} color={themeColors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.alertsContent}>
            {/* Alert items would go here */}
            <Text style={dynamicStyles.alertText}>Alerts content</Text>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: Colors.light.primaryLight,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.light.warning,
    zIndex: 1,
  },
  promptBar: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.light.primary,
    borderBottomLeftRadius: BorderRadius.full,
    borderBottomRightRadius: BorderRadius.full,
    // Shadow only at the bottom - reduced blur and offset lower
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4, // For Android
  },
  promptButton: {
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md + 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  promptText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text,
    letterSpacing: Typography.letterSpacing.wider,
  },
  arrowContainer: {
    width: 18,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Drawer styles
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  drawer: {
    width: '80%',
    maxWidth: 360,
    backgroundColor: Colors.light.background,
    borderTopRightRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    ...Shadows.large,
  },
  drawerHeader: {
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  drawerProfileInfo: {
    gap: Spacing.xs,
  },
  drawerProfileName: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.base,
    color: Colors.light.text,
  },
  proChip: {
    height: 20,
    backgroundColor: Colors.light.text,
  },
  proChipText: {
    fontSize: 12,
    color: Colors.light.background,
    paddingHorizontal: 6,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerNavSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm + 4,
  },
  drawerNavLabel: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.light.textSecondary,
    letterSpacing: 1.1,
    marginBottom: Spacing.xs,
  },
  drawerNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 4,
    gap: Spacing.sm + 4,
  },
  drawerNavText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
  // Alerts drawer styles
  alertsContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
    width: '100%',
    maxWidth: 393,
    alignSelf: 'flex-end',
  },
  alertsHeader: {
    backgroundColor: Colors.light.primary,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.sm + 4,
    paddingBottom: Spacing.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertsContent: {
    flex: 1,
    padding: Spacing.sm + 4,
  },
  alertText: {
    fontFamily: Typography.fontFamily,
    color: Colors.light.text,
  },
});

export default Header;

