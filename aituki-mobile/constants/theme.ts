/**
 * AiTuki Design System Theme
 * Based on Figma design tokens and MUI Material Design
 */

import { Platform } from 'react-native';

// Color palette matching Figma design
export const Colors = {
  light: {
    // Primary colors
    primary: '#69f0f0',
    primaryLight: '#98ffff',
    primaryDark: '#27cccc',
    
    // Text colors
    text: '#1f5661',
    textSecondary: 'rgba(31,86,97,0.6)',
    textDisabled: 'rgba(31,86,97,0.38)',
    
    // Background colors
    background: '#ffffff',
    surface: '#ffffff',
    
    // Semantic colors
    error: '#d32f2f',
    warning: '#ef6c00',
    info: '#0288d1',
    success: '#4caf50',
    
    // UI colors
    border: 'rgba(31,86,97,0.15)',
    divider: 'rgba(31,86,97,0.12)',
    
    // Tab colors
    tabIconDefault: 'rgba(31,86,97,0.6)',
    tabIconSelected: '#1f5661',
    icon: '#687076',
    
    // Status colors
    statusBar: '#69f0f0',
  },
  dark: {
    // Primary colors
    primary: '#69f0f0',
    primaryLight: '#98ffff',
    primaryDark: '#27cccc',
    
    // Text colors
    text: '#ECEDEE',
    textSecondary: 'rgba(236,237,238,0.6)',
    textDisabled: 'rgba(236,237,238,0.38)',
    
    // Background colors
    background: '#151718',
    surface: '#1f1f1f',
    
    // Semantic colors
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    success: '#4caf50',
    
    // UI colors
    border: 'rgba(236,237,238,0.15)',
    divider: 'rgba(236,237,238,0.12)',
    
    // Tab colors
    tabIconDefault: 'rgba(236,237,238,0.6)',
    tabIconSelected: '#ECEDEE',
    icon: '#9BA1A6',
    
    // Status colors
    statusBar: '#1f5661',
  },
};

// Typography - Matching Figma MUI Typography Component
export const Typography = {
  fontFamily: Platform.select({
    ios: 'Nunito Sans',
    android: 'Nunito Sans',
    default: 'Nunito Sans, sans-serif',
  }),
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 20,
    xl: 24,
    h2: 34, // 2.125rem
    h1: 34, // 2.125rem
  },
  lineHeight: {
    xs: 1.66,
    sm: 1.43,
    base: 1.334,
    lg: 1.235,
    xl: 1.167,
  },
  letterSpacing: {
    tight: 0.1,
    normal: 0.15,
    wide: 0.25,
    wider: 0.4,
  },
  // Typography variants matching Figma MUI Typography component
  variants: {
    h1: {
      fontFamily: Platform.select({
        ios: 'Nunito Sans',
        android: 'Nunito Sans',
        default: 'Nunito Sans, sans-serif',
      }),
      fontSize: 34, // 2.125rem
      fontWeight: '500' as const,
      lineHeight: 40, // var(--7,40px)
      letterSpacing: -1.5,
    },
    h2: {
      fontFamily: Platform.select({
        ios: 'Nunito Sans',
        android: 'Nunito Sans',
        default: 'Nunito Sans, sans-serif',
      }),
      fontSize: 34, // 2.125rem
      fontWeight: '500' as const,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h3: {
      fontFamily: Platform.select({
        ios: 'Nunito Sans',
        android: 'Nunito Sans',
        default: 'Nunito Sans, sans-serif',
      }),
      fontSize: 24, // 1.5rem
      fontWeight: '500' as const,
      lineHeight: 1.167,
      letterSpacing: 0,
    },
    h4: {
      fontFamily: Platform.select({
        ios: 'Nunito Sans',
        android: 'Nunito Sans',
        default: 'Nunito Sans, sans-serif',
      }),
      fontSize: 20, // 1.25rem
      fontWeight: '500' as const,
      lineHeight: 1.235,
      letterSpacing: 0.25,
    },
    h5: {
      fontFamily: Platform.select({
        ios: 'Nunito Sans',
        android: 'Nunito Sans',
        default: 'Nunito Sans, sans-serif',
      }),
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 1.334,
      letterSpacing: 0,
    },
    h6: {
      fontFamily: Platform.select({
        ios: 'Nunito Sans',
        android: 'Nunito Sans',
        default: 'Nunito Sans, sans-serif',
      }),
      fontSize: 14, // 0.875rem
      fontWeight: '500' as const,
      lineHeight: 1.6,
      letterSpacing: 0.15,
    },
    subtitle1: {
      fontFamily: Platform.select({
        ios: 'Nunito Sans',
        android: 'Nunito Sans',
        default: 'Nunito Sans, sans-serif',
      }),
      fontSize: 16, // 1rem
      fontWeight: '500' as const,
      lineHeight: 1.75,
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontFamily: Platform.select({
        ios: 'Nunito Sans',
        android: 'Nunito Sans',
        default: 'Nunito Sans, sans-serif',
      }),
      fontSize: 14, // 0.875rem
      fontWeight: '500' as const,
      lineHeight: 1.57,
      letterSpacing: 0.1,
    },
    body1: {
      fontFamily: Platform.select({
        ios: 'Nunito Sans',
        android: 'Nunito Sans',
        default: 'Nunito Sans, sans-serif',
      }),
      fontSize: 16, // 1rem
      fontWeight: '400' as const,
      lineHeight: 1.5,
      letterSpacing: 0.15,
    },
    body2: {
      fontFamily: Platform.select({
        ios: 'Nunito Sans',
        android: 'Nunito Sans',
        default: 'Nunito Sans, sans-serif',
      }),
      fontSize: 14, // 0.875rem
      fontWeight: '400' as const,
      lineHeight: 1.43,
      letterSpacing: 0.17,
    },
    caption: {
      fontFamily: Platform.select({
        ios: 'Nunito Sans',
        android: 'Nunito Sans',
        default: 'Nunito Sans, sans-serif',
      }),
      fontSize: 12, // 0.75rem
      fontWeight: '400' as const,
      lineHeight: 1.66,
      letterSpacing: 0.4,
    },
    overline: {
      fontFamily: Platform.select({
        ios: 'Nunito Sans',
        android: 'Nunito Sans',
        default: 'Nunito Sans, sans-serif',
      }),
      fontSize: 12, // 0.75rem
      fontWeight: '500' as const,
      lineHeight: 2.66,
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
    },
  },
};

