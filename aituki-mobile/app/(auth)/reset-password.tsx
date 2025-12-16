/**
 * Password Reset Screen
 * Handles password reset from email link
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/services/supabase';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'react-native';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    // Check if we have the necessary tokens from the email link
    if (!params?.access_token && !params?.type) {
      setIsValidLink(false);
    }
  }, [params]);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please enter both password fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // If we have access_token from the email link, we need to set the session first
      if (params?.access_token) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: params.access_token as string,
          refresh_token: params.refresh_token as string,
        });

        if (sessionError) {
          Alert.alert('Error', 'Invalid or expired reset link. Please request a new one.');
          router.replace('/(auth)/login');
          return;
        }
      }

      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

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
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  if (!isValidLink) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.errorContainer}>
          <IconLibrary iconName="error" size={48} color={Colors.light.error} />
          <Text style={[styles.errorTitle, { color: themeColors.text }]}>
            Invalid Reset Link
          </Text>
          <Text style={[styles.errorText, { color: themeColors.textSecondary }]}>
            This password reset link is invalid or has expired. Please request a new password reset.
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: Colors.light.primary }]}
            onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.primaryButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          {/* Logo and Title Section - Matching Login Screen */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: themeColors.text }]}>Update your password</Text>
          </View>

          {/* Card Content - Form */}
          <View style={styles.cardContent}>
            <View style={styles.form}>
              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#24262f"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password-new"
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm password"
                    placeholderTextColor="#24262f"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password-new"
                  />
                </View>
              </View>
            </View>

            {/* Reset Password Button */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleResetPassword}
                disabled={loading}>
                <View style={styles.primaryButtonContent}>
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Updating...' : 'Update password'}
                  </Text>
                  <IconLibrary iconName="chevron-right" size={18} color={Colors.light.text} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 439, // Matching login screen width
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.sm,
    width: '100%',
  },
  logo: {
    width: 124,
    height: 50,
    marginBottom: Spacing.sm,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text, // #1f5661
    lineHeight: 24,
    letterSpacing: 0.15,
    width: '100%',
    textAlign: 'left',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.textSecondary,
    lineHeight: 24,
    letterSpacing: 0.15,
    width: '100%',
    textAlign: 'left',
  },
  cardContent: {
    gap: Spacing.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  form: {
    gap: Spacing.md,
  },
  inputWrapper: {
    width: '100%',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: 9999, // Full rounded (pill shape) matching login
    paddingHorizontal: 32, // Matching login screen
    paddingVertical: 16,
    backgroundColor: Colors.light.surface,
    minHeight: 56,
    justifyContent: 'center',
  },
  input: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.15,
    color: '#24262f', // Text secondary color from Figma
    flex: 1,
  },
  buttonsContainer: {
    gap: 0,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary, // #69f0f0
    borderRadius: 32,
    paddingVertical: 8,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: 15, // Matching login button
    fontWeight: Typography.fontWeight.medium, // 500 (Medium)
    color: Colors.light.text, // #1f5661
    lineHeight: 26,
    letterSpacing: 0.46,
  },
  errorContainer: {
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


