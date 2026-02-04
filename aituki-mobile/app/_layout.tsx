/**
 * Root Layout
 * Sets up React Native Paper theme provider and Auth context.
 * Shows Figma loading screen (teal + teardrop) while auth is resolving.
 */

import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StatusBar as RNStatusBar, Platform } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { PaperThemeLight, PaperThemeDark, Colors, LoadingScreenTheme } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

SplashScreen.preventAutoHideAsync();

const LOADING_MIN_DISPLAY_MS = 10_000; // 10s so we can visually see the loading screen on load

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppWithSplash() {
  const { loading } = useAuth();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const [iconFontsLoaded] = useFonts({
    ...MaterialCommunityIcons.font,
  });

  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), LOADING_MIN_DISPLAY_MS);
    return () => clearTimeout(t);
  }, []);

  const showingLoading = loading || !minTimeElapsed || !iconFontsLoaded;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const paperTheme = isDark ? PaperThemeDark : PaperThemeLight;
  const statusBarColor = showingLoading ? LoadingScreenTheme.gradient.mid : (isDark ? Colors.dark.statusBar : Colors.light.primary);
  const statusBarStyle = showingLoading ? 'light-content' : (isDark ? 'light-content' : 'dark-content');

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        {Platform.OS === 'android' && (
          <RNStatusBar backgroundColor={statusBarColor} barStyle={statusBarStyle} />
        )}
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="account-settings" />
            <Stack.Screen name="personal-details" />
            <Stack.Screen name="password-security" />
            <Stack.Screen name="data-privacy" />
            <Stack.Screen name="alerts-notifications" />
            <Stack.Screen name="update-name" />
            <Stack.Screen name="update-email" />
            <Stack.Screen name="update-mobile" />
            <Stack.Screen name="update-address" />
            <Stack.Screen name="connect-apple-health" />
            <Stack.Screen name="apple-health-permissions" />
            <Stack.Screen name="apple-health-sync" />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
          </Stack>
          {showingLoading && <LoadingScreen />}
          <ExpoStatusBar style={showingLoading ? 'light' : (isDark ? 'light' : 'dark')} />
        </ThemeProvider>
      </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppWithSplash />
    </AuthProvider>
  );
}