// Fonts (for backward compatibility with existing components)
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Border radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 32,
  round: 9999,
};

// Shadows
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';

// Configure fonts for React Native Paper
const fontConfig = {
  displayLarge: {
    fontFamily: Typography.fontFamily,
    fontSize: 57,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: Typography.fontFamily,
    fontSize: 45,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: Typography.fontFamily,
    fontSize: 36,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: Typography.fontFamily,
    fontSize: 32,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: Typography.fontFamily,
    fontSize: 28,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: Typography.fontFamily,
    fontSize: 24,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: Typography.fontFamily,
    fontSize: 22,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    fontWeight: '500' as const,
    letterSpacing: Typography.letterSpacing.normal,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: Typography.fontFamily,
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: Typography.letterSpacing.tight,
    lineHeight: 20,
  },
  labelLarge: {
    fontFamily: Typography.fontFamily,
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: Typography.letterSpacing.tight,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: Typography.letterSpacing.normal,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: Typography.fontFamily,
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: Typography.letterSpacing.normal,
    lineHeight: 16,
  },
  bodyLarge: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: Typography.letterSpacing.normal,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: Typography.fontFamily,
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: Typography.letterSpacing.normal,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: Typography.letterSpacing.normal,
    lineHeight: 16,
  },
};

// React Native Paper Theme - Light (for Material Design components)
export const PaperThemeLight = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.light.primary,
    primaryContainer: Colors.light.primaryLight,
    secondary: Colors.light.primaryDark,
    background: Colors.light.background,
    surface: Colors.light.surface,
    surfaceVariant: Colors.light.surface,
    onPrimary: Colors.light.text,
    onSecondary: Colors.light.text,
    onBackground: Colors.light.text,
    onSurface: Colors.light.text,
    onSurfaceVariant: Colors.light.textSecondary,
    error: Colors.light.error,
    onError: '#ffffff',
    errorContainer: Colors.light.error,
    onErrorContainer: '#ffffff',
    warning: Colors.light.warning,
    info: Colors.light.info,
    success: Colors.light.success,
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: BorderRadius.full,
};

// React Native Paper Theme - Dark (for Material Design components)
export const PaperThemeDark = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.dark.primary,
    primaryContainer: Colors.dark.primaryLight,
    secondary: Colors.dark.primaryDark,
    background: Colors.dark.background,
    surface: Colors.dark.surface,
    surfaceVariant: Colors.dark.surface,
    onPrimary: Colors.dark.text,
    onSecondary: Colors.dark.text,
    onBackground: Colors.dark.text,
    onSurface: Colors.dark.text,
    onSurfaceVariant: Colors.dark.textSecondary,
    error: Colors.dark.error,
    onError: '#ffffff',
    errorContainer: Colors.dark.error,
    onErrorContainer: '#ffffff',
    warning: Colors.dark.warning,
    info: Colors.dark.info,
    success: Colors.dark.success,
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: BorderRadius.full,
};

// Default export for backward compatibility
export const PaperTheme = PaperThemeLight;
