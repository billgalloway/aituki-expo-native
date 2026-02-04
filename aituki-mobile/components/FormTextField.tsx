/**
 * FormTextField
 * MUI-style text field using design tokens (Spacing, BorderRadius, Typography, Colors).
 * Use for login, register, and reset-password forms.
 * Figma: aiTuki prototype V01 auth components (config/FIGMA_AUTH_COMPONENTS.md).
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface FormTextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  helperText?: string;
  secureTextEntry?: boolean;
  /** Show visibility toggle for password field */
  showPasswordToggle?: boolean;
  /** Optional container style */
  containerStyle?: object;
}

export function FormTextField({
  label,
  placeholder,
  value,
  onChangeText,
  error = false,
  helperText,
  secureTextEntry = false,
  showPasswordToggle = false,
  containerStyle,
  ...rest
}: FormTextFieldProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = secureTextEntry && !passwordVisible;

  const borderColor = error ? theme.error : focused ? theme.primary : theme.border;
  const labelColor = error ? theme.error : theme.textSecondary;
  const helperColor = error ? theme.error : theme.textSecondary;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputWrap,
          {
            borderColor,
            backgroundColor: theme.surface,
          },
        ]}>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={isPassword}
          accessibilityLabel={label || placeholder}
          accessibilityHint={helperText}
          {...rest}
        />
        {showPasswordToggle && secureTextEntry ? (
          <TouchableOpacity
            style={styles.adornment}
            onPress={() => setPasswordVisible((v) => !v)}
            accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <IconLibrary
              iconName={passwordVisible ? 'visibility_off' : 'visibility'}
              size={22}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {helperText ? (
        <Text style={[styles.helper, { color: helperColor }]} numberOfLines={2}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: 20,
    letterSpacing: Typography.letterSpacing.normal,
    marginBottom: Spacing.xs,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: 24,
    letterSpacing: Typography.letterSpacing.normal,
    paddingVertical: Spacing.sm,
    paddingRight: Spacing.xs,
  },
  adornment: {
    padding: Spacing.xs,
  },
  helper: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xs,
    lineHeight: 16,
    letterSpacing: Typography.letterSpacing.normal,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});

export default FormTextField;
