/**
 * Account Settings Screen
 * Matches Figma design - list view with profile section and menu items
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { IconLibrary } from '@/components/IconLibrary';
import { Avatar, Chip, Divider } from 'react-native-paper';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Get current date formatted as "July 25th 2025"
  const getCurrentDate = () => {
    const now = new Date();
    const month = now.toLocaleString('en-US', { month: 'long' });
    const day = now.getDate();
    const year = now.getFullYear();
    const daySuffix = day === 1 || day === 21 || day === 31 ? 'st' :
                     day === 2 || day === 22 ? 'nd' :
                     day === 3 || day === 23 ? 'rd' : 'th';
    return `${month} ${day}${daySuffix} ${year}`;
  };

  const menuItems = [
    { label: 'Personal details', route: '/personal-details' },
    { label: 'Password & Security', route: '/password-security' },
    { label: 'Data Privacy', route: '/data-privacy' },
    { label: 'Alerts & notifications', route: '/alerts-notifications' },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <IconLibrary iconName="chevron-left" size={35} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account settings</Text>
          <TouchableOpacity style={styles.menuButton}>
            <IconLibrary iconName="more-vert" size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Date Row */}
          <View style={styles.dateRow}>
            <IconLibrary iconName="calendar-today" size={24} color={Colors.light.text} />
            <Text style={styles.dateText}>{getCurrentDate()}</Text>
            <View style={styles.dateRowSpacer} />
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <Avatar.Icon
              size={53}
              icon={() => <IconLibrary iconName="person" size={32} color={Colors.light.text} />}
              style={styles.avatar}
            />
            <View style={styles.profileText}>
              <Text style={styles.greeting}>Hello, {user?.email?.split('@')[0] || 'User'}</Text>
              <View style={styles.badges}>
                <Chip
                  style={styles.proChip}
                  textStyle={styles.proChipText}
                  mode="flat"
                >
                  Pro member
                </Chip>
                <Text style={styles.scoreText}>Tuki Score 78%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {menuItems.map((item, index) => (
            <View key={index} style={styles.menuItemContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.push(item.route as any);
                }}
              >
                <Text style={styles.menuItemText}>{item.label}</Text>
                <IconLibrary iconName="chevron-right" size={35} color={Colors.light.text} />
              </TouchableOpacity>
              <Divider style={styles.menuItemDivider} />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
      <BottomNavigation activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flex: 1,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs + 6, // 10px gap
  },
  backButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.variants.body1,
    flex: 1,
    textAlign: 'center',
    color: Colors.light.text,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  menuButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    paddingHorizontal: Spacing.lg + 4, // 20px
    paddingBottom: Spacing.md,
    gap: Spacing.xs + 4, // 12px gap
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dateText: {
    ...Typography.variants.body1,
    color: Colors.light.text,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  dateRowSpacer: {
    flex: 1,
  },
  profileInfo: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'flex-start',
  },
  avatar: {
    backgroundColor: Colors.light.primaryLight,
    borderWidth: 0,
  },
  profileText: {
    flex: 1,
    gap: Spacing.xs / 2, // 4px gap
  },
  greeting: {
    fontFamily: Typography.fontFamily,
    fontSize: 34,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: 40, // Leading 7 (40px) for 34px font
    letterSpacing: -1.5,
    color: Colors.light.text,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  proChip: {
    backgroundColor: Colors.light.text, // Secondary/main color #1f5661
    paddingVertical: 4, // 4px vertical padding (top/bottom)
    paddingHorizontal: 6, // 6px horizontal padding (left/right)
    borderRadius: 100, // Fully rounded (from Figma: rounded-[100px])
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    minHeight: 24, // Min height 24px (inner content height from Figma)
    overflow: 'visible', // Prevent text clipping
  },
  proChipText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.regular, // 400
    fontSize: 13, // 0.8125rem from Figma chip/label
    lineHeight: 18, // 18px from Figma
    letterSpacing: 0.16, // 0.16px from Figma
    color: Colors.light.background, // Secondary/contrastText (white)
    paddingHorizontal: 0, // Remove extra padding - handled by chip container
    textAlign: 'center', // Center text
    includeFontPadding: false, // Prevent extra spacing on Android
  },
  scoreText: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: 21.344, // 1.334 line height
    color: Colors.light.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl, // 32px
    paddingBottom: 120, // Space for bottom nav
  },
  menuItemContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4, // 12px
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48, // Standard MUI MenuItem height
  },
  menuItemDivider: {
    height: 1,
    backgroundColor: Colors.light.text,
    opacity: 0.12, // MUI divider opacity
    marginHorizontal: 0,
  },
  menuItemText: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: 24,
    letterSpacing: 0.15,
    color: Colors.light.text,
    flex: 1,
  },
});

