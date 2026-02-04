/**
 * Password Reset Screens
 * 1) Request reset (no params): Forgotten Password – logo, instruction, email field, "Reset password" button.
 * 2) Set new password (from email link): Update password form.
 * Light theme and layout match login/register (config/FIGMA_AUTH_COMPONENTS.md, constants/authTheme).
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { AUTH_FIGMA, AUTH_LOGO_URI } from '@/constants/authTheme';
import IconLibrary from '@/components/IconLibrary';
import FormTextField from '@/components/FormTextField';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { resetPassword: sendResetEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [isValidLink, setIsValidLink] = useState(true);

  const themeColors = Colors.light;

  // Request-reset screen when opened without link params (e.g. from "Forgotten Password?" on login).
  // Temp link uses ?dev=set-password to show the set-new-password form.
  const isRequestScreen =
    !params?.access_token && !params?.type && params?.dev !== 'set-password';

  const handleRequestReset = async () => {
    if (!email?.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    setLoading(true);
    const { error } = await sendResetEmail(email.trim());
    setLoading(false);
    if (error) {
      const isRecoveryEmailError =
        /recovery email|sending.*email|error sending/i.test(error.message);
      const message = isRecoveryEmailError
        ? 'Password reset emails are not set up yet. Please ask the app administrator to configure SMTP in Supabase (Settings → Auth → SMTP Settings).'
        : error.message;
      Alert.alert('Error', message);
    } else {
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your email for instructions to reset your password.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    }
  };

  const validateAndReset = () => {
    setPasswordError('');
    setConfirmError('');
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please enter both password fields');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      return;
    }
    handleSetNewPassword();
  };

  const handleSetNewPassword = async () => {
    setLoading(true);
    try {
      if (params?.access_token) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: params.access_token as string,
          refresh_token: params.refresh_token as string,
        });
        if (sessionError) {
          setLoading(false);
          setIsValidLink(false);
          return;
        }
      }
      const { error } = await supabase.auth.updateUser({ password });
      setLoading(false);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert(
          'Success',
          'Your password has been reset successfully!',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
        );
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  // —— Forgotten Password (request reset) screen ——
  if (isRequestScreen) {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: AUTH_FIGMA.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.scrollContentInner}>
            <TouchableOpacity
              style={styles.backLink}
              onPress={() => router.replace('/(auth)/login')}
              accessibilityRole="button"
              accessibilityLabel="Back to sign in">
              <IconLibrary iconName="chevron-left" size={24} color={themeColors.textPrimary} />
              <Text style={[styles.backLinkText, { color: themeColors.textPrimary }]}>Back</Text>
            </TouchableOpacity>

            <View style={styles.content}>
              <View style={styles.header}>
                <Image
                  source={{ uri: AUTH_LOGO_URI }}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.contentIndent}>
                <Text style={[styles.instructionText, { color: themeColors.textPrimary }]}>
                  Enter email address or mobile number to reset password
                </Text>
                <View style={styles.formContainer}>
                  <FormTextField
                    label="Email"
                    placeholder="Value"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: themeColors.primary }]}
                    onPress={handleRequestReset}
                    disabled={loading}
                    accessibilityRole="button"
                    accessibilityLabel="Reset password">
                    {loading ? (
                      <ActivityIndicator size="small" color={themeColors.textPrimary} />
                    ) : (
                      <View style={styles.primaryButtonContent}>
                        <Text style={[styles.primaryButtonText, { color: themeColors.textPrimary }]}>
                          Reset password
                        </Text>
                        <IconLibrary iconName="chevron-right" size={18} color={themeColors.textPrimary} />
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.tempLink}
                    onPress={() => router.push('/(auth)/reset-password?dev=set-password')}
                    accessibilityRole="link"
                    accessibilityLabel="Page after clicking email link (temp)">
                    <Text style={[styles.tempLinkText, { color: themeColors.textPrimary }]}>
                      Page after clicking email link (temp)
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

  // —— Invalid reset link ——
  if (!isValidLink) {
    return (
      <View style={[styles.container, { backgroundColor: AUTH_FIGMA.background }]}>
        <View style={styles.errorContainer}>
          <IconLibrary iconName="warning" size={48} color={themeColors.error} />
          <Text style={[styles.errorTitle, { color: themeColors.textPrimary }]}>Invalid Reset Link</Text>
          <Text style={[styles.errorText, { color: themeColors.textSecondary }]}>
            This password reset link is invalid or has expired. Please request a new password reset from the sign-in screen.
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: themeColors.primary }]}
            onPress={() => router.replace('/(auth)/login')}
            accessibilityRole="button"
            accessibilityLabel="Go to login">
            <Text style={[styles.primaryButtonText, { color: themeColors.textPrimary }]}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // —— Set new password (from email link) ——
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: AUTH_FIGMA.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentSetPassword}
        keyboardShouldPersistTaps="handled">
        <View style={styles.scrollContentInner}>
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => router.replace('/(auth)/login')}
            accessibilityRole="button"
            accessibilityLabel="Back to sign in">
            <IconLibrary iconName="chevron-left" size={24} color={themeColors.textPrimary} />
            <Text style={[styles.backLinkText, { color: themeColors.textPrimary }]}>Back</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.header}>
              <Image
                source={{ uri: AUTH_LOGO_URI }}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.contentIndent}>
              <Text style={[styles.formTitle, { color: themeColors.textPrimary }]}>Update your password</Text>
              <View style={styles.formContainer}>
                <FormTextField
                  label="New password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChangeText={(t) => { setPassword(t); setPasswordError(''); }}
                  secureTextEntry
                  showPasswordToggle
                  autoCapitalize="none"
                  autoComplete="password-new"
                  editable={!loading}
                  error={!!passwordError}
                  helperText={passwordError}
                />
                <FormTextField
                  label="Confirm new password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChangeText={(t) => { setConfirmPassword(t); setConfirmError(''); }}
                  secureTextEntry
                  showPasswordToggle
                  autoCapitalize="none"
                  autoComplete="password-new"
                  editable={!loading}
                  error={!!confirmError}
                  helperText={confirmError}
                />
                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: themeColors.primary }]}
                  onPress={validateAndReset}
                  disabled={loading}
                  accessibilityRole="button"
                  accessibilityLabel="Update password">
                  <View style={styles.primaryButtonContent}>
                    {loading ? (
                      <ActivityIndicator size="small" color={themeColors.textPrimary} />
                    ) : (
                      <>
                        <Text style={[styles.primaryButtonText, { color: themeColors.textPrimary }]}>
                          Update password
                        </Text>
                        <IconLibrary iconName="chevron-right" size={18} color={themeColors.textPrimary} />
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.lg,
  },
  scrollContentSetPassword: {
    flexGrow: 1,
    paddingBottom: Spacing.lg,
  },
  scrollContentInner: {
    flexGrow: 1,
    paddingTop: Spacing.xl * 2, // 64px
  },
  content: {
    width: '100%',
    maxWidth: 439,
    alignSelf: 'flex-start',
  },
  header: {
    marginTop: Spacing.xl, // 32px above logo (token)
    marginBottom: Spacing.md,
    width: '100%',
  },
  logoImage: {
    width: 200,
    maxWidth: '100%',
    height: 56,
    alignSelf: 'flex-start',
  },
  contentIndent: {
    width: '100%',
    paddingLeft: Spacing.xl,
    paddingRight: Spacing.xl,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  backLinkText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
  },
  instructionText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    marginBottom: Spacing.md,
  },
  formTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.regular,
    marginBottom: Spacing.md,
  },
  formContainer: {
    marginBottom: Spacing.md,
  },
  primaryButton: {
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: Spacing.md,
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
  },
  tempLink: {
    marginTop: Spacing.md,
    alignSelf: 'flex-start',
  },
  tempLinkText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    textDecorationLine: 'underline',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  errorText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
});
