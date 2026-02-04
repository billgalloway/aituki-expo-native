/**
 * Registration Screen
 * Same layout as Login: logo at top, back button, 64px top space, 32px content indent.
 * Light theme per config/FIGMA_AUTH_COMPONENTS.md and constants/authTheme.
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
import { AUTH_FIGMA, AUTH_LOGO_URI } from '@/constants/authTheme';
import IconLibrary from '@/components/IconLibrary';
import FormTextField from '@/components/FormTextField';
import { router } from 'expo-router';

const PASSWORD_MIN_LENGTH = 8;

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [repeatError, setRepeatError] = useState('');
  const { signUp } = useAuth();
  const themeColors = Colors.light;

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    if (password !== repeatPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      Alert.alert('Error', `Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, {
      first_name: firstName.trim() || undefined,
      last_name: lastName.trim() || undefined,
      mobile_number: phoneNumber.trim() || undefined,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Registration Failed', error.message);
    } else {
      Alert.alert(
        'Success',
        'Account created! Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    }
  };

  const validateAndSignUp = () => {
    setPasswordError('');
    setRepeatError('');
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      setPasswordError(`Must be at least ${PASSWORD_MIN_LENGTH} characters`);
      return;
    }
    if (password !== repeatPassword) {
      setRepeatError('Passwords do not match');
      return;
    }
    handleRegister();
  };

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
            accessibilityLabel="Back to login">
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
              <Text style={[styles.formTitle, { color: themeColors.textPrimary }]}>Register with aiTuki</Text>

              <View style={styles.formContainer}>
                <FormTextField
                  label="First name"
                  placeholder="Value"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoComplete="name-given"
                  editable={!loading}
                />
                <FormTextField
                  label="Last name"
                  placeholder="Value"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoComplete="name-family"
                  editable={!loading}
                />
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

                <Text style={[styles.sectionLabel, { color: themeColors.textSecondary }]}>Required for account registration</Text>

                <FormTextField
                  label="Phone number"
                  placeholder="Value"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  editable={!loading}
                />

                <Text style={[styles.sectionLabel, { color: themeColors.textSecondary }]}>Required for app alerts</Text>

                <FormTextField
                  label="Password"
                  placeholder="Value"
                  value={password}
                  onChangeText={(t) => { setPassword(t); setPasswordError(''); }}
                  secureTextEntry
                  showPasswordToggle
                  autoCapitalize="none"
                  autoComplete="password-new"
                  editable={!loading}
                  error={!!passwordError}
                  helperText={passwordError || 'Must be at least 8 characters'}
                />
                <FormTextField
                  label="Repeat password"
                  placeholder="Value"
                  value={repeatPassword}
                  onChangeText={(t) => { setRepeatPassword(t); setRepeatError(''); }}
                  secureTextEntry
                  showPasswordToggle
                  autoCapitalize="none"
                  autoComplete="password-new"
                  editable={!loading}
                  error={!!repeatError}
                  helperText={repeatError}
                />

                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: themeColors.primary }]}
                  onPress={validateAndSignUp}
                  disabled={loading}
                  accessibilityRole="button"
                  accessibilityLabel="Register with AiTuki">
                  {loading ? (
                    <ActivityIndicator size="small" color={themeColors.textPrimary} />
                  ) : (
                    <View style={styles.primaryButtonContent}>
                      <Text style={[styles.primaryButtonText, { color: themeColors.textPrimary }]}>Register with AiTuki</Text>
                      <IconLibrary iconName="chevron-right" size={18} color={themeColors.textPrimary} />
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={[styles.signInRow, { marginTop: Spacing.lg }]}>
                <Text style={[styles.signInText, { color: themeColors.textPrimary }]}>Already have an aiTuki account? </Text>
                <TouchableOpacity
                  onPress={() => router.replace('/(auth)/login')}
                  accessibilityRole="link"
                  accessibilityLabel="Login">
                  <Text style={[styles.signInLink, { color: themeColors.textPrimary }]}>Login</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.legalBlock}>
                <Text style={[styles.legalText, { color: themeColors.textSecondary }]}>
                  By proceeding to create an account you agree to the aiTuki{' '}
                  <Text style={[styles.legalLink, { color: themeColors.textPrimary }]} onPress={() => router.push('/data-privacy')}>Privacy policy</Text>.
                  Read our{' '}
                  <Text style={[styles.legalLink, { color: themeColors.textPrimary }]} onPress={() => router.push('/data-privacy')}>Terms & conditions</Text>
                  {' '}for details on how we collect and handle your personal details.
                </Text>
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
  scrollContentInner: {
    flexGrow: 1,
    paddingTop: Spacing.xl * 2, // 64px above back button (token)
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
    paddingLeft: Spacing.xl,  // 32px content margin (form only; back + logo range left)
    paddingRight: Spacing.xl,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.md, // 16px
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  backLinkText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
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
  sectionLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.regular,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
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
  orText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
    marginTop: 0,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  socialButton: {
    borderWidth: 1,
    borderRadius: BorderRadius.round,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
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
  },
  signInRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  signInText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
  },
  signInLink: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    textDecorationLine: 'underline',
  },
  legalBlock: {
    marginTop: Spacing.lg,
  },
  legalText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xs,
    lineHeight: 18,
    fontWeight: Typography.fontWeight.regular,
  },
  legalLink: {
    textDecorationLine: 'underline',
    fontWeight: Typography.fontWeight.bold,
  },
});
