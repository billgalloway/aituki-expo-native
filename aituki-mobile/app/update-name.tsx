/**
 * Update Name Screen
 * Matches Figma design exactly - form with First name and Last name inputs
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconLibrary } from '@/components/IconLibrary';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useUserProfile } from '@/hooks/useUserProfile';
import BottomNavigation from '@/components/BottomNavigation';

export default function UpdateNameScreen() {
  const router = useRouter();
  const { profile, loading: profileLoading, updateName } = useUserProfile();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);

  // Load existing profile data when available
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
    }
  }, [profile]);

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please fill in both first name and last name');
      return;
    }

    setSaving(true);
    try {
      const success = await updateName(firstName.trim(), lastName.trim());
      setSaving(false);

      if (success) {
        Alert.alert('Success', 'Name updated successfully', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to update name. Please try again.');
      }
    } catch (error) {
      setSaving(false);
      Alert.alert('Error', 'An error occurred while updating your name.');
      console.error('Error updating name:', error);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <IconLibrary iconName="chevron-left" size={35} color={Colors.light.text} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Update Name</Text>
              <View style={styles.menuButtonPlaceholder} />
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              {/* First Name Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>First name</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="First"
                  placeholderTextColor="rgba(31,86,97,0.5)"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoComplete="given-name"
                />
              </View>

              {/* Last Name Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Last name</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Last"
                  placeholderTextColor="rgba(31,86,97,0.5)"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoComplete="family-name"
                />
              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.buttonSection}>
              <TouchableOpacity
                style={[styles.submitButton, saving && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={saving || profileLoading}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={Colors.light.text} />
                ) : (
                  <Text style={styles.submitButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for bottom navigation
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
    width: 24,
    height: 24,
  },
  // Form Section - px-[32px] py-[16px] gap-[0px]
  formSection: {
    paddingHorizontal: Spacing.lg * 1.33, // 32px (var(--6,32px))
    paddingVertical: Spacing.md, // 16px (var(--4,16px))
    gap: 0, // gap-[var(--4,0px)]
  },
  // Input Wrapper - matches MUI TextField outlined variant
  inputWrapper: {
    marginBottom: Spacing.md, // 16px (var(--4,16px))
    position: 'relative',
    marginTop: 8, // Add top margin to give space for label
  },
  // Label Container - absolute positioned above input
  labelContainer: {
    position: 'absolute',
    top: -6, // Position above the input border
    left: 12, // left-[12px]
    backgroundColor: Colors.light.background, // bg-[var(--background/paper-elevation-0,white)]
    paddingHorizontal: 4, // px-[4px]
    zIndex: 1,
    justifyContent: 'center',
    paddingVertical: 2, // Add vertical padding for better visibility
  },
  // Label - fontSize 12px, lineHeight 12px, letterSpacing 0.15px - improved legibility
  label: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.medium, // Medium weight for better visibility
    fontSize: 12, // 0.75rem
    lineHeight: 14, // Slightly larger line height for better readability
    letterSpacing: 0.15,
    color: Colors.light.text, // Use primary text color instead of secondary for better contrast
    backgroundColor: Colors.light.background, // Ensure background for readability
  },
  // Input - MUI TextField outlined variant
  input: {
    borderWidth: 1,
    borderColor: Colors.light.text, // border-[var(--secondary/main,#1f5661)]
    borderRadius: 4, // rounded-[var(--borderradius,4px)]
    paddingHorizontal: 12, // px-[12px]
    paddingVertical: Spacing.md, // py-[16px]
    minHeight: 56, // min-h-[24px] + py-[16px]
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.regular,
    fontSize: 16, // 1rem
    lineHeight: 24,
    letterSpacing: 0.15,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  // Button Section - pb-[48px] pt-[32px] px-[24px]
  buttonSection: {
    paddingTop: Spacing.lg * 1.33, // 32px (var(--6,32px))
    paddingBottom: Spacing.lg * 1.5, // 48px (var(--8,48px))
    paddingHorizontal: Spacing.lg, // 24px (var(--5,24px))
    alignItems: 'center',
  },
  // Submit Button - matches MUI Button pattern
  submitButton: {
    backgroundColor: Colors.light.primary, // bg-[var(--primary/main,#69f0f0)]
    borderRadius: BorderRadius.full, // 32px (var(--6,32px))
    paddingHorizontal: Spacing.md, // px-[16px]
    paddingVertical: 6, // py-[6px]
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  // Submit Button Text - fontSize 14px, lineHeight 24px, letterSpacing 0.4px
  submitButtonText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.regular,
    fontSize: 14, // 0.875rem
    lineHeight: 24,
    letterSpacing: 0.4,
    color: Colors.light.text, // text-[color:var(--text/contrasttext,#1f5661)]
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});

