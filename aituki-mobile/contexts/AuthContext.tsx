import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

// Complete OAuth session when browser closes
WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  signInWithApple: () => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Navigate based on initial session
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session) {
        // User is logged in, navigate to main app
        router.replace('/(tabs)');
      } else {
        // User is logged out, navigate to auth
        router.replace('/(auth)/login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${Constants.expoConfig?.scheme || 'aitukinative'}://auth/callback`,
        },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${Constants.expoConfig?.scheme || 'aitukinative'}://auth/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithApple = async () => {
    try {
      const redirectUrl = `${Constants.expoConfig?.scheme || 'aitukinative'}://auth/callback`;
      console.log('🍎 Starting Apple Sign-In with redirect:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('❌ Apple OAuth error:', error);
        return { error, debugInfo: { step: 'init', error: error.message } };
      }

      if (!data?.url) {
        console.error('❌ No OAuth URL returned from Supabase');
        return { error: new Error('Failed to initiate Apple Sign-In. Please check Supabase configuration.'), debugInfo: { step: 'init', issue: 'No OAuth URL returned' } };
      }

      console.log('🌐 Opening OAuth URL:', data.url);
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      
      console.log('📱 OAuth result:', result.type);
      console.log('📱 OAuth result URL:', result.url);
      
      if (result.type === 'success' && result.url) {
        try {
          const url = new URL(result.url);
          console.log('🔍 Parsed callback URL:', url.href);
          console.log('🔍 URL search params:', Object.fromEntries(url.searchParams.entries()));
          
          const code = url.searchParams.get('code');
          const errorParam = url.searchParams.get('error');
          const accessToken = url.searchParams.get('access_token');
          const refreshToken = url.searchParams.get('refresh_token');
          
          // Check hash fragment too (sometimes OAuth puts params in hash)
          const hashParams = new URLSearchParams(url.hash.substring(1));
          const codeFromHash = hashParams.get('code');
          const errorFromHash = hashParams.get('error');
          const accessTokenFromHash = hashParams.get('access_token');
          const refreshTokenFromHash = hashParams.get('refresh_token');
          
          const debugInfo = {
            step: 'callback',
            callbackUrl: result.url,
            parsedUrl: url.href,
            pathname: url.pathname,
            search: url.search,
            hash: url.hash,
            queryParams: Object.fromEntries(url.searchParams.entries()),
            hashParams: Object.fromEntries(hashParams.entries()),
            foundCode: code || codeFromHash || 'NOT FOUND',
            foundError: errorParam || errorFromHash || 'none',
            foundTokens: !!(accessToken || accessTokenFromHash),
          };
          
          if (errorParam || errorFromHash) {
            console.error('❌ OAuth error in callback:', errorParam || errorFromHash);
            return { error: new Error(`Apple Sign-In error: ${errorParam || errorFromHash}`), debugInfo };
          }
          
          // Handle direct token response (sometimes OAuth returns tokens directly)
          const finalAccessToken = accessToken || accessTokenFromHash;
          const finalRefreshToken = refreshToken || refreshTokenFromHash;
          
          if (finalAccessToken && finalRefreshToken) {
            console.log('✅ Received tokens directly, setting session...');
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: finalAccessToken,
              refresh_token: finalRefreshToken,
            });
            
            if (sessionError) {
              console.error('❌ Session error:', sessionError);
              return { error: sessionError, debugInfo: { ...debugInfo, step: 'session_set', error: sessionError.message } };
            }
            
            if (sessionData.session) {
              console.log('✅ Apple Sign-In successful!');
              return { error: null };
            }
          }
          
          // Handle code exchange flow
          const finalCode = code || codeFromHash;
          if (finalCode) {
            console.log('✅ Received OAuth code, exchanging for session...');
            const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(finalCode);
            
            if (exchangeError) {
              console.error('❌ Code exchange error:', exchangeError);
              return { error: exchangeError, debugInfo: { ...debugInfo, step: 'code_exchange', error: exchangeError.message } };
            }
            
            if (sessionData.session) {
              console.log('✅ Apple Sign-In successful!');
              return { error: null };
            } else {
              console.error('❌ No session after code exchange');
              return { error: new Error('Failed to create session after Apple Sign-In'), debugInfo: { ...debugInfo, step: 'code_exchange', issue: 'No session returned' } };
            }
          } else {
            console.error('❌ No code in callback URL');
            return { error: new Error('Apple Sign-In callback missing authorization code'), debugInfo };
          }
        } catch (urlError) {
          console.error('❌ Error parsing callback URL:', urlError);
          return { 
            error: new Error('Failed to process Apple Sign-In callback'), 
            debugInfo: { 
              step: 'url_parse_error', 
              rawUrl: result.url, 
              error: (urlError as Error).message 
            } 
          };
        }
      } else if (result.type === 'cancel') {
        console.log('⚠️ User cancelled Apple Sign-In');
        return { error: new Error('Apple Sign-In was cancelled'), debugInfo: { step: 'user_cancelled', resultType: result.type } };
      } else {
        console.error('❌ OAuth failed or cancelled:', result.type);
        return { error: new Error('Apple Sign-In was cancelled or failed'), debugInfo: { step: 'oauth_failed', resultType: result.type } };
      }
    } catch (error) {
      console.error('❌ Apple Sign-In exception:', error);
      return { error: error as Error, debugInfo: { step: 'exception', error: (error as Error).message } };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const redirectUrl = `${Constants.expoConfig?.scheme || 'aitukinative'}://auth/callback`;
      console.log('🔵 Starting Google Sign-In with redirect:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('❌ Google OAuth error:', error);
        return { error, debugInfo: { step: 'init', error: error.message } };
      }

      if (!data?.url) {
        console.error('❌ No OAuth URL returned from Supabase');
        return { error: new Error('Failed to initiate Google Sign-In. Please check Supabase configuration.'), debugInfo: { step: 'init', issue: 'No OAuth URL returned' } };
      }

      console.log('🌐 Opening OAuth URL:', data.url);
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      
      console.log('📱 OAuth result:', result.type);
      console.log('📱 OAuth result URL:', result.url);
      
      if (result.type === 'success' && result.url) {
        try {
          const url = new URL(result.url);
          console.log('🔍 Parsed callback URL:', url.href);
          console.log('🔍 URL search params:', Object.fromEntries(url.searchParams.entries()));
          
          const code = url.searchParams.get('code');
          const errorParam = url.searchParams.get('error');
          const accessToken = url.searchParams.get('access_token');
          const refreshToken = url.searchParams.get('refresh_token');
          
          // Check hash fragment too (sometimes OAuth puts params in hash)
          const hashParams = new URLSearchParams(url.hash.substring(1));
          const codeFromHash = hashParams.get('code');
          const errorFromHash = hashParams.get('error');
          const accessTokenFromHash = hashParams.get('access_token');
          const refreshTokenFromHash = hashParams.get('refresh_token');
          
          const debugInfo = {
            step: 'callback',
            callbackUrl: result.url,
            parsedUrl: url.href,
            pathname: url.pathname,
            search: url.search,
            hash: url.hash,
            queryParams: Object.fromEntries(url.searchParams.entries()),
            hashParams: Object.fromEntries(hashParams.entries()),
            foundCode: code || codeFromHash || 'NOT FOUND',
            foundError: errorParam || errorFromHash || 'none',
            foundTokens: !!(accessToken || accessTokenFromHash),
          };
          
          if (errorParam || errorFromHash) {
            console.error('❌ OAuth error in callback:', errorParam || errorFromHash);
            return { error: new Error(`Google Sign-In error: ${errorParam || errorFromHash}`), debugInfo };
          }
          
          // Handle direct token response (sometimes OAuth returns tokens directly)
          const finalAccessToken = accessToken || accessTokenFromHash;
          const finalRefreshToken = refreshToken || refreshTokenFromHash;
          
          if (finalAccessToken && finalRefreshToken) {
            console.log('✅ Received tokens directly, setting session...');
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: finalAccessToken,
              refresh_token: finalRefreshToken,
            });
            
            if (sessionError) {
              console.error('❌ Session error:', sessionError);
              return { error: sessionError, debugInfo: { ...debugInfo, step: 'session_set', error: sessionError.message } };
            }
            
            if (sessionData.session) {
              console.log('✅ Google Sign-In successful!');
              return { error: null };
            }
          }
          
          // Handle code exchange flow
          const finalCode = code || codeFromHash;
          if (finalCode) {
            console.log('✅ Received OAuth code, exchanging for session...');
            const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(finalCode);
            
            if (exchangeError) {
              console.error('❌ Code exchange error:', exchangeError);
              return { error: exchangeError, debugInfo: { ...debugInfo, step: 'code_exchange', error: exchangeError.message } };
            }
            
            if (sessionData.session) {
              console.log('✅ Google Sign-In successful!');
              return { error: null };
            } else {
              console.error('❌ No session after code exchange');
              return { error: new Error('Failed to create session after Google Sign-In'), debugInfo: { ...debugInfo, step: 'code_exchange', issue: 'No session returned' } };
            }
          } else {
            console.error('❌ No code in callback URL');
            return { error: new Error('Google Sign-In callback missing authorization code'), debugInfo };
          }
        } catch (urlError) {
          console.error('❌ Error parsing callback URL:', urlError);
          return { 
            error: new Error('Failed to process Google Sign-In callback'), 
            debugInfo: { 
              step: 'url_parse_error', 
              rawUrl: result.url, 
              error: (urlError as Error).message 
            } 
          };
        }
      } else if (result.type === 'cancel') {
        console.log('⚠️ User cancelled Google Sign-In');
        return { error: new Error('Google Sign-In was cancelled'), debugInfo: { step: 'user_cancelled', resultType: result.type } };
      } else {
        console.error('❌ OAuth failed or cancelled:', result.type);
        return { error: new Error('Google Sign-In was cancelled or failed'), debugInfo: { step: 'oauth_failed', resultType: result.type } };
      }
    } catch (error) {
      console.error('❌ Google Sign-In exception:', error);
      return { error: error as Error, debugInfo: { step: 'exception', error: (error as Error).message } };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    resetPassword,
    signInWithApple,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

