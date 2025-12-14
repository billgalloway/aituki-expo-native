/**
 * OAuth Callback Handler
 * Handles OAuth redirects from Apple/Google sign-in
 */

import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/services/supabase';
import { Colors } from '@/constants/theme';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Handle email confirmation links (access_token and type)
      if (params?.access_token && params?.type === 'recovery') {
        // This is a password reset link, redirect to reset password screen
        router.replace({
          pathname: '/(auth)/reset-password',
          params: {
            access_token: params.access_token as string,
            refresh_token: params.refresh_token as string,
            type: params.type as string,
          },
        });
        return;
      }

      // Handle email confirmation (access_token without type or type=signup)
      if (params?.access_token && (params?.type === 'signup' || !params?.type)) {
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: params.access_token as string,
            refresh_token: params.refresh_token as string,
          });

          if (error) {
            console.error('Email confirmation error:', error);
            router.replace('/(auth)/login');
          } else if (data.session) {
            // Successfully confirmed email and logged in
            router.replace('/(tabs)');
          }
        } catch (error) {
          console.error('Session error:', error);
          router.replace('/(auth)/login');
        }
        return;
      }

      // Handle OAuth callback (code parameter)
      if (params?.code) {
        console.log('📞 OAuth callback received with code:', params.code);
        // Exchange code for session
        const { data, error } = await supabase.auth.exchangeCodeForSession(params.code as string);
        
        if (error) {
          console.error('❌ Auth callback error:', error);
          router.replace('/(auth)/login');
        } else if (data.session) {
          console.log('✅ OAuth authentication successful');
          // Successfully authenticated, navigate to main app
          router.replace('/(tabs)');
        } else {
          console.error('❌ No session after code exchange');
          router.replace('/(auth)/login');
        }
      } else {
        // Check for error parameter
        if (params?.error) {
          console.error('❌ OAuth callback error:', params.error);
        } else {
          console.log('⚠️ OAuth callback received without code parameter');
          console.log('⚠️ All params received:', JSON.stringify(params, null, 2));
        }
        // No valid parameters, redirect to login
        router.replace('/(auth)/login');
      }
    };

    handleAuthCallback();
  }, [params, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.light.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
});

