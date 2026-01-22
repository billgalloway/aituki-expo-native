/**
 * Update Address Screen
 * Matches Figma design exactly - form with address fields including Select dropdowns
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
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconLibrary } from '@/components/IconLibrary';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useUserProfile } from '@/hooks/useUserProfile';
import BottomNavigation from '@/components/BottomNavigation';

export default function UpdateAddressScreen() {
  const router = useRouter();
  const { profile, loading: profileLoading, updateAddress } = useUserProfile();
  const [firstLine, setFirstLine] = useState('');
  const [secondLine, setSecondLine] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('Value');
  const [country, setCountry] = useState('United Kingdom');
  const [postCode, setPostCode] = useState('');
  const [saving, setSaving] = useState(false);
  
  const [countyModalVisible, setCountyModalVisible] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  // Sample options for dropdowns
  const countyOptions = ['Value', 'Option 1', 'Option 2', 'Option 3'];
  const countryOptions = ['United Kingdom', 'United States', 'Canada', 'Australia'];

  // Load existing profile data when available
  useEffect(() => {
    if (profile) {
      setFirstLine(profile.address_first_line || '');
      setSecondLine(profile.address_second_line || '');
      setCity(profile.address_city || '');
      setCounty(profile.address_county || 'Value');
      setCountry(profile.address_country || 'United Kingdom');
      setPostCode(profile.address_postcode || '');
    }
  }, [profile]);

  const handleLookupAddress = () => {
    // TODO: Implement address lookup functionality
    Alert.alert('Info', 'Address lookup functionality coming soon');
  };

  const handleSubmit = async () => {
    if (!firstLine.trim() || !city.trim() || !postCode.trim()) {
      Alert.alert('Error', 'Please fill in required address fields');
      return;
    }

    setSaving(true);
    try {
      const success = await updateAddress({
        first_line: firstLine.trim(),
        second_line: secondLine.trim() || null,
        city: city.trim(),
        county: county !== 'Value' ? county.trim() : null,
        country: country.trim(),
        postcode: postCode.trim(),
      });
      setSaving(false);

      if (success) {
        Alert.alert('Success', 'Address updated successfully', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to update address. Please try again.');
      }
    } catch (error) {
      setSaving(false);
      Alert.alert('Error', 'An error occurred while updating your address.');
      console.error('Error updating address:', error);
    }
  };

  const renderSelectModal = (
    visible: boolean,
    onClose: () => void,
    options: string[],
    selectedValue: string,
    onSelect: (value: string) => void,
    label: string
  ) => {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={onClose}>
                <IconLibrary iconName="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalOption,
                    selectedValue === option && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedValue === option && styles.modalOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
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
              <Text style={styles.headerTitle}>Update address</Text>
              <View style={styles.menuButtonPlaceholder} />
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              {/* First Line Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>First line</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. +44 000 0000"
                  placeholderTextColor="rgba(31,86,97,0.5)"
                  value={firstLine}
                  onChangeText={setFirstLine}
                />
              </View>

              {/* Second Line Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Second line</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. +44 000 0000"
                  placeholderTextColor="rgba(31,86,97,0.5)"
                  value={secondLine}
                  onChangeText={setSecondLine}
                />
              </View>

              {/* City Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>City</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. +44 000 0000"
                  placeholderTextColor="rgba(31,86,97,0.5)"
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              {/* County Select */}
              <View style={styles.selectWrapper}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>County</Text>
                </View>
                <TouchableOpacity
                  style={styles.selectInput}
                  onPress={() => setCountyModalVisible(true)}
                >
                  <Text style={styles.selectText}>{county}</Text>
                  <IconLibrary iconName="expand-more" size={24} color={Colors.light.text} />
                </TouchableOpacity>
              </View>

              {/* Country Select */}
              <View style={styles.selectWrapper}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Country</Text>
                </View>
                <TouchableOpacity
                  style={styles.selectInput}
                  onPress={() => setCountryModalVisible(true)}
                >
                  <Text style={styles.selectText}>{country}</Text>
                  <IconLibrary iconName="expand-more" size={24} color={Colors.light.text} />
                </TouchableOpacity>
              </View>

              {/* Post Code Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Post Code</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter postcode"
                  placeholderTextColor="rgba(31,86,97,0.5)"
                  value={postCode}
                  onChangeText={setPostCode}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            {/* Look up address Button */}
            <View style={styles.lookupButtonSection}>
              <TouchableOpacity
                style={styles.lookupButton}
                onPress={handleLookupAddress}
                activeOpacity={0.8}
              >
                <Text style={styles.lookupButtonText}>Look up address</Text>
              </TouchableOpacity>
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
      
      {/* County Select Modal */}
      {renderSelectModal(
        countyModalVisible,
        () => setCountyModalVisible(false),
        countyOptions,
        county,
        setCounty,
        'County'
      )}
      
      {/* Country Select Modal */}
      {renderSelectModal(
        countryModalVisible,
        () => setCountryModalVisible(false),
        countryOptions,
        country,
        setCountry,
        'Country'
      )}
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
    gap: 0,
  },
  // Input Wrapper - matches MUI TextField outlined variant
  inputWrapper: {
    marginBottom: Spacing.md, // 16px (var(--4,16px))
    position: 'relative',
    marginTop: 8, // Add top margin to give space for label
  },
  // Select Wrapper - matches MUI Select outlined variant
  selectWrapper: {
    marginBottom: Spacing.md, // 16px
    position: 'relative',
    marginTop: 8,
  },
  // Label Container - absolute positioned above input
  labelContainer: {
    position: 'absolute',
    top: -6, // Position above the input border
    left: 12, // left-[12px]
    backgroundColor: Colors.light.background,
    paddingHorizontal: 4, // px-[4px]
    zIndex: 1,
    justifyContent: 'center',
    paddingVertical: 2,
  },
  // Label - fontSize 12px, lineHeight 12px, letterSpacing 0.15px - improved legibility
  label: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.medium,
    fontSize: 12, // 0.75rem
    lineHeight: 14,
    letterSpacing: 0.15,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  // Input - MUI TextField outlined variant
  input: {
    borderWidth: 1,
    borderColor: Colors.light.text, // border-[var(--secondary/main,#1f5661)]
    borderRadius: 4, // rounded-[var(--borderradius,4px)]
    paddingHorizontal: 12, // px-[12px]
    paddingVertical: Spacing.md, // py-[16px]
    minHeight: 56,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.regular,
    fontSize: 16, // 1rem
    lineHeight: 24,
    letterSpacing: 0.15,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  // Select Input - MUI Select outlined variant
  selectInput: {
    borderWidth: 1,
    borderColor: Colors.light.text, // border-[var(--text/primary,#1f5661)]
    borderRadius: 4, // rounded-[var(--borderradius,4px)]
    paddingHorizontal: 12, // px-[12px]
    paddingVertical: Spacing.md, // py-[16px]
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.background,
  },
  selectText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.regular,
    fontSize: 16, // 1rem
    lineHeight: 24,
    letterSpacing: 0.15,
    color: Colors.light.text,
  },
  // Look up address Button Section - pb-[16px] pt-[0px] px-[24px]
  lookupButtonSection: {
    paddingTop: 0, // pt-[var(--0,0px)]
    paddingBottom: Spacing.md, // pb-[var(--4,16px)]
    paddingHorizontal: Spacing.lg, // 24px (var(--5,24px))
    alignItems: 'flex-end',
  },
  // Look up address Button - outlined variant
  lookupButton: {
    borderWidth: 1,
    borderColor: Colors.light.primaryDark || '#46747e', // border-[var(--secondary/light,#46747e)]
    borderRadius: BorderRadius.full, // 32px (var(--6,32px))
    paddingHorizontal: Spacing.md, // px-[16px]
    paddingVertical: 6, // py-[6px]
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  lookupButtonText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.regular,
    fontSize: 14, // 0.875rem
    lineHeight: 24,
    letterSpacing: 0.4,
    color: Colors.light.text, // text-[color:var(--text/primary,#1f5661)]
  },
  // Submit Button Section - pb-[48px] pt-[32px] px-[24px]
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
  // Modal Styles for Select Dropdowns
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    maxHeight: '50%',
    paddingBottom: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.medium,
    fontSize: 18,
    color: Colors.light.text,
  },
  modalOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalOptionSelected: {
    backgroundColor: Colors.light.primaryLight,
  },
  modalOptionText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.regular,
    fontSize: 16,
    color: Colors.light.text,
  },
  modalOptionTextSelected: {
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
});

