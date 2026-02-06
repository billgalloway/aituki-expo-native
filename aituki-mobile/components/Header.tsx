/**
 * Header Component
 * Matches Figma design with menu drawer and alerts
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Badge, Divider, Chip } from 'react-native-paper';
// import { LinearGradient } from 'expo-linear-gradient'; // Using border-based solution instead
import { IconLibrary } from './IconLibrary';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useRouter, usePathname } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onMenuPress?: () => void;
  onAlertsPress?: () => void;
  hidePromptBar?: boolean; // Option to hide the prompt bar
  onPromptPress?: () => void; // Callback when prompt bar is pressed
}

const Header: React.FC<HeaderProps> = ({ onMenuPress, onAlertsPress, hidePromptBar = false, onPromptPress }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false); // Controls Modal visibility
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'account-settings': true, // Account settings expanded by default
    'help-centre': false,
    'interface': false,
  });
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const themeColors = Colors.light; // Dark mode is currently disabled
  const { user, signOut } = useAuth();
  
  // Animation for drawer slide from left
  const drawerTranslateX = useRef(new Animated.Value(-286)).current; // Start off-screen to the left
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  
  // Hide prompt bar on twin screen
  const shouldHidePromptBar = hidePromptBar || pathname?.includes('/twin');
  
  // Handle menu open - show modal first, then animate
  const handleMenuOpen = () => {
    setMenuVisible(true);
    setMenuOpen(true);
    onMenuPress?.();
  };
  
  // Handle menu close - animate out first, then hide modal
  const handleMenuClose = () => {
    setMenuOpen(false);
    // Animate out to left
    Animated.parallel([
      Animated.timing(drawerTranslateX, {
        toValue: -286,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Hide modal after animation completes
      setMenuVisible(false);
    });
  };
  
  // Animate drawer in when menuOpen becomes true
  useEffect(() => {
    if (menuOpen && menuVisible) {
      // Slide in from left
      Animated.parallel([
        Animated.timing(drawerTranslateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [menuOpen, menuVisible]);
  
  const toggleExpanded = (key: string) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMenuPress = handleMenuOpen;

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
    headerContainer: {
      borderRadius: BorderRadius.full,
      overflow: 'visible', // Allow shadows to be visible
    },
    shadowLayer1: {
      // First shadow: radius 6px, opacity 0.15 (15%)
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3, // For Android
      borderRadius: BorderRadius.full,
      overflow: 'visible',
    },
    shadowLayer2: {
      // Second shadow: radius 2px, opacity 0.25 (25%)
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 2,
      elevation: 2, // For Android
      borderRadius: BorderRadius.full,
      overflow: 'visible',
    },
    safeArea: {
      backgroundColor: themeColors.primary,
      borderBottomLeftRadius: BorderRadius.full,
      borderBottomRightRadius: BorderRadius.full,
      overflow: 'hidden',
      zIndex: 10,
    },
    header: {
      backgroundColor: 'transparent',
      borderBottomLeftRadius: BorderRadius.full,
      borderBottomRightRadius: BorderRadius.full,
      overflow: 'hidden',
      zIndex: 10,
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
    promptButtonContainer: {
      position: 'relative',
    },
    promptButton: {
      backgroundColor: themeColors.background,
      borderRadius: BorderRadius.full,
      paddingVertical: Spacing.md, // 16px
      paddingHorizontal: 22, // 22px from Figma
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start', // Align left
      gap: Spacing.sm, // 8px gap between icon and text
    },
    innerShadow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: BorderRadius.full,
      overflow: 'hidden',
    },
    keyline1: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: 'rgba(70, 116, 126, 0.25)', // 1px border at 25% opacity
    },
    keyline2: {
      position: 'absolute',
      top: 1,
      left: 1,
      right: 1,
      bottom: 1,
      borderRadius: BorderRadius.full - 1,
      borderWidth: 2,
      borderColor: 'rgba(70, 116, 126, 0.15)', // 2px border at 15% opacity
    },
    keyline3: {
      position: 'absolute',
      top: 2,
      left: 2,
      right: 2,
      bottom: 2,
      borderRadius: BorderRadius.full - 2,
      borderWidth: 3,
      borderColor: 'rgba(70, 116, 126, 0.05)', // 3px border at 5% opacity
    },
    promptText: {
      fontFamily: Typography.fontFamily,
      fontSize: Typography.fontSize.sm, // 14px
      fontWeight: Typography.fontWeight.regular, // 400
      color: themeColors.text,
      lineHeight: 24, // 24px line height from Figma
      letterSpacing: Typography.letterSpacing.wider, // 0.4px
    },
    avatar: {
      backgroundColor: themeColors.primaryLight,
    },
    drawer: {
      width: 286, // Exact width from Figma
      height: '100%',
      backgroundColor: themeColors.background,
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
      <View style={dynamicStyles.headerContainer}>
        <View style={dynamicStyles.shadowLayer1}>
          <View style={dynamicStyles.shadowLayer2}>
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

          {/* Prompt Bar - Hidden on twin screen */}
          {!shouldHidePromptBar && (
            <View style={dynamicStyles.promptBar}>
              <View style={dynamicStyles.promptButtonContainer}>
                <TouchableOpacity 
                  style={dynamicStyles.promptButton} 
                  activeOpacity={0.8}
                  onPress={() => {
                    if (onPromptPress) {
                      onPromptPress();
                    } else {
                      // Default behavior: navigate to twin tab with focus parameter
                      router.push('/twin?focusInput=true');
                    }
                  }}
                >
                  <Text style={[dynamicStyles.promptText, { flex: 1 }]}>Ask AiTuki anything</Text>
                  <View style={styles.arrowContainer}>
                    <IconLibrary iconName="chevron-right" size={18} color={themeColors.text} />
                  </View>
                </TouchableOpacity>
                {/* Inner shadow overlay - 3 keyline borders to simulate inset shadow */}
                <View style={dynamicStyles.innerShadow} pointerEvents="none">
                  {/* Keyline 1: 1px border at 0.5 opacity (50%) */}
                  <View style={dynamicStyles.keyline1} />
                  {/* Keyline 2: 2px border at 0.25 opacity (25%) */}
                  <View style={dynamicStyles.keyline2} />
                  {/* Keyline 3: 3px border at 0.15 opacity (15%) */}
                  <View style={dynamicStyles.keyline3} />
                </View>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
          </View>
        </View>
      </View>

      {/* Menu Drawer Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleMenuClose}
      >
        <TouchableOpacity
          style={styles.drawerBackdrop}
          activeOpacity={1}
          onPress={handleMenuClose}
        >
          <Animated.View
            style={[
              styles.drawerBackdropAnimated,
              {
                opacity: backdropOpacity,
              },
            ]}
          />
          <View style={styles.drawerContainer}>
            <Animated.View
              style={[
                dynamicStyles.drawer,
                {
                  transform: [{ translateX: drawerTranslateX }],
                },
              ]}
              onStartShouldSetResponder={() => true}
            >
              {/* Drawer Header - Logo and Close Button */}
              <View style={styles.drawerHeaderNew}>
                <View style={styles.drawerHeaderContent}>
                  {/* Logo Container - exact dimensions from Figma */}
                  <View style={styles.drawerLogoWrapper}>
                    <Image 
                      source={{ uri: 'https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/data/Colour=Colour,%20stacked=No.png' }}
                      style={styles.drawerLogoImage}
                      contentFit="contain"
                      transition={200}
                    />
                  </View>
                  
                  {/* Close Button - IconButton pattern from Figma */}
                  <TouchableOpacity
                    onPress={handleMenuClose}
                    style={styles.drawerCloseIconButton}
                    activeOpacity={0.7}
                  >
                    <View style={styles.drawerCloseIconContainer}>
                      <IconLibrary iconName="close" size={20} color={themeColors.text} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <Divider />
              
              {/* Menu List */}
              <ScrollView style={styles.drawerMenuList} contentContainerStyle={styles.drawerMenuContent}>
                {/* Account settings - Navigate to Account Settings screen */}
                <TouchableOpacity
                  style={styles.drawerListItem}
                  onPress={() => {
                    handleMenuClose();
                    router.push('/account-settings');
                  }}
                >
                  <View style={styles.drawerListItemLeft}>
                    <View style={styles.drawerListItemIcon}>
                      <IconLibrary iconName="settings" size={24} color={themeColors.text} />
                    </View>
                  </View>
                  <View style={styles.drawerListItemText}>
                    <Text style={styles.drawerListItemMainText}>
                      Account settings
                    </Text>
                  </View>
                  <View style={styles.drawerListItemRight}>
                    <IconLibrary 
                      iconName="chevron-right" 
                      size={20} 
                      color={themeColors.textSecondary}
                    />
                  </View>
                </TouchableOpacity>
                
                {/* Help centre - Expandable */}
                <View style={styles.expandableItem}>
                  <TouchableOpacity
                    style={styles.drawerListItem}
                    onPress={() => toggleExpanded('help-centre')}
                  >
                    <View style={styles.drawerListItemLeft}>
                      <View style={styles.drawerListItemIcon}>
                        <IconLibrary iconName="help" size={24} color={themeColors.text} />
                      </View>
                    </View>
                    <View style={styles.drawerListItemText}>
                      <Text style={styles.drawerListItemMainText}>Help centre</Text>
                    </View>
                    <View style={styles.drawerListItemRight}>
                      <View style={{ transform: [{ rotate: expandedItems['help-centre'] ? '180deg' : '0deg' }] }}>
                        <IconLibrary 
                          iconName="expand-more" 
                          size={24} 
                          color={themeColors.text}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                
                {/* Interface - Expandable */}
                <View style={styles.expandableItem}>
                  <TouchableOpacity
                    style={styles.drawerListItem}
                    onPress={() => toggleExpanded('interface')}
                  >
                    <View style={styles.drawerListItemLeft}>
                      <View style={styles.drawerListItemIcon}>
                        <IconLibrary iconName="phone" size={24} color={themeColors.text} />
                      </View>
                    </View>
                    <View style={styles.drawerListItemText}>
                      <Text style={styles.drawerListItemMainText}>Interface</Text>
                    </View>
                    <View style={styles.drawerListItemRight}>
                      <View style={{ transform: [{ rotate: expandedItems['interface'] ? '180deg' : '0deg' }] }}>
                        <IconLibrary 
                          iconName="expand-more" 
                          size={24} 
                          color={themeColors.text}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                
                {/* AI models - Regular item */}
                <TouchableOpacity
                  style={styles.drawerListItem}
                  onPress={() => {
                    handleMenuClose();
                    // TODO: Navigate to AI models
                  }}
                >
                  <View style={styles.drawerListItemLeft}>
                    <View style={styles.drawerListItemIcon}>
                      <IconLibrary iconName="brain" size={24} color={themeColors.text} />
                    </View>
                  </View>
                  <View style={styles.drawerListItemText}>
                    <Text style={styles.drawerListItemMainText}>AI models</Text>
                  </View>
                </TouchableOpacity>
                
                {/* Connections - Regular item */}
                <TouchableOpacity
                  style={styles.drawerListItem}
                  onPress={() => {
                    handleMenuClose();
                    router.replace('/(tabs)/data' as any);
                  }}
                >
                  <View style={styles.drawerListItemLeft}>
                    <View style={styles.drawerListItemIcon}>
                      <IconLibrary iconName="swap-horiz" size={24} color={themeColors.text} />
                    </View>
                  </View>
                  <View style={styles.drawerListItemText}>
                    <Text style={styles.drawerListItemMainText}>Connections</Text>
                  </View>
                </TouchableOpacity>
                
                {/* Terms and conditions - Regular item */}
                <TouchableOpacity
                  style={styles.drawerListItem}
                  onPress={() => {
                    handleMenuClose();
                    // TODO: Navigate to terms
                  }}
                >
                  <View style={styles.drawerListItemLeft}>
                    <View style={styles.drawerListItemIcon}>
                      <IconLibrary iconName="balance" size={24} color={themeColors.text} />
                    </View>
                  </View>
                  <View style={styles.drawerListItemText}>
                    <Text style={styles.drawerListItemMainText}>Terms and conditions</Text>
                  </View>
                </TouchableOpacity>
                
                {/* Logout - Regular item with red text */}
                <TouchableOpacity
                  style={styles.drawerListItem}
                  onPress={async () => {
                    handleMenuClose();
                    await signOut();
                  }}
                >
                  <View style={styles.drawerListItemLeft}>
                    <View style={styles.drawerListItemIcon}>
                      <IconLibrary iconName="logout" size={24} color={themeColors.text} />
                    </View>
                  </View>
                  <View style={styles.drawerListItemText}>
                    <Text style={styles.drawerListItemMainTextLogout}>Logout</Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
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
  iconLeftContainer: {
    width: 18,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
    position: 'relative',
  },
  drawerBackdropAnimated: {
    ...StyleSheet.absoluteFillObject,
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
  drawerHeaderNew: {
    paddingTop: 64, // 64px padding at top
    paddingBottom: Spacing.md, // 16px
    paddingHorizontal: Spacing.md, // 16px (var(--4,16px))
  },
  drawerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  drawerLogoWrapper: {
    height: 40.529, // Exact height from Figma
    width: 100, // Exact width from Figma
    position: 'relative',
  },
  drawerLogoImage: {
    width: '100%',
    height: '100%',
  },
  drawerCloseIconButton: {
    padding: 8, // 8px padding as per Figma
    borderRadius: 100, // 100px (circular)
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerCloseIconContainer: {
    opacity: 0.4, // 40% opacity as per Figma
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  // New drawer menu styles matching Figma
  drawerMenuList: {
    flex: 1,
  },
  drawerMenuContent: {
    padding: Spacing.xs, // 8px
  },
  expandableItem: {
    marginBottom: 0,
  },
  drawerListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md, // 16px
    paddingVertical: Spacing.xs, // 8px
    borderRadius: 4, // 4px border radius
    minHeight: 48,
  },
  drawerListItemLeft: {
    minWidth: 56, // 56px min-width for icon area
    alignItems: 'flex-start',
  },
  drawerListItemIcon: {
    opacity: 0.5, // 50% opacity
  },
  drawerListItemText: {
    flex: 1,
    paddingVertical: 4, // 4px py
  },
  drawerListItemMainText: {
    fontFamily: Typography.fontFamily,
    fontSize: 16, // body1: 1rem
    fontWeight: Typography.fontWeight.regular, // 400
    lineHeight: 24, // 1.5 line height
    letterSpacing: 0.15,
    color: Colors.light.text,
  },
  drawerListItemUnderlined: {
    textDecorationLine: 'underline',
  },
  drawerListItemMainTextLogout: {
    fontFamily: Typography.fontFamily,
    fontSize: 16, // body1: 1rem
    fontWeight: Typography.fontWeight.regular, // 400
    lineHeight: 24, // 1.5 line height
    letterSpacing: 0.15,
    color: Colors.light.error, // Error/main color from Figma (#d32f2f)
  },
  drawerListItemRight: {
    padding: 5, // 5px padding
    borderRadius: 100, // 100px (circular)
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerSubItem: {
    paddingLeft: 56, // 56px left padding
    paddingHorizontal: Spacing.md, // 16px horizontal
    paddingVertical: 4, // 4px vertical
    borderRadius: 4,
  },
  drawerSubItemActive: {
    backgroundColor: 'rgba(31, 86, 97, 0.04)', // hover/active state
  },
  drawerSubItemText: {
    fontFamily: Typography.fontFamily,
    fontSize: 14, // 0.875rem
    fontWeight: Typography.fontWeight.regular, // 400
    lineHeight: 20, // 1.43 line height
    letterSpacing: 0.17,
    color: Colors.light.text,
    paddingVertical: 4,
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

