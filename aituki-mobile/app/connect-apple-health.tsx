/**
 * Connect Apple Health - Intro Screen
 * First screen in the HealthKit onboarding flow
 * Based on Figma design
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

export default function ConnectAppleHealthScreen() {
  const router = useRouter();

  const handleConnect = () => {
    // Navigate to permission selection screen
    router.push('/apple-health-permissions');
  };

  const handleSkip = () => {
    // Go back or to health screen
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconLibrary iconName="chevron-left" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connect Apple Health</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Icon/Illustration */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <IconLibrary iconName="health" size={80} color={Colors.light.primary} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Connect Apple Health</Text>

        {/* Description */}
        <Text style={styles.description}>
          Connect your Apple Health data to get personalized insights and track your wellbeing across physical, emotional, mental, and energy pillars.
        </Text>

        {/* Benefits List */}
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <IconLibrary iconName="check" size={20} color={Colors.light.primary} />
            <Text style={styles.benefitText}>Automatic data sync from your iPhone</Text>
          </View>
          <View style={styles.benefitItem}>
            <IconLibrary iconName="check" size={20} color={Colors.light.primary} />
            <Text style={styles.benefitText}>Comprehensive health tracking</Text>
          </View>
          <View style={styles.benefitItem}>
            <IconLibrary iconName="check" size={20} color={Colors.light.primary} />
            <Text style={styles.benefitText}>Personalized insights and recommendations</Text>
          </View>
          <View style={styles.benefitItem}>
            <IconLibrary iconName="check" size={20} color={Colors.light.primary} />
            <Text style={styles.benefitText}>Secure and private data handling</Text>
          </View>
        </View>

        {/* Privacy Note */}
        <View style={styles.privacyContainer}>
          <Text style={styles.privacyText}>
            Your health data is encrypted and stored securely. We only access the data types you explicitly grant permission for.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.connectButton}
          onPress={handleConnect}
        >
          <Text style={styles.connectButtonText}>Connect Apple Health</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.light.text,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.light.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xxl,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  benefitText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.light.text,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  privacyContainer: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  privacyText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  connectButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  connectButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.light.text,
  },
  skipButton: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
  },
});
