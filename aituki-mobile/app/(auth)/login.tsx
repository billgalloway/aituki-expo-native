/**
 * Login Screen
 * Matches Figma LoginRegister component design exactly
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
  Image,
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
    console.log('🍎 Apple Sign-In button clicked');
    const { error, debugInfo } = await signInWithApple();
    setLoading(false);

    if (error) {
      console.error('❌ Apple Sign-In error:', error);
      // Show detailed error message for debugging
      const errorMessage = debugInfo 
        ? `${error.message}\n\nDebug Info:\n${JSON.stringify(debugInfo, null, 2)}`
        : error.message || 'Unable to sign in with Apple. Please check your configuration or try again.';
      
      Alert.alert(
        'Apple Sign-In Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    } else {
      console.log('✅ Apple Sign-In completed successfully');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    console.log('🔵 Google Sign-In button clicked');
    const { error, debugInfo } = await signInWithGoogle();
    setLoading(false);

    if (error) {
      console.error('❌ Google Sign-In error:', error);
      // Show detailed error message for debugging
      const errorMessage = debugInfo 
        ? `${error.message}\n\nDebug Info:\n${JSON.stringify(debugInfo, null, 2)}`
        : error.message || 'Unable to sign in with Google. Please check your configuration or try again.';
      
      Alert.alert(
        'Google Sign-In Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    } else {
      console.log('✅ Google Sign-In completed successfully');
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
          {/* Logo and Title Section */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* Card Content - Form */}
          <View style={styles.cardContent}>
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#24262f"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                </View>
              </View>

              {/* Password Input */}
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
                    autoComplete="password"
                  />
                </View>
              </View>
            </View>

            {/* Login Button */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleEmailLogin}
                disabled={loading}>
                <View style={styles.primaryButtonContent}>
                  <Text style={styles.primaryButtonText}>Login to AiTuki</Text>
                  <IconLibrary iconName="chevron-right" size={18} color={Colors.light.text} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Forgotten Password Link */}
            {!showForgotPassword && (
              <TouchableOpacity
                style={styles.forgotPasswordLink}
                onPress={() => setShowForgotPassword(true)}>
                <Text style={styles.forgotPasswordText}>Forgotten Password?</Text>
              </TouchableOpacity>
            )}

            {showForgotPassword && (
              <View style={styles.forgotPasswordHeader}>
                <Text style={styles.forgotPasswordTitle}>Update your password</Text>
              </View>
            )}

            {showForgotPassword && (
              <View style={styles.forgotPasswordContainer}>
                <View style={styles.form}>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Email address"
                        placeholderTextColor="#24262f"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                        editable={!loading}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleForgotPassword}
                    disabled={loading}>
                    <View style={styles.primaryButtonContent}>
                      <Text style={styles.primaryButtonText}>
                        {loading ? 'Sending...' : 'Update password'}
                      </Text>
                      <IconLibrary iconName="chevron-right" size={18} color={Colors.light.text} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Social Login Section */}
          <View style={styles.socialLoginSection}>
            {/* Continue with Gmail */}
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleLogin}
              disabled={loading}>
              <View style={styles.socialButtonContent}>
                <IconLibrary iconName="google" size={24} color={Colors.light.text} />
                <Text style={styles.socialButtonText}>Continue with Gmail</Text>
              </View>
            </TouchableOpacity>

            {/* Continue with Apple */}
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleAppleLogin}
              disabled={loading}>
              <View style={styles.socialButtonContent}>
                <IconLibrary iconName="apple" size={24} color={Colors.light.text} />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </View>
            </TouchableOpacity>

            {/* Sign in with email */}
            <TouchableOpacity
              style={styles.outlinedButton}
              onPress={handleEmailLogin}
              disabled={loading}>
              <Text style={styles.outlinedButtonText}>Sign in with email</Text>
            </TouchableOpacity>

            {/* Sign up another way */}
            <TouchableOpacity
              style={styles.signUpLink}
              onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.signUpLinkText}>Sign up another way</Text>
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
    padding: Spacing.md,
  },
  content: {
    width: '100%',
    maxWidth: 439,
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
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text, // #1f5661
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
    borderRadius: 9999, // Full rounded (pill shape) as per Figma
    paddingHorizontal: 32, // var(--sds-size-space-800,32px) from Figma
    paddingVertical: 16,
    backgroundColor: Colors.light.surface,
    minHeight: 56,
    justifyContent: 'center',
  },
  input: {
    fontFamily: Typography.fontFamily,
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
    fontSize: 15, // var(--_fontsize/0,9375rem,15px) from Figma
    fontWeight: Typography.fontWeight.medium, // 500 (Medium) as per Figma
    color: Colors.light.text, // #1f5661
    lineHeight: 26, // button/large lineHeight from Figma
    letterSpacing: 0.46, // button/large letterSpacing from Figma
  },
  forgotPasswordLink: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  forgotPasswordText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text, // #1f5661
    textDecorationLine: 'underline',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  forgotPasswordHeader: {
    width: '100%',
    marginTop: Spacing.sm,
  },
  forgotPasswordTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text, // #1f5661
    lineHeight: 24,
    letterSpacing: 0.15,
    width: '100%',
    textAlign: 'left',
  },
  forgotPasswordContainer: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  socialLoginSection: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
  },
  socialButton: {
    backgroundColor: 'rgba(239, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: Colors.light.primaryDark, // #27cccc
    borderRadius: 64,
    minHeight: 47,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  socialButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: 14,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text, // #1f5661
    lineHeight: 18,
    letterSpacing: 0.4,
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: Colors.light.primaryDark, // #27cccc
    borderRadius: 32,
    paddingVertical: 8,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    backgroundColor: 'transparent', // Outlined button has no background
  },
  outlinedButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: 14,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text, // #1f5661
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  signUpLink: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    minWidth: 80,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderRadius: 4,
  },
  signUpLinkText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text, // #1f5661
    textDecorationLine: 'underline',
    lineHeight: 18,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
});
