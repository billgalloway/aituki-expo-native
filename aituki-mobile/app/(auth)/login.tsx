/**
 * Login Screen — this is the screen you see in the emulator when not logged in.
 * (The teal full-screen first is LoadingScreen in components/LoadingScreen.tsx.)
 * Light theme: white background, Supabase logo, H4/body1 typography, teal-accent buttons.
 * Email form only when user taps "Login with email".
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';
import FormTextField from '@/components/FormTextField';
import { router } from 'expo-router';

const PRIMARY_BUTTON_TEXT_COLOR = '#ffffff';

/** Light theme: white background, teal accents on borders. Text = primary (#1F5661, theme Colors.light.textPrimary) */
const FIGMA = {
  background: '#ffffff',
  textPrimary: '#1f5661',
  teal: '#0d9488',
  socialButtonBg: '#fafafa',
  socialButtonBorder: '#0d9488',
  socialButtonText: '#1f5661',
  emailButtonBg: '#fafafa',
  emailButtonBorder: '#0d9488',
  emailButtonText: '#1f5661',
  orText: '#1f5661',
};
const LOGO_URI = 'https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/brand/tukiai%20logo.png';
const GOOGLE_ICON_URI = 'https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/brand%20icons/googleIcon.png';
const APPLE_ICON_URI = 'https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/brand%20icons/appleIcon.png';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const { signIn, signInWithApple, signInWithGoogle } = useAuth();
  const themeColors = Colors.light;

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    const { error } = await signInWithApple();
    setLoading(false);
    if (error) {
      Alert.alert('Apple Sign-In Failed', error.message || 'Unable to sign in with Apple. Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    setLoading(false);
    if (error) {
      Alert.alert('Google Sign-In Failed', error.message || 'Unable to sign in with Google. Please try again.', [{ text: 'OK' }]);
    }
  };

  // Email/password form view – same layout as main login: logo at top, 64px top space, 32px indent
  if (showEmailForm) {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: FIGMA.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={[styles.scrollView, { backgroundColor: FIGMA.background }]}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.scrollContentInner}>
            <TouchableOpacity
              style={styles.backLink}
              onPress={() => setShowEmailForm(false)}
              accessibilityRole="button"
              accessibilityLabel="Back to sign in options">
              <IconLibrary iconName="chevron-left" size={24} color={themeColors.textPrimary} />
              <Text style={[styles.backLinkText, { color: themeColors.textPrimary }]}>Back</Text>
            </TouchableOpacity>

            <View style={styles.content}>
              {/* Logo – same as main login */}
              <View style={styles.header}>
                <Image
                  source={{ uri: LOGO_URI }}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>

              {/* Content below logo: title, form (32px indent) */}
              <View style={styles.contentIndent}>
                <Text style={[styles.formTitle, { color: themeColors.textPrimary }]}>Login with email</Text>

                <View style={[styles.cardContent, { backgroundColor: 'transparent', borderWidth: 0, padding: 0 }]}>
                  <FormTextField
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                editable={!loading}
                  />
                  <FormTextField
                    label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                showPasswordToggle
                autoCapitalize="none"
                autoComplete="password"
                editable={!loading}
                  />
                  <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: themeColors.primary }]}
                  onPress={handleEmailLogin}
                  disabled={loading}
                  accessibilityRole="button"
                  accessibilityLabel="Login to AiTuki">
                  <View style={styles.primaryButtonContent}>
                    {loading ? (
                      <ActivityIndicator size="small" color={themeColors.textPrimary} />
                    ) : (
                      <>
                        <Text style={[styles.primaryButtonText, { color: themeColors.textPrimary }]}>
                          Login to AiTuki
                        </Text>
                        <IconLibrary iconName="chevron-right" size={18} color={themeColors.textPrimary} />
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
                <TouchableOpacity
                  style={styles.forgotPasswordLink}
                  onPress={() => router.push('/(auth)/reset-password')}
                  accessibilityRole="button"
                  accessibilityLabel="Forgotten password?">
                  <Text style={[styles.forgotPasswordText, { color: themeColors.textPrimary }]}>
                    Forgotten Password?
                  </Text>
                </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Main home: light theme – logo, H4 intro, body1 “Continue with Google”, social + OR + email buttons
  const { h4, body1 } = Typography.variants;
  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: FIGMA.background }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled">
      <View style={styles.scrollContentInner}>
        <View style={styles.content}>
          {/* 1. Logo (Supabase URL) – flush left */}
          <View style={styles.header}>
            <Image
            source={{ uri: LOGO_URI }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* 2. Content indented 32px */}
        <View style={styles.contentIndent}>
          {/* Figma H4, ranged left, text/primary */}
          <Text
            style={[
              styles.introText,
              {
                color: themeColors.textPrimary,
                fontFamily: Typography.fontFamily,
                fontSize: h4.fontSize,
                fontWeight: Typography.fontWeight.regular, // 400 (H4 text = regular per design)
                lineHeight: 25,
                letterSpacing: h4.letterSpacing,
                textAlign: 'left',
              },
            ]}>
            You need to sign in or create an account to continue.
          </Text>

          {/* Body1 typography: "Continue with Google" */}
          <Text
            style={[
              styles.sectionHeading,
              {
                color: themeColors.textPrimary,
                fontFamily: Typography.fontFamily,
                fontSize: body1.fontSize,
                fontWeight: body1.fontWeight,
                lineHeight: 24,
                letterSpacing: body1.letterSpacing,
                textAlign: 'left',
              },
            ]}>
            Continue with Google
          </Text>

          {/* 3. Continue with Google / Continue with Apple */}
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: FIGMA.socialButtonBg, borderColor: FIGMA.socialButtonBorder }]}
            onPress={handleGoogleLogin}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Continue with Gmail">
            <View style={styles.socialButtonContent}>
              <Image source={{ uri: GOOGLE_ICON_URI }} style={styles.socialButtonIcon} resizeMode="contain" />
              <Text style={[styles.socialButtonText, { color: themeColors.textPrimary }]}>Continue with Gmail</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: FIGMA.socialButtonBg, borderColor: FIGMA.socialButtonBorder }]}
            onPress={handleAppleLogin}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Continue with Apple">
            <View style={styles.socialButtonContent}>
              <Image source={{ uri: APPLE_ICON_URI }} style={styles.socialButtonIcon} resizeMode="contain" />
              <Text style={[styles.socialButtonText, { color: themeColors.textPrimary }]}>Continue with Apple</Text>
            </View>
          </TouchableOpacity>

          {/* 4. OR – typography caps, centred, no lines */}
          <Text style={[styles.orTextCentered, { color: themeColors.textPrimary }]}>OR</Text>

          {/* 5. Login with email / Register with email */}
          <TouchableOpacity
            style={[styles.outlinedButton, { backgroundColor: FIGMA.emailButtonBg, borderColor: FIGMA.emailButtonBorder }]}
            onPress={() => setShowEmailForm(true)}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Login with email">
            <Text style={[styles.outlinedButtonText, { color: themeColors.textPrimary }]}>Login with email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.outlinedButton, { backgroundColor: FIGMA.emailButtonBg, borderColor: FIGMA.emailButtonBorder }]}
            onPress={() => router.push('/(auth)/register')}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Register with email">
            <Text style={[styles.outlinedButtonText, { color: themeColors.textPrimary }]}>Register with email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingRight: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingLeft: 0,
  },
  scrollContentInner: {
    flexGrow: 1,
    paddingTop: Spacing.xl * 2, // 64px white space above logo (token: 32*2)
  },
  content: {
    width: '100%',
    maxWidth: 439,
    alignSelf: 'flex-start',
  },
  header: {
    marginTop: Spacing.xl, // 32px above logo (token)
    marginBottom: Spacing.md, // 16px gap to next element (Figma 2680-21990)
    width: '100%',
  },
  contentIndent: {
    paddingLeft: Spacing.xl, // 32px indent for all content below logo
    width: '100%',
  },
  logoImage: {
    width: 200,
    maxWidth: '100%',
    height: 56,
    marginBottom: 0,
    alignSelf: 'flex-start',
  },
  introText: {
    lineHeight: 24,
    textAlign: 'left',
    marginTop: Spacing.md, // 16px above H4 block
    marginBottom: Spacing.md, // 16px gap (Figma 2680-21990)
  },
  sectionHeading: {
    marginBottom: Spacing.md, // 16px gap
  },
  socialButton: {
    borderWidth: 1,
    borderRadius: BorderRadius.round,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md, // 16px gap between elements (Figma 2680-21990)
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  socialButtonIcon: {
    width: 22,
    height: 22,
  },
  socialButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    letterSpacing: Typography.letterSpacing.normal,
  },
  orTextCentered: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
    marginTop: 0,
    marginBottom: Spacing.md, // 16px below OR only
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.normal,
  },
  outlinedButton: {
    borderWidth: 1,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: 'transparent',
    marginBottom: Spacing.md, // 16px gap (Figma 2680-21990)
  },
  outlinedButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    letterSpacing: Typography.letterSpacing.normal,
  },
  cardContent: {
    padding: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  formTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.regular, // 400 normal
    marginBottom: Spacing.md,
  },
  buttonsContainer: {
    marginTop: Spacing.sm,
  },
  primaryButton: {
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  primaryButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    letterSpacing: Typography.letterSpacing.normal,
  },
  forgotPasswordLink: {
    alignItems: 'center',
    marginTop: Spacing.xl, // 32px above Forgotten Password (token)
  },
  forgotPasswordText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    textDecorationLine: 'underline',
    letterSpacing: Typography.letterSpacing.normal,
  },
  forgotPasswordContainer: {
    marginTop: Spacing.md,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.md, // 16px left padding
    marginBottom: Spacing.md, // 16px gap to next element
    gap: Spacing.xs,
  },
  backLinkText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
  },
});
