/**
 * Login Screen
 * Email/password login with Apple and Google OAuth options
 */

import React, { useState } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, resetPassword, signInWithApple, signInWithGoogle } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? Colors.dark : Colors.light;

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
      Alert.alert('Apple Sign-In Failed', error.message);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    setLoading(false);

    if (error) {
      Alert.alert('Google Sign-In Failed', error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your email for instructions to reset your password.',
        [{ text: 'OK', onPress: () => setShowForgotPassword(false) }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          {/* Logo/App Name */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: themeColors.text }]}>Welcome to AiTuki</Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
              Sign in to continue
            </Text>
          </View>

          {/* Email/Password Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <IconLibrary iconName="email" size={20} color={themeColors.textSecondary} />
              <TextInput
                style={[styles.input, { color: themeColors.text }]}
                placeholder="Email"
                placeholderTextColor={themeColors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <IconLibrary iconName="lock" size={20} color={themeColors.textSecondary} />
              <TextInput
                style={[styles.input, { color: themeColors.text }]}
                placeholder="Password"
                placeholderTextColor={themeColors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: Colors.light.primary }]}
              onPress={handleEmailLogin}
              disabled={loading}>
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => setShowForgotPassword(true)}>
              <Text style={[styles.forgotPasswordText, { color: themeColors.textSecondary }]}>
                Forgot password?
              </Text>
            </TouchableOpacity>

            {showForgotPassword && (
              <View style={styles.forgotPasswordContainer}>
                <Text style={[styles.forgotPasswordTitle, { color: themeColors.text }]}>
                  Reset Password
                </Text>
                <Text style={[styles.forgotPasswordDescription, { color: themeColors.textSecondary }]}>
                  Enter your email address and we'll send you instructions to reset your password.
                </Text>
                <View style={styles.inputContainer}>
                  <IconLibrary iconName="email" size={20} color={themeColors.textSecondary} />
                  <TextInput
                    style={[styles.input, { color: themeColors.text }]}
                    placeholder="Email"
                    placeholderTextColor={themeColors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    editable={!loading}
                  />
                </View>
                <View style={styles.forgotPasswordButtons}>
                  <TouchableOpacity
                    style={[styles.secondaryButton, { borderColor: themeColors.border }]}
                    onPress={() => setShowForgotPassword(false)}
                    disabled={loading}>
                    <Text style={[styles.secondaryButtonText, { color: themeColors.text }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: Colors.light.primary }]}
                    onPress={handleForgotPassword}
                    disabled={loading}>
                    <Text style={styles.primaryButtonText}>
                      {loading ? 'Sending...' : 'Send Reset Email'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: themeColors.divider }]} />
            <Text style={[styles.dividerText, { color: themeColors.textSecondary }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: themeColors.divider }]} />
          </View>

          {/* OAuth Buttons */}
          <View style={styles.oauthContainer}>
            <TouchableOpacity
              style={[styles.oauthButton, { borderColor: themeColors.border }]}
              onPress={handleAppleLogin}
              disabled={loading}>
              <IconLibrary iconName="apple" size={24} color={themeColors.text} />
              <Text style={[styles.oauthButtonText, { color: themeColors.text }]}>
                Continue with Apple
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.oauthButton, { borderColor: themeColors.border }]}
              onPress={handleGoogleLogin}
              disabled={loading}>
              <IconLibrary iconName="google" size={24} color={themeColors.text} />
              <Text style={[styles.oauthButtonText, { color: themeColors.text }]}>
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={[styles.signUpText, { color: themeColors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={[styles.signUpLink, { color: Colors.light.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl * 1.5,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.light.surface,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    paddingVertical: Spacing.md,
  },
  primaryButton: {
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  primaryButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  forgotPasswordText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
  },
  forgotPasswordContainer: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.surface,
  },
  forgotPasswordTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  forgotPasswordDescription: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.md,
  },
  forgotPasswordButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    marginHorizontal: Spacing.md,
  },
  oauthContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.light.surface,
  },
  oauthButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  signUpText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
  },
  signUpLink: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
});

