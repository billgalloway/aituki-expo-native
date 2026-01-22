/**
 * Password & Security Screen
 * Manages password and security settings
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
import { IconLibrary } from '@/components/IconLibrary';
import { Avatar, Chip, Divider } from 'react-native-paper';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import BottomNavigation from '@/components/BottomNavigation';

export default function PasswordSecurityScreen() {
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

  // Get display name (email username as fallback)
  const displayName = user?.email?.split('@')[0] || 'User';

  const securityItems = [
    {
      label: 'Change password',
      value: 'Last changed 30 days ago',
      editable: true,
    },
    {
      label: 'Two-factor authentication',
      value: 'Not enabled',
      editable: true,
    },
    {
      label: 'Login activity',
      value: 'View recent logins',
      editable: true,
    },
    {
      label: 'Active sessions',
      value: '2 active sessions',
      editable: true,
    },
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
          <Text style={styles.headerTitle}>Password & Security</Text>
          <View style={styles.menuButtonPlaceholder} />
        </View>

        {/* Main Content - ScrollView */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            {/* Date Row */}
            <View style={styles.dateRow}>
              <IconLibrary iconName="calendar-today" size={24} color={Colors.light.text} />
              <Text style={styles.dateText}>{getCurrentDate()}</Text>
              <View style={styles.dateRowSpacer} />
              <TouchableOpacity>
                <IconLibrary iconName="more-vert" size={35} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            {/* Profile Info */}
            <View style={styles.profileInfo}>
              <Avatar.Icon
                size={53}
                icon={() => <IconLibrary iconName="person" size={32} color={Colors.light.text} />}
                style={styles.avatar}
              />
              <View style={styles.profileText}>
                <Text style={styles.greeting}>Hello, {displayName}</Text>
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

          {/* Security Items */}
          {securityItems.map((item, index) => (
            <View key={index} style={styles.menuItemContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  // TODO: Navigate to specific security settings
                  console.log(`Navigate to ${item.label}`);
                }}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemTextContainer}>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                    <Text style={styles.menuItemValue}>{item.value}</Text>
                  </View>
                  <IconLibrary iconName="chevron-right" size={24} color={Colors.light.text} />
                </View>
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
    gap: 10,
  },
  backButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
    color: Colors.light.text,
    flex: 1,
    textAlign: 'center',
  },
  menuButtonPlaceholder: {
    width: 35,
    height: 35,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  profileSection: {
    flexDirection: 'column',
    gap: 12,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.md,
    paddingHorizontal: 20,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 4,
  },
  dateText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
    color: Colors.light.text,
    flex: 1,
  },
  dateRowSpacer: {
    flex: 1,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs + 4,
  },
  avatar: {
    backgroundColor: Colors.light.primaryLight,
    borderRadius: 100,
    width: 53,
    height: 53,
  },
  profileText: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  greeting: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.medium,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -1.5,
    color: Colors.light.text,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 4,
  },
  proChip: {
    backgroundColor: Colors.light.text,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24,
    overflow: 'visible',
  },
  proChipText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.regular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.16,
    color: Colors.light.background,
    paddingHorizontal: 0,
    textAlign: 'center',
    includeFontPadding: false,
  },
  scoreText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.medium,
    fontSize: 16,
    lineHeight: 21.344,
    letterSpacing: 0,
    color: Colors.light.text,
  },
  menuItemContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    marginHorizontal: 0,
    width: 345,
    alignSelf: 'center',
    ...Shadows.small,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  menuItem: {
    minHeight: 48,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  menuItemTextContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  menuItemLabel: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
    color: Colors.light.text,
    marginBottom: 0,
  },
  menuItemValue: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
    color: Colors.light.text,
    marginTop: 0,
  },
  menuItemDivider: {
    height: 1,
    backgroundColor: Colors.light.text,
    marginHorizontal: 0,
  },
});

