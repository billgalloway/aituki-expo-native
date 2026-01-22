/**
 * Root Layout
 * Sets up React Native Paper theme provider and Auth context
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StatusBar as RNStatusBar, Platform } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { PaperThemeLight, PaperThemeDark, Colors } from '@/constants/theme';
import { AuthProvider } from '@/contexts/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const paperTheme = isDark ? PaperThemeDark : PaperThemeLight;
  const statusBarColor = isDark ? Colors.dark.statusBar : Colors.light.primary;
  const statusBarStyle = isDark ? 'light-content' : 'dark-content';

  return (
    <AuthProvider>
      <PaperProvider theme={paperTheme}>
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          {Platform.OS === 'android' && (
            <RNStatusBar backgroundColor={statusBarColor} barStyle={statusBarStyle} />
          )}
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="account-settings" options={{ headerShown: false }} />
            <Stack.Screen name="personal-details" options={{ headerShown: false }} />
            <Stack.Screen name="password-security" options={{ headerShown: false }} />
            <Stack.Screen name="data-privacy" options={{ headerShown: false }} />
            <Stack.Screen name="alerts-notifications" options={{ headerShown: false }} />
            <Stack.Screen name="update-name" options={{ headerShown: false }} />
            <Stack.Screen name="update-email" options={{ headerShown: false }} />
            <Stack.Screen name="update-mobile" options={{ headerShown: false }} />
            <Stack.Screen name="update-address" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <ExpoStatusBar style={isDark ? 'light' : 'dark'} />
        </ThemeProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
