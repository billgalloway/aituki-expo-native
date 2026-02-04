/**
 * Auth screens shared styling (Login, Register, Reset password).
 * Matches the implemented Login screen (Figma 2680-21990, light theme).
 * Import this in app/(auth)/login.tsx, register.tsx, reset-password.tsx for consistency.
 */

import { Spacing } from './theme';

/** Light theme: white background, teal borders. All text = primary #1F5661 (use Colors.light.textPrimary) */
export const AUTH_FIGMA = {
  background: '#ffffff',
  textPrimary: '#1f5661',
  teal: '#0d9488',
  socialButtonBg: '#fafafa',
  socialButtonBorder: '#0d9488',
  emailButtonBg: '#fafafa',
  emailButtonBorder: '#0d9488',
} as const;

export const AUTH_LOGO_URI =
  'https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/brand/tukiai%20logo.png';
export const AUTH_GOOGLE_ICON_URI =
  'https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/brand%20icons/googleIcon.png';
export const AUTH_APPLE_ICON_URI =
  'https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/brand%20icons/appleIcon.png';

/** Vertical gap between all elements in auth container (Figma 2680-21990) */
export const AUTH_VERTICAL_GAP = Spacing.md; // 16px

/** 64px space above logo: use marginTop on header or paddingTop on scroll inner */
export const AUTH_TOP_SPACE = Spacing.xl * 2; // 64px

/** 32px indent for content below logo */
export const AUTH_CONTENT_INDENT = Spacing.xl; // 32px
