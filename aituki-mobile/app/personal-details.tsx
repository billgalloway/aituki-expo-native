/**
 * Personal Details Screen
 * Matches Figma design exactly - profile section with editable personal information fields
 */

import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { IconLibrary } from '@/components/IconLibrary';
import { Avatar, Chip, Divider } from 'react-native-paper';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRouter } from 'expo-router';
import BottomNavigation from '@/components/BottomNavigation';

export default function PersonalDetailsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, loading: profileLoading, refresh } = useUserProfile();
  
  // Refresh profile data when screen comes into focus
  // This ensures data is updated after returning from update screens
  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );
  
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

  // Get display name (first name from profile or email username as fallback)
  const displayName = useMemo(() => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    // Fallback to email username if no first name
    return user?.email?.split('@')[0] || 'User';
  }, [profile?.first_name, user?.email]);

  // Format full name for display
  const fullName = useMemo(() => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) return firstName;
    if (lastName) return lastName;
    // Fallback to email username if no name data
    return user?.email?.split('@')[0] || '';
  }, [profile?.first_name, profile?.last_name, user?.email]);

  // Format address for display
  const addressDisplay = useMemo(() => {
    const lines: string[] = [];
    if (profile?.address_first_line) {
      lines.push(profile.address_first_line);
    }
    if (profile?.address_second_line) {
      lines.push(profile.address_second_line);
    }
    if (profile?.address_city) {
      lines.push(profile.address_city);
    }
    if (profile?.address_postcode) {
      lines.push(profile.address_postcode);
    }
    return lines.length > 0 ? lines : null;
  }, [profile?.address_first_line, profile?.address_second_line, profile?.address_city, profile?.address_postcode]);

  // Personal details data - populated from profile or fallback to auth user/defaults
  const personalDetails = useMemo(() => [
    {
      label: 'Name',
      value: fullName || 'Not set',
      editable: true,
    },
    {
      label: 'Email',
      value: profile?.email || user?.email || 'Not set',
      editable: true,
    },
    {
      label: 'Mobile number',
      value: profile?.mobile_number || 'Not set',
      editable: true,
    },
    {
      label: 'Address',
      value: addressDisplay || 'Not set',
      editable: true,
    },
  ], [fullName, profile?.email, user?.email, profile?.mobile_number, addressDisplay]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header Section - "Personal details" title */}
        <View style={styles.headerSection}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <IconLibrary iconName="chevron-left" size={35} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal details</Text>
          <View style={styles.menuButtonPlaceholder} />
        </View>

        {/* Main Content - ScrollView */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Section - exact structure from Figma */}
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

          {/* Personal Details Fields - MUI MenuItem pattern */}
          {personalDetails.map((detail, index) => (
            <View key={index} style={styles.menuItemContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  if (detail.label === 'Name') {
                    router.push('/update-name');
                  } else if (detail.label === 'Email') {
                    router.push('/update-email');
                  } else if (detail.label === 'Mobile number') {
                    router.push('/update-mobile');
                  } else if (detail.label === 'Address') {
                    router.push('/update-address');
                  }
                  // TODO: Add navigation for other fields
                }}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemTextContainer}>
                    <Text style={styles.menuItemLabel}>{detail.label}</Text>
                    {Array.isArray(detail.value) ? (
                      <View style={styles.menuItemValueContainer}>
                        {detail.value.map((line, lineIndex) => (
                          <Text key={lineIndex} style={styles.menuItemValue}>
                            {line}
                          </Text>
                        ))}
                      </View>
                    ) : (
                      <Text style={[
                        styles.menuItemValue,
                        detail.value === 'Not set' && styles.menuItemValueEmpty
                      ]}>
                        {detail.value}
                      </Text>
                    )}
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
  // Header Section - px-[16px] py-[8px] gap-[10px]
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, // 16px
    paddingVertical: Spacing.sm, // 8px
    gap: 10, // 10px gap from Figma
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
    lineHeight: 24, // 1.5 * 16
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
    paddingBottom: 120, // Space for bottom navigation
  },
  // Profile Section - gap-[12px] pb-[16px] px-[20px]
  profileSection: {
    flexDirection: 'column',
    gap: 12, // 12px gap
    paddingBottom: Spacing.md, // 16px
    paddingTop: Spacing.md, // 16px (py-[var(--4,16px)])
    paddingHorizontal: 20, // 20px (from Figma)
  },
  // Date Row - gap-[8px]
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 4, // 8px gap (var(--2,8px))
  },
  dateText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.regular,
    fontSize: 16,
    lineHeight: 24, // 1.5 * 16
    letterSpacing: 0.15,
    color: Colors.light.text,
    flex: 1,
  },
  dateRowSpacer: {
    flex: 1,
  },
  // Profile Info - gap-[8px]
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs + 4, // 8px gap
  },
  avatar: {
    backgroundColor: Colors.light.primaryLight,
    borderRadius: 100, // Circular
    width: 53,
    height: 53,
  },
  profileText: {
    flex: 1,
    flexDirection: 'column',
    gap: 4, // 4px gap (var(--1,4px))
  },
  // Greeting - H1: fontSize 34px, lineHeight 40px, letterSpacing -1.5px
  greeting: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.medium,
    fontSize: 34,
    lineHeight: 40, // From Figma (var(--7,40px))
    letterSpacing: -1.5,
    color: Colors.light.text,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 4, // 8px gap
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
    fontWeight: Typography.fontWeight.medium,
    fontSize: 16,
    lineHeight: 21.344, // 1.334 * 16
    letterSpacing: 0,
    color: Colors.light.text,
  },
  // Menu Item Container - matches MUI MenuItem pattern
  menuItemContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.md, // 12px (var(--3,12px))
    marginBottom: Spacing.sm,
    marginHorizontal: 0, // Will be centered with width
    width: 345, // From Figma w-[345px]
    alignSelf: 'center', // Center the menu items
    ...Shadows.small, // shadow-[0px_0px_2px_-1px_rgba(0,0,0,0.4)]
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  // Menu Item - px-[16px] py-[12px]
  menuItem: {
    minHeight: 48,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, // 16px
    paddingVertical: 12, // 12px
  },
  menuItemTextContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  // Menu Item Label - Regular (matching Figma navigation)
  menuItemLabel: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.regular,
    fontSize: 16,
    lineHeight: 24, // 1.5 * 16
    letterSpacing: 0.15,
    color: Colors.light.text,
    marginBottom: 0,
  },
  menuItemValueContainer: {
    flexDirection: 'column',
    marginTop: 0,
  },
  // Menu Item Value - Regular weight
  menuItemValue: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.regular,
    fontSize: 16,
    lineHeight: 24, // 1.5 * 16
    letterSpacing: 0.15,
    color: Colors.light.text,
    marginBottom: 0,
  },
  menuItemValueEmpty: {
    color: Colors.light.textDisabled, // Gray out "Not set" text
    fontStyle: 'italic',
  },
  menuItemDivider: {
    height: 1,
    backgroundColor: Colors.light.text, // rgba(31, 86, 97, 1)
    marginHorizontal: 0,
  },
});
